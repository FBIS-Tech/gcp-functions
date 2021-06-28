import { Request, Response } from 'express'
import * as moment from 'moment'
import * as excel from 'exceljs'
import { retailersStatus } from './query'
import { exportToExcel } from './objectToExcel'
import { SumVendRequest } from './types/VendRequest'


export async function activeRetailersStatus(req: Request, res: Response) {
    console.log(req)

    const startDate = (req.params['start'] ? moment(req.params['start'] ) : moment().subtract(7, 'days')).format('YYYY-MM-DD HH:mm:ss')
    const endDate = (req.params['end'] ? moment(req.params['end']) : moment()).format('YYYY-MM-DD HH:mm:ss')

    try {
        const data = await retailersStatus(startDate, endDate) as [SumVendRequest]
        console.log("Data: ", data)
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