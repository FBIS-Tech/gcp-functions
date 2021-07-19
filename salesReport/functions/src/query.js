"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTransactions = void 0;
const moment = require("moment");
const db_1 = require("./db");
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
                  wt.channel,
                  d.name as dealer_name,
                  pt.territory as dealer_territory
                  FROM mtn_vend_requests as mvr 
                  LEFT JOIN wallet_transactions as wt ON mvr.transaction_reference = wt.transaction_reference
                  WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;
        console.log(moment().format('HH:mm:ss'));
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
                    dealerName: row.dealer_name,
                    territory: row.dealer_territory,
                    amount: row.amount,
                    productCode: row.product_code,
                    channel: row.channel,
                    dateCreated: row.created_at,
                };
                return salesRequest;
            });
            console.log(moment().format('HH:mm:ss'));
            resolve(logs);
        });
    });
}
exports.salesTransactions = salesTransactions;
