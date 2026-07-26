import React, { useState, useEffect } from "react";
import { Calendar, Clock, Sparkles, Heart, RefreshCw, Compass, Moon, Award, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AgeStats {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

interface BirthdayCountdown {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  dayOfWeek: string;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("1998-06-15");
  const [birthTime, setBirthTime] = useState<string>("08:30");
  const [stats, setStats] = useState<AgeStats | null>(null);
  const [countdown, setCountdown] = useState<BirthdayCountdown | null>(null);
  const [zodiac, setZodiac] = useState<{ sign: string; emoji: string; element: string; traits: string } | null>(null);
  const [chineseZodiac, setChineseZodiac] = useState<{ animal: string; emoji: string; traits: string } | null>(null);

  // Western Zodiac Sign Finder
  const getZodiacSign = (dateStr: string) => {
    const d = new Date(dateStr);
    const m = d.getMonth() + 1; // 1-12
    const day = d.getDate();

    if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) {
      return { sign: "Capricorn", emoji: "♑", element: "Earth", traits: "Disciplined, Ambitious, Patient" };
    } else if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) {
      return { sign: "Aquarius", emoji: "♒", element: "Air", traits: "Innovative, Independent, Humanitarian" };
    } else if ((m === 2 && day >= 19) || (m === 3 && day <= 20)) {
      return { sign: "Pisces", emoji: "♓", element: "Water", traits: "Compassionate, Artistic, Intuitive" };
    } else if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) {
      return { sign: "Aries", emoji: "♈", element: "Fire", traits: "Courageous, Energetic, Confident" };
    } else if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) {
      return { sign: "Taurus", emoji: "♉", element: "Earth", traits: "Reliable, Patient, Practical" };
    } else if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) {
      return { sign: "Gemini", emoji: "♊", element: "Air", traits: "Adaptable, Outgoing, Intellectual" };
    } else if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) {
      return { sign: "Cancer", emoji: "♋", element: "Water", traits: "Intuitive, Protective, Sentimental" };
    } else if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) {
      return { sign: "Leo", emoji: "♌", element: "Fire", traits: "Generous, Loyal, Charismatic" };
    } else if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) {
      return { sign: "Virgo", emoji: "♍", element: "Earth", traits: "Analytical, Dedicated, Helpful" };
    } else if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) {
      return { sign: "Libra", emoji: "♎", element: "Air", traits: "Harmonious, Diplomatic, Gracious" };
    } else if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) {
      return { sign: "Scorpio", emoji: "♏", element: "Water", traits: "Passionate, Strategic, Resilient" };
    } else {
      return { sign: "Sagittarius", emoji: "♐", element: "Fire", traits: "Optimistic, Adventurous, Philosophical" };
    }
  };

  // Chinese Zodiac Finder
  const getChineseZodiac = (dateStr: string) => {
    const year = new Date(dateStr).getFullYear();
    const animals = [
      { name: "Monkey", emoji: "🐒", traits: "Clever, energetic, and flexible" },
      { name: "Rooster", emoji: "🐓", traits: "Observant, hardworking, and courageous" },
      { name: "Dog", emoji: "🐕", traits: "Loyal, honest, and trustworthy" },
      { name: "Pig", emoji: "🐖", traits: "Compassionate, generous, and diligent" },
      { name: "Rat", emoji: "🐀", traits: "Quick-witted, resourceful, and versatile" },
      { name: "Ox", emoji: "🐂", traits: "Diligent, dependable, and strong" },
      { name: "Tiger", emoji: "🐅", traits: "Brave, competitive, and unpredictable" },
      { name: "Rabbit", emoji: "🐇", traits: "Gentle, quiet, and elegant" },
      { name: "Dragon", emoji: "🐉", traits: "Confident, intelligent, and enthusiastic" },
      { name: "Snake", emoji: "🐍", traits: "Wise, enigmatic, and intuitive" },
      { name: "Horse", emoji: "🐎", traits: "Animated, active, and energetic" },
      { name: "Goat", emoji: "🐐", traits: "Calm, gentle, and sympathetic" }
    ];
    return animals[year % 12];
  };

  // Calculate age and countdown stats dynamically
  const calculateAge = () => {
    if (!birthDate) return;

    const birthDateTimeStr = `${birthDate}T${birthTime || "00:00"}`;
    const birthTimeMs = new Date(birthDateTimeStr).getTime();
    const nowMs = Date.now();

    if (birthTimeMs > nowMs) {
      setStats(null);
      setCountdown(null);
      return;
    }

    const diffMs = nowMs - birthTimeMs;

    // Direct stats breakdowns
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // Exact years, months, days calculation
    const birth = new Date(birthDateTimeStr);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Get remaining days of previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = (years * 12) + months;

    setStats({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    });

    // Next Birthday countdown calculation
    const nextBday = new Date(birth);
    nextBday.setFullYear(now.getFullYear());

    // If birthday already passed this year, set to next year
    if (nextBday.getTime() < now.getTime()) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }

    const bdayDiffMs = nextBday.getTime() - now.getTime();
    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysArr[nextBday.getDay()];

    const bdaySecs = Math.floor(bdayDiffMs / 1000);
    const bdayMins = Math.floor(bdaySecs / 60);
    const bdayHours = Math.floor(bdayMins / 60);
    const bdayDays = Math.floor(bdayHours / 24);

    // Estimate countdown months and days
    let countdownMonths = nextBday.getMonth() - now.getMonth();
    let countdownDays = nextBday.getDate() - now.getDate();

    if (countdownDays < 0) {
      countdownMonths -= 1;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      countdownDays += prevMonth.getDate();
    }
    if (countdownMonths < 0) {
      countdownMonths += 12;
    }

    setCountdown({
      months: countdownMonths,
      days: countdownDays,
      hours: bdayHours % 24,
      minutes: bdayMins % 60,
      seconds: bdaySecs % 60,
      dayOfWeek,
    });

    // Update astro assets
    setZodiac(getZodiacSign(birthDate));
    setChineseZodiac(getChineseZodiac(birthDate));
  };

  useEffect(() => {
    calculateAge();

    // Setup rapid timer to show milliseconds / ticking seconds live!
    const timer = setInterval(() => {
      calculateAge();
    }, 1000);

    return () => clearInterval(timer);
  }, [birthDate, birthTime]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div id="age-calculator-root" className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              Live Age Calculator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Calculate your precise age in dynamic units with real-time countdowns.
            </p>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Time of Birth (Optional)
            </label>
            <div className="relative">
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Primary Age Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary elegant count card */}
            <div className="bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-indigo-900/40">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
              
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
                Current True Age
              </span>
              
              <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <div className="text-5xl md:text-6xl font-black font-display tracking-tight">
                  {stats.years} <span className="text-2xl md:text-3xl font-semibold text-slate-300">Years</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold font-display tracking-tight text-indigo-200">
                  {stats.months} <span className="text-lg md:text-xl font-medium text-slate-400">Months</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold font-display tracking-tight text-indigo-200">
                  {stats.days} <span className="text-lg md:text-xl font-medium text-slate-400">Days</span>
                </div>
              </div>

              {/* Ticking live counter of total stats */}
              <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between text-xs text-indigo-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  Live ticking counter:
                </span>
                <span className="font-mono text-sm font-bold text-white tracking-widest bg-white/5 px-2.5 py-1 rounded">
                  {formatNumber(stats.totalSeconds)} <span className="text-[10px] text-slate-400 font-normal">secs</span>
                </span>
              </div>
            </div>

            {/* In-depth unit grids */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Total Months", value: stats.totalMonths, color: "border-indigo-100 dark:border-indigo-900/30" },
                { label: "Total Weeks", value: stats.totalWeeks, color: "border-purple-100 dark:border-purple-900/30" },
                { label: "Total Days", value: stats.totalDays, color: "border-pink-100 dark:border-pink-900/30" },
                { label: "Total Hours", value: stats.totalHours, color: "border-emerald-100 dark:border-emerald-900/30" },
                { label: "Total Minutes", value: stats.totalMinutes, color: "border-blue-100 dark:border-blue-900/30" },
                { label: "Total Seconds", value: stats.totalSeconds, color: "border-rose-100 dark:border-rose-900/30" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white dark:bg-slate-900 border ${item.color} rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow`}
                >
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="text-lg md:text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1.5 truncate">
                    {formatNumber(item.value)}
                  </div>
                </div>
              ))}
            </div>

            {/* Biological Milestones */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500" />
                Biological Milestones (Estimates)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-950/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                    Heart Beats
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                    ~{formatNumber(stats.totalMinutes * 72)}
                  </div>
                  <p className="text-[10px] text-slate-400">At an average of 72 beats/min</p>
                </div>

                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Breaths Taken
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                    ~{formatNumber(stats.totalMinutes * 16)}
                  </div>
                  <p className="text-[10px] text-slate-400">At an average of 16 breaths/min</p>
                </div>

                <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-950/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                    <Moon className="w-3.5 h-3.5" />
                    Time Slept
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                    ~{formatNumber(Math.round(stats.totalDays / 3))} days
                  </div>
                  <p className="text-[10px] text-slate-400">Based on 8 hours of sleep/day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar countdown & Astro panels */}
          <div className="lg:col-span-4 space-y-6">
            {/* Countdown to next Birthday */}
            {countdown && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Next Birthday Countdown
                </h3>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xl font-bold font-mono text-slate-800 dark:text-white">
                      {countdown.months}
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Months</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xl font-bold font-mono text-slate-800 dark:text-white">
                      {countdown.days}
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Days</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xl font-bold font-mono text-slate-800 dark:text-white">
                      {countdown.hours}
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Hours</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {countdown.seconds}
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Secs</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 pt-3">
                  Your next birthday will be on a <span className="font-bold text-slate-800 dark:text-slate-200">{countdown.dayOfWeek}</span>!
                </div>
              </div>
            )}

            {/* Astro Astrology Card */}
            {zodiac && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-500" />
                  Astrological Signs
                </h3>

                <div className="space-y-4">
                  {/* Western Sign */}
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-2xl flex items-center justify-center shrink-0">
                      {zodiac.emoji}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Western Zodiac Sign
                      </h4>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {zodiac.sign} <span className="text-xs font-medium text-slate-400 font-mono">({zodiac.element} Element)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Personality traits: <span className="font-medium text-slate-700 dark:text-slate-300">{zodiac.traits}</span>
                      </p>
                    </div>
                  </div>

                  {/* Chinese Sign */}
                  {chineseZodiac && (
                    <div className="flex gap-3 items-start border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-2xl flex items-center justify-center shrink-0">
                        {chineseZodiac.emoji}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Chinese Zodiac Sign
                        </h4>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          Year of the {chineseZodiac.animal}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          General traits: <span className="font-medium text-slate-700 dark:text-slate-300">{chineseZodiac.traits}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
