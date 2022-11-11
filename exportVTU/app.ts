import * as dotenv from "dotenv";
dotenv.config();

import * as excel from "exceljs";
import { fetchBatchVouchers } from "./src/query";
import { exportToExcel } from "./src/objectToExcel";

import * as moment from "moment";
import { VTU } from "./src/types/VTU";

console.log("Hello world!");

const batchId = Date.now().toString();
fetchBatchVouchers(batchId)
  .then((result) => {

    // console.log(result.lenght());
    const data = result as [VTU];

    exportToExcel(data)
      .then((workbook) => {
        // console.log(workbook);

        (workbook as excel.Workbook).xlsx
          .writeFile(`vtu-export-${moment().format('YYYY-MM-DD')}.xlsx`)
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
