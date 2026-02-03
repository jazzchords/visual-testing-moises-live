import { test, expect } from '@chromatic-com/playwright';


const URL_DO_APP = 'https://moises-live-ui-v3.vercel.app/v3'; 

test('Visual Testing: Home Page', async ({ page }) => {
  
  await page.goto(URL_DO_APP);
  
  
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('home-page.png', {
    fullPage: true 
  });

});