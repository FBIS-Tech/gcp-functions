import * as excel from "exceljs";
import { SalesRequest } from "./types/SalesRequest";

export async function exportToExcel(data: [SalesRequest]) {
  return new Promise((resolve, reject) => {
    try {
      const workbook = new excel.Workbook();
      workbook.creator = "FBIS Technologies";
      workbook.lastModifiedBy = "FBIS Technologies";
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();
      const worksheet = workbook.addWorksheet("SalesReport");

      worksheet.columns = [
        { header: "Retail Code", key: "retailCode", width: 15 },
        { header: "Retailer Phone Number", key: "requestMSISDN", width: 20 },
        { header: "Recipient Phone Number", key: "destinationMSISDN", width: 25 },
        { header: "Dealer Code", key: "dealerCode", width: 10 },
        { header: "Dealer Name", key: "dealerName", width: 15 },
        { header: "Territory", key: "territory", width: 15 },
        { header: "Product Code", key: "productCode", width: 10 },
        { header: "Channel", key: "channel", width: 10 },
        { header: "Amount", key: "amount", width: 10 },
        { header: "Date", key: "dateCreated", width: 15 },
      ];

      // // Add Array Rows
      data.forEach((element, idx) => {
        // console.log("Adding Row: ", element);
        worksheet.insertRow(idx + 2, {
          retailCode: element.retailCode,
          requestMSISDN: element.requestMSISDN,
          destinationMSISDN: element.destinationMSISDN,
          dealerCode: element.dealerCode,
          dealerName: element.dealerName,
          territory: element.territory,
          amount: element.amount,
          productCode: element.productCode,
          channel: element.channel,
          dateCreated: element.dateCreated,
        });
      });
      resolve(workbook);
    } catch (error) {
      reject(error);
    }
  });
}
