import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LayoutConfigService} from '../../../../core/services/layout-config.service';
import {SubheaderService} from '../../../../core/services/layout/subheader.service';
import {StatisticsService} from '../../../../core/services/statistics.service';
import {CampaignStatistic} from '../../../../core/interfaces/campaignStatistic';
import {ngxLoadingAnimationTypes} from "ngx-loading";
import {t} from "@angular/core/src/render3";

@Component({
	selector: 'm-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

	public config: any;
	public sites: any = [];

	public totalStatistics: CampaignStatistic;

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
		private statisticsService: StatisticsService,
		public ref: ChangeDetectorRef
	) {
	}

	detectChanges(){
		if (!this.ref['destroyed']) {
			this.ref.detectChanges();
		}
	}


	ngOnInit(): void {
		this.loadingSpinner = true;
		this.statisticsService.getTotalStatistics().subscribe((data: any) => {

			const activeSubscribers = parseInt(data.subscribers);
			const campaigns = parseInt(data.campaigns) || 0;
			const delivered = parseInt(data.delivered) || 0;
			const clicks = parseInt(data.clicked) || 0;
			const sended = parseInt(data.sended) || 0;

			this.totalStatistics = {
				activeSubscribers: activeSubscribers,
				campaigns: campaigns,
				delivered: delivered,
				deliveredPercentage: Math.round(((delivered) / (sended || 1) * 100) * 10) / 10,
				clicks: clicks,
				clicksPercentage: Math.round(((clicks) / (delivered || 1) * 100) * 10) / 10
			};
			this.sites = data.websites;
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000);
			this.detectChanges();
		}, error => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000)
		});
	}

	public deleteSite(id) {
		this.loadingSpinner = true;
		this.statisticsService.deleteSite(id).subscribe(() => {
			this.sites = this.sites.filter(item => item._id !== id);
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000);
			this.detectChanges();
		}, error1 => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000)
		});
	}
}
