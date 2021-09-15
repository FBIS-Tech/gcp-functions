import { RowDataPacket } from 'mysql2';
import { db } from './db'
import { VendRequest, SumVendRequest } from './types/VendRequest'
import { Reducer } from 'declarative-js'

function objectMap(object: any, mapFn: any) {
    return Object.keys(object).reduce(function (result: any, key: any) {
        result[key] = mapFn(object[key])
        return result
    }, {})
}

function mapVendRequests(row: RowDataPacket) {
    const vendRequest: VendRequest = {
        retailerName: row.retailerName,
        subDealerName: row.subDealerName,
        requestMSISDN: row.request_msisdn,
        retailCode: row.retail_code,
        dealerCode: row.dealer_code,
        amount: row.amount,
        // date: row.created_date
    }

    return vendRequest
}


export async function retailersStatus(start: string, end: string) {
    console.log("Using Date: ", start, end);
    
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
        mvr.id,
        mvr.request_msisdn,
        mvr.retail_code,
        mvr.dealer_code,
        mvr.amount,
        r.name AS retailerName
        s.name AS subdealerName
        FROM mtn_vend_requests as mvr 
        INNER JOIN retailers as r ON r.retail_code = mvr.retail_code
        INNER JOIN sub_dealers as s ON s.retail_code = mvr.retail_code
        WHERE (mvr.created_at BETWEEN '${start}' AND '${end}')`

        console.log("Query: ", query)

        db.query(query, (err, result) => {
            if (err) {
                console.log("Error: ", err)
                reject(err)
            }

            const rows = <RowDataPacket[]>result;

            const groupedRequests = rows
                .map(mapVendRequests)
                .reduce(Reducer.groupBy('retailCode'), Reducer.Map())
                .toObject();

            const newObject = objectMap(groupedRequests, (values: [VendRequest]) => {
                const total = values
                    .map(v => v.amount)
                    .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue));

                const sum: SumVendRequest = {
                    name: values[0].retailerName ?? values[0].subDealerName,
                    requestMSISDN: values[0].requestMSISDN,
                    retailCode: values[0].retailCode,
                    dealerCode: values[0].dealerCode,
                    amount: Number(total),
                }
                
                return sum
            })

            const downlineList = Object.keys(newObject).map(key => newObject[key])
            console.log("Downline List Count: ", downlineList.length)
            resolve(downlineList)
        })
    })
}