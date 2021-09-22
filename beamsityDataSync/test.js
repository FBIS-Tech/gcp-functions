const constants = require("./constants");
const { dataSync } = require("./index");

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
`;

const DATE_FORMAT_REGEX = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;

const convertTimeStringToDate = (dateString) => {
  const dateArray = DATE_FORMAT_REGEX.exec(dateString);

  // If string isn't properly formed
  if (!dateArray) throw new Error(`Invalid date string: ${dateString}`);

  // Destructure component of string match
  const [_, year, month, day, hour, minute, second] = dateArray;
  console.log(year, month, day, hour, minute, second);

  // Add 1 to hour to offset conversion to GMT by ISOString
  const convertedDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`
  );

  try {
    convertedDate.toString();
  } catch (e) {
    console.log(e);
    throw new Error(`Invalid date: ${convertedDate}`);
  }

  var tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(convertedDate - tzoffset).toISOString();
};

const main = async () => {
  //   await dataSync(text);
  try {
    console.log(convertTimeStringToDate("20210915085557"));
  } catch (e) {
    console.log(e);
  }
};
main();

// gcloud functions deploy beamsityDataSync --region europe-west3 --trigger-topic billing-data-sync --runtime nodejs14
