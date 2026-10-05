import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROFILE, 
  INITIAL_PAGES, 
  INITIAL_TIMELINE 
} from './data/initialScrapbookData';
import { ScrapbookPage, CoupleProfile, TimelineEvent } from './types/scrapbook';
import { LandingHero } from './components/LandingHero';
import { BookSpreadViewer } from './components/BookSpreadViewer';
import { CoverCustomizerModal } from './components/CoverCustomizerModal';

const STORAGE_KEY_PAGES = 'our_little_book_pages_v3';
const STORAGE_KEY_PROFILE = 'our_little_book_profile_v3';
const STORAGE_KEY_TIMELINE = 'our_little_book_timeline_v3';

export const App: React.FC = () => {
  // App navigation state: 'cover' (landing / closed book) or 'journal' (opened two-page scrapbook)
  const [viewMode, setViewMode] = useState<'cover' | 'journal'>('cover');

  // Load from local storage or use rich starter state
  const [profile, setProfile] = useState<CoupleProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [pages, setPages] = useState<ScrapbookPage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PAGES);
    return saved ? JSON.parse(saved) : INITIAL_PAGES;
  });

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMELINE);
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
  });

  const [activeUser, setActiveUser] = useState<'user1' | 'user2'>('user1');
  const [showCoverCustomize, setShowCoverCustomize] = useState(false);

  // Autosave to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAGES, JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIMELINE, JSON.stringify(timeline));
  }, [timeline]);

  const totalMemoriesCount = pages.reduce((acc, p) => acc + p.elements.length, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#231b16', color: '#2d241e' }}>
      {viewMode === 'cover' ? (
        <LandingHero
          profile={profile}
          pageCount={pages.filter((p) => p.pageNumber > 0).length}
          memoryCount={totalMemoriesCount}
          onOpenBook={() => setViewMode('journal')}
          onCustomizeBook={() => setShowCoverCustomize(true)}
          onUpdateProfile={setProfile}
        />
      ) : (
        <BookSpreadViewer
          pages={pages}
          profile={profile}
          activeUser={activeUser}
          onChangeActiveUser={setActiveUser}
          onUpdatePages={setPages}
          onUpdateProfile={setProfile}
          onCloseToHome={() => setViewMode('cover')}
          timeline={timeline}
        />
      )}

      {showCoverCustomize && (
        <CoverCustomizerModal
          profile={profile}
          onSaveProfile={setProfile}
          onClose={() => setShowCoverCustomize(false)}
        />
      )}
    </div>
  );
};

export default App;
