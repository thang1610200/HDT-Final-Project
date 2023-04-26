const express = require("express");
require("module-alias/register")
const router = express.Router();

router.use("/api/v1/guest",require("@controllers/guest"));

router.get("/api/v1",(req,res) => {
    res.render("homepage");
})

module.exports = router;
