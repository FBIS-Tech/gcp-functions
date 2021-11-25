import { Request, Response } from 'express'
import * as moment from 'moment'
import * as excel from 'exceljs'
import { processDownlines } from './query'
import { exportToExcel } from './objectToExcel'
import { SumVendRequest } from './types/VendRequest'


export async function activeRetailersStatus(req: Request, res: Response) {
    console.log("Start: ", req.query.start)
    console.log("End: ", req.query.end)

    const start = req.query.start as string
    const end = req.query.end as string

    const startDate = (start ? moment(start) : moment().subtract(6, 'days')).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const endDate = (end ? moment(end) : moment()).endOf('day').format('YYYY-MM-DD HH:mm:ss')

    try {
        const data = await processDownlines(startDate, endDate) as [SumVendRequest]
        console.log("Data Count: ", data.length)
        const dataSorted = data.sort((a, b) => {
            if (a.amount < b.amount) {
                return 1;
            }
            if (a.amount > b.amount) {
                return -1;
            }
            return 0;
        })
        const workbook = await exportToExcel(dataSorted) as excel.Workbook

        // // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="active-retailers-${startDate}-${endDate}.xlsx`
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