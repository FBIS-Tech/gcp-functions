'use strict'
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const getStudent = async (msisdn) => {
    try {
        const { data } = await axios.get(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/${msisdn}`,
            {
                headers: {
                    'X-Client-Key': process.env.X_CLIENT_KEY
                }
            }
        );

        return data;

    } catch(error) {
        console.error(error.message);
    }
}

const addStudent = async (msisdn) => {
    try {
        const { data } = await axios.post(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/cloud`,
            { msisdn },
            {
                headers: {
                    'X-Client-Key': process.env.X_CLIENT_KEY
                }
            }
        );

    } catch(error) {
        console.error(error.message);
    }
}

const addStudentToSubscription = async (values) => {
    try {
        const { subscriptionKeyword, studentId, duration } = values;
        const { data } = await axios.post(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/subscriptions/${subscriptionKeyword}/subscribe`,
            { studentId, duration },
            {
                headers: {
                    'X-Client-Key': process.env.X_CLIENT_KEY
                }
            }
        );

    } catch(error) {
        console.error(error.message);
    }
}

const updateStudentSubscription = async (subscriptionKeyword, studentId, values) => {
    try {
        const { data } = await axios.put(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/subscriptions/${subscriptionKeyword}/${studentId}`,
            { values },
            {
                headers: {
                    'X-Client-Key': process.env.X_CLIENT_KEY
                }
            }
        );

    } catch(error) {
        console.error(error.message);
    }
};

// const blockUserSubscription = async (subscriptionId) => {
//     return manageUserSubscriptionActiveStatus(false, subscriptionId)
// };

// const unblockUserSubscription = async (subscriptionId) => {
//     return manageUserSubscriptionActiveStatus(true, subscriptionId)
// };

// const manageUserSubscriptionActiveStatus = (newStatus, subscriptionId) => {
//     return new Promise((resolve, reject) => {
//         pool.query(`UPDATE user_subscriptions SET is_active=$1 WHERE subscription_id=$2  RETURNING *`,
//             [newStatus, subscriptionId],
//             (error, results) => {
//                 if(error) return reject(error);
//                 return resolve(results.rows);
//             }
//         );
//     });
// }

const deleteStudentSubscription = async (subscriptionKeyword, studentId) => {
    try {
        const { data } = await axios.delete(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/subscriptions/${subscriptionKeyword}/${studentId}`,
            {
                headers: {
                    'X-Client-Key': process.env.X_CLIENT_KEY
                }
            }
        );

    } catch(error) {
        console.error(error.message);
    }
}

module.exports = {
    getStudent,
    addStudent,
    addStudentToSubscription,
    updateStudentSubscription,
    // blockUserSubscription,
    // unblockUserSubscription,
    deleteStudentSubscription
}