'use strict'
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const Pool = require('pg').Pool
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
})

const getUsers = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT id,first_name,last_name,email,msisdn,address,gender FROM users ORDER BY id ASC', (error, results) => {
            if (error) {
                throw reject(error)
            }
            return resolve(results.rows)
        })
    })

}

const getUser = async (msisdn) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id,first_name,last_name,email,msisdn,address,gender FROM users WHERE msisdn='${msisdn}' ORDER BY id ASC`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows)
        })
    })

}

const getSubscriptions = async (keyword) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id,name,duration,dnd,service_id,product_id FROM subscriptions WHERE keyword='${keyword}' ORDER BY id ASC`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows)
        })
    })

}

const addUser = async (msisdn) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO users (id,msisdn) VALUES ($1,$2) RETURNING *`, [uuidv4(), msisdn], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows)
        })
    })

}

const getRoles = async (name) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id,name FROM roles WHERE name='${name}' ORDER BY id ASC`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows)
        })
    })
}

const addUserRole = async (user, role,) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO users_roles (id,user_id,role_id) VALUES ($1,$2,$3) RETURNING *`, [uuidv4(), user, role], (error, results) => {
            if (error) {
                return reject(error)
            }
            return resolve(results.rows)
        })
    })
}

const addUserSubscription = async (values) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO user_subscriptions (
            id,
            user_id,
            subscription_id,
            effective_time,
            expiry_time,
            trace_unique_id,
            transaction_id,
            order_key,
            cycle_end_time,
            start_time,
            update_desc,
            update_reason,
            access_code) VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [uuidv4(),
            values.userId,
            values.subscriptionId,
            values.effectiveTime,
            values.expiryTime,
            values.traceUniqueId,
            values.transactionId,
            values.orderKey,
            values.cycleEndTime,
            values.startTime,
            values.updateDesc,
            values.updateReason,
            values.accessCode
            ], (error, results) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results.rows)
            })
    })
}



module.exports = {
    getUser,
    getUsers,
    addUser,
    addUserRole,
    addUserSubscription,
    getRoles, getSubscriptions
}