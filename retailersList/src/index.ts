import { Request, Response } from 'express'
import * as excel from 'exceljs'
import { retailerList } from './query'
import { exportToExcel } from './objectToExcel'
import { Retailer } from './types/Retailer'


export async function retailersRecord(req: Request, res: Response) {
    console.log(req)

    try {
        const data = await retailerList() as [Retailer]
        console.log("Data: ", data)
        const workbook = await exportToExcel(data) as excel.Workbook

        // // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="retailers-list.xlsx`
        );

        return workbook.xlsx.write(res)
            .then(() => {
                res.status(200).end();
            });

    } catch (err) {
        res.status(500)
        res.send(err)
    }
}