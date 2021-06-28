"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const query_1 = require("./src/query");
const objectToExcel_1 = require("./src/objectToExcel");
const moment = require("moment");
console.log("Hello world!");
const now = moment();
const startDate = now.subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
const endDate = now.add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
query_1.retailersStatus(startDate, endDate)
    .then(result => {
    console.log(result);
    const data = result;
    const dataSorted = data.sort((a, b) => {
        if (a.amount < b.amount) {
            return 1;
        }
        if (a.amount > b.amount) {
            return -1;
        }
        return 0;
    });
    objectToExcel_1.exportToExcel(dataSorted).then((workbook) => {
        console.log(workbook);
        workbook.xlsx.writeFile(`retaileer-${moment().format('YYYY-MM-DD')}.xlsx`)
            .then(() => {
            console.log('Writing file done');
        }).catch(error => { console.log(error); });
    }).catch(error => { console.log(error); });
}).catch(error => {
    console.log(error);
});
