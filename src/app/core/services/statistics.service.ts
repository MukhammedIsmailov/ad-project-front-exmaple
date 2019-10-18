import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class StatisticsService {


	API_URL = environment.baseURL;
	API_ENDPOINT_COMMON: string = '/user/common-statistics';
	API_ENDPOINT_DELETE_SITE: string = '/user/delete-website?id=';
	API_ENDPOINT_NOTIFICATION: string = '/user/notification-statistics';
	API_ENDPOINT_WEBSITE: string = '/statistic/website';
	API_ENDPOINT_CHANGE_WEBSITE: string = '/user/change-website-information';
	API_FILTERS: string = '/filters';
	API_FILTERS_SAVE: string = '/filters/save';
	API_FILTERS_DELETE: string = '/filters';


	private authorization: any;

	constructor(
		private http: HttpClient,
	) {
		this.authorization = localStorage.getItem('accessToken');
	}

	public getTotalStatistics() {
		return this.http.get(this.API_URL + this.API_ENDPOINT_COMMON, {
				headers: { authorization: this.authorization },
			});
	}

	public deleteSite(id) {
		return this.http.delete(this.API_URL + this.API_ENDPOINT_DELETE_SITE + id, {
			headers: { authorization: this.authorization },
		});
	}

	public getNotificationStatistics(group, period) {
		const query =  `group=${group}&period=${period}`;
		return this.http.get(this.API_URL + this.API_ENDPOINT_NOTIFICATION + '?' + query, {
				headers: { authorization: this.authorization },
			});
	}

	public getSiteStatistics(siteID, period) {
		const query =  `period=${period}`;
		return this.http.get(this.API_URL + this.API_ENDPOINT_WEBSITE + '/' + siteID + '?' + query, {
			headers: { authorization: this.authorization },
		});
	}


	public updateWebsite(siteID, imageURL) {
		const query =  `id=${siteID}`;
		return this.http.post(
			this.API_URL + this.API_ENDPOINT_CHANGE_WEBSITE + '?' + query,
			{
				icon: imageURL
				},
			{
				headers: { authorization: this.authorization },
			});
	}

	public getFilters() {
		return this.http.get(this.API_URL + this.API_FILTERS, {
			headers: { authorization: this.authorization },
		});
	}

	public deleteFilter(id) {
		return this.http.delete(this.API_URL + this.API_FILTERS_DELETE + '/' + id, {
			headers: { authorization: this.authorization },
		});
	}

	public saveFilter(filter) {
		const body = filter;

		return this.http.post(
			this.API_URL + this.API_FILTERS_SAVE, body,
			{
				headers: { authorization: this.authorization },
			});
	}


}
