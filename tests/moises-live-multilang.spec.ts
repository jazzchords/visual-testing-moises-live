import { test, expect, takeSnapshot } from "@chromatic-com/playwright";

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';

const rawLocales = [
    "ar_SA", "de", "el", "en", "ru"
];

for (const rawLocale of rawLocales) {
  const locale = rawLocale.replace('_', '-');

  test.describe(`Moises Live - ${locale}`, () => {
    test.use({ locale: locale });

    test('Validar layout e traduções', async ({ page }, testInfo) => {
      
      await page.goto(URL_DO_APP);
      await page.waitForLoadState('networkidle');

    // Welcome screen
      await takeSnapshot(page, `01-Welcome`, testInfo);
      // Click on continue button
      await page.getByRole('button').first().click();

      await expect(page.getByRole('switch')).toBeVisible();
      await page.waitForTimeout(500); 
    
      // Main screen
      await takeSnapshot(page, `02-Main`, testInfo);

      await page.getByRole('switch').click();

      // Loading
      await takeSnapshot(page, `03-Loading`, testInfo);

      // Music Tab
      await expect(page.getByRole('slider').first()).toBeVisible({ timeout: 20000 });
      await page.waitForTimeout(1000); 
      
      await takeSnapshot(page, `04-Music`, testInfo);
            
      // Speech tab

      await page.getByRole('button').nth(1).click();
      
      await expect(page.getByRole('slider')).toHaveCount(2, { timeout: 20000 });
      await page.waitForTimeout(1000); // Estabiliza
      
      await takeSnapshot(page, `05-Speech`, testInfo);
    });
  });
}