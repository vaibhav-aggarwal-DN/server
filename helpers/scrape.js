const puppeteer = require('puppeteer');
const moment = require('moment');

async function scrapeCountry(page) {
    // scrape total data
    const coronaState = ['active', 'recovered', 'deaths'];
    const indiaData = {
        updated_at: moment().add(5, 'hours').add(30, 'minutes').format(),
    };
    for(let i = 1; i < 4; i++) {
        const selector = `#site-dashboard > div > div > div:nth-child(1) > div.col-xs-8.site-stats-count > ul > li:nth-child(${i}) > strong:nth-child(2)`;
        const quantity = await page.evaluate(element => element.textContent, await page.waitForSelector(selector));
        indiaData[coronaState[i - 1]] = +quantity.split('(')[0].trim();
    }
    return indiaData;
}

async function scrapeCities(page) {
    // scrape city wise data
    const cities = [];
    const currTime = moment().add(5, 'hours').add(30, 'minutes').format();
    for(let i = 1; i < 37; i++) {
        const selector = `#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child({value})`;
        const cityName = await page.evaluate(element => element.textContent, await page.waitForSelector(selector.replace('{value}', '2')));
        const active = await page.evaluate(element => element.textContent, await page.waitForSelector(selector.replace('{value}', '3')));
        const recovered = await page.evaluate(element => element.textContent, await page.waitForSelector(selector.replace('{value}', '5')));
        const deaths = await page.evaluate(element => element.textContent, await page.waitForSelector(selector.replace('{value}', '7')));
        cities.push(
            {
                name: (cityName).replaceAll('*', ''),
                active: +active,
                recovered: +recovered,
                deaths: +deaths,
                updated_at: currTime,
            }
        );
    }
    return cities;
}

async function scrapeWebsite(scrapeType) {
    try {
        const browser = await puppeteer.launch({});
        const page = await browser.newPage();

        await page.goto('https://www.mohfw.gov.in/');
        let data;
        if (scrapeType === 'total_cases') {
            data = await scrapeCountry(page);
        } else {
            data = await scrapeCities(page);
        }
        browser.close(); // await not needed, browser could close asynchronously
        return data
    } catch (e) {
        console.error(e);
        return {};
    }
}

module.exports = {
    scrapeWebsite,
}
