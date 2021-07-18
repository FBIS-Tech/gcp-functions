import * as  moment from "moment";
import { RowDataPacket } from "mysql2";
import { db } from "./db";
import { SalesRequest } from "./types/SalesRequest";
function objectMap(object: any, mapFn: any) {
  return Object.keys(object).reduce(function (result: any, key: any) {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
}

export async function salesTransactions(start: string, end: string) {
  console.log(start, end);
  return new Promise((resolve, reject) => {
    const query = `
                  SELECT 
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
                  LEFT JOIN dealers as d ON mvr.dealer_code = d.retail_code
                  LEFT JOIN partner_territories as pt ON d.territory = pt.id
                  WHERE (mvr.created_at BETWEEN '${start}' AND '${end}') AND mvr.status = 'SUCCESSFUL'
                  ORDER BY mvr.id ASC
                  LIMIT 0, 10000;`

    console.log(moment().format('HH:mm:ss'))
    db.query(query, (err, result) => {
      if (err) {
        console.log("Error: ", err);
        reject(err);
      }

      const rows = <RowDataPacket[]>result;

      const logs = rows.map((row) => {
        const salesRequest: SalesRequest = {
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

      console.log(moment().format('HH:mm:ss'))
      resolve(logs);
    });
  });
}
