export interface VendRequest {
    name: string,
    requestMSISDN: string,
    retailCode: string,
    dealerCode: string
    amount: number,
    // date: string
}

export interface SumVendRequest extends VendRequest { }