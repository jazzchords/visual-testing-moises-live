import { test, expect, takeSnapshot } from '@chromatic-com/playwright';

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';

test('Validar Tela de Avaliação (Rating)', async ({ page }, testInfo) => {
  

  await page.addInitScript(() => {
      window.localStorage.setItem('moises:showReviewApp', 'true');
  });

  await page.goto(URL_DO_APP);
  await page.waitForLoadState('networkidle');

  
  await page.waitForTimeout(2000); 

  await takeSnapshot(page, '06-Rating-Modal', testInfo);
});