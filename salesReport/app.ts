import * as dotenv from "dotenv";
dotenv.config();

import * as excel from "exceljs";
import { salesTransactions } from "./src/query";
import { exportToExcel } from "./src/objectToExcel";

import * as moment from "moment";
import { SalesRequest } from "./src/types/SalesRequest";

console.log("Hello world!");

const startDate = moment("2021-07-01"); //.subtract(2, "days").startOf('day')
const endDate = moment("2021-07-31"); //.endOf('day').endOf('day')

const startDateFmt = startDate.format('YYYY-MM-DD HH:mm:ss')
const endDateFmt = endDate.format('YYYY-MM-DD HH:mm:ss')

salesTransactions(startDateFmt, endDateFmt)
  .then((result) => {

    // console.log(result.lenght());
    const data = result as [SalesRequest];

    exportToExcel(data)
      .then((workbook) => {
        // console.log(workbook);

        (workbook as excel.Workbook).xlsx
          .writeFile(`sales-report-${startDate.format('YYYY-MM-DD')}-to-${endDate.format('YYYY-MM-DD')}.xlsx`)
          .then(() => {
            console.log("Writing file done");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

//npx ts-node app.ts
//npm run build && npm run deploy --prefix functions/src/
//projects/asterisk-ivr-293907/locations/europe-west3/connectors/gcp-fucntoin-vpc-c
