import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { NavigationTab } from '../types';
import { Radio, ExternalLink } from 'lucide-react';

interface TacticalHeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  activeTab,
  onSelectTab,
}) => {
  // Real-time visitor counter badge that fluctuates realistically
  const [visitorCount, setVisitorCount] = useState<number>(1482);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(1420, Math.min(1560, prev + delta));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Standardize activeTab to primary IDs
  const normalizedTab: 'HUB' | 'CONFIG' | 'SETUP' | 'PARTNERS' = 
    activeTab === 'ARMORY' ? 'CONFIG' :
    activeTab === 'RIG' ? 'SETUP' :
    activeTab === 'BOARDROOM' ? 'PARTNERS' :
    activeTab as 'HUB' | 'CONFIG' | 'SETUP' | 'PARTNERS';

  const tabs: { id: NavigationTab; label: string; index: string }[] = [
    { id: 'HUB', label: 'OVERVIEW', index: '01' },
    { id: 'CONFIG', label: 'SETTINGS', index: '02' },
    { id: 'SETUP', label: 'SETUP', index: '03' },
    { id: 'PARTNERS', label: 'PARTNERS', index: '04' },
  ];

  return (
    <header className="w-full shrink-0 border-b border-white/10 bg-[#09090b]/85 backdrop-blur-2xl z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3.5">
          <div 
            onClick={() => onSelectTab('HUB')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-neutral-900 border border-[#ff1e27]/40 flex items-center justify-center overflow-hidden group-hover:border-[#ff1e27] transition-colors">
              <span className="w-3 h-3 rounded-full bg-[#ff1e27] shadow-[0_0_10px_#ff1e27] group-hover:scale-125 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff1e27]/20 to-transparent" />
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#ff1e27] transition-colors display-font">
                150k_btw
              </span>
            </div>
          </div>

          {/* Real-time Live Viewers & Total Number of Viewers Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-white/10 text-[11px] font-mono text-neutral-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e27] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e27]" />
            </span>
            <span className="tabular-nums font-bold text-white">
              {visitorCount.toLocaleString()}
            </span>
            <span className="text-[#ff4d54] uppercase tracking-wider text-[10px] font-semibold">
              Live
            </span>
            <span className="text-neutral-600">·</span>
            <span className="tabular-nums font-semibold text-neutral-300">
              18.4K
            </span>
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
              Total Views
            </span>
          </div>
        </div>

        {/* 4 Clean Gaming Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-neutral-950/70 border border-white/5">
          {tabs.map((tab) => {
            const isActive = normalizedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-mono tracking-wide rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHudTab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff1e27]/20 via-[#ff1e27]/30 to-[#ff1e27]/20 border border-[#ff1e27]/50 shadow-[0_0_15px_rgba(255,30,39,0.3)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span className={isActive ? 'text-[#ff4d54]' : 'text-neutral-500'}>
                    [{tab.index} //
                  </span>
                  <span>{tab.label}]</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Zone: Twitch Quick Stream Pill */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://twitch.tv/150k"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#ff1e27]/10 hover:bg-[#ff1e27] border border-[#ff1e27]/40 hover:border-[#ff1e27] text-white text-xs font-semibold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(255,30,39,0.15)] group"
          >
            <Radio className="w-3.5 h-3.5 text-[#ff1e27] group-hover:text-white animate-pulse" />
            <span className="uppercase font-mono text-[11px]">TWITCH.TV/150K</span>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-white" />
          </a>
        </div>
      </div>
    </header>
  );
};
