/** Freeze a scene with its computed styling so downloads don't depend on the app's CSS. */
export function serializeScene(source: SVGSVGElement): { svg: string; width: number; height: number } {
  const copy = source.cloneNode(true) as SVGSVGElement;
  const originals = [source, ...source.querySelectorAll('*')];
  const copies = [copy, ...copy.querySelectorAll('*')];
  originals.forEach((node, i) => {
    const css = getComputedStyle(node);
    const target = copies[i] as SVGElement;
    for (const property of ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'visibility', 'display', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline', 'paint-order', 'letter-spacing', 'transform', 'transform-origin']) {
      // Computed styles may expand fragment references to absolute page URLs.
      const value = css.getPropertyValue(property).replace(/url\(["']?[^)"']*#([^\s)"']+)["']?\)/g, 'url(#$1)');
      target.style.setProperty(property, value);
    }
    target.style.setProperty('animation', 'none');
    target.style.setProperty('transition', 'none');
    target.removeAttribute('tabindex');
    target.removeAttribute('role');
  });
  copy.querySelectorAll('script, foreignObject, animate, animateTransform, set').forEach(el => el.remove());
  const box = source.viewBox.baseVal;
  const width = box.width || source.clientWidth;
  const height = box.height || source.clientHeight;
  if (!width || !height) throw new Error('Empty scene');
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copy.setAttribute('width', String(width));
  copy.setAttribute('height', String(height));
  copy.style.background = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#fbfaf6';
  // CSS background isn't painted by every SVG rasterizer.
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('x', String(box.x)); background.setAttribute('y', String(box.y));
  background.setAttribute('width', String(width)); background.setAttribute('height', String(height));
  background.setAttribute('fill', copy.style.background);
  copy.prepend(background);
  return { svg: new XMLSerializer().serializeToString(copy), width, height };
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function exportScene(source: SVGSVGElement, format: 'svg' | 'png', name: string) {
  await document.fonts.ready;
  const { svg, width, height } = serializeScene(source);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  if (format === 'svg') { download(blob, `${name}.svg`); return; }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error('SVG image failed')); img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * 2); canvas.height = Math.round(height * 2);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG encoding failed')), 'image/png'));
    download(png, `${name}.png`);
  } finally { URL.revokeObjectURL(url); }
}
