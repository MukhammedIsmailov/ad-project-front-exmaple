// TODO: change data type for rows
export interface ICampaign {
  _id: string;
  serviceID: string,
  serviceUrl: string,
  websiteID: string,
  websiteUrl: string,
  websiteIcon: string,
  date: string,
  subscribersArray: Array<any>,
  pushNotifications: Array<any>
  send: number,
  clickCount: number,
  deliveredCount: number,
  deliveryFailed: number,
  statusOfShipments: string,
  status: string
}

