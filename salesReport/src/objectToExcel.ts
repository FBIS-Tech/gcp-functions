import * as excel from "exceljs";
import { SalesRequest } from "./types/SalesRequest";

export async function exportToExcel(data: SalesRequest[]) {
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
        { header: "Retail Code", key: "retailCode", width: 10 },
        { header: "Request Phone No", key: "requestMSISDN", width: 20 },
        { header: "Destination Phone No", key: "destinationMSISDN", width: 20 },
        { header: "Dealer Code", key: "dealerCode", width: 5 },
        { header: "Amount", key: "amount", width: 30 },
        { header: "Date Created", key: "dateCreated", width: 30 },
        { header: "Product Code", key: "productCode", width: 10 },
        { header: "Channel", key: "channel", width: 10 },
      ];

      // // Add Array Rows
      data.forEach((element, idx) => {
        console.log("Adding Row: ", element);
        worksheet.insertRow(idx + 2, {
          retailCode: element.retailCode,
          requestMSISDN: element.requestMSISDN,
          destinationMSISDN: element.destinationMSISDN,
          dealerCode: element.dealerCode,
          amount: element.amount,
          dateCreated: element.dateCreated,
          productCode: element.productCode,
          channel: element.channel,
        });
      });
      resolve(workbook);
    } catch (error) {
      reject(error);
    }
  });
}
