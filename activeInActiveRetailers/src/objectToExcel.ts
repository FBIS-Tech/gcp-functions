import * as excel from 'exceljs'
import { SumVendRequest } from './types/VendRequest';



export async function exportToExcel(data: [SumVendRequest]) {
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


            // // Add Array Rows
            data.forEach((element, idx) => {
                worksheet.insertRow(idx + 2, {
                    retailCode: element.retailCode,
                    dealerCode: element.dealerCode,
                    requestMSISDN: element.requestMSISDN,
                    name: element.name,
                    amount: element.amount
                });
            });
            resolve(workbook)

        } catch (error) {
            reject(error)
        }
    })
}