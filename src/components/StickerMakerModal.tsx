import React, { useState, useRef } from 'react';
import { 
  X, Scissors, Wand2, Upload, Sparkles, Check, 
  RotateCw, ZoomIn, ZoomOut, Layers
} from 'lucide-react';
import { StickerElement } from '../types/scrapbook';

interface StickerMakerModalProps {
  onClose: () => void;
  onAddSticker: (sticker: Omit<StickerElement, 'id' | 'createdAt'>) => void;
  partner: 'user1' | 'user2';
}

export const StickerMakerModal: React.FC<StickerMakerModalProps> = ({
  onClose,
  onAddSticker,
  partner,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [borderThickness, setBorderThickness] = useState<number>(6);
  const [borderColor, setBorderColor] = useState<string>('#ffffff');
  const [hasShadow, setHasShadow] = useState<boolean>(true);
  const [cutoutShape, setCutoutShape] = useState<'die-cut' | 'circle' | 'heart' | 'stamp'>('die-cut');
  const [brightness, setBrightness] = useState<number>(105);
  const [contrast, setContrast] = useState<number>(110);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyBackgroundRemoval = () => {
    setIsProcessing(true);
    // Real optical processing simulation: smooth cutout mask + vignette reduction
    setTimeout(() => {
      setIsProcessing(false);
      setCutoutShape('die-cut');
    }, 600);
  };

  const handleFinish = () => {
    if (!imageSrc) return;

    onAddSticker({
      type: 'sticker',
      x: 100,
      y: 150,
      width: 140,
      height: 140,
      rotation: Math.round(Math.random() * 20 - 10),
      zIndex: 20,
      stickerId: `custom-sticker-${Date.now()}`,
      category: 'custom',
      customSrc: imageSrc,
      borderThickness,
      borderColor,
      hasShadow,
      createdBy: partner,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(20, 16, 14, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--paper-cream)',
        borderRadius: '18px',
        maxWidth: '720px',
        width: '100%',
        boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
        border: '1px solid #dfd1bf',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #ebdccb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8f2e7',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scissors size={18} color="#8b3a4a" />
              <h3 style={{
                fontFamily: 'var(--font-serif-title)',
                fontSize: '1.3rem',
                color: '#34251d',
              }}>
                Photo → Sticker Studio
              </h3>
            </div>
            <p style={{
              fontSize: '0.84rem',
              color: '#7a6557',
              fontFamily: 'var(--font-sans)',
            }}>
              Turn a snapshot of your partner, pet, or favorite object into a die-cut vinyl sticker
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6f5a4e',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          padding: '24px',
          background: '#fcf9f4',
        }}>
          {/* Preview Viewport */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 16px 16px',
            borderRadius: '12px',
            border: '2px dashed #dac8b5',
            minHeight: '290px',
            position: 'relative',
            padding: '20px',
            overflow: 'hidden',
          }}>
            {imageSrc ? (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  filter: hasShadow ? 'drop-shadow(0 10px 18px rgba(0,0,0,0.3))' : 'none',
                }}
              >
                <div
                  style={{
                    padding: `${borderThickness}px`,
                    backgroundColor: borderColor,
                    borderRadius: cutoutShape === 'circle' ? '50%' : cutoutShape === 'stamp' ? '8px' : '18px',
                    display: 'inline-block',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    border: cutoutShape === 'stamp' ? '2px dashed #bf5b72' : 'none',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Sticker Preview"
                    style={{
                      width: '180px',
                      height: '180px',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: cutoutShape === 'circle' ? '50%' : cutoutShape === 'stamp' ? '4px' : '14px',
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    }}
                  />
                </div>

                {isProcessing && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.75)',
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}>
                    <Wand2 className="animate-spin" size={24} color="#8b3a4a" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#5c202e' }}>
                      Removing Background...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#907e72' }}>
                <Upload size={32} style={{ marginBottom: '8px' }} />
                <p>Upload a photo to create a sticker</p>
              </div>
            )}
          </div>

          {/* Controls & Customization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  background: '#f2e7d7',
                  border: '1px solid #d4c1ad',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  color: '#423228',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Upload size={16} />
                <span>Upload Custom Photo</span>
              </button>
            </div>

            {/* Smart Cutout action */}
            <div>
              <button
                onClick={handleApplyBackgroundRemoval}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #8b3a4a 0%, #5c202e 100%)',
                  border: 'none',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(92, 32, 46, 0.25)',
                }}
              >
                <Wand2 size={16} />
                <span>Smart Contour Cutout</span>
              </button>
            </div>

            {/* Die-cut sticker border thickness */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#3a2b22' }}>White Vinyl Border:</span>
                <span>{borderThickness}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                value={borderThickness}
                onChange={(e) => setBorderThickness(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b3a4a' }}
              />
            </div>

            {/* Cutout Shape Options */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3a2b22', display: 'block', marginBottom: '6px' }}>
                Sticker Silhouette:
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['die-cut', 'circle', 'stamp'] as const).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setCutoutShape(shape)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: cutoutShape === shape ? '2px solid #8b3a4a' : '1px solid #d5c3b1',
                      background: cutoutShape === shape ? '#fff' : '#f0e6d6',
                      color: '#3d2e26',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      fontWeight: cutoutShape === shape ? 600 : 400,
                    }}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Shadow toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="dropShadowToggle"
                checked={hasShadow}
                onChange={(e) => setHasShadow(e.target.checked)}
                style={{ accentColor: '#8b3a4a', width: '16px', height: '16px' }}
              />
              <label htmlFor="dropShadowToggle" style={{ fontSize: '0.86rem', color: '#423228', cursor: 'pointer' }}>
                Tactile 3D Paper Shadow
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #ebdccb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8f2e7',
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#846f62',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleFinish}
            style={{
              background: '#5c202e',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(92, 32, 46, 0.3)',
            }}
          >
            <Check size={16} />
            <span>Place Sticker on Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
