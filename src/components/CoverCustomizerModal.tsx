import React, { useRef, useState } from 'react';
import { 
  X, Palette, Sparkles, Check, Heart, 
  BookOpen, Sliders, Image as ImageIcon, ImagePlus, Trash2
} from 'lucide-react';
import { CoupleProfile } from '../types/scrapbook';
import { fileToDownscaledDataUrl } from '../utils/imageUpload';

interface CoverCustomizerModalProps {
  profile: CoupleProfile;
  onSaveProfile: (profile: CoupleProfile) => void;
  onClose: () => void;
}

export const CoverCustomizerModal: React.FC<CoverCustomizerModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
}) => {
  const [draft, setDraft] = useState<CoupleProfile>({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Gallery / camera upload (mobile-friendly) with canvas downscale. */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await fileToDownscaledDataUrl(file);
      setDraft((d) => ({ ...d, coverPhoto: dataUrl }));
    } catch (err) {
      alert('Could not read that image, please try another 🙈');
    }
  };

  const coverPalette = [
    { color: '#5c2c35', name: 'Burgundy Velvet' },
    { color: '#382218', name: 'Vintage Leather' },
    { color: '#2d3b36', name: 'Forest Linen' },
    { color: '#233246', name: 'Midnight Navy' },
    { color: '#7a3e4d', name: 'Dusty Rose' },
    { color: '#4a3d34', name: 'Mocha Linen' },
  ];

  const foilColors = [
    { color: '#d4af37', name: 'Warm Gold Foil' },
    { color: '#dfb55d', name: 'Champagne Shimmer' },
    { color: '#dcdcdc', name: 'Silver Emboss' },
    { color: '#df8d9a', name: 'Rose Gold' },
  ];

  const handleSave = () => {
    onSaveProfile(draft);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(25, 20, 16, 0.8)',
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
        maxWidth: '780px',
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
            <h3 style={{
              fontFamily: 'var(--font-serif-title)',
              fontSize: '1.3rem',
              color: '#34251d',
            }}>
              Handcrafted Book Cover Customizer
            </h3>
            <p style={{
              fontSize: '0.84rem',
              color: '#7a6557',
              fontFamily: 'var(--font-sans)',
            }}>
              Personalize the spine, foil embossing, title, and texture of your physical memory book
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

        {/* Two-column layout: Left live 3D preview, Right settings */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.3fr',
          gap: '24px',
          padding: '24px',
          background: '#fcfaf6',
        }}>
          {/* Live Book Cover Preview */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, #2d231e 0%, #17120e 100%)',
            borderRadius: '12px',
            padding: '24px 16px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
          }}>
            <div
              style={{
                width: '210px',
                height: '280px',
                background: draft.coverColor,
                borderRadius: '4px 12px 12px 4px',
                boxShadow: '-6px 0 12px rgba(0,0,0,0.5), 0 15px 35px rgba(0,0,0,0.6)',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                border: '1px solid rgba(255, 230, 180, 0.25)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Spine Crease */}
              <div style={{
                position: 'absolute',
                left: '16px',
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'rgba(0,0,0,0.3)',
                boxShadow: '1px 0 1px rgba(255,255,255,0.1)',
              }} />

              {/* Ribbon Bookmark */}
              <div style={{
                position: 'absolute',
                bottom: '-14px',
                right: '32px',
                width: '18px',
                height: '28px',
                background: '#8b2030',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
              }} />

              {/* Top Embossed Ornament */}
              <div style={{ color: draft.coverEmbossColor, fontSize: '13px', letterSpacing: '2px' }}>
                ✦ ❖ ✦
              </div>

              {/* Embossed Title */}
              <div style={{ textAlign: 'center' }}>
                <h4 style={{
                  fontFamily: 'var(--font-serif-title)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: draft.coverEmbossColor,
                  lineHeight: 1.2,
                  marginBottom: '6px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}>
                  {draft.bookTitle || 'Our Little Book'}
                </h4>
                <div style={{
                  fontFamily: 'var(--font-handwriting)',
                  fontSize: '1.15rem',
                  color: '#faebd7',
                }}>
                  {draft.partner1} & {draft.partner2}
                </div>
              </div>

              {/* Cover Photo Cameo in Customizer Preview */}
              {draft.coverPhoto && (
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, #e8c872 0%, #a87928 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '4px 0',
                }}>
                  <img
                    src={draft.coverPhoto}
                    alt="Cover Cameo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              )}

              {/* Subtitle */}
              <div style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: '0.74rem',
                color: 'rgba(255, 240, 220, 0.7)',
                textAlign: 'center',
                maxWidth: '160px',
              }}>
                "{draft.bookSubtitle}"
              </div>
            </div>
          </div>

          {/* Form Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
            {/* Book Title */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '4px' }}>
                Book Title:
              </label>
              <input
                type="text"
                value={draft.bookTitle}
                onChange={(e) => setDraft({ ...draft, bookTitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d4c2b0' }}
              />
            </div>

            {/* Subtitle */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '4px' }}>
                Subtitle / Dedication:
              </label>
              <input
                type="text"
                value={draft.bookSubtitle}
                onChange={(e) => setDraft({ ...draft, bookSubtitle: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d4c2b0' }}
              />
            </div>

            {/* Couple Names */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '4px' }}>
                  Partner 1:
                </label>
                <input
                  type="text"
                  value={draft.partner1}
                  onChange={(e) => setDraft({ ...draft, partner1: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d4c2b0' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '4px' }}>
                  Partner 2:
                </label>
                <input
                  type="text"
                  value={draft.partner2}
                  onChange={(e) => setDraft({ ...draft, partner2: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d4c2b0' }}
                />
              </div>
            </div>

            {/* Cover Material Color */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                Cover Cloth & Color:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {coverPalette.map((item) => (
                  <button
                    key={item.color}
                    onClick={() => setDraft({ ...draft, coverColor: item.color })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      border: draft.coverColor === item.color ? '3px solid #d4af37' : '2px solid #fff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            {/* Foil Color */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                Foil Stamp Finish:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {foilColors.map((f) => (
                  <button
                    key={f.color}
                    onClick={() => setDraft({ ...draft, coverEmbossColor: f.color })}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: draft.coverEmbossColor === f.color ? '2px solid #5c202e' : '1px solid #d5c3b1',
                      background: draft.coverEmbossColor === f.color ? '#fff' : '#f0e6d6',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: draft.coverEmbossColor === f.color ? 600 : 400,
                    }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Portrait Photo Selection */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                Cover Portrait Cameo:
              </label>

              {/* Upload from device gallery */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'linear-gradient(135deg, #d4a359 0%, #aa772d 100%)',
                    color: '#1a120b',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    minHeight: 44,
                  }}
                >
                  <ImagePlus size={15} />
                  Upload from Gallery
                </button>
                {draft.coverPhoto && draft.coverPhoto.startsWith('data:') && (
                  <button
                    onClick={() => setDraft((d) => ({ ...d, coverPhoto: undefined }))}
                    style={{
                      background: 'none',
                      border: '1px solid #d4c2b0',
                      color: '#8b3a4a',
                      padding: '9px 14px',
                      borderRadius: 999,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      minHeight: 44,
                    }}
                  >
                    <Trash2 size={14} />
                    Remove uploaded
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.21.jpeg', label: 'Bar Cheek Kiss (Best Pick)' },
                  { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.13__2_.jpeg', label: 'Golden Cheek Kiss' },
                  { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.17__2_.jpeg', label: 'Cozy Table Close-up' },
                  { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.11__3_.jpeg', label: 'Flower in Hair' },
                ].map((item) => (
                  <div
                    key={item.url}
                    onClick={() => setDraft({ ...draft, coverPhoto: item.url })}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '65px',
                      border: draft.coverPhoto === item.url ? '3px solid #5c202e' : '1px solid #d4c1ad',
                      position: 'relative',
                    }}
                    title={item.label}
                  >
                    <img src={item.url} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
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
            onClick={handleSave}
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
            <span>Apply Cover Customization</span>
          </button>
        </div>
      </div>
    </div>
  );
};
