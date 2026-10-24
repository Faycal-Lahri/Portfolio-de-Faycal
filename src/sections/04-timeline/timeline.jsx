'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { timelineData } from './timeline.data';

export function Timeline() {
  const containerRef = useRef(null);

  // Hide the global page scrollbar when inside the timeline section (desktop)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollVisibility = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isInTimeline = rect.top <= 80 && rect.bottom >= windowHeight - 80;

      if (isInTimeline) {
        document.documentElement.classList.add('no-scrollbar');
        document.body.classList.add('no-scrollbar');
      } else {
        document.documentElement.classList.remove('no-scrollbar');
        document.body.classList.remove('no-scrollbar');
      }
    };

    window.addEventListener('scroll', checkScrollVisibility, { passive: true });
    checkScrollVisibility();

    return () => {
      window.removeEventListener('scroll', checkScrollVisibility);
      document.documentElement.classList.remove('no-scrollbar');
      document.body.classList.remove('no-scrollbar');
    };
  }, []);

  return (
    <div id="timeline" ref={containerRef} className="relative w-full bg-background text-foreground transition-colors duration-300">
      {/* 1. Mobile Format (< md): Clean, Native Vertical Flow (Zero clipping, zero next-section overlap) */}
      <MobileTimeline milestones={timelineData.milestones} />

      {/* 2. Desktop Format (>= md): Pinned Horizontal Storyline with Single Continuous SVG Path */}
      <DesktopTimeline containerRef={containerRef} milestones={timelineData.milestones} />
    </div>
  );
}

