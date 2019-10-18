import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import * as _ from 'underscore';
import { Observable } from 'rxjs';

@Injectable()
export class CampaignsService {
  API_URL = environment.baseURL;
  API_CAMPAIGNS: string = '/campaigns';
  API_SEND_CAMPAIGN: string = '/campaigns/send-campaign';
  API_UPDATE_CAMPAIGN: string = '/campaigns/update-campaign/';
  API_DELETE_CAMPAIGN: string = '/campaigns/delete-campaign/';

  private authorization: any;
  private campaigns: any;

  constructor(
    private http: HttpClient,
  ) {
    this.authorization = localStorage.getItem('accessToken');
  }

  public getCampaignsData(): Observable<object> {
    return this.http.get(this.API_URL + this.API_CAMPAIGNS, {
      headers: {authorization: this.authorization},
    });
  }

  public setLocalCampaigns(campaigns: object): void {
    this.campaigns = campaigns;
  }

  public getLocalCampaignByID(id): object {
    return _.findWhere(this.campaigns, {_id: id});
  }

  public sendServiceCampaign(serviceCampaignData): Observable<object> {
    return this.http.post(this.API_URL + this.API_SEND_CAMPAIGN, serviceCampaignData, {
      headers: {authorization: this.authorization},
    });
  }

  public updateCampaign(idCampaign, updateCampaignData): Observable<object> {
    return this.http.put(this.API_URL + this.API_UPDATE_CAMPAIGN + idCampaign, updateCampaignData, {
      headers: {authorization: this.authorization},
    });
  }

  public deleteCampaign(idCampaign): Observable<object> {
    return this.http.delete(this.API_URL + this.API_DELETE_CAMPAIGN + idCampaign, {
      headers: {authorization: this.authorization},
    });
  }

}
