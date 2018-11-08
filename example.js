const puppeteer = require('puppeteer');

(async () => {
	  const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: false});
	  const page = await browser.newPage();
	  await page.setViewport({width: 1600, height: 900});
	  await page.goto('https://cobinhood.com');
	  console.log('Connected');
	  await page.keyboard.press('Escape');
	  await page.click('#desktop-header-login');
	  await page.waitFor(3000);
	  recaptcha = getRecaptcha(page.mainFrame());
	  function getRecaptcha(frame) {
        for (let child of frame.childFrames()) {
					  if (child.url().startsWith('https://www.google.com/recaptcha/api2/anchor')) {
							  return child;
						}
				}
		}
	  console.log('Recaptcha URL:' + recaptcha.url());
    var checkbox = '.recaptcha-checkbox-checkmark';
	  await recaptcha.click(checkbox);
	  console.log('Clicked');
	  await page.waitFor(5000);
	  console.log('Done');
	  await page.screenshot({path: 'example.png'});
	  console.log('Close');

	  await browser.close();
})();
