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

