import { RowDataPacket } from "mysql2";
import { db } from "./db";
import { SalesRequest } from "./types/SalesRequest";
import { Reducer } from "declarative-js";
import * as moment from "moment";

function objectMap(object: any, mapFn: any) {
  return Object.keys(object).reduce(function (result: any, key: any) {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
}

export async function salesTransactions(start: string, end: string) {
  console.log(start, end);
  const listOfDates = splitDates(start, end);

  listOfDates.forEach((date) => {
    const startOfDate = date.startOf("day").toString();
    const endOfDate = date.endOf("day");
  });

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

      const logs = rows.map((row) => {
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

function splitDates(startDate: string, endDate: string) {
  const formattedStart = moment(startDate, "YYYY-MM-DD");
  const formattedEnd = moment(endDate, "YYYY-MM-DD");

  const listOfDates = new Array();

  while (true) {
    const tempDate = formattedStart.add(1, "days");
    if (tempDate <= formattedEnd) {
      listOfDates.push(tempDate);
    } else {
      break;
    }
  }
  return listOfDates;
}
