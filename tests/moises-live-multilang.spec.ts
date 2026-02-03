import { test, expect } from '@chromatic-com/playwright';

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';

const rawLocales = [
    "ar_SA", "ca", "cs", "da", "de", "el", "en", "es", "fi", "fr",
    "he", "hi_IN", "hr", "hu", "id", "it", "ja", "ko", "ms", "nl",
    "no", "pl", "pt_BR", "ro", "ru", "sk", "sv", "th", "tr", "uk",
    "vi", "zh_CN", "zh_TW"
];

for (const rawLocale of rawLocales) {
  const locale = rawLocale.replace('_', '-');

  test.describe(`Moises Live - ${locale}`, () => {
    test.use({ locale: locale });

    test('Validate layout and translations', async ({ page }) => {
      
      // 1. Access
      await page.goto(URL_DO_APP);
      await page.waitForLoadState('networkidle');

      // --- "PICHAÇÃO" ---
      // Isso vai pintar o site de vermelho só para o Chromatic gritar erro
      await page.evaluate(() => document.body.style.backgroundColor = 'red'); 

      // 2. WELCOME SCREEN
      // Adicionei "-DEMO" no nome. Isso é uma mudança radical para o robô.
      await expect(page).toHaveScreenshot(`01-welcome-demo-${locale}.png`);
      await page.getByRole('button').first().click();

      // 3. MAIN SCREEN (TOGGLE OFF)
      await expect(page.getByRole('switch')).toBeVisible();
      await page.waitForTimeout(500); 
      await expect(page).toHaveScreenshot(`02-main-${locale}.png`);
      
      // Click on toggle
      await page.getByRole('switch').click();

      // 3b. LOADING SCREEN
      await expect(page).toHaveScreenshot(`02b-loading-${locale}.png`);

      // 4. MUSIC TAB 
      await expect(page.getByRole('slider').first()).toBeVisible({ timeout: 20000 });
     
      await page.waitForTimeout(1000); 
      
      await expect(page).toHaveScreenshot(`03-music-${locale}.png`);
    });

  });
}