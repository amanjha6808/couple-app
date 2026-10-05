import React, { useState } from 'react';
import { 
  X, Type, Camera, Smile, Scissors, PenTool, 
  Paperclip, Star, Heart, Bookmark, Calendar, Music, Sparkles
} from 'lucide-react';
import { 
  TextElement, PhotoElement, PolaroidElement, StickerElement, 
  TapeElement, ScrapElement, DoodleElement, RatingElement, 
  LocationElement, LetterPaperElement 
} from '../types/scrapbook';
import { STICKER_LIBRARY } from '../data/initialScrapbookData';

export type NewPageElement = 
  | Omit<TextElement, 'id' | 'createdAt'>
  | Omit<PhotoElement, 'id' | 'createdAt'>
  | Omit<PolaroidElement, 'id' | 'createdAt'>
  | Omit<StickerElement, 'id' | 'createdAt'>
  | Omit<TapeElement, 'id' | 'createdAt'>
  | Omit<ScrapElement, 'id' | 'createdAt'>
  | Omit<DoodleElement, 'id' | 'createdAt'>
  | Omit<RatingElement, 'id' | 'createdAt'>
  | Omit<LocationElement, 'id' | 'createdAt'>
  | Omit<LetterPaperElement, 'id' | 'createdAt'>;

interface AddElementMenuProps {
  onClose: () => void;
  onAddElement: (element: NewPageElement) => void;
  onOpenDoodle: () => void;
  onOpenStickerMaker: () => void;
  partner: 'user1' | 'user2';
}

