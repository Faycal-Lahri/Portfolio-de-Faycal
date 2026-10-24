'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { projetsData } from './projets.data';

const isVideoUrl = (url) => {
  if (typeof url !== 'string') return false;
  return /\.(mp4|webm|mov|mkv|ogg)$/i.test(url);
};

function ProjectDocumentation({ project }) {
  if (!project) return null;

  return (
    <div className="flex flex-col gap-5 text-left font-sans">
      {/* Header: Titre du Projet */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight leading-snug">
          {project.title}
        </h3>
      </div>

      <div className="h-px w-full bg-neutral-200/80 dark:bg-white/10" />

      {/* Contexte & Enjeux */}
      {project.problem && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Contexte &amp; Enjeux
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
            {project.problem}
          </p>
        </div>
      )}

      {/* Approche & Réalisation */}
      {project.solution && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Approche technique
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
            {project.solution}
          </p>
        </div>
      )}

      {/* Réalisations clés */}
      {project.features && project.features.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Réalisations clés
          </h4>
          <ul className="space-y-2">
            {project.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <span className="text-neutral-400 dark:text-neutral-500 select-none font-mono text-xs mt-0.5 shrink-0">—</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies */}
      {project.stack && project.stack.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Environnement technique
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.stack.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-200 font-medium border border-neutral-200/80 dark:border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Impact & Synthèse */}
      {project.value && (
        <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-3.5 py-1 mt-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
            Impact &amp; valeur ajoutée
          </span>
          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
            « {project.value} »
          </p>
        </div>
      )}
    </div>
  );
}

