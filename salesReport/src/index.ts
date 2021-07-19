import { Request, Response } from "express";
import * as moment from "moment";
import * as excel from "exceljs";
import { salesTransactions } from "./query";
import { exportToExcel } from "./objectToExcel";
import { ChunkedDate } from "./types/ChunkedDate";
import e = require("express");

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
    const listOfDates = splitDatesInto(startDate, endDate, 6);

    const data = await Promise.all(
      listOfDates.map((date) => salesTransactions(date.start, date.end))
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
      `attachment; filename="sales-report-${startDate}-to-${endDate}.xlsx`
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
 * This function splits the report duration into days
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
    const tempDate = moment(startDate, "YYYY-MM-DD").add(i, "days");
    listOfDates.push(tempDate);
  }

  return listOfDates;
}

/**
 * This function splits the report duration into @param noOfHours hours
 *
 * @param startDate Represents the start date for the report in "YYYY-MM-DD"
 * @param endDate Represents the end date for the report in "YYYY-MM-DD"
 * @param noOfHours Represents the no of hours we want to split the report duration into
 */

function splitDatesInto(
  startDate: string,
  endDate: string,
  noOfHours: number
): Array<ChunkedDate> {
  const result = new Array<ChunkedDate>();

  const formattedStart = moment(startDate, "YYYY-MM-DD");
  const formattedEnd = moment(endDate, "YYYY-MM-DD");

  const totalHours = moment
    .duration(formattedEnd.diff(formattedStart))
    .asHours();

  const chunks = totalHours / noOfHours;

  let start = moment(startDate, "YYYY-MM-DD");

  for (let i = 1; i <= chunks; i++) {
    const end = moment(startDate, "YYYY-MM-DD")
      .add(noOfHours * i, "hours")
      .subtract(1, "milliseconds");
    result.push({ start: start.format(), end: end.format() });
    start = start.add(noOfHours, "hours");
  }

  return result;
}

// https://europe-west3-asterisk-ivr-293907.cloudfunctions.net/salesTransactionReport?start=2021-07-01&end=2021-07-02
