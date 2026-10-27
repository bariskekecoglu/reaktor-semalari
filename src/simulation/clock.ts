/**
 * Ortak simülasyon saati.
 * Uygulamada tek bir requestAnimationFrame döngüsü vardır; sahneler, grafikler ve
 * çekirdek animasyonları bu saate abone olur, kendi döngülerini başlatmaz.
 */
export type TickHandler = (dt: number, simTime: number) => void;

interface Subscriber {
  cb: TickHandler;
  priority: number;
}

/** Sekme arka plandayken veya takılmalarda tek karede atlanabilecek en uzun gerçek süre (s). */
export const MAX_FRAME_DT = 0.1;
export const SPEEDS = [0.5, 1, 2] as const;
export type Speed = (typeof SPEEDS)[number];

export class SimClock {
  simTime = 0;
  playing = true;
  speed: Speed = 1;
  private subs: Subscriber[] = [];
  private rafId: number | null = null;
  private lastTs: number | null = null;
  private stateListeners = new Set<() => void>();

  /** Abone ol; daha düşük öncelik önce çalışır (model = 0, çizimler = 10). */
  subscribe(cb: TickHandler, priority = 10): () => void {
    const sub = { cb, priority };
    this.subs.push(sub);
    this.subs.sort((a, b) => a.priority - b.priority);
    return () => {
      this.subs = this.subs.filter((s) => s !== sub);
    };
  }

  get subscriberCount(): number {
    return this.subs.length;
  }

  get isRunning(): boolean {
    return this.rafId !== null;
  }

  /** Oynatma/hız/sıfırlama değişimlerini dinle (React arayüzü için). */
  onStateChange(fn: () => void): () => void {
    this.stateListeners.add(fn);
    return () => this.stateListeners.delete(fn);
  }

  private emitState() {
    this.stateListeners.forEach((fn) => fn());
  }

  /** Gerçek zamanda geçen süreyi simülasyona uygular. Testlerde doğrudan çağrılabilir. */
  advance(realDt: number): void {
    if (!this.playing) return;
    const dt = Math.min(Math.max(realDt, 0), MAX_FRAME_DT) * this.speed;
    if (dt === 0) return;
    this.simTime += dt;
    this.notify(dt);
  }

  /** Aboneleri sıfır adımla çağırır (duraklatılmışken yeniden çizim için). */
  redraw(): void {
    this.notify(0);
  }

  private notify(dt: number) {
    // Abonelik listesi döngü sırasında değişebilir; kopya üzerinde dolaş.
    const list = this.subs.slice();
    for (const s of list) s.cb(dt, this.simTime);
  }

  private frame = (ts: number) => {
    const dt = this.lastTs === null ? 0 : (ts - this.lastTs) / 1000;
    this.lastTs = ts;
    this.advance(dt);
    this.rafId = requestAnimationFrame(this.frame);
  };

  start(): void {
    if (this.rafId !== null) return;
    this.lastTs = null;
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.lastTs = null;
  }

  play(): void {
    if (this.playing) return;
    this.playing = true;
    // Duraklatma süresi simülasyona eklenmesin: bir sonraki kare dt = 0 ile başlar.
    this.lastTs = null;
    this.emitState();
  }

  pause(): void {
    if (!this.playing) return;
    this.playing = false;
    this.emitState();
  }

  setSpeed(speed: Speed): void {
    this.speed = speed;
    this.emitState();
  }

  reset(): void {
    this.simTime = 0;
    this.lastTs = null;
    this.emitState();
    this.redraw();
  }
}
