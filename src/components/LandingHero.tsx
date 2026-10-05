import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen, PenTool, Image as ImageIcon, Palette } from 'lucide-react';
import { CoupleProfile } from '../types/scrapbook';
import { themeById, coverTextureById, formatKeyDate } from '../theme';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';

interface LandingHeroProps {
  profile: CoupleProfile;
  pageCount: number;
  memoryCount: number;
  onOpenBook: () => void;
  onCustomizeBook: () => void;
  /** Called when the theme modal saves; lets the hero persist profile updates */
  onUpdateProfile?: (profile: CoupleProfile) => void;
}

type InnerProps = LandingHeroProps & { onCustomizeTheme: () => void };

/** Small hook: phones get the compact single-column layout */
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
};

const LandingHeroInner: React.FC<InnerProps> = ({
  profile,
  pageCount,
  memoryCount,
  onOpenBook,
  onCustomizeBook,
  onCustomizeTheme,
}) => {
  const isMobile = useIsMobile();
  const theme = themeById(profile.themeStyle);
  const texture = coverTextureById(profile.coverTexture);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '32px 14px' : '40px 20px',
      position: 'relative',
      background: theme.bg,
      overflow: 'hidden',
    }}>
      {/* Whimsical Ambient Floating Particles / Stars */}
      <div style={{ position: 'absolute', top: '12%', left: '15%', opacity: 0.25, animation: 'floatGentle 6s ease-in-out infinite' }}>
        <Sparkles size={32} color="#f6e29d" />
      </div>
      <div style={{ position: 'absolute', top: '22%', right: '18%', opacity: 0.2, animation: 'floatGentle 8s ease-in-out infinite 1s' }}>
        <Heart size={28} color="#df929e" />
      </div>
      <div style={{ position: 'absolute', bottom: '18%', left: '20%', opacity: 0.18, animation: 'floatGentle 7s ease-in-out infinite 2s' }}>
        <Sparkles size={24} color="#f6e29d" />
      </div>

      {/* Subtle handcrafted header badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 245, 235, 0.08)',
        border: '1px solid rgba(255, 230, 200, 0.15)',
        backdropFilter: 'blur(8px)',
        padding: '6px 18px',
        borderRadius: '30px',
        color: '#e4cdb5',
        fontSize: isMobile ? '0.76rem' : '0.88rem',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '24px',
        fontFamily: 'var(--font-sans)',
        textAlign: 'center',
      }}>
        <Heart size={14} color="#df929e" fill="#df929e" />
        <span>Our Private Memory Archive</span>
      </div>

      {/* Main Closed Scrapbook with tactile 3D book depth */}
      <div
        onClick={onOpenBook}
        style={{
          perspective: '1200px',
          cursor: 'pointer',
          marginBottom: isMobile ? '24px' : '36px',
        }}
      >
        <div
          className="animate-float"
          style={{
            width: isMobile ? 'min(78vw, 300px)' : '320px',
            height: isMobile ? 'min(104vw, 400px)' : '420px',
            background: profile.coverColor || '#4a1924',
            borderRadius: '6px 18px 18px 6px',
            boxShadow: `
              -8px 0 15px rgba(0,0,0,0.5),
              0 25px 50px -10px rgba(0, 0, 0, 0.7),
              inset 4px 0 8px rgba(255,255,255,0.1),
              inset -4px 0 12px rgba(0,0,0,0.4)
            `,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '22px 16px' : '36px 28px',
            border: '2px solid rgba(255, 215, 140, 0.25)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) rotateY(-6deg) scale(1.03)';
            e.currentTarget.style.boxShadow = '-12px 0 25px rgba(0,0,0,0.6), 0 35px 70px -10px rgba(0, 0, 0, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) rotateY(0deg) scale(1)';
            e.currentTarget.style.boxShadow = '-8px 0 15px rgba(0,0,0,0.5), 0 25px 50px -10px rgba(0, 0, 0, 0.7)';
          }}
        >
          {/* Real physical book spine crease */}
          <div style={{
            position: 'absolute',
            left: '24px',
            top: 0,
            bottom: 0,
            width: '3px',
            background: 'rgba(0,0,0,0.3)',
            boxShadow: '1px 0 2px rgba(255,255,255,0.15)',
          }} />

          {/* Cover texture overlay from the selected material */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: texture.background,
            opacity: 0.5,
            pointerEvents: 'none',
          }} />

          {/* Book Ribbon Bookmark sticking out */}
          <div style={{
            position: 'absolute',
            bottom: '-22px',
            right: '48px',
            width: '26px',
            height: '42px',
            background: '#8b2030',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          }} />

          {/* Top embossed floral ornament */}
          <div style={{
            color: profile.coverEmbossColor || '#d4af37',
            opacity: 0.8,
            fontSize: '18px',
            letterSpacing: '4px',
          }}>
            ✦ ❖ ✦
          </div>

          {/* Center Book Title with Gold Foil effect */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <h1 style={{
              fontFamily: 'var(--font-serif-title)',
              fontSize: isMobile ? '1.7rem' : '2.1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff2cc 0%, #dfb55d 50%, #f6e29d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
              lineHeight: 1.15,
              marginBottom: '6px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              {profile.bookTitle}
            </h1>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f5e4cf',
              fontFamily: 'var(--font-handwriting)',
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}>
              <span>{profile.partner1}</span>
              <span style={{ color: '#e87285', fontSize: '1.1rem' }}>&</span>
              <span>{profile.partner2}</span>
            </div>

            {/* Embossed Oval / Polaroid Cover Photo */}
            {profile.coverPhoto && (
              <div style={{
                margin: '6px auto 10px auto',
                width: isMobile ? '110px' : '135px',
                height: isMobile ? '110px' : '135px',
                borderRadius: '50%',
                padding: '4px',
                background: 'linear-gradient(135deg, #e8c872 0%, #a87928 100%)',
                boxShadow: '0 6px 18px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={profile.coverPhoto}
                  alt={`${profile.partner1} & ${profile.partner2}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    filter: 'contrast(1.05) saturate(1.1)',
                  }}
                />
              </div>
            )}

            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: isMobile ? '0.78rem' : '0.86rem',
              color: 'rgba(255, 235, 215, 0.75)',
              maxWidth: '220px',
              margin: '0 auto',
              lineHeight: 1.35,
            }}>
              "{profile.bookSubtitle}"
            </p>
          </div>

          {/* Bottom metadata: the two key dates */}
          <div style={{
            textAlign: 'center',
            fontSize: isMobile ? '0.66rem' : '0.78rem',
            color: 'rgba(255, 220, 180, 0.75)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            lineHeight: 1.6,
          }}>
            <div>First Date · {formatKeyDate(profile.anniversaryDate)}</div>
            {profile.firstDateProposed && (
              <div>Asked Her Out · {formatKeyDate(profile.firstDateProposed)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Intimate Story Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '14px' : '24px',
        color: '#d4c2b3',
        fontSize: isMobile ? '0.85rem' : '0.95rem',
        marginBottom: '28px',
        fontFamily: 'var(--font-editorial)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={16} color="#d4af37" />
          <span><strong>{pageCount}</strong> crafted pages</span>
        </div>
        {!isMobile && <span>•</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={16} color="#df929e" />
          <span><strong>{memoryCount}</strong> cherished memories</span>
        </div>
      </div>

      {/* Calls to Action */}
      <div style={{ display: 'flex', gap: isMobile ? '10px' : '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onOpenBook}
          style={{
            background: 'linear-gradient(135deg, #d4a359 0%, #aa772d 100%)',
            color: '#1a120b',
            border: 'none',
            padding: isMobile ? '13px 24px' : '14px 34px',
            borderRadius: '40px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: isMobile ? '0.98rem' : '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(212, 163, 89, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.25s ease',
            minHeight: 44,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(212, 163, 89, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 163, 89, 0.35)';
          }}
        >
          <BookOpen size={18} />
          <span>Open Our Book</span>
        </button>

        <button
          onClick={onCustomizeBook}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#eedcd0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '13px 20px' : '14px 24px',
            borderRadius: '40px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            fontSize: isMobile ? '0.94rem' : '0.98rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            minHeight: 44,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <PenTool size={16} />
          <span>Customize Cover</span>
        </button>

        <button
          onClick={onCustomizeTheme}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#eedcd0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '13px 20px' : '14px 24px',
            borderRadius: '40px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            fontSize: isMobile ? '0.94rem' : '0.98rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            minHeight: 44,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <Palette size={16} color="#df929e" />
          <span>Theme</span>
        </button>
      </div>

      <p style={{
        marginTop: '28px',
        color: 'rgba(255, 235, 220, 0.45)',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-handwriting)',
        textAlign: 'center',
      }}>
        Tip: Click the book cover or "Open Our Book" to start flipping and decorating.
      </p>
    </div>
  );
};

/**
 * Wrapper export: owns the Theme modal state so the hero stays presentational.
 * Theme changes persist via onUpdateProfile (App autosaves to localStorage).
 */
export const LandingHero: React.FC<LandingHeroProps> = (props) => {
  const [showTheme, setShowTheme] = useState(false);
  const [localProfile, setLocalProfile] = useState(props.profile);

  useEffect(() => setLocalProfile(props.profile), [props.profile]);

  return (
    <>
      <LandingHeroInner
        {...props}
        profile={localProfile}
        onCustomizeTheme={() => setShowTheme(true)}
      />
      {showTheme && (
        <ThemeCustomizerModal
          profile={localProfile}
          onSaveProfile={(updated) => {
            setLocalProfile(updated);
            props.onUpdateProfile?.(updated);
          }}
          onClose={() => setShowTheme(false)}
        />
      )}
    </>
  );
};

export default LandingHero;
