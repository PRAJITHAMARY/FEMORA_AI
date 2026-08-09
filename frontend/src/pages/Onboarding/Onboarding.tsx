import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface OnboardingProps {
  user: any;
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Profile
  const [age, setAge] = useState(27);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(62.5);

  // Step 2: Cycle
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-08-01');
  const [typicalLength, setTypicalLength] = useState(32);
  const [typicalDuration, setTypicalDuration] = useState(5);

  // Step 3: Lifestyle
  const [avgSleep, setAvgSleep] = useState(7.5);
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [waterIntake, setWaterIntake] = useState(8);
  const [stressLevel, setStressLevel] = useState('Low');

  // Step 4: Preferences
  const availablePrefs = [
    { id: 'Cycle', label: '🩸 Menstrual Cycle Dates' },
    { id: 'Symptoms', label: '📝 PCOS Symptoms (Acne, Fatigue, Hair)' },
    { id: 'Sleep', label: '🌙 Nightly Sleep Hours' },
    { id: 'Stress', label: '🧘 Daily Stress Rating' },
    { id: 'Water', label: '💧 Water & Hydration Target' },
    { id: 'Exercise', label: '🌿 Physical Movement & Exercise' },
  ];
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['Cycle', 'Symptoms', 'Sleep', 'Stress', 'Water']);

  const togglePref = (id: string) => {
    if (selectedPrefs.includes(id)) {
      setSelectedPrefs(selectedPrefs.filter((p) => p !== id));
    } else {
      setSelectedPrefs([...selectedPrefs, id]);
    }
  };

  const handleFinish = async () => {
    await api.updateProfile({
      age,
      height,
      weight,
      cycle_length_typical: typicalLength,
      period_duration_typical: typicalDuration,
      last_period_date: lastPeriodDate,
      tracking_preferences: selectedPrefs,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white border border-[#EDE3E0] rounded-3xl p-8 shadow-xl space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <Logo size="md" />
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#E8B4B8] tracking-widest uppercase">
              Welcome, {user?.name || 'Friend'} 🌸
            </span>
            <h2 className="font-serif-heading text-2xl font-bold text-[#403A3D]">
              Personalize your Femora journal
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-[#766D70] font-medium">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* STEP CONTENT */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Step 1 — Basic Profile</h3>
              <p className="text-xs text-[#766D70]">Help us tailor your personal tracking views. All fields are optional.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Step 2 — Cycle Rhythms</h3>
              <p className="text-xs text-[#766D70]">Provide typical cycle length to help calibrate your monthly calendar.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Last Period Start Date</label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#403A3D]">Typical Cycle Length (Days)</label>
                  <input
                    type="number"
                    value={typicalLength}
                    onChange={(e) => setTypicalLength(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                  />
                  <span className="text-[10px] text-[#766D70]">Average: 28 - 35 days</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#403A3D]">Period Duration (Days)</label>
                  <input
                    type="number"
                    value={typicalDuration}
                    onChange={(e) => setTypicalDuration(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                  />
                  <span className="text-[10px] text-[#766D70]">Average: 3 - 7 days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Step 3 — Daily Lifestyle Baseline</h3>
              <p className="text-xs text-[#766D70]">Set your daily sleep, hydration, and stress targets.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Average Sleep (Hours/Night)</label>
                <input
                  type="number"
                  step="0.5"
                  value={avgSleep}
                  onChange={(e) => setAvgSleep(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Target Hydration (Glasses/Day)</label>
                <input
                  type="number"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Typical Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                >
                  <option value="Light">Light (Walking, gentle movement)</option>
                  <option value="Moderate">Moderate (Pilates, yoga, 3x week)</option>
                  <option value="Active">Active (Strength training, cardio)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#403A3D]">Typical Stress Level</label>
                <select
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D]"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">Step 4 — Tracking Preferences</h3>
              <p className="text-xs text-[#766D70]">Choose what you want to emphasize on your dashboard.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePrefs.map((pref) => {
                const isSelected = selectedPrefs.includes(pref.id);
                return (
                  <div
                    key={pref.id}
                    onClick={() => togglePref(pref.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'bg-[#E8B4B8]/15 border-[#E8B4B8] text-[#403A3D] font-medium'
                        : 'bg-[#FFF9F5] border-[#EDE3E0] text-[#766D70]'
                    }`}
                  >
                    <span>{pref.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-[#E8B4B8] border-[#E8B4B8] text-white' : 'border-[#EDE3E0]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EDE3E0]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#766D70] hover:text-[#403A3D]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="text-xs text-[#766D70] hover:underline"
            >
              Skip Onboarding
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold shadow-xs hover:opacity-95"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-md hover:opacity-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
