"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const excel = require("exceljs");
async function exportToExcel(data) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new excel.Workbook();
            workbook.creator = 'Beamsity';
            workbook.lastModifiedBy = 'Beamsity';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
            const worksheet = workbook.addWorksheet("Students_List");
            worksheet.columns = [
                { header: "First Name", key: "firstName", width: 15 },
                { header: "Last Name", key: "lastName", width: 15 },
                { header: "Phone Number", key: "msisdn", width: 10 },
                { header: "Email", key: "email", width: 15 },
                { header: "Gender", key: "gender", width: 5 },
                { header: "Last Active", key: "lastActive", width: 10 },
                { header: "State", key: "state", width: 10 },
                { header: "Subs", key: "totalSubs", width: 5 },
                { header: "Active Subs", key: "totalActiveSubs", width: 5 },
                { header: "Date Joined", key: "dateJoined", width: 10 },
            ];
            data.forEach((element, idx) => {
                console.log("Adding Row: ", element);
                worksheet.insertRow(idx + 2, {
                    firstName: element.firstName,
                    lastName: element.lastName,
                    msisdn: element.msisdn,
                    email: element.email,
                    gender: element.gender,
                    lastActive: element.lastActive,
                    state: element.state,
                    totalSubs: element.totalSubs,
                    totalActiveSubs: element.totalActiveSubs,
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
