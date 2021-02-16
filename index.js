'use strict';

const moment = require('moment')
const parser = require('xml2json');
const { getUser, getRoles, addUser, addUserRole, addUserSubscription, getSubscriptions } = require('./queries/queries')
const {
    DATASYNC_TYPE_ADD,
    DATASYNC_TYPE_DELETE,
    DATASYNC_TYPE_UPDATE,
    DATASYNC_TYPE_BLOCK,
    DATASYNC_TYPE_UNBLOCK,
} = require('./constants')

const DATE_FORMAT = 'YYYYMMddHHmmss'


/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.pubsubMessage = async (event, context) => {
    try {
        const message = Buffer.from(event.data, 'base64').toString()
        console.log(message);
        await dataSync(message)
    } catch (e) {
        console.log("Error: ", e);
    }

};


const dataSync = async (content) => {
    let cleanText = content.replace(/soapenv:/gi, "")
    cleanText = cleanText.replace(/ns1:/gi, '')

    let json = parser.toJson(cleanText);

    // //get json object
    let syncOrder = JSON.parse(json)["Envelope"]["Body"].syncOrderRelation
    let extensionInfo = syncOrder.extensionInfo.item
    let msisdn = syncOrder.userID.ID
    console.log(syncOrder, extensionInfo, msisdn)

    // let subscriptionKeyword = extensionInfo.find(e => e.key === 'keyword').value
    let traceUniqueId = extensionInfo.find(e => e.key === 'TraceUniqueID').value
    let transactionId = extensionInfo.find(e => e.key === 'transactionID').value
    let orderKey = extensionInfo.find(e => e.key === 'orderKey').value
    let rentSuccess = extensionInfo.find(e => e.key === 'rentSuccess').value
    let cycleEndTime = extensionInfo.find(e => e.key === 'cycleEndTime').value
    let startTime = extensionInfo.find(e => e.key === 'Starttime').value
    let updateReason = extensionInfo.find(e => e.key === 'Starttime').value
    let accessCode = extensionInfo.find(e => e.key === 'accessCode').value
    console.log(syncOrder.productID, traceUniqueId, transactionId, orderKey, rentSuccess, cycleEndTime, startTime)



    // //get the first user matching msisdn
    let users = await getUser(msisdn)
    let user = users[0]
    console.log("user", user)

    if (!user) {
        //user does not exist, create user and add student role
        let [users, roles] = await Promise.all([addUser(msisdn), getRoles('student')])
        user = users[0]
        let studentRole = roles[0]
        console.log("User: ", user)
        console.log("Role: ", studentRole)
        await addUserRole(user.id, studentRole.id)
    }

    //find the given subscription and rentSuccess internslly
    let subscriptions = await getSubscriptions(syncOrder.productID)
    let subscription = subscriptions[0]
    console.log("Subscription: ", subscription)


    //Use: syncOrder.updateType and 
    switch (syncOrder.updateType) {
        case DATASYNC_TYPE_ADD:
            //create a new subscription
            let newValues = {
                userId: user.id,
                subscriptionId: subscription.id,
                effectiveTime: moment(syncOrder.effectiveTime, DATE_FORMAT),
                expiryTime: moment(syncOrder.expiryTime, DATE_FORMAT),
                traceUniqueId: traceUniqueId,
                transactionId: transactionId,
                orderKey: orderKey,
                cycleEndTime: moment(cycleEndTime, DATE_FORMAT),
                startTime: moment(startTime, DATE_FORMAT),
                updateDesc: syncOrder.updateDesc,
                updateReason: updateReason,
                accessCode: accessCode,
                active: true,
                extension: subscription.short_code
            }

            console.log(newValues)
            let userSub = await addUserSubscription(newValues)
            console.log("User sub addedd successfully: ", userSub)
            break
        case DATASYNC_TYPE_UPDATE:
            //update existing subscriptin
            break
        case DATASYNC_TYPE_DELETE:
            //Delete existing subscription
            break
        case DATASYNC_TYPE_BLOCK:
            //Block existing subscription
            break
        case DATASYNC_TYPE_BLOCK:
            //Unblock existing subcripotion
            break
    }

}

// module.exports = {
//     dataSync
// }