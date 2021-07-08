"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const query_1 = require("./src/query");
const objectToExcel_1 = require("./src/objectToExcel");
const moment = require("moment");
console.log("Hello world!");
const now = moment();
const startDate = now.subtract(7, "days").startOf('day').format('YYYY-MM-DD HH:mm:ss');
const endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
query_1.salesTransactions(startDate, endDate)
    .then((result) => {
    console.log(result);
    const data = result;
    objectToExcel_1.exportToExcel(data)
        .then((workbook) => {
        console.log(workbook);
        workbook.xlsx
            .writeFile(`sales-report-${moment().format("YYYY-MM-DD")}.xlsx`)
            .then(() => {
            console.log("Writing file done");
        })
            .catch((error) => {
            console.log(error);
        });
    })
        .catch((error) => {
        console.log(error);
    });
})
    .catch((error) => {
    console.log(error);
});
