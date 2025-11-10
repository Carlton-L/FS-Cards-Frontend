// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import futurityLogo from '../assets/futurity_logo.png';

export interface PrintOptions {
  template: 'avery5371' | 'avery8371' | 'avery5376' | 'apli10609' | 'apli11744';
  includeCategory: boolean;
  includeSummary: boolean;
}

export interface CardData {
  id: string;
  name: string;
  category: string;
  summary: string;
}

interface TemplateConfig {
  name: string;
  pageWidth: number;
  pageHeight: number;
  cardWidth: number;
  cardHeight: number;
  columns: number;
  rows: number;
  marginLeft: number;
  marginTop: number;
  unit: 'in' | 'mm';
}

const TEMPLATES: Record<string, TemplateConfig> = {
  avery5371: {
    name: 'Avery 5371',
    pageWidth: 279.4, // 11" in mm
    pageHeight: 215.9, // 8.5" in mm
    cardWidth: 50.8, // 2" in mm
    cardHeight: 88.9, // 3.5" in mm
    columns: 5,
    rows: 2,
    marginLeft: 19.05, // 0.75" in mm
    marginTop: 12.7, // 0.5" in mm
    unit: 'mm',
  },
  avery8371: {
    name: 'Avery 8371',
    pageWidth: 279.4,
    pageHeight: 215.9,
    cardWidth: 50.8,
    cardHeight: 88.9,
    columns: 5,
    rows: 2,
    marginLeft: 19.05,
    marginTop: 12.7,
    unit: 'mm',
  },
  avery5376: {
    name: 'Avery 5376',
    pageWidth: 279.4,
    pageHeight: 215.9,
    cardWidth: 59.18, // 2.33" in mm
    cardHeight: 85.73, // 3.375" in mm
    columns: 4,
    rows: 2,
    marginLeft: 21.2, // calculated: (279.4 - 4*59.18)/2
    marginTop: 15.87, // calculated: (215.9 - 2*85.73)/2
    unit: 'mm',
  },
  apli10609: {
    name: 'Apli 10609',
    pageWidth: 297,
    pageHeight: 210,
    cardWidth: 51,
    cardHeight: 89,
    columns: 5,
    rows: 2,
    marginLeft: 21,
    marginTop: 16,
    unit: 'mm',
  },
  apli11744: {
    name: 'Apli 11744',
    pageWidth: 297,
    pageHeight: 210,
    cardWidth: 50.8,
    cardHeight: 90,
    columns: 5,
    rows: 2,
    marginLeft: 21.5,
    marginTop: 15,
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

async function drawCard(
  pdf: jsPDF,
  card: CardData,
  x: number,
  y: number,
  template: TemplateConfig,
  options: PrintOptions
) {
  const padding = 3; // mm
  const contentX = x + padding;
  const contentY = y + padding;
  const contentWidth = template.cardWidth - padding * 2;
  const contentHeight = template.cardHeight - padding * 2;

  // QR Code size (50% of card width)
  const qrSize = template.cardWidth * 0.5;

  // Draw card border (for debugging - remove in production or make it very light)
  // pdf.setDrawColor(200, 200, 200);
  // pdf.rect(x, y, template.cardWidth, template.cardHeight);

  let currentY = contentY;

  // 1. Card Name (bold, 14pt, max 2 lines)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  const nameLines = splitTextIntoLines(pdf, card.name, contentWidth, 14);
  const displayNameLines = nameLines.slice(0, 2); // Max 2 lines

  displayNameLines.forEach((line, idx) => {
    pdf.text(line, contentX, currentY + idx * 5);
  });
  currentY += displayNameLines.length * 5 + 1;

  // 2. Category (optional, 8pt, uppercase)
  if (options.includeCategory && card.category) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(card.category.toUpperCase(), contentX, currentY);
    pdf.setTextColor(0, 0, 0);
    currentY += 4;
  }

  // 3. Summary (optional, 7pt, fills available space)
  if (options.includeSummary && card.summary) {
    // Calculate available height for summary
    const qrAndMargin = qrSize + 2; // QR size + margin
    const availableHeight = contentHeight - (currentY - contentY) - qrAndMargin;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7); // Reduced from 9 to 7
    pdf.setTextColor(50, 50, 50);

    const summaryLines = splitTextIntoLines(pdf, card.summary, contentWidth, 7);
    const lineSpacing = 2.5; // Reduced from 3.5 to 2.5
    const maxLines = Math.floor(availableHeight / lineSpacing);
    const displaySummaryLines = summaryLines.slice(0, maxLines);

    displaySummaryLines.forEach((line, idx) => {
      if (currentY + idx * lineSpacing < y + contentHeight - qrAndMargin) {
        pdf.text(line, contentX, currentY + idx * lineSpacing);
      }
    });

    currentY = y + contentHeight - qrAndMargin;
    pdf.setTextColor(0, 0, 0);
  } else {
    currentY = y + contentHeight - (qrSize + 2);
  }

  // 4. QR code (bottom right, 50% of card width)
  const bottomY = y + template.cardHeight - padding - qrSize;
  const qrUrl = `https://fs.cards/a/${card.id}`;
  const qrDataUrl = await generateQRCode(qrUrl, Math.floor(qrSize * 10));

  if (qrDataUrl) {
    const qrX = x + template.cardWidth - padding - qrSize;
    pdf.addImage(qrDataUrl, 'PNG', qrX, bottomY, qrSize, qrSize);
  }
}

