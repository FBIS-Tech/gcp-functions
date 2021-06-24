"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeRetailersStatus = void 0;
const moment = require("moment");
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function activeRetailersStatus(req, res) {
    console.log(req);
    const now = moment();
    const startDate = moment(req.params.start) || now.subtract(7, 'days');
    const endDate = moment(req.params.end) || now;
    try {
        const data = await query_1.retailersStatus(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
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
        res.setHeader("Content-Disposition", `attachment; filename=" + "retaileer-${moment().format('YYYY-MM-DD')}.xlsx`);
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
