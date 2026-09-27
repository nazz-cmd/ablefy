import React, { useState, useEffect } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { SkipToContent } from './components/layout/SkipToContent';
import { ReadingRuler } from './components/accessibility/ReadingRuler';
import { AppSidebar } from './components/layout/AppSidebar';
import { TopAppBar } from './components/layout/TopAppBar';
import { HomeWorkspace } from './components/home/HomeWorkspace';
import { LectureCompanion } from './components/workspace/LectureCompanion';
import { UniversalStudio } from './components/studio/UniversalStudio';
import { SignHub } from './components/bisindo/SignHub';
import { MotorShortcutsModal } from './components/accessibility/MotorShortcutsModal';
import { VoiceNavigator } from './components/accessibility/VoiceNavigator';
import { LandingPage } from './components/landing/LandingPage';
import { MobileBottomBar } from './components/layout/MobileBottomBar';

/**
 * Parses initial route from window.location.pathname for professional clean URL structure
 */
const parseRouteFromPath = (): { view: 'landing' | 'app'; tab: string } => {
  if (typeof window === 'undefined') return { view: 'landing', tab: 'home' };
  const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (rawPath === '/beranda' || rawPath === '/home') return { view: 'app', tab: 'home' };
  if (rawPath === '/pembaca' || rawPath === '/studio') return { view: 'app', tab: 'studio' };
  if (rawPath === '/transkripsi' || rawPath === '/lecture') return { view: 'app', tab: 'lecture' };
  if (rawPath === '/isyarat' || rawPath === '/bisindo') return { view: 'app', tab: 'bisindo' };

  // Query parameter fallback for backwards compatibility
  try {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const tab = params.get('tab');
    if (tab && ['home', 'studio', 'lecture', 'bisindo'].includes(tab)) {
      return { view: 'app', tab };
    }
    if (view === 'app') return { view: 'app', tab: 'home' };
  } catch (_) {}

  return { view: 'landing', tab: 'home' };
};

