import { test, expect, takeSnapshot } from '@chromatic-com/playwright';

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';

test('Full UI flow (Guest)', async ({ page }, testInfo) => {
  
  await page.goto(URL_DO_APP);
  await page.waitForLoadState('networkidle');

  // --- WELCOME SCREEN ---
  await test.step('1. Welcome screen', async () => {
    await expect(page.getByText('Welcome to Moises Live')).toBeVisible();
    
    await takeSnapshot(page, '01-Guest-Welcome', testInfo);
  });

  await page.getByRole('button', { name: 'Continue' }).click();

  // --- 2. MAIN SCREEN (Toggle off) ---
  await test.step('2. Main screen', async () => {
    await expect(page.getByText('Turn on AI volume control')).toBeVisible({ timeout: 10000 });
    
    await expect(page.getByText('Connect your account')).toBeVisible({ timeout: 15000 });

    await takeSnapshot(page, '02-Guest-Main', testInfo);
  });
  
    // Turn on the Toggle
  await page.getByRole('switch', { name: 'Toggle Switch for AI Volume Control' }).click();

    // --- 3. MUSIC TAB (Validation of Guest) ---
  await test.step('3. Tab Music (Guest)', async () => {
    
    // Validates Guest banner
    await expect(page.getByText('Connect your account')).toBeVisible();

    const vocalsContainer = page.locator('div').filter({ hasText: 'Vocals' }).first();
    const botaoMute = vocalsContainer.getByRole('img', { name: /Stem Vocals/i });
    const slider = vocalsContainer.getByRole('slider').first();

    // Test of Mute Blocked
    await botaoMute.click();
    await takeSnapshot(page, '03-Guest-Mute-Blocked', testInfo);

    // Test of Slider Limit
    await slider.hover();
    const box = await slider.boundingBox();
    if (box) {
        await slider.click({ position: { x: box.width * 0.1, y: box.height / 2 } });
    }
    
    await takeSnapshot(page, '03-Guest-Slider-Limited', testInfo);
  });

   // --- 4. SPEECH TAB ---
   await test.step('4. Aba Speech', async () => {
    
    // Clicks on second tab (Speech) by position
    await page.getByRole('button').nth(1).click();
    
    await expect(page.getByText('Vocals')).toBeVisible({ timeout: 15000 });
    // Validates Other button with Regex
    await expect(page.getByRole('button', { name: /Other/i })).toBeVisible();
    
    await page.waitForTimeout(1000);
    
    await takeSnapshot(page, '04-Guest-Speech-Tab', testInfo);
  });
});