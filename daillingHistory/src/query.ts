import { RowDataPacket } from 'mysql2';
import { db } from './db'
import { Student } from './types/Student'
export async function studentsList(studentIds?: string[]): Promise<Student[]> {
    return new Promise((resolve, reject) => {
        const selectStudentsQuery = `
            SELECT
            st.id,
            st.msisdn,
            st.first_name,
            st.last_name,
            st.email,
            st.gender,
            DATE(st.created_at) as date_joined,
            sa.name as state,
            COUNT(ss.id) as total_subs,
            COUNT(IF(DATE(ss.effective_time) <= CURRENT_DATE() AND (ss.expiry_time IS NULL OR DATE(ss.expiry_time) >= CURRENT_DATE()), 1, NULL)) as total_active_subs
            FROM students as st
            INNER JOIN student_subscriptions as ss
            ON st.id = ss.student_id
            INNER JOIN states as sa
            ON st.state_id = sa.id
            WHERE st.id IN (?)
            GROUP BY st.id
            `;

        db.query(selectStudentsQuery, [studentIds], (err2, result2) => {
            if (err2) {
                console.log("Error: ", err2)
                reject(err2)
            }
            const rows2 = <RowDataPacket[]>result2;

            const students = rows2?.map((row) => {
                const student = {
                    firstName: row.first_name,
                    lastName: row.last_name,
                    msisdn: row.msisdn,
                    email: row.email,
                    gender: row.gender,
                    state: row.state,
                    totalSubs: row.total_subs,
                    totalActiveSubs: row.total_active_subs,
                    dateJoined: row.date_joined
                };
                return student;
            });
            resolve(students);
        })
        // })
    })
}