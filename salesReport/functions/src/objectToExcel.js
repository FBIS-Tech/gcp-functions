"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const excel = require("exceljs");
async function exportToExcel(data) {
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
                { header: "Origin Phone Number", key: "requestMSISDN", width: 20 },
                { header: "Destination Phone Number", key: "destinationMSISDN", width: 25 },
                { header: "Dealer Code", key: "dealerCode", width: 10 },
                { header: "Dealer Name", key: "dealerName", width: 15 },
                { header: "Territory", key: "territory", width: 15 },
                { header: "Product Code", key: "productCode", width: 10 },
                { header: "Channel", key: "channel", width: 10 },
                { header: "Amount", key: "amount", width: 10 },
                { header: "Date", key: "dateCreated", width: 15 },
            ];
            data.forEach((element, idx) => {
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
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.exportToExcel = exportToExcel;
