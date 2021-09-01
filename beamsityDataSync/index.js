"use strict";

const moment = require("moment");
const parser = require("xml2json");
const {
  getStudent,
  addStudent,
  addStudentToSubscription,
  updateStudentSubscription,
  // blockUserSubscription,
  // unblockUserSubscription,
  deleteStudentSubscription,
} = require("./queries/queries");

const {
  DATASYNC_TYPE_ADD,
  DATASYNC_TYPE_DELETE,
  DATASYNC_TYPE_UPDATE,
  DATASYNC_TYPE_BLOCK,
  DATASYNC_TYPE_UNBLOCK,
} = require("./constants");

const DATE_FORMAT = "YYYYMMddHHmmss";

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.beamsityDataSync = async (event, context) => {
  try {
    const message = Buffer.from(event.data, "base64").toString();
    console.log(message);
    await dataSync(message);
  } catch (e) {
    console.log("Error: ", e);
  }
};

const dataSync = async (content) => {
  let cleanText = content.replace(/soapenv:/gi, "");
  cleanText = cleanText.replace(/ns1:/gi, "");

  let json = parser.toJson(cleanText);

  // //get json object
  let syncOrder = JSON.parse(json)["Envelope"]["Body"].syncOrderRelation;
  let extensionInfo = syncOrder.extensionInfo.item;
  let msisdn = syncOrder.userID.ID;

  console.log(syncOrder, extensionInfo, msisdn);

  // let subscriptionKeyword = extensionInfo.find(e => e.key === 'keyword').value
  let subscriptionKeyword = extensionInfo.find((e) => e.key === "keyword")?.value;
  let traceUniqueId = extensionInfo.find((e) => e.key === "TraceUniqueID")?.value;
  let transactionId = extensionInfo.find((e) => e.key === "transactionID")?.value;
  let orderKey = extensionInfo.find((e) => e.key === "orderKey")?.value;
  let rentSuccess = extensionInfo.find((e) => e.key === "rentSuccess")?.value;
  let cycleEndTime = extensionInfo.find((e) => e.key === "cycleEndTime")?.value;
  let startTime = extensionInfo.find((e) => e.key === "Starttime")?.value;
  let updateReason = extensionInfo.find((e) => e.key === "Starttime")?.value;
  let accessCode = extensionInfo.find((e) => e.key === "accessCode")?.value;

  console.log(
    syncOrder.productID,
    traceUniqueId,
    transactionId,
    orderKey,
    rentSuccess,
    cycleEndTime,
    startTime
  );

  const productId = syncOrder.productID;

  let student;
  // //get the first user matching msisdn
  let data = await getStudent(msisdn);
  console.log(`Student Data: ${data}`);
  student = data.data;
  console.log("Student", student);

  if (!student) {
    //user does not exist, create user
    data = await addStudent(msisdn);
    console.log(`Student Data: ${data}`);
    student = data.data;
    console.log("Student: ", student);
  }

  //Use: syncOrder.updateType and
  switch (syncOrder.updateType) {
    case DATASYNC_TYPE_ADD:
      //create a new subscription
      let newValues = {
        studentId: student.id,
        subscriptionKeyword,
        duration: moment(syncOrder.effectiveTime, DATE_FORMAT),
      };

      console.log(newValues);
      let studentSub = await addStudentToSubscription(newValues);
      console.log("Student sub addedd successfully: ", studentSub);
      break;
    case DATASYNC_TYPE_UPDATE:
      //update existing subscriptin
      let updateValues = {
        effectiveTime: moment(syncOrder.effectiveTime, DATE_FORMAT),
        expiryTime: moment(syncOrder.expiryTime, DATE_FORMAT),
        cycleEndTime: moment(cycleEndTime, DATE_FORMAT),
        startTime: moment(startTime, DATE_FORMAT),
        updateDesc: syncOrder.updateDesc,
        traceUniqueId,
        transactionId,
        orderKey,
        updateReason,
      };

      let studentUpdateSub = await updateStudentSubscription(
        subscriptionKeyword,
        student.id,
        updateValues
      );
      console.log(studentUpdateSub);
      console.log(
        `Student sub with subscription keyword ${subscriptionKeyword} updated successfully: `
      );
      break;
    case DATASYNC_TYPE_DELETE:
      //Delete existing subscription
      let studentDeleteSub = await deleteStudentSubscription(subscriptionKeyword, student.id);
      console.log(studentDeleteSub);
      console.log(
        `Student sub with subscription keyword ${subscriptionKeyword} deleted successfully: `
      );
      break;
    // case DATASYNC_TYPE_BLOCK:
    //     //Block existing subscription
    //     let userBlockSub = await blockUserSubscription(subscription.id);
    //     console.log(userBlockSub);
    //     console.log(`User sub with id ${subscription.id} blocked successfully: `);
    //     break;
    // case DATASYNC_TYPE_UNBLOCK:
    //     //Unblock existing subcripotion
    //     let userUnblockSub = await unblockUserSubscription(subscription.id);
    //     console.log(userUnblockSub);
    //     console.log(`User sub with id ${subscription.id} unblocked successfully: `);
    //     break;
  }
};

// module.exports = {
//     dataSync
// }
