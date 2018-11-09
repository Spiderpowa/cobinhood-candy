const puppeteer = require('puppeteer');
const fs = require('fs');

// Workaroud to generate config.js in candy-bot module
let configFile = "'use strict';\n\n";
configFile += "module.exports = {\n";
configFile += "\t token: ''\n";
configFile += "};\n"
fs.writeFileSync("node_modules/candy-bot/config.js", configFile, function(err) {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});

const TokenRefresher = require('candy-bot/affair/token-refresher');
const TicketClaimer = require('candy-bot/affair/ticket-claimer');
const COBPointClaimer = require('candy-bot/affair/cob-point-claimer.js');
const CandyMachinePlayer = require('candy-bot/affair/candy-machine-player');

const tr = new TokenRefresher();
const tc = new TicketClaimer();
const cc = new COBPointClaimer();
const cmp = new CandyMachinePlayer();

(async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.setViewport({width: 1600, height: 900});
	await page.goto('https://cobinhood.com');
	console.log('Connected');
	await page.keyboard.press('Escape');
	await page.waitFor(1000);
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

	tr.token = token
	tc.claim(tr.token);
	cc.claim(tr.token);
	cmp.play(tr.token);
	// claim ticket and play candy machine every 24h
	setInterval(() => {
		tc.claim(tr.token);
		cc.claim(tr.token);
		cmp.play(tr.token);
	}, 24 * 60 * 60 * 1000);
})();
