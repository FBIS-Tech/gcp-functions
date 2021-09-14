"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const query_1 = require("./src/query");
const objectToExcel_1 = require("./src/objectToExcel");
query_1.retailerList()
    .then(result => {
    console.log(result);
    const data = result;
    objectToExcel_1.exportToExcel(data).then((workbook) => {
        console.log(workbook);
        workbook.xlsx.writeFile(`retailer-list.xlsx`)
            .then(() => {
            console.log('Writing file done');
        }).catch(error => { console.log(error); });
    }).catch(error => { console.log(error); });
}).catch(error => {
    console.log(error);
});
