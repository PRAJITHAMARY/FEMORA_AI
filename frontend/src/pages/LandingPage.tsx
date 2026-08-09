import {
  Sparkles,
  Calendar,
  Activity,
  Heart,
  Bot,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, setActiveTab }) => {
  const features = [
    {
      icon: Calendar,
      title: 'Cycle Tracking',
      desc: 'Log menstrual cycles, view historical length trends, and notice body rhythms without diagnostic pressure.',
      badge: '🌸 Pastel Rhythms',
      gradient: 'pastel-gradient-blush',
    },
    {
      icon: Activity,
      title: 'Symptom Tracking',
      desc: 'Track acne, fatigue, hair growth/loss, mood changes, and bloating with severity levels and optional notes.',
      badge: '📝 Daily Signals',
      gradient: 'pastel-gradient-lavender',
    },
    {
      icon: Heart,
      title: 'Lifestyle Tracking',
      desc: 'Monitor sleep duration, daily movement, water intake, and stress levels to build sustainable wellness routines.',
      badge: '🌿 Daily Habits',
      gradient: 'pastel-gradient-sage',
    },
    {
      icon: Sparkles,
      title: 'AI Pattern Insights',
      desc: 'Observe correlations between your sleep, stress, and symptom trends (e.g. sleep vs fatigue flare-ups).',
      badge: '✨ Observation Engine',
      gradient: 'pastel-gradient-peach',
    },
    {
      icon: Bot,
      title: 'Femora AI Companion',
      desc: 'A calm, supportive RAG-powered assistant to ask educational questions about PCOS, nutrition, and stress.',
      badge: '🤖 AI Companion',
      gradient: 'pastel-gradient-blue',
    },
    {
      icon: BookOpen,
      title: 'Knowledge Hub',
      desc: 'Access evidence-based articles, debunked myths, and trusted public health resources on PCOS management.',
      badge: '📚 Evidence-Based',
      gradient: 'pastel-gradient-lavender',
    },
  ];

  const steps = [
    { number: '01', title: 'Track', desc: 'Record your cycle dates, physical symptoms, sleep hours, and daily stress levels in seconds.' },
    { number: '02', title: 'Understand', desc: 'Femora analyzes your personal historical data to highlight observable correlations.' },
    { number: '03', title: 'Discover', desc: 'See visual pattern insights (Observation ≠ Diagnosis) to empower your lifestyle decisions.' },
    { number: '04', title: 'Learn', desc: 'Ask Femora AI educational questions and access source-cited articles in the Knowledge Hub.' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EDE3E0] shadow-2xs text-xs font-medium text-[#403A3D]">
              <span className="w-2 h-2 rounded-full bg-[#E8B4B8] animate-pulse"></span>
              <span>AI-Powered PCOS Wellness & Cycle Companion</span>
            </div>

            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#403A3D] leading-[1.15]">
              Understand your body. <br />
              <span className="italic font-normal text-[#E8B4B8]">Nurture your wellbeing.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#766D70] leading-relaxed max-w-xl">
              Femora is an AI-powered wellness companion that helps you track your cycle, understand personal patterns, build healthier habits, and access trusted PCOS information.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E8B4B8] via-[#C9B8D9] to-[#E8B4B8] text-white text-sm font-semibold shadow-md hover:opacity-95 transition-all transform active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('features')}
                className="px-6 py-3.5 rounded-full bg-white border border-[#EDE3E0] text-[#403A3D] text-sm font-medium hover:bg-[#FFF9F5] hover:border-[#E8B4B8] transition-all cursor-pointer"
              >
                Explore Femora →
              </button>
            </div>

            {/* Non-medical Disclaimer */}
            <div className="pt-2">
              <DisclaimerBanner text="Femora provides educational wellness tracking and pattern discovery. It does not provide medical diagnoses or replace clinical care." />
            </div>
          </div>

          {/* Right Organic Pastel SVG Hero Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl p-6 bg-gradient-to-br from-[#FFF9F5] via-[#FDF0F2] to-[#F5F0FB] border border-[#EDE3E0] shadow-xl flex flex-col justify-between overflow-hidden">
              {/* Abstract Floating Pastel Spheres */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#E8B4B8]/30 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#C9B8D9]/30 blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#B8C9B3]/20 blur-3xl"></div>

              {/* Sample Dashboard Preview Card */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#EDE3E0] shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8B4B8]/20 flex items-center justify-center text-lg">
                      🌸
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#403A3D]">Cycle Day 14</h4>
                      <p className="text-[11px] text-[#766D70]">Follicular Phase • 31 Day Cycle</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#B8C9B3]/20 text-[#403A3D] text-[10px] font-medium">
                    🟢 Stable Rhythms
                  </span>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#EDE3E0] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#403A3D]">✨ Personal Pattern Discovery</span>
                    <span className="text-[10px] text-[#766D70]">Observation</span>
                  </div>
                  <p className="text-xs text-[#766D70] leading-snug">
                    “On weeks with 7.5+ sleep hours, your recorded fatigue frequency decreased by 40%.”
                  </p>
                  <p className="text-[9px] text-[#766D70]/80 italic">
                    Data correlation only • Not a medical diagnosis
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#EDE3E0]/60 text-xs text-[#766D70]">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#C9B8D9]" />
                  <span>Femora AI Ready</span>
                </div>
                <span>100% Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO TRUST MESSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-[#EDE3E0] shadow-sm text-center space-y-6">
          <h3 className="font-serif-heading text-xl font-semibold text-[#403A3D]">
            Your wellness journey, understood better.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8B4B8]/20 flex items-center justify-center shrink-0 text-base">
                🌸
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#403A3D]">Personal Tracking</h4>
                <p className="text-xs text-[#766D70]">Effortlessly record cycles, symptoms, sleep, stress, and lifestyle habits.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C9B8D9]/20 flex items-center justify-center shrink-0 text-base">
                🤖
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#403A3D]">AI-Powered Insights</h4>
                <p className="text-xs text-[#766D70]">Discover observable data trends across your sleep, stress, and symptom history.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#EDE3E0] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#B8C9B3]/20 flex items-center justify-center shrink-0 text-base">
                📚
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#403A3D]">Trusted Health Education</h4>
                <p className="text-xs text-[#766D70]">RAG-powered answers sourced from public health guidelines and medical research.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#E8B4B8] tracking-widest uppercase">Designed for Calm & Clarity</span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
            Everything you need for PCOS wellness tracking
          </h2>
          <p className="text-sm text-[#766D70]">
            Femora combines cycle tracking, symptom logging, daily habit monitoring, and intelligent AI companion responses into one soft, trustworthy space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`femora-card-interactive p-6 space-y-4 ${feat.gradient}`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center border border-[#EDE3E0]">
                  <feat.icon className="w-5 h-5 text-[#E8B4B8]" />
                </div>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/80 border border-[#EDE3E0] text-[#403A3D]">
                  {feat.badge}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif-heading text-lg font-semibold text-[#403A3D]">{feat.title}</h3>
                <p className="text-xs text-[#766D70] leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#C9B8D9] tracking-widest uppercase">Simple 4-Step Journey</span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#403A3D]">
            How Femora supports your daily rhythm
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="femora-card p-6 relative overflow-hidden space-y-4">
              <span className="font-serif-heading text-4xl font-bold text-[#E8B4B8]/30">
                {step.number}
              </span>
              <div className="space-y-2">
                <h3 className="font-serif-heading text-xl font-semibold text-[#403A3D]">{step.title}</h3>
                <p className="text-xs text-[#766D70] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRIVACY & SAFETY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FFF9F5] via-[#FDF0F2] to-[#FFF9F5] rounded-3xl p-8 sm:p-12 border border-[#EDE3E0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-medium text-[#403A3D] border border-[#EDE3E0]">
              <Lock className="w-3.5 h-3.5 text-[#B8C9B3]" />
              <span>Privacy & Medical Safeguards</span>
            </div>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#403A3D]">
              Built with privacy and ethical medical boundaries
            </h3>
            <p className="text-xs sm:text-sm text-[#766D70] leading-relaxed">
              We believe health tools should build understanding, not anxiety. Femora explicitly separates observational data tracking from clinical diagnoses. Your data is isolated, never sold, and formatted for clear doctor-patient discussions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#403A3D]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#B8C9B3]" /> No Medical Diagnosis Claims</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#B8C9B3]" /> Non-Prescriptive Guidance</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#B8C9B3]" /> Printable Doctor Summary</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#B8C9B3]" /> User Controlled Data Deletion</div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white p-6 rounded-2xl border border-[#EDE3E0] shadow-sm text-center space-y-3 max-w-xs">
              <div className="w-12 h-12 rounded-full bg-[#E8B4B8]/20 flex items-center justify-center mx-auto text-xl">
                🌸
              </div>
              <h4 className="font-serif-heading font-semibold text-sm text-[#403A3D]">Empowerment over Anxiety</h4>
              <p className="text-xs text-[#766D70]">
                “Track your body’s signals with gentleness, curiosity, and evidence-based support.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="femora-card p-10 bg-gradient-to-tr from-[#FFF9F5] via-[#FDF0F2] to-[#F5F0FB] space-y-6">
          <h2 className="font-serif-heading text-3xl font-bold text-[#403A3D]">
            Start your personal wellness story today
          </h2>
          <p className="text-xs sm:text-sm text-[#766D70] max-w-md mx-auto">
            Join Femora to track your cycle, observe personal symptom trends, and access calm AI guidance.
          </p>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E8B4B8] via-[#C9B8D9] to-[#E8B4B8] text-white text-sm font-semibold shadow-md hover:opacity-95 transition-all transform active:scale-95"
          >
            Get Started Free 🌸
          </button>
        </div>
      </section>
    </div>
  );
};
