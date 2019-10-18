import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LayoutConfigService} from '../../../../core/services/layout-config.service';
import {SubheaderService} from '../../../../core/services/layout/subheader.service';
import {CampaignStatistic} from '../../../../core/interfaces/campaignStatistic';
import {NotificationsService} from "../../../../core/services/notifications/notifications.service";
import { PageEvent } from '@angular/material';
import * as moment from 'moment';
import {ngxLoadingAnimationTypes} from "ngx-loading";

export interface MyDate {
	year: number;
	month: number;
	day: number;
}

@Component({
  selector: 'm-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {

	public campaigns: any = [];
	public toDate1: MyDate = { year: NaN, month: NaN, day: NaN };
	public toDate2: MyDate = { year: NaN, month: NaN, day: NaN };
	public viewCampaigns: any = [];
	public filteredCampaigns: any = [];
	public isOpenFilter: boolean = false;
	public filterText: string = '';
	public websiteList: string[] = [];
	public currentWebsite: string = 'any';
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 20, 50, 100];
	pageIndex: number = 0;

	public loadingSpinner = false;
	public spinnerConfig = {
		animationType: ngxLoadingAnimationTypes.circle,
		primaryColour: '#ffffff',
		secondaryColour: '#ccc',
		backdropBorderRadius: '3px',
		fullScreenBackdrop: true
	};


	constructor(
		private router: Router,
		private configService: LayoutConfigService,
		private subheaderService: SubheaderService,
		private notificationsService: NotificationsService,
		public ref: ChangeDetectorRef,
	) {
	}

	public serializeDate(date) : string {
		const {year, month, day} = date;
		return new Date(year, month - 1, day + 1).toISOString();
	}

	public detectChanges(){
		if (!this.ref['destroyed']) {
			this.ref.detectChanges();
		}
	}

	public ngOnInit(): void {
		this.loadingSpinner = true;
		this.notificationsService.getNotifications().subscribe((data:any) => {
			this.campaigns = [];
			const notificationsData = data.sort((a, b)=> {
				if (a.date > b.date ) {
					return -1;
				}
				if (a.date < b.date ) {
					return 1;
				}
				return 0;
			});
			if (notificationsData) {
				this.notificationsService.setLocalNotifications(notificationsData);
				notificationsData.forEach((campaignItem) => {
					const delivered = campaignItem.deliveredCount || 0;
					const clicks = campaignItem.clickCount || 0;
					const sended = campaignItem.sended || 0;
					const isoDate = campaignItem.date;
					const date = moment(campaignItem.date).format('HH:mm');
					const icon = campaignItem.icon || '';
					if (!this.websiteList.find( item => item === campaignItem.websiteUrl)) {
						this.websiteList.push(campaignItem.websiteUrl);
					}
					const campaign = {
						...campaignItem,
						icon,
						date,
						sended,
						delivered,
						deliveredPercentage : Math.round(((delivered) / (sended || 1) * 100) * 10) / 10,
						clicks,
						clicksPercentage : Math.round(((clicks) / (delivered || 1) * 100) * 10) / 10,
						isoDate
					};

					this.campaigns.push(campaign);
				});
				this.updateViewCampagins();
				setTimeout(() => {
					this.loadingSpinner = false;
					this.detectChanges();
				}, 1000);
				this.detectChanges();
			}
		}, error1 => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000)
		});
	}

	public cancelFilter() : void {
		this.isOpenFilter = false;
	}

	public resetFilter() : void {
		this.filterText = '';
		this.currentWebsite = 'any';
		this.toDate1 = { year: NaN, month: NaN, day: NaN };
		this.toDate2 = { year: NaN, month: NaN, day: NaN };
		this.updateViewCampagins();
		this.isOpenFilter = false;
	}

	get isValidDate() {
		const [{year : year1, month : month1 , day : day1}, {year : year2, month : month2 , day : day2}] = [this.toDate1, this.toDate2];
		return year1 && month1 && day1 && year2 && month2 && day2
	}

	public updateViewCampagins() : void {
		this.filteredCampaigns = this.campaigns.filter(item => {
			const isValidBebsite = this.currentWebsite !== 'any' ? item.websiteUrl === this.currentWebsite : true;
			const isValidText = item.body.includes(this.filterText);
			const isValidDate = this.isValidDate ?
				this.serializeDate(this.toDate1) <= item.isoDate && this.serializeDate(this.toDate2) >= item.isoDate:
				true;
			return isValidText && isValidBebsite && isValidDate;
		});
		this.viewCampaigns = [...this.filteredCampaigns].splice(this.pageIndex * this.pageSize, this.pageSize);
		this.isOpenFilter = false;
		this.ref.detectChanges();
	}

	public pageEvent(event: PageEvent) {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		this.updateViewCampagins();
	}
}

