import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock.js';

/**
 * Generic overlay used by both the video lightbox and the Rive player.
 *
 * Handles Escape, backdrop click, scroll lock, and returning focus to
 * whatever was focused before it opened.
 */
export default function Modal({ open, onClose, label, children }) {
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement;
    // Move focus into the dialog so Escape and Tab behave.
    panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      // Only restore if the element is still in the document.
      const prev = restoreFocusRef.current;
      if (prev && document.contains(prev)) prev.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-ink/92 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className="relative z-10 flex max-h-[100svh] w-full items-center justify-center p-4 outline-none md:p-8"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-ink-line bg-ink-soft/80 text-bone backdrop-blur transition-colors hover:border-accent hover:text-accent md:right-8 md:top-8"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
