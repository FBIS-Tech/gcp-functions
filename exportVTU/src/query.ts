import * as  moment from "moment";
import { RowDataPacket } from "mysql2";
import { db } from "./db";
import { VTU } from "./types/VTU";

export async function fetchBatchVouchers(batchId: string, environment: string = "production") {
  console.log("batchId", batchId);
  return new Promise((resolve, reject) => {

    const key = environment === "production" ? process.env.PROD_ENCRYPTION_KEY : process.env.DEV_ENCRYPTION_KEY;
    const query = `
        SELECT id, serial_number, dealer_code, denomination, value_added_at, AES_DECRYPT(pin, "${key}") as pin
        FROM pins_storage
        WHERE batch_id = ${batchId}`;

    db.query(query, (err, result) => {
      if (err) {
        console.log("Error: ", err);
        reject(err);
      }

      const rows = <RowDataPacket[]>result;

      const requests = rows.map((row) => {
        const vtu: VTU = {
          id: row.id,
          serialNumber: row.serial_number,
          dealerCode: row.dealer_code,
          denomination: row.denomination,
          valueAddedAt: row.value_added_at,
          pin: row.pin,
        };
        return vtu;
      });

      const vtus = requests
      console.log("VTU List: ", vtus)
      resolve(vtus);
    });
  });
}
