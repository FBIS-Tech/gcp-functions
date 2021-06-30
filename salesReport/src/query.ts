import { RowDataPacket } from "mysql2";
import { db } from "./db";
import { SalesRequest, SumSalesRequest } from "./types/SalesRequest";
import { Reducer } from "declarative-js";

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
    SELECT mvr.id, mvr.request_msisdn, mvr.destination_msisdn, mvr.retail_code, mvr.dealer_code, mvr.amount, mvr.created_at, wt.product_code, wt.channel FROM mtn_vend_requests as mvr LEFT JOIN wallet_transactions as wt ON mvr.transaction_reference = wt.transaction_reference;
        WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`;

    db.query(query, (err, result) => {
      if (err) {
        console.log("Error: ", err);
        reject(err);
      }

      const rows = <RowDataPacket[]>result;

      const requests = rows.map((row) => {
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

      const groupedRequests = requests
        .reduce(Reducer.groupBy("retailCode"), Reducer.Map())
        .toObject();

      const newObject = objectMap(groupedRequests, (values: [SalesRequest]) => {
        const total = values
          .map((v) => v.amount)
          .reduce(
            (accumulator, currentValue) =>
              Number(accumulator) + Number(currentValue)
          );

        const sum: SumSalesRequest = {
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
