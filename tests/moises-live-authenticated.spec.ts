import { test, expect } from '@playwright/test';

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';

const AUTH_KEY = 'moises:userToken';
const AUTH_VALUE = 'APP-a2ccbf21-69d5-41f1-89a0-bb61eadcf231';

test('Authenticated flow: Mute should work', async ({ page }) => {
  
  // 1. TOKEN INJECTION
  await page.addInitScript((dados) => {
      window.localStorage.setItem(dados.key, dados.value);
  }, { key: AUTH_KEY, value: AUTH_VALUE });

  // 2. Access the site
  await page.goto(URL_DO_APP);
  await page.waitForLoadState('networkidle');

  // --- QUICK NAVIGATION TO MUTE ---
  
  // Step 1: Welcome
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 2: Turn on Toggle
  await page.getByRole('switch', { name: 'Toggle Switch for AI Volume Control' }).click();
  
  // Step 3: Music tab (Wait for load)
  await page.waitForTimeout(1000); 

  // --- MUTE TEST ---
  
  // Locate the Vocals mute button
  const vocalsContainer = page.locator('div').filter({ hasText: 'Vocals' }).first();
  const botaoMute = vocalsContainer.getByRole('img', { name: /Stem Vocals/i });
  
  // Click to MUTE
  await botaoMute.click();
  
  // VALIDATION:
  // If logged in, mute works and the "Connect your account" banner should NOT appear.
  // We can validate that the banner is HIDDEN or take a screenshot of the muted button.
  
  await expect(page.getByText('Connect your account')).toBeHidden(); // Banner should not exist
  await expect(page).toHaveScreenshot('autenticado-vocals-muted.png');
  
});