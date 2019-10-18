import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { environment } from '../../../../../environments/environment';
import {UserService} from "../../../../core/services/user.service";
import {NotificationsService} from "../../../../core/services/notifications/notifications.service";
import * as _ from 'underscore';
import * as moment from 'moment';


@Component({
	selector: 'm-push-details',
	templateUrl: './push-details.component.html',
	styleUrls: ['./push-details.component.scss']
})
export class PushDetailsComponent implements OnInit {

	id = +this.route.snapshot.paramMap.get('id');
	public push: any = null;
	public defaultPushImageUrl: string = environment.defaultPushImageUrl;
	clicksRoundData: any = {
		color:'primary',
		mode:'determinate',
	    value: 0,
	};

	constructor(
		private route: ActivatedRoute,
		private notificationsService: NotificationsService,
		public ref: ChangeDetectorRef,
	) {
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.id = params.id;
			this.push = this.notificationsService.getLocalNotificationByID(this.id);
			if (!this.push) {
				this.notificationsService.getNotifications().subscribe((data) => {
					if (data) {
						this.push = _.findWhere(data, {_id: this.id});
						this.addSecondaryData();
						this.ref.detectChanges();
					}
				}, error1 => {

				})
			} else {
				this.addSecondaryData();
				this.ref.detectChanges();
			}
		})
	}

	formatDate(date, dateFormat) {
		return moment(date).format(dateFormat);
	}

	addSecondaryData() {
		this.push = {
			...this.push,
			deliveredPercentage: Math.round((this.push.deliveredCount|| 0) / (this.push.sended || 1) * 100),
			clickedPercentage: Math.round((this.push.clickCount|| 0) / (this.push.deliveredCount || 1) * 100),
			sentAndNotDelivered: (this.push.sent - this.push.deliveredCount - (this.push.deliveryFailed || 0) ) || 0
		};
		this.clicksRoundData.value = this.push.clicksPercentage / 100;
	}
}
