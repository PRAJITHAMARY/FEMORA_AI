import { useState, useEffect } from 'react';
import type { HealthSummaryData } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Printer, FileText, Calendar, Activity } from 'lucide-react';

export const HealthSummary: React.FC = () => {
  const [summary, setSummary] = useState<HealthSummaryData | null>(null);
  const [doctorNotes, setDoctorNotes] = useState(
    'Questions for my upcoming appointment:\n1. Discuss recent fatigue trends on low-sleep days.\n2. Review cycle length consistency over the last 4 months.'
  );

  useEffect(() => {
    api.getHealthSummary().then((res) => {
      setSummary(res);
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!summary) {
    return (
      <div className="text-center py-20 space-y-3">
        <span className="animate-spin text-3xl block">🌸</span>
        <p className="text-xs text-[#766D70]">Generating your doctor-ready health summary…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-12">
      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">My Femora Summary</h1>
          </div>
          <p className="text-xs text-[#766D70]">
            Generate a personal health tracking summary formatted for discussion with your doctor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#EDE3E0] hover:border-[#E8B4B8] text-xs font-semibold text-[#403A3D] shadow-2xs transition-all"
          >
            <Printer className="w-4 h-4 text-[#E8B4B8]" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <div className="no-print">
        <DisclaimerBanner text="This summary contains self-reported journal tracking data to help facilitate conversations with a healthcare professional. It is NOT a clinical diagnostic report." />
      </div>

      {/* PRINTABLE DOCUMENT BODY */}
      <div id="printable-summary-document" className="femora-card p-8 sm:p-12 space-y-8 bg-white border-[#EDE3E0]">
        {/* Document Branding & Header */}
        <div className="flex items-start justify-between border-b border-[#EDE3E0] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="font-serif-heading text-2xl font-bold text-[#403A3D]">Femora Health Journal</span>
            </div>
            <p className="text-xs font-semibold text-[#E8B4B8]">Personal Tracking Discussion Summary</p>
          </div>

          <div className="text-right text-xs text-[#766D70] space-y-1">
            <p><strong className="text-[#403A3D]">Patient/User:</strong> {summary.user_name}</p>
            <p><strong className="text-[#403A3D]">Date Generated:</strong> {summary.generated_at}</p>
            <p><strong className="text-[#403A3D]">Typical Cycle:</strong> {summary.profile.cycle_length_typical || 32} Days</p>
          </div>
        </div>

        {/* SECTION 1: STATS OVERVIEW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] text-xs">
          <div>
            <span className="text-[#766D70] block">Avg Sleep (7 Days)</span>
            <span className="font-bold text-[#403A3D] text-base">{summary.summary_stats.avg_sleep_hours} hrs</span>
          </div>
          <div>
            <span className="text-[#766D70] block">Avg Activity/Day</span>
            <span className="font-bold text-[#403A3D] text-base">{summary.summary_stats.avg_exercise_mins} mins</span>
          </div>
          <div>
            <span className="text-[#766D70] block">Days Logged</span>
            <span className="font-bold text-[#403A3D] text-base">{summary.summary_stats.tracked_days_count} Days</span>
          </div>
          <div>
            <span className="text-[#766D70] block">Frequent Symptoms</span>
            <span className="font-bold text-[#403A3D] text-xs">
              {summary.summary_stats.frequent_symptoms.join(', ') || 'Acne, Fatigue'}
            </span>
          </div>
        </div>

        {/* SECTION 2: RECENT CYCLE HISTORY */}
        <div className="space-y-3">
          <h3 className="font-serif-heading text-base font-bold text-[#403A3D] flex items-center gap-2 border-b border-[#EDE3E0] pb-2">
            <Calendar className="w-4 h-4 text-[#E8B4B8]" />
            Recent Cycle Logs
          </h3>
          <div className="space-y-2 text-xs">
            {summary.recent_cycles.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#FFF9F5] flex justify-between">
                <span className="font-semibold text-[#403A3D]">{c.start_date} to {c.end_date || 'Present'}</span>
                <span className="text-[#766D70]">{c.cycle_length} Days Length • {c.notes || 'Logged'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECENT SYMPTOMS */}
        <div className="space-y-3">
          <h3 className="font-serif-heading text-base font-bold text-[#403A3D] flex items-center gap-2 border-b border-[#EDE3E0] pb-2">
            <Activity className="w-4 h-4 text-[#C9B8D9]" />
            Recent Symptom Frequency & Severity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {summary.recent_symptoms.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-[#FFF9F5] flex justify-between">
                <span className="font-medium text-[#403A3D]">{s.symptom} ({s.severity})</span>
                <span className="text-[#766D70]">{s.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: DOCTOR NOTES & QUESTIONS */}
        <div className="space-y-3">
          <h3 className="font-serif-heading text-base font-bold text-[#403A3D] flex items-center gap-2 border-b border-[#EDE3E0] pb-2">
            <FileText className="w-4 h-4 text-[#B8C9B3]" />
            Questions & Notes for Healthcare Professional
          </h3>
          <textarea
            rows={4}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full p-4 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D] focus:outline-none"
          />
        </div>

        {/* Mandatory Footer Disclaimer */}
        <div className="pt-6 border-t border-[#EDE3E0] text-center text-[10px] text-[#766D70] space-y-1">
          <p className="font-bold text-[#403A3D]">Femora Health Journal • Personal Tracking Summary</p>
          <p>{summary.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};