// -------------------------------------------------------------
// MOBILE TIMELINE: Perfectly adapted to phone screens (320px - 767px)
// -------------------------------------------------------------
function MobileTimeline({ milestones }) {
  const mobileRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mobileRef,
    offset: ['start center', 'end center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
  });

  return (
    <section className="md:hidden w-full px-6 py-14 bg-background text-foreground select-none">
      {/* Mobile Header: Matching "Profil." Typographic Style Exactly */}
      <div className="mb-12">
        <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter leading-none font-sans">
          Timeline.
        </h2>
        <p className="text-sm font-sans text-muted-foreground mt-2 font-normal">
          Parcours académique & professionnel
        </p>
        <div className="flex items-center space-x-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
          <span className="text-xs font-mono text-zinc-500 font-medium">
            {timelineData.dateRange}
          </span>
        </div>
      </div>

      {/* Vertical Animated Line Track */}
      <div ref={mobileRef} className="relative pl-6 space-y-10">
        {/* Background Rail */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border/40" />

        {/* Animated Drawing Orange Vertical Line */}
        <motion.div
          style={{ scaleY: smoothProgress, transformOrigin: 'top' }}
          className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#ff5500]"
        />

        {/* The Milestones */}
        {milestones.map((item, idx) => (
          <div key={item.period + idx} className="relative flex items-start group">
            {/* Dot directly centered on the vertical line */}
            <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#ff5500] border-2 border-background z-10" />

            {/* Content */}
            <div className="w-full text-left">
              {item.isFinalPfe ? (
                /* Final Milestone: Exactly '2027 : Et si on parlait PFE ? 😉' */
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight font-sans">
                  2027 : Et si on parlait PFE ? 😉
                </h3>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans leading-tight">
                      {item.period}
                    </h3>
                    <p className="text-sm font-semibold text-foreground/90 mt-0.5 leading-snug">
                      {item.heading}
                      {item.institution && (
                        <span className="text-muted-foreground font-normal"> — {item.institution}</span>
                      )}
                    </p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-normal">
                        {item.detail}
                      </p>
                    )}
                  </div>

                  {item.logo && (
                    <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 dark:border-neutral-300 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-0.5">
                      <img
                        src={item.logo}
                        alt={item.institution || item.heading}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// DESKTOP TIMELINE: Pinned Horizontal Storyline (>= 768px)
// -------------------------------------------------------------
function DesktopTimeline({ containerRef, milestones }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.0005,
  });

  const START_X = 260; // Start of line directly aligned with Timeline.
  const GAP = 350;     // Gap between milestones
  const TRACK_H = 520; // Fixed stage height
  const Y_BASE = TRACK_H / 2; // Exact vertical center: 260px
  const STEM_H = 115;  // 115px vertical stem height
  const Y_TOP = Y_BASE - STEM_H;     // 145px
  const Y_BOTTOM = Y_BASE + STEM_H;  // 375px

  // Single continuous unbroken SVG path that turns and returns
  let pathD = `M ${START_X} ${Y_BASE}`;
  milestones.forEach((m, idx) => {
    const x = START_X + (idx + 1) * GAP;
    const isTop = m.position === 'top';
    const targetY = isTop ? Y_TOP : Y_BOTTOM;

    if (m.isFinalPfe) {
      pathD += ` L ${x} ${Y_BASE} L ${x} ${targetY}`;
    } else {
      pathD += ` L ${x} ${Y_BASE} L ${x} ${targetY} L ${x} ${Y_BASE}`;
    }
  });

  const LAST_MILESTONE_X = START_X + milestones.length * GAP; // 260 + 10 * 350 = 3760px
  const TOTAL_LENGTH = 9 * (GAP + 2 * STEM_H) + GAP + STEM_H; // ~5725px
  const STAGE_WIDTH = LAST_MILESTONE_X + 800; // ~4560px (ample right buffer)

  // Stage horizontal translation: ensures final milestone sits comfortably on screen on desktop & iPad without cutoff
  const stageX = useTransform(smoothProgress, [0.06, 0.96], ['0px', '-3720px']);

  // The single stroke pathLength: 0 to 1
  const pathLength = useTransform(smoothProgress, [0.03, 0.96], [0, 1]);

  return (
    <div className="hidden md:block relative w-full h-[520vh]">
      <section
        aria-label="Chronologie du parcours"
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center select-none bg-background"
      >
        <div className="relative w-full h-full flex items-center overflow-visible">
          <motion.div
            style={{ x: stageX }}
            className="flex items-center absolute left-0 top-0 h-full will-change-transform pl-10 sm:pl-16 lg:pl-24"
          >
            {/* 1. Left Title Block ("Timeline.") - Exact same style as Profil. */}
            <div className="flex flex-col justify-center shrink-0 pr-10 lg:pr-16 z-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-none font-sans">
                Timeline.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans mt-2.5 leading-snug">
                Parcours académique & professionnel
              </p>
            </div>

            {/* 2. Interactive SVG Track with Single Continuous Stroke */}
            <div
              className="relative shrink-0 flex items-center"
              style={{ width: `${STAGE_WIDTH}px`, height: `${TRACK_H}px` }}
            >
              {/* SVG Canvas for the Single Unbroken Path + Centered Dots */}
              <svg
                className="absolute left-0 top-0 w-full h-full pointer-events-none z-20"
                style={{ overflow: 'visible' }}
              >
                {/* Single Start Dot (Origin) at exact vertical center (Y_BASE = 260) */}
                <circle cx={START_X} cy={Y_BASE} r="4.5" fill="#ff5500" />

                {/* THE SINGLE CONTINUOUS STROKE */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#ff5500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength }}
                />

                {/* Milestone Dots: Centered on the stroke */}
                {milestones.map((item, idx) => {
                  const x = START_X + (idx + 1) * GAP;
                  const isTop = item.position === 'top';
                  const targetY = isTop ? Y_TOP : Y_BOTTOM;

                  const distToDot = idx * (GAP + 2 * STEM_H) + GAP + STEM_H;
                  const fraction = distToDot / TOTAL_LENGTH;
                  const triggerPoint = 0.03 + fraction * (0.96 - 0.03);

                  return (
                    <MilestoneDot
                      key={item.period + idx}
                      x={x}
                      y={targetY}
                      triggerPoint={triggerPoint}
                      smoothProgress={smoothProgress}
                    />
                  );
                })}
              </svg>

              {/* Date Range: Positioned directly underneath the Start Dot (Centered at START_X) */}
              <span
                className="absolute text-sm font-sans text-zinc-500 whitespace-nowrap z-10"
                style={{
                  left: `${START_X}px`,
                  top: `${Y_BASE + 26}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                {timelineData.dateRange}
              </span>

              {/* Milestone HTML Text Blocks: Generous clearance from both horizontal & vertical lines */}
              {milestones.map((item, idx) => {
                const x = START_X + (idx + 1) * GAP;
                const isTop = item.position === 'top';
                const targetY = isTop ? Y_TOP : Y_BOTTOM;

                const distToDot = idx * (GAP + 2 * STEM_H) + GAP + STEM_H;
                const fraction = distToDot / TOTAL_LENGTH;
                const triggerPoint = 0.03 + fraction * (0.96 - 0.03);

                return (
                  <MilestoneText
                    key={item.period + idx}
                    item={item}
                    x={x}
                    y={targetY}
                    triggerPoint={triggerPoint}
                    smoothProgress={smoothProgress}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Subcomponents for Desktop
function MilestoneDot({ x, y, triggerPoint, smoothProgress }) {
  const scale = useTransform(
    smoothProgress,
    [triggerPoint - 0.005, triggerPoint + 0.015],
    [0, 1]
  );

  return (
    <motion.circle
      cx={x}
      cy={y}
      r="4.5"
      fill="#ff5500"
      style={{ scale, transformOrigin: `${x}px ${y}px` }}
    />
  );
}

function MilestoneText({ item, x, y, triggerPoint, smoothProgress }) {
  const opacity = useTransform(
    smoothProgress,
    [triggerPoint, triggerPoint + 0.018],
    [0, 1]
  );

  const textOffset = useTransform(
    smoothProgress,
    [triggerPoint, triggerPoint + 0.018],
    [-8, 0]
  );

  return (
    <motion.div
      style={{
        left: `${x + 34}px`, // Generous 34px space to the right of the vertical line
        top: `${y}px`,        // Aligned with the dot (115px away from horizontal line!)
        transform: 'translateY(-50%)',
        opacity,
        x: textOffset,
      }}
      className={`absolute z-20 pointer-events-auto ${
        item.isFinalPfe ? 'w-auto whitespace-nowrap' : 'w-[290px] sm:w-[350px]'
      } text-left`}
    >
      {item.isFinalPfe ? (
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground whitespace-nowrap font-sans">
          2027 : Et si on parlait PFE ? 😉
        </h3>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight font-sans">
              {item.period}
            </h3>
            <p className="text-sm sm:text-[15px] font-semibold text-foreground/95 mt-1 leading-snug">
              {item.heading}
              {item.institution && (
                <span className="text-muted-foreground font-normal"> — {item.institution}</span>
              )}
            </p>
            {item.detail && (
              <p className="text-xs sm:text-[13px] text-zinc-400 font-sans leading-relaxed mt-1 font-normal">
                {item.detail}
              </p>
            )}
          </div>

          {item.logo && (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-neutral-200 dark:border-neutral-300 p-1.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-0.5">
              <img
                src={item.logo}
                alt={item.institution || item.heading}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
