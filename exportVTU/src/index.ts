import { Request, Response } from 'express'
import * as excel from 'exceljs'
import { fetchBatchVouchers } from './query'
import { exportToExcel } from './objectToExcel'
import { VTU } from './types/VTU'

export async function exportVTU(req: Request, res: Response) {
    console.log(req);

    const batchId = req.query.batchId  as string;
    const environment = req.query.environment  as string;
    const dealerCode = req.query.tpCode  as string;
    const password = req.query.key  as string;
    console.log("BatchId: ", batchId);
    console.log("Key: ", password);
    console.log("Dealer Code: ", dealerCode);

    try {
        const data = await fetchBatchVouchers(batchId, environment)  as [VTU];
        console.log("Data: ", data);

        const workbook = (await exportToExcel(data)) as excel.Workbook;

        // res is a Stream object
        res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
        "Content-Disposition",
        `attachment; filename=TP${dealerCode}-batch${batchId}-voucher-pins.xlsx`
        );

        return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
