// components/PrintModal/PrintModal.tsx
import React, { useState } from 'react';

export interface PrintOptions {
  template: 'avery5371' | 'avery8371' | 'avery5376' | 'apli10609' | 'apli11744';
  includeCategory: boolean;
  includeSummary: boolean;
}

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (options: PrintOptions) => Promise<void>;
  cardCount: number;
}

const TEMPLATE_OPTIONS = [
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
    value: 'apli11744',
    label: 'Apli 11744 - 90 × 50.8mm (10 cards/sheet)',
    description: 'A4, microperforated',
  },
];

const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  cardCount,
}) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<PrintOptions['template']>('avery5371');
  const [includeCategory, setIncludeCategory] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      await onPrint({
        template: selectedTemplate,
        includeCategory,
        includeSummary,
      });
    } catch (error) {
      console.error('Print failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplateInfo = TEMPLATE_OPTIONS.find(
    (t) => t.value === selectedTemplate
  );
  const cardsPerSheet = selectedTemplate === 'avery5376' ? 8 : 10;
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
      onClick={onClose}
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
            Print Cards
          </h2>
          <button
            onClick={onClose}
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
            Card Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) =>
              setSelectedTemplate(e.target.value as PrintOptions['template'])
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

        {/* Field Options */}
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
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
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
              <strong style={{ color: '#8285FF' }}>Note:</strong> QR codes are
              always included and link to fs.cards/a/[card-id]
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
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
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
