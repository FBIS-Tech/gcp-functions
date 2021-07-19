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
                  wt.channel 
                  FROM mtn_vend_requests as mvr 
                  LEFT JOIN wallet_transactions as wt ON mvr.transaction_reference = wt.transaction_reference
                  WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;

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
