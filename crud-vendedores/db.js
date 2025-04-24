const mysql = require("mysql2/promise");

let CONN_FLAG = false;
const DEFAULT_ROW_MODE = "array";
let pool;
const MAX_ITEMS = 50;

const config = {
    user: "root",
    password: "ttGERdETXPZLermDxwPilPbiFQNvZGIW",
    host: "ballast.proxy.rlwy.net",
    port: 16927,
    database: "railway",
    max: 10
};

async function test_db_conn () {
    try {
        if (CONN_FLAG) return true;

        pool = mysql.createPool(config);

        pool.on("error", (err) => {
            console.error("Unexpected error: Print stack trace...\n" + err);
            CONN_FLAG = false;
        });

        console.log("Connected to db");
        CONN_FLAG = true;

        return true;

    } catch (e) {
        console.error("Error meanwhile connect to db. Print stack trace: \n" + e);
        return false;
    }
}

test_db_conn();

module.exports = { pool, test_db_conn, DEFAULT_ROW_MODE, MAX_ITEMS };
