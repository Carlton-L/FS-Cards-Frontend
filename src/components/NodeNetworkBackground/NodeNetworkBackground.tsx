import { useRef, useEffect } from 'react';

// Custom Node class to avoid DOM Node conflict
class NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalVx: number;
  originalVy: number;
  pulseProgress: number;
  pulseDirection: number; // 1 for growing, -1 for shrinking, 0 for idle
  nextPulseTime: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.originalVx = this.vx;
    this.originalVy = this.vy;

    // Pulse properties
    this.pulseProgress = 0; // 0 to 1, where 1 is fully scaled up
    this.pulseDirection = 0; // 0 = idle, 1 = growing, -1 = shrinking
    this.nextPulseTime = Date.now() + Math.random() * 10000 + 3000; // Random delay 3-13 seconds
  }

  update(
    canvasWidth: number,
    canvasHeight: number,
    mouseX: number | null,
    mouseY: number | null,
    mouseRadius: number
  ) {
    // Handle pulsing
    const currentTime = Date.now();

    if (this.pulseDirection === 0 && currentTime >= this.nextPulseTime) {
      // Start pulsing (growing)
      this.pulseDirection = 1;
    }

    if (this.pulseDirection !== 0) {
      // Update pulse progress (takes about 1 second each way)
      const pulseSpeed = 0.016; // ~1 second to go from 0 to 1
      this.pulseProgress += this.pulseDirection * pulseSpeed;

      if (this.pulseProgress >= 1) {
        // Switch to shrinking
        this.pulseProgress = 1;
        this.pulseDirection = -1;
      } else if (this.pulseProgress <= 0) {
        // Pulse complete, go idle
        this.pulseProgress = 0;
        this.pulseDirection = 0;
        this.nextPulseTime = currentTime + Math.random() * 15000 + 5000; // Next pulse in 5-20 seconds
      }
    }

    // Mouse interaction
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 0.02;
        this.vy += Math.sin(angle) * force * 0.02;

        // Apply some attraction when very close
        if (distance < mouseRadius * 0.3) {
          this.vx -= Math.cos(angle) * force * 0.01;
          this.vy -= Math.sin(angle) * force * 0.01;
        }
      }
    }

    // Gradually return to original velocity
    this.vx += (this.originalVx - this.vx) * 0.01;
    this.vy += (this.originalVy - this.vy) * 0.01;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    mouseX: number | null,
    mouseY: number | null,
    mouseRadius: number
  ) {
    // Calculate scale based on pulse progress
    const baseScale = 2; // Base node size
    const maxScale = 4; // Maximum scale during pulse
    const currentScale =
      baseScale + this.pulseProgress * (maxScale - baseScale);

    // Draw main node
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentScale, 0, Math.PI * 2);
    ctx.fillStyle = '#64ffda';
    ctx.fill();

    // Add glow effect during pulse
    if (this.pulseProgress > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentScale + 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${0.3 * this.pulseProgress})`;
      ctx.fill();
    }

    // Add mouse glow effect with brand color
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius) {
        const intensity = 1 - distance / mouseRadius;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentScale + intensity * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 5, 233, ${intensity * 0.4})`; // Brand color glow
        ctx.fill();
      }
    }
  }
}

const NodeNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<NetworkNode[]>([]);
  const mouseRef = useRef<{
    x: number | null;
    y: number | null;
    radius: number;
  }>({
    x: null,
    y: null,
    radius: 120,
  });

  // Function to get responsive node count based on screen size
  const getNodeCount = (width: number): number => {
    if (width < 560) {
      return 60; // Small screens - fewer nodes for performance
    } else if (width < 1024) {
      return 120; // Medium screens
    } else if (width < 1460) {
      return 180; // Large screens
    } else {
      return 240; // Extra large screens
    }
  };

  // Function to get responsive connection distance
  const getMaxDistance = (width: number): number => {
    if (width < 560) {
      return 100;
    } else if (width < 1024) {
      return 120;
    } else if (width < 1460) {
      return 130;
    } else {
      return 140;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    // eslint-disable-next-line prefer-const
    let config = {
      nodeCount: 120,
      maxDistance: 120,
      connectionOpacity: 0.1,
    };

    // Resize canvas
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update configuration based on screen size
      config.nodeCount = getNodeCount(canvas.width);
      config.maxDistance = getMaxDistance(canvas.width);

      // Reinitialize nodes after resize
      nodesRef.current = [];
      for (let i = 0; i < config.nodeCount; i++) {
        nodesRef.current.push(new NetworkNode(canvas.width, canvas.height));
      }
    };

    // Connection drawing
    const drawConnections = () => {
      if (!ctx) return;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const dx = nodesRef.current[i].x - nodesRef.current[j].x;
          const dy = nodesRef.current[i].y - nodesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.maxDistance) {
            const opacity =
              (1 - distance / config.maxDistance) * config.connectionOpacity;

            // Check if connection is near mouse
            let isNearMouse = false;
            let mouseInfluenceStrength = 0;

            if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
              const distToMouse1 = Math.sqrt(
                (nodesRef.current[i].x - mouseRef.current.x) ** 2 +
                  (nodesRef.current[i].y - mouseRef.current.y) ** 2
              );
              const distToMouse2 = Math.sqrt(
                (nodesRef.current[j].x - mouseRef.current.x) ** 2 +
                  (nodesRef.current[j].y - mouseRef.current.y) ** 2
              );

              if (
                distToMouse1 < mouseRef.current.radius ||
                distToMouse2 < mouseRef.current.radius
              ) {
                isNearMouse = true;
                mouseInfluenceStrength = Math.max(
                  1 - distToMouse1 / mouseRef.current.radius,
                  1 - distToMouse2 / mouseRef.current.radius
                );
              }
            }

            ctx.beginPath();
            ctx.moveTo(nodesRef.current[i].x, nodesRef.current[i].y);
            ctx.lineTo(nodesRef.current[j].x, nodesRef.current[j].y);

            if (isNearMouse) {
              const enhancedOpacity = opacity + mouseInfluenceStrength * 0.6;
              ctx.strokeStyle = `rgba(0, 5, 233, ${enhancedOpacity})`; // Brand color
              ctx.lineWidth = 1 + mouseInfluenceStrength * 0.5;
            } else {
              ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
              ctx.lineWidth = 0.3;
            }

            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(17, 17, 17, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections first (behind nodes)
      drawConnections();

      // Update and draw nodes
      nodesRef.current.forEach((node) => {
        node.update(
          canvas.width,
          canvas.height,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.radius
        );
        node.draw(
          ctx,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.radius
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Initialize
    resizeCanvas();

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background:
          'radial-gradient(ellipse at center, #1a1a2e 0%, #111111 70%)',
        pointerEvents: 'none',
      }}
    />
  );
};

export default NodeNetworkBackground;
