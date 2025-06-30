const controller = require("../Controllers/ProductController")
const middleware = require("../utils/ProductMiddleware")
const express = require("express");
const router = express.Router();
router.post("/search-product",/*middleware.authsearchproduct,*/controller.searchproductsss);
router.post("/update",/*middleware.authcashier,*/controller.updateproductbycashiers);
module.exports = router;