const fs = require('fs')
const { scrapeWebsite } = require("../helpers/scrape");
const moment = require("moment");

async function readPreviousData(path) {
    const rawData = await fs.readFileSync(path);
    return JSON.parse(rawData);
}

function writeDataToFile(path, fileName, data) {
    fs.writeFile(`${path}/${fileName}`, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            throw(err);
        }
        console.log('Saved!');
    });
}

async function isFileExist(path) {
    return fs.existsSync(path);
}

function isLatestScrape(lastUpdateTime) {
    // data gets updated at 8:00 AM on WoHFW Website, checking last updated time is after that or not
    return moment(lastUpdateTime).isAfter(moment().format('YYYY-MM-DDT08:00:00'));
}

async function getCovidData(path, fileName, scrapeType) {
    try {
        let data = await readPreviousData(`${path}/${fileName}`);
        let lastUpdatedTime;
        if (scrapeType === 'total_cases') {
            lastUpdatedTime = data.updated_at
        } else {
            lastUpdatedTime = data.length ? data[0].updated_at : moment().format('YYYY-MM-DDT00:00:00')
        }
        if (!isLatestScrape(lastUpdatedTime)) {
            // In case of older scrape, re-scraping data from website
            data = await scrapeWebsite(scrapeType);
            if (!data) {
                return {
                    err: {
                        status: 204,
                        message: 'Data Couldn\'t be scraped.',
                    },
                };
            }
            writeDataToFile(path, fileName, data);
        }
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getAllCities(city, path, fileName) {
    try {
        const isDatabaseExist = await isFileExist(`${path}/${fileName}`);
        if (!isDatabaseExist) {
            return {
                err: {
                    status: 204,
                    message: 'No Data Available',
                },
            };
        }
        console.log("File Exist!!!");
        const data = await readPreviousData(`${path}/${fileName}`);
        return {
            cities: data.map(({name}) => name)
        };
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getCityWiseData(city, path, fileName) {
    try {
        const isDatabaseExist = await isFileExist(`${path}/${fileName}`);
        if (!isDatabaseExist) {
            return {
                err: {
                    status: 204,
                    message: 'No Data Available',
                },
            };
        }
        console.log("File Exist!!!");
        const data = await readPreviousData(`${path}/${fileName}`);
        return data.filter(({ name }) => name === city);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports = {
    getCovidData,
    getAllCities,
    getCityWiseData,
}
