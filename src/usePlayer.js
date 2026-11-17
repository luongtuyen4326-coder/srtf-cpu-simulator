import { useEffect, useState } from 'react';

/** Phát lại mảng snapshot: step = số đơn vị thời gian đã "trôi qua". */
export function usePlayer(total, speedMs = 600) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= total) { setPlaying(false); return; }
    const id = setTimeout(() => setStep((s) => s + 1), speedMs);
    return () => clearTimeout(id);
  }, [playing, step, total, speedMs]);

  return {
    step, playing,
    play: () => { if (step >= total) setStep(0); setPlaying(true); },
    pause: () => setPlaying(false),
    next: () => setStep((s) => Math.min(total, s + 1)),
    prev: () => setStep((s) => Math.max(0, s - 1)),
    reset: () => { setPlaying(false); setStep(0); },
    seek: (n) => setStep(Math.max(0, Math.min(total, n))),
  };
}
