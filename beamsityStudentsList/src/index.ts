import { Request, Response } from 'express'
import * as excel from 'exceljs'
import { studentsList } from './query'
import { exportToExcel } from './objectToExcel'
import { Student } from './types/Student'

export async function studentsRecord(req: Request, res: Response) {
    const schoolId = req.query.schoolId as string ?? null

    try {
        const studentsListPromise: Promise<Student[]> = studentsList(schoolId);

        const students = await studentsListPromise
        const workbook = await exportToExcel(students) as excel.Workbook

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