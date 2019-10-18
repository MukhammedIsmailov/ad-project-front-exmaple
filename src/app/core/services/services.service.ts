import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IService} from '../interfaces/service';
import {Observable} from 'rxjs';

@Injectable()
export class ServicesService {
  API_URL = environment.baseURL;
  API_SERVICES: string = '/services';
  API_DELETE_SERVICES: string = '/services/delete-service/';

  public servicesInfo: IService[] = [];
  public serviceFields: Array<any> = [];
  public subscriberFields: Array<any> = [];

  private authorization: any;

  constructor(
    private http: HttpClient,
  ) {
    this.authorization = localStorage.getItem('accessToken');
  }

  public deleteService(idService): Observable<object> {
    return this.http.delete(this.API_URL + this.API_DELETE_SERVICES + idService, {
      headers: {authorization: this.authorization},
    });
  }

  public addNewService(newService): Observable<object> {
    return this.http.post(this.API_URL + this.API_SERVICES, newService, {
      headers: {authorization: this.authorization},
    });
  }

  public getServicesInfo(): Observable<object> {
    return this.http.get(this.API_URL + this.API_SERVICES, {
      headers: {authorization: this.authorization},
    });
  }
}
