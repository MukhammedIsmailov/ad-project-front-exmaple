import {BehaviorSubject, Observable, Subject, from, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UtilsService} from './utils.service';
import {catchError} from 'rxjs/operators';
import {TokenStorage} from '../auth/token-storage.service';
import {environment} from "../../../environments/environment";

@Injectable()
export class UserService {

	//TODO config back end and continue
	API_URL = environment.baseURL;
	API_ENDPOINT: string = '/user/profile';
	API_UPLOAD: string = '/upload';
	API_CHANGE_PASSWORD: string = '/user/change-password';
	API_SAVE_SITE: string = '/user/save-website';
	API_GET_WEBSITE_INTEGRATION_INFO: string = '/user/website-integration-info';
	API_DELETE_WEBSITE_SUBSCRIBER: string = '/user/delete-subscriber';
	API_SEND_PUSH: string = '/send-push';
	API_CREATE_AUTOMATION: string = '/automation';
	public user = new BehaviorSubject<any>({});

	constructor(
		private http: HttpClient,
		private utils: UtilsService,
		private tokenStorage: TokenStorage,
		private util: UtilsService
	) {
	}

	public setUser(user) {
		this.user.next(user);
	}

	public changeUserInfo(user) {
		const query = "id=" + this.tokenStorage.getUserID().slice(1, -1);
		const body = user;
		return this.http
			.post(this.API_URL + this.API_ENDPOINT + '?' + query, body).pipe(catchError(this.handleError('forgot-password', [])))
	}

	public getUserInfo() {
		const query = "id=" + this.tokenStorage.getUserID().slice(1, -1);
		const options = this.utils.getHTTPHeader();
		return this.http
			.get(this.API_URL + this.API_ENDPOINT + '?' + query, {headers: options}).pipe(catchError(this.handleError('forgot-password', [])))
	}


	public changePassword(oldPassword, newPassword) {
		const authorization = localStorage.getItem('accessToken');
		const body = { oldPassword, newPassword };
		return this.http
			.post(this.API_URL + this.API_CHANGE_PASSWORD, body, {headers: {authorization}})
			.pipe(catchError(this.handleError('forgot-password', [])))
	}

	public uploadIcon(file): Observable<any> {
		const authorization = localStorage.getItem('accessToken');
		return this.http
			.post(this.API_URL + this.API_UPLOAD, file, {
				headers: {authorization},
			}).pipe(catchError(this.handleError('upload-icon', [])));
	}

	public saveWebSiteToDataBase(website): Observable<any> {
		const authorization = localStorage.getItem('accessToken');
		return this.http
			.post(this.API_URL + this.API_SAVE_SITE, website, {
				headers: {authorization},
			}).pipe(catchError(this.handleError('save-website-to-database', [])));
	}

	public getWebsiteIntegrationInfo(id) {
		const query = `id=${id}`;
		const authorization = localStorage.getItem('accessToken');
		return this.http
			.get(this.API_URL + this.API_GET_WEBSITE_INTEGRATION_INFO + '?' + query, {
				headers: {authorization},
			}).pipe(catchError(this.handleError('get-website-integration-info', [])));
	}

	public deleteWebsiteSubscriber(siteID, subscriberID) {
		const query = `websiteId=${siteID}&subscriberId=${subscriberID}`;
		const authorization = localStorage.getItem('accessToken');
		return this.http
			.delete(this.API_URL + this.API_DELETE_WEBSITE_SUBSCRIBER + '?' + query, {
				headers: {authorization},
			}).pipe(catchError(this.handleError('get-website-integration-info', [])));
	}

	public sendPush(id, {title, text: body, link: url, image, delayedDate, duplicateCount, numberIntervals, icon}, sendingFilter) {
		const authorization = localStorage.getItem('accessToken');

		const formedFilteredData = sendingFilter || null;
		const data = {
			id,
			notification: {
				title,
				body,
				url,
				icon,
				image,
				delayedDate,
				duplicateCount,
				numberIntervals
			},
			filter: formedFilteredData
		};

		return this.http
			.post(this.API_URL + this.API_SEND_PUSH, data, {
				headers: {authorization}
			})
	}

	public createAutomation(data) {
		const authorization = localStorage.getItem('accessToken');
		return this.http.post(this.API_URL + this.API_CREATE_AUTOMATION, data, {
			headers: {authorization}
		});
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return from(result);
		};
	}
}
