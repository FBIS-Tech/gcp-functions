import * as dotenv from "dotenv";
dotenv.config();

import * as excel from 'exceljs'
import { retailerList } from './src/query'
import { exportToExcel } from './src/objectToExcel'

import { Retailer } from "./src/types/Retailer";

retailerList()
    .then(result => {
        console.log(result)

        const data = result as [Retailer]

        exportToExcel(data).then((workbook) => {
            console.log(workbook);

            (workbook as excel.Workbook).xlsx.writeFile(`retailer-list.xlsx`)
                .then(() => {
                    console.log('Writing file done')
                }).catch(error => { console.log(error) })

        }).catch(error => { console.log(error) })


    }).catch(error => {
        console.log(error)
    })

//npx ts-node app.ts
//npm run deploy --prefix functions/src/ 
//projects/asterisk-ivr-293907/locations/europe-west3/connectors/gcp-fucntoin-vpc-c