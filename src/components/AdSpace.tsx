import React from "react";
import { Info, ExternalLink } from "lucide-react";

interface AdSpaceProps {
  type: "banner" | "sidebar" | "content";
  slotId?: string;
}

export default function AdSpace({ type, slotId = "0000000" }: AdSpaceProps) {
  // We can show premium mock ads that look cohesive and beautiful with the design
  const mockAds = {
    banner: {
      title: "CloudStorage Pro - Secure Backup for Your Utilities",
      desc: "Get 1TB of ultra-fast cloud storage for your images, PDFs, and media files. 14-day free trial, no credit card required.",
      cta: "Try Free",
      sponsor: "CloudStorage Inc.",
      bg: "bg-radial from-slate-900 via-slate-950 to-black text-white border-slate-800",
    },
    content: {
      title: "Need a full-featured PDF Editor?",
      desc: "Merge, split, compress, and sign PDFs online with advanced security features. Perfect for remote teams.",
      cta: "Get CloudPDF",
      sponsor: "CloudPDF Tools",
      bg: "bg-linear-to-r from-indigo-50 to-purple-50 text-slate-800 border-indigo-100 dark:from-slate-900 dark:to-slate-950 dark:text-white dark:border-slate-800",
    }
  };

  const ad = type === "banner" ? mockAds.banner : mockAds.content;

  if (type === "banner") {
    return (
      <div 
        id="ad-banner-top" 
        className={`w-full ${ad.bg} border rounded-2xl p-4 md:p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-700/50 group`}
      >
        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
          <span>Sponsored</span>
          <Info className="w-3 h-3 text-slate-500" />
        </div>

        <div className="flex-1 space-y-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300 inline-block font-mono">
            {ad.sponsor}
          </span>
          <h4 className="text-sm md:text-base font-semibold font-display tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            {ad.title}
          </h4>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {ad.desc}
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-center">
          <span className="text-[10px] text-slate-500 font-mono hidden lg:inline-block">
            AdSense Slot #{slotId}
          </span>
          <button 
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
          >
            {ad.cta}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Content block advertisement (under tools)
  return (
    <div 
      id="ad-banner-bottom" 
      className={`w-full ${ad.bg} border rounded-2xl p-4 md:p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:shadow-sm`}
    >
      <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-mono tracking-wider text-slate-400 uppercase">
        <span>Advertisement</span>
        <Info className="w-2.5 h-2.5" />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm font-display">
          C
        </div>
        <div>
          <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-display">
            {ad.title}
          </h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            {ad.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-200/50 dark:border-slate-800">
        <span className="text-[9px] text-slate-400 font-mono">
          AdSense Unit #{slotId}
        </span>
        <button 
          type="button"
          className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors flex items-center gap-1 shrink-0"
        >
          {ad.cta}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
