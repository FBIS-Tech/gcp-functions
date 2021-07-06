"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retailersStatus = void 0;
const db_1 = require("./db");
const declarative_js_1 = require("declarative-js");
function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key]);
        return result;
    }, {});
}
async function retailersStatus(start, end) {
    console.log(start, end);
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
        mvr.id,
        mvr.request_msisdn,
        mvr.retail_code,
        mvr.dealer_code,
        mvr.amount,
        r.name
        FROM mtn_vend_requests as mvr 
        INNER JOIN retailers as r ON r.retail_code = mvr.retail_code
        WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;
        db_1.db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            const requests = rows.map((row) => {
                const vendRequest = {
                    name: row.name,
                    requestMSISDN: row.request_msisdn,
                    retailCode: row.retail_code,
                    dealerCode: row.dealer_code,
                    amount: row.amount,
                };
                return vendRequest;
            });
            const groupedRequests = requests.reduce(declarative_js_1.Reducer.groupBy('retailCode'), declarative_js_1.Reducer.Map()).toObject();
            const newObject = objectMap(groupedRequests, (values) => {
                const total = values.map(v => v.amount).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue));
                const sum = {
                    name: values[0].name,
                    requestMSISDN: values[0].requestMSISDN,
                    retailCode: values[0].retailCode,
                    dealerCode: values[0].dealerCode,
                    amount: Number(total),
                };
                return sum;
            });
            const retailersList = Object.keys(newObject).map(key => newObject[key]);
            console.log("Retailer List: ", retailersList);
            resolve(retailersList);
        });
    });
}
exports.retailersStatus = retailersStatus;
