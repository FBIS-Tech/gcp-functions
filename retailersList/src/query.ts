import { RowDataPacket } from 'mysql2';
import { db } from './db'
import { Retailer } from './types/Retailer'


export async function retailerList() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
        retailers.*,
        dealers.name as dealer_name,
        wallets.available_balance
        FROM retailers
        INNER JOIN dealers ON retailers.dealer_id = dealers.id
        INNER JOIN wallets ON retailers.user_id = wallets.user_id
        ORDER BY name ASC
        `

        db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err)
                reject(err)
            }

            const rows = <RowDataPacket[]>result;

            const requests = rows.map((row) => {
                const Retailer: Retailer = {
                    name: row.name,
                    retailCode: row.retail_code,
                    msisdn: row.msisdn,
                    dealer: row.dealer_name,
                    ussd: row.ussd,
                    walletBalance: row.wallet_balance,
                    dateJoined: row.created_at
                }
                
                return Retailer
            })

            const retailersList = requests
            console.log("Retailer List: ", retailersList)
            resolve(retailersList)
        })
    })
}