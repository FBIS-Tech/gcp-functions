import * as dotenv from "dotenv";
dotenv.config();

import * as excel from 'exceljs'
import { retailersStatus } from './src/query'
import { exportToExcel } from './src/objectToExcel'

import * as moment from 'moment'
import { SumVendRequest } from "./src/types/VendRequest";

console.log("Hello world!")

const now = moment()

const startDate = now.subtract(7, 'days').format('YYYY-MM-DD')
const endDate = now.add(7, 'days').format('YYYY-MM-DD')

retailersStatus(startDate, endDate)
    .then(result => {
        console.log(result)

        const data = result as [SumVendRequest]
        const dataSorted = data.sort((a, b) => {
            if (a.amount < b.amount) {
                return 1;
            }
            if (a.amount > b.amount) {
                return -1;
            }
            return 0;
        })

        exportToExcel(dataSorted).then((workbook) => {
            console.log(workbook);

            (workbook as excel.Workbook).xlsx.writeFile(`retaileer-${moment().format('YYYY-MM-DD')}.xlsx`)
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