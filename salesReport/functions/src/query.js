"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTransactions = void 0;
const db_1 = require("./db");
const declarative_js_1 = require("declarative-js");
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
    SELECT mvr.id, mvr.request_msisdn, mvr.destination_msisdn, mvr.retail_code, mvr.dealer_code, mvr.amount, mvr.created_at, wt.product_code, wt.channel FROM mtn_vend_requests as mvr LEFT JOIN wallet_transactions as wt ON mvr.transaction_reference = wt.transaction_reference;
        WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;
        db_1.db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            const requests = rows.map((row) => {
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
            const groupedRequests = requests
                .reduce(declarative_js_1.Reducer.groupBy("retailCode"), declarative_js_1.Reducer.Map())
                .toObject();
            const newObject = objectMap(groupedRequests, (values) => {
                const total = values
                    .map((v) => v.amount)
                    .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue));
                const sum = {
                    requestMSISDN: values[0].requestMSISDN,
                    destinationMSISDN: values[0].destinationMSISDN,
                    retailCode: values[0].retailCode,
                    dealerCode: values[0].dealerCode,
                    amount: Number(total),
                    dateCreated: values[0].dateCreated,
                    productCode: values[0].productCode,
                    channel: values[0].channel,
                };
                return sum;
            });
            const retailersList = Object.keys(newObject).map((key) => newObject[key]);
            console.log("Retailer List: ", retailersList);
            resolve(retailersList);
        });
    });
}
exports.salesTransactions = salesTransactions;
