import { test, expect } from '@playwright/test';

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';

test('Full UI flow (4 states)', async ({ page }) => {
  

  await page.goto(URL_DO_APP);
  await page.waitForLoadState('networkidle');

  // --- WELCOME SCREEN ---
  await test.step('1. Welcome screen', async () => {

    await expect(page.getByText('Welcome to Moises Live')).toBeVisible();
    
    await expect(page).toHaveScreenshot('01-welcome-screen.png');
  });

  // Playwright finds a button with the text "Continue" (case insensitive)
  await page.getByRole('button', { name: 'Continue' }).click();

  // --- MAIN SCREEN (Toggle Off) ---
    await test.step('2. Main screen (Toggle off)', async () => {
        await expect(page.getByText('Turn on AI volume control')).toBeVisible({ timeout: 10000 });
        
        await expect(page).toHaveScreenshot('02-main-toggle-off.png');
      });
    
      await page.getByRole('switch', { name: 'Toggle Switch for AI Volume Control' }).click();
      
    
      // --- MUSIC TAB (Default) ---
      await test.step('3. Music tab (Default)', async () => {
      
        await page.waitForTimeout(1000); 

        await expect(page.getByText('Music')).toBeVisible();
        await expect(page.getByText('Vocals')).toBeVisible(); 
    
        await expect(page).toHaveScreenshot('03-music-tab.png');
      });

  await test.step('3. Music tab (Guest validation)', async () => {
    
    // 1. Validate that the app knows we are guests
    // The log shows the banner exists: "Connect your account" [1]
    await expect(page.getByText('Connect your account')).toBeVisible();

    // Define elements
    const vocalsContainer = page.locator('div').filter({ hasText: 'Vocals' }).first();
    const botaoMute = vocalsContainer.getByRole('img', { name: /Stem Vocals/i });
    const slider = vocalsContainer.getByRole('slider');

    // 2. Test Mute BLOCK
    // We try to click, but as guest, it should not mute.
    await botaoMute.click();
    
    // The screenshot will prove the icon stayed "on" (did not mute)
    await expect(page).toHaveScreenshot('03-guest-mute-blocked.png');


    // 3. Test Slider LIMIT
    await slider.hover();
    // Try to click on the left edge (10%)
    const box = await slider.boundingBox();
    if (box) {
        await slider.click({ position: { x: box.width * 0.1, y: box.height / 2 } });
    }
    
    // The screenshot will prove the slider stuck at 25% (or minimum allowed)
    await expect(page).toHaveScreenshot('03-guest-slider-limited.png');
  });

   // --- SPEECH TAB ---
   await test.step('4. Speech tab', async () => {
    
    await page.getByText('Speech').click();
    
    
    await expect(page.getByText('Vocals')).toBeVisible({ timeout: 15000 });
    
    await expect(page.getByRole('button', { name: 'Other' })).toBeVisible();

    await page.waitForTimeout(1000); 
    await expect(page).toHaveScreenshot('04-speech-tab.png');
  });
});