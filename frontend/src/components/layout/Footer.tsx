import React from 'react';
import { Logo } from '../common/Logo';
import { Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#FFF9F5] border-t border-[#EDE3E0] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#EDE3E0]">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-[#766D70] leading-relaxed max-w-sm">
              Femora is an AI-powered PCOS wellness and cycle companion. Designed with care to help you understand personal health patterns, track daily symptoms, and access trusted educational insights.
            </p>
            <p className="text-[11px] font-medium text-[#403A3D]">
              Understand your body. Nurture your wellbeing. 🌸
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-semibold text-sm text-[#403A3D]">Platform</h4>
            <ul className="space-y-2 text-xs text-[#766D70]">
              <li><button onClick={() => setActiveTab('features')} className="hover:text-[#403A3D] transition-colors">Features</button></li>
              <li><button onClick={() => setActiveTab('how-it-works')} className="hover:text-[#403A3D] transition-colors">How It Works</button></li>
              <li><button onClick={() => setActiveTab('knowledge')} className="hover:text-[#403A3D] transition-colors">Knowledge Hub</button></li>
              <li><button onClick={() => setActiveTab('chat')} className="hover:text-[#403A3D] transition-colors">Femora AI Companion</button></li>
            </ul>
          </div>

          {/* Col 3: Legal & Safety */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-semibold text-sm text-[#403A3D]">Safety & Trust</h4>
            <ul className="space-y-2 text-xs text-[#766D70]">
              <li><button onClick={() => setActiveTab('privacy')} className="hover:text-[#403A3D] transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActiveTab('privacy')} className="hover:text-[#403A3D] transition-colors">Educational Safety</button></li>
              <li><button onClick={() => setActiveTab('summary')} className="hover:text-[#403A3D] transition-colors">Health Summary Generator</button></li>
            </ul>
          </div>
        </div>

        {/* Persistent Medical Safety Disclaimer */}
        <div className="pt-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EDE3E0] text-[11px] text-[#766D70]">
            <Heart className="w-3.5 h-3.5 text-[#E8B4B8]" />
            <span>Femora is an educational and wellness-support platform and does not replace professional medical advice.</span>
          </div>
          <p className="text-[10px] text-[#766D70]/70">
            © {new Date().getFullYear()} Femora AI Platform. Built with pastel care & privacy.
          </p>
        </div>
      </div>
    </footer>
  );
};
