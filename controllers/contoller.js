const { getCovidData, getAllCities, getCityWiseData }  = require('../helpers/module');

async function totalCases(req, res, next) {
    try {
        const fileName = `total_cases.json`;
        const path = `${__dirname}/../database`;
        const data = await getCovidData(path, fileName, "total_cases");
        return next({data});
    } catch (e) {
        console.error(e);
        throw(e);
    }
}

async function cityCases(req, res, next) {
    try {
        const fileName = `city_cases.json`;
        const path = `${__dirname}/../database`;
        const data = await getCovidData(path, fileName, "city_cases");
        return next({data});
    } catch (e) {
        console.error(e);
        throw(e);
    }
}

async function cities(req, res, next) {
    try {
        const { city } = req.params;
        const fileName = `city_cases.json`;
        const path = `${__dirname}/../database`;
        const data = await getAllCities(city, path, fileName);
        return next({data});
    } catch (e) {
        console.error(e);
        throw(e);
    }
}

async function cityWiseData(req, res, next) {
    try {
        const { city } = req.params;
        const fileName = `city_cases.json`;
        const path = `${__dirname}/../database`;
        let data = await getCityWiseData(city, path, fileName);
        if (data.length) {
            data = data[0];
        }
        return next({data});
    } catch (e) {
        console.error(e);
        throw(e);
    }
}

module.exports = {
    totalCases,
    cityCases,
    cities,
    cityWiseData,
};
