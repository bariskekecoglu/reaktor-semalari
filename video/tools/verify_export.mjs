import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
await p.goto('http://localhost:4173/'); await p.waitForTimeout(1000);
for (const t of ['SVG indir', 'PNG indir']) {
  const [d] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.locator('button', { hasText: t }).first().click()]);
  const path = `C:/vidwork/explore/${d.suggestedFilename()}`; await d.saveAs(path);
  console.log(t, '->', d.suggestedFilename());
}
await b.close();
