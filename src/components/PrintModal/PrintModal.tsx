// components/PrintModal/PrintModal.tsx
import React, { useState, useMemo } from 'react';
import { calculateBatches, getCardsPerPage } from '../../utils/pdfGenerator';
import {
  getStickersPerPage,
  calculateStickerBatches,
} from '../../utils/stickerGenerator';

export interface PrintOptions {
  printType: 'cards' | 'stickers';
  template:
    | 'avery5371'
    | 'avery8371'
    | 'avery5376'
    | 'apli10609'
    | 'apli10608'
    | 'apli10199'
    | 'averyL4732';
  includeCategory: boolean;
  includeSummary: boolean;
}

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (
    options: PrintOptions,
    onProgress?: (current: number, total: number) => void
  ) => Promise<void>;
  cardCount: number;
}

const CARD_TEMPLATE_OPTIONS = [
  {
    value: 'avery5371',
    label: 'Avery 5371 - 2" × 3.5" (10 cards/sheet)',
    description: 'US Letter, microperforated',
  },
  {
    value: 'avery8371',
    label: 'Avery 8371 - 2" × 3.5" (10 cards/sheet)',
    description: 'US Letter, microperforated',
  },
  {
    value: 'avery5376',
    label: 'Avery 5376 - 2.33" × 3.375" (8 cards/sheet)',
    description: 'US Letter, microperforated',
  },
  {
    value: 'apli10609',
    label: 'Apli 10609 - 89 × 51mm (10 cards/sheet)',
    description: 'A4, microperforated',
  },
  {
    value: 'apli10608',
    label: 'Apli 10608 - 90 × 50.8mm (10 cards/sheet)',
    description: 'A4, microperforated',
  },
];

const STICKER_TEMPLATE_OPTIONS = [
  {
    value: 'apli10199',
    label: 'Apli 10199 - 35.6 × 16.9mm (80 stickers/sheet)',
    description: 'A4, removable adhesive',
  },
  {
    value: 'averyL4732',
    label: 'Avery L4732 - 35.6 × 16.9mm (80 stickers/sheet)',
    description: 'A4, removable adhesive',
  },
];

