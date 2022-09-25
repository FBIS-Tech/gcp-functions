"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsList = void 0;
const db_1 = require("./db");
async function studentsList(schoolId) {
    return new Promise((resolve, reject) => {
        const selectSubscriptionsQuery = `
        SELECT
        id
        FROM
        subscriptions
        WHERE
        school_id LIKE (IF('${schoolId}' IS NULL, '%', '${schoolId}'))
        `;
        const subscriptionIds = db_1.db.query(selectSubscriptionsQuery, (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            return rows.map((row) => {
                return row.id;
            });
        });
        const selectStudentsQuery = `
        SELECT
        st.id,
        st.msisdn,
        st.first_name,
        st.last_name,
        st.email,
        st.gender,
        DATE(st.last_active) as last_active,
        DATE(st.created_at) as date_joined,
        sa.name as state,
        COUNT(ss.id) as total_subs,
        COUNT(IF(DATE(ss.effective_time) >= CURRENT_DATE() AND DATE(ss.expiry_time) >= CURRENT_DATE(), 1, NULL)) as total_active_subs
        FROM students as st
        INNER JOIN student_subscriptions as ss
        ON st.id = ss.student_id
        INNER JOIN states as sa
        ON st.state_id = sa.id
        WHERE ss.subscription_id IN (?)
        GROUP BY st.id
        `;
        db_1.db.query(selectStudentsQuery, [subscriptionIds], (err, result) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            const rows = result;
            const students = rows.map((row) => {
                const student = {
                    firstName: row.first_name,
                    lastName: row.last_name,
                    msisdn: row.msisdn,
                    email: row.email,
                    gender: row.gender,
                    lastActive: row.last_active,
                    state: row.state,
                    totalSubs: row.total_subs,
                    totalActiveSubs: row.total_active_subs,
                    dateJoined: row.date_joined
                };
                return student;
            });
            console.log("Students List: ", students);
            resolve(students);
        });
    });
}
exports.studentsList = studentsList;
