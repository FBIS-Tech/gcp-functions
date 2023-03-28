import * as dotenv from "dotenv";
dotenv.config();

import * as excel from 'exceljs'
import { studentsList } from './src/query'
import { exportToExcel } from './src/objectToExcel'

import { Student } from "./src/types/Student";

studentsList()
    .then(result => {
        console.log(result)

        const data = result as [Student]

        exportToExcel(data).then((workbook) => {
            console.log(workbook);

            (workbook as excel.Workbook).xlsx.writeFile(`studentDiallingList.xlsx`)
                .then(() => {
                    console.log('Writing file done')
                }).catch(error => { console.log(error) })

        }).catch(error => { console.log(error) })


    }).catch(error => {
        console.log(error)
    })

//npx ts-node app.ts
//
//npm run build && npm run deploy --prefix functions/src/ 
//projects/asterisk-ivr-293907/locations/europe-west3/connectors/gcp-fucntoin-vpc-c