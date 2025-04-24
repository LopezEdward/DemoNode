const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => {
    res.render("index");
});

router.get("/add", (req, res) => {
    res.render("nuevo");
});

module.exports = router;
