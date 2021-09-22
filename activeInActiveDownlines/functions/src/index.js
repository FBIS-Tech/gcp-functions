"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeRetailersStatus = void 0;
const moment = require("moment");
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function activeRetailersStatus(req, res) {
    console.log("Start: ", req.query.start);
    console.log("End: ", req.query.end);
    const start = req.query.start;
    const end = req.query.end;
    const startDate = (start ? moment(start) : moment().subtract(6, 'days')).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = (end ? moment(end) : moment()).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    try {
        const data = await query_1.processDownlines(startDate, endDate);
        console.log("Data Count: ", data.length);
        const dataSorted = data.sort((a, b) => {
            if (a.amount < b.amount) {
                return 1;
            }
            if (a.amount > b.amount) {
                return -1;
            }
            return 0;
        });
        const workbook = await objectToExcel_1.exportToExcel(dataSorted);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="active-retailers-${startDate}-${endDate}.xlsx`);
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
exports.activeRetailersStatus = activeRetailersStatus;