export function getCardsPerPage(template: string): number {
  const templateConfig = TEMPLATES[template];
  if (!templateConfig) return 10;
  return templateConfig.columns * templateConfig.rows;
}

export function calculateBatches(
  totalCards: number,
  template: string,
  pagesPerBatch: number = 20
): {
  batchCount: number;
  cardsPerBatch: number;
  batches: { start: number; end: number; pages: number }[];
} {
  const cardsPerPage = getCardsPerPage(template);
  const cardsPerBatch = cardsPerPage * pagesPerBatch;
  const batchCount = Math.ceil(totalCards / cardsPerBatch);

  const batches: { start: number; end: number; pages: number }[] = [];

  for (let i = 0; i < batchCount; i++) {
    const start = i * cardsPerBatch;
    const end = Math.min(start + cardsPerBatch, totalCards);
    const pages = Math.ceil((end - start) / cardsPerPage);
    batches.push({ start, end, pages });
  }

  return { batchCount, cardsPerBatch, batches };
}

export async function generateCardsPDF(
  cards: CardData[],
  options: PrintOptions,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const template = TEMPLATES[options.template];

  if (!template) {
    throw new Error(`Unknown template: ${options.template}`);
  }

  // For small numbers of cards, generate directly
  const cardsPerPage = template.columns * template.rows;
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  if (totalPages <= 20) {
    await generateSinglePDF(cards, template, options, 1, 1);
    if (onProgress) onProgress(1, 1);
    return;
  }

  // For large numbers, generate in batches of 10 pages
  const { batches } = calculateBatches(cards.length, options.template, 10);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchCards = cards.slice(batch.start, batch.end);

    if (onProgress) {
      onProgress(i + 1, batches.length);
    }

    await generateSinglePDF(
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

async function generateSinglePDF(
  cards: CardData[],
  template: TemplateConfig,
  options: PrintOptions,
  batchNumber: number,
  totalBatches: number
): Promise<void> {
  // Create PDF in landscape orientation
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [template.pageHeight, template.pageWidth],
  });

  let cardIndex = 0;

  while (cardIndex < cards.length) {
    if (cardIndex > 0) {
      pdf.addPage();
    }

    // Draw cards for this page
    for (let row = 0; row < template.rows && cardIndex < cards.length; row++) {
      for (
        let col = 0;
        col < template.columns && cardIndex < cards.length;
        col++
      ) {
        const x = template.marginLeft + col * template.cardWidth;
        const y = template.marginTop + row * template.cardHeight;

        await drawCard(pdf, cards[cardIndex], x, y, template, options);
        cardIndex++;
      }
    }
  }

  // Download the PDF with batch number in filename
  const batchSuffix =
    totalBatches > 1 ? `-batch${batchNumber}of${totalBatches}` : '';
  const fileName = `fs-cards-${
    options.template
  }${batchSuffix}-${new Date().getTime()}.pdf`;
  pdf.save(fileName);
}
