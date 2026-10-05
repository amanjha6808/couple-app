import React, { useRef, useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Sparkles, Heart, 
  Trash2, Undo2, Redo2, Bookmark, Share2, Users, 
  Sliders, PenTool, Scissors, BookOpen, Clock, Music, Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScrapbookPage, CoupleProfile, PageElement, TimelineEvent } from '../types/scrapbook';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { AddElementMenu } from './AddElementMenu';
import { DoodleCanvas } from './DoodleCanvas';
import { StickerMakerModal } from './StickerMakerModal';
import { NewPageModal } from './NewPageModal';
import { CoverCustomizerModal } from './CoverCustomizerModal';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';
import { TimelineView } from './TimelineView';
import { themeById } from '../theme';

interface BookSpreadViewerProps {
  pages: ScrapbookPage[];
  profile: CoupleProfile;
  activeUser: 'user1' | 'user2';
  onChangeActiveUser: (user: 'user1' | 'user2') => void;
  onUpdatePages: (pages: ScrapbookPage[]) => void;
  onUpdateProfile: (profile: CoupleProfile) => void;
  onCloseToHome: () => void;
  timeline: TimelineEvent[];
}

export const BookSpreadViewer: React.FC<BookSpreadViewerProps> = ({
  pages,
  profile,
  activeUser,
  onChangeActiveUser,
  onUpdatePages,
  onUpdateProfile,
  onCloseToHome,
  timeline,
}) => {
  // Page Spread Index: Spread 0 is [Page 1, Page 2], Spread 1 is [Page 3, Page 4], etc.
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ScrapbookPage[][]>([pages]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Modals state
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showDoodleModal, setShowDoodleModal] = useState(false);
  const [showStickerMaker, setShowStickerMaker] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved just now');
  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Mobile detection: phones show one page at a time (a two-page spread doesn't fit)
  const [isMobile, setIsMobile] = useState<boolean>(() => window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme = themeById(profile.themeStyle);

  // Autosave status indicator simulation
  const triggerSaveNotification = () => {
    setSaveStatus('Saving changes...');
    setTimeout(() => {
      setSaveStatus('Saved just now');
    }, 450);
  };

  // Push new state to history
  const pushState = (newPages: ScrapbookPage[]) => {
    const updatedHistory = history.slice(0, historyIdx + 1);
    updatedHistory.push(newPages);
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    onUpdatePages(newPages);
    triggerSaveNotification();
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      onUpdatePages(history[historyIdx - 1]);
      triggerSaveNotification();
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      onUpdatePages(history[historyIdx + 1]);
      triggerSaveNotification();
    }
  };

  // Pages currently displayed in 2-page spread (or single page on mobile)
  // Filter out page 0 (cover) for inside pages; sort so display order follows page numbers
  const contentPages = pages.filter((p) => p.pageNumber > 0).sort((a, b) => a.pageNumber - b.pageNumber);

  // On mobile show a single page per swipe; on desktop show the classic two-page spread
  const firstVisibleIndex = isMobile ? spreadIndex : spreadIndex * 2;
  const leftPage = contentPages[firstVisibleIndex];
  const rightPage = isMobile ? undefined : contentPages[firstVisibleIndex + 1];

  const totalSpreads = isMobile ? contentPages.length : Math.ceil(contentPages.length / 2);

  // Turn Page with paper sound/feel transition
  const handleNextSpread = () => {
    if (spreadIndex < totalSpreads - 1) {
      setIsFlipping('next');
      setTimeout(() => {
        setSpreadIndex((prev) => prev + 1);
        setIsFlipping(null);
        setSelectedElementId(null);
      }, 250);
    }
  };

  const handlePrevSpread = () => {
    if (spreadIndex > 0) {
      setIsFlipping('prev');
      setTimeout(() => {
        setSpreadIndex((prev) => prev - 1);
        setIsFlipping(null);
        setSelectedElementId(null);
      }, 250);
    }
  };

  // Update specific element on specific page
  const handleUpdateElement = (pageId: string, updatedElement: PageElement) => {
    const nextPages = pages.map((page) => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        updatedAt: Date.now(),
        elements: page.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
      };
    });
    pushState(nextPages);
  };

  // Delete element
  const handleDeleteElement = (pageId: string, elementId: string) => {
    const nextPages = pages.map((page) => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        updatedAt: Date.now(),
        elements: page.elements.filter((el) => el.id !== elementId),
      };
    });
    setSelectedElementId(null);
    pushState(nextPages);
  };

  // Duplicate element
  const handleDuplicateElement = (pageId: string, element: PageElement) => {
    const duplicated: PageElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: element.zIndex + 1,
      createdAt: Date.now(),
    };
    const nextPages = pages.map((page) => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        updatedAt: Date.now(),
        elements: [...page.elements, duplicated],
      };
    });
    setSelectedElementId(duplicated.id);
    pushState(nextPages);
  };

  // Add new element to whichever page is selected or default to left
  const handleAddElementToPage = (newEl: Omit<PageElement, 'id' | 'createdAt'>) => {
    const targetPageId = selectedPageId || leftPage?.id || rightPage?.id;
    if (!targetPageId) return;

    const fullElement: PageElement = {
      ...newEl,
      id: `${newEl.type}-${Date.now()}`,
      createdAt: Date.now(),
      createdBy: activeUser,
    } as PageElement;

    const nextPages = pages.map((page) => {
      if (page.id !== targetPageId) return page;
      return {
        ...page,
        updatedAt: Date.now(),
        elements: [...page.elements, fullElement],
      };
    });

    setSelectedElementId(fullElement.id);
    pushState(nextPages);

    // Sparkle celebratory burst
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#df929e', '#f6e29d', '#8b3a4a'],
    });
  };

  // Toggle bookmark on page
  const handleToggleBookmark = (pageId: string) => {
    const nextPages = pages.map((p) => (p.id === pageId ? { ...p, bookmark: !p.bookmark } : p));
    pushState(nextPages);
  };

  // Add new page to book
  const handleCreateNewPage = (newPageData: Omit<ScrapbookPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: ScrapbookPage = {
      ...newPageData,
      id: `page-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const nextPages = [...pages, newPage];
    pushState(nextPages);
    // Jump spread to the newly created page
    const newSpread = Math.floor((nextPages.filter((p) => p.pageNumber > 0).length - 1) / 2);
    setSpreadIndex(newSpread);
  };

  // Jump to specific page from timeline or bookmark
  const handleJumpToPageId = (pageId: string) => {
    const idx = contentPages.findIndex((p) => p.id === pageId);
    if (idx !== -1) {
      setSpreadIndex(isMobile ? idx : Math.floor(idx / 2));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.bg,
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Top Intimate Couple Navigation Bar */}
      <header style={{
        padding: isMobile ? '10px 12px' : '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        background: 'rgba(28, 21, 18, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 230, 200, 0.1)',
        zIndex: 50,
      }}>
        {/* Left: Book Title & Cover Jump */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onCloseToHome}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#eedcd0',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <BookOpen size={14} color="#d4af37" />
            <span>Cover</span>
          </button>

          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif-title)',
              fontSize: '1.2rem',
              color: '#f6e7d8',
              letterSpacing: '0.5px',
            }}>
              {profile.bookTitle}
            </h2>
            <div style={{
              fontSize: '0.74rem',
              color: '#ab9587',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>{profile.partner1} & {profile.partner2}</span>
              <span>•</span>
              <span style={{ color: '#88bf88' }}>{saveStatus}</span>
            </div>
          </div>
        </div>

        {/* Center: Partner Presence Switcher ("Aman is editing" / "Sarah is editing") */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 245, 235, 0.08)',
          border: '1px solid rgba(255, 230, 200, 0.15)',
          padding: '4px 10px',
          borderRadius: '30px',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#ab9587' }}>Partner editing:</span>
          <button
            onClick={() => onChangeActiveUser('user1')}
            style={{
              background: activeUser === 'user1' ? '#5c202e' : 'transparent',
              color: activeUser === 'user1' ? '#fff' : '#cdb8aa',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {profile.partner1}
          </button>
          <button
            onClick={() => onChangeActiveUser('user2')}
            style={{
              background: activeUser === 'user2' ? '#8b3a4a' : 'transparent',
              color: activeUser === 'user2' ? '#fff' : '#cdb8aa',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {profile.partner2}
          </button>
        </div>

        {/* Right Tools: Timeline, Add Page, Undo/Redo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Undo / Redo */}
          <button
            title="Undo"
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            style={{
              background: 'none',
              border: 'none',
              color: historyIdx > 0 ? '#eedcd0' : '#57463c',
              cursor: historyIdx > 0 ? 'pointer' : 'default',
              padding: '6px',
            }}
          >
            <Undo2 size={16} />
          </button>

          <button
            title="Redo"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            style={{
              background: 'none',
              border: 'none',
              color: historyIdx < history.length - 1 ? '#eedcd0' : '#57463c',
              cursor: historyIdx < history.length - 1 ? 'pointer' : 'default',
              padding: '6px',
            }}
          >
            <Redo2 size={16} />
          </button>

          {/* Timeline View Button */}
          <button
            onClick={() => setShowTimelineModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 230, 200, 0.15)',
              color: '#eedcd0',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
            }}
          >
            <Clock size={14} color="#df929e" />
            <span>Timeline</span>
          </button>

          {/* Customize Theme */}
          <button
            onClick={() => setShowThemeModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 230, 200, 0.15)',
              color: '#eedcd0',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
            }}
          >
            <Palette size={14} color={theme.accent} />
            <span>Theme</span>
          </button>

          {/* Customize Cover */}
          <button
            onClick={() => setShowCoverModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 230, 200, 0.15)',
              color: '#eedcd0',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
            }}
          >
            <Sliders size={14} />
            <span>Cover</span>
          </button>

          {/* Turn New Page */}
          <button
            onClick={() => setShowNewPageModal(true)}
            style={{
              background: '#5c202e',
              border: 'none',
              color: '#fff',
              padding: '7px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.84rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(92, 32, 46, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>Turn New Page</span>
          </button>
        </div>
      </header>

      {/* Main Two-Page Spread Canvas Workspace */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '18px 10px 110px 10px' : '30px 20px 90px 20px',
        position: 'relative',
      }}
      onClick={() => setSelectedElementId(null)}
      >
        {/* Navigation Arrows Left & Right */}
        <button
          onClick={handlePrevSpread}
          disabled={spreadIndex === 0}
          title="Previous Pages"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: spreadIndex > 0 ? 'rgba(50, 40, 34, 0.85)' : 'rgba(30, 24, 20, 0.3)',
            border: '1px solid rgba(255, 230, 200, 0.2)',
            color: spreadIndex > 0 ? '#f0e3d6' : '#57463b',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: spreadIndex > 0 ? 'pointer' : 'default',
            backdropFilter: 'blur(8px)',
            zIndex: 40,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNextSpread}
          disabled={spreadIndex >= totalSpreads - 1}
          title="Next Pages"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: spreadIndex < totalSpreads - 1 ? 'rgba(50, 40, 34, 0.85)' : 'rgba(30, 24, 20, 0.3)',
            border: '1px solid rgba(255, 230, 200, 0.2)',
            color: spreadIndex < totalSpreads - 1 ? '#f0e3d6' : '#57463b',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: spreadIndex < totalSpreads - 1 ? 'pointer' : 'default',
            backdropFilter: 'blur(8px)',
            zIndex: 40,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Real Physical Two-Page Book Spread Container */}
        <div
          className={`book-spread-open ${isFlipping ? 'opacity-80 scale-98' : ''}`}
          style={{
            display: 'flex',
            maxWidth: isMobile ? '100%' : '820px',
            width: '100%',
            height: '750px',
            boxShadow: 'var(--shadow-book-spread)',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            background: '#f6f1e8',
            transition: 'transform 0.25s ease, opacity 0.25s ease',
          }}
        >
          {/* LEFT PAGE */}
          {leftPage ? (
            <div
              id={`page-${leftPage.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPageId(leftPage.id);
              }}
              className={`texture-${leftPage.paperTexture || 'creamy-canvas'}`}
              style={{
                flex: 1,
                height: '100%',
                position: 'relative',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: 'inset -25px 0 35px -15px rgba(40, 25, 18, 0.2)',
                padding: isMobile ? '14px' : '24px',
                overflow: 'hidden',
              }}
            >
              {/* Ribbon Bookmark Corner */}
              {leftPage.bookmark && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: '28px',
                  width: '24px',
                  height: '42px',
                  background: '#8b2030',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
                  zIndex: 25,
                  boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
                }} />
              )}

              {/* Spine shadow gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '35px',
                background: 'linear-gradient(to left, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.02) 60%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 20,
              }} />

              {/* Page Number & Chapter */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '24px',
                right: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#8b7a6e',
                fontFamily: 'var(--font-sans)',
                pointerEvents: 'none',
              }}>
                <span>{leftPage.chapter || `${profile.partner1} & ${profile.partner2}`}</span>
                <span>Page {leftPage.pageNumber}</span>
              </div>

              {/* Elements on Left Page */}
              {leftPage.elements.map((el) => (
                <CanvasElementRenderer
                  key={el.id}
                  element={el}
                  isSelected={selectedElementId === el.id}
                  onSelect={(id) => {
                    setSelectedElementId(id);
                    setSelectedPageId(leftPage.id);
                  }}
                  onUpdate={(updated) => handleUpdateElement(leftPage.id, updated)}
                  onDelete={(id) => handleDeleteElement(leftPage.id, id)}
                  onDuplicate={(targetEl) => handleDuplicateElement(leftPage.id, targetEl)}
                  partnerNames={{ partner1: profile.partner1, partner2: profile.partner2 }}
                />
              ))}
            </div>
          ) : (
            <div style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f9f5ee',
            }}>
              <p style={{ color: '#9d887a', fontStyle: 'italic' }}>Inside Front Cover</p>
            </div>
          )}

          {/* Book Spine Center Gutter (desktop only) */}
          {!isMobile && (
            <div style={{
              width: '6px',
              height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.25), rgba(255,255,255,0.1), rgba(0,0,0,0.25))',
              boxShadow: '0 0 10px rgba(0,0,0,0.4)',
              zIndex: 30,
            }} />
          )}

          {/* RIGHT PAGE — desktop spread only. On mobile the single page fills the view. */}
          {!isMobile && (rightPage ? (
            <div
              id={`page-${rightPage.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPageId(rightPage.id);
              }}
              className={`texture-${rightPage.paperTexture || 'creamy-canvas'}`}
              style={{
                flex: 1,
                height: '100%',
                position: 'relative',
                boxShadow: 'inset 25px 0 35px -15px rgba(40, 25, 18, 0.2)',
                padding: isMobile ? '14px' : '24px',
                overflow: 'hidden',
              }}
            >
              {/* Ribbon Bookmark Corner */}
              {rightPage.bookmark && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: '28px',
                  width: '24px',
                  height: '42px',
                  background: '#8b2030',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
                  zIndex: 25,
                  boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
                }} />
              )}

              {/* Spine shadow gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '35px',
                background: 'linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.02) 60%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 20,
              }} />

              {/* Page Number & Date */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '24px',
                right: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#8b7a6e',
                fontFamily: 'var(--font-sans)',
                pointerEvents: 'none',
              }}>
                <span>Page {rightPage.pageNumber}</span>
                <span>{rightPage.dateStr || ''}</span>
              </div>

              {/* Elements on Right Page */}
              {rightPage.elements.map((el) => (
                <CanvasElementRenderer
                  key={el.id}
                  element={el}
                  isSelected={selectedElementId === el.id}
                  onSelect={(id) => {
                    setSelectedElementId(id);
                    setSelectedPageId(rightPage.id);
                  }}
                  onUpdate={(updated) => handleUpdateElement(rightPage.id, updated)}
                  onDelete={(id) => handleDeleteElement(rightPage.id, id)}
                  onDuplicate={(targetEl) => handleDuplicateElement(rightPage.id, targetEl)}
                  partnerNames={{ partner1: profile.partner1, partner2: profile.partner2 }}
                />
              ))}
            </div>
          ) : (
            <div style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f9f5ee',
              padding: '30px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-serif-title)',
                fontSize: '1.25rem',
                color: '#5c2c35',
                marginBottom: '8px',
              }}>
                Your story starts here.
              </p>
              <p style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '0.92rem',
                color: '#7a6659',
                marginBottom: '20px',
              }}>
                Add your next little memory to keep building your shared book.
              </p>
              <button
                onClick={() => setShowNewPageModal(true)}
                style={{
                  background: '#5c202e',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={15} />
                <span>Turn to Page {contentPages.length + 1}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Page Thumbnails & Bookmark Indicator */}
        <div style={{
          marginTop: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(38, 30, 25, 0.75)',
          padding: '6px 16px',
          borderRadius: '30px',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.82rem', color: '#c7b4a6', fontFamily: 'var(--font-sans)' }}>
            {rightPage
              ? `Pages ${leftPage ? leftPage.pageNumber : ''} – ${rightPage.pageNumber} of ${contentPages.length}`
              : `Page ${leftPage ? leftPage.pageNumber : ''} of ${contentPages.length}`}
          </span>

          {leftPage && (
            <button
              onClick={() => handleToggleBookmark(leftPage.id)}
              title={leftPage.bookmark ? 'Remove bookmark' : 'Bookmark this page'}
              style={{
                background: 'none',
                border: 'none',
                color: leftPage.bookmark ? '#df929e' : '#735f52',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Bookmark size={15} fill={leftPage.bookmark ? '#df929e' : 'none'} />
            </button>
          )}
        </div>
      </main>

      {/* Floating Bottom Scrapbook Creative Toolbox */}
      <footer style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(32, 24, 20, 0.95)',
        border: '1px solid rgba(255, 230, 200, 0.2)',
        borderRadius: '50px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backdropFilter: 'blur(12px)',
        zIndex: 80,
      }}>
        <button
          onClick={() => setShowAddMenu(true)}
          style={{
            background: 'linear-gradient(135deg, #d4a359 0%, #aa772d 100%)',
            color: '#1a120b',
            border: 'none',
            padding: isMobile ? '10px 14px' : '10px 20px',
            borderRadius: '30px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(212, 163, 89, 0.35)',
          }}
        >
          <Sparkles size={16} />
          <span>Add to Page</span>
        </button>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

        {/* Quick Shortcut Buttons */}
        <button
          onClick={() => setShowStickerMaker(true)}
          title="Turn Photo into Die-Cut Sticker"
          style={{
            background: 'none',
            border: 'none',
            color: '#eedcd0',
            cursor: 'pointer',
            padding: isMobile ? '8px 10px' : '8px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
          }}
        >
          <Scissors size={15} color="#e0a3b0" />
          {!isMobile && <span>Photo Sticker</span>}
        </button>

        <button
          onClick={() => setShowDoodleModal(true)}
          title="Handmade Doodle Canvas"
          style={{
            background: 'none',
            border: 'none',
            color: '#eedcd0',
            cursor: 'pointer',
            padding: isMobile ? '8px 10px' : '8px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
          }}
        >
          <PenTool size={15} color="#a1cca5" />
          {!isMobile && <span>Doodle</span>}
        </button>
      </footer>

      {/* MODALS */}
      {showAddMenu && (
        <AddElementMenu
          onClose={() => setShowAddMenu(false)}
          onAddElement={handleAddElementToPage}
          onOpenDoodle={() => setShowDoodleModal(true)}
          onOpenStickerMaker={() => setShowStickerMaker(true)}
          partner={activeUser}
        />
      )}

      {showDoodleModal && (
        <DoodleCanvas
          width={580}
          height={360}
          onSaveDoodle={handleAddElementToPage}
          onClose={() => setShowDoodleModal(false)}
          partner={activeUser}
        />
      )}

      {showStickerMaker && (
        <StickerMakerModal
          onClose={() => setShowStickerMaker(false)}
          onAddSticker={handleAddElementToPage}
          partner={activeUser}
        />
      )}

      {showNewPageModal && (
        <NewPageModal
          onClose={() => setShowNewPageModal(false)}
          onCreatePage={handleCreateNewPage}
          nextPageNumber={contentPages.length + 1}
        />
      )}

      {showCoverModal && (
        <CoverCustomizerModal
          profile={profile}
          onSaveProfile={(updated) => {
            onUpdateProfile(updated);
            triggerSaveNotification();
          }}
          onClose={() => setShowCoverModal(false)}
        />
      )}

      {showThemeModal && (
        <ThemeCustomizerModal
          profile={profile}
          onSaveProfile={(updated) => {
            onUpdateProfile(updated);
            triggerSaveNotification();
          }}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {showTimelineModal && (
        <TimelineView
          timeline={timeline}
          onSelectEventPage={handleJumpToPageId}
          onClose={() => setShowTimelineModal(false)}
          partnerNames={{ partner1: profile.partner1, partner2: profile.partner2 }}
        />
      )}
    </div>
  );
};
