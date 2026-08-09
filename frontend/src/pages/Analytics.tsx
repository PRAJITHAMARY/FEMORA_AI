import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import type { Cycle, Symptom, LifestyleLog } from '../types';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

interface AnalyticsProps {
  cycles: Cycle[];
  symptoms: Symptom[];
  lifestyle: LifestyleLog[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ cycles, symptoms, lifestyle }) => {
  const [timeRange, setTimeRange] = useState<'7 Days' | '30 Days' | '3 Months' | '6 Months'>('30 Days');

  // Chart 1: Cycle Length Trends
  const cycleChartData = cycles.map((c) => ({
    date: c.start_date.substring(5),
    length: c.cycle_length || 32,
  })).reverse();

  // Chart 2: Symptom Frequency Count
  const symptomCounts: Record<string, number> = {};
  symptoms.forEach((s) => {
    symptomCounts[s.symptom] = (symptomCounts[s.symptom] || 0) + 1;
  });
  const symptomChartData = Object.keys(symptomCounts).map((k) => ({
    symptom: k,
    count: symptomCounts[k],
  }));

  // Chart 3: Sleep Trends (Past 7 days)
  const sleepChartData = lifestyle.map((l) => ({
    date: l.date.substring(5),
    sleep: l.sleep_hours,
  })).reverse();

  // Chart 4: Exercise & Activity Trends
  const exerciseChartData = lifestyle.map((l) => ({
    date: l.date.substring(5),
    mins: l.exercise_minutes,
  })).reverse();

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Progress Analytics</h1>
          </div>
          <p className="text-xs text-[#766D70]">
            Visual trends across cycle length, symptom frequency, sleep duration, and movement.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#EDE3E0]">
          {(['7 Days', '30 Days', '3 Months', '6 Months'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white font-semibold shadow-2xs'
                  : 'text-[#766D70] hover:text-[#403A3D]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <DisclaimerBanner text="Visual charts illustrate personal tracking entries over time for habit reflection." />

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: CYCLE LENGTH TRENDS */}
        <div className="femora-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-base font-semibold text-[#403A3D]">Cycle Length Trends (Days)</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8B4B8]/20 text-[#403A3D]">
              Past Logged Cycles
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE3E0" />
                <XAxis dataKey="date" stroke="#766D70" fontSize={11} />
                <YAxis stroke="#766D70" fontSize={11} domain={[25, 40]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF9F5', borderRadius: '12px', border: '1px solid #EDE3E0' }}
                />
                <Line type="monotone" dataKey="length" stroke="#E8B4B8" strokeWidth={3} dot={{ fill: '#E8B4B8', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: SYMPTOM FREQUENCY BAR CHART */}
        <div className="femora-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-base font-semibold text-[#403A3D]">Logged Symptom Frequency</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C9B8D9]/20 text-[#403A3D]">
              Total Occurrences
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE3E0" />
                <XAxis dataKey="symptom" stroke="#766D70" fontSize={10} />
                <YAxis stroke="#766D70" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF9F5', borderRadius: '12px', border: '1px solid #EDE3E0' }}
                />
                <Bar dataKey="count" fill="#C9B8D9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: SLEEP DURATION TRENDS */}
        <div className="femora-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-base font-semibold text-[#403A3D]">Nightly Sleep (Hours)</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#BFD7E3]/30 text-[#403A3D]">
              Sleep Hygiene
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE3E0" />
                <XAxis dataKey="date" stroke="#766D70" fontSize={11} />
                <YAxis stroke="#766D70" fontSize={11} domain={[4, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF9F5', borderRadius: '12px', border: '1px solid #EDE3E0' }}
                />
                <Area type="monotone" dataKey="sleep" stroke="#BFD7E3" fill="#BFD7E3" fillOpacity={0.4} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: MOVEMENT & EXERCISE TRENDS */}
        <div className="femora-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-base font-semibold text-[#403A3D]">Daily Exercise (Minutes)</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#B8C9B3]/30 text-[#403A3D]">
              Physical Activity
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE3E0" />
                <XAxis dataKey="date" stroke="#766D70" fontSize={11} />
                <YAxis stroke="#766D70" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF9F5', borderRadius: '12px', border: '1px solid #EDE3E0' }}
                />
                <Bar dataKey="mins" fill="#B8C9B3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
