"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const query_1 = require("./src/query");
const moment = require("moment");
console.log("Hello world!");
try {
    const now = moment();
    const startDate = now.subtract(7, 'days').format('YYYY-MM-DD');
    const endDate = now.add(7, 'days').format('YYYY-MM-DD');
    query_1.retailersStatus(startDate, endDate)
        .then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
}
catch (error) {
    console.log(error);
}
