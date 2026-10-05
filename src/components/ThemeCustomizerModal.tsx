import React, { useRef, useState } from 'react';
import { X, Check, Palette, CalendarHeart, ImagePlus, Trash2, Layers } from 'lucide-react';
import { CoupleProfile } from '../types/scrapbook';
import { THEMES, COVER_TEXTURES, ThemeStyle, CoverTexture, formatKeyDate } from '../theme';
import { fileToDownscaledDataUrl } from '../utils/imageUpload';

interface ThemeCustomizerModalProps {
  profile: CoupleProfile;
  onSaveProfile: (profile: CoupleProfile) => void;
  onClose: () => void;
}

const SectionTitle: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
    {icon}
    <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6b5c53' }}>
      {text}
    </span>
  </div>
);

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#382b23',
  display: 'block',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: '1px solid #d4c2b0',
  fontSize: '16px', // >=16px prevents iOS auto-zoom on focus
  background: '#fff',
  color: '#34251d',
  minHeight: 44,
};

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
}) => {
  const [draft, setDraft] = useState<CoupleProfile>({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof CoupleProfile>(key: K, value: CoupleProfile[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const pickTheme = (id: ThemeStyle) => {
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return;
    setDraft((d) => ({
      ...d,
      themeStyle: id,
      // Follow the theme's suggested cover color unless the user hand-picked one
      coverColor: d.coverColor === profile.coverColor ? theme.coverColor : d.coverColor,
    }));
  };

  /**
   * Gallery / camera upload — works on Android & iOS.
   * accept="image/*" opens the native gallery picker on mobile browsers.
   * Downscaled via shared helper so localStorage doesn't blow up.
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file later
    if (!file) return;
    try {
      const dataUrl = await fileToDownscaledDataUrl(file);
      set('coverPhoto', dataUrl);
    } catch (err) {
      alert('Could not read that image, please try another 🙈');
    }
  };

  const handleSave = () => {
    onSaveProfile(draft);
    onClose();
  };

  const datePlaceholder = 'YYYY-MM-DD';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 12, 10, 0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end', // bottom sheet on mobile
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--paper-cream)',
          width: '100%',
          maxWidth: 640,
          maxHeight: '88vh',
          borderRadius: '22px 22px 0 0',
          boxShadow: '0 -10px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Grab handle + header */}
        <div style={{ padding: '10px 20px 12px', borderBottom: '1px solid #ebdccb', background: '#f8f2e7' }}>
          <div style={{ width: 44, height: 4, borderRadius: 4, background: '#d8c6b2', margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif-title)', fontSize: '1.15rem', color: '#34251d' }}>
                Customize Theme & Cover
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#7a6557', fontFamily: 'var(--font-sans)' }}>
                Theme, texture, key dates & cover photo
              </p>
            </div>
            <button onClick={onClose} style={iconBtn} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* THEME PICKER */}
          <section>
            <SectionTitle icon={<Palette size={15} color="#8b3a4a" />} text="Book Theme" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {THEMES.map((t) => {
                const active = draft.themeStyle === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => pickTheme(t.id)}
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderRadius: 14,
                      border: active ? '2px solid #5c202e' : '1px solid #d4c2b0',
                      background: active ? '#fdf1ec' : '#fff',
                      cursor: 'pointer',
                      minHeight: 44,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.15rem' }}>{t.emoji}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#34251d' }}>{t.label}</span>
                      {active && <Check size={15} color="#5c202e" />}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#7a6557', marginTop: 4, lineHeight: 1.35 }}>
                      {t.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* COVER TEXTURE */}
          <section>
            <SectionTitle icon={<Layers size={15} color="#7a5a2e" />} text="Cover Texture" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COVER_TEXTURES.map((tx) => {
                const active = draft.coverTexture === tx.id;
                return (
                  <button
                    key={tx.id}
                    onClick={() => set('coverTexture', tx.id as CoverTexture)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 999,
                      minHeight: 44,
                      border: active ? '2px solid #5c202e' : '1px solid #d4c2b0',
                      background: active ? '#fdf1ec' : '#fff',
                      fontSize: '0.85rem',
                      fontWeight: active ? 700 : 500,
                      color: '#34251d',
                      cursor: 'pointer',
                    }}
                  >
                    {tx.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* KEY DATES */}
          <section>
            <SectionTitle icon={<CalendarHeart size={15} color="#8b3a4a" />} text="Your Key Dates" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>First Date 💛</label>
                <input
                  type="date"
                  value={draft.anniversaryDate}
                  onChange={(e) => set('anniversaryDate', e.target.value)}
                  style={inputStyle}
                />
                {draft.anniversaryDate && (
                  <p style={{ fontSize: '0.78rem', color: '#8b3a4a', marginTop: 4 }}>
                    Shows on the cover as: <strong>{formatKeyDate(draft.anniversaryDate)}</strong>
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>I Asked Her Out 💍</label>
                <input
                  type="date"
                  value={draft.firstDateProposed || ''}
                  onChange={(e) => set('firstDateProposed', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: '#7a6557' }}>
                Both dates appear together on the book cover: “First date {formatKeyDate(draft.anniversaryDate || datePlaceholder)} · Asked her out {formatKeyDate(draft.firstDateProposed || datePlaceholder)}”
              </p>
            </div>
          </section>

          {/* COVER PHOTO — GALLERY UPLOAD */}
          <section>
            <SectionTitle icon={<ImagePlus size={15} color="#7a5a2e" />} text="Cover Photo (from your gallery)" />

            {/* Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  padding: 3,
                  background: 'linear-gradient(135deg, #e8c872 0%, #a87928 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {draft.coverPhoto ? (
                  <img
                    src={draft.coverPhoto}
                    alt="Cover preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.7rem', color: '#9b897e' }}>No photo</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'linear-gradient(135deg, #d4a359 0%, #aa772d 100%)',
                    color: '#1a120b',
                    border: 'none',
                    padding: '11px 18px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    minHeight: 44,
                  }}
                >
                  <ImagePlus size={16} />
                  Upload from Gallery
                </button>
                {draft.coverPhoto && (
                  <button
                    onClick={() => set('coverPhoto', undefined)}
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
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Also offer the curated set */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.21.jpeg', label: 'Bar Cheek Kiss' },
                { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.13__2_.jpeg', label: 'Golden Cheek Kiss' },
                { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.17__2_.jpeg', label: 'Cozy Table Close-up' },
                { url: '/diya_photos/WhatsApp_Image_2026-10-05_at_18.04.11__3_.jpeg', label: 'Flower in Hair' },
              ].map((item) => (
                <div
                  key={item.url}
                  onClick={() => set('coverPhoto', item.url)}
                  title={item.label}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 10,
                    overflow: 'hidden',
                    height: 64,
                    border: draft.coverPhoto === item.url ? '3px solid #5c202e' : '1px solid #d4c1ad',
                  }}
                >
                  <img src={item.url} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </section>
        </div>

        {/* Sticky Save bar */}
        <div
          style={{
            padding: '12px 20px calc(14px + env(safe-area-inset-bottom))',
            borderTop: '1px solid #ebdccb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8f2e7',
          }}
        >
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#846f62', cursor: 'pointer', fontSize: '0.9rem', minHeight: 44 }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#5c202e',
              color: '#fff',
              border: 'none',
              padding: '12px 26px',
              borderRadius: 999,
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 44,
              boxShadow: '0 4px 15px rgba(92, 32, 46, 0.3)',
            }}
          >
            <Check size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#6f5a4e',
  cursor: 'pointer',
  padding: 8,
  minHeight: 44,
  minWidth: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
