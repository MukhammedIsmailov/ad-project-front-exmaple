import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {NotificationsService} from '../../../../core/services/notifications/notifications.service';
import {ICampaign} from '../../../../core/interfaces/campaign';
import {IService} from '../../../../core/interfaces/service';
import {ServicesService} from '../../../../core/services/services.service';
import {CampaignsService} from "../../../../core/services/campaigns/campaigns.service";
import {StatisticsService} from '../../../../core/services/statistics.service';
import {MatDialog} from '@angular/material';
import {CampaignsModalContainerComponent} from "../../../partials/content/widgets/general/campaigns-modal-container/campaigns-modal-container.component";
import {ngxLoadingAnimationTypes} from "ngx-loading";


@Component({
  selector: 'm-campaigns-details',
  templateUrl: './service-campaigns.component.html',
  styleUrls: ['./service-campaigns.component.scss']
})
export class ServiceCampaignsComponent implements OnInit {

  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  public pageIndex: number = 0;
  public viewCampaignsTableData: any = [];

  public servicesInfo: IService[] = [];
  public websites: any = [];
  public selectedService: IService = null;
  public campaign: ICampaign = null;
  public campaigns: ICampaign[] = [];
  public filteredCampaigns: ICampaign[] = [];

  public loadingSpinner = false;
  public spinnerConfig = {
    animationType: ngxLoadingAnimationTypes.circle,
    primaryColour: '#ffffff',
    secondaryColour: '#ccc',
    backdropBorderRadius: '3px',
    fullScreenBackdrop: true
  };

  constructor(
    private servicesService: ServicesService,
    private campaignsService: CampaignsService,
    public dialog: MatDialog,
    public ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.loadingSpinner = true;
    this.loadServicesData();
    this.loadCampaignsData();
  }

  private detectChanges() {
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  public loadServicesData(): void {
    this.loadingSpinner = true;
    if (this.servicesService.servicesInfo.length) {
      this.servicesInfo = this.servicesService.servicesInfo;
      this.selectedService = this.servicesInfo[0];
      this.loadingSpinner = false;
      this.detectChanges();
    } else {
      this.servicesService.getServicesInfo().subscribe((data: any) => {
        const {servicesInfo, serviceFields, subscriberFields} = data;
        if (servicesInfo) {
          this.servicesInfo = servicesInfo;
          this.servicesService.servicesInfo = servicesInfo;

          if (serviceFields) {
            this.servicesService.serviceFields = serviceFields;
          }

          if (subscriberFields) {
            this.servicesService.subscriberFields = subscriberFields;
          }

          if (this.servicesInfo.length) {
            this.selectedService = this.servicesInfo[0];
          }
        }
        this.loadingSpinner = false;
        this.detectChanges();
      })
    }
  }

  private loadCampaignsData(): void {
    this.loadingSpinner = true;
    this.campaignsService.getCampaignsData().subscribe((data: any) => {
      if (data) {
        const campaignsData = data.sort((a, b) => {
          if (a.date > b.date) {
            return -1;
          }
          if (a.date < b.date) {
            return 1;
          }
          return 0;
        });

        if (campaignsData) {
          this.campaignsService.setLocalCampaigns(campaignsData);

          campaignsData.forEach(item => {
            item.pushNotifications = item.pushNotifications.map(item => {
              return item.dataNotification;
            });
          });
          this.campaigns = data;
          this.filterCampaigns(this.campaigns);
          this.updateViewCampaigns();

          this.loadingSpinner = false;
          this.detectChanges();
        }
      }
    });
  }

  public selectService(service: any): void {
    this.selectedService = service;
    this.pageIndex = 0;
    this.filterCampaigns(this.campaigns);
  }

  private filterCampaigns(arrayCampaigns): void {
    if (arrayCampaigns.length !== 0) {
      const listCampaigns: Array<any> = [];
      arrayCampaigns.forEach(item => {
        if (item.serviceUrl && item.serviceUrl === this.selectedService.url) {
          listCampaigns.push(item);
        }
      });
      this.filteredCampaigns = listCampaigns;
    }
    this.updateViewCampaigns();
  }

  public openCampaignModal(campaignData: object): void {
    const dialogRef = this.dialog.open(CampaignsModalContainerComponent, {
      data: {
        campaign: campaignData
      }
    });
  }

  private updateDateString(arrayCampaigns: Array<any>): void {
    arrayCampaigns.map(item => {
      let date = new Date();
      date.setTime(Date.parse(item.date));
      item.date = date.toString().split(' ').slice(0, 5).join(' ');
      return item;
    })
  }

  private updateViewCampaigns(): void {
    const startCampaign = this.pageIndex * this.pageSize;
    const endCampaign = this.pageIndex * this.pageSize + this.pageSize;
    this.viewCampaignsTableData = this.filteredCampaigns.slice(startCampaign, endCampaign);
    this.updateDateString(this.viewCampaignsTableData);
  }

  public pageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateViewCampaigns();
  }

}

