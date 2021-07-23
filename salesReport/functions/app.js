"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const query_1 = require("./src/query");
const objectToExcel_1 = require("./src/objectToExcel");
const moment = require("moment");
console.log("Hello world!");
const startDate = moment().subtract(2, "days").startOf('day');
const endDate = moment().endOf('day').endOf('day');
const startDateFmt = startDate.format('YYYY-MM-DD HH:mm:ss');
const endDateFmt = endDate.format('YYYY-MM-DD HH:mm:ss');
query_1.salesTransactions(startDateFmt, endDateFmt)
    .then((result) => {
    const data = result;
    objectToExcel_1.exportToExcel(data)
        .then((workbook) => {
        workbook.xlsx
            .writeFile(`sales-report-${startDate.format('YYYY-MM-DD')}-to-${endDate.format('YYYY-MM-DD')}.xlsx`)
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
