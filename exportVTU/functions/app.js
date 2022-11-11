"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const query_1 = require("./src/query");
const objectToExcel_1 = require("./src/objectToExcel");
const moment = require("moment");
console.log("Hello world!");
const batchId = "1";
query_1.fetchBatchVouchers(batchId)
    .then((result) => {
    const data = result;
    objectToExcel_1.exportToExcel(data)
        .then((workbook) => {
        workbook.xlsx
            .writeFile(`vtu-export-${moment().format('YYYY-MM-DD')}.xlsx`)
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
