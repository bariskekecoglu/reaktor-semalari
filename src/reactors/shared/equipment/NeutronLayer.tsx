import { useRef } from 'react';
import { useSimulation, useTick } from '../../../hooks/useSimulation';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Neutron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

interface Flash {
  x: number;
  y: number;
  age: number;
  kind: 'fission' | 'absorb';
}

const POOL = 22;
const FLASHES = 8;
/** Görsel hız (viewBox birimi / simülasyon saniyesi). Gerçek nötron hızıyla ilişkisi yoktur. */
const NEUTRON_SPEED = 70;

const inside = (b: Box, x: number, y: number) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

interface Props {
  bounds: Box;
  fuel: Box[];
  /** O anki soğurucu (kontrol çubuğu) dikdörtgenleri; sokulma oranına göre hesaplanır. */
  absorbers: (insertion: number) => Box[];
  showFlow: boolean;
}

/**
 * Temsili nötronlar: yakıtta fisyon (iki yeni nötron), kontrol çubuğunda soğurulma, sınırdan kaçış.
 * Nüfus göreli güçle ölçeklenir. Hız ve ölçek gerçeği temsil etmez.
 */
export function NeutronLayer({ bounds, fuel, absorbers, showFlow }: Props) {
  const { model } = useSimulation();
  const nRef = useRef<SVGGElement>(null);
  const fRef = useRef<SVGGElement>(null);
  const neutrons = useRef<Neutron[]>(Array.from({ length: POOL }, () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false })));
  const flashes = useRef<Flash[]>([]);

  const spawn = (n: Neutron, x?: number, y?: number) => {
    const f = fuel[Math.floor(Math.random() * fuel.length)];
    n.x = x ?? f.x + Math.random() * f.w;
    n.y = y ?? f.y + Math.random() * f.h;
    const a = Math.random() * Math.PI * 2;
    n.vx = Math.cos(a) * NEUTRON_SPEED;
    n.vy = Math.sin(a) * NEUTRON_SPEED;
    n.active = true;
  };

  const addFlash = (x: number, y: number, kind: Flash['kind']) => {
    flashes.current.push({ x, y, age: 0, kind });
    if (flashes.current.length > FLASHES) flashes.current.shift();
  };

  useTick((dt) => {
    const st = model.state;
    const abs = absorbers(st.rodInsertion);
    const list = neutrons.current;
    const target = Math.round(5 + 14 * st.thermal);
    let active = list.filter((n) => n.active).length;
    if (dt > 0) {
      for (const n of list) {
        if (!n.active) continue;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (!inside(bounds, n.x, n.y)) {
          n.active = false;
          active--;
          continue;
        }
        if (abs.some((b) => inside(b, n.x, n.y))) {
          n.active = false;
          active--;
          addFlash(n.x, n.y, 'absorb');
          continue;
        }
        if (fuel.some((b) => inside(b, n.x, n.y)) && Math.random() < dt * 0.9) {
          // Fisyon: nötron tüketilir, iki yeni nötron doğar (havuz sınırlı).
          addFlash(n.x, n.y, 'fission');
          spawn(n, n.x, n.y);
          const free = list.find((m) => !m.active);
          if (free && active < target + 3) {
            spawn(free, n.x, n.y);
            active++;
          }
        }
      }
      for (const n of list) {
        if (active >= target) break;
        if (!n.active && Math.random() < dt * 3) {
          spawn(n);
          active++;
        }
      }
      for (const f of flashes.current) f.age += dt;
      flashes.current = flashes.current.filter((f) => f.age < 0.6);
    }
    const g = nRef.current;
    if (g) {
      for (let i = 0; i < list.length; i++) {
        const c = g.children[i] as SVGCircleElement;
        const n = list[i];
        c.setAttribute('visibility', n.active ? 'visible' : 'hidden');
        if (n.active) {
          c.setAttribute('cx', n.x.toFixed(1));
          c.setAttribute('cy', n.y.toFixed(1));
        }
      }
    }
    const fg = fRef.current;
    if (fg) {
      for (let i = 0; i < FLASHES; i++) {
        const el = fg.children[i] as SVGCircleElement;
        const f = flashes.current[i];
        if (!f) {
          el.setAttribute('visibility', 'hidden');
          continue;
        }
        el.setAttribute('visibility', 'visible');
        el.setAttribute('cx', f.x.toFixed(1));
        el.setAttribute('cy', f.y.toFixed(1));
        el.setAttribute('r', (3 + f.age * 18).toFixed(1));
        el.setAttribute('opacity', (1 - f.age / 0.6).toFixed(2));
        el.setAttribute('class', f.kind === 'fission' ? 'flash-fission' : 'flash-absorb');
      }
    }
  });

  return (
    <g style={{ display: showFlow ? undefined : 'none' }}>
      <g ref={fRef}>
        {Array.from({ length: FLASHES }, (_, i) => (
          <circle key={i} r={4} visibility="hidden" />
        ))}
      </g>
      <g ref={nRef}>
        {Array.from({ length: POOL }, (_, i) => (
          <circle key={i} r={3.2} className="neutron" visibility="hidden" />
        ))}
      </g>
    </g>
  );
}

export function CoreLegend({ x, y, extra }: { x: number; y: number; extra?: string }) {
  return (
    <g className="core-legend" aria-hidden="true">
      <circle cx={x} cy={y} r={4} className="neutron" />
      <text x={x + 10} y={y + 4}>nötron (temsili)</text>
      <circle cx={x + 140} cy={y} r={6} className="flash-fission legend" />
      <text x={x + 152} y={y + 4}>fisyon</text>
      <circle cx={x + 220} cy={y} r={6} className="flash-absorb legend" />
      <text x={x + 232} y={y + 4}>soğurulma</text>
      <rect x={x + 330} y={y - 6} width={6} height={12} className="control-rod" />
      <text x={x + 342} y={y + 4}>kontrol çubuğu (soğurucu)</text>
      {extra && (
        <text x={x} y={y + 24}>
          {extra}
        </text>
      )}
    </g>
  );
}
