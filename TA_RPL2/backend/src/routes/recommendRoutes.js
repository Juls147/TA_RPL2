const express = require("express");
const recommendController = require("../recommend/recommendController");
const router = express.Router();

router.get("/", recommendController.getAllRecommendProducts);
router.get("/recommends", recommendController.getRecommend);

module.exports = router;
