"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface Milestone {
  id: string;
  year?: string;
  date: string;
  duration?: string;
  title: string;
  company?: string;
  location?: string;
  logo?: string;
  summary?: string;
  description?: string;
  bullets?: string[];
  technologies?: string[];
  skills?: string[];
}

export interface TimelineProps {
  milestones: Milestone[];
  className?: string;
}

export default function ScrollTimeline({ milestones, className = "" }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger line growth based on viewport scroll
      const triggerPoint = windowHeight * 0.65;
      const totalHeight = rect.height;
      const scrolledPast = triggerPoint - rect.top;

      let progress = scrolledPast / totalHeight;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 font-sans ${className}`} ref={containerRef}>
      <div className="relative">
        {/* Fine, subtle background rail line (1px, soft opacity) */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-200/70 dark:bg-neutral-800/70 -translate-x-1/2" />

        {/* Animated Drawing Foreground Line (1px, delicate opacity) */}
        <div
          className="absolute left-6 md:left-1/2 top-0 w-[1px] bg-neutral-400 dark:bg-neutral-500 -translate-x-1/2 transition-all duration-150 ease-out z-0"
          style={{ height: `${scrollProgress * 100}%` }}
        />

        <div className="flex flex-col gap-16 md:gap-24 relative z-10">
          {milestones.map((milestone, index) => {
            const itemThreshold = index / (milestones.length - 1 || 1);
            const isActive = scrollProgress >= itemThreshold - 0.08;
            const isEven = index % 2 === 0;

            // Pure clean circular dot: NO blue halo, NO ring
            const dotClasses = isActive
              ? "border-foreground bg-background scale-110"
              : "border-neutral-300 dark:border-neutral-700 bg-background scale-100";

            const techList = milestone.technologies || milestone.skills || [];
            const shortSummary = milestone.summary || milestone.description;

            // Date Block (clean normal typography, no pill container)
            const dateBlock = (alignRight: boolean) => (
              <div
                className={`flex flex-col ${
                  alignRight ? "md:items-end md:text-right" : "md:items-start md:text-left"
                }`}
              >
                {milestone.logo && (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2.5 shadow-sm border border-neutral-200/90 dark:border-white/15 flex items-center justify-center shrink-0 mb-3 transition-transform duration-300 hover:scale-105">
                    <img
                      src={milestone.logo}
                      alt={milestone.company || milestone.title}
                      className="max-w-full max-h-full object-contain"
                      loading="eager"
                    />
                  </div>
                )}
                {milestone.year && (
                  <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-normal leading-tight block">
                    {milestone.year}
                  </span>
                )}
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  {milestone.date}
                  {milestone.duration && (
                    <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500 ml-1.5 whitespace-nowrap">
                      · {milestone.duration}
                    </span>
                  )}
                </span>
                {milestone.location && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 block">
                    {milestone.location}
                  </span>
                )}
              </div>
            );

            // Explanation Block (Normal bold title, clear readable text)
            const contentBlock = (
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-normal leading-snug">
                  {milestone.title}
                </h3>

                {milestone.company && (
                  <p className="text-sm sm:text-base font-medium text-neutral-500 dark:text-neutral-400 mt-1 mb-3">
                    {milestone.company}
                  </p>
                )}

                {shortSummary && (
                  <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 font-normal">
                    {shortSummary}
                  </p>
                )}

                {milestone.bullets && milestone.bullets.length > 0 && (
                  <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    {milestone.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="text-neutral-400 dark:text-neutral-500 select-none shrink-0">–</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {techList.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50">
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      <span className="font-medium text-foreground uppercase tracking-wider text-xs mr-2 font-mono">
                        Technologies :
                      </span>
                      <span className="font-mono text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                        {techList.join("  •  ")}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );

            return (
              <div key={milestone.id} className="relative w-full">
                {/* Center / Left Timeline Dot: Clean circle without any blue glow or ring */}
                <div
                  className={`absolute left-6 md:left-1/2 top-4 w-3.5 h-3.5 rounded-full border-2 -translate-x-1/2 transition-all duration-300 z-20 ${dotClasses}`}
                />

                {/* 1. Desktop Layout (Alternating: Date on one side, Explanation on the other) */}
                <div className="hidden md:flex items-start w-full">
                  {/* Left Side */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="w-1/2 pr-12"
                  >
                    {isEven ? dateBlock(true) : contentBlock}
                  </motion.div>

                  {/* Right Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="w-1/2 pl-12"
                  >
                    {isEven ? contentBlock : dateBlock(false)}
                  </motion.div>
                </div>

                {/* 2. Mobile Layout (< 768px: Clean linear layout) */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="md:hidden pl-14 text-left"
                >
                  <div className="flex items-center gap-3.5 mb-2.5">
                    {milestone.logo && (
                      <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-sm border border-neutral-200/90 dark:border-white/15 flex items-center justify-center shrink-0">
                        <img
                          src={milestone.logo}
                          alt={milestone.company || milestone.title}
                          className="max-w-full max-h-full object-contain"
                          loading="eager"
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-base font-bold text-foreground block leading-tight">
                        {milestone.date}
                        {milestone.duration && (
                          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400 ml-1.5 whitespace-nowrap">
                            · {milestone.duration}
                          </span>
                        )}
                      </span>
                      {milestone.location && (
                        <span className="text-xs text-neutral-400 block mt-0.5">
                          {milestone.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-normal leading-snug">
                    {milestone.title}
                  </h3>

                  {milestone.company && (
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-0.5 mb-2.5">
                      {milestone.company}
                    </p>
                  )}

                  {shortSummary && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
                      {shortSummary}
                    </p>
                  )}

                  {milestone.bullets && milestone.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                      {milestone.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-neutral-400 dark:text-neutral-500 select-none shrink-0">–</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {techList.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200/50 dark:border-neutral-800/50">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        <span className="font-medium text-foreground uppercase tracking-wider text-[11px] mr-1.5 font-mono">
                          Technologies :
                        </span>
                        <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300">
                          {techList.join("  •  ")}
                        </span>
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { ScrollTimeline };