export const AppContent: React.FC = () => {
  const initialRoute = parseRouteFromPath();
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(initialRoute.view);
  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab);

  // Sync browser URL bar with current view & tab (e.g. /beranda, /pembaca, /transkripsi, /isyarat, /)
  const syncBrowserUrl = (view: 'landing' | 'app', tab: string, push: boolean = true) => {
    if (typeof window === 'undefined') return;
    const targetPath = view === 'landing' ? '/' : (
      tab === 'studio' ? '/pembaca' :
      tab === 'lecture' ? '/transkripsi' :
      tab === 'bisindo' ? '/isyarat' : '/beranda'
    );

    if (window.location.pathname !== targetPath) {
      if (push) {
        window.history.pushState({ view, tab }, '', targetPath);
      } else {
        window.history.replaceState({ view, tab }, '', targetPath);
      }
    }
  };

  // Listen to browser Back and Forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      const current = parseRouteFromPath();
      setViewMode(current.view);
      setActiveTab(current.tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ablefy_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const {
    voiceCues,
    speakText,
    speakCue,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    toggleRightPanel,
    contrastMode,
    setContrastMode,
    voiceNavActive,
    setVoiceNavActive,
  } = useAccessibility();

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ablefy_sidebar_collapsed', String(next));
      } catch (_) {}
      speakCue(next ? 'Bilah navigasi kiri diciutkan' : 'Bilah navigasi kiri dibuka');
      return next;
    });
  };

  const handleNavigateTab = (tabId: string) => {
    setActiveTab(tabId);
    setViewMode('app');
    syncBrowserUrl('app', tabId, true);

    const tabNames: Record<string, string> = {
      'home': 'Beranda',
      'studio': 'Pembaca Teks',
      'lecture': 'Transkripsi Wicara',
      'bisindo': 'Bahasa Isyarat'
    };
    const tabName = tabNames[tabId] || 'Ruang Kerja Ablefy';
    speakCue(`Membuka ${tabName}`);
  };

  const handleLaunchApp = (tabId?: string) => {
    const target = tabId || 'home';
    setViewMode('app');
    setActiveTab(target);
    syncBrowserUrl('app', target, true);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const tabNames: Record<string, string> = {
      'home': 'Beranda',
      'studio': 'Pembaca Teks',
      'lecture': 'Transkripsi Wicara',
      'bisindo': 'Bahasa Isyarat'
    };
    const tabName = tabNames[target] || 'Ruang Kerja Ablefy';
    speakCue(`Membuka ${tabName}`);
  };

  const handleBackToLanding = () => {
    setViewMode('landing');
    syncBrowserUrl('landing', 'home', true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    speakCue('Kembali ke Halaman Depan Publik');
  };

  // Global Action Event Bus listener (supports voice navigation actions across modules)
  useEffect(() => {
    const handleGlobalAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: string; payload?: any }>;
      const { action } = customEvent.detail || {};

      if (action === 'GO_HOME') {
        setViewMode('app');
        setActiveTab('home');
      } else if (action === 'GO_LECTURE' || action === 'START_RECORDING') {
        setViewMode('app');
        setActiveTab('lecture');
      } else if (action === 'GO_STUDIO' || action === 'PLAY_TTS' || action === 'READ_CLIPBOARD') {
        setViewMode('app');
        setActiveTab('studio');
      } else if (action === 'GO_BISINDO') {
        setViewMode('app');
        setActiveTab('bisindo');
      } else if (action === 'GO_LANDING') {
        handleBackToLanding();
      } else if (action === 'TOGGLE_SIDEBAR') {
        handleToggleSidebar();
      } else if (action === 'TOGGLE_RIGHT_PANEL') {
        toggleRightPanel();
      }
    };

    window.addEventListener('ablefy-action', handleGlobalAction);
    return () => window.removeEventListener('ablefy-action', handleGlobalAction);
  }, [toggleRightPanel]);

  // Global Single-Key Shortcuts for Motor-Disabled Users (WCAG 2.1.4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === '0' || e.key.toLowerCase() === 'h') {
        if (viewMode === 'app') {
          setActiveTab('home');
          speakCue('Beralih ke Beranda');
        } else {
          handleLaunchApp('home');
        }
      } else if (e.key === '1') {
        handleLaunchApp('lecture');
        speakCue('Beralih ke Transkripsi Wicara');
      } else if (e.key === '2') {
        handleLaunchApp('studio');
        speakCue('Beralih ke Pembaca Teks');
      } else if (e.key === '3') {
        handleLaunchApp('bisindo');
        speakCue('Beralih ke Bahasa Isyarat');
      } else if (e.key === '[' && viewMode === 'app') {
        handleToggleSidebar();
      } else if (e.key === ']' && viewMode === 'app') {
        toggleRightPanel();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setIsShortcutsModalOpen(!isShortcutsModalOpen);
      } else if (e.key.toLowerCase() === 'k' && !e.ctrlKey && !e.metaKey) {
        setContrastMode(contrastMode === 'yellow-black' ? 'normal' : 'yellow-black');
      } else if (e.key.toLowerCase() === 'v') {
        setVoiceNavActive(!voiceNavActive);
      } else if (e.key === 'Escape' && viewMode === 'app') {
        handleBackToLanding();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    viewMode,
    voiceCues,
    speakText,
    speakCue,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    toggleRightPanel,
    contrastMode,
    setContrastMode,
    voiceNavActive,
    setVoiceNavActive
  ]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#fafafa] text-slate-900 transition-colors selection:bg-blue-100 selection:text-blue-900">
      {/* WCAG Mandatory Skip Landmark */}
      <SkipToContent />

      {/* Floating Reading Ruler for Dyslexia / Focus */}
      <ReadingRuler />

      {/* VIEW 1: Public High-Conversion Landing Page (Speechify & Otter.ai Benchmark) */}
      {viewMode === 'landing' ? (
        <LandingPage onLaunchApp={handleLaunchApp} />
      ) : (
        /* VIEW 2: Assistive Workspace Canvas */
        <div className="pb-20 lg:pb-0 min-h-screen w-full max-w-full overflow-x-hidden">
          {/* Permanent Desktop Navigation Rail & Mobile Slide-In Off-Canvas Drawer */}
          <AppSidebar
            activeTab={activeTab}
            setActiveTab={handleNavigateTab}
            onBackToLanding={handleBackToLanding}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Workspace Canvas (Smooth Offset by Sidebar on Desktop) */}
          <div
            className={`flex flex-col min-h-screen w-full max-w-full min-w-0 overflow-x-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
            }`}
          >
            {/* Professional Top Utility App Bar */}
            <TopAppBar
              activeTab={activeTab}
              onNavigateTab={handleNavigateTab}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />

            {/* Active Module Canvas */}
            <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden focus:outline-none">
              {activeTab === 'home' && <HomeWorkspace onNavigate={handleNavigateTab} />}
              {activeTab === 'lecture' && <LectureCompanion />}
              {activeTab === 'studio' && <UniversalStudio />}
              {activeTab === 'bisindo' && <SignHub />}
            </main>
          </div>

          {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
          <MobileBottomBar activeTab={activeTab} setActiveTab={handleNavigateTab} />
        </div>
      )}

      {/* Hands-Free Voice Navigator for Quadriplegic / No-Hand Users */}
      <VoiceNavigator
        isLanding={viewMode === 'landing'}
        onNavigateTab={(tabId) => handleNavigateTab(tabId)}
      />

      {/* Motor & Single-Key Shortcut Sheet for Switch Devices & Motor-Disabled Users */}
      <MotorShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onNavigateTab={(tabId) => handleNavigateTab(tabId)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
