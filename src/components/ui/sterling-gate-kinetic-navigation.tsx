"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const portfolioNavItems = [
  { name: "Aperçu", href: "#hero", num: "01", tag: "Introduction" },
  { name: "Profil", href: "#profile", num: "02", tag: "À propos" },
  { name: "Parcours", href: "#timeline", num: "03", tag: "Évolution" },
  { name: "Expériences", href: "#experiences", num: "04", tag: "Pro & Stages" },
  { name: "Projets", href: "#projets", num: "05", tag: "Réalisations" },
  { name: "Formation", href: "#formation", num: "06", tag: "Diplômes" },
  { name: "Certifications", href: "#certifications", num: "07", tag: "Accréditations" },
  { name: "Engagements", href: "#activites", num: "08", tag: "Leadership" },
  { name: "Contact", href: "#contact", num: "09", tag: "Échangeons" },
];

export function FullScreenMobileNavigation({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 w-screen h-screen z-[100] bg-background/98 backdrop-blur-2xl text-foreground flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto"
        >
          {/* Header row: Identity + Theme Switcher + Close Button */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex items-center justify-between w-full border-b border-border/70 pb-5"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-foreground">
                FAYCAL LAHRI
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le menu"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Large Full-Screen Staggered Text Links */}
          <nav className="my-auto py-6 flex flex-col space-y-1 sm:space-y-2">
            {portfolioNavItems.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 35, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 15 }}
                transition={{
                  delay: 0.03 * idx + 0.08,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    const targetId = item.href.replace(/^#/, "");
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                      setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: "smooth" });
                      }, 120);
                    }
                    if (window.location.hash) {
                      history.replaceState(null, "", window.location.pathname);
                    }
                  }}
                  className="group flex items-baseline justify-between py-2 sm:py-2.5 border-b border-border/20 hover:border-border/80 transition-all"
                >
                  <div className="flex items-baseline gap-3 sm:gap-5">
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.num}
                    </span>
                    <span className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground group-hover:translate-x-2 transition-transform duration-200">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.tag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </a>
              </motion.div>
            ))}
          </nav>

          {/* Footer inside full-screen menu */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="w-full pt-5 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground"
          >
            <div>
              <span>Stage PFE 6 mois • </span>
              <span className="text-foreground font-medium">Mobilité totale en France (Fév – Mars 2027)</span>
            </div>
            <a
              href="mailto:faycallahri999@gmail.com"
              className="text-foreground font-mono hover:underline"
            >
              faycallahri999@gmail.com
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Keep export compatibility
export { FullScreenMobileNavigation as KineticMobileNavigation };
