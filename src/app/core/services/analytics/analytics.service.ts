import {Injectable} from '@angular/core';
import {IAnalyticsCategory} from "../../interfaces/analyticsCategory";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  API_URL = environment.baseURL;
  API_ANALYTICS_STATISTIC: string = '/statistic/analytics';

  private authorization: any;

  public analyticsInfo: IAnalyticsCategory[] = [];

  constructor(
    private http: HttpClient,
  ) {
    this.analyticsInfo = [
      {
        id: 11,
        name: 'Common',
        title: 'Common statistics'
      },
      {
        id: 22,
        name: 'Countries',
        title: 'Country statistics'
      }
    ];

    this.authorization = localStorage.getItem('accessToken');
  }

  public getAnalyticsStatistic(category, queryParams) {
    let query;
    if (category === 'Common') {
      const {group, period, serviceID} = queryParams;
      query = `group=${group}&period=${period}&category=${category}&serviceID=${serviceID}`;
    }
    if (category === 'Countries') {
      const {serviceID, date} = queryParams;
      query = `category=${category}&serviceID=${serviceID}&${date}`;
    }
    return this.http.get(this.API_URL + this.API_ANALYTICS_STATISTIC + '?' + query, {
      headers: {authorization: this.authorization},
    });
  }
}
