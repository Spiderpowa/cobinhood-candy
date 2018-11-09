const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.setViewport({width: 1600, height: 900});
	await page.goto('https://cobinhood.com');
	console.log('Connected');
	await page.keyboard.press('Escape');
	await page.click('#desktop-header-login');
	await page.waitForNavigation({timeout: 0});
	const cookies = await page.cookies();
	await browser.close();
  const token = getToken(cookies);

	console.log(token);
	function getToken(cookies) {
		for (let cookie of cookies) {
			if (cookie.name == 'Authorization') {
				return cookie.value;
			}
		}
	}
})();
