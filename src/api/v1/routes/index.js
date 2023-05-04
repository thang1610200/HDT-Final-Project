const express = require("express");
require("module-alias/register");
const router = express.Router();

router.use("/guest",require("@controllers/guest"));
router.use("/user",require("@controllers/user"));
router.use("/admin",require("@controllers/admin"));
//router.use("/test",require("@controllers/test"));

router.get("/",(req,res) => {
    res.render("homepage");
})
module.exports = router;
