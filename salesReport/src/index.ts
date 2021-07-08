import { Request, Response } from "express";
import * as moment from "moment";
import * as excel from "exceljs";
import { salesTransactions } from "./query";
import { exportToExcel } from "./objectToExcel";
import { SalesRequest } from "./types/SalesRequest";

export async function salesTranscationReport(req: Request, res: Response) {
  console.log(req);

  const startDate = (
    req.params["start"]
      ? moment(req.params["start"])
      : moment().subtract(7, "days")
  ).startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endDate = (
    req.params["end"] ? moment(req.params["end"]) : moment()
  ).endOf('day').format('YYYY-MM-DD HH:mm:ss')

  try {
    const data = (await salesTransactions(startDate, endDate)) as [
      SalesRequest
    ];
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
      `attachment; filename="sales-report-${startDate}-${endDate}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}
