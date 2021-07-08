"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTransactions = void 0;
const db_1 = require("./db");
function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key]);
        return result;
    }, {});
}
async function salesTransactions(start, end) {
    console.log(start, end);
    return new Promise((resolve, reject) => {
        const query = `
                  SELECT 
                  mvr.id, 
                  mvr.request_msisdn, 
                  mvr.destination_msisdn, 
                  mvr.retail_code, 
                  mvr.dealer_code, 
                  mvr.amount, 
                  mvr.created_at, 
                  wt.product_code, 
                  wt.channel 
                  FROM mtn_vend_requests as mvr 
                  LEFT JOIN wallet_transactions as wt ON mvr.transaction_reference = wt.transaction_reference
                  WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;
        db_1.db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            const logs = rows.map((row) => {
                const salesRequest = {
                    requestMSISDN: row.request_msisdn,
                    destinationMSISDN: row.destination_msisdn,
                    retailCode: row.retail_code,
                    dealerCode: row.dealer_code,
                    amount: row.amount,
                    dateCreated: row.created_at,
                    productCode: row.product_code,
                    channel: row.channel,
                };
                return salesRequest;
            });
            resolve(logs);
        });
    });
}
exports.salesTransactions = salesTransactions;
