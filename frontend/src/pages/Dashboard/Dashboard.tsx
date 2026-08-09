import React from 'react';
import { Sparkles, ArrowUpRight, Plus, ShieldAlert, ChevronRight } from 'lucide-react';
import type { Cycle, Symptom, LifestyleLog, PatternInsight, Profile } from '../../types';

interface DashboardProps {
  profile: Profile;
  cycles: Cycle[];
  symptoms: Symptom[];
  lifestyle: LifestyleLog[];
  insights: PatternInsight[];
  setActiveTab: (tab: string) => void;
  onOpenLogModal: (type: 'cycle' | 'symptom' | 'lifestyle') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  cycles,
  symptoms,
  lifestyle,
  insights,
  setActiveTab,
  onOpenLogModal,
}) => {
  const latestCycle = cycles[0];
  const latestLifestyle = lifestyle[0] || { sleep_hours: 7.5, exercise_minutes: 30, water_intake: 8, stress_level: 'Low' };
  const latestInsight = insights[0] || {
    title: 'Sleep Duration & Symptom Trends',
    insight_text: 'During weeks with consistent 7.5+ sleep hours, your recorded fatigue frequency decreased by 40%.',
    disclaimer: 'These insights describe patterns in your tracking data and are not medical diagnoses.',
  };

  const recentSymptomList = symptoms.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* GREETING & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">
            Good morning, {profile.name?.split(' ')[0] || 'Elena'} 🌸
          </h1>
          <p className="text-xs text-[#766D70]">
            Here’s your personal wellness overview for today.
          </p>
        </div>

        {/* Quick Log Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenLogModal('cycle')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#EDE3E0] hover:border-[#E8B4B8] text-xs font-medium text-[#403A3D] shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#E8B4B8]" />
            <span>Log Cycle</span>
          </button>

          <button
            onClick={() => onOpenLogModal('symptom')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#EDE3E0] hover:border-[#C9B8D9] text-xs font-medium text-[#403A3D] shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9B8D9]" />
            <span>Log Symptom</span>
          </button>

          <button
            onClick={() => onOpenLogModal('lifestyle')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daily Wellness</span>
          </button>
        </div>
      </div>

      {/* FEATURED ✨ FEMORA INSIGHT BANNER */}
      <div className="femora-card p-6 bg-gradient-to-r from-[#FFF9F5] via-[#FDF0F2] to-[#F5F0FB] relative overflow-hidden space-y-4 border-[#E8B4B8]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EDE3E0] text-xs font-medium text-[#403A3D]">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" />
            <span>Your Femora Insight</span>
          </div>
          <span className="text-[10px] text-[#766D70] font-medium">Based on your tracked data</span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">
            {latestInsight.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
            “{latestInsight.insight_text}”
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#EDE3E0]/60">
          <div className="flex items-center gap-2 text-[11px] text-[#766D70]/90">
            <ShieldAlert className="w-3.5 h-3.5 text-[#C9B8D9] shrink-0" />
            <span>{latestInsight.disclaimer}</span>
          </div>
          <button
            onClick={() => setActiveTab('insights')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#403A3D] hover:text-[#E8B4B8] transition-colors"
          >
            <span>View All Insights</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DASHBOARD CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CYCLE CARD */}
        <div className="femora-card-interactive p-5 space-y-4 pastel-gradient-blush">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
              🩸
            </div>
            <button onClick={() => setActiveTab('cycle')} className="text-xs text-[#766D70] hover:text-[#403A3D]">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#766D70] uppercase">Cycle Status</span>
            <h4 className="font-serif-heading text-2xl font-bold text-[#403A3D]">
              Day {latestCycle ? Math.min(32, Math.max(1, Math.floor((new Date().getTime() - new Date(latestCycle.start_date).getTime()) / (1000 * 3600 * 24)))) : 14}
            </h4>
            <p className="text-xs text-[#766D70]">
              Last period: {latestCycle ? latestCycle.start_date : '2026-08-01'}
            </p>
          </div>
          <div className="pt-2 border-t border-[#EDE3E0] flex items-center justify-between text-[11px] text-[#766D70]">
            <span>Typical Cycle: {profile.cycle_length_typical || 32} Days</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-[#403A3D] font-medium border border-[#EDE3E0]">
              Logged
            </span>
          </div>
        </div>

        {/* SLEEP CARD */}
        <div className="femora-card-interactive p-5 space-y-4 pastel-gradient-lavender">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
              🌙
            </div>
            <button onClick={() => setActiveTab('lifestyle')} className="text-xs text-[#766D70] hover:text-[#403A3D]">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#766D70] uppercase">Sleep</span>
            <h4 className="font-serif-heading text-2xl font-bold text-[#403A3D]">
              {latestLifestyle.sleep_hours} hrs
            </h4>
            <p className="text-xs text-[#766D70]">Weekly avg: 7.2 hrs/night</p>
          </div>
          <div className="pt-2 border-t border-[#EDE3E0] flex items-center justify-between text-[11px] text-[#766D70]">
            <span>Target: 8.0 hrs</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-[#403A3D] font-medium border border-[#EDE3E0]">
              +0.5 hr vs last week
            </span>
          </div>
        </div>

        {/* ACTIVITY CARD */}
        <div className="femora-card-interactive p-5 space-y-4 pastel-gradient-sage">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
              🌿
            </div>
            <button onClick={() => setActiveTab('lifestyle')} className="text-xs text-[#766D70] hover:text-[#403A3D]">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#766D70] uppercase">Activity</span>
            <h4 className="font-serif-heading text-2xl font-bold text-[#403A3D]">
              {latestLifestyle.exercise_minutes} mins
            </h4>
            <p className="text-xs text-[#766D70]">Active days this week: 5/7</p>
          </div>
          <div className="pt-2 border-t border-[#EDE3E0] flex items-center justify-between text-[11px] text-[#766D70]">
            <span>Low-impact strength</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-[#403A3D] font-medium border border-[#EDE3E0]">
              Consistent
            </span>
          </div>
        </div>

        {/* STRESS CARD */}
        <div className="femora-card-interactive p-5 space-y-4 pastel-gradient-peach">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
              🧘
            </div>
            <button onClick={() => setActiveTab('lifestyle')} className="text-xs text-[#766D70] hover:text-[#403A3D]">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#766D70] uppercase">Stress Level</span>
            <h4 className="font-serif-heading text-2xl font-bold text-[#403A3D]">
              {latestLifestyle.stress_level}
            </h4>
            <p className="text-xs text-[#766D70]">Tracked level today</p>
          </div>
          <div className="pt-2 border-t border-[#EDE3E0] flex items-center justify-between text-[11px] text-[#766D70]">
            <span>Trend: Stable</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-[#403A3D] font-medium border border-[#EDE3E0]">
              🧘 Calm Axis
            </span>
          </div>
        </div>
      </div>

      {/* SYMPTOMS & AI QUICK ACCESS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Symptoms Logged */}
        <div className="lg:col-span-7 femora-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Frequently Logged Symptoms</h3>
              <p className="text-xs text-[#766D70]">Recent physical and emotional signals</p>
            </div>
            <button
              onClick={() => setActiveTab('symptoms')}
              className="text-xs font-semibold text-[#E8B4B8] hover:underline"
            >
              View Full Log
            </button>
          </div>

          <div className="space-[#EDE3E0] space-y-3">
            {recentSymptomList.map((sym) => (
              <div
                key={sym.id}
                className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-sm">
                    📝
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#403A3D]">{sym.symptom}</h5>
                    <p className="text-[11px] text-[#766D70]">{sym.notes || 'Logged entry'} • {sym.date}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    sym.severity === 'High'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : sym.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {sym.severity} Severity
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Femora AI Quick Launcher Widget */}
        <div className="lg:col-span-5 femora-card p-6 bg-gradient-to-br from-[#FFF9F5] to-[#F5F0FB] space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#EDE3E0] flex items-center justify-center text-xl shadow-2xs">
              🌸
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Ask Femora AI</h3>
              <p className="text-xs text-[#766D70]">
                Have a question about PCOS, sleep hygiene, anti-inflammatory nutrition, or cycle phases?
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full text-left p-3 rounded-2xl bg-white border border-[#EDE3E0] hover:border-[#E8B4B8] text-xs text-[#403A3D] transition-all shadow-2xs"
              >
                “What lifestyle habits support insulin sensitivity?”
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full text-left p-3 rounded-2xl bg-white border border-[#EDE3E0] hover:border-[#C9B8D9] text-xs text-[#403A3D] transition-all shadow-2xs"
              >
                “Explain PCOS Simply.”
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('chat')}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all text-center"
          >
            Open Femora AI Companion 🤖
          </button>
        </div>
      </div>
    </div>
  );
};
