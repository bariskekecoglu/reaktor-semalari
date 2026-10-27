import { describe, expect, it, vi } from 'vitest';
import { MAX_FRAME_DT, SimClock } from './clock';

describe('SimClock', () => {
  it('oynarken zamanı ilerletir ve aboneleri çağırır', () => {
    const c = new SimClock();
    const cb = vi.fn();
    c.subscribe(cb);
    c.advance(0.05);
    expect(c.simTime).toBeCloseTo(0.05);
    expect(cb).toHaveBeenCalledWith(expect.closeTo(0.05), expect.closeTo(0.05));
  });

  it('duraklatınca zaman ve aboneler durur', () => {
    const c = new SimClock();
    const cb = vi.fn();
    c.subscribe(cb);
    c.pause();
    c.advance(0.05);
    expect(c.simTime).toBe(0);
    expect(cb).not.toHaveBeenCalled();
  });

  it('uzun kare boşluklarında zaman sıçramaz (MAX_FRAME_DT ile sınırlı)', () => {
    const c = new SimClock();
    c.advance(5);
    expect(c.simTime).toBeCloseTo(MAX_FRAME_DT);
  });

  it('hız çarpanını uygular', () => {
    const c = new SimClock();
    c.setSpeed(2);
    c.advance(0.05);
    expect(c.simTime).toBeCloseTo(0.1);
    c.setSpeed(0.5);
    c.advance(0.05);
    expect(c.simTime).toBeCloseTo(0.125);
  });

  it('sıfırlama zamanı 0 yapar ve aboneleri yeniden çizdirir', () => {
    const c = new SimClock();
    const cb = vi.fn();
    c.subscribe(cb);
    c.advance(0.08);
    cb.mockClear();
    c.reset();
    expect(c.simTime).toBe(0);
    expect(cb).toHaveBeenCalledWith(0, 0);
  });

  it('abonelik iptal edilince çağrılmaz; tekrarlı abone/iptal birikme yapmaz', () => {
    const c = new SimClock();
    for (let i = 0; i < 20; i++) {
      const unsubs = Array.from({ length: 30 }, () => c.subscribe(() => undefined));
      unsubs.forEach((u) => u());
    }
    expect(c.subscriberCount).toBe(0);
  });

  it('düşük öncelikli abone (model) çizimlerden önce çalışır', () => {
    const c = new SimClock();
    const order: string[] = [];
    c.subscribe(() => order.push('çizim'), 10);
    c.subscribe(() => order.push('model'), 0);
    c.advance(0.02);
    expect(order).toEqual(['model', 'çizim']);
  });

  it('rAF döngüsü: duraklatıp uzun süre sonra devam edince zaman sıçramaz; tek döngü çalışır', () => {
    let pending: FrameRequestCallback | null = null;
    let requests = 0;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      pending = cb;
      requests++;
      return requests;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {
      pending = null;
    });
    const frame = (ts: number) => {
      const cb = pending;
      pending = null;
      cb?.(ts);
    };
    const c = new SimClock();
    c.start();
    c.start(); // ikinci çağrı yeni döngü açmamalı
    expect(requests).toBe(1);
    frame(1000);
    frame(1050);
    expect(c.simTime).toBeCloseTo(0.05);
    c.pause();
    frame(1100);
    frame(9000);
    expect(c.simTime).toBeCloseTo(0.05);
    c.play();
    frame(20000); // devam sonrası ilk kare: dt = 0
    expect(c.simTime).toBeCloseTo(0.05);
    frame(20020);
    expect(c.simTime).toBeCloseTo(0.07);
    c.setSpeed(2);
    frame(20070);
    expect(c.simTime).toBeCloseTo(0.17);
    c.stop();
    expect(c.isRunning).toBe(false);
    vi.unstubAllGlobals();
  });

  it('durum dinleyicileri oynat/duraklat/hız değişiminde bilgilendirilir', () => {
    const c = new SimClock();
    const fn = vi.fn();
    c.onStateChange(fn);
    c.pause();
    c.play();
    c.setSpeed(2);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
