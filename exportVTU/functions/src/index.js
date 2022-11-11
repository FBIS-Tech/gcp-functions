"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportVTU = void 0;
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function exportVTU(req, res) {
    console.log(req);
    const batchId = req.query.batchId;
    const environment = req.query.environment;
    const dealerCode = req.query.tpCode;
    const password = req.query.key;
    console.log("BatchId: ", batchId);
    console.log("Key: ", password);
    console.log("Dealer Code: ", dealerCode);
    try {
        const data = await query_1.fetchBatchVouchers(batchId, environment);
        console.log("Data: ", data);
        const workbook = (await objectToExcel_1.exportToExcel(data));
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=TP${dealerCode}-batch${batchId}-voucher-pins.xlsx`);
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
exports.exportVTU = exportVTU;
