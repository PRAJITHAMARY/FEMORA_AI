import React, { useState } from 'react';
import type { Cycle } from '../types';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface CycleTrackerProps {
  cycles: Cycle[];
  onAddCycle: (cycle: { start_date: string; end_date?: string; notes?: string }) => void;
  onDeleteCycle: (id: string) => void;
}

export const CycleTracker: React.FC<CycleTrackerProps> = ({ cycles, onAddCycle, onDeleteCycle }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  // Calendar State (August 2026)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // Aug 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  // Highlight logged period days
  const isPeriodDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cycles.some((c) => {
      if (!c.end_date) return c.start_date === dateStr;
      return dateStr >= c.start_date && dateStr <= c.end_date;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCycle({ start_date: startDate, end_date: endDate || undefined, notes });
    setShowLogForm(false);
    setNotes('');
  };

  // Average Cycle Length Calculation
  const validLengths = cycles.map((c) => c.cycle_length).filter((l): l is number => Boolean(l));
  const avgLength = validLengths.length ? Math.round(validLengths.reduce((a, b) => a + b, 0) / validLengths.length) : 32;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩸</span>
            <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Cycle Tracker</h1>
          </div>
          <p className="text-xs text-[#766D70]">
            Track menstrual cycles, view historical lengths, and observe your personal rhythms.
          </p>
        </div>

        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Period</span>
        </button>
      </div>

      {/* Prediction Disclaimer */}
      <DisclaimerBanner text="Cycle estimates are based on your personal historical averages and are not medical or pregnancy predictions." />

      {/* Log Form Modal / Collapsible */}
      {showLogForm && (
        <form onSubmit={handleSave} className="femora-card p-6 bg-[#FFF9F5] border-[#E8B4B8] space-y-4">
          <h3 className="font-serif-heading text-base font-semibold text-[#403A3D]">Log Period Dates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-white text-[#403A3D]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">End Date (Optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-white text-[#403A3D]"
              />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <label className="font-medium text-[#403A3D]">Notes (Flow intensity, cramps, mood)</label>
            <input
              type="text"
              placeholder="e.g. Day 2 heavy flow, mild lower back tension"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-white text-[#403A3D]"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="px-5 py-2 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold">
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="px-4 py-2 rounded-full bg-white border border-[#EDE3E0] text-xs text-[#766D70]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* MAIN GRID: CALENDAR + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Interactive Calendar */}
        <div className="lg:col-span-8 femora-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-[#E8B4B8]" />
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-2 rounded-xl bg-[#FFF9F5] border border-[#EDE3E0] hover:bg-white text-[#766D70]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-2 rounded-xl bg-[#FFF9F5] border border-[#EDE3E0] hover:bg-white text-[#766D70]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#766D70]">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 rounded-2xl bg-transparent"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isPeriod = isPeriodDay(dayNum);
                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`h-11 rounded-2xl flex flex-col items-center justify-center text-xs font-medium transition-all ${
                      isPeriod
                        ? 'bg-gradient-to-tr from-[#E8B4B8] to-[#F3C6B5] text-white shadow-xs font-bold'
                        : 'bg-[#FFF9F5] border border-[#EDE3E0]/70 text-[#403A3D] hover:bg-white'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isPeriod && <span className="text-[9px]">🌸</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 pt-4 border-t border-[#EDE3E0] text-xs text-[#766D70]">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#E8B4B8] inline-block"></span>
              <span>Logged Period (🌸)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] inline-block"></span>
              <span>Other Days (○)</span>
            </div>
          </div>
        </div>

        {/* Cycle Metrics & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Average Stats Card */}
          <div className="femora-card p-6 space-y-4 pastel-gradient-blush">
            <h4 className="font-serif-heading text-base font-semibold text-[#403A3D]">Cycle Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#766D70]">Average Cycle Length:</span>
                <span className="font-bold text-[#403A3D] text-base">{avgLength} Days</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#766D70]">Log Count:</span>
                <span className="font-semibold text-[#403A3D]">{cycles.length} Cycles</span>
              </div>
            </div>
          </div>

          {/* Cycle History Table */}
          <div className="femora-card p-6 space-y-4">
            <h4 className="font-serif-heading text-base font-semibold text-[#403A3D]">Logged History</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#403A3D]">
                      {cycle.start_date} {cycle.end_date ? `to ${cycle.end_date}` : ''}
                    </div>
                    <div className="text-[11px] text-[#766D70]">{cycle.notes || 'Period logged'}</div>
                  </div>
                  <button
                    onClick={() => onDeleteCycle(cycle.id)}
                    className="p-1.5 text-[#766D70] hover:text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
