"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTranscationReport = void 0;
const moment = require("moment");
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function salesTranscationReport(req, res) {
    console.log(req);
    const startDate = (req.params["start"]
        ? moment(req.params["start"])
        : moment().subtract(7, "days")).format("YYYY-MM-DD");
    const endDate = (req.params["end"] ? moment(req.params["end"]) : moment()).format("YYYY-MM-DD");
    try {
        const data = (await query_1.salesTransactions(startDate, endDate));
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
        res.setHeader("Content-Disposition", `attachment; filename="active-retailers-${startDate}-${endDate}.xlsx`);
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
exports.salesTranscationReport = salesTranscationReport;
