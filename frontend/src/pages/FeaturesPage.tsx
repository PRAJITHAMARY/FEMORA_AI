import React, { useState } from 'react';
import {
  Calendar,
  Activity,
  Heart,
  Sparkles,
  BarChart3,
  Bot,
  History,
  BookOpen,
  FileText,
  Bell,
  User,
  ArrowRight,
  CheckCircle2,
  Moon,
  Flame,
  Droplets,
  Smile,
  ShieldAlert,
  Cpu,
  Lock,
  MessageSquare
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isLoggedIn?: boolean;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onNavigateTab,
  onOpenAuth,
  isLoggedIn = false,
}) => {
  const [activeSubSection, setActiveSubSection] = useState('overview');

  const handleFeatureClick = (targetTab: string) => {
    if (isLoggedIn) {
      onNavigateTab(targetTab);
    } else {
      onOpenAuth('signup');
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSubSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      id: 'cycle',
      title: 'Cycle Tracking',
      icon: Calendar,
      badge: '🩸',
      bg: 'from-[#E8B4B8]/20 to-[#FFF9F5]',
      accent: '#E8B4B8',
      desc: 'Log period start and end dates, track typical length, and visualize monthly cycles on an interactive calendar.',
      target: 'cycle',
    },
    {
      id: 'symptoms',
      title: 'Symptom Log',
      icon: Activity,
      badge: '📝',
      bg: 'from-[#C9B8D9]/20 to-[#FFF9F5]',
      accent: '#C9B8D9',
      desc: 'Record symptoms like acne, fatigue, hair changes, and bloating with Low, Moderate, or High severity tags.',
      target: 'symptoms',
    },
    {
      id: 'lifestyle',
      title: 'Daily Wellness Tracking',
      icon: Heart,
      badge: '🌿',
      bg: 'from-[#B8C9B3]/20 to-[#FFF9F5]',
      accent: '#B8C9B3',
      desc: 'Track daily sleep duration, active movement minutes, water intake, stress ratings, and lifestyle journal notes.',
      target: 'lifestyle',
    },
    {
      id: 'insights',
      title: 'AI Pattern Insights',
      icon: Sparkles,
      badge: '✨',
      bg: 'from-[#F3C6B5]/20 to-[#FFF9F5]',
      accent: '#F3C6B5',
      desc: 'Discover correlation observations between sleep, stress, and symptom flare-ups in a non-diagnostic format.',
      target: 'insights',
    },
    {
      id: 'analytics',
      title: 'Progress Analytics',
      icon: BarChart3,
      badge: '📈',
      bg: 'from-[#BFD7E3]/20 to-[#FFF9F5]',
      accent: '#BFD7E3',
      desc: 'Visualize 7-day to 6-month trends with interactive charts for cycle rhythms, symptoms, and sleep.',
      target: 'analytics',
    },
    {
      id: 'chat',
      title: 'Femora AI Companion',
      icon: Bot,
      badge: '🌸',
      bg: 'from-[#E8B4B8]/20 to-[#C9B8D9]/20',
      accent: '#E8B4B8',
      desc: 'Ask questions, explore evidence-based PCOS knowledge, and receive structured educational responses.',
      target: 'chat',
    },
    {
      id: 'memory',
      title: '1-to-1 AI Conversations',
      icon: MessageSquare,
      badge: '💬',
      bg: 'from-[#C9B8D9]/20 to-[#FFF9F5]',
      accent: '#C9B8D9',
      desc: 'Enjoy fluid follow-up conversations where Femora AI remembers conversation history context.',
      target: 'chat',
    },
    {
      id: 'history',
      title: 'Chat History',
      icon: History,
      badge: '💭',
      bg: 'from-[#FFF9F5] to-[#F5F0FB]',
      accent: '#403A3D',
      desc: 'Access past conversation threads grouped by date with full search, rename, and delete capabilities.',
      target: 'history',
    },
    {
      id: 'rag',
      title: 'RAG Knowledge Engine',
      icon: Cpu,
      badge: '🧠',
      bg: 'from-[#B8C9B3]/20 to-[#FFF9F5]',
      accent: '#B8C9B3',
      desc: 'Educational responses grounded in peer-reviewed PCOS research articles with explicit citation sources.',
      target: 'knowledge',
    },
    {
      id: 'knowledge',
      title: 'Knowledge Hub',
      icon: BookOpen,
      badge: '📚',
      bg: 'from-[#F3C6B5]/20 to-[#FFF9F5]',
      accent: '#F3C6B5',
      desc: 'Explore curated evidence-based health articles, nutrition guides, and a interactive Myths vs. Facts module.',
      target: 'knowledge',
    },
    {
      id: 'summary',
      title: 'Health Summary',
      icon: FileText,
      badge: '📄',
      bg: 'from-[#E8B4B8]/20 to-[#FFF9F5]',
      accent: '#E8B4B8',
      desc: 'Generate doctor-ready personal health tracking summaries with one-click print and PDF export.',
      target: 'summary',
    },
    {
      id: 'reminders',
      title: 'Smart Reminders',
      icon: Bell,
      badge: '🔔',
      bg: 'from-[#C9B8D9]/20 to-[#FFF9F5]',
      accent: '#C9B8D9',
      desc: 'Gentle, supportive notifications for daily logging, cycle tracking, and weekly wellness check-ins.',
      target: 'profile',
    },
    {
      id: 'profile',
      title: 'Personal Profile',
      icon: User,
      badge: '👤',
      bg: 'from-[#B8C9B3]/20 to-[#FFF9F5]',
      accent: '#B8C9B3',
      desc: 'Customize typical cycle parameters, target wellness goals, and notification preferences.',
      target: 'profile',
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Lock,
      badge: '🔐',
      bg: 'from-[#FFF9F5] to-[#E8B4B8]/10',
      accent: '#403A3D',
      desc: 'User data is strictly isolated, encrypted, non-diagnostic, and fully exportable or erasable anytime.',
      target: 'profile',
    },
  ];

  return (
    <div className="space-y-16 animate-in fade-in pb-16 max-w-6xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-4 pb-8 border-b border-[#EDE3E0]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8B4B8]/15 border border-[#E8B4B8]/30 text-xs font-semibold text-[#403A3D] shadow-2xs">
          <span>🌸</span>
          <span>Explore The Complete Femora Ecosystem</span>
        </div>

        <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#403A3D] leading-tight max-w-4xl mx-auto">
          Everything you need to understand your wellbeing.
        </h1>

        <p className="text-sm sm:text-base text-[#766D70] max-w-2xl mx-auto leading-relaxed">
          Femora brings tracking, personal insights, AI-powered conversations, trusted education, and wellness monitoring together in one calm and supportive space.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {[
            { label: 'Personal Tracking', icon: '🌸' },
            { label: 'AI Companion', icon: '🤖' },
            { label: 'Smart Insights', icon: '📊' },
            { label: 'Trusted Knowledge', icon: '📚' },
          ].map((badge, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#EDE3E0] text-xs font-medium text-[#403A3D] shadow-2xs flex items-center gap-1.5"
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
          ))}
        </div>

        {/* Hero Visual Banner */}
        <div className="mt-8 femora-card p-8 bg-gradient-to-br from-[#FFF9F5] via-[#F5F0FB] to-[#F0F4F1] border border-[#EDE3E0] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4B8]/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9B8D9]/10 rounded-full blur-3xl -z-10" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/80 rounded-2xl border border-[#EDE3E0] space-y-1">
              <span className="text-2xl">🩸</span>
              <div className="text-xs font-bold text-[#403A3D]">Cycle Monitoring</div>
              <div className="text-[10px] text-[#766D70]">Rhythm & History</div>
            </div>
            <div className="p-4 bg-white/80 rounded-2xl border border-[#EDE3E0] space-y-1">
              <span className="text-2xl">📝</span>
              <div className="text-xs font-bold text-[#403A3D]">Symptom Logs</div>
              <div className="text-[10px] text-[#766D70]">Severity & Notes</div>
            </div>
            <div className="p-4 bg-white/80 rounded-2xl border border-[#EDE3E0] space-y-1">
              <span className="text-2xl">🤖</span>
              <div className="text-xs font-bold text-[#403A3D]">Femora AI</div>
              <div className="text-[10px] text-[#766D70]">1-to-1 Memory</div>
            </div>
            <div className="p-4 bg-white/80 rounded-2xl border border-[#EDE3E0] space-y-1">
              <span className="text-2xl">📄</span>
              <div className="text-xs font-bold text-[#403A3D]">Health Summary</div>
              <div className="text-[10px] text-[#766D70]">Doctor Export</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY SUB-NAVIGATION BAR */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border border-[#EDE3E0] rounded-full p-1.5 shadow-sm max-w-2xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tracking', label: 'Tracking' },
          { id: 'insights', label: 'Insights' },
          { id: 'ai', label: 'Femora AI' },
          { id: 'knowledge', label: 'Knowledge' },
          { id: 'summary', label: 'Summary' },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => scrollToSection(sub.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSubSection === sub.id
                ? 'bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white shadow-2xs'
                : 'text-[#766D70] hover:text-[#403A3D] hover:bg-[#FFF9F5]'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* 3. FEATURE OVERVIEW GRID */}
      <section id="overview" className="space-y-6 scroll-mt-28">
        <div className="text-center space-y-2">
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#403A3D]">
            Complete Feature Ecosystem
          </h2>
          <p className="text-xs text-[#766D70] max-w-lg mx-auto">
            14 core capabilities designed specifically for non-diagnostic PCOS support and daily wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => handleFeatureClick(feat.target)}
                className={`femora-card p-5 bg-gradient-to-br ${feat.bg} border border-[#EDE3E0] hover:border-[#E8B4B8] transition-all flex flex-col justify-between space-y-4 group cursor-pointer`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-2xs"
                      style={{ backgroundColor: `${feat.accent}25` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feat.accent }} />
                    </div>
                    <span className="text-sm">{feat.badge}</span>
                  </div>

                  <h3 className="font-serif-heading text-base font-bold text-[#403A3D] group-hover:text-[#E8B4B8] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#766D70] leading-relaxed">{feat.desc}</p>
                </div>

                <div className="pt-2 border-t border-[#EDE3E0]/60 flex items-center gap-1 text-xs font-semibold text-[#403A3D] group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: feat.accent }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CYCLE TRACKING SECTION */}
      <section id="tracking" className="space-y-8 scroll-mt-28 pt-6 border-t border-[#EDE3E0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="px-3 py-1 rounded-full bg-[#E8B4B8]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
              🩸 Cycle Management
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
              Understand your cycle.
            </h2>

            <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
              Track your menstrual cycle, record period start and end dates, and view your cycle history in one calm, simple place.
            </p>

            <ul className="space-y-2.5 text-xs text-[#403A3D]">
              {[
                'Period start & end date logging',
                'Cycle length calculator & history log',
                'Visual monthly calendar grid view',
                'Historical length consistency tracking',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#E8B4B8] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleFeatureClick('cycle')}
              className="px-6 py-3 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Cycle Tracking →</span>
            </button>
          </div>

          {/* Visual Mockup */}
          <div className="femora-card p-6 bg-white border border-[#EDE3E0] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EDE3E0] pb-3">
              <div className="flex items-center gap-2 font-serif-heading font-bold text-sm text-[#403A3D]">
                <Calendar className="w-4 h-4 text-[#E8B4B8]" />
                <span>August 2026</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E8B4B8]/20 text-[10px] font-bold text-[#403A3D]">
                Cycle Day 9 • Follicular
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-[#766D70] font-medium">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isPeriod = day >= 1 && day <= 5;
                const isToday = day === 9;
                return (
                  <div
                    key={day}
                    className={`py-2 rounded-xl text-xs font-semibold ${
                      isPeriod
                        ? 'bg-[#E8B4B8] text-white'
                        : isToday
                        ? 'border-2 border-[#E8B4B8] text-[#403A3D]'
                        : 'bg-[#FFF9F5] text-[#766D70]'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SYMPTOM TRACKING SECTION */}
      <section className="space-y-8 pt-6 border-t border-[#EDE3E0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Visual Chart Mockup */}
          <div className="order-2 lg:order-1 femora-card p-6 bg-white border border-[#EDE3E0] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EDE3E0] pb-3">
              <div className="flex items-center gap-2 font-serif-heading font-bold text-sm text-[#403A3D]">
                <Activity className="w-4 h-4 text-[#C9B8D9]" />
                <span>Logged Symptom Patterns</span>
              </div>
              <span className="text-[10px] text-[#766D70]">Last 14 Days</span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Acne (Jawline)', severity: 'Moderate', pct: 60, color: '#E8B4B8' },
                { name: 'Fatigue', severity: 'High', pct: 85, color: '#C9B8D9' },
                { name: 'Hair Growth (Hirsutism)', severity: 'Low', pct: 30, color: '#B8C9B3' },
                { name: 'Bloating', severity: 'Moderate', pct: 50, color: '#F3C6B5' },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-[#403A3D]">
                    <span>{s.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF9F5] border border-[#EDE3E0]">
                      {s.severity}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-5">
            <span className="px-3 py-1 rounded-full bg-[#C9B8D9]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
              📝 Symptom Log
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
              Notice how you're feeling.
            </h2>

            <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
              Track physical and emotional symptoms over time to build a clearer picture of your personal wellness patterns.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              {['Acne', 'Hair Growth', 'Hair Loss', 'Fatigue', 'Mood Changes', 'Bloating', 'Headache', 'Sleep Difficulty'].map((sym, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] text-[#403A3D] font-medium"
                >
                  {sym}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleFeatureClick('symptoms')}
              className="px-6 py-3 rounded-full bg-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Track Symptoms →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. DAILY WELLNESS SECTION */}
      <section className="space-y-8 pt-6 border-t border-[#EDE3E0]">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#B8C9B3]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
            🌿 Daily Wellness
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
            Your everyday wellness, in one place.
          </h2>
          <p className="text-xs text-[#766D70] max-w-md mx-auto">
            Log sleep, movement, hydration, and stress levels to discover daily lifestyle rhythms.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="femora-card p-5 bg-white border border-[#EDE3E0] text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#C9B8D9]/20 flex items-center justify-center mx-auto text-lg">
              <Moon className="w-5 h-5 text-[#C9B8D9]" />
            </div>
            <div className="text-xs font-bold text-[#403A3D]">Sleep Duration</div>
            <div className="text-lg font-bold text-[#403A3D]">7.5 hrs</div>
            <div className="text-[10px] text-[#766D70]">Restorative Sleep</div>
          </div>

          <div className="femora-card p-5 bg-white border border-[#EDE3E0] text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#B8C9B3]/20 flex items-center justify-center mx-auto text-lg">
              <Flame className="w-5 h-5 text-[#B8C9B3]" />
            </div>
            <div className="text-xs font-bold text-[#403A3D]">Movement</div>
            <div className="text-lg font-bold text-[#403A3D]">30 mins</div>
            <div className="text-[10px] text-[#766D70]">Gentle Walking</div>
          </div>

          <div className="femora-card p-5 bg-white border border-[#EDE3E0] text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#BFD7E3]/20 flex items-center justify-center mx-auto text-lg">
              <Droplets className="w-5 h-5 text-[#BFD7E3]" />
            </div>
            <div className="text-xs font-bold text-[#403A3D]">Hydration</div>
            <div className="text-lg font-bold text-[#403A3D]">8 glasses</div>
            <div className="text-[10px] text-[#766D70]">Daily Target Met</div>
          </div>

          <div className="femora-card p-5 bg-white border border-[#EDE3E0] text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F3C6B5]/20 flex items-center justify-center mx-auto text-lg">
              <Smile className="w-5 h-5 text-[#F3C6B5]" />
            </div>
            <div className="text-xs font-bold text-[#403A3D]">Stress Rating</div>
            <div className="text-lg font-bold text-[#403A3D]">Low</div>
            <div className="text-[10px] text-[#766D70]">Evening Relaxation</div>
          </div>
        </div>
      </section>

      {/* 7. PERSONAL AI INSIGHTS & WELLNESS SIGNALS */}
      <section id="insights" className="space-y-8 scroll-mt-28 pt-6 border-t border-[#EDE3E0]">
        <div className="femora-card p-8 bg-gradient-to-br from-[#FFF9F5] to-[#F5F0FB] border border-[#EDE3E0] space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E8B4B8]" />
            <span className="text-xs font-bold text-[#403A3D] uppercase tracking-wider">
              Smart Pattern Engine
            </span>
          </div>

          <h2 className="font-serif-heading text-3xl font-bold text-[#403A3D]">
            Discover patterns in your own data.
          </h2>

          <p className="text-xs sm:text-sm text-[#766D70] max-w-xl leading-relaxed">
            Femora looks at the information you choose to track and helps you notice changes and correlations over time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#EDE3E0] space-y-2">
              <div className="text-xs font-bold text-[#403A3D] flex items-center gap-1.5">
                <span>✨</span> Femora Pattern Insight
              </div>
              <p className="text-xs text-[#766D70] leading-relaxed">
                “During days when you logged fewer than 6.5 hours of sleep, you were 2.5x more likely to record higher symptom severity (Fatigue & Acne).”
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EDE3E0] space-y-2">
              <div className="text-xs font-bold text-[#403A3D] flex items-center gap-1.5">
                <span>🌿</span> Hydration & Energy Insight
              </div>
              <p className="text-xs text-[#766D70] leading-relaxed">
                “Days with 8+ glasses of water correlated with lower reported fatigue and more consistent evening relaxation.”
              </p>
            </div>
          </div>

          {/* Non-Diagnostic Disclaimer Banner */}
          <div className="bg-white/80 p-3.5 rounded-2xl border border-[#EDE3E0] flex items-center gap-2 text-[11px] text-[#766D70] italic">
            <ShieldAlert className="w-4 h-4 text-[#E8B4B8] shrink-0" />
            <span>Insights reflect patterns in your tracked information and are not medical diagnoses.</span>
          </div>

          {/* Wellness Signals */}
          <div className="pt-4 border-t border-[#EDE3E0] space-y-3">
            <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">
              Non-Medical Wellness Signals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-1">
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <span>🟢</span> Stable Signal
                </div>
                <p className="text-[11px] text-[#766D70]">
                  Your tracked habits and cycle indicators have remained relatively consistent.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1">
                <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <span>🟡</span> Worth Noticing
                </div>
                <p className="text-[11px] text-[#766D70]">
                  Some tracked areas have changed compared with your previous logged cycle.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-1">
                <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <span>🔴</span> Consider Reviewing
                </div>
                <p className="text-[11px] text-[#766D70]">
                  Changes in your tracking have persisted. Consider discussing concerns with a doctor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FEMORA AI & 1-TO-1 CONVERSATIONS SECTION */}
      <section id="ai" className="space-y-8 scroll-mt-28 pt-6 border-t border-[#EDE3E0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="px-3 py-1 rounded-full bg-[#E8B4B8]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
              🤖 Femora AI Companion
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
              Meet Femora AI 🌸
            </h2>

            <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
              Ask questions, explore trusted PCOS information, understand your tracking data, and enjoy natural 1-to-1 conversations with Femora AI.
            </p>

            <ul className="space-y-2 text-xs text-[#403A3D] font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8B4B8]" />
                <span>Context-aware 1-to-1 conversation memory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9B8D9]" />
                <span>Evidence-based RAG knowledge references</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8C9B3]" />
                <span>Non-diagnostic, safe educational guidance</span>
              </li>
            </ul>

            <button
              onClick={() => handleFeatureClick('chat')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Meet Femora AI →</span>
            </button>
          </div>

          {/* Dialogue Mockup */}
          <div className="femora-card p-6 bg-[#FFF9F5] border border-[#EDE3E0] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#EDE3E0] pb-3 text-xs font-bold text-[#403A3D]">
              <Bot className="w-4 h-4 text-[#E8B4B8]" />
              <span>1-to-1 Conversational Memory Preview</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#E8B4B8]/20 text-[#403A3D] p-3 rounded-2xl rounded-tr-xs ml-8 font-medium">
                “What is PCOS?”
              </div>

              <div className="bg-white border border-[#EDE3E0] p-4 rounded-2xl rounded-tl-xs space-y-2">
                <div className="font-semibold text-[#403A3D]">🌸 Femora AI</div>
                <p className="text-[#766D70] leading-relaxed">
                  Polycystic Ovary Syndrome (PCOS) is a common endocrine and metabolic condition characterized by hormonal variations.
                </p>
              </div>

              <div className="bg-[#E8B4B8]/20 text-[#403A3D] p-3 rounded-2xl rounded-tr-xs ml-8 font-medium">
                “What symptoms can occur?”
              </div>

              <div className="bg-white border border-[#EDE3E0] p-4 rounded-2xl rounded-tl-xs space-y-2">
                <div className="font-semibold text-[#403A3D]">🌸 Femora AI (Remembers context)</div>
                <p className="text-[#766D70] leading-relaxed">
                  Commonly observed PCOS symptoms include irregular cycle timing, acne, fatigue, hair changes, and bloating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CHAT HISTORY SECTION */}
      <section className="space-y-8 pt-6 border-t border-[#EDE3E0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* History Preview Mockup */}
          <div className="order-2 lg:order-1 femora-card p-6 bg-white border border-[#EDE3E0] space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EDE3E0] pb-3">
              <div className="flex items-center gap-2 font-serif-heading font-bold text-sm text-[#403A3D]">
                <History className="w-4 h-4 text-[#C9B8D9]" />
                <span>Chat History Mockup</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF9F5] border border-[#EDE3E0]">
                2 Conversations
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[10px] font-bold text-[#766D70] uppercase">Today</div>
              <div className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#403A3D]">🌸 Understanding PCOS Symptoms</div>
                  <div className="text-[10px] text-[#766D70]">4 messages • Today, 1:42 PM</div>
                </div>
                <span className="text-xs text-[#766D70]">⋯</span>
              </div>

              <div className="text-[10px] font-bold text-[#766D70] uppercase pt-2">Yesterday</div>
              <div className="p-3 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#403A3D]">🌸 Sleep and Wellbeing</div>
                  <div className="text-[10px] text-[#766D70]">2 messages • Yesterday, 4:15 PM</div>
                </div>
                <span className="text-xs text-[#766D70]">⋯</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-5">
            <span className="px-3 py-1 rounded-full bg-[#C9B8D9]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
              💭 Persistent History
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
              Your conversations, saved.
            </h2>

            <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
              Your Femora AI conversations are organized in one place so you can return to them, search questions, or start fresh anytime.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-[#403A3D] font-medium">
              <div className="flex items-center gap-1.5">✓ Date Grouping</div>
              <div className="flex items-center gap-1.5">✓ Search Messages</div>
              <div className="flex items-center gap-1.5">✓ Title Renaming</div>
              <div className="flex items-center gap-1.5">✓ Thread Deletion</div>
            </div>

            <button
              onClick={() => handleFeatureClick('history')}
              className="px-6 py-3 rounded-full bg-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Chat History →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. RAG KNOWLEDGE SYSTEM & HUB */}
      <section id="knowledge" className="space-y-8 scroll-mt-28 pt-6 border-t border-[#EDE3E0]">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#F3C6B5]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
            🧠 RAG Architecture
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
            Answers grounded in trusted information.
          </h2>
          <p className="text-xs text-[#766D70] max-w-md mx-auto">
            Femora uses Retrieval-Augmented Generation to reference evidence-based PCOS medical literature.
          </p>
        </div>

        {/* RAG Flow Diagram */}
        <div className="femora-card p-6 bg-white border border-[#EDE3E0] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center items-center text-xs font-medium">
            <div className="p-3 bg-[#FFF9F5] rounded-2xl border border-[#EDE3E0]">
              <div className="text-base mb-1">💬</div>
              <div className="font-bold text-[#403A3D]">User Question</div>
            </div>

            <div className="hidden md:block text-[#E8B4B8] text-lg font-bold">→</div>

            <div className="p-3 bg-[#FFF9F5] rounded-2xl border border-[#EDE3E0]">
              <div className="text-base mb-1">📚</div>
              <div className="font-bold text-[#403A3D]">RAG Vector Retrieval</div>
            </div>

            <div className="hidden md:block text-[#E8B4B8] text-lg font-bold">→</div>

            <div className="p-3 bg-[#FFF9F5] rounded-2xl border border-[#EDE3E0]">
              <div className="text-base mb-1">🌸</div>
              <div className="font-bold text-[#403A3D]">Sourced AI Response</div>
            </div>
          </div>
        </div>

        {/* Knowledge Hub Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-xl font-bold text-[#403A3D]">Knowledge Hub Topics</h3>
            <button
              onClick={() => handleFeatureClick('knowledge')}
              className="text-xs font-bold text-[#E8B4B8] hover:underline"
            >
              Explore All Articles →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {['PCOS Basics', 'Symptoms & Causes', 'Nutrition & Glycemic Index', 'Movement & Sleep', 'Stress & Cortisol', 'Myths vs. Facts', 'Cycle Basics', 'Fertility Awareness'].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleFeatureClick('knowledge')}
                className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] hover:border-[#E8B4B8] font-semibold text-[#403A3D] text-center transition-all cursor-pointer"
              >
                📚 {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. HEALTH SUMMARY SECTION */}
      <section id="summary" className="space-y-8 scroll-mt-28 pt-6 border-t border-[#EDE3E0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="px-3 py-1 rounded-full bg-[#E8B4B8]/20 text-[#403A3D] text-xs font-bold uppercase tracking-wider">
              📄 Health Summary
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
              Your personal wellness summary.
            </h2>

            <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
              Bring your tracked cycle, symptom, and lifestyle logs together in a clean doctor-ready report format.
            </p>

            <ul className="space-y-2 text-xs text-[#403A3D] font-medium">
              <li className="flex items-center gap-2">✓ Cycle length & period history summary</li>
              <li className="flex items-center gap-2">✓ Top recorded symptom frequency</li>
              <li className="flex items-center gap-2">✓ Average sleep & activity statistics</li>
              <li className="flex items-center gap-2">✓ One-click print & PDF export</li>
            </ul>

            <button
              onClick={() => handleFeatureClick('summary')}
              className="px-6 py-3 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View My Summary →</span>
            </button>
          </div>

          <div className="femora-card p-6 bg-white border border-[#EDE3E0] space-y-3 text-xs shadow-sm">
            <div className="flex justify-between items-center border-b border-[#EDE3E0] pb-2 font-bold text-[#403A3D]">
              <span>📄 My Femora Summary</span>
              <span className="text-[10px] text-[#766D70]">Elena Rostova • Aug 2026</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9F5] border border-[#EDE3E0] space-y-1">
              <div className="font-bold text-[#403A3D]">Observed Averages</div>
              <div className="text-[11px] text-[#766D70]">
                Avg Sleep: 7.2 hrs • Avg Activity: 25 mins • Typical Cycle: 32 days
              </div>
            </div>
            <div className="text-[10px] text-[#766D70] italic">
              "Personal tracking summary for healthcare discussion — NOT a medical diagnosis."
            </div>
          </div>
        </div>
      </section>

      {/* 12. PRIVACY & ECOSYSTEM ARCHITECTURE */}
      <section className="space-y-8 pt-6 border-t border-[#EDE3E0]">
        <div className="femora-card p-8 bg-gradient-to-br from-[#FFF9F5] via-[#F0F4F1] to-[#FFF9F5] border border-[#EDE3E0] text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#B8C9B3]/20 flex items-center justify-center mx-auto text-xl text-[#B8C9B3]">
            <Lock className="w-6 h-6 text-[#B8C9B3]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif-heading text-3xl font-bold text-[#403A3D]">
              How Femora Connects Everything
            </h2>
            <p className="text-xs text-[#766D70] max-w-lg mx-auto">
              Your tracking data, insights, and educational conversations work in harmony in a private, encrypted environment.
            </p>
          </div>

          {/* Visual Ecosystem Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-xs">
            <div className="p-4 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
              <div className="font-bold text-[#403A3D]">1. TRACK 🩸</div>
              <p className="text-[11px] text-[#766D70]">Cycles, Symptoms, Sleep, Water & Stress</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
              <div className="font-bold text-[#403A3D]">2. UNDERSTAND 📊</div>
              <p className="text-[11px] text-[#766D70]">Pattern Insights & Progress Analytics</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#EDE3E0] space-y-1">
              <div className="font-bold text-[#403A3D]">3. LEARN 🤖</div>
              <p className="text-[11px] text-[#766D70]">Femora AI & Sourced Knowledge Hub</p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FINAL CALL TO ACTION */}
      <section className="text-center space-y-6 pt-6 border-t border-[#EDE3E0]">
        <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
          Your wellness journey starts here.
        </h2>
        <p className="text-xs sm:text-sm text-[#766D70] max-w-md mx-auto">
          Track what matters. Understand your patterns. Learn with confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 cursor-pointer"
          >
            🌸 Get Started
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-[#EDE3E0] bg-white text-xs font-semibold text-[#403A3D] hover:bg-[#FFF9F5] cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </section>
    </div>
  );
};
