"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesTransactionReport = void 0;
const moment = require("moment");
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function salesTransactionReport(req, res) {
    console.log(req);
    const startDate = (req.params["start"]
        ? moment(req.params["start"])
        : moment().subtract(6, "days"))
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    const endDate = (req.params["end"] ? moment(req.params["end"]) : moment())
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    try {
        const listOfDates = splitDatesInto(startDate, endDate, 6);
        const data = await Promise.all(listOfDates.map((date) => query_1.salesTransactions(date.start, date.end)));
        const flattenedData = data.flat();
        console.log("Data: ", flattenedData);
        const dataSorted = flattenedData.sort((a, b) => a.amount - b.amount);
        const workbook = (await objectToExcel_1.exportToExcel(dataSorted));
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="sales-report-${startDate}-to-${endDate}.xlsx`);
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
exports.salesTransactionReport = salesTransactionReport;
function splitDates(startDate, endDate) {
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
function splitDatesInto(startDate, endDate, noOfHours) {
    const result = new Array();
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
