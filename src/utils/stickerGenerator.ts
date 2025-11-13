// utils/stickerGenerator.ts
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import futurityLogo from '../assets/futurity_logo.png';

export interface StickerPrintOptions {
  template: 'apli10199' | 'averyL4732';
}

export interface StickerCardData {
  id: string;
  name: string;
}

interface StickerTemplateConfig {
  name: string;
  pageWidth: number;
  pageHeight: number;
  labelWidth: number;
  labelHeight: number;
  columns: number;
  rows: number;
  marginLeft: number;
  marginTop: number;
  horizontalPitch: number; // Distance between label starts (includes label + gap)
  verticalPitch: number; // Distance between label starts (includes label + gap)
  unit: 'mm';
}

const STICKER_TEMPLATES: Record<string, StickerTemplateConfig> = {
  apli10199: {
    name: 'Apli 10199',
    pageWidth: 210, // A4 portrait
    pageHeight: 297,
    labelWidth: 35.6,
    labelHeight: 16.9,
    columns: 5,
    rows: 16,
    marginLeft: 11,
    marginTop: 13,
    horizontalPitch: 38.1, // 35.6mm label + 2.5mm gap
    verticalPitch: 16.9, // No gap between rows
    unit: 'mm',
  },
  averyL4732: {
    name: 'Avery L4732',
    pageWidth: 210, // A4 portrait
    pageHeight: 297,
    labelWidth: 35.6,
    labelHeight: 16.9,
    columns: 5,
    rows: 16,
    marginLeft: 11,
    marginTop: 13,
    horizontalPitch: 38.1,
    verticalPitch: 16.9,
    unit: 'mm',
  },
};

// Load and cache the logo
let cachedLogoImage: HTMLImageElement | null = null;

async function loadLogo(): Promise<HTMLImageElement> {
  if (cachedLogoImage) {
    return cachedLogoImage;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedLogoImage = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = futurityLogo;
  });
}

