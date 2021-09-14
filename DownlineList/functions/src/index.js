"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retailersRecord = void 0;
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function retailersRecord(req, res) {
    console.log(req);
    try {
        const data = await query_1.retailerList();
        console.log("Data: ", data);
        const workbook = await objectToExcel_1.exportToExcel(data);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="retailers-list.xlsx`);
        return workbook.xlsx.write(res)
            .then(() => {
            res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
exports.retailersRecord = retailersRecord;
