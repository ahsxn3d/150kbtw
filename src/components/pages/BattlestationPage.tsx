import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  HardDrive, 
  Disc, 
  Fan, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Headphones, 
  Zap,
  Activity,
  Sparkles
} from 'lucide-react';
import { HardwareItem } from '../../types';

interface BattlestationPageProps {
  onCopy: (text: string, title?: string) => void;
}

export const BattlestationPage: React.FC<BattlestationPageProps> = ({ onCopy }) => {
  const [filter, setFilter] = useState<'ALL' | 'CORE' | 'PERIPHERALS'>('ALL');

  const hardwareList: HardwareItem[] = [
    // Core Tower Components
    {
      id: 'cpu',
      category: 'CORE RIG',
      type: 'Processor / CPU',
      name: 'AMD Ryzen 9 9950X3D',
      specs: '16 Cores / 32 Threads · 3D V-Cache · Boost up to 5.7GHz',
      highlight: 'Engineered for maximum 1% low framerate stability on CS2 Sub-Tick servers.',
      badge: 'FLAGSHIP X3D',
      image: '/hardware/cpu.jpg',
    },
    {
      id: 'gpu',
      category: 'CORE RIG',
      type: 'Graphics / GPU',
      name: 'ASUS ROG Strix GeForce RTX 5080 Gaming OC',
      specs: 'Black Edition · DLSS 4 / Reflex Low Latency · Triple Axial-tech Fans',
      highlight: 'Delivers 700+ locked FPS on 1280x1024 stretched competitive settings.',
      badge: 'NEXT-GEN GPU',
      image: '/hardware/gpu.jpg',
    },
    {
      id: 'motherboard',
      category: 'CORE RIG',
      type: 'Motherboard',
      name: 'ASUS ROG Strix X670E-E Gaming WiFi',
      specs: 'PCIe 5.0 · 18+2 Power Stages · WiFi 6E · ROG SupremeFX Audio',
      highlight: 'Ultra-low jitter VRM delivery for sustained competitive overclocking.',
      badge: 'PCIe 5.0',
      image: '/hardware/motherboard.jpg',
    },
    {
      id: 'ram',
      category: 'CORE RIG',
      type: 'Memory / RAM',
      name: '64GB (2x32GB) Kingston FURY Beast DDR5-6000MHz',
      specs: 'CL30 Low-Latency Timings · AMD EXPO Certified · Aluminum Heatspreaders',
      highlight: 'Dual-channel sub-timings tuned for instant Source 2 frame caching.',
      badge: 'DDR5 6000',
      image: '/hardware/ram.jpg',
    },
    {
      id: 'cooler',
      category: 'CORE RIG',
      type: 'Liquid Cooling / AIO',
      name: 'be quiet! Silent Loop 2 360mm Liquid Cooler',
      specs: 'Triple Silent Wings 3 PWM High-Speed Fans · Damped Pump',
      highlight: 'Near-silent acoustic profile during intensive 10-hour tournament broadcasts.',
      badge: '360MM AIO',
      image: '/hardware/cooler.jpg',
    },
    {
      id: 'storage',
      category: 'CORE RIG',
      type: 'Primary Storage',
      name: '2TB Lexar NM790 PCIe 4.0 NVMe M.2 SSD',
      specs: 'Up to 7400 MB/s Read · 6500 MB/s Write · HMB 3.0 Cache',
      highlight: 'Instant CS2 map loads and zero micro-stutter shader caching.',
      badge: '7400 MB/S',
      image: '/hardware/ssd.jpg',
    },
    // Gaming Peripherals
    {
      id: 'monitor',
      category: 'PERIPHERALS',
      type: 'Esports Display',
      name: 'BenQ Zowie 400Hz DyAc+',
      specs: 'Fast TN Panel · 400Hz Ultra-High Refresh · Dynamic Accuracy Plus',
      highlight: 'Zero motion blur for crisp spray tracking and instantaneous crosshair re-acquisition.',
      badge: '400HZ DYAC+',
      image: '/hardware/monitor.jpg',
    },
    {
      id: 'mouse',
      category: 'PERIPHERALS',
      type: 'Gaming Mouse',
      name: 'Logitech Super Strike 2',
      specs: 'HITS Induction Optical Switches · 4000Hz True Polling · 54g Ultra-Lightweight',
      highlight: 'Calibrated at 800 DPI with zero click latency and PTFE superglides.',
      badge: '4000HZ WIRELESS',
      image: '/hardware/mouse.jpg',
    },
    {
      id: 'mousepad',
      category: 'PERIPHERALS',
      type: 'Mousepad / Surface',
      name: 'Zowie G-SR-SE Gris Edition',
      specs: 'High-Density Fine Cloth Weave · Non-Slip Rubber Base · Smooth Glide',
      highlight: 'Consistent stopping power for micro-adjustments and snappy flick shots.',
      badge: 'PRO CONTROL',
      image: '/hardware/mousepad.jpg',
    },
    {
      id: 'keyboard',
      category: 'PERIPHERALS',
      type: 'Analog Keyboard',
      name: 'Wooting 60HE',
      specs: 'Rapid Trigger Hall Effect Magnetic Switches · 0.1mm Actuation · 60% Form Factor',
      highlight: 'Instant counter-strafing and lightning-quick stutter-stepping execution.',
      badge: 'RAPID TRIGGER',
      image: '/hardware/keyboard.jpg',
    },
    {
      id: 'audio',
      category: 'PERIPHERALS',
      type: 'Esports Headset',
      name: 'SteelSeries Arctis Nova Pro Wireless',
      specs: 'Hi-Res Audio Drivers · Active Noise Cancellation · Dual Hot-Swap Battery',
      highlight: 'Custom CS2 Parametric EQ tuned for pinpoint footsteps and bomb defusal audio.',
      badge: 'HI-RES WIRELESS',
      image: '/hardware/headset.jpg',
    },
  ];

  const filteredItems = hardwareList.filter((item) => {
    if (filter === 'CORE') return item.category === 'CORE RIG';
    if (filter === 'PERIPHERALS') return item.category === 'PERIPHERALS';
    return true;
  });

  const getIcon = (type: string) => {
    if (type.includes('CPU')) return Cpu;
    if (type.includes('GPU')) return Layers;
    if (type.includes('Motherboard')) return Zap;
    if (type.includes('Memory')) return Activity;
    if (type.includes('Cooling')) return Fan;
    if (type.includes('Storage')) return HardDrive;
    if (type.includes('Display')) return Monitor;
    if (type.includes('Mouse') && !type.includes('pad')) return Mouse;
    if (type.includes('pad')) return Disc;
    if (type.includes('Keyboard')) return Keyboard;
    if (type.includes('Headset') || type.includes('Audio')) return Headphones;
    return Sparkles;
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 pt-3 sm:pt-4 pb-16 sm:pb-20 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 tactical-font">
            <Cpu className="w-5 h-5 text-[#ff1e27]" />
            <span>GAMING SETUP & HARDWARE // PC & GEAR</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Mika's competition PC & esports peripherals tuned for 400Hz CS2 Premier performance.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950/70 rounded-xl border border-white/5">
          {(['ALL', 'CORE', 'PERIPHERALS'] as const).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#ff1e27] text-white font-bold shadow-[0_0_15px_rgba(255,30,39,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'ALL SPECS (11)' : tab === 'CORE' ? 'PC TOWER (6)' : 'PERIPHERALS (5)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hardware Grid with 3D Component Corner Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 my-1 py-1">
        {filteredItems.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div
              key={item.id}
              onClick={() => onCopy(`${item.name} (${item.specs})`, `${item.name} copied!`)}
              className="smoked-glass rounded-2xl p-4 flex flex-col justify-between crimson-glow-hover relative group cursor-pointer transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Glass Specular Glare Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                {/* Header row with Type + Badge + 3D Component Thumbnail Corner */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-white/10 group-hover:border-[#ff1e27]/50 flex items-center justify-center text-[#ff1e27] transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider truncate">
                        {item.type}
                      </span>
                    </div>

                    {item.badge && (
                      <span className="inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 text-[#ff4d54] border border-[#ff1e27]/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Exact 3D Device Corner Image */}
                  {item.image && (
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-900/90 border border-white/15 group-hover:border-[#ff1e27]/60 shadow-[0_4px_12px_rgba(0,0,0,0.6)] shrink-0 group-hover:scale-110 group-hover:-rotate-2 transition-all duration-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Hardware Name */}
                <h3 className="text-sm font-bold text-white group-hover:text-[#ff1e27] transition-colors line-clamp-1 mt-1">
                  {item.name}
                </h3>

                {/* Specs */}
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5 line-clamp-1">
                  {item.specs}
                </p>
              </div>

              {/* Competitive Highlight Pill */}
              <div className="mt-3 pt-2.5 border-t border-white/5">
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {item.highlight}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Setup Benchmark Telemetry Bar */}
      <div className="shrink-0 pt-2">
        <div className="smoked-glass rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-[#ff1e27] animate-pulse" />
            <span className="text-white font-bold">BENCHMARK STATS:</span>
            <span className="text-neutral-400">CS2 Mirage / Premier 400Hz Performance</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300">
            <div>
              <span className="text-neutral-500 uppercase text-[10px]">AVG FPS:</span>{' '}
              <span className="text-white font-bold tabular-nums">748 FPS</span>
            </div>
            <div>
              <span className="text-neutral-500 uppercase text-[10px]">1% LOW:</span>{' '}
              <span className="text-[#ff4d54] font-bold tabular-nums">412 FPS</span>
            </div>
            <div>
              <span className="text-neutral-500 uppercase text-[10px]">FRAME TIME:</span>{' '}
              <span className="text-white font-bold tabular-nums">1.33 ms</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-neutral-500 uppercase text-[10px]">DISPLAY LATENCY:</span>{' '}
              <span className="text-emerald-400 font-bold tabular-nums">0.5 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
