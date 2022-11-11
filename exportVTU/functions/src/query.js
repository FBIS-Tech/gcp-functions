"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBatchVouchers = void 0;
const db_1 = require("./db");
async function fetchBatchVouchers(batchId, environment = "production") {
    console.log("batchId", batchId);
    return new Promise((resolve, reject) => {
        const key = environment === "production" ? process.env.PROD_ENCRYPTION_KEY : process.env.DEV_ENCRYPTION_KEY;
        const query = `
        SELECT id, serial_number, dealer_code, denomination, value_added_at, AES_DECRYPT(pin, "${key}") as pin
        FROM pins_storage
        WHERE batch_id = ${batchId}`;
        db_1.db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            const requests = rows.map((row) => {
                const vtu = {
                    id: row.id,
                    serialNumber: row.serial_number,
                    dealerCode: row.dealer_code,
                    denomination: row.denomination,
                    valueAddedAt: row.value_added_at,
                    pin: row.pin,
                };
                return vtu;
            });
            const vtus = requests;
            console.log("VTU List: ", vtus);
            resolve(vtus);
        });
    });
}
exports.fetchBatchVouchers = fetchBatchVouchers;
