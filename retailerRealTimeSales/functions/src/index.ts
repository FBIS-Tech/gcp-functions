import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as moment from "moment"

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp()
const db = admin.firestore()

export const retailerSalesRealTimeTracker = functions
    .region("europe-west3")
    .firestore
    .document("sales/retailers/{retailCode}/{docId}")
    .onWrite(async (change, context) => {
        console.log("Change: ", change)

        const retailCode = context.params.retailCode
        const dealerCode = retailCode.substr(0, 2)

        const currentData = change.after.data()
        const previousData = change.before.data()

        if (currentData) {
            const subDealerCode = previousData ?
                previousData.subDealerCode :
                currentData.subDealerCode

            let amount = currentData.amount

            if (previousData) {
                amount = amount - previousData.amount
            }

            // update dealer sales
            const day = moment().format("YYYYMMDD").toString()
            const dealerDailySalesRef = db.doc(`sales/dealers/${dealerCode}/${day}`)

            const dealerDailySales = await dealerDailySalesRef.get()

            if (dealerDailySales.exists) {
                const udpateResponse = await dealerDailySalesRef.update({
                    amount: admin.firestore.FieldValue.increment(amount),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                })
                console.log(`Dealer Sales Updated: ${udpateResponse}`)
            } else {
                const createResponse = await dealerDailySalesRef.set({
                    amount: amount,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                })
                console.log(`Dealer Sales Create: ${createResponse}`)
            }



            if (subDealerCode) {
                // update subDealer sales
                const subDealerDailysalesRef = db.doc(`sales/sub-dealers/${subDealerCode}/${day}`)
                const subDealerDailysales = await subDealerDailysalesRef.get()

                if (subDealerDailysales.exists) {
                    const subDealerUpdateResponse = await subDealerDailysalesRef.update({
                        amount: admin.firestore.FieldValue.increment(amount),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    })

                    console.log(`Sub Dealer Updated: ${subDealerUpdateResponse}`)
                } else {
                    const createDealerUpdateResponse = await subDealerDailysalesRef.update({
                        amount: amount,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    })

                    console.log(`Sub Dealer Created: ${createDealerUpdateResponse}`)
                }
            }
        }
    })
