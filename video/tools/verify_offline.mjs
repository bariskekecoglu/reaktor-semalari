// Üretim önizlemesinde çevrimdışı kullanım doğrulaması (video iddiası için).
import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
const p = await ctx.newPage();
await p.goto('http://localhost:4173/');
const ready = await p.getByText('Çevrimdışı kullanıma hazır').first().waitFor({ timeout: 20000 }).then(() => true, () => false);
console.log('hazir_yazisi:', ready, '| pwa-controls:', await p.locator('.pwa-controls').innerText().catch(() => '-'));
await ctx.setOffline(true);
await p.reload(); await p.waitForTimeout(1500);
console.log('offline_reload_title:', await p.title(), '| scene_svg:', await p.locator('.scene-svg').count());
await p.locator('.reactor-seg button', { hasText: 'PWR' }).click();
await p.locator('button', { hasText: 'İşletme ve davranış' }).first().click(); await p.waitForTimeout(1500);
console.log('offline_ops_module_buttons:', await p.locator('button', { hasText: 'Yük takibi ve ksenon' }).count());
await p.locator('.reactor-seg button', { hasText: 'RBMK' }).click();
await p.locator('button', { hasText: 'Çernobil 1986' }).first().click(); await p.waitForTimeout(1500);
console.log('offline_chernobyl_heading:', await p.getByRole('heading', { name: /Çernobil 1986/ }).count());
await p.screenshot({ path: 'C:/vidwork/explore/offline-chernobyl.jpg', quality: 60 });
await b.close();
