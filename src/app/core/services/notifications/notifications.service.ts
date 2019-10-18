import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {catchError} from "rxjs/operators";
import * as _ from 'underscore';

@Injectable()
export class NotificationsService {

	API_URL = environment.baseURL;
	API_ENDPOINT_NOTIFICATION: string = '/user/notifications';
	API_GET_NOTIFICATION_INFO: string = '/user/notification';
	API_GET_CAMPAIGNS: string = '/campaigns';

	private authorization: any;
	private notifications: any;

	constructor(
		private http: HttpClient,
	) {
		this.authorization = localStorage.getItem('accessToken');
	}

	public getNotifications() {
		return this.http.get(this.API_URL + this.API_ENDPOINT_NOTIFICATION, {
			headers: { authorization: this.authorization },
		});
	}

	public setLocalNotifications(notifications) {
		this.notifications = notifications;
	}

	public getLocalNotificationByID(id) {
		return _.findWhere(this.notifications, {_id: id});
	}

	public getLocalNotifications() {
		return this.notifications;
	}

	public getNotification(id) {
		const query = `id=${id}`;
		return this.http.get(this.API_URL + this.API_GET_NOTIFICATION_INFO + '?' + query, {
			headers: { authorization: this.authorization },
		});
	}

	public getCampaigns() {
		return this.http.get(this.API_URL + this.API_ENDPOINT_NOTIFICATION, {
			headers: { authorization: this.authorization },
		});
	}

	public getCampaignData(id) {
		const query = `id=${id}`;
		return this.http.get(this.API_URL + this.API_GET_CAMPAIGNS + '?' + query, {
			headers: { authorization: this.authorization },
		});
	}
}