const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  cardCount,
}) => {
  const [printType, setPrintType] = useState<'cards' | 'stickers'>('cards');
  const [selectedTemplate, setSelectedTemplate] =
    useState<PrintOptions['template']>('avery5371');
  const [includeCategory, setIncludeCategory] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update template when print type changes
  React.useEffect(() => {
    if (printType === 'cards') {
      setSelectedTemplate('avery5371');
    } else {
      setSelectedTemplate('apli10199');
    }
  }, [printType]);

  const TEMPLATE_OPTIONS =
    printType === 'cards' ? CARD_TEMPLATE_OPTIONS : STICKER_TEMPLATE_OPTIONS;

  const batchInfo = useMemo(() => {
    if (printType === 'cards') {
      return calculateBatches(cardCount, selectedTemplate, 10);
    } else {
      return calculateStickerBatches(cardCount, selectedTemplate, 10);
    }
  }, [cardCount, selectedTemplate, printType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setCurrentBatch(0);
    setTotalBatches(0);
    onClose();
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    setCurrentBatch(0);
    setTotalBatches(batchInfo.batchCount);
    setIsSuccess(false);

    try {
      await onPrint(
        {
          printType,
          template: selectedTemplate,
          includeCategory,
          includeSummary,
        },
        (current, total) => {
          setCurrentBatch(current);
          setTotalBatches(total);
        }
      );
      // Success! Show success state
      setIsSuccess(true);
    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to generate PDFs. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplateInfo = TEMPLATE_OPTIONS.find(
    (t) => t.value === selectedTemplate
  );
  const cardsPerSheet =
    printType === 'cards'
      ? getCardsPerPage(selectedTemplate)
      : getStickersPerPage(selectedTemplate);
  const sheetsNeeded = Math.ceil(cardCount / cardsPerSheet);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Print {printType === 'cards' ? 'Cards' : 'Stickers'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A7ACB2',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Print Type Selection */}
        {!isSuccess && (
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '8px',
              }}
            >
              Print Type
            </label>
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setPrintType('cards')}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  padding: '12px',
                  background:
                    printType === 'cards'
                      ? 'linear-gradient(145deg, #8285FF, #0005E9)'
                      : 'rgba(26, 26, 26, 0.8)',
                  border:
                    printType === 'cards'
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: printType === 'cards' ? 'bold' : 'normal',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                Full Cards
                <div
                  style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    opacity: 0.8,
                  }}
                >
                  Title, Category, Summary & QR
                </div>
              </button>
              <button
                onClick={() => setPrintType('stickers')}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  padding: '12px',
                  background:
                    printType === 'stickers'
                      ? 'linear-gradient(145deg, #8285FF, #0005E9)'
                      : 'rgba(26, 26, 26, 0.8)',
                  border:
                    printType === 'stickers'
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: printType === 'stickers' ? 'bold' : 'normal',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                Mini Stickers
                <div
                  style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    opacity: 0.8,
                  }}
                >
                  Title & QR Only
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Card Count Info */}
        <div
          style={{
            padding: '16px',
            background: 'rgba(130, 133, 255, 0.1)',
            border: '1px solid rgba(130, 133, 255, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#8285FF',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            <strong>{cardCount}</strong> card{cardCount !== 1 ? 's' : ''} to
            print
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#A7ACB2',
              margin: 0,
            }}
          >
            This will use approximately <strong>{sheetsNeeded}</strong> sheet
            {sheetsNeeded !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Batch Warning for Large Decks */}
        {batchInfo.batchCount > 1 && (
          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#FFC107',
                margin: 0,
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              ⚠️ Large Deck - Batch Processing
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#A7ACB2',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              Your deck will be split into{' '}
              <strong>{batchInfo.batchCount}</strong> separate PDF files (up to{' '}
              {'cardsPerBatch' in batchInfo ? batchInfo.cardsPerBatch : batchInfo.stickersPerBatch} {printType === 'cards' ? 'cards' : 'stickers'} each) to prevent browser crashes.
              Each file will download automatically.
            </p>
          </div>
        )}

        {/* Progress Display */}
        {isGenerating && totalBatches > 1 && (
          <div
            style={{
              padding: '16px',
              background: 'rgba(130, 133, 255, 0.05)',
              border: '1px solid rgba(130, 133, 255, 0.2)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#8285FF',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              Generating batch {currentBatch} of {totalBatches}...
            </p>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(130, 133, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(currentBatch / totalBatches) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #8285FF, #0005E9)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div
            style={{
              padding: '24px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              ✓
            </div>
            <p
              style={{
                fontSize: '18px',
                color: '#22C55E',
                margin: 0,
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              PDFs Generated Successfully!
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#A7ACB2',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              {totalBatches > 1
                ? `All ${totalBatches} PDF files have been downloaded to your computer.`
                : 'Your PDF has been downloaded to your computer.'}
            </p>
          </div>
        )}

        {/* Template Selection - Hide when success */}
        {!isSuccess && (
          <>
            {/* Template Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}
              >
                {printType === 'cards' ? 'Card' : 'Sticker'} Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) =>
                  setSelectedTemplate(
                    e.target.value as PrintOptions['template']
                  )
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(26, 26, 26, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {TEMPLATE_OPTIONS.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
              {selectedTemplateInfo && (
                <p
                  style={{
                    fontSize: '12px',
                    color: '#A7ACB2',
                    marginTop: '8px',
                    marginBottom: 0,
                  }}
                >
                  {selectedTemplateInfo.description}
                </p>
              )}
            </div>

            {/* Field Options - Only for cards */}
            {printType === 'cards' && (
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    marginBottom: '12px',
                  }}
                >
                  Include on Cards
                </label>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={includeCategory}
                      onChange={(e) => setIncludeCategory(e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                      }}
                    />
                    <span>Category</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={includeSummary}
                      onChange={(e) => setIncludeSummary(e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                      }}
                    />
                    <span>Summary</span>
                  </label>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(130, 133, 255, 0.05)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#A7ACB2',
                    }}
                  >
                    <strong style={{ color: '#8285FF' }}>Note:</strong> QR codes
                    are always included and link to fs.cards/a/[card-id]
                  </div>
                </div>
              </div>
            )}

            {/* Info note for stickers */}
            {printType === 'stickers' && (
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(130, 133, 255, 0.05)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#A7ACB2',
                  marginBottom: '24px',
                }}
              >
                <strong style={{ color: '#8285FF' }}>Note:</strong> Stickers
                include card title and QR code only. QR codes link to
                fs.cards/a/[card-id]
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          {!isSuccess ? (
            <>
              <button
                onClick={handleClose}
                disabled={isGenerating}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(26, 26, 26, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                disabled={isGenerating}
                style={{
                  padding: '12px 24px',
                  background: isGenerating
                    ? 'rgba(130, 133, 255, 0.5)'
                    : 'linear-gradient(145deg, #8285FF, #0005E9)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(145deg, #22C55E, #16A34A)',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
