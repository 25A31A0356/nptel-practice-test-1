import React from "react";
import { GraduationCap, Award } from "lucide-react";

interface PragatiLogoProps {
  className?: string;
  variant?: "header" | "stacked" | "emblem" | "compact" | "badge";
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  subtitleText?: string;
  theme?: "dark" | "light" | "gold";
}

export const PragatiLogo: React.FC<PragatiLogoProps> = ({
  className = "",
  variant = "header",
  size = "md",
  showSubtitle = true,
  subtitleText = "ONLINE EXAMINATION PORTAL"
}) => {
  // Emblem image size mappings
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10"
  };

  // Title typography sizes
  const titleSizes = {
    sm: "text-lg sm:text-xl font-black tracking-tight",
    md: "text-xl sm:text-2xl font-black tracking-tight",
    lg: "text-2xl sm:text-3xl md:text-4xl font-black tracking-tight",
    xl: "text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
  };

  // Subtitle typography sizes
  const subSizes = {
    sm: "text-[10px] tracking-wider",
    md: "text-xs tracking-wider",
    lg: "text-xs sm:text-sm tracking-wider",
    xl: "text-sm sm:text-base tracking-wider"
  };

  // Emblem Only Variant
  if (variant === "emblem") {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-slate-900 text-white p-2.5 shadow-sm ${className}`}>
        <GraduationCap className={iconSizes[size]} />
      </div>
    );
  }

  // Stacked / Centered Hero Variant
  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center space-y-2 ${className}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white shadow-sm">
          <GraduationCap className="w-6 h-6" />
        </div>

        <div className="space-y-0.5">
          <div className={`font-black uppercase tracking-tight text-slate-950 ${titleSizes[size]}`}>
            NPTEL
          </div>
          <div className={`font-bold uppercase tracking-wider text-slate-700 font-mono ${subSizes[size]}`}>
            METAL ADDITIVE MANUFACTURING
          </div>
          {showSubtitle && subtitleText && (
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase pt-0.5 text-slate-500 font-mono">
              {subtitleText}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact Badge Variant
  if (variant === "compact" || variant === "badge") {
    return (
      <div className={`inline-flex items-center gap-2.5 bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-xs ${className}`}>
        <div className="rounded-lg bg-black text-white p-1 shrink-0">
          <GraduationCap className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-black text-xs text-slate-950 tracking-tight leading-none">
            NPTEL
          </span>
          <span className="font-mono font-bold text-[9px] text-slate-600 tracking-wider leading-tight pt-0.5">
            METAL ADDITIVE MANUFACTURING
          </span>
        </div>
      </div>
    );
  }

  // Default: Header Horizontal Layout
  return (
    <div className={`inline-flex items-center gap-3 text-left ${className}`}>
      <div className="rounded-xl bg-black text-white p-2 shrink-0 shadow-sm">
        <GraduationCap className={iconSizes[size]} />
      </div>

      <div className="flex flex-col justify-center">
        <div className={`font-black uppercase leading-none tracking-tight text-slate-950 ${titleSizes[size]}`}>
          NPTEL
        </div>
        <div className={`font-mono font-bold uppercase tracking-wider text-slate-700 pt-1 leading-none ${subSizes[size]}`}>
          METAL ADDITIVE MANUFACTURING
        </div>
        {showSubtitle && subtitleText && (
          <div className="hidden sm:block text-[10px] font-bold tracking-widest uppercase pt-1 font-mono text-slate-500">
            {subtitleText}
          </div>
        )}
      </div>
    </div>
  );
};



