const express = require("express");
const router = express.Router();
const HomeController = require('./controllers/contoller');
const sendResponse = require('./middlewares/sendResponse');

router.get("/total_cases", HomeController.totalCases, sendResponse);
router.get("/city_cases", HomeController.cityCases, sendResponse);
router.get("/cities", HomeController.cities, sendResponse);
router.get("/city/:city", HomeController.cityWiseData, sendResponse);

module.exports = router;
