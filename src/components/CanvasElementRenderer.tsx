import React, { useRef, useState } from 'react';
import { 
  Trash2, RotateCw, Copy, Lock, Unlock, 
  Sparkles, Heart, Star, ExternalLink, Type, Eye
} from 'lucide-react';
import { PageElement, TextElement, PolaroidElement, StickerElement, PhotoElement, LetterPaperElement } from '../types/scrapbook';

interface CanvasElementRendererProps {
  element: PageElement;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (updated: PageElement) => void;
  onDelete: (id: string) => void;
  onDuplicate: (element: PageElement) => void;
  partnerNames: { partner1: string; partner2: string };
}

export const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  partnerNames,
}) => {
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef({ x: element.x, y: element.y });

  // Mouse Drag Handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id, e);
    if (element.locked) return;

    isDraggingRef.current = true;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    elementStartPosRef.current = { x: element.x, y: element.y };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartPosRef.current.x;
      const dy = moveEvent.clientY - dragStartPosRef.current.y;
      onUpdate({
        ...element,
        x: Math.round(elementStartPosRef.current.x + dx),
        y: Math.round(elementStartPosRef.current.y + dy),
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Quick rotation bump
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      ...element,
      rotation: (element.rotation + 15) % 360,
    });
  };

  // Toggle lock
  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      ...element,
      locked: !element.locked,
    });
  };

  // Touch Support for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (element.locked || e.touches.length !== 1) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    dragStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    elementStartPosRef.current = { x: element.x, y: element.y };

    const handleTouchMove = (moveEvt: TouchEvent) => {
      if (!isDraggingRef.current || moveEvt.touches.length !== 1) return;
      const t = moveEvt.touches[0];
      const dx = t.clientX - dragStartPosRef.current.x;
      const dy = t.clientY - dragStartPosRef.current.y;
      onUpdate({
        ...element,
        x: Math.round(elementStartPosRef.current.x + dx),
        y: Math.round(elementStartPosRef.current.y + dy),
      });
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Render Inner Content based on element type
  const renderContent = () => {
    switch (element.type) {
      case 'text': {
        const textEl = element as TextElement;
        // Check for curved or warped effect
        if (textEl.effect === 'curved') {
          return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${textEl.width} ${textEl.height || 60}`}>
                <path
                  id={`curve-${textEl.id}`}
                  d={`M 10,${(textEl.height || 60) * 0.75} Q ${textEl.width / 2},${(textEl.height || 60) * 0.1} ${textEl.width - 10},${(textEl.height || 60) * 0.75}`}
                  fill="transparent"
                />
                <text
                  fill={textEl.color}
                  fontFamily={textEl.fontFamily}
                  fontSize={textEl.fontSize}
                  fontWeight={textEl.fontWeight}
                >
                  <textPath href={`#curve-${textEl.id}`} startOffset="50%" textAnchor="middle">
                    {textEl.text}
                  </textPath>
                </text>
              </svg>
            </div>
          );
        }

        return (
          <div
            style={{
              fontFamily: textEl.fontFamily,
              fontSize: `${textEl.fontSize}px`,
              color: textEl.color,
              fontWeight: textEl.fontWeight || 'normal',
              fontStyle: textEl.fontStyle || 'normal',
              textAlign: textEl.textAlign || 'left',
              letterSpacing: textEl.letterSpacing ? `${textEl.letterSpacing}px` : 'normal',
              lineHeight: 1.3,
              width: '100%',
              height: '100%',
              userSelect: 'none',
              wordBreak: 'break-word',
              background: textEl.bgColor || 'transparent',
              padding: textEl.bgColor ? '6px 12px' : '0px',
              borderRadius: textEl.bgColor ? '4px' : '0px',
              transform: textEl.effect === 'warped' ? 'skewX(-6deg) scaleY(1.05)' : 'none',
            }}
          >
            {textEl.text}
          </div>
        );
      }

      case 'polaroid': {
        const pol = element as PolaroidElement;
        return (
          <div className="polaroid-frame" style={{ width: '100%', height: '100%' }}>
            {/* Top Washi Tape if enabled */}
            {pol.pinType === 'tape-top' && (
              <div className="washi-tape tape-top-center tape-pattern-dots" />
            )}
            {pol.pinType === 'tape-corner' && (
              <div className="washi-tape tape-corner-left tape-pattern-stripes" />
            )}
            <div className="polaroid-photo-inner">
              <img
                src={pol.src}
                alt={pol.caption || 'Memory Photo'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: pol.filter === 'vintage' ? 'sepia(0.4) contrast(1.1) brightness(0.95)' :
                          pol.filter === 'warm' ? 'sepia(0.2) saturate(1.2)' :
                          pol.filter === 'bw' ? 'grayscale(1)' : 'none',
                }}
                draggable={false}
              />
            </div>
            {pol.caption && <div className="polaroid-caption">{pol.caption}</div>}
            {pol.dateStr && (
              <div style={{
                textAlign: 'right',
                fontSize: '0.75rem',
                color: '#8c7b70',
                fontFamily: 'var(--font-sans)',
                marginTop: '4px',
              }}>
                {pol.dateStr}
              </div>
            )}
          </div>
        );
      }

      case 'photo': {
        const photo = element as PhotoElement;
        return (
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: `${photo.borderRadius || 2}px`,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-paper)',
            border: photo.frame === 'border' ? '5px solid #fff' : 'none',
          }}>
            {photo.hasTape && (
              <div
                className="washi-tape tape-pattern-kraft"
                style={{
                  top: '-10px',
                  left: '20px',
                  width: '80px',
                  transform: 'rotate(-4deg)',
                }}
              />
            )}
            <img
              src={photo.src}
              alt={photo.caption || 'Scrapbook Photo'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: photo.filter === 'warm' ? 'sepia(0.2) saturate(1.2)' :
                        photo.filter === 'vintage' ? 'sepia(0.5)' :
                        photo.filter === 'bw' ? 'grayscale(1)' : 'none',
              }}
              draggable={false}
            />
          </div>
        );
      }

      case 'sticker': {
        const stk = element as StickerElement;
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.min(element.width, element.height) * 0.75}px`,
            filter: stk.hasShadow ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.18))' : 'none',
            border: stk.borderThickness ? `${stk.borderThickness}px solid ${stk.borderColor || '#ffffff'}` : 'none',
            borderRadius: '50%',
            transition: 'transform 0.15s ease',
          }}>
            {stk.customSrc ? (
              <img
                src={stk.customSrc}
                alt="Sticker"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.25))',
                }}
                draggable={false}
              />
            ) : (
              <span>{stk.svgOrEmoji || '❤️'}</span>
            )}
          </div>
        );
      }

      case 'tape': {
        const tapeEl = element as any;
        return (
          <div
            className={`washi-tape ${tapeEl.tapePattern === 'washi-dots' ? 'tape-pattern-dots' : tapeEl.tapePattern === 'washi-stripes' ? 'tape-pattern-stripes' : 'tape-pattern-kraft'}`}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              borderRadius: '2px',
              backgroundColor: tapeEl.tapeColor || '#e0c3a8',
              opacity: 0.85,
            }}
          />
        );
      }

      case 'scrap': {
        const scrap = element as any;
        return (
          <div className="scrap-paper-cutout" style={{ width: '100%', height: '100%' }}>
            {scrap.title && (
              <h4 style={{
                fontFamily: 'var(--font-serif-title)',
                fontSize: '1.1rem',
                color: '#5c2c35',
                marginBottom: '8px',
              }}>
                {scrap.title}
              </h4>
            )}
            <p style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '1.25rem',
              color: '#342921',
              lineHeight: 1.4,
            }}>
              {scrap.bodyText}
            </p>
          </div>
        );
      }

      case 'rating': {
        const rating = element as any;
        return (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(4px)',
            border: '1px dashed #d1c0af',
            borderRadius: '6px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <span style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '0.92rem',
              color: '#42332a',
              fontWeight: 600,
            }}>
              {rating.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-serif-title)',
                fontSize: '1.15rem',
                color: '#8b3a4a',
                fontWeight: 700,
              }}>
                {rating.score}/10
              </span>
              <Heart size={14} fill="#8b3a4a" color="#8b3a4a" />
            </div>
          </div>
        );
      }

      case 'location': {
        const loc = element as any;
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #e2d2c1',
            borderRadius: '20px',
            padding: '6px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}>
            <span style={{ color: '#c46851', fontSize: '14px' }}>📍</span>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 600, color: '#332720' }}>
                {loc.placeName}
              </div>
              {loc.date && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#887467' }}>
                  {loc.date}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'letter-paper': {
        const letter = element as LetterPaperElement;
        return (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'var(--paper-cream)',
            border: '1px solid #e0cfbe',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}>
            {/* Sealed Overlay if locked */}
            {letter.isSealed ? (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(247, 241, 232, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                borderRadius: '4px',
              }}>
                <div className="wax-seal" style={{ marginBottom: '16px' }}>
                  ❤️
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif-title)',
                  fontSize: '1.25rem',
                  color: '#5c202e',
                  marginBottom: '8px',
                }}>
                  Sealed Anniversary Letter
                </h3>
                <p style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: '0.9rem',
                  color: '#6e5a4f',
                  marginBottom: '18px',
                  fontStyle: 'italic',
                }}>
                  "To {letter.toName} — Locked with a wax seal until {letter.unlockDate || 'our special day'}"
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...letter, isSealed: false });
                  }}
                  style={{
                    background: '#8b1e2e',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Break Wax Seal & Read 💌
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-serif-classic)',
                    fontSize: '1.05rem',
                    color: '#8b3a4a',
                    marginBottom: '16px',
                    borderBottom: '1px solid #eadac9',
                    paddingBottom: '8px',
                  }}>
                    {letter.toName}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.35rem',
                    color: '#2d241e',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                  }}>
                    {letter.content}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: '20px',
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({ ...letter, isSealed: true });
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #d4c1b0',
                      borderRadius: '14px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: '#7e6a5d',
                      cursor: 'pointer',
                    }}
                  >
                    Reseal Letter
                  </button>
                  <div style={{
                    fontFamily: 'var(--font-romantic)',
                    fontSize: '1.4rem',
                    color: '#5c202e',
                  }}>
                    {letter.fromName}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }

      default:
        return <div>Unsupported element</div>;
    }
  };

  return (
    <div
      id={`element-${element.id}`}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: element.zIndex,
        opacity: element.opacity !== undefined ? element.opacity : 1,
        cursor: element.locked ? 'default' : 'grab',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Visual Selection Ring & Quick Action HUD */}
      {isSelected && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              border: '2px dashed #bf5b72',
              borderRadius: '6px',
              pointerEvents: 'none',
              zIndex: 99,
            }}
          />

          {/* Micro HUD for quick actions */}
          <div
            style={{
              position: 'absolute',
              top: '-38px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#27201b',
              border: '1px solid #57463b',
              borderRadius: '24px',
              padding: '3px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 100,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Added by tag */}
            <span style={{
              fontSize: '10px',
              color: '#eedcd0',
              fontFamily: 'var(--font-sans)',
              padding: '0 4px',
              borderRight: '1px solid #483930',
            }}>
              By {element.createdBy === 'user1' ? partnerNames.partner1 : partnerNames.partner2}
            </span>

            {/* Rotate */}
            <button
              title="Rotate 15°"
              onClick={handleRotate}
              style={{ background: 'none', border: 'none', color: '#dfcfc2', cursor: 'pointer', display: 'flex' }}
            >
              <RotateCw size={13} />
            </button>

            {/* Duplicate */}
            <button
              title="Duplicate"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(element);
              }}
              style={{ background: 'none', border: 'none', color: '#dfcfc2', cursor: 'pointer', display: 'flex' }}
            >
              <Copy size={13} />
            </button>

            {/* Lock / Unlock */}
            <button
              title={element.locked ? 'Unlock' : 'Lock position'}
              onClick={handleToggleLock}
              style={{ background: 'none', border: 'none', color: element.locked ? '#e29a9a' : '#dfcfc2', cursor: 'pointer', display: 'flex' }}
            >
              {element.locked ? <Lock size={13} /> : <Unlock size={13} />}
            </button>

            {/* Delete */}
            <button
              title="Delete element"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(element.id);
              }}
              style={{ background: 'none', border: 'none', color: '#e87575', cursor: 'pointer', display: 'flex' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}

      {/* Main Element Content */}
      {renderContent()}
    </div>
  );
};
