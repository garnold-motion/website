import { useEffect } from 'react';

/**
 * Locks page scroll while a modal is open.
 *
 * Uses a counter on the document so that nested or rapidly-swapped modals
 * can't unlock the page while another one is still open.
 */
let lockCount = 0;

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    document.body.classList.add('is-locked');

    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.classList.remove('is-locked');
      }
    };
  }, [active]);
}
