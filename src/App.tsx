import React, { useState, useEffect, useRef } from "react";
import { 
  Youtube, 
  Image as ImageIcon, 
  Layers, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  HelpCircle,
  Menu,
  Wrench,
  Sparkles,
  Search,
  ExternalLink,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import custom components
import AdSpace from "./components/AdSpace";
import ThumbnailDownloader from "./components/ThumbnailDownloader";
import ImageCompressor from "./components/ImageCompressor";
import PdfMerger from "./components/PdfMerger";
import AgeCalculator from "./components/AgeCalculator";

type ToolId = "youtube" | "compressor" | "pdf" | "age" | null;

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Global Keyboard Shortcuts ('/' to focus search, 'Esc' to return to dashboard or clear/blur)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      );

      if (e.key === "/") {
        if (!isInput) {
          e.preventDefault();
          if (activeTool !== null) {
            setActiveTool(null);
          }
          setTimeout(() => {
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          }, 10);
        }
      } else if (e.key === "Escape" || e.key === "Esc") {
        if (isInput && target) {
          target.blur();
        }
        if (activeTool !== null) {
          setActiveTool(null);
        } else if (searchQuery !== "") {
          setSearchQuery("");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, searchQuery]);

  const tools = [
    {
      id: "youtube" as const,
      name: "YouTube Thumbnail Downloader",
      desc: "Extract and grab video thumbnail images in MaxRes, HD, or standard resolutions directly.",
      icon: Youtube,
      color: "from-red-500 to-rose-600",
      badge: "Media Utility",
      tagline: "Ultra-fast extraction",
    },
    {
      id: "compressor" as const,
      name: "Local Image Compressor",
      desc: "Reduce file sizes of JPG, PNG, and WEBP photos securely using high-performance canvas routines.",
      icon: ImageIcon,
      color: "from-emerald-500 to-teal-600",
      badge: "Optimizer",
      tagline: "100% Client-side",
    },
    {
      id: "pdf" as const,
      name: "Interactive PDF Merger",
      desc: "Assemble multiple PDF booklets, documents or pages into a single file with custom ordering.",
      icon: Layers,
      color: "from-indigo-500 to-purple-600",
      badge: "Document Tool",
      tagline: "Multi-file queuing",
    },
    {
      id: "age" as const,
      name: "Precise Age Calculator",
      desc: "Calculate exact years, weeks, days, and seconds of life with western and eastern zodiac signs.",
      icon: Calendar,
      color: "from-amber-500 to-orange-600",
      badge: "Calculators",
      tagline: "Live-updating ticking",
    },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans flex flex-col selection:bg-indigo-500/10 selection:text-indigo-600 transition-colors duration-300">
      
      {/* Top Banner Ad Space */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4">
        <AdSpace type="banner" slotId="9981024" />
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-2xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button 
            type="button"
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-slate-950 dark:text-white hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:rotate-6 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">
              Multi-Tool<span className="text-indigo-600">Suite</span>
            </span>
          </button>

          {/* Quick Header Navigation */}
          {activeTool && (
            <nav className="hidden md:flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
              <ChevronRight className="w-4 h-4 shrink-0" />
              <button 
                type="button"
                onClick={() => setActiveTool(null)}
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-semibold"
              >
                All Utilities
              </button>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-slate-800 dark:text-slate-100 font-bold">
                {tools.find(t => t.id === activeTool)?.name}
              </span>
            </nav>
          )}

          {/* Action Links / Badge */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full uppercase border border-emerald-100/60 dark:border-emerald-900/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Tools Working Offline
            </span>

            {/* Dark Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle Theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const randomId = tools[Math.floor(Math.random() * tools.length)].id;
                setActiveTool(randomId);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Surprise Me</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {!activeTool ? (
            
            /* HOMEPAGE VIEW */
            <motion.div
              key="homepage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Hero Showcase Section */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono uppercase tracking-wider">
                  🎯 Simple, Fast & Secure Web Utilities
                </span>
                <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-950 dark:text-white leading-tight">
                  Perform daily tasks in <span className="text-indigo-600 underline decoration-indigo-300 dark:decoration-indigo-500/30 decoration-wavy underline-offset-6">one dashboard</span>
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  No account registration, no cookies, no tracking. High-performance browser-native compression, downloading, merging and counting utilities that protect your privacy.
                </p>

                {/* Instant Filter Search Bar */}
                <div className="max-w-md mx-auto pt-2 relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools (e.g. image, thumbnail, pdf)..."
                    className="w-full pl-9 pr-14 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-100 font-medium"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 pointer-events-none">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="pointer-events-auto text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-flex items-center justify-center w-5 h-5 text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded shadow-2xs">
                        /
                      </kbd>
                    )}
                  </div>
                </div>
              </div>

              {/* Bento Grid Tools List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        setActiveTool(tool.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between min-h-[220px] relative overflow-hidden cursor-pointer"
                    >
                      {/* Background decorative blob */}
                      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-slate-50 dark:bg-slate-800/20 rounded-full group-hover:scale-125 transition-transform duration-500 -z-10" />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-xl bg-linear-to-br ${tool.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                            {tool.badge}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="font-bold text-base font-display text-slate-950 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <span className="text-slate-400 dark:text-slate-500 font-normal italic group-hover:text-indigo-600/70 dark:group-hover:text-indigo-400/70">
                          {tool.tagline}
                        </span>
                        <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          Open Tool <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredTools.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">No matching tools found</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-505 mt-1">Try searching for keywords like "thumbnail", "PDF", "image", or "age".</p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Show all tools
                    </button>
                  </div>
                )}
              </div>

              {/* Informative Grid Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100">Zero Upload Policy</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Your images, PDF lists, and dates of birth never leave your web browser. Everything runs locally in client memory.
                    </p>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100">Pure JavaScript Utility</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Optimized for lightweight script cycles so assets render instantly even on slower mobile network speeds.
                    </p>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100">Continuous Fresh States</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      No heavy server caches. Hit the refresh button or "Reset" to flush local temporary file URLs from memory instantly.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            
            /* ACTIVE TOOL DETAILED WORKSPACE VIEW */
            <motion.div
              key="workspace"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Back breadcrumb navigation header */}
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-2xs transition-all cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    ESC
                  </kbd>
                </button>

                <div className="flex gap-1.5">
                  {tools.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setActiveTool(t.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                        activeTool === t.id
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-2xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                      title={t.name}
                    >
                      {React.createElement(t.icon, { className: "w-3.5 h-3.5" })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Component Loader */}
              <div>
                {activeTool === "youtube" && <ThumbnailDownloader />}
                {activeTool === "compressor" && <ImageCompressor />}
                {activeTool === "pdf" && <PdfMerger />}
                {activeTool === "age" && <AgeCalculator />}
              </div>

              {/* Below-Tool Ad Placement Space */}
              <div className="mt-8 pt-4">
                <AdSpace type="content" slotId="4558291" />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800 dark:text-slate-200">
              Multi-Tool Suite
            </span>
            <span>•</span>
            <span>All tools free to use, no subscription needed.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500">
              AD-UNITS DESIGNED COMPLIANT WITH ADSENSE BANNER SPECIFICATIONS
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
