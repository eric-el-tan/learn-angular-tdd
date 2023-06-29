// from prototype page 'Budget Dashboard-22'
export interface Waiver {
    waiverPeriods: WaiverPeriod[];
    comment: string;
}

export interface WaiverPeriod {
    year: number;
    amount: number;
}