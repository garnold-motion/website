import { useEffect, useRef, useState } from 'react';
import * as rive from '@rive-app/canvas';

// Serve the WASM runtime from our own origin instead of Rive's default jsdelivr
// CDN. Removes a third-party request from the critical path and means the
// interactive pieces still work if the CDN is blocked or slow.
// The file is copied out of node_modules by scripts/copy-rive-wasm.mjs.
rive.RuntimeLoader.setWasmUrl('/rive.wasm');

/**
 * Mounts a .riv file onto a canvas that fills its parent.
 *
 * Two things this handles that the naive version doesn't:
 *
 *  1. Sizing via ResizeObserver rather than the window resize event. The canvas
 *     lives inside a modal that animates open, so its box changes size without
 *     the window ever resizing — a window listener alone leaves it blurry.
 *
 *  2. Load failure. A .riv that isn't on disk yet reports through onLoadError,
 *     and we surface that as a real message instead of a silent black box.
 */
export default function RiveCanvas({ src, artboard, stateMachine, onError }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let disposed = false;
    let observer;

    const instance = new rive.Rive({
      src,
      canvas,
      // Passing undefined lets Rive fall back to the file's default artboard
      // and state machine, which is what we want unless the data says otherwise.
      artboard: artboard || undefined,
      stateMachines: stateMachine || undefined,
      autoplay: true,
      autoBind: true,
      layout: new rive.Layout({
        fit: rive.Fit.Contain,
        alignment: rive.Alignment.Center,
      }),
      onLoad: () => {
        if (disposed) return;
        instance.resizeDrawingSurfaceToCanvas();
        setStatus('ready');

        observer = new ResizeObserver(() => {
          if (!disposed) instance.resizeDrawingSurfaceToCanvas();
        });
        observer.observe(wrap);
      },
      onLoadError: () => {
        if (disposed) return;
        setStatus('error');
        onError?.();
      },
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      instance.cleanup();
    };
  }, [src, artboard, stateMachine, onError]);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full touch-none" />

      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-eyebrow text-bone-dim/50">Loading</span>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
          <span className="text-eyebrow text-bone-dim/60">Coming soon</span>
          <p className="text-[0.78rem] leading-relaxed text-bone-dim/40">
            Drop the .riv file at
            <br />
            <code className="text-bone-dim/60">{src}</code>
          </p>
        </div>
      )}
    </div>
  );
}
