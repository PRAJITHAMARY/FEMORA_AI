import { useState } from 'react';
import type { Profile } from '../types';
import { User, Bell, Lock, Save } from 'lucide-react';

interface ProfilePrivacyProps {
  profile: Profile;
  onUpdateProfile: (updated: Partial<Profile>) => void;
  onLogout: () => void;
}

export const ProfilePrivacy: React.FC<ProfilePrivacyProps> = ({ profile, onUpdateProfile, onLogout }) => {
  const [name, setName] = useState(profile.name || 'Elena Rostova');
  const [age, setAge] = useState(profile.age || 27);
  const [height, setHeight] = useState(profile.height || 165);
  const [weight, setWeight] = useState(profile.weight || 62.5);

  const [reminders, setReminders] = useState({
    symptoms: true,
    cycle: true,
    sleep: true,
    water: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, age, height, weight });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">My Profile & Settings</h1>
        </div>
        <p className="text-xs text-[#766D70]">
          Manage your personal details, reminder notifications, and data privacy controls.
        </p>
      </div>

      {/* PERSONAL DETAILS FORM */}
      <form onSubmit={handleSave} className="femora-card p-6 space-y-5 bg-white">
        <div className="flex items-center justify-between border-b border-[#EDE3E0] pb-3">
          <h3 className="font-serif-heading text-lg font-bold text-[#403A3D] flex items-center gap-2">
            <User className="w-5 h-5 text-[#E8B4B8]" />
            Personal Details
          </h3>
          {saved && <span className="text-xs font-semibold text-emerald-600">Saved successfully!</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-[#403A3D]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#403A3D]">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#403A3D]">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[#403A3D]">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold shadow-xs hover:opacity-95 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>

      {/* NOTIFICATION REMINDERS */}
      <div className="femora-card p-6 space-y-4 bg-white">
        <h3 className="font-serif-heading text-lg font-bold text-[#403A3D] flex items-center gap-2 border-b border-[#EDE3E0] pb-3">
          <Bell className="w-5 h-5 text-[#C9B8D9]" />
          Reminders & Notifications
        </h3>

        <div className="space-y-3 text-xs">
          {[
            { key: 'symptoms', label: 'Log today\'s symptoms reminder', desc: 'Daily evening prompt' },
            { key: 'cycle', label: 'Update cycle status reminder', desc: 'Monthly prompt near expected start' },
            { key: 'sleep', label: 'Record sleep hours reminder', desc: 'Morning prompt' },
            { key: 'water', label: 'Hydration reminder', desc: 'Midday prompt' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0]">
              <div>
                <div className="font-semibold text-[#403A3D]">{item.label}</div>
                <div className="text-[11px] text-[#766D70]">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={(reminders as any)[item.key]}
                onChange={() => setReminders({ ...reminders, [item.key]: !(reminders as any)[item.key] })}
                className="w-4 h-4 accent-[#E8B4B8]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PRIVACY & DATA CONTROL */}
      <div className="femora-card p-6 space-y-4 bg-[#FFF9F5] border-[#EDE3E0]">
        <h3 className="font-serif-heading text-lg font-bold text-[#403A3D] flex items-center gap-2 border-b border-[#EDE3E0] pb-3">
          <Lock className="w-5 h-5 text-[#B8C9B3]" />
          Privacy & Data Controls
        </h3>

        <p className="text-xs text-[#766D70] leading-relaxed">
          Femora respects your body data. Your personal entries remain completely under your control. We do not sell health data to third-party ad networks.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => alert('Your data file export has been prepared.')}
            className="px-5 py-2.5 rounded-full bg-white border border-[#EDE3E0] text-xs font-medium text-[#403A3D]"
          >
            Export All My Data (JSON)
          </button>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-full bg-white border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  );
};
