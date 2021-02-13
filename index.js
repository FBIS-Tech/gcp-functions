'use strict';

const moment = require('moment')
const parser = require('xml2json');
const { getUsers, getUser, getRoles, addUser, addUserRole, addUserSubscription, getSubscriptions } = require('./queries/queries')
const {
    DATASYNC_TYPE_ADD,
    DATASYNC_TYPE_DELETE,
    DATASYNC_TYPE_UPDATE,
    DATASYNC_TYPE_BLOCK,
    DATASYNC_TYPE_UNBLOCK,
} = require('./constants')

const DATE_FORMAT = 'YYYYMMddHHmmss'

const text = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                                          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
        <ns1:syncOrderRelation
                                        xmlns:ns1="http://www.csapi.org/schema/parlayx/data/sync/v1_0/local">
            <ns1:userID>
                <ID>8619800000001</ID>
                <type>0</type>
            </ns1:userID>
            <ns1:spID>001100</ns1:spID>
            <ns1:productID>1000000423</ns1:productID>
            <ns1:serviceID>0011002000001100</ns1:serviceID>
            <ns1:serviceList>0011002000001100</ns1:serviceList>
            <ns1:updateType>1</ns1:updateType>
            <ns1:updateTime>20130723082551</ns1:updateTime>
            <ns1:updateDesc>Addition</ns1:updateDesc>
            <ns1:effectiveTime>20130723082551</ns1:effectiveTime>
            <ns1:expiryTime>20130723082551</ns1:expiryTime>
            <ns1:extensionInfo>
                <item>
                    <key>accessCode</key>
                    <value>20086</value>
                </item>
                <item>
                    <key>operCode</key>
                    <value>zh_CN</value>
                </item>
                <item>
                    <key>chargeMode</key>
                    <value>0</value>
                </item>
                <item>
                    <key>MDSPSUBEXPMODE</key>
                    <value>1</value>
                </item>
                <item>
                    <key>objectType</key>
                    <value>1</value>
                </item>
                <item>
                    <key>Starttime</key>
                    <value>20130723082551</value>
                </item>
                <item>
                    <key>isFreePeriod</key>
                    <value>false</value>
                </item>
                <item>
                    <item>
                        <key>operatorID</key>
                        <value>26001</value>
                    </item>
                    <key>payType</key>
                    <value>0</value>
                </item>
                <item>
                    <key>transactionID</key>
                    <value>504016000001307231624304170004</value>
                </item>
                <item>
                    <key>orderKey</key>
                    <value>999000000000000194</value>
                </item>
                <item>
                    <key>keyword</key>
                    <value>BF1</value>
                </item>
                <item>
                    <key>cycleEndTime</key>
                    <value>20130723082551</value>
                </item>
                <item>
                    <key>durationOfGracePeriod</key>
                    <value>-1</value>
                </item>
                <item>
                    <key>serviceAvailability</key>
                    <value>0</value>
                </item>
                <item>
                    <key>durationOfSuspendPeriod</key>
                    <value>0</value>
                </item>
                <item>
                    <key>fee</key>
                    <value>0</value>
                </item>
                <item>
                    <key>servicePayType</key>
                    <value>0</value>
                </item>
                <item>
                    <key>cycleEndTime</key>
                    <value>20130723082551</value>
                </item>
                <item>
                    <key>channelID</key>
                    <value>1</value>
                </item>
                <item>
                    <key>TraceUniqueID</key>
                    <value>504016000001307231624304170005</value>
                </item>
                <item>
                    <key>rentSuccess</key>
                    <value>true</value>
                </item>
                <item>
                    <key>try</key>
                    <value>false</value>
                </item>
            </ns1:extensionInfo>
        </ns1:syncOrderRelation>
    </soapenv:Body>
</soapenv:Envelope>
`

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
        await datSync(message)
    } catch (e) {
        console.log("Error: ", e);
    }

};


const datSync = async (content) => {
    let cleanText = content.replace(/soapenv:/gi, "")
    cleanText = cleanText.replace(/ns1:/gi, '')

    let json = parser.toJson(cleanText);

    // //get json object
    let syncOrder = JSON.parse(json)["Envelope"]["Body"].syncOrderRelation
    let extensionInfo = syncOrder.extensionInfo.item
    let msisdn = syncOrder.userID.ID
    console.log(syncOrder, extensionInfo, msisdn)

    let subscriptinKeyword = extensionInfo.find(e => e.key === 'keyword').value
    let traceUniqueId = extensionInfo.find(e => e.key === 'TraceUniqueID').value
    let transactionId = extensionInfo.find(e => e.key === 'transactionID').value
    let orderKey = extensionInfo.find(e => e.key === 'orderKey').value
    let rentSuccess = extensionInfo.find(e => e.key === 'rentSuccess').value
    let cycleEndTime = extensionInfo.find(e => e.key === 'cycleEndTime').value
    let startTime = extensionInfo.find(e => e.key === 'Starttime').value
    let updateReason = extensionInfo.find(e => e.key === 'Starttime').value
    let accessCode = extensionInfo.find(e => e.key === 'accessCode').value
    console.log(subscriptinKeyword, traceUniqueId, transactionId, orderKey, rentSuccess, cycleEndTime, startTime)



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
    let subscriptions = await getSubscriptions(subscriptinKeyword)
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


const main = async () => {
    await datSync(text)
}
main()

// gcloud functions deploy pubsubMessage --trigger-topic billing-data-sync --runtime nodejs14

