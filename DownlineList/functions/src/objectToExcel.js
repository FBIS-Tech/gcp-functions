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
            const worksheet = workbook.addWorksheet("RetailerList");
            worksheet.columns = [
                { header: "Name", key: "name", width: 25 },
                { header: "Retail Code", key: "retailCode", width: 5 },
                { header: "Phone Number", key: "msisdn", width: 10 },
                { header: "Dealer", key: "dealerName", width: 25 },
                { header: "DelerCode", key: "dealerCode", width: 5 },
                { header: "Balance", key: "walletBalance", width: 20 },
                { header: "Date Joined", key: "dateJoined", width: 10 },
            ];
            data.forEach((element, idx) => {
                console.log("Adding Row: ", element);
                worksheet.insertRow(idx + 2, {
                    name: element.name,
                    retailCode: element.retailCode,
                    msisdn: element.msisdn,
                    dealerName: element.dealerName,
                    dealerCode: element.dealerCode,
                    walletBalance: element.walletBalance,
                    dateJoined: element.dateJoined
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
