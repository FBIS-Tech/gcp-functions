"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const moment = require("moment");
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function helloWorld(req, res) {
    console.log(req);
    const now = moment();
    const startDate = moment(req.params.start) || now.subtract(7, 'days');
    const endDate = moment(req.params.end) || now;
    try {
        const data = await query_1.retailersStatus(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        const workbook = await objectToExcel_1.exportToExcel(data);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=" + "tutorials.xlsx");
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
exports.helloWorld = helloWorld;
