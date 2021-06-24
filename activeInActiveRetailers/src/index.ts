import { Request, Response } from 'express'
import * as moment from 'moment'
import * as excel from 'exceljs'
import { retailersStatus } from './query'
import { exportToExcel } from './objectToExcel'
import { VendRequest } from './types/VendRequest'


export async function activeRetailersStatus(req: Request, res: Response) {
    console.log(req)
    const now = moment()

    const startDate = moment(req.params.start) || now.subtract(7, 'days')
    const endDate = moment(req.params.end) || now
    try {
        const data = await retailersStatus(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')) as [VendRequest]
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
            `attachment; filename=" + "retaileer-${moment().format('YYYY-MM-DD')}.xlsx`
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