export function ProjetsAcademiques() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [step, setStep] = useState(300);

  const containerRef = useRef(null);
  const rawProjects = projetsData.projets;
  const totalProjects = rawProjects.length;

  // Responsive step calculation for 3D carousel spacing
  useEffect(() => {
    const updateStep = () => {
      const w = window.innerWidth;
      if (w < 640) setStep(150);
      else if (w < 768) setStep(210);
      else if (w < 1024) setStep(260);
      else setStep(300);
    };
    updateStep();
    window.addEventListener('resize', updateStep);
    return () => window.removeEventListener('resize', updateStep);
  }, []);

  // Lock background scroll when showcase is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // Preload project images into browser memory for buttery-smooth instant transitions
  useEffect(() => {
    if (selectedProject?.images) {
      selectedProject.images.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [selectedProject]);

  // Pointer & Drag physics state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    lastX: 0,
    dragDistance: 0,
    pointerDownTime: 0,
  });

  // Navigate to next / previous
  const goTo = useCallback(
    (index) => {
      let next = index;
      if (next < 0) next = totalProjects - 1;
      if (next >= totalProjects) next = 0;
      setActiveIndex(next);
    },
    [totalProjects]
  );

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    const d = dragRef.current;
    d.isDragging = true;
    d.startX = clientX;
    d.lastX = clientX;
    d.dragDistance = 0;
    d.pointerDownTime = Date.now();
  };

  // Pointer Move
  const handlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d.isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = d.startX - clientX;
    d.dragDistance = Math.abs(diff);

    // If dragged enough, trigger slide switch
    if (d.dragDistance > 50) {
      if (diff > 0) {
        goTo(activeIndex + 1);
      } else {
        goTo(activeIndex - 1);
      }
      d.isDragging = false;
    }
  };

  // Pointer Up
  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  // Global mouse listeners
  useEffect(() => {
    window.addEventListener('mouseup', handlePointerUp);
    return () => window.removeEventListener('mouseup', handlePointerUp);
  }, []);

  // Card click handling: click active card to open showcase
  const handleCardClick = (project, idx, e) => {
    e.stopPropagation();
    // If not active card, bring to center first
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      return;
    }

    // If already active card, open showcase and reset to first media
    if (dragRef.current.dragDistance < 15) {
      setSelectedProject(project);
      setActiveImageIndex(0);
      setShowVideo(Boolean(project.video));
    }
  };

  // Keyboard navigation for showcase & carousel
  useEffect(() => {
    const onKeyDown = (e) => {
      if (selectedProject) {
        if (e.key === 'Escape') setSelectedProject(null);
        if (selectedProject.images && selectedProject.images.length > 1) {
          if (e.key === 'ArrowRight') {
            setActiveImageIndex((prev) => (prev + 1) % selectedProject.images.length);
          }
          if (e.key === 'ArrowLeft') {
            setActiveImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
          }
        }
      } else {
        if (e.key === 'ArrowRight') goTo(activeIndex + 1);
        if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject, activeIndex, goTo]);

  // Determine media states
  const hasVideo = Boolean(selectedProject?.video);
  const currentMediaUrl = selectedProject
    ? (hasVideo && showVideo)
      ? selectedProject.video
      : selectedProject.images?.[activeImageIndex] || selectedProject.coverImage
    : null;

  return (
    <section
      id="projets"
      aria-label="Projets réalisés"
      className="relative w-full bg-background text-foreground py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 select-none overflow-hidden no-scrollbar"
    >
      {/* Section Header */}
      <div className="w-full max-w-[1240px] mx-auto relative z-10 pt-10 sm:pt-14 mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-none font-sans">
            {projetsData.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2.5 font-normal font-sans">
            {projetsData.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Showcase Plinth Container:
          - In Dark Mode (mode sombre): BLANC (dark:bg-white dark:text-neutral-900 dark:border-neutral-200)
          - In Light Mode (mode clair): NOIR (bg-black text-white border-neutral-800)
      */}
      <div className="w-full max-w-[1240px] mx-auto rounded-[28px] sm:rounded-[36px] md:rounded-[44px] bg-black dark:bg-white text-white dark:text-neutral-900 border border-neutral-800 dark:border-neutral-200 py-8 sm:py-10 md:py-12 px-3 sm:px-6 md:px-10 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl transition-colors duration-300">
        
        {/* 3D Coverflow Stage */}
        <div
          ref={containerRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="relative w-full h-[220px] sm:h-[260px] md:h-[310px] lg:h-[340px] cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center touch-pan-y"
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-auto"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {rawProjects.map((project, idx) => {
              // Calculate distance offset from activeIndex
              let diff = idx - activeIndex;
              if (diff < -totalProjects / 2) diff += totalProjects;
              if (diff > totalProjects / 2) diff -= totalProjects;

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              // Strictly ONLY 3 images visible at all times (Center, Left, Right)
              if (Math.abs(diff) > 1) {
                return null;
              }

              // Mathematical 3D Coverflow positioning with rectangular landscape proportions
              let translateX = 0;
              let rotateY = 0;
              let translateZ = 0;
              let scale = 1;

              if (isCenter) {
                translateX = 0;
                rotateY = 0;
                translateZ = 0;
                scale = 1;
              } else if (isLeft) {
                translateX = -step;
                rotateY = 30;
                translateZ = -45;
                scale = 0.92;
              } else if (isRight) {
                translateX = step;
                rotateY = -30;
                translateZ = -45;
                scale = 0.92;
              }

              return (
                <motion.div
                  key={project.id}
                  onClick={(e) => handleCardClick(project, idx, e)}
                  initial={false}
                  animate={{
                    x: translateX,
                    rotateY,
                    z: translateZ,
                    scale,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                    mass: 0.7,
                  }}
                  className="absolute left-1/2 top-1/2 -ml-[130px] sm:-ml-[170px] md:-ml-[210px] lg:-ml-[240px] -mt-[78px] sm:-mt-[100px] md:-mt-[123px] lg:-mt-[140px] w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] h-[155px] sm:h-[200px] md:h-[245px] lg:h-[280px] rounded-lg sm:rounded-xl overflow-hidden bg-neutral-900 dark:bg-neutral-100 border border-white/10 dark:border-black/10 shadow-xl cursor-pointer will-change-transform group"
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: isCenter ? 30 : 20,
                  }}
                >
                  {/* Rectangular Landscape Project Screenshot Frame */}
                  <img
                    src={project.coverImage || project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
                    draggable={false}
                    loading="eager"
                  />

                  {/* Subtle edge definition border */}
                  <div className="pointer-events-none absolute inset-0 border border-white/10 dark:border-black/10 rounded-lg sm:rounded-xl" />
                </motion.div>
              );
            })}
            {/* PC Left Arrow Button */}
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              aria-label="Projet précédent"
              className="hidden md:flex absolute left-2 lg:left-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 lg:w-12 lg:h-12 rounded-full items-center justify-center bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 text-white dark:text-neutral-900 border border-white/20 dark:border-black/10 backdrop-blur-md shadow-xl transition-all duration-200 active:scale-90 cursor-pointer group select-none"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* PC Right Arrow Button */}
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              aria-label="Projet suivant"
              className="hidden md:flex absolute right-2 lg:right-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 lg:w-12 lg:h-12 rounded-full items-center justify-center bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 text-white dark:text-neutral-900 border border-white/20 dark:border-black/10 backdrop-blur-md shadow-xl transition-all duration-200 active:scale-90 cursor-pointer group select-none"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Active Project Title & Description (Contrasted with Plinth) */}
        <div className="mt-5 sm:mt-6 text-center px-4 max-w-2xl flex flex-col items-center">
          <h3 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-white dark:text-neutral-900 tracking-tight font-sans leading-snug">
            {rawProjects[activeIndex]?.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-600 mt-1 max-w-lg line-clamp-1 font-normal font-sans">
            {rawProjects[activeIndex]?.summary}
          </p>
        </div>

        {/* Pagination Dots (Contrasted with Plinth) */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 z-20">
          {rawProjects.map((_, dotIdx) => {
            const isActive = dotIdx === activeIndex;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Aller au projet ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-white dark:bg-black scale-125'
                    : 'w-2 h-2 bg-neutral-600 dark:bg-neutral-300 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Human-written Bottom Caption */}
      <div className="max-w-2xl mx-auto px-4 mt-8 sm:mt-10 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground font-normal font-sans leading-relaxed">
          {projetsData.caption}
        </p>
      </div>

      {/* Fullscreen Cinematic Project Showcase with Light & Dark Mode */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex flex-col p-3 sm:p-5 md:p-6 lg:p-8 bg-[#fbfbfd]/95 dark:bg-black/95 backdrop-blur-2xl overflow-y-auto select-none"
          >
            {/* Top Navigation Bar: Back Button */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="w-full max-w-7xl mx-auto flex items-center justify-start gap-4 z-20 pb-3 sm:pb-4 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Primary Back Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-neutral-900/5 hover:bg-neutral-900/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 text-neutral-900 dark:text-white font-medium text-xs sm:text-sm transition-all duration-200 border border-neutral-300/80 dark:border-white/20 backdrop-blur-md shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Revenir aux projets</span>
              </button>
            </motion.div>

            {/* Main Showcase Stage */}
            <div
              className="w-full max-w-7xl mx-auto my-auto flex-1 flex flex-col justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* =========================================================
                  OPTION 1: VIDEO PROJECT -> YOUTUBE STYLE
                  (Video player centered, no photo switcher, details below)
                  ========================================================= */}
              {hasVideo ? (
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 sm:gap-6 py-2">
                  {/* YouTube-like Pure Video Player */}
                  <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/15 bg-black shadow-2xl flex items-center justify-center">
                    <video
                      key={selectedProject.video}
                      src={selectedProject.video}
                      controls
                      autoPlay
                      playsInline
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* YouTube-like Info Below Video */}
                  <div className="px-1 text-left pb-8">
                    <ProjectDocumentation project={selectedProject} />
                  </div>
                </div>
              ) : (
                /* =========================================================
                   OPTION 2: PHOTO PROJECT
                   - PC & Tablet: 70% Left (Photos) / 30% Right (Details with independent scroll)
                   - Mobile (Telephone): Single column flow (Photos on top, Details below)
                   ========================================================= */
                <div className="w-full grid grid-cols-1 md:grid-cols-[68%_32%] lg:grid-cols-[70%_30%] gap-6 lg:gap-8 items-start my-auto">
                  
                  {/* GAUCHE (70% PC / Tablette) : LES PHOTOS */}
                  <div className="w-full flex flex-col items-center gap-3">
                    {/* Grande Photo : Toutes les images empilées pour un cross-fade instantané 60 FPS sans aucun rechargement */}
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-[62vh] lg:h-[66vh] rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/15 bg-neutral-100 dark:bg-neutral-950 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] flex items-center justify-center">
                      {selectedProject.images && selectedProject.images.length > 0 ? (
                        selectedProject.images.map((imgSrc, imgIdx) => {
                          const isCurrent = imgIdx === activeImageIndex;
                          return (
                            <img
                              key={imgSrc}
                              src={imgSrc}
                              alt={`${selectedProject.title} - vue ${imgIdx + 1}`}
                              className={`absolute inset-0 w-full h-full object-contain select-none transition-opacity duration-300 ease-out will-change-[opacity] ${
                                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                              }`}
                              draggable={false}
                              loading="eager"
                            />
                          );
                        })
                      ) : (
                        <img
                          src={currentMediaUrl}
                          alt={selectedProject.title}
                          className="w-full h-full object-contain select-none"
                          draggable={false}
                        />
                      )}
                    </div>

                    {/* Petites Photos Restantes (Miniatures Cliquables) */}
                    {selectedProject.images && selectedProject.images.length > 1 && (
                      <div className="w-full flex items-center justify-start sm:justify-center gap-2 sm:gap-3 py-1.5 px-1 overflow-x-auto no-scrollbar touch-pan-x">
                        {selectedProject.images.map((img, thumbIdx) => {
                          const isSelected = thumbIdx === activeImageIndex;
                          return (
                            <button
                              key={thumbIdx}
                              type="button"
                              onClick={() => setActiveImageIndex(thumbIdx)}
                              className={`relative w-16 h-11 sm:w-20 sm:h-13 md:w-24 md:h-15 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-200 active:scale-95 ${
                                isSelected
                                  ? 'ring-2 ring-neutral-900 dark:ring-white scale-105 opacity-100 shadow-md'
                                  : 'opacity-50 hover:opacity-85 border border-neutral-300 dark:border-neutral-700'
                              }`}
                              aria-label={`Afficher la photo ${thumbIdx + 1}`}
                            >
                              <img
                                src={img}
                                alt={`Miniature ${thumbIdx + 1}`}
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable={false}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* DROITE (30% PC / Tablette) : LES DÉTAILS
                      LE SCROLL EST RÉSERVÉ UNIQUEMENT À CETTE PARTIE DROITE */}
                  <div className="w-full text-left md:max-h-[74vh] md:overflow-y-auto md:pr-4 no-scrollbar pb-8">
                    <ProjectDocumentation project={selectedProject} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
