import { Request, Response } from "express";
import * as moment from "moment";
import * as excel from "exceljs";
import { salesTransactions } from "./query";
import { exportToExcel } from "./objectToExcel";
import { SalesRequest } from "./types/SalesRequest";

export async function salesTransactionReport(req: Request, res: Response) {

  const start = req.query.start as string
  const end = req.query.end as string

  const startDate = (start ? moment(start) : moment().subtract(6, 'days')).startOf('day')
  const endDate = (end ? moment(end) : moment()).endOf('day')

  const startDatefmt = startDate.format('YYYY-MM-DD HH:mm:ss')
  const endDatefmt = endDate.format('YYYY-MM-DD HH:mm:ss')

  try {
    const data = await salesTransactions(startDatefmt, endDatefmt) as [SalesRequest];

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
    const workbook = (await exportToExcel(dataSorted)) as excel.Workbook;

    // // res is a Stream object
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-report-${startDate.format('YYYY-MM-DD')}-to-${endDate.format('YYYY-MM-DD')}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}


// https://europe-west3-asterisk-ivr-293907.cloudfunctions.net/salesTransactionReport?start=2021-07-01&end=2021-07-07