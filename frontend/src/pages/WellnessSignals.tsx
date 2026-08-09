import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const WellnessSignals: React.FC = () => {
  const signals = [
    {
      status: 'Stable',
      badge: '🟢 Stable',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      iconColor: 'text-emerald-500',
      headline: 'Consistent Routine & Tracked Entries',
      desc: 'Your tracked habits (sleep, movement, hydration) have remained relatively consistent over the last 14 days.',
      recommendation: 'Keep maintaining your current gentle movement and consistent sleep rhythm.',
    },
    {
      status: 'Worth Noticing',
      badge: '🟡 Worth Noticing',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      iconColor: 'text-amber-500',
      headline: 'Recent Shift in Sleep Duration & Fatigue',
      desc: 'Some tracked areas have changed compared with your previous period—including a 1.5 hr dip in nightly sleep.',
      recommendation: 'Consider prioritizing evening relaxation and hydration over the next few days.',
    },
    {
      status: 'Consider Reviewing',
      badge: '🔴 Consider Reviewing',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      iconColor: 'text-rose-500',
      headline: 'Persistent Symptom Signal',
      desc: 'Some changes in your tracking (e.g. repeated high fatigue entries) have persisted over 3 consecutive weeks.',
      recommendation: 'Consider bringing your Femora Health Summary to discuss these observations with a qualified doctor.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Wellness Signals</h1>
        </div>
        <p className="text-xs text-[#766D70]">
          Non-diagnostic indicators summarizing consistency and observable shifts in your journal data.
        </p>
      </div>

      <DisclaimerBanner text="Wellness signals evaluate logging consistency and self-reported habit trends. They are NOT risk scores or disease predictions." />

      <div className="space-y-6">
        {signals.map((sig, idx) => (
          <div key={idx} className={`p-6 rounded-3xl border ${sig.color} space-y-4 shadow-2xs`}>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white text-xs font-bold shadow-2xs">
                {sig.badge}
              </span>
              <span className="text-[11px] font-medium opacity-80">Non-Diagnostic Signal</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-bold">{sig.headline}</h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">{sig.desc}</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 border border-current/20 text-xs space-y-1">
              <span className="font-semibold block">Suggested Focus:</span>
              <p className="opacity-90">{sig.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
