import { test, expect, takeSnapshot } from '@chromatic-com/playwright';

const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3';
const AUTH_KEY = 'moises:userToken';
const AUTH_VALUE = 'APP-a2ccbf21-69d5-41f1-89a0-bb61eadcf231';

test('Authenticated flow: Mute should work', async ({ page }, testInfo) => {
  
  // 1. TOKEN INJECTION
  await page.addInitScript((dados) => {
      window.localStorage.setItem(dados.key, dados.value);
      // Remova essa linha do ReviewApp se você não quer que o modal apareça neste teste!
      // Se quiser que apareça para tratar com o dismiss, pode deixar.
      window.localStorage.setItem('moises:showReviewApp', 'true');
  }, { key: AUTH_KEY, value: AUTH_VALUE });

  // 2. Access the site
  await page.goto(URL_DO_APP);
  await page.waitForLoadState('networkidle');

  // --- TRATAMENTO DE MODAIS E WELCOME ---
  
  // 1. Tenta fechar o Rating se aparecer
  const btnDismiss = page.getByRole('button', { name: 'Dismiss' });
  if (await btnDismiss.isVisible()) {
      await btnDismiss.click();
  }

  // 2. Tenta passar pelo Welcome se aparecer
  // (Declaramos btnContinue apenas UMA vez aqui)
  const btnContinue = page.getByRole('button', { name: 'Continue' });
  if (await btnContinue.isVisible()) {
      await btnContinue.click();
  }

  // Main screen (Toggle Off)
  // Espera o texto principal aparecer
  await expect(page.getByText('Turn on AI volume control')).toBeVisible();
  // Tira a primeira foto
  await takeSnapshot(page, '01-Auth-Main', testInfo);


  // Music tab
  // Turn on the Toggle
  await page.getByRole('switch', { name: 'Toggle Switch for AI Volume Control' }).click();
  
  // Wait for loading: we know that in the Music Tab there are sliders.
  // There are 3 sliders (Vocals, Guitar, Other).
  // We wait for the first one to appear to guarantee the loading.
  await expect(page.getByRole('slider').first()).toBeVisible({ timeout: 15000 });
  
  // Validate that the "Connect your account" banner does not exist (because we are logged in)
  await expect(page.getByText('Connect your account')).toBeHidden();

  // Take snapshot
  await takeSnapshot(page, '02-Auth-Music', testInfo);

   // Test of Mute (Vocals)
   const vocalsContainerMusic = page.locator('div').filter({ hasText: 'Vocals' }).first();
   const muteVocalsMusic = vocalsContainerMusic.getByRole('img', { name: /Stem Vocals/i });
   
   await muteVocalsMusic.click();
   
   // Take snapshot of Muted Vocals
   await takeSnapshot(page, '02b-Auth-Music-VocalsMuted', testInfo);

  // Speech tab
  await page.getByRole('button').nth(1).click(); // Clica na segunda aba
  await expect(page.getByRole('slider')).toHaveCount(2, { timeout: 15000 });
  await page.waitForTimeout(1000); 
  
  // Take snapshot of Normal State
  await takeSnapshot(page, '03-Auth-Speech-Normal', testInfo);

  // Test of Double Mute (Vocals + Other)
  // We need to reset the Vocals container because the screen changed (avoid obsolete element error)
  const vocalsContainerSpeech = page.locator('div').filter({ hasText: 'Vocals' }).first();
  const muteVocalsSpeech = vocalsContainerSpeech.getByRole('img', { name: /Stem Vocals/i });
  
  const otherContainer = page.locator('div').filter({ hasText: 'Other' }).first();
  // Regex to find any mute button that contains "Other"
  const muteOther = otherContainer.getByRole('img', { name: /Stem Other/i });

  await muteVocalsSpeech.click();
  await muteOther.click();

  // Take snapshot of All Muted
  await takeSnapshot(page, '03b-Auth-Speech-AllMuted', testInfo);
});