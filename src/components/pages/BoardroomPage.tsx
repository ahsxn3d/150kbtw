import React, { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Mail, 
  TrendingUp, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Copy, 
  Users, 
  Award, 
  Sparkles,
  Zap
} from 'lucide-react';

interface BoardroomPageProps {
  onCopy: (text: string, title?: string) => void;
}

export const BoardroomPage: React.FC<BoardroomPageProps> = ({ onCopy }) => {
  const [brandName, setBrandName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [proposalType, setProposalType] = useState('Stream Integration');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const managementEmail = '150kbtw@gmail.com';

  const creatorMetrics = [
    {
      label: 'Premier World Record',
      value: '30K+',
      sub: 'Peak Global Calibration',
      icon: Award,
    },
    {
      label: 'YouTube Community',
      value: '19K+',
      sub: 'Dedicated CS2 Enthusiasts',
      icon: Users,
    },
    {
      label: 'Monthly TikTok Impressions',
      value: '200K+',
      sub: 'Viral Frag & Clutch Clips',
      icon: TrendingUp,
    },
    {
      label: 'Verified Twitch Partner',
      value: '100%',
      sub: 'European Prime-Time Broadcasts',
      icon: ShieldCheck,
    },
  ];

  const partners = [
    {
      id: 'pracc',
      name: 'PRACC',
      tagline: 'Practice & Scrim Infrastructure',
      desc: 'The official competitive platform used by Tier 1 & 2 CS2 teams and semi-pro circuits across Europe.',
      buttonText: 'Train on PRACC',
      link: 'https://go.pracc.com/150k',
      badge: 'OFFICIAL TRAINING PARTNER',
    },
    {
      id: 'tradeit',
      name: 'Tradeit.gg',
      tagline: 'Instant CS2 Skin Trading Platform',
      desc: 'Fast, secure CS2 skin trades and marketplace cashout with high liquidity and lowest industry commissions.',
      buttonText: 'Claim Trade Bonus',
      link: 'https://tradeit.gg/?aff=150k',
      badge: 'OFFICIAL SKIN PLATFORM',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !message) return;

    // Build mailto URL
    const subject = encodeURIComponent(`[Sponsorship Inquiry] ${proposalType} - ${brandName || 'Brand Partner'}`);
    const body = encodeURIComponent(
      `Brand / Company: ${brandName}\nContact Email: ${contactEmail}\nProposal Type: ${proposalType}\n\nMessage:\n${message}\n\nSent via 150k Streamer Portal`
    );

    window.open(`mailto:${managementEmail}?subject=${subject}&body=${body}`, '_blank');
    setIsSubmitted(true);
    onCopy(managementEmail, 'Management Email Copied & Mail Client Launched');
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 pt-3 sm:pt-4 pb-14 sm:pb-16 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 tactical-font">
            <Briefcase className="w-5 h-5 text-[#ff1e27]" />
            <span>COMMUNITY REWARDS & EXCLUSIVE PARTNER PERKS</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Partner with Mika "150k" — Switzerland's leading CS2 streamer and Premier world record holder.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(managementEmail, 'Management Email Copied!')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#ff1e27] group-hover:text-white" />
            <span>{managementEmail}</span>
            <Copy className="w-3 h-3 text-neutral-500" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#ff1e27] hover:bg-[#ff333b] text-white text-xs font-mono font-semibold transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(255,30,39,0.4)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inquire Directly</span>
          </button>
        </div>
      </div>

      {/* Creator Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-2 shrink-0">
        {creatorMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="smoked-glass rounded-2xl p-3.5 crimson-glow-hover flex items-center gap-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-[#ff1e27]/30 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#ff1e27]" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                  {metric.value}
                </div>
                <div className="text-xs font-semibold text-neutral-200 truncate">
                  {metric.label}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 truncate">
                  {metric.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Verified Partners & Embedded Direct Inquiry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 my-2 py-1">
        {/* Left Side: Verified Partners (7 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff1e27]" />
            <span>VERIFIED BRAND COLLABORATIONS</span>
          </div>

          {partners.map((partner) => (
            <div
              key={partner.id}
              className="smoked-glass rounded-2xl p-4 sm:p-5 crimson-glow-hover flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff1e27]/10 text-[#ff4d54] border border-[#ff1e27]/30">
                    {partner.badge}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    ACTIVE TIER 1 PARTNER
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#ff1e27] transition-colors">
                  {partner.name}
                </h3>
                <span className="block text-xs font-mono text-neutral-400 mt-0.5">
                  {partner.tagline}
                </span>

                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  {partner.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">
                  Affiliate Code: <strong className="text-white font-mono">150k</strong>
                </span>

                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 hover:border-[#ff1e27] text-white text-xs font-mono transition-all duration-200"
                >
                  <span>{partner.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Embedded Management Inquiry Form (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#ff1e27]" />
            <span>DIRECT MANAGEMENT CONTACT</span>
          </div>

          <div className="smoked-glass rounded-2xl p-4 sm:p-5 crimson-glow-hover flex-1 flex flex-col justify-between">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-green-950/60 border border-green-500/60 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Inquiry Dispatched!</h4>
                <p className="text-xs text-neutral-400 max-w-sm">
                  Your mail client has been opened with your proposal addressed to <span className="text-white font-mono">{managementEmail}</span>. Mika's management responds within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      BRAND / ORGANIZATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SteelSeries, BenQ, Red Bull"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#ff1e27] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      CONTACT EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="partnerships@brand.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#ff1e27] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    PROPOSAL TYPE
                  </label>
                  <select
                    value={proposalType}
                    onChange={(e) => setProposalType(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#ff1e27] transition-colors cursor-pointer"
                  >
                    <option value="Stream Integration">Stream Integration (Overlay / Product Placement)</option>
                    <option value="Team Sponsorship">Team & Tournament Sponsorship</option>
                    <option value="Affiliate Deal">Affiliate & Ambassador Partnership</option>
                    <option value="Hardware Review">Hardware & Peripheral Showcase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    MESSAGE & DELIVERABLES *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe your campaign goals, budget range, and timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#ff1e27] transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Direct router: {managementEmail}
                  </span>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff1e27] hover:bg-[#ff333b] text-white text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(255,30,39,0.35)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Clean Frosted Glass Modal when user clicks 'Inquire Directly' */}
      {isModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="smoked-glass-crimson rounded-2xl p-6 max-w-lg w-full border border-[#ff1e27]/40 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold font-mono">
                <Briefcase className="w-4 h-4 text-[#ff1e27]" />
                <span>EXECUTIVE INQUIRY // 150K MANAGEMENT</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white font-mono text-xs px-2 py-1 rounded bg-neutral-900 border border-white/10"
              >
                ESC / CLOSE
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-mono mb-4 leading-relaxed">
              Mika "150k" represents elite tier competitive CS2 gaming in the DACH region and worldwide. For commercial licensing, exclusive sponsorship, or apparel drops:
            </p>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/10 mb-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono text-neutral-500">PRIMARY CONTACT</span>
                <span className="text-sm font-mono font-bold text-white">{managementEmail}</span>
              </div>
              <button
                onClick={() => onCopy(managementEmail, 'Email Copied!')}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#ff1e27] border border-white/10 text-xs font-mono text-white transition-colors"
              >
                Copy Address
              </button>
            </div>

            <div className="flex gap-2">
              <a
                href={`mailto:${managementEmail}?subject=Sponsorship%20Inquiry%20150k`}
                className="flex-1 text-center py-2.5 rounded-xl bg-[#ff1e27] hover:bg-[#ff333b] text-white text-xs font-mono font-bold transition-all"
              >
                Open Default Mail App
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Legal / Management Footnote */}
      <div className="shrink-0 pt-2 text-[11px] font-mono text-neutral-500 flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 150k_btw · Mika · Switzerland. All rights reserved.</span>
        <span className="text-neutral-400">Representation: 150kbtw@gmail.com · Verified Swiss Esports</span>
      </div>
    </div>
  );
};
