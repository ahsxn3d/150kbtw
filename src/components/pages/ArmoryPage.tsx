import React, { useState } from 'react';
import { 
  Mouse, 
  Monitor, 
  Eye, 
  Compass, 
  Keyboard, 
  Terminal, 
  Copy, 
  Download, 
  Check, 
  Sliders,
  Crosshair,
  Shield,
  Bomb,
  Radio,
  Zap,
  Flame,
  MessageSquare
} from 'lucide-react';

interface ArmoryPageProps {
  onCopy: (text: string, title?: string) => void;
}

interface BindItem {
  id: string;
  label: string;
  key: string;
  cmd: string;
}

interface BindCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  binds: BindItem[];
}

export const ArmoryPage: React.FC<ArmoryPageProps> = ({ onCopy }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCommand = (payload: string, buttonTitle: string, id: string) => {
    navigator.clipboard?.writeText(payload).catch(() => {});
    onCopy(payload, `${buttonTitle}`);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const launchOptions = "-noreflex -high -threads 17 +exec autoexec.cfg";

  const fullAutoexecContent = `// 150k OFFICIAL CS2 AUTOEXEC & PRO SETTINGS
// Player: Mika "150k" (Switzerland) - 30K+ Premier World Record

// Mouse & Sensitivity
sensitivity 0.94
zoom_sensitivity_ratio 1.04
m_yaw 0.022

// Video & Performance
r_fullscreen_gamma 2.38
fps_max 0

// Viewmodel (Left Handed)
viewmodel_fov 68
viewmodel_offset_x 2.5
viewmodel_offset_y 0
viewmodel_offset_z -1.5
cl_prefer_lefthanded true

// Radar & HUD
cl_hud_radar_scale 1.1
cl_radar_scale 0.4
cl_radar_always_centered 1
cl_radar_rotate 1
cl_radar_icon_scale_min 0.6
cl_hud_color 10

// Master Keybinds
bind capslock "+sprint"
bind shift "+duck"
bind space "+jump"
bind mouse4 "switchhands"
bind t "+lookatweapon"
bind q "lastinv"
bind mwheelup "invprev"
bind mwheeldown "invnext"
bind 1 "slot1"
bind 2 "slot2"
bind 3 "slot3"
bind 4 "slot6"
bind 5 "slot5"
bind f "slot7"
bind c "slot8"
bind x "slot9"
bind mouse5 "slot10"
bind mouse3 "player_ping"
bind tab "+showscores"
bind \` "toggleconsole"

host_writeconfig
echo "=== 150k AUTOEXEC LOADED SUCCESSFULLY ==="
`;

  const MASTER_BINDS_PAYLOAD = 'bind capslock "+sprint"; bind shift "+duck"; bind space "+jump"; bind mouse4 "switchhands"; bind t "+lookatweapon"; bind q "lastinv"; bind mwheelup "invprev"; bind mwheeldown "invnext"; bind 1 "slot1"; bind 2 "slot2"; bind 3 "slot3"; bind 4 "slot6"; bind 5 "slot5"; bind f "slot7"; bind c "slot8"; bind x "slot9"; bind mouse5 "slot10"; bind mouse3 "player_ping"; bind tab "+showscores"; bind ` "toggleconsole"';

  const bindCategories: BindCategory[] = [
    {
      id: 'movement',
      title: 'Movement & Core Combat',
      subtitle: 'Sub-tick movement & primary actions',
      icon: Crosshair,
      binds: [
        { id: 'mov-w', label: 'Move Forward', key: 'W', cmd: 'bind w "+forward"' },
        { id: 'mov-s', label: 'Move Backward', key: 'S', cmd: 'bind s "+back"' },
        { id: 'mov-a', label: 'Move Left / Strafe', key: 'A', cmd: 'bind a "+left"' },
        { id: 'mov-d', label: 'Move Right / Strafe', key: 'D', cmd: 'bind d "+right"' },
        { id: 'mov-caps', label: 'Walk / Speed', key: 'CAPSLOCK', cmd: 'bind capslock "+sprint"' },
        { id: 'mov-shift', label: 'Duck / Crouch', key: 'SHIFT', cmd: 'bind shift "+duck"' },
        { id: 'mov-space', label: 'Jump', key: 'SPACE', cmd: 'bind space "+jump"' },
        { id: 'mov-m1', label: 'Primary Fire', key: 'MOUSE1', cmd: 'bind mouse1 "+attack"' },
        { id: 'mov-m2', label: 'Secondary Fire', key: 'MOUSE2', cmd: 'bind mouse2 "+attack2"' },
        { id: 'mov-r', label: 'Reload', key: 'R', cmd: 'bind r "+reload"' },
        { id: 'mov-e', label: 'Use / Interact', key: 'E', cmd: 'bind e "+use"' },
        { id: 'mov-g', label: 'Drop Weapon', key: 'G', cmd: 'bind g "drop"' },
        { id: 'mov-t', label: 'Inspect Weapon', key: 'T', cmd: 'bind t "+lookatweapon"' },
        { id: 'mov-m4', label: 'Switch Viewmodel Left/Right Hand', key: 'MOUSE4', cmd: 'bind mouse4 "switchhands"' },
      ],
    },
    {
      id: 'weapons',
      title: 'Weapons & Gear',
      subtitle: 'Arsenal selection & rapid cycling',
      icon: Zap,
      binds: [
        { id: 'wep-1', label: 'Primary Weapon', key: '1', cmd: 'bind 1 "slot1"' },
        { id: 'wep-2', label: 'Secondary Weapon', key: '2', cmd: 'bind 2 "slot2"' },
        { id: 'wep-3', label: 'Melee Weapon / Knife', key: '3', cmd: 'bind 3 "slot3"' },
        { id: 'wep-5', label: 'Explosives & C4', key: '5', cmd: 'bind 5 "slot5"' },
        { id: 'wep-q', label: 'Last Weapon Used / Quickswitch', key: 'Q', cmd: 'bind q "lastinv"' },
        { id: 'wep-mup', label: 'Select Previous Weapon', key: 'MWHEELUP', cmd: 'bind mwheelup "invprev"' },
        { id: 'wep-mdown', label: 'Select Next Weapon', key: 'MWHEELDOWN', cmd: 'bind mwheeldown "invnext"' },
        { id: 'wep-f1', label: 'Radial Weapon Menu', key: 'F1', cmd: 'bind f1 "+quickinv"' },
      ],
    },
    {
      id: 'utility',
      title: 'Tactical Utility & Grenades',
      subtitle: 'Zero-latency single-key lineup bindings',
      icon: Bomb,
      binds: [
        { id: 'util-f', label: 'Flashbang', key: 'F', cmd: 'bind f "slot7"' },
        { id: 'util-c', label: 'Smoke Grenade', key: 'C', cmd: 'bind c "slot8"' },
        { id: 'util-4', label: 'HE Frag Grenade', key: '4', cmd: 'bind 4 "slot6"' },
        { id: 'util-m5', label: 'Molotov / Incendiary', key: 'MOUSE5', cmd: 'bind mouse5 "slot10"' },
        { id: 'util-x', label: 'Decoy Grenade', key: 'X', cmd: 'bind x "slot9"' },
        { id: 'util-med', label: 'Medi-Shot', key: 'X', cmd: 'bind x "slot12"' },
      ],
    },
    {
      id: 'interface',
      title: 'Interface, HUD & Comms',
      subtitle: 'Tactical overlays & squad communication',
      icon: MessageSquare,
      binds: [
        { id: 'ui-tab', label: 'Scoreboard', key: 'TAB', cmd: 'bind tab "+showscores"' },
        { id: 'ui-tilde', label: 'Toggle Console', key: '`', cmd: 'bind ` "toggleconsole"' },
        { id: 'ui-m3', label: 'Player Ping', key: 'MOUSE3', cmd: 'bind mouse3 "player_ping"' },
        { id: 'ui-b', label: 'Buy Menu', key: 'B', cmd: 'bind b "buymenu"' },
        { id: 'ui-f3', label: 'Autobuy', key: 'F3', cmd: 'bind f3 "autobuy"' },
        { id: 'ui-f4', label: 'Rebuy', key: 'F4', cmd: 'bind f4 "rebuy"' },
        { id: 'ui-u', label: 'Team Chat', key: 'U', cmd: 'bind u "messagemode2"' },
        { id: 'ui-y', label: 'All Chat', key: 'Y', cmd: 'bind y "messagemode"' },
        { id: 'ui-radio', label: 'Radio Commands', key: 'Z, X, C', cmd: 'bind z "radio"; bind x "radio2"; bind c "radio3"' },
        { id: 'ui-m', label: 'Choose Team', key: 'M', cmd: 'bind m "teammenu"' },
      ],
    },
  ];

  const downloadAutoexec = () => {
    const blob = new Blob([fullAutoexecContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autoexec.cfg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onCopy('autoexec.cfg downloaded to your system!', 'Autoexec Generated');
  };

  const copyCategory = (category: BindCategory) => {
    const groupPayload = category.binds.map((b) => b.cmd).join('; ');
    handleCopyCommand(
      groupPayload,
      `Copied ${category.title} group binds to clipboard!`,
      `cat-${category.id}`
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 pt-3 sm:pt-4 pb-14 sm:pb-16 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 tactical-font">
            <Terminal className="w-5 h-5 text-[#ff1e27]" />
            <span>PRO SETTINGS & CONFIG // CS2 AUTOEXEC</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Exact tournament calibrations used by Mika "150k" for the 30K CS2 Premier World Record.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadAutoexec}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download autoexec.cfg</span>
          </button>

          <button
            onClick={() => handleCopyCommand(fullAutoexecContent, 'Copied full autoexec config to clipboard!', 'all')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#ff1e27]/20 hover:bg-[#ff1e27] border border-[#ff1e27]/50 hover:border-[#ff1e27] text-white text-xs font-mono font-semibold transition-all duration-200 cursor-pointer"
          >
            {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy All Settings</span>
          </button>
        </div>
      </div>

      {/* Main Hardware / Calibration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 my-1">
        {/* Card 1: Mouse Sensitivity Card */}
        <div className="smoked-glass rounded-2xl p-4 flex flex-col justify-between crimson-glow-hover relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <Mouse className="w-4 h-4 text-[#ff1e27]" />
                <span className="font-semibold text-white">01 // MOUSE</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                4000 HZ
              </span>
            </div>

            <div className="bg-neutral-950/70 rounded-xl p-3 border border-white/5 mb-3 font-mono text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">DPI</span>
                <span className="font-bold text-white">800 DPI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">In-Game Sens</span>
                <span className="font-bold text-[#ff4d54]">0.94</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">eDPI</span>
                <span className="text-neutral-200">752</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Zoom Sens</span>
                <span className="text-neutral-200">1.04</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopyCommand('sensitivity 0.94; zoom_sensitivity_ratio 1.04; m_yaw 0.022', 'Copied mouse commands to clipboard!', 'mouse')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200 cursor-pointer"
          >
            {copiedId === 'mouse' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Sens</span>
          </button>
        </div>

        {/* Card 2: Video & Graphics Card */}
        <div className="smoked-glass rounded-2xl p-4 flex flex-col justify-between crimson-glow-hover relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <Monitor className="w-4 h-4 text-[#ff1e27]" />
                <span className="font-semibold text-white">02 // VIDEO</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                400 HZ
              </span>
            </div>

            <div className="bg-neutral-950/70 rounded-xl p-3 border border-white/5 mb-3 font-mono text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Resolution</span>
                <span className="font-bold text-white">1280 x 1024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Aspect Ratio</span>
                <span className="font-bold text-[#ff4d54]">5:4 (Stretched)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Brightness</span>
                <span className="text-neutral-200">88% (Gamma 2.38)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Display Mode</span>
                <span className="text-neutral-200">Fullscreen Native</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopyCommand('r_fullscreen_gamma 2.38; fps_max 0', 'Copied video commands to clipboard!', 'video')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200 cursor-pointer"
          >
            {copiedId === 'video' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Video</span>
          </button>
        </div>

        {/* Card 3: Viewmodel & Crosshair Card */}
        <div className="smoked-glass rounded-2xl p-4 flex flex-col justify-between crimson-glow-hover relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <Eye className="w-4 h-4 text-[#ff1e27]" />
                <span className="font-semibold text-white">03 // VIEWMODEL</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-white/5">
                LEFT HAND
              </span>
            </div>

            <div className="bg-neutral-950/70 rounded-xl p-3 border border-white/5 mb-3 font-mono text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">FOV</span>
                <span className="font-bold text-white">FOV 68</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Offset X / Y</span>
                <span className="text-neutral-200">2.5 / 0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Offset Z</span>
                <span className="text-neutral-200">-1.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Dominant Hand</span>
                <span className="font-bold text-[#ff4d54]">Left Hand</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopyCommand('viewmodel_fov 68; viewmodel_offset_x 2.5; viewmodel_offset_y 0; viewmodel_offset_z -1.5; cl_prefer_lefthanded true', 'Copied viewmodel script to clipboard!', 'viewmodel')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200 cursor-pointer"
          >
            {copiedId === 'viewmodel' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Viewmodel</span>
          </button>
        </div>

        {/* Card 4: Radar & HUD Card */}
        <div className="smoked-glass rounded-2xl p-4 flex flex-col justify-between crimson-glow-hover relative group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <Compass className="w-4 h-4 text-[#ff1e27]" />
                <span className="font-semibold text-white">04 // RADAR</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                FULL MAP
              </span>
            </div>

            <div className="bg-neutral-950/70 rounded-xl p-3 border border-white/5 mb-3 font-mono text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">HUD Radar Scale</span>
                <span className="font-bold text-white">1.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Map Scale</span>
                <span className="font-bold text-[#ff4d54]">0.4 (Full Vision)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Centering</span>
                <span className="text-neutral-200">Always (1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Rotation</span>
                <span className="text-neutral-200">Rotate (1)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopyCommand('cl_hud_radar_scale 1.1; cl_radar_scale 0.4; cl_radar_always_centered 1; cl_radar_rotate 1; cl_radar_icon_scale_min 0.6; cl_hud_color 10', 'Copied radar commands to clipboard!', 'radar')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200 cursor-pointer"
          >
            {copiedId === 'radar' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Radar</span>
          </button>
        </div>
      </div>

      {/* MASTER TOP BANNER: CS2 Interactive Binds Terminal */}
      <div className="smoked-glass rounded-2xl p-4 sm:p-5 border border-white/10 shadow-[0_0_40px_rgba(255,30,39,0.15)] flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff1e27] to-red-900 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(255,30,39,0.4)] shrink-0">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Keyboard className="w-6 h-6 text-[#ff1e27]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight tactical-font">
                CS2 INTERACTIVE BINDS TERMINAL
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#ff1e27]/20 text-[#ff4d54] border border-[#ff1e27]/40">
                PRO VERIFIED
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              150k's calibrated tournament layout. Click any command or group to copy directly to your CS2 console.
            </p>
          </div>
        </div>

        {/* Master Bulk Button */}
        <button
          onClick={() => handleCopyCommand(
            MASTER_BINDS_PAYLOAD,
            'Copied all 150k binds to clipboard!',
            'master-binds'
          )}
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff1e27] to-[#e0141d] hover:from-[#ff333b] hover:to-[#ff1e27] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(255,30,39,0.5)] active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
        >
          {copiedId === 'master-binds' ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>All 150k Binds Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All 150k Binds to Console</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Clean Liquid-Glass Binds Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bindCategories.map((category) => {
          const Icon = category.icon;
          const isCategoryCopied = copiedId === `cat-${category.id}`;

          return (
            <div
              key={category.id}
              className="smoked-glass rounded-2xl p-4 sm:p-5 flex flex-col justify-between crimson-glow-hover border border-white/10 transition-all duration-300"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#ff1e27]/15 border border-[#ff1e27]/30 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#ff1e27]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {category.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Copy Group Button */}
                  <button
                    onClick={() => copyCategory(category)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-[11px] font-mono transition-all duration-200 cursor-pointer shadow-sm"
                    title={`Copy all ${category.title} commands`}
                  >
                    {isCategoryCopied ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Group</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bind Rows */}
                <div data-lenis-prevent className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto overscroll-contain pr-1">
                  {category.binds.map((bind) => {
                    const isRowCopied = copiedId === bind.id;

                    return (
                      <div
                        key={bind.id}
                        className="group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-950/60 hover:bg-neutral-900/90 border border-white/5 hover:border-[#ff1e27]/30 transition-all duration-150"
                      >
                        {/* Action Label */}
                        <span className="text-xs text-neutral-300 font-medium truncate flex-1">
                          {bind.label}
                        </span>

                        {/* Key Badge */}
                        <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-[#ff1e27]/50 text-[#ff4d54] font-mono text-[11px] font-bold shrink-0 shadow-[0_0_6px_rgba(255,30,39,0.2)]">
                          {bind.key}
                        </span>

                        {/* Raw Console Command */}
                        <code className="hidden sm:block text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-white/5 truncate max-w-[170px]">
                          {bind.cmd}
                        </code>

                        {/* Individual Copy Button */}
                        <button
                          onClick={() => handleCopyCommand(
                            bind.cmd,
                            `Copied bind command to clipboard!`,
                            bind.id
                          )}
                          className="p-1 rounded-md bg-neutral-900/80 hover:bg-[#ff1e27] text-neutral-400 hover:text-white border border-white/10 hover:border-[#ff1e27] transition-all duration-150 cursor-pointer shrink-0"
                          title={`Copy: ${bind.cmd}`}
                        >
                          {isRowCopied ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Steam Launch Options Bar */}
      <div className="shrink-0 pt-2">
        <div className="smoked-glass rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 crimson-glow-hover">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-[#ff1e27]/40 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-[#ff1e27]" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white font-mono">05 // STEAM LAUNCH OPTIONS</span>
              <span className="text-[11px] text-neutral-400 font-mono">Steam Library → CS2 Properties → General</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto sm:max-w-xl flex-1 justify-end">
            <div className="w-full sm:w-auto flex-1 bg-neutral-950 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-xs text-neutral-200 select-all truncate">
              {launchOptions}
            </div>

            <button
              onClick={() => handleCopyCommand(launchOptions, 'Copied launch options to clipboard!', 'launch')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff1e27] hover:bg-[#ff333b] text-white text-xs font-mono font-semibold transition-all duration-200 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(255,30,39,0.3)]"
            >
              {copiedId === 'launch' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Launch Options</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
