'use strict'
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const getStudent = async (msisdn) => {
    try {
        const response = await axios.get(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/${msisdn}`,
            {
                headers: {
                    'X-Client-Key': process.env.X_CLIENT_KEY
                }
            }
        );

        console.log(`Response: ${response}`);
        return response.data;

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
        const { productId, studentId, duration } = values;
        const { data } = await axios.post(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/subscriptions/${productId}/subscribe`,
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

const updateStudentSubscription = async (productId, studentId, values) => {
    try {
        const { data } = await axios.put(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/subscriptions/${productId}/${studentId}`,
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

const deleteStudentSubscription = async (productId, $studendId) => {
    try {
        const { data } = await axios.delete(
            `${process.env.MAIN_APP_BASE_URL}/api/v1/students/subscriptions/${productId}/${studentId}`,
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