export interface IService {
  _id?: string;
  name: string;
  url: string;
  query?: string;
  subscriberFields?: object;
  notificationFields?: object;
}
