import React, { useState, useEffect } from 'react';
import type { LifestyleLog } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Plus, Check, Edit2, Trash2, Moon, Flame, Droplets, Smile, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface LifestyleTrackerProps {
  lifestyle?: LifestyleLog[];
  onAddLifestyle: (log: {
    date: string;
    sleep_hours: number;
    exercise_minutes: number;
    water_intake: number;
    stress_level: 'Low' | 'Moderate' | 'High';
    notes?: string;
  }) => void;
  onDeleteLifestyle?: (id: string) => void;
}

export const LifestyleTracker: React.FC<LifestyleTrackerProps> = ({
  lifestyle: initialLifestyle = [],
  onAddLifestyle,
  onDeleteLifestyle,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [exerciseMins, setExerciseMins] = useState(30);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [stressLevel, setStressLevel] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Saved Entries State
  const [entries, setEntries] = useState<LifestyleLog[]>(initialLifestyle);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync initial props or fetch from API
  useEffect(() => {
    fetchEntries();
  }, [initialLifestyle]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLifestyle();
      if (Array.isArray(data) && data.length > 0) {
        setEntries(data);
      } else {
        setEntries(initialLifestyle);
      }
    } catch (e) {
      setEntries(initialLifestyle);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date,
      sleep_hours: sleepHours,
      exercise_minutes: exerciseMins,
      water_intake: waterGlasses,
      stress_level: stressLevel,
      notes,
    };

    if (editingId) {
      // Update existing
      await api.updateLifestyle(editingId, payload);
      setEditingId(null);
    } else {
      // Add new
      await api.addLifestyle(payload);
      onAddLifestyle(payload);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    // Refresh database entries immediately
    fetchEntries();
  };

  const handleEdit = (log: LifestyleLog) => {
    setEditingId(log.id);
    setDate(log.date);
    setSleepHours(log.sleep_hours);
    setExerciseMins(log.exercise_minutes);
    setWaterGlasses(log.water_intake);
    setStressLevel(log.stress_level as 'Low' | 'Moderate' | 'High');
    setNotes(log.notes || '');

    // Scroll smoothly up to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await api.deleteLifestyle(deletingId);
    if (onDeleteLifestyle) onDeleteLifestyle(deletingId);
    setEntries((prev) => prev.filter((item) => item.id !== deletingId));
    setDeletingId(null);
    fetchEntries();
  };

  // Find today's entry
  const todayEntry = entries.find((e) => e.date === todayStr) || entries[0];
  const recentHistory = entries.filter((e) => e.id !== todayEntry?.id);

  // Compute dynamic trends
  const computeTrends = () => {
    if (entries.length === 0) return null;
    const avgSleep = (entries.reduce((acc, cur) => acc + cur.sleep_hours, 0) / entries.length).toFixed(1);
    const avgExercise = Math.round(entries.reduce((acc, cur) => acc + cur.exercise_minutes, 0) / entries.length);
    const avgWater = Math.round(entries.reduce((acc, cur) => acc + cur.water_intake, 0) / entries.length);

    const stressCounts: Record<string, number> = {};
    entries.forEach((e) => {
      stressCounts[e.stress_level] = (stressCounts[e.stress_level] || 0) + 1;
    });
    let mostStress = 'Low';
    let maxCount = 0;
    Object.entries(stressCounts).forEach(([lvl, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        mostStress = lvl;
      }
    });

    return { avgSleep, avgExercise, avgWater, mostStress };
  };

  const trends = computeTrends();

  return (
    <div className="space-y-10 animate-in fade-in pb-12">
      {/* 1. HEADER */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Daily Wellness</h1>
        </div>
        <p className="text-xs text-[#766D70]">
          Track sleep, movement, hydration, and stress levels to build restorative daily routines.
        </p>
      </div>

      <DisclaimerBanner text="Consistency in basic lifestyle habits supports baseline endocrine resilience and energy." />

      {/* 2. DAILY WELLNESS FORM SECTION (PRESERVED INTACT) */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* LOGGING GRID CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* SLEEP HOURS */}
          <div className="femora-card p-6 space-y-4 pastel-gradient-lavender">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
                🌙
              </div>
              <span className="text-xs font-semibold text-[#403A3D]">Sleep</span>
            </div>
            <div className="space-y-2 text-center py-2">
              <div className="font-serif-heading text-3xl font-bold text-[#403A3D]">
                {sleepHours} <span className="text-xs font-normal text-[#766D70]">Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#C9B8D9]"
              />
            </div>
            <p className="text-[10px] text-[#766D70] text-center">Target: 7.5 - 8.5 Hours</p>
          </div>

          {/* EXERCISE MINUTES */}
          <div className="femora-card p-6 space-y-4 pastel-gradient-sage">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
                🌿
              </div>
              <span className="text-xs font-semibold text-[#403A3D]">Exercise</span>
            </div>
            <div className="space-y-2 text-center py-2">
              <div className="font-serif-heading text-3xl font-bold text-[#403A3D]">
                {exerciseMins} <span className="text-xs font-normal text-[#766D70]">Minutes</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setExerciseMins(Math.max(0, exerciseMins - 10))}
                  className="w-8 h-8 rounded-full bg-white border border-[#EDE3E0] font-bold text-[#403A3D]"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setExerciseMins(exerciseMins + 10)}
                  className="w-8 h-8 rounded-full bg-white border border-[#EDE3E0] font-bold text-[#403A3D]"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-[10px] text-[#766D70] text-center">Gentle strength / Pilates / Walking</p>
          </div>

          {/* WATER INTAKE */}
          <div className="femora-card p-6 space-y-4 pastel-gradient-blue">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
                💧
              </div>
              <span className="text-xs font-semibold text-[#403A3D]">Water</span>
            </div>
            <div className="space-y-2 text-center py-2">
              <div className="font-serif-heading text-3xl font-bold text-[#403A3D]">
                {waterGlasses} <span className="text-xs font-normal text-[#766D70]">Glasses</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setWaterGlasses(i + 1)}
                    className={`cursor-pointer text-sm ${i < waterGlasses ? 'opacity-100 scale-110' : 'opacity-30'}`}
                  >
                    💧
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[#766D70] text-center">Target: 8 Glasses (2.0 L)</p>
          </div>

          {/* STRESS RATING */}
          <div className="femora-card p-6 space-y-4 pastel-gradient-peach">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE3E0] flex items-center justify-center text-base">
                🧘
              </div>
              <span className="text-xs font-semibold text-[#403A3D]">Stress</span>
            </div>
            <div className="space-y-2 text-center py-2">
              <div className="font-serif-heading text-xl font-bold text-[#403A3D]">{stressLevel}</div>
              <div className="flex items-center justify-center gap-1.5">
                {(['Low', 'Moderate', 'High'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStressLevel(lvl)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      stressLevel === lvl
                        ? 'bg-[#403A3D] text-white shadow-xs'
                        : 'bg-white border border-[#EDE3E0] text-[#766D70]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[#766D70] text-center">Cortisol Axis Self-Rating</p>
          </div>
        </div>

        {/* NOTES & SUBMIT SECTION */}
        <div className="femora-card p-6 space-y-4 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">Logging Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">Food & Lifestyle Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Anti-inflammatory berry smoothie, high energy day"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" /> ✓ Wellness entry saved successfully.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#E8B4B8] via-[#C9B8D9] to-[#E8B4B8] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? 'Update Entry' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3. YOUR WELLNESS ENTRIES SECTION (DIRECTLY BELOW) */}
      <section className="space-y-6 pt-6 border-t border-[#EDE3E0]">
        <div className="space-y-1">
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#403A3D]">
            Your Wellness Entries
          </h2>
          <p className="text-xs text-[#766D70]">Your recently saved wellness information.</p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#766D70]">Loading your wellness entries...</div>
        ) : entries.length === 0 ? (
          /* EMPTY STATE */
          <div className="femora-card p-8 bg-white border border-[#EDE3E0] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E8B4B8]/20 text-[#E8B4B8] flex items-center justify-center text-xl mx-auto">
              🌸
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">
                No wellness entries yet.
              </h3>
              <p className="text-xs text-[#766D70] max-w-sm mx-auto">
                Start tracking your daily habits to build a picture of your wellness patterns.
              </p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-5 py-2.5 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold hover:opacity-95 cursor-pointer"
            >
              + Add Today's Entry
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* TODAY'S WELLNESS CARD */}
            {todayEntry && (
              <div className="space-y-3">
                <h3 className="font-serif-heading text-lg font-bold text-[#403A3D] flex items-center gap-2">
                  <span>🌸</span> Today's Wellness
                </h3>

                <div className="femora-card p-6 bg-gradient-to-br from-white via-[#FFF9F5] to-[#F5F0FB] border border-[#EDE3E0] space-y-5 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-[#766D70] flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-[#C9B8D9]" /> Sleep
                      </span>
                      <div className="font-serif-heading text-lg font-bold text-[#403A3D]">
                        {todayEntry.sleep_hours} <span className="text-xs font-normal text-[#766D70]">hours</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-[#766D70] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#B8C9B3]" /> Exercise
                      </span>
                      <div className="font-serif-heading text-lg font-bold text-[#403A3D]">
                        {todayEntry.exercise_minutes} <span className="text-xs font-normal text-[#766D70]">minutes</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-[#766D70] flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-[#BFD7E3]" /> Water
                      </span>
                      <div className="font-serif-heading text-lg font-bold text-[#403A3D]">
                        {todayEntry.water_intake} <span className="text-xs font-normal text-[#766D70]">glasses</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-[#766D70] flex items-center gap-1">
                        <Smile className="w-3.5 h-3.5 text-[#F3C6B5]" /> Stress
                      </span>
                      <div className="font-serif-heading text-lg font-bold text-[#403A3D]">
                        {todayEntry.stress_level}
                      </div>
                    </div>
                  </div>

                  {todayEntry.notes && (
                    <div className="p-3.5 rounded-2xl bg-white border border-[#EDE3E0] space-y-1 text-xs">
                      <span className="font-bold text-[#403A3D] block">📝 Notes</span>
                      <p className="text-[#766D70]">{todayEntry.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#EDE3E0]/70 text-xs">
                    <span className="text-[11px] text-[#766D70] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E8B4B8]" />
                      Saved: {todayEntry.date}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(todayEntry)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#EDE3E0] hover:border-[#E8B4B8] text-xs font-medium text-[#403A3D] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#C9B8D9]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingId(todayEntry.id)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#EDE3E0] hover:border-rose-300 text-xs font-medium text-rose-600 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RECENT WELLNESS HISTORY */}
            {recentHistory.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif-heading text-lg font-bold text-[#403A3D] flex items-center gap-2">
                  <span>📊</span> Recent Wellness History
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="femora-card p-5 bg-white border border-[#EDE3E0] space-y-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[#EDE3E0] pb-2">
                          <span className="font-bold text-xs text-[#403A3D]">{item.date}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] text-[#766D70]">
                            {item.stress_level} Stress
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-xl bg-[#F5F0FB] space-y-0.5">
                            <span className="text-[10px] text-[#766D70] block">🌙 Sleep</span>
                            <span className="font-bold text-[#403A3D]">{item.sleep_hours} hrs</span>
                          </div>

                          <div className="p-2 rounded-xl bg-[#F0F4F1] space-y-0.5">
                            <span className="text-[10px] text-[#766D70] block">🌿 Exercise</span>
                            <span className="font-bold text-[#403A3D]">{item.exercise_minutes} min</span>
                          </div>

                          <div className="p-2 rounded-xl bg-[#F0F7FA] space-y-0.5">
                            <span className="text-[10px] text-[#766D70] block">💧 Water</span>
                            <span className="font-bold text-[#403A3D]">{item.water_intake} glasses</span>
                          </div>

                          <div className="p-2 rounded-xl bg-[#FDF0F2] space-y-0.5">
                            <span className="text-[10px] text-[#766D70] block">🧘 Stress</span>
                            <span className="font-bold text-[#403A3D]">{item.stress_level}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <p className="text-[11px] text-[#766D70] italic truncate">"{item.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDE3E0]">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-[#FFF9F5] text-[#766D70] hover:text-[#403A3D] cursor-pointer"
                          title="Edit log"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-[#766D70] hover:text-rose-600 cursor-pointer"
                          title="Delete log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC WELLNESS TREND SECTION */}
            {trends ? (
              <div className="femora-card p-6 bg-gradient-to-r from-[#FFF9F5] via-[#F5F0FB] to-[#FFF9F5] border border-[#EDE3E0] space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E8B4B8]" />
                  <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">
                    📈 Wellness Trend
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
                    <span className="text-[#766D70] block text-[10px]">Average Sleep</span>
                    <span className="font-bold text-sm text-[#403A3D]">{trends.avgSleep} hrs</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
                    <span className="text-[#766D70] block text-[10px]">Average Exercise</span>
                    <span className="font-bold text-sm text-[#403A3D]">{trends.avgExercise} min/day</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
                    <span className="text-[#766D70] block text-[10px]">Average Water</span>
                    <span className="font-bold text-sm text-[#403A3D]">{trends.avgWater} glasses/day</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
                    <span className="text-[#766D70] block text-[10px]">Most Logged Stress</span>
                    <span className="font-bold text-sm text-[#403A3D]">{trends.mostStress}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] text-center text-xs text-[#766D70]">
                Keep tracking to see your wellness trends.
              </div>
            )}
          </div>
        )}
      </section>

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EDE3E0] max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Delete Entry</span>
            </div>

            <p className="text-xs text-[#766D70] leading-relaxed">
              Are you sure you want to delete this wellness entry? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-full border border-[#EDE3E0] text-xs font-semibold text-[#403A3D] hover:bg-[#FFF9F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
