import { type } from "os";

export interface SalesRequest {
  requestMSISDN: string;
  destinationMSISDN: string;
  retailCode: string;
  dealerCode: string;
  amount: number;
  dateCreated: string;
  productCode: string;
  channel: string;
}

export type TestReturn = (
  start: string,
  end: string
) => Promise<SalesRequest[]>;
