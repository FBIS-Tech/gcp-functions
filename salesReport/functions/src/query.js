"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTransactions = void 0;
const moment = require("moment");
const mysql = require("mysql2/promise");
async function salesTransactions(start, end) {
    console.log(start, end);
    const startT = moment();
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME
    });
    try {
        const query = `
          SELECT 
          mvr.request_msisdn, 
          mvr.destination_msisdn, 
          mvr.retail_code, 
          mvr.dealer_code, 
          mvr.amount, 
          mvr.created_at, 
          mvr.product_code, 
          mvr.channel,
          d.name as dealer_name,
          pt.territory as dealer_territory
          FROM mtn_vend_requests as mvr 
          LEFT JOIN dealers as d ON mvr.dealer_code = d.retail_code
          LEFT JOIN partner_territories as pt ON d.territory = pt.id
          WHERE (mvr.created_at BETWEEN '${start}' AND '${end}') AND mvr.status = 'SUCCESSFUL'
          ORDER BY mvr.id ASC`;
        const query2 = `
          SELECT 
          irl.request_msisdn, 
          irl.destination_msisdn, 
          irl.retail_code, 
          irl.dealer_code, 
          irl.amount, 
          irl.created_at,
          d.name as dealer_name,
          pt.territory as dealer_territory
          FROM instant_recharge_logs as irl 
          LEFT JOIN dealers as d ON irl.dealer_code = d.retail_code
          LEFT JOIN partner_territories as pt ON d.territory = pt.id
          WHERE (irl.created_at BETWEEN '${start}' AND '${end}')
          ORDER BY irl.id ASC`;
        const [mvrResult] = await db.execute(query);
        const [irlResult] = await db.execute(query2);
        const dataRows = mvrResult;
        const irlRows = irlResult;
        dataRows.push(...irlRows);
        const logs = dataRows.map((row) => {
            const salesRequest = {
                requestMSISDN: row.request_msisdn,
                destinationMSISDN: row.destination_msisdn,
                retailCode: row.retail_code,
                dealerCode: row.dealer_code,
                dealerName: row.dealer_name,
                territory: row.dealer_territory,
                amount: row.amount,
                productCode: row.product_code || "VTU",
                channel: row.channel || "Retopin",
                dateCreated: row.created_at,
            };
            return salesRequest;
        });
        const duration = moment.duration(moment().diff(startT));
        console.log(`${duration.hours()}:${duration.minutes()}:${duration.seconds()}`);
        return logs;
    }
    catch (error) {
        console.log("Error: ", error);
        throw error;
    }
}
exports.salesTransactions = salesTransactions;
