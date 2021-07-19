import { Request, Response } from "express";
import * as moment from "moment";
import * as excel from "exceljs";
import { salesTransactions } from "./query";
import { exportToExcel } from "./objectToExcel";
import { SalesRequest } from "./types/SalesRequest";
import { promises } from "fs";
import { type } from "os";
import { TestReturn } from "./types/SalesRequest";

export async function salesTransactionReport(req: Request, res: Response) {
  console.log(req);

  const startDate = (
    req.params["start"]
      ? moment(req.params["start"])
      : moment().subtract(6, "days")
  )
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  const endDate = (req.params["end"] ? moment(req.params["end"]) : moment())
    .endOf("day")
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const listOfDates = splitDates(startDate, endDate);

    const data = await Promise.all(
      listOfDates.map((date) =>
        salesTransactions(
          date.startOf("day").format(),
          date.endOf("day").format()
        )
      )
    );

    const flattenedData = data.flat();

    console.log("Data: ", flattenedData);
    const dataSorted = flattenedData.sort((a, b) => a.amount - b.amount);
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

/**
 *
 * @param startDate Represents the start date for the report in "YYYY-MM-DD"
 * @param endDate Represents the end date for the report in "YYYY-MM-DD"
 */
function splitDates(startDate: string, endDate: string): Array<moment.Moment> {
  const formattedStart = moment(startDate, "YYYY-MM-DD");
  const formattedEnd = moment(endDate, "YYYY-MM-DD");

  const numberOfDays = moment
    .duration(formattedEnd.diff(formattedStart))
    .asDays();

  if (numberOfDays < 0) {
    throw Error("Invalid Date Range");
  }

  const listOfDates = new Array();

  for (let i = 0; i <= numberOfDays; i++) {
    let tempDate = moment(startDate, "YYYY-MM-DD").add(i, "days");
    listOfDates.push(tempDate);
  }

  return listOfDates;
}

// https://europe-west3-asterisk-ivr-293907.cloudfunctions.net/salesTransactionReport?start=2021-07-01&end=2021-07-02
