import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ngxLoadingAnimationTypes} from "ngx-loading";

import { environment } from '../../../../../environments/environment';
import { UserService } from "../../../../core/services/user.service";
import { StatisticsService } from "../../../../core/services/statistics.service";



@Component({
	selector: 'm-sites-settings',
	templateUrl: './sites-settings.component.html',
	styleUrls: ['./sites-settings.component.scss']
})
export class SitesSettingsComponent implements OnInit {

	public defaultSiteImageUrl: string = environment.defaultPushImageUrl;
	public website: any = {};

	id = +this.route.snapshot.paramMap.get('id');

	public loadingSpinner = false;
	public spinnerConfig = {
		animationType: ngxLoadingAnimationTypes.circle,
		primaryColour: '#ffffff',
		secondaryColour: '#ccc',
		backdropBorderRadius: '3px',
		fullScreenBackdrop: true
	};

	public loadingImageSpinner = false;

	constructor(
		public ref: ChangeDetectorRef,
		private userService: UserService,
		private statisticsService: StatisticsService,
		private route: ActivatedRoute,
		private router: Router,
	) {
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.id = params.id;
			this.userService.getWebsiteIntegrationInfo(this.id).subscribe((data:any) => {
				if (data) {
					this.website = data.website;
				}
			});
			this.ref.detectChanges();
		})
	}

	detectChanges(){
		if (!this.ref['destroyed']) {
			this.ref.detectChanges();
		}
	}

	siteImageChanged(event: any): void {
		const pushImage = new FormData();
		pushImage.append('notificationImage ', event.target['files'][0]);
		this.loadingImageSpinner = true;
		this.userService.uploadIcon(pushImage)
			.subscribe(response => {
				this.website.icon = response.filePath;
				this.detectChanges();
				setTimeout(() => {
					this.loadingImageSpinner = false;
					this.detectChanges();
				}, 1000)
			}, error => {
				setTimeout(() => {
					this.loadingImageSpinner = false;
					this.detectChanges();
				}, 1000)
			} )
	}

	generalClickedSave() {
		this.loadingSpinner = true;
		this.statisticsService.updateWebsite(this.id ,this.website.icon).subscribe((data:any) => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.ref.detectChanges()
			}, 1000)
		});
	}

	generalClickedDelete() {
		this.loadingSpinner = true;
		this.statisticsService.deleteSite(this.id).subscribe((data:any) => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.ref.detectChanges()
			}, 1000)
		});
	}
}
