"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const excel = require("exceljs");
async function exportToExcel(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const workbook = new excel.Workbook();
            workbook.creator = 'FBIS Technologies';
            workbook.lastModifiedBy = 'FBIS Technologies';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
            const worksheet = workbook.addWorksheet("RetailerList");
            worksheet.columns = [
                { header: "ID", key: "id", width: 25 },
                { header: "Serial Number", key: "serialNumber", width: 50 },
                { header: "Dealer Code", key: "dealerCode", width: 2 },
                { header: "Denomination", key: "denomination", width: 25 },
                { header: "Value Added At", key: "valueAddedAt", width: 10 },
                { header: "Pin", key: "pin", width: 50 },
            ];
            data.forEach((element, idx) => {
                console.log("Adding Row: ", element);
                worksheet.insertRow(idx + 2, {
                    id: element.id,
                    serialNumber: element.serialNumber,
                    dealerCode: element.dealerCode,
                    denomination: element.denomination,
                    valueAddedAt: element.valueAddedAt,
                    pin: element.pin,
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
