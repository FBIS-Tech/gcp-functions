"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTransactionReport = void 0;
const moment = require("moment");
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function salesTransactionReport(req, res) {
    console.log(req);
    const startDate = (req.params["start"]
        ? moment(req.params["start"])
        : moment().subtract(6, "days")).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = (req.params["end"] ? moment(req.params["end"]) : moment()).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    try {
        const data = await query_1.salesTransactions(startDate, endDate);
        console.log("Data: ", data);
        const dataSorted = data.sort((a, b) => {
            if (a.amount < b.amount) {
                return 1;
            }
            if (a.amount > b.amount) {
                return -1;
            }
            return 0;
        });
        const workbook = (await objectToExcel_1.exportToExcel(dataSorted));
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="sales-report-${startDate}-${endDate}.xlsx`);
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
exports.salesTransactionReport = salesTransactionReport;
