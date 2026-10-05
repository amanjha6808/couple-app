import React, { useState } from 'react';
import { X, Plus, Calendar, Compass, Heart, BookOpen, Camera, FileText } from 'lucide-react';
import { PageLayoutType, PaperTexture, ScrapbookPage } from '../types/scrapbook';

interface NewPageModalProps {
  onClose: () => void;
  onCreatePage: (page: Omit<ScrapbookPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  nextPageNumber: number;
}

export const NewPageModal: React.FC<NewPageModalProps> = ({
  onClose,
  onCreatePage,
  nextPageNumber,
}) => {
  const [title, setTitle] = useState('');
  const [layoutType, setLayoutType] = useState<PageLayoutType>('date-journal');
  const [paperTexture, setPaperTexture] = useState<PaperTexture>('creamy-canvas');
  const [chapter, setChapter] = useState('');

  const templates: {
    type: PageLayoutType;
    label: string;
    description: string;
    icon: any;
    recommendedPaper: PaperTexture;
  }[] = [
    {
      type: 'date-journal',
      label: 'Date Journal',
      description: 'Structured memory page for dinners, coffee dates, and evening outings with rating cards and polaroids.',
      icon: Calendar,
      recommendedPaper: 'creamy-canvas',
    },
    {
      type: 'blank',
      label: 'Blank Scrapbook',
      description: 'Total artistic freedom. Empty textured paper ready for freeform photos, stickers, notes, and doodles.',
      icon: BookOpen,
      recommendedPaper: 'dot-grid',
    },
    {
      type: 'letter',
      label: 'Private Letter (Wax Sealed)',
      description: 'Deep personal handwritten love letter. Can be locked with an anniversary wax seal until a future date.',
      icon: Heart,
      recommendedPaper: 'soft-blush',
    },
    {
      type: 'trip',
      label: 'Travel & Adventure',
      description: 'Wanderlust roadtrips, flights, beach days, tickets, maps, and songs of the journey.',
      icon: Compass,
      recommendedPaper: 'vintage-parchment',
    },
    {
      type: 'photo-collage',
      label: 'Photo Collage Spread',
      description: 'Tilted polaroids, film strips, and washi-taped photos capturing a favorite day.',
      icon: Camera,
      recommendedPaper: 'creamy-canvas',
    },
  ];

  const handleCreate = () => {
    const pageTitle = title.trim() || `Page ${nextPageNumber} Memory`;
    let initialElements: any[] = [];

    if (layoutType === 'date-journal') {
      initialElements = [
        {
          id: `tape-${Date.now()}`,
          type: 'tape',
          x: 40,
          y: 35,
          width: 120,
          height: 28,
          rotation: -3,
          zIndex: 1,
          createdBy: 'user1',
          createdAt: Date.now(),
          tapePattern: 'washi-dots',
          tapeColor: '#e0c3a8',
        },
        {
          id: `title-${Date.now()}`,
          type: 'text',
          x: 40,
          y: 70,
          width: 320,
          height: 50,
          rotation: 0,
          zIndex: 2,
          createdBy: 'user1',
          createdAt: Date.now(),
          text: pageTitle,
          fontFamily: 'Playfair Display, serif',
          fontSize: 24,
          color: '#2d241e',
          fontWeight: 700,
        },
        {
          id: `polaroid-${Date.now()}`,
          type: 'polaroid',
          x: 45,
          y: 150,
          width: 270,
          height: 320,
          rotation: 2,
          zIndex: 4,
          createdBy: 'user1',
          createdAt: Date.now(),
          src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
          caption: 'Add your handwritten caption here ✨',
          dateStr: 'Special Evening',
          pinType: 'tape-top',
          filter: 'warm',
        },
        {
          id: `rating-${Date.now()}`,
          type: 'rating',
          x: 40,
          y: 500,
          width: 290,
          height: 48,
          rotation: 0,
          zIndex: 3,
          createdBy: 'user2',
          createdAt: Date.now(),
          label: 'Romance & Warmth',
          score: 10,
          category: 'romance',
        },
      ];
    } else if (layoutType === 'letter') {
      initialElements = [
        {
          id: `letter-${Date.now()}`,
          type: 'letter-paper',
          x: 35,
          y: 50,
          width: 320,
          height: 580,
          rotation: 0,
          zIndex: 2,
          createdBy: 'user1',
          createdAt: Date.now(),
          toName: 'My favorite person,',
          content: 'I sat down today and started remembering the way you laughed yesterday...',
          fromName: 'With all my love ❤️',
          isSealed: false,
          unlockDate: 'Our Next Anniversary',
        },
      ];
    } else if (layoutType === 'trip') {
      initialElements = [
        {
          id: `title-${Date.now()}`,
          type: 'text',
          x: 35,
          y: 50,
          width: 320,
          height: 45,
          rotation: 0,
          zIndex: 2,
          createdBy: 'user1',
          createdAt: Date.now(),
          text: pageTitle.toUpperCase(),
          fontFamily: 'Cinzel, serif',
          fontSize: 22,
          color: '#34251d',
          fontWeight: 700,
          letterSpacing: 2,
        },
        {
          id: `polaroid-${Date.now()}`,
          type: 'polaroid',
          x: 45,
          y: 110,
          width: 280,
          height: 310,
          rotation: -2,
          zIndex: 4,
          createdBy: 'user1',
          createdAt: Date.now(),
          src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
          caption: 'Where the sky touched the ocean 🌊',
          pinType: 'tape-corner',
          filter: 'warm',
        },
        {
          id: `sticker-plane-${Date.now()}`,
          type: 'sticker',
          x: 280,
          y: 80,
          width: 60,
          height: 60,
          rotation: 12,
          zIndex: 6,
          createdBy: 'user2',
          createdAt: Date.now(),
          stickerId: 'plane',
          category: 'travel',
          svgOrEmoji: '✈️',
        },
      ];
    }

    onCreatePage({
      title: pageTitle,
      pageNumber: nextPageNumber,
      layoutType,
      paperTexture,
      chapter: chapter.trim() || undefined,
      elements: initialElements,
      bookmark: false,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(25, 20, 16, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
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
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '1px solid #dfd1bf',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
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
              Turn to a New Page
            </h3>
            <p style={{
              fontSize: '0.84rem',
              color: '#7a6557',
              fontFamily: 'var(--font-sans)',
            }}>
              Page {nextPageNumber} in your shared relationship memory book
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

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#fcf9f4' }}>
          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
              Memory or Page Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Candlelight Pasta & Jazz Night, Our 2nd Anniversary, Stargazing..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #d4c2b0',
                fontFamily: 'var(--font-serif-title)',
                fontSize: '1.05rem',
              }}
            />
          </div>

          {/* Chapter */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '6px' }}>
              Chapter (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 3: Summer Nights, The Little Dates, Trip to Paris..."
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #d4c2b0',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Template choices */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '10px' }}>
              Choose Starting Scrapbook Template:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = layoutType === tpl.type;
                return (
                  <div
                    key={tpl.type}
                    onClick={() => {
                      setLayoutType(tpl.type);
                      setPaperTexture(tpl.recommendedPaper);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #5c202e' : '1px solid #e1d3c2',
                      background: isSelected ? '#fff' : '#f9f5ee',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: isSelected ? '#5c202e' : '#ebdccb',
                      color: isSelected ? '#fff' : '#57463b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#362921', fontSize: '0.96rem' }}>
                        {tpl.label}
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: '#7a685c', lineHeight: 1.3 }}>
                        {tpl.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Paper Texture choices */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#382b23', display: 'block', marginBottom: '8px' }}>
              Paper Texture & Finish:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'creamy-canvas', label: 'Creamy Canvas' },
                { id: 'vintage-parchment', label: 'Aged Parchment' },
                { id: 'soft-blush', label: 'Soft Blush' },
                { id: 'dot-grid', label: 'Bullet Dot Grid' },
                { id: 'ruled-journal', label: 'Ruled Lines' },
                { id: 'grain-paper', label: 'Heavy Grain Paper' },
              ].map((tex) => (
                <button
                  key={tex.id}
                  onClick={() => setPaperTexture(tex.id as any)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: paperTexture === tex.id ? '2px solid #5c202e' : '1px solid #d5c3b1',
                    background: paperTexture === tex.id ? '#fff' : '#f0e6d6',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: paperTexture === tex.id ? 600 : 400,
                  }}
                >
                  {tex.label}
                </button>
              ))}
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
            onClick={handleCreate}
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
            <Plus size={16} />
            <span>Create Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
