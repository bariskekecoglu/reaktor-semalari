import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { SimClock, TickHandler } from '../simulation/clock';
import type { EducationalModel, ModelSnapshot } from '../simulation/educationalModel';

export interface SimulationContextValue {
  clock: SimClock;
  model: EducationalModel;
  reducedMotion: boolean;
}

export const SimulationContext = createContext<SimulationContextValue | null>(null);

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('SimulationContext eksik');
  return ctx;
}

/**
 * Ortak saate abone olur. Geri çağırma her karede çağrılır ama React yeniden render
 * edilmez; çizim güncellemeleri ref'ler üzerinden yapılmalıdır.
 * Bileşen kaldırıldığında abonelik otomatik silinir.
 */
export function useTick(handler: TickHandler, priority = 10): void {
  const { clock } = useSimulation();
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const unsub = clock.subscribe((dt, t) => ref.current(dt, t), priority);
    // Bağlanır bağlanmaz bir kez çiz (duraklatılmışken de doğru görünsün).
    ref.current(0, clock.simTime);
    return unsub;
  }, [clock, priority]);
}

/** Model durumunu sınırlı sıklıkta React durumuna yansıtır (metin göstergeleri için). */
export function useModelSnapshot(hz = 6): ModelSnapshot {
  const { model } = useSimulation();
  const [snap, setSnap] = useState<ModelSnapshot>(model.state);
  const acc = useRef(0);
  useTick((dt) => {
    acc.current += dt;
    if (dt === 0 || acc.current >= 1 / hz) {
      acc.current = 0;
      setSnap((prev) => (prev === model.state ? prev : model.state));
    }
  });
  return snap;
}

/** Oynatma durumunu (oynuyor/hız) React'e bağlar. */
export function usePlayback() {
  const { clock } = useSimulation();
  const subscribe = (fn: () => void) => clock.onStateChange(fn);
  const playing = useSyncExternalStore(subscribe, () => clock.playing);
  const speed = useSyncExternalStore(subscribe, () => clock.speed);
  return { playing, speed };
}

export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}
