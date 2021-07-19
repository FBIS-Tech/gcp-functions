import * as  moment from "moment";
import { RowDataPacket } from "mysql2";
import { db } from "./db";
import { SalesRequest } from "./types/SalesRequest";

export async function salesTransactions(
  start: string,
  end: string
): Promise<SalesRequest[]> {
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

    console.log(moment().format('HH:mm:ss'))
    db.query(query, (err, result) => {
      if (err) {
        console.log("Error: ", err);
        reject(err);
      }

      const rows = <RowDataPacket[]>result;

      const logs: SalesRequest[] = rows.map((row) => {
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
