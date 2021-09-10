"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const excel = require("exceljs");
async function exportToExcel(data) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new excel.Workbook();
            workbook.creator = 'FBIS Technologies';
            workbook.lastModifiedBy = 'FBIS Technologies';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
            const worksheet = workbook.addWorksheet("RetailerStatus");
            worksheet.columns = [
                { header: "Retail Code", key: "retailCode", width: 10 },
                { header: "Dealer Code", key: "dealerCode", width: 10 },
                { header: "Phone Number", key: "requestMSISDN", width: 30 },
                { header: "Name", key: "name", width: 35 },
                { header: "Amount", key: "amount", width: 30 },
            ];
            data.forEach((element, idx) => {
                console.log("Adding Row: ", element);
                worksheet.insertRow(idx + 2, {
                    retailCode: element.retailCode,
                    dealerCode: element.dealerCode,
                    requestMSISDN: element.requestMSISDN,
                    name: element.name,
                    amount: element.amount
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
