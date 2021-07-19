import { type } from "os";

export interface SalesRequest {
  requestMSISDN: string;
  destinationMSISDN: string;
  retailCode: string;
  dealerCode: string;
  dealerName: string;
  territory: string;
  amount: number;
  dateCreated: string;
  productCode: string;
  channel: string;
}
