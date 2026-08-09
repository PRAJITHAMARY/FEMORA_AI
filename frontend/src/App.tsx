import { useState, useEffect } from 'react';
import type { User, Profile, Cycle, Symptom, LifestyleLog, PatternInsight } from './types';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './pages/Auth/AuthModal';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { CycleTracker } from './pages/CycleTracker';
import { SymptomTracker } from './pages/SymptomTracker';
import { LifestyleTracker } from './pages/LifestyleTracker';
import { PatternInsights } from './pages/PatternInsights';
import { Analytics } from './pages/Analytics';
import { WellnessSignals } from './pages/WellnessSignals';
import { FemoraAIChat } from './pages/FemoraAIChat';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { HealthSummary } from './pages/HealthSummary';
import { ChatHistory } from './pages/ChatHistory';
import { FeaturesPage } from './pages/FeaturesPage';
import { ProfilePrivacy } from './pages/ProfilePrivacy';
import { X } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user-123',
    name: 'Elena Rostova',
    email: 'elena@femora.well',
  });
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [pendingTargetTab, setPendingTargetTab] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // App Data States
  const [profile, setProfile] = useState<Profile>({
    user_id: 'demo-user-123',
    name: 'Elena Rostova',
    email: 'elena@femora.well',
    age: 27,
    height: 165,
    weight: 62.5,
    cycle_length_typical: 32,
    period_duration_typical: 5,
    last_period_date: '2026-08-01',
    tracking_preferences: ['Cycle', 'Symptoms', 'Sleep', 'Stress', 'Water'],
  });

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [lifestyle, setLifestyle] = useState<LifestyleLog[]>([]);
  const [insights, setInsights] = useState<PatternInsight[]>([]);

  // Quick Log Modal State
  const [logModalType, setLogModalType] = useState<'cycle' | 'symptom' | 'lifestyle' | null>(null);

  // Load backend seed data on startup
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    const p = await api.getProfile();
    setProfile(p);
    const c = await api.getCycles();
    setCycles(c);
    const s = await api.getSymptoms();
    setSymptoms(s);
    const l = await api.getLifestyle();
    setLifestyle(l);
    const i = await api.getInsights();
    setInsights(i);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (loggedUser: User, isNewUser?: boolean) => {
    setUser(loggedUser);
    setIsAuthOpen(false);
    if (isNewUser) {
      setShowOnboarding(true);
    } else if (pendingTargetTab) {
      setActiveTab(pendingTargetTab);
      setPendingTargetTab(null);
    } else {
      setActiveTab('dashboard');
    }
    loadAppData();
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('landing');
  };

  // Add Log Handlers
  const handleAddCycle = async (c: { start_date: string; end_date?: string; notes?: string }) => {
    await api.addCycle(c);
    const updated = await api.getCycles();
    setCycles(updated);
    setLogModalType(null);
  };

  const handleDeleteCycle = async (id: string) => {
    await api.deleteCycle(id);
    setCycles(cycles.filter((c) => c.id !== id));
  };

  const handleAddSymptom = async (s: { symptom: string; severity: any; date: string; notes?: string }) => {
    await api.addSymptom(s);
    const updated = await api.getSymptoms();
    setSymptoms(updated);
    setLogModalType(null);
  };

  const handleDeleteSymptom = async (id: string) => {
    await api.deleteSymptom(id);
    setSymptoms(symptoms.filter((s) => s.id !== id));
  };

  const handleAddLifestyle = async (log: any) => {
    await api.addLifestyle(log);
    const updated = await api.getLifestyle();
    setLifestyle(updated);
    setLogModalType(null);
  };

  const handleDeleteLifestyle = async (id: string) => {
    await api.deleteLifestyle(id);
    setLifestyle(lifestyle.filter((l) => l.id !== id));
  };

  const handleUpdateProfile = async (updated: Partial<Profile>) => {
    await api.updateProfile(updated);
    setProfile({ ...profile, ...updated });
  };

  if (showOnboarding) {
    return (
      <Onboarding
        user={user}
        onComplete={() => {
          setShowOnboarding(false);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  const isPublicPage = activeTab === 'landing' || activeTab === 'features' || activeTab === 'how-it-works';

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#403A3D] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={Boolean(user)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        userName={user?.name}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar (Only when logged in and not on purely public landing views) */}
        {user && !isPublicPage && (
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
        )}

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'landing' || activeTab === 'how-it-works' ? (
            <LandingPage onOpenAuth={handleOpenAuth} setActiveTab={setActiveTab} />
          ) : activeTab === 'features' ? (
            <FeaturesPage
              onNavigateTab={(tab) => {
                if (user) {
                  setActiveTab(tab);
                } else {
                  setPendingTargetTab(tab);
                  handleOpenAuth('signup');
                }
              }}
              onOpenAuth={(mode) => handleOpenAuth(mode)}
              isLoggedIn={Boolean(user)}
            />
          ) : activeTab === 'dashboard' ? (
            <Dashboard
              profile={profile}
              cycles={cycles}
              symptoms={symptoms}
              lifestyle={lifestyle}
              insights={insights}
              setActiveTab={setActiveTab}
              onOpenLogModal={(type) => setLogModalType(type)}
            />
          ) : activeTab === 'cycle' ? (
            <CycleTracker cycles={cycles} onAddCycle={handleAddCycle} onDeleteCycle={handleDeleteCycle} />
          ) : activeTab === 'symptoms' ? (
            <SymptomTracker symptoms={symptoms} onAddSymptom={handleAddSymptom} onDeleteSymptom={handleDeleteSymptom} />
          ) : activeTab === 'lifestyle' ? (
            <LifestyleTracker
              lifestyle={lifestyle}
              onAddLifestyle={handleAddLifestyle}
              onDeleteLifestyle={handleDeleteLifestyle}
            />
          ) : activeTab === 'insights' ? (
            <PatternInsights insights={insights} />
          ) : activeTab === 'analytics' ? (
            <Analytics cycles={cycles} symptoms={symptoms} lifestyle={lifestyle} />
          ) : activeTab === 'signals' ? (
            <WellnessSignals />
          ) : activeTab === 'chat' ? (
            <FemoraAIChat
              conversationId={selectedConversationId}
              userId={user?.id}
              onConversationStarted={(id) => setSelectedConversationId(id)}
            />
          ) : activeTab === 'knowledge' ? (
            <KnowledgeHub />
          ) : activeTab === 'summary' ? (
            <HealthSummary />
          ) : activeTab === 'history' ? (
            <ChatHistory
              userId={user?.id}
              onSelectConversation={(convId) => {
                setSelectedConversationId(convId);
                setActiveTab('chat');
              }}
              onNewChat={() => {
                setSelectedConversationId(null);
                setActiveTab('chat');
              }}
            />
          ) : (
            <ProfilePrivacy profile={profile} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {user && !isPublicPage && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* Persistent Educational Disclaimer Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Quick Logging Modal */}
      {logModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EDE3E0] max-w-md w-full rounded-3xl p-6 relative space-y-4 shadow-xl">
            <button
              onClick={() => setLogModalType(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#766D70] hover:text-[#403A3D]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">
              Quick Log — {logModalType.toUpperCase()}
            </h3>

            {logModalType === 'cycle' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  handleAddCycle({ start_date: target.startDate.value, notes: target.notes.value });
                }}
                className="space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Period Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Flow intensity, cramps..."
                    className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-full bg-[#E8B4B8] text-white font-semibold">
                  Save Period Entry 🩸
                </button>
              </form>
            )}

            {logModalType === 'symptom' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  handleAddSymptom({
                    symptom: target.symptom.value,
                    severity: target.severity.value,
                    date: new Date().toISOString().split('T')[0],
                    notes: target.notes.value,
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Symptom</label>
                  <select name="symptom" className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]">
                    <option value="Acne">Acne</option>
                    <option value="Fatigue">Fatigue</option>
                    <option value="Hair growth">Hair growth</option>
                    <option value="Mood changes">Mood changes</option>
                    <option value="Bloating">Bloating</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Severity</label>
                  <select name="severity" className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]">
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Details..."
                    className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-full bg-[#C9B8D9] text-white font-semibold">
                  Save Symptom Log 📝
                </button>
              </form>
            )}

            {logModalType === 'lifestyle' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  handleAddLifestyle({
                    date: new Date().toISOString().split('T')[0],
                    sleep_hours: Number(target.sleep.value),
                    exercise_minutes: Number(target.exercise.value),
                    water_intake: 8,
                    stress_level: target.stress.value,
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Sleep Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    name="sleep"
                    defaultValue="7.5"
                    className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Exercise Minutes</label>
                  <input
                    type="number"
                    name="exercise"
                    defaultValue="30"
                    className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#403A3D]">Stress Rating</label>
                  <select name="stress" className="w-full p-2.5 rounded-xl border border-[#EDE3E0] bg-[#FFF9F5]">
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-full bg-[#B8C9B3] text-white font-semibold">
                  Save Wellness Entry 🌿
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
