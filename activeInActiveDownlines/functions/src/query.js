"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDownlines = void 0;
const db_1 = require("./db");
const declarative_js_1 = require("declarative-js");
function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key]);
        return result;
    }, {});
}
function mapVendRequests(row) {
    const vendRequest = {
        name: row.name,
        requestMSISDN: row.request_msisdn,
        retailCode: row.retail_code,
        dealerCode: row.dealer_code,
        amount: row.amount,
    };
    return vendRequest;
}
const dbQueryHandler = (query) => {
    return new Promise((resolve, reject) => {
        db_1.db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};
const processDownlines = async (start, end) => {
    const retailersPromise = retailersStatus(start, end);
    const subDealersPromise = subDealersStatus(start, end);
    const [retailersResolved, subDealersResolved] = await Promise.all([retailersPromise, subDealersPromise]);
    const retailerRows = retailersResolved;
    const subDealersRows = subDealersResolved;
    const downlines = [...retailerRows, ...subDealersRows];
    const groupedRequests = downlines
        .map(mapVendRequests)
        .reduce(declarative_js_1.Reducer.groupBy('retailCode'), declarative_js_1.Reducer.Map())
        .toObject();
    const newObject = objectMap(groupedRequests, (values) => {
        const total = values
            .map(v => v.amount)
            .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue));
        const sum = {
            name: values[0].name,
            requestMSISDN: values[0].requestMSISDN,
            retailCode: values[0].retailCode,
            dealerCode: values[0].dealerCode,
            amount: Number(total),
        };
        return sum;
    });
    const downlineList = Object.keys(newObject).map(key => newObject[key]);
    console.log("Downline List Count: ", downlineList.length);
    return downlineList;
};
exports.processDownlines = processDownlines;
function retailersStatus(start, end) {
    console.log("Using Date: ", start, end);
    const query = `
        SELECT 
        mvr.id,
        mvr.request_msisdn,
        mvr.retail_code,
        mvr.dealer_code,
        mvr.amount,
        r.name
        FROM mtn_vend_requests as mvr 
        JOIN retailers as r ON r.retail_code = mvr.retail_code
        WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;
    console.log("Query: ", query);
    return dbQueryHandler(query);
}
function subDealersStatus(start, end) {
    console.log("Using Date: ", start, end);
    const query = `
        SELECT 
        mvr.id,
        mvr.request_msisdn,
        mvr.retail_code,
        mvr.dealer_code,
        mvr.amount,
        s.name
        FROM mtn_vend_requests as mvr 
        JOIN sub_dealers as s ON s.retail_code = mvr.retail_code
        WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;
    console.log("Query: ", query);
    return dbQueryHandler(query);
}
