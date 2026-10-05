import React from 'react';
import { X, Calendar, MapPin, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { TimelineEvent } from '../types/scrapbook';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  onSelectEventPage: (pageId: string) => void;
  onClose: () => void;
  partnerNames: { partner1: string; partner2: string };
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  onSelectEventPage,
  onClose,
  partnerNames,
}) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(20, 16, 14, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--paper-cream)',
        borderRadius: '18px',
        maxWidth: '780px',
        width: '100%',
        maxHeight: '90vh',
        boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
        border: '1px solid #dfd1bf',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #ebdccb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8f2e7',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} color="#8b3a4a" fill="#8b3a4a" />
              <h3 style={{
                fontFamily: 'var(--font-serif-title)',
                fontSize: '1.4rem',
                color: '#34251d',
              }}>
                Our Relationship Timeline
              </h3>
            </div>
            <p style={{
              fontSize: '0.84rem',
              color: '#7a6557',
              fontFamily: 'var(--font-sans)',
            }}>
              Chronological milestones & dates connecting {partnerNames.partner1} & {partnerNames.partner2}
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

        {/* Timeline Path */}
        <div style={{
          padding: '30px 24px',
          overflowY: 'auto',
          flex: 1,
          background: '#fcfaf6',
          position: 'relative',
        }}>
          {/* Vertical dotted timeline line */}
          <div style={{
            position: 'absolute',
            left: '48px',
            top: '40px',
            bottom: '40px',
            width: '2px',
            background: 'repeating-linear-gradient(to bottom, #c9b4a1, #c9b4a1 6px, transparent 6px, transparent 12px)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {timeline.map((event, idx) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  position: 'relative',
                  marginLeft: '24px',
                }}
              >
                {/* Timeline Node Dot */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: idx % 2 === 0 ? '#5c202e' : '#8b3a4a',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                  zIndex: 2,
                  fontSize: '12px',
                }}>
                  {event.category === 'date' ? '☕' : event.category === 'trip' ? '✈️' : event.category === 'letter' ? '💌' : '❤️'}
                </div>

                {/* Event Card with scrap aesthetic */}
                <div
                  onClick={() => {
                    if (event.pageId) {
                      onSelectEventPage(event.pageId);
                      onClose();
                    }
                  }}
                  style={{
                    flex: 1,
                    background: '#ffffff',
                    border: '1px solid #ebdccb',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                    cursor: event.pageId ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (event.pageId) {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (event.pageId) {
                      e.currentTarget.style.transform = 'translateX(0px)';
                      e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px',
                  }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      color: '#8b3a4a',
                      background: '#faedef',
                      padding: '3px 10px',
                      borderRadius: '12px',
                    }}>
                      {event.date}
                    </span>

                    {event.pageId && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '0.76rem',
                        color: '#6e5a4f',
                      }}>
                        <span>Open scrapbook page</span>
                        <ChevronRight size={14} />
                      </span>
                    )}
                  </div>

                  <h4 style={{
                    fontFamily: 'var(--font-serif-title)',
                    fontSize: '1.15rem',
                    color: '#2d241e',
                    marginBottom: '6px',
                  }}>
                    {event.title}
                  </h4>

                  <p style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '0.9rem',
                    color: '#5b4a3f',
                    lineHeight: 1.4,
                  }}>
                    {event.description}
                  </p>

                  {event.photoUrl && (
                    <div style={{ marginTop: '12px', borderRadius: '6px', overflow: 'hidden', height: '110px', width: '160px' }}>
                      <img src={event.photoUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #ebdccb',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#f8f2e7',
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#5c202e',
              color: '#fff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Back to Scrapbook
          </button>
        </div>
      </div>
    </div>
  );
};
