const express = require("express");

const router = express.Router();

router.get("/order", (req,res) => {
    res.render("order_history");
})

module.exports = router;