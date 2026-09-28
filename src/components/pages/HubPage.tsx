import React from 'react';
import { CentralGlassHeroCard } from '../CentralGlassHeroCard';
import { 
  Trophy, 
  ExternalLink, 
  Crosshair, 
  Flame, 
  Copy,
  ChevronRight
} from 'lucide-react';
import { useTwitch } from '../../context/TwitchContext';

interface HubPageProps {
  onCopy: (text: string, title?: string) => void;
  onNavigateSettings: () => void;
}

export const HubPage: React.FC<HubPageProps> = ({ onCopy, onNavigateSettings }) => {
  const { isLive, title, game, viewerCount, uptime } = useTwitch();

  const socials = [
    {
      id: 'twitch',
      name: 'Twitch',
      handle: 'twitch.tv/150k',
      url: 'https://twitch.tv/150k',
      svgIcon: '/twitch.svg',
      color: '#9146ff',
      status: isLive 
        ? `${viewerCount > 0 ? `${viewerCount.toLocaleString()} LIVE` : 'LIVE NOW'}` 
        : 'OFFLINE · 384K VIEWS',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@150kbtw',
      url: 'https://youtube.com/@150kbtw',
      svgIcon: '/youtube.svg',
      color: '#ff0000',
      status: '19.4K SUBS',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      handle: '@150kbtw',
      url: 'https://x.com/150kbtw',
      svgIcon: '/x.svg',
      color: '#ffffff',
      status: 'UPDATES',
    },
    {
      id: 'discord',
      name: 'Discord',
      handle: 'discord.gg/150k',
      url: 'https://discord.gg/150k',
      svgIcon: '/discord.svg',
      color: '#5865f2',
      status: '8.2K MEMBERS',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@150k.btw',
      url: 'https://tiktok.com/@150k.btw',
      svgIcon: '/tiktok-icon-light.svg',
      color: '#ff0050',
      status: '200K+ VIEWS',
    },
    {
      id: 'steam',
      name: 'Steam',
      handle: 'id/150k',
      url: 'https://steamcommunity.com/id/150k',
      svgIcon: '/steam.svg',
      color: '#66c0f4',
      status: 'LEVEL 200',
    },
    {
      id: 'faceit',
      name: 'FACEIT',
      handle: 'mika666',
      url: 'https://faceit.com/en/players/mika666',
      svgIcon: '/faceit.svg',
      color: '#ff5500',
      status: 'LVL 8 · 1800+ ELO',
    },
  ];

  const crosshairCode = 'CSGO-7qR8k-p2Xh7-oK3tq-m4Z9L-88d4E';

  return (
    <div className="w-full h-full flex flex-col justify-between pt-1 pb-3 px-3 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Top Banner / Live Status & Player Bio (Compact) */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Pulsing Live Status Badge / Offline Indicator */}
        {isLive ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-[#ff1e27]/60 shadow-[0_0_15px_rgba(255,30,39,0.35)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e27] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e27]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-white">
              LIVE ON TWITCH · {viewerCount > 0 ? `${viewerCount.toLocaleString()} VIEWERS` : (uptime ? `UPTIME ${uptime.toUpperCase()}` : '30K PREMIER RECORD')}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/70 border border-white/10 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-neutral-500" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-neutral-300">
              OFFLINE · CS2 PREMIER RECORD HOLDER
            </span>
          </div>
        )}

        {/* Player Profile Quick Info */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-neutral-300 bg-neutral-900/60 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
          <span className="text-white font-semibold">Mika</span>
          <span className="text-[#ff1e27]">·</span>
          <span>25 Years Old</span>
          <span className="text-[#ff1e27]">·</span>
          <span className="flex items-center gap-1.5 text-white">
            <span>Switzerland</span>
            <span className="text-xs font-bold text-red-500">🇨🇭</span>
          </span>
        </div>
      </div>

      {/* Main Center Area: Left Stats | Central 3D Glass Hero Card | Right Stream & Settings CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-5 my-auto items-center py-0.5">
        {/* Left Column: Player Record & Crosshair Code */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 order-2 lg:order-1">
          {/* World Record Card */}
          <div className="smoked-glass rounded-2xl p-3.5 sm:p-4 crimson-glow-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff1e27]/10 rounded-full blur-2xl group-hover:bg-[#ff1e27]/20 transition-all pointer-events-none" />
            
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
              <Trophy className="w-3.5 h-3.5 text-[#ff1e27]" />
              <span className="tracking-wider uppercase font-semibold text-neutral-300 text-[11px]">CS2 PREMIER BENCHMARK</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                30,842
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Highest official rating achieved on live stream.
            </p>
          </div>

          {/* Crosshair Quick Action Card */}
          <div className="smoked-glass rounded-2xl p-2.5 crimson-glow-hover flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-neutral-900/90 border border-[#ff1e27]/40 flex items-center justify-center shrink-0">
                <Crosshair className="w-3.5 h-3.5 text-[#ff1e27]" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">CS2 Pro Crosshair</span>
                <span className="block text-[10px] font-mono text-neutral-400 truncate max-w-[160px]">
                  {crosshairCode}
                </span>
              </div>
            </div>

            <button
              onClick={() => onCopy(crosshairCode, 'Crosshair Code Copied!')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-xs font-mono text-white transition-all duration-200 cursor-pointer shrink-0"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Center Column: Central 3D Glass Hero Card with Eye Avatar & Audio Waveform */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 py-0">
          <CentralGlassHeroCard />

          <div className="mt-2 text-center">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight display-font">
              MIKA <span className="text-[#ff1e27]">"150k"</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-mono text-neutral-400 mt-0.5">
              Counter Strike 2 Creator
            </p>
          </div>
        </div>

        {/* Right Column: Official Stream & Pro Settings Quick Link */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 order-3">
          {/* Direct Stream Card */}
          <a
            href="https://twitch.tv/150k"
            target="_blank"
            rel="noopener noreferrer"
            className={`smoked-glass rounded-2xl p-3.5 sm:p-4 crimson-glow-hover block relative overflow-hidden group transition-all ${
              isLive ? 'border-[#ff1e27]/40 shadow-[0_0_20px_rgba(255,30,39,0.15)]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 mb-1.5 text-[11px] font-mono text-neutral-300">
              {isLive ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e27] opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e27]" />
                  </span>
                  <span className="font-bold text-[#ff1e27] tracking-wider uppercase">
                    LIVE NOW · {game.toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#ff1e27]" />
                  <span className="font-semibold text-neutral-300 uppercase">OFFICIAL BROADCAST</span>
                </div>
              )}

              {isLive && viewerCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-[#ff1e27]/40 text-[#ff4d54] text-[10px] font-bold">
                  {viewerCount.toLocaleString()} VIEWERS
                </span>
              )}
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ff1e27] transition-colors flex items-center justify-between">
              <span>{isLive ? 'Watch Mika Live on Stream' : 'Watch Mika on Twitch'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#ff1e27] transition-colors" />
            </h3>

            <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
              {title || 'Catch 400Hz CS2 Premier grinds, clutches, and autoexec mechanics daily.'}
            </p>

            <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#ff4d54] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>twitch.tv/150k</span>
                <ChevronRight className="w-3 h-3" />
              </span>
              <span className="text-neutral-500">
                {isLive ? 'Tap to watch live' : 'Follow for alerts'}
              </span>
            </div>
          </a>

          {/* Quick Settings & Config Link */}
          <div 
            onClick={onNavigateSettings}
            className="smoked-glass rounded-2xl p-2.5 crimson-glow-hover cursor-pointer flex items-center justify-between group transition-all"
          >
            <div>
              <span className="block text-[10px] font-mono font-semibold text-[#ff1e27]">PRO CONFIG</span>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ff1e27] transition-colors">
                Explore CS2 Config & Pro Settings
              </span>
              <span className="block text-[10px] text-neutral-400 mt-0.5">
                Sens, 5:4 Stretched, Left-Hand Viewmodel & Binds
              </span>
            </div>

            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/10 group-hover:border-[#ff1e27] flex items-center justify-center text-white group-hover:text-[#ff1e27] transition-all shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Official Channels & Socials with Real SVG Icons and Visible Gap */}
      <div className="shrink-0 pt-1.5 pb-1 mb-1 sm:mb-2">
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e27]" />
          <span className="font-semibold text-neutral-300">OFFICIAL CHANNELS & SOCIALS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {socials.map((item) => {
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group smoked-glass rounded-xl p-2 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ff1e27]/50 hover:shadow-[0_6px_18px_rgba(255,30,39,0.2)]"
              >
                <div className="w-6 h-6 rounded-lg bg-neutral-900/90 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#ff1e27]/40 p-1 transition-colors">
                  <img
                    src={item.svgIcon}
                    alt={item.name}
                    className="w-4 h-4 object-contain transition-transform group-hover:scale-115"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-white truncate group-hover:text-[#ff1e27] transition-colors leading-tight">
                    {item.name}
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500 truncate">
                    {item.status}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
