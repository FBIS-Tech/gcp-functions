"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retailerList = void 0;
const moment = require("moment");
const db_1 = require("./db");
async function retailerList() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
        r.name,
        r.retail_code,
        r.msisdn,
        r.created_at,
        d.name as dealer_name,
        d.retail_code as dealer_code,
        w.available_balance as balance
        FROM retailers as r
        INNER JOIN dealers as d ON r.dealer_id = d.id
        INNER JOIN wallets as w ON r.user_id = w.user_id
        ORDER BY dealer_code, name ASC`;
        db_1.db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            const requests = rows.map((row) => {
                const retailer = {
                    name: row.name,
                    retailCode: row.retail_code,
                    msisdn: row.msisdn,
                    dealerName: row.dealer_name,
                    dealerCode: row.dealer_code,
                    walletBalance: row.balance,
                    dateJoined: moment(row.created_at).format("YYYY-MM-DD")
                };
                return retailer;
            });
            const retailersList = requests;
            console.log("Retailer List: ", retailersList);
            resolve(retailersList);
        });
    });
}
exports.retailerList = retailerList;
