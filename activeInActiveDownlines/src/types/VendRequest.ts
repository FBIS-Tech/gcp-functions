interface BasicVendRequest {
    requestMSISDN: string,
    retailCode: string,
    dealerCode: string
    amount: number,
    // date: string
}

export interface SumVendRequest extends BasicVendRequest {
    name: string,
}

export interface VendRequest extends BasicVendRequest {
    retailerName: string,
    subDealerName: string,
}