async function generateQRCode(text: string, size: number): Promise<string> {
  try {
    // Generate QR code data with high error correction
    const qrData = await QRCode.create(text, {
      errorCorrectionLevel: 'H',
    });

    const modules = qrData.modules;
    const moduleCount = modules.size;
    const pixelSize = (size * 4) / moduleCount;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const qrSize = size * 4;
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, qrSize, qrSize);

    // Draw QR code with round dots
    ctx.fillStyle = 'black';

    // Helper function to check if module is part of position marker (finder pattern)
    const isPositionMarker = (row: number, col: number): boolean => {
      // Top-left position marker (7x7 area in top-left corner)
      if (row < 7 && col < 7) return true;
      // Top-right position marker
      if (row < 7 && col >= moduleCount - 7) return true;
      // Bottom-left position marker
      if (row >= moduleCount - 7 && col < 7) return true;
      return false;
    };

    // Draw QR modules
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (modules.get(row, col)) {
          const x = col * pixelSize;
          const y = row * pixelSize;

          if (isPositionMarker(row, col)) {
            // Draw squares for position markers (registration marks)
            ctx.fillRect(x, y, pixelSize, pixelSize);
          } else {
            // Draw circles for data modules
            ctx.beginPath();
            ctx.arc(
              x + pixelSize / 2,
              y + pixelSize / 2,
              pixelSize / 2,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }
      }
    }

    // Load and draw logo in center with hexagon background
    try {
      const logo = await loadLogo();

      const logoSize = qrSize * 0.22;
      const logoX = (qrSize - logoSize) / 2;
      const logoY = (qrSize - logoSize) / 2;

      // Hexagon should be slightly bigger than logo
      const hexRadius = (logoSize / 2) * 1.15; // 15% larger than logo
      const centerX = qrSize / 2;
      const centerY = qrSize / 2;

      // Draw white hexagon background for logo (rotated 90 degrees - pointy top/bottom)
      ctx.fillStyle = 'white';
      ctx.beginPath();

      // Draw hexagon with 6 vertices, starting at top (90 degrees)
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 2 + (i * Math.PI) / 3; // Start at 90°, increment by 60°
        const x = centerX + hexRadius * Math.cos(angle);
        const y = centerY + hexRadius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.fill();

      // Draw logo
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    } catch (logoError) {
      console.warn('Could not load logo, using plain QR code:', logoError);
    }

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

function splitTextIntoLines(
  pdf: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  pdf.setFontSize(fontSize);
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const width = pdf.getTextWidth(testLine);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function drawSticker(
  pdf: jsPDF,
  card: StickerCardData,
  x: number,
  y: number,
  template: StickerTemplateConfig
) {
  const padding = 1; // mm - smaller padding for tiny stickers
  const contentX = x + padding;
  const contentY = y + padding;
  const contentWidth = template.labelWidth - padding * 2;
  const contentHeight = template.labelHeight - padding * 2;

  // QR Code size - make it fill most of the height
  const qrSize = Math.min(contentHeight * 0.9, contentWidth * 0.45);

  // Draw sticker border for debugging (optional, remove in production)
  // pdf.setDrawColor(200, 200, 200);
  // pdf.rect(x, y, template.labelWidth, template.labelHeight);

  // 1. Card Name (bold, small font to fit in tiny space)
  const maxTitleWidth = contentWidth - qrSize - 2; // Leave space for QR + gap

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6); // Very small font for tiny stickers

  const nameLines = splitTextIntoLines(pdf, card.name, maxTitleWidth, 6);
  const displayNameLines = nameLines.slice(0, 3); // Max 3 lines for tiny sticker

  // Center the text vertically in the available space
  const lineHeight = 2.2;
  const totalTextHeight = displayNameLines.length * lineHeight;
  const textStartY = contentY + (contentHeight - totalTextHeight) / 2;

  displayNameLines.forEach((line, idx) => {
    pdf.text(line, contentX, textStartY + idx * lineHeight);
  });

  // 2. QR code (right side, vertically centered)
  const qrX = x + template.labelWidth - padding - qrSize;
  const qrY = y + (template.labelHeight - qrSize) / 2;
  const qrUrl = `https://fs.cards/a/${card.id}`;
  const qrDataUrl = await generateQRCode(qrUrl, Math.floor(qrSize * 10));

  if (qrDataUrl) {
    pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
  }
}

export function getStickersPerPage(template: string): number {
  const templateConfig = STICKER_TEMPLATES[template];
  if (!templateConfig) return 80;
  return templateConfig.columns * templateConfig.rows;
}

export function calculateStickerBatches(
  totalStickers: number,
  template: string,
  pagesPerBatch: number = 20
): {
  batchCount: number;
  stickersPerBatch: number;
  batches: { start: number; end: number; pages: number }[];
} {
  const stickersPerPage = getStickersPerPage(template);
  const stickersPerBatch = stickersPerPage * pagesPerBatch;
  const batchCount = Math.ceil(totalStickers / stickersPerBatch);

  const batches: { start: number; end: number; pages: number }[] = [];

  for (let i = 0; i < batchCount; i++) {
    const start = i * stickersPerBatch;
    const end = Math.min(start + stickersPerBatch, totalStickers);
    const pages = Math.ceil((end - start) / stickersPerPage);
    batches.push({ start, end, pages });
  }

  return { batchCount, stickersPerBatch, batches };
}

export async function generateStickersPDF(
  cards: StickerCardData[],
  options: StickerPrintOptions,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const template = STICKER_TEMPLATES[options.template];

  if (!template) {
    throw new Error(`Unknown sticker template: ${options.template}`);
  }

  // For small numbers of stickers, generate directly
  const stickersPerPage = template.columns * template.rows;
  const totalPages = Math.ceil(cards.length / stickersPerPage);

  if (totalPages <= 20) {
    await generateSingleStickerPDF(cards, template, options, 1, 1);
    if (onProgress) onProgress(1, 1);
    return;
  }

  // For large numbers, generate in batches of 20 pages
  const { batches } = calculateStickerBatches(
    cards.length,
    options.template,
    20
  );

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchCards = cards.slice(batch.start, batch.end);

    if (onProgress) {
      onProgress(i + 1, batches.length);
    }

    await generateSingleStickerPDF(
      batchCards,
      template,
      options,
      i + 1,
      batches.length
    );

    // Small delay between batches to let browser breathe
    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  if (onProgress) {
    onProgress(batches.length, batches.length);
  }
}

async function generateSingleStickerPDF(
  cards: StickerCardData[],
  template: StickerTemplateConfig,
  options: StickerPrintOptions,
  batchNumber: number,
  totalBatches: number
): Promise<void> {
  // Create PDF in portrait orientation for stickers
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [template.pageWidth, template.pageHeight],
  });

  let cardIndex = 0;

  while (cardIndex < cards.length) {
    if (cardIndex > 0) {
      pdf.addPage();
    }

    // Draw stickers for this page
    for (let row = 0; row < template.rows && cardIndex < cards.length; row++) {
      for (
        let col = 0;
        col < template.columns && cardIndex < cards.length;
        col++
      ) {
        const x = template.marginLeft + col * template.horizontalPitch;
        const y = template.marginTop + row * template.verticalPitch;

        await drawSticker(pdf, cards[cardIndex], x, y, template);
        cardIndex++;
      }
    }
  }

  // Download the PDF with batch number in filename
  const batchSuffix =
    totalBatches > 1 ? `-batch${batchNumber}of${totalBatches}` : '';
  const fileName = `fs-stickers-${
    options.template
  }${batchSuffix}-${new Date().getTime()}.pdf`;
  pdf.save(fileName);
}
