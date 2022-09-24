import { Request, Response } from 'express'
import * as excel from 'exceljs'
import { studentsList } from './query'
import { exportToExcel } from './objectToExcel'
import { Student } from './types/Student'

export async function studentsRecord(req: Request, res: Response) {
    console.log(req)

    try {
        const studentsListPromise: Promise<Student[]> = studentsList();

        const [students] = await studentsListPromise
        const data = [students]
        console.log("Data: ", data)
        const workbook = await exportToExcel(data) as excel.Workbook

        // // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="students-list.xlsx`
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