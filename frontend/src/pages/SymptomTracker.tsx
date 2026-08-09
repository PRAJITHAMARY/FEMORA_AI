import { useState } from 'react';
import type { Symptom } from '../types';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Plus, Trash2, Filter } from 'lucide-react';

interface SymptomTrackerProps {
  symptoms: Symptom[];
  onAddSymptom: (sym: { symptom: string; severity: 'Low' | 'Moderate' | 'High'; date: string; notes?: string }) => void;
  onDeleteSymptom: (id: string) => void;
}

export const SymptomTracker: React.FC<SymptomTrackerProps> = ({ symptoms, onAddSymptom, onDeleteSymptom }) => {
  const availableSymptoms = [
    'Acne',
    'Hair growth (Hirsutism)',
    'Hair loss (Alopecia)',
    'Fatigue',
    'Mood changes',
    'Bloating',
    'Headache',
    'Sleep difficulty',
    'Cravings',
    'Pelvic tenderness',
    'Other',
  ];

  const [selectedSymptom, setSelectedSymptom] = useState(availableSymptoms[0]);
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('All');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSymptom({ symptom: selectedSymptom, severity, date, notes });
    setNotes('');
  };

  const filteredSymptoms = symptoms.filter((s) => (filter === 'All' ? true : s.symptom === filter));

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Symptom Tracker</h1>
        </div>
        <p className="text-xs text-[#766D70]">
          Log daily physical and emotional signals to notice patterns over time.
        </p>
      </div>

      <DisclaimerBanner text="Logging symptoms helps build habit awareness and context for your personal wellness journal." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Logging Form Card */}
        <div className="lg:col-span-5 femora-card p-6 space-y-5 bg-gradient-to-br from-[#FFF9F5] to-[#F5F0FB]">
          <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Log Today's Symptom</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-white text-[#403A3D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">Symptom Type</label>
              <select
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-white text-[#403A3D]"
              >
                {availableSymptoms.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-[#403A3D]">Severity Rating</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Moderate', 'High'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2.5 rounded-xl font-medium text-xs transition-all ${
                      severity === sev
                        ? sev === 'High'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : sev === 'Moderate'
                          ? 'bg-amber-400 text-white shadow-xs'
                          : 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white border border-[#EDE3E0] text-[#766D70]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[#403A3D]">Optional Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Jawline acne breakout after late night study session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-white text-[#403A3D]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white font-semibold text-xs shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Symptom Entry</span>
            </button>
          </form>
        </div>

        {/* Historical Symptoms List */}
        <div className="lg:col-span-7 femora-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Symptom History</h3>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#766D70]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
              >
                <option value="All">All Symptoms</option>
                {availableSymptoms.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredSymptoms.map((sym) => (
              <div
                key={sym.id}
                className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-start justify-between text-xs space-y-1"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#403A3D] text-sm">{sym.symptom}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        sym.severity === 'High'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : sym.severity === 'Moderate'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {sym.severity}
                    </span>
                  </div>
                  <p className="text-[#766D70]">{sym.notes || 'No extra notes recorded.'}</p>
                  <span className="text-[10px] text-[#766D70]/80 block">Logged on {sym.date}</span>
                </div>

                <button
                  onClick={() => onDeleteSymptom(sym.id)}
                  className="p-1.5 text-[#766D70] hover:text-red-500 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
