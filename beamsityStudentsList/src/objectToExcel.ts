import * as excel from 'exceljs'
import { Student } from './types/Student';


export async function exportToExcel(data: Student[]) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new excel.Workbook();
            workbook.creator = 'Beamsity';
            workbook.lastModifiedBy = 'Beamsity';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
            const worksheet = workbook.addWorksheet("Students_List");

            worksheet.columns = [
                { header: "First Name", key: "firstName", width: 15 },
                { header: "Last Name", key: "lastName", width: 15 },
                { header: "Phone Number", key: "msisdn", width: 10 },
                { header: "Email", key: "email", width: 15 },
                { header: "Gender", key: "gender", width: 5 },
                { header: "State", key: "state", width: 10 },
                { header: "Total Subs", key: "totalSubs", width: 5 },
                { header: "Active Subs", key: "totalActiveSubs", width: 5 },
                { header: "Date Joined", key: "dateJoined", width: 10 },
            ];

            data.forEach((element, idx) => {
                worksheet.insertRow(idx + 2, {
                    firstName: element.firstName,
                    lastName: element.lastName,
                    msisdn: element.msisdn,
                    email: element.email,
                    gender: element.gender,
                    state: element.state,
                    totalSubs: element.totalSubs,
                    totalActiveSubs: element.totalActiveSubs,
                    dateJoined: element.dateJoined
                });
            });
            resolve(workbook)

        } catch (error) {
            reject(error)
        }
    })
}