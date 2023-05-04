const express = require("express");
const router = express.Router();
const Author = require("@middleware/Author.middleware");

router.use(Author);
router.get("/shop", (req,res) => {
    res.render("shop");
})

module.exports = router;