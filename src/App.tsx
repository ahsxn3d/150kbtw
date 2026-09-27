import React, { useState, useCallback, useEffect, useRef } from 'react';
import { NavigationTab, ToastMessage } from './types';
import { SpotlightGlow } from './components/SpotlightGlow';
import { BackgroundVideo } from './components/BackgroundVideo';
import { TacticalHeader } from './components/TacticalHeader';
import { SoundDeck } from './components/SoundDeck';
import { ToastContainer } from './components/Toast';
import { HubPage } from './components/pages/HubPage';
import { ArmoryPage } from './components/pages/ArmoryPage';
import { BattlestationPage } from './components/pages/BattlestationPage';
import { BoardroomPage } from './components/pages/BoardroomPage';
import { AudioPlayerProvider } from './context/AudioContext';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('HUB');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast handler
  const addToast = useCallback((title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Clipboard copy handler with instant toast
  const handleCopy = useCallback(
    async (text: string, title: string = 'Copied to clipboard!') => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        addToast(title, text.length > 50 ? `${text.slice(0, 48)}...` : text);
      } catch (err) {
        addToast('Copied to clipboard!', text.slice(0, 40));
      }
    },
    [addToast]
  );

  const mainRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll and GSAP animations
  useEffect(() => {
    if (!mainRef.current) return;

    const lenis = new Lenis({
      wrapper: mainRef.current,
      content: mainRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
      prevent: (node) => {
        let el: HTMLElement | null = node as HTMLElement;
        while (el && el !== mainRef.current) {
          if (el.hasAttribute('data-lenis-prevent')) return true;
          const style = window.getComputedStyle(el);
          if (
            (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight
          ) {
            return true;
          }
          el = el.parentElement;
        }
        return false;
      },
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Initial GSAP cinematic entrance
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, filter: 'blur(8px)', scale: 0.99 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Dedicated Butter-Smooth Inner Section Scroll Engine
    // When hovering over an inner scrollable section, smoothly shift scroll to that element without jitter
    const smoothScrollMap = new WeakMap<HTMLElement, { current: number; target: number }>();
    let smoothAnimId: number | null = null;
    const activeScrollElements = new Set<HTMLElement>();

    const updateSmoothScroll = () => {
      let hasActive = false;
      activeScrollElements.forEach((el) => {
        const state = smoothScrollMap.get(el);
        if (!state) {
          activeScrollElements.delete(el);
          return;
        }

        const diff = state.target - state.current;
        if (Math.abs(diff) > 0.5) {
          state.current += diff * 0.2; // Silky smooth easing
          el.scrollTop = state.current;
          hasActive = true;
        } else {
          state.current = state.target;
          el.scrollTop = state.target;
          activeScrollElements.delete(el);
        }
      });

      if (hasActive) {
        smoothAnimId = requestAnimationFrame(updateSmoothScroll);
      } else {
        smoothAnimId = null;
      }
    };

    const handleSectionWheel = (e: WheelEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== mainRef.current && target !== document.body) {
        const isScrollable =
          target.hasAttribute('data-lenis-prevent') ||
          ((window.getComputedStyle(target).overflowY === 'auto' || window.getComputedStyle(target).overflowY === 'scroll') &&
            target.scrollHeight > target.clientHeight);

        if (isScrollable) {
          const maxScroll = target.scrollHeight - target.clientHeight;
          if (maxScroll > 1) {
            e.preventDefault();
            e.stopPropagation();

            let state = smoothScrollMap.get(target);
            if (!state) {
              state = { current: target.scrollTop, target: target.scrollTop };
              smoothScrollMap.set(target, state);
            }

            // Sync state with actual scroll position if changed externally
            if (Math.abs(state.current - target.scrollTop) > 25) {
              state.current = target.scrollTop;
              state.target = target.scrollTop;
            }

            state.target = Math.max(0, Math.min(maxScroll, state.target + e.deltaY));
            activeScrollElements.add(target);

            if (!smoothAnimId) {
              smoothAnimId = requestAnimationFrame(updateSmoothScroll);
            }
          }
          return;
        }
        target = target.parentElement;
      }
    };

    window.addEventListener('wheel', handleSectionWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      if (smoothAnimId) cancelAnimationFrame(smoothAnimId);
      window.removeEventListener('wheel', handleSectionWheel);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // When activeTab changes, scroll smoothly to top
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [activeTab]);

  const isTab = (tab: NavigationTab, ...targets: string[]) => {
    return targets.includes(tab);
  };

  return (
    <AudioPlayerProvider>
      <div className="relative min-h-screen h-screen bg-[#09090b] text-neutral-100 flex flex-col justify-between selection:bg-[#ff1e27] selection:text-white overflow-hidden">
        {/* Infinite Looping Cinematic Video Background */}
        <BackgroundVideo />

        {/* Dynamic Cursor Spotlight & Ambient Glow */}
        <SpotlightGlow />

        {/* Instant Tactical Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* Top Tactical HUD Header */}
        <TacticalHeader activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Viewport Container: zero-scroll on HUB, smooth Lenis on other tabs */}
        <main
          ref={mainRef}
          className={`relative z-10 flex-1 min-h-0 w-full flex flex-col ${
            activeTab === 'HUB' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
          <AnimatePresence mode="wait">
            {isTab(activeTab, 'HUB') && (
              <motion.div
                key="HUB"
                initial={{ opacity: 0, y: 8, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.995 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <HubPage
                  onCopy={handleCopy}
                  onNavigateSettings={() => setActiveTab('CONFIG')}
                />
              </motion.div>
            )}

            {isTab(activeTab, 'CONFIG', 'ARMORY') && (
              <motion.div
                key="CONFIG"
                initial={{ opacity: 0, y: 8, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.995 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <ArmoryPage onCopy={handleCopy} />
              </motion.div>
            )}

            {isTab(activeTab, 'SETUP', 'RIG') && (
              <motion.div
                key="SETUP"
                initial={{ opacity: 0, y: 8, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.995 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <BattlestationPage onCopy={handleCopy} />
              </motion.div>
            )}

            {isTab(activeTab, 'REWARDS', 'PARTNERS', 'BOARDROOM') && (
              <motion.div
                key="REWARDS"
                initial={{ opacity: 0, y: 8, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.995 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <BoardroomPage onCopy={handleCopy} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Persistent Bottom Audio Deck (Synchronized with Hero Card) */}
        <SoundDeck />
      </div>
    </AudioPlayerProvider>
  );
}
