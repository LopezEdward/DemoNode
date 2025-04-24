const mysql = require("mysql2/promise");

let CONN_FLAG = false;
const DEFAULT_ROW_MODE = "array";
let pool;
const MAX_ITEMS = 50;

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
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
