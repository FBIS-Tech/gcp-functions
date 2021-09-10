import moment = require('moment');
import { RowDataPacket } from 'mysql2';
import { db } from './db'
import { Downline } from './types/Downline'


export async function retailerList(): Promise<Downline[]> {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
        r.name,
        r.retail_code,
        r.msisdn,
        r.created_at,
        d.name as dealer_name,
        d.retail_code as dealer_code,
        w.available_balance as balance
        FROM retailers as r
        INNER JOIN dealers as d ON r.dealer_id = d.id
        INNER JOIN wallets as w ON r.user_id = w.user_id
        ORDER BY dealer_code, name ASC`

        db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err)
                reject(err)
            }

            const rows = <RowDataPacket[]>result;

            const requests = rows.map((row) => {
                const retailer: Downline = {
                    name: row.name,
                    retailCode: row.retail_code,
                    msisdn: row.msisdn,
                    dealerName: row.dealer_name,
                    dealerCode: row.dealer_code,
                    walletBalance: row.balance,
                    dateJoined: moment(row.created_at).format("YYYY-MM-DD")
                }

                return retailer
            })

            const retailersList = requests
            console.log("Retailer List: ", retailersList)
            resolve(retailersList)
        })
    })
}

export async function subDealerList(): Promise<Downline[]> {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
        s.name,
        s.retail_code,
        s.msisdn,
        s.created_at,
        d.name as dealer_name,
        d.retail_code as dealer_code,
        w.available_balance as balance
        FROM sub_dealers as s
        INNER JOIN dealers as d ON s.dealer_id = d.id
        INNER JOIN wallets as w ON s.user_id = w.user_id
        ORDER BY dealer_code, name ASC`

        db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err)
                reject(err)
            }

            const rows = <RowDataPacket[]>result;

            const requests = rows.map((row) => {
                const subDealer: Downline = {
                    name: row.name,
                    retailCode: row.retail_code,
                    msisdn: row.msisdn,
                    dealerName: row.dealer_name,
                    dealerCode: row.dealer_code,
                    walletBalance: row.balance,
                    dateJoined: moment(row.created_at).format("YYYY-MM-DD")
                }

                return subDealer
            })

            const subDealersList = requests
            console.log("Sub-dealer List: ", subDealersList)
            resolve(subDealersList)
        })
    })
}