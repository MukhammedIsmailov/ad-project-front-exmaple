import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CampaignsService} from "../../../../core/services/campaigns/campaigns.service";

import * as _ from 'underscore';
import * as moment from 'moment';
import {PageEvent} from "@angular/material";
import {ICampaign} from "../../../../core/interfaces/campaign";
import {ngxLoadingAnimationTypes} from "ngx-loading";

@Component({
  selector: 'm-campaign-page',
  templateUrl: './campaign-page.component.html',
  styleUrls: ['./campaign-page.component.scss']
})
export class CampaignPageComponent implements OnInit {

  id = +this.route.snapshot.paramMap.get('id');
  public campaign: any = null;
  public serviceName: string;

  public campaignStatus: string;
  public campaignStatusCompleted: string = 'completed';

  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  public pageIndex: number = 0;
  public campaignNotifications: any = [];
  public viewCampaignNotifications: any = [];

  public filteredNotifications: any = [];

  public deleteModalStatus: boolean = false;

  public loadingSpinner = false;
  public spinnerConfig = {
    animationType: ngxLoadingAnimationTypes.circle,
    primaryColour: '#ffffff',
    secondaryColour: '#ccc',
    backdropBorderRadius: '3px',
    fullScreenBackdrop: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignsService: CampaignsService,
    public ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.getCampaignData();
  }

  private detectChanges(): void {
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  private getCampaignData(): void {
    this.route.params.subscribe((params: any) => {
      this.id = params.id;

      this.campaign = this.campaignsService.getLocalCampaignByID(this.id);
      if (!this.campaign) {
        this.campaignsService.getCampaignsData().subscribe((data) => {
          if (data) {
            this.campaign = _.findWhere(data, {_id: this.id});
            this.setDataNotifications(this.campaign.pushNotifications);
            this.campaignStatus = this.campaign.statusOfShipments;
            this.updateDateString(this.campaign);
            this.setServiceUrl();
            this.detectChanges();
          }
        }, error => {
          console.log(error)
        })
      } else {
        this.setDataNotificationToLocalCampaign(this.campaign.pushNotifications);
        this.campaignStatus = this.campaign.statusOfShipments;
        this.updateDateString(this.campaign);
        this.setServiceUrl();
        this.detectChanges();
      }
    })
  }

  private addSecondaryData() {
    this.campaign = {
      ...this.campaign,
      deliveredPercentage: Math.round((this.campaign.deliveredCount|| 0) / (this.campaign.sent || 1) * 100),
      clickedPercentage: Math.round((this.campaign.clickCount|| 0) / (this.campaign.deliveredCount || 1) * 100),
      sentAndNotDelivered: (this.campaign.sent - this.campaign.deliveredCount - (this.campaign.deliveryFailed || 0) ) || 0
    };
  }

  private setDataNotifications(arrayNotification: Array<any>): void {
    this.campaignNotifications = arrayNotification.map(item => {
      return item.dataNotification;
    });
    this.filterNotifications(this.campaignNotifications);
  }

  private setDataNotificationToLocalCampaign(arrayNotification: Array<any>): void {
    this.campaignNotifications = arrayNotification.slice(0);
    this.filterNotifications(this.campaignNotifications);
  }

  private setServiceUrl(): void {
    this.addSecondaryData();
    this.serviceName = this.campaign.serviceUrl.split('.')[1];
  }

  private filterNotifications(arrayNotifications: Array<any>): void {
    if (arrayNotifications.length !== 0) {
      this.filteredNotifications = arrayNotifications.map(item =>
        item
      );
    }
    this.updateViewCampaigns();
  }

  private updateDateString(campaign: ICampaign): void {
    let date = new Date();
    date.setTime(Date.parse(campaign.date));
    campaign.date = date.toString().split(' ').slice(0, 5).join(' ');
  }

  private updateViewCampaigns(): void {
    const startCampaign = this.pageIndex * this.pageSize;
    const endCampaign = this.pageIndex * this.pageSize + this.pageSize;
    this.viewCampaignNotifications = this.filteredNotifications.slice(startCampaign, endCampaign);
  }

  public pageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateViewCampaigns();
  }

  public changeCampaignStatus(): void {
    this.loadingSpinner = true;
    this.campaignsService.updateCampaign(this.id, {statusOfShipments: this.campaignStatus}).subscribe((data: any) => {
      this.campaignStatus = data.statusOfShipments;
      this.loadingSpinner = false;
      this.detectChanges();
    })
  }

  public changeDeleteModalStatus(): void {
    this.deleteModalStatus = !this.deleteModalStatus;
  }

  public deleteCampaign(): void {
    this.campaignsService.deleteCampaign(this.id).subscribe(() => {
      this.router.navigate(['/service-campaigns']);
    });
  }
}
