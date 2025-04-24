const express = require("express");
const router = express.Router();
const { MAX_ITEMS, test_db_conn, pool} = require("../db");

router.get("/data", async (req, res) => {
    if (!await test_db_conn()) {
        res.status(500).send("Internal error");
        return;
    }

    const data = await pool.query("SELECT * FROM distrito");

    res.json(data[0]);
});

module.exports = router;