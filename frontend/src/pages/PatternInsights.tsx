import type { PatternInsight } from '../types';
import { ShieldAlert, Clock, Info } from 'lucide-react';

interface PatternInsightsProps {
  insights: PatternInsight[];
}

export const PatternInsights: React.FC<PatternInsightsProps> = ({ insights }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Your Personal Patterns</h1>
        </div>
        <p className="text-xs text-[#766D70]">
          Femora analyzes your historical tracking logs to highlight observable data trends across your unique routine.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Rule Banner */}
      <div className="bg-gradient-to-r from-[#FFF9F5] via-[#FDF0F2] to-[#FFF9F5] border border-[#E8B4B8]/60 rounded-3xl p-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-[#403A3D] font-semibold">
          <ShieldAlert className="w-4 h-4 text-[#E8B4B8]" />
          <span>Core Analytical Rule: Observation ≠ Diagnosis ≠ Causation</span>
        </div>
        <p className="text-[#766D70] leading-relaxed">
          Femora highlights statistical correlations in your tracked entries (e.g. sleep vs symptom frequency). These pattern statements describe your personal log data only and do not infer medical causation or diagnoses.
        </p>
      </div>

      {/* INSIGHT CARDS GRID */}
      <div className="space-y-6">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="femora-card p-6 bg-white space-y-4 hover:border-[#E8B4B8] transition-all shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE3E0] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#E8B4B8]/20 flex items-center justify-center text-sm">
                  ✨
                </span>
                <div>
                  <h3 className="font-serif-heading text-base font-semibold text-[#403A3D]">{insight.title}</h3>
                  <span className="text-[10px] text-[#766D70] font-medium">{insight.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[#766D70]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C9B8D9]" />
                  <span>{insight.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] font-medium text-[#403A3D]">
                  {insight.data_points || 'Log Analytics'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-[#403A3D] leading-relaxed font-medium bg-[#FFF9F5] p-4 rounded-2xl border border-[#EDE3E0]">
                “{insight.insight_text}”
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-[#766D70]">
              <div className="flex items-center gap-1.5 text-xs text-[#766D70]">
                <Info className="w-3.5 h-3.5 text-[#B8C9B3]" />
                <span>{insight.disclaimer}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                🟢 Data Correlation Only
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
