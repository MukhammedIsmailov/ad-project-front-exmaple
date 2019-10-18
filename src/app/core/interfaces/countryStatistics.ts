// TODO: change data type for rows
export interface ICountryStatistic {
  _id?: string;
  ISO2: string;
  country: string;
  countryFlag?: string;
  sent: number;
  delivered: number;
  percentageDelivered?: number;
  clicks: number;
  percentageClicks?: number;
  listNumber?: number;
}

