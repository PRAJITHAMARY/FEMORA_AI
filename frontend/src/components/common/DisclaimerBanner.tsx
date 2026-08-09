import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  text?: string;
  variant?: 'subtle' | 'card' | 'footer';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  text = 'Femora provides educational and wellness support and does not replace professional medical advice or diagnoses.',
  variant = 'subtle',
}) => {
  if (variant === 'footer') {
    return (
      <div className="bg-[#FFF9F5] border-t border-[#EDE3E0] py-4 px-6 text-center text-xs text-[#766D70]">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#E8B4B8] shrink-0" />
          <span>{text}</span>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-[#FFF9F5] border border-[#EDE3E0] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#766D70]">
        <ShieldAlert className="w-4 h-4 text-[#C9B8D9] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#403A3D] font-medium block mb-0.5">Educational Support Disclaimer</strong>
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F5]/80 backdrop-blur-xs border border-[#EDE3E0] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-[#766D70]">
      <Info className="w-3.5 h-3.5 text-[#E8B4B8] shrink-0" />
      <span>{text}</span>
    </div>
  );
};
