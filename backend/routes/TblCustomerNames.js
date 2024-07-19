const express = require("express");

const router = express.Router();

const customerController = require("../controllers/TblCustomerNames");

router.get("/v1/all", customerController.getCustomerNames);

router.get("/v1/search", customerController.getSearch);

module.exports = router;