export const AddElementMenu: React.FC<AddElementMenuProps> = ({
  onClose,
  onAddElement,
  onOpenDoodle,
  onOpenStickerMaker,
  partner,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'polaroid' | 'stickers' | 'stationery' | 'ratings'>('stickers');
  const [stickerFilter, setStickerFilter] = useState<string>('all');

  // Text builder state
  const [textInput, setTextInput] = useState('');
  const [fontFamily, setFontFamily] = useState('Caveat, cursive');
  const [textColor, setTextColor] = useState('#2d241e');
  const [textEffect, setTextEffect] = useState<'normal' | 'curved' | 'warped' | 'folded'>('normal');

  // Polaroid builder state
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80');
  const [polaroidCaption, setPolaroidCaption] = useState('Golden afternoon with you ✨');
  const [pinType, setPinType] = useState<'none' | 'tape-top' | 'tape-corner'>('tape-top');
  const [photoFilter, setPhotoFilter] = useState<'normal' | 'warm' | 'vintage' | 'bw'>('warm');

  // Predefined photo collection for quick instant scrapbooking
  const samplePhotos = [
    { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80', label: 'Picnic in the Sun' },
    { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80', label: 'Holding Hands' },
    { url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', label: 'Coffee Date Smiles' },
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80', label: 'Candlelight Dinner' },
  ];

  const handleAddText = () => {
    if (!textInput.trim()) return;
    onAddElement({
      type: 'text',
      x: 60,
      y: 120,
      width: textEffect === 'curved' ? 280 : 250,
      height: textEffect === 'curved' ? 70 : 60,
      rotation: Math.round(Math.random() * 8 - 4),
      zIndex: 10,
      text: textInput,
      fontFamily,
      fontSize: fontFamily.includes('Caveat') || fontFamily.includes('Dancing') ? 24 : 20,
      color: textColor,
      effect: textEffect,
      curvature: textEffect === 'curved' ? 20 : undefined,
      createdBy: partner,
    });
    onClose();
  };

  const handleAddPolaroid = () => {
    onAddElement({
      type: 'polaroid',
      x: 50,
      y: 140,
      width: 260,
      height: 310,
      rotation: Math.round(Math.random() * 10 - 5),
      zIndex: 6,
      src: photoUrl,
      caption: polaroidCaption,
      pinType,
      filter: photoFilter,
      createdBy: partner,
    });
    onClose();
  };

  const handleAddSticker = (emoji: string, category: any) => {
    onAddElement({
      type: 'sticker',
      x: 120,
      y: 180,
      width: 70,
      height: 70,
      rotation: Math.round(Math.random() * 24 - 12),
      zIndex: 15,
      stickerId: `sticker-${Date.now()}`,
      category,
      svgOrEmoji: emoji,
      hasShadow: true,
      createdBy: partner,
    });
    onClose();
  };

  const handleAddWashiTape = (pattern: 'washi-dots' | 'washi-stripes' | 'kraft') => {
    onAddElement({
      type: 'tape',
      x: 80,
      y: 90,
      width: 140,
      height: 28,
      rotation: Math.round(Math.random() * 12 - 6),
      zIndex: 8,
      tapePattern: pattern,
      tapeColor: pattern === 'kraft' ? '#cb9d75' : '#e0c3a8',
      createdBy: partner,
    });
    onClose();
  };

  const handleAddScrapPaper = () => {
    onAddElement({
      type: 'scrap',
      x: 40,
      y: 160,
      width: 290,
      height: 180,
      rotation: 1,
      zIndex: 3,
      paperType: 'lined',
      title: 'A Little Thought...',
      bodyText: 'I love how you always look back twice to make sure I am walking right next to you.',
      createdBy: partner,
    } as any);
    onClose();
  };

  const handleAddRating = (label: string, category: 'romance' | 'fun' | 'food' | 'vibe' | 'overall') => {
    onAddElement({
      type: 'rating',
      x: 50,
      y: 200,
      width: 280,
      height: 48,
      rotation: 0,
      zIndex: 6,
      label,
      score: 10,
      category,
      createdBy: partner,
    } as any);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(25, 20, 16, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 900,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--paper-cream)',
        borderRadius: '16px',
        maxWidth: '680px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        border: '1px solid #dfd1bf',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 22px',
          borderBottom: '1px solid #ebdccb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8f2e7',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif-title)',
              fontSize: '1.25rem',
              color: '#3d2e26',
            }}>
              Add to Our Scrapbook
            </h3>
            <p style={{
              fontSize: '0.82rem',
              color: '#7b685c',
              fontFamily: 'var(--font-sans)',
            }}>
              Add photos, washi tape, romantic notes, stickers, or doodles
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#705c4f',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #ebdccb',
          background: '#f2e8dc',
          padding: '0 12px',
          gap: '4px',
          overflowX: 'auto',
        }}>
          {[
            { id: 'stickers', label: 'Stickers', icon: Smile },
            { id: 'polaroid', label: 'Polaroid & Photo', icon: Camera },
            { id: 'text', label: 'Handwritten & Type', icon: Type },
            { id: 'stationery', label: 'Washi & Scraps', icon: Paperclip },
            { id: 'ratings', label: 'Date Ratings', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  background: active ? 'var(--paper-cream)' : 'transparent',
                  border: 'none',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                  color: active ? '#5c202e' : '#6b584d',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  borderBottom: active ? '2px solid #5c202e' : 'none',
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, background: '#fcfaf6' }}>
          {/* STICKERS TAB */}
          {activeTab === 'stickers' && (
            <div>
              {/* Creator Studio Shortcuts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '18px',
              }}>
                <button
                  onClick={() => {
                    onClose();
                    onOpenStickerMaker();
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px dashed #bf5b72',
                    background: '#fdf3f5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#bf5b72',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}>
                    <Scissors size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: '#5c202e' }}>
                      Photo → Sticker Studio
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: '#88626b' }}>
                      Remove background & create vinyl sticker
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenDoodle();
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px dashed #849683',
                    background: '#f3f6f3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#849683',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}>
                    <PenTool size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: '#2f4538' }}>
                      Handmade Doodle Pen
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: '#617467' }}>
                      Draw directly with ink & markers
                    </span>
                  </div>
                </button>
              </div>

              {/* Categories */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {['all', 'love', 'food', 'travel', 'celebration', 'cute', 'decorative'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStickerFilter(cat)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '16px',
                      border: stickerFilter === cat ? '1px solid #5c202e' : '1px solid #dcd0bf',
                      background: stickerFilter === cat ? '#5c202e' : '#fff',
                      color: stickerFilter === cat ? '#fff' : '#57463b',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of cute stickers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
                gap: '10px',
              }}>
                {STICKER_LIBRARY.filter((s) => stickerFilter === 'all' || s.category === stickerFilter).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleAddSticker(s.emoji, s.category)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #ebdccb',
                      borderRadius: '10px',
                      padding: '12px 6px',
                      fontSize: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15) rotate(3deg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
                  >
                    <span>{s.emoji}</span>
                    <span style={{ fontSize: '10px', color: '#887467', marginTop: '4px' }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* POLAROID TAB */}
          {activeTab === 'polaroid' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                  Choose Photo:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  {samplePhotos.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPhotoUrl(p.url);
                        setPolaroidCaption(p.label);
                      }}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: photoUrl === p.url ? '3px solid #5c202e' : '1px solid #decbbb',
                        height: '70px',
                      }}
                    >
                      <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or paste any image URL..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d4c2b0',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                  Handwritten Caption:
                </label>
                <input
                  type="text"
                  value={polaroidCaption}
                  onChange={(e) => setPolaroidCaption(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d4c2b0',
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.2rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '4px' }}>
                    Attachment Tape:
                  </span>
                  <select
                    value={pinType}
                    onChange={(e) => setPinType(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c2b0' }}
                  >
                    <option value="tape-top">Top Washi Tape</option>
                    <option value="tape-corner">Corner Diagonal Tape</option>
                    <option value="none">No Tape (Plain)</option>
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '4px' }}>
                    Photo Filter:
                  </span>
                  <select
                    value={photoFilter}
                    onChange={(e) => setPhotoFilter(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c2b0' }}
                  >
                    <option value="warm">Golden Warm</option>
                    <option value="vintage">Nostalgic Vintage</option>
                    <option value="bw">Black & White Film</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddPolaroid}
                style={{
                  background: '#5c202e',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  marginTop: '8px',
                }}
              >
                Make & Pin Polaroid
              </button>
            </div>
          )}

          {/* TEXT TAB */}
          {activeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                  Write Your Note or Headline:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. “BEST DATE EVER”, or “You looked so gorgeous tonight...”"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d4c2b0',
                    fontFamily: fontFamily,
                    fontSize: '1.25rem',
                    color: textColor,
                  }}
                />
              </div>

              {/* Font Choice */}
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                  Typography Style:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Playful Hand', value: 'Caveat, cursive' },
                    { label: 'Romantic Script', value: 'Dancing Script, cursive' },
                    { label: 'Classic Serif', value: 'Playfair Display, serif' },
                    { label: 'Vintage Typewriter', value: 'Special Elite, monospace' },
                    { label: 'Classic Title', value: 'Cinzel, serif' },
                    { label: 'Editorial Book', value: 'Lora, serif' },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFontFamily(f.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: fontFamily === f.value ? '2px solid #5c202e' : '1px solid #d5c3b1',
                        background: fontFamily === f.value ? '#fff' : '#f0e6d6',
                        fontFamily: f.value,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects: Curved / Warped */}
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                  Curved & Warped Physical Effects:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'normal', label: 'Flat Ink' },
                    { id: 'curved', label: 'Arch / Curved 🌙' },
                    { id: 'warped', label: 'Bended / Warped 〰️' },
                  ].map((eff) => (
                    <button
                      key={eff.id}
                      onClick={() => setTextEffect(eff.id as any)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: textEffect === eff.id ? '2px solid #5c202e' : '1px solid #d5c3b1',
                        background: textEffect === eff.id ? '#fff' : '#f0e6d6',
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        fontWeight: textEffect === eff.id ? 600 : 400,
                      }}
                    >
                      {eff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color pick */}
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
                  Ink Color:
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['#2d241e', '#5c202e', '#8b3a4a', '#233649', '#849683', '#c46851'].map((c) => (
                    <div
                      key={c}
                      onClick={() => setTextColor(c)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        cursor: 'pointer',
                        border: textColor === c ? '3px solid #000' : '2px solid #fff',
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddText}
                style={{
                  background: '#5c202e',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Stamp Text on Page
              </button>
            </div>
          )}

          {/* STATIONERY TAB */}
          {activeTab === 'stationery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '8px' }}>
                  Washi Tape Strips:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => handleAddWashiTape('washi-dots')}
                    style={{
                      height: '50px',
                      borderRadius: '6px',
                      border: '1px solid #d4c2b0',
                      background: '#fcfaf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="washi-tape tape-pattern-dots" style={{ width: '80px', height: '24px', position: 'relative' }} />
                  </button>

                  <button
                    onClick={() => handleAddWashiTape('washi-stripes')}
                    style={{
                      height: '50px',
                      borderRadius: '6px',
                      border: '1px solid #d4c2b0',
                      background: '#fcfaf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="washi-tape tape-pattern-stripes" style={{ width: '80px', height: '24px', position: 'relative' }} />
                  </button>

                  <button
                    onClick={() => handleAddWashiTape('kraft')}
                    style={{
                      height: '50px',
                      borderRadius: '6px',
                      border: '1px solid #d4c2b0',
                      background: '#fcfaf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="washi-tape tape-pattern-kraft" style={{ width: '80px', height: '24px', position: 'relative' }} />
                  </button>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '8px' }}>
                  Torn Note / Paper Scrap:
                </span>
                <button
                  onClick={handleAddScrapPaper}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px dashed #cbb6a1',
                    background: '#f7f3ec',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong style={{ fontFamily: 'var(--font-serif-title)', color: '#5c2c35' }}>
                    + Add Lined Paper Scrap
                  </strong>
                  <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', color: '#524339', marginTop: '4px' }}>
                    A torn notebook scrap for handwritten love letters and private thoughts.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* RATINGS TAB */}
          {activeTab === 'ratings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: '#6e5a4f' }}>
                Add cute handmade date score tags to rate your fun, food, vibe, and romance:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => handleAddRating('Romance Factor', 'romance')}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d4c1ad', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  💕 Romance Factor (10/10)
                </button>
                <button
                  onClick={() => handleAddRating('Food & Cocktails', 'food')}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d4c1ad', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  🍷 Food & Cocktails (10/10)
                </button>
                <button
                  onClick={() => handleAddRating('Vibe & Ambience', 'vibe')}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d4c1ad', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  🕯️ Vibe & Ambience (10/10)
                </button>
                <button
                  onClick={() => handleAddRating('Uncontrollable Laughs', 'fun')}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d4c1ad', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  😂 Uncontrollable Laughs (10/10)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
