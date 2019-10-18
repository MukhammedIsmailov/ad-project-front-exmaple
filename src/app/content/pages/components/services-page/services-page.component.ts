import {ChangeDetectorRef, Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ServicesService} from '../../../../core/services/services.service';
import {StatisticsService} from '../../../../core/services/statistics.service';
import {CampaignsService} from "../../../../core/services/campaigns/campaigns.service";
import {IService} from '../../../../core/interfaces/service';
import {ICampaign} from '../../../../core/interfaces/campaign';
import {MatDialog} from '@angular/material';
import {CampaignsModalContainerComponent} from '../../../partials/content/widgets/general/campaigns-modal-container/campaigns-modal-container.component';
import * as moment from 'moment';
import {ngxLoadingAnimationTypes} from "ngx-loading";
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'm-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent implements OnInit {

  public servicesInfo: IService[] = [];
  public websites: any = [];
  public selectedSiteID: any = null;
  public selectedService: IService;
  public campaign: ICampaign;

  public openedDuplicate: boolean = false;
  public openedDelayedDispatch: boolean = false;
  public openedSendingAtIntervals: boolean = false;

  public duplicateCount: number = 1;

  public dateForRequest: any = new Date();
  public dateForShow: any = moment().format('lll');

  public numberIntervals: number = 2;
  public showInterval: string = '12 hours';

  public dataCreatingServiceCampaign: any = {};

  public selectedDate: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  public minDate: any;

  public selectedTime: any = {
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  };

  public loadingSpinner = false;
  public spinnerConfig = {
    animationType: ngxLoadingAnimationTypes.circle,
    primaryColour: '#ffffff',
    secondaryColour: '#ccc',
    backdropBorderRadius: '3px',
    fullScreenBackdrop: true
  };

  public deleteModalStatus: boolean = false;
  public addNewCampaignTebStatus: boolean = false;

  public serviceFields: any;
  public subscriberFields: any;

  constructor(
    private servicesService: ServicesService,
    private statisticsService: StatisticsService,
    private campaignsService: CampaignsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public ref: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadServicesData();
    this.loadWebsites();
    this.minDate = this.getMinDate();
    this.changeDate()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dateSelected();
  }

  public loadWebsites(): void {
    this.statisticsService.getTotalStatistics().subscribe((data: any) => {
      this.websites = data.websites.reduce((accum, website) => {
        if (website.subscribers.length)
          accum.push(website);
        return accum;
      }, []);
    });
  }

  public loadServicesData(): void {
    this.loadingSpinner = true;
    if (this.servicesService.servicesInfo.length) {

      this.servicesInfo = this.servicesService.servicesInfo;
      this.serviceFields = this.servicesService.serviceFields;
      this.subscriberFields = this.servicesService.subscriberFields;

      this.selectedService = this.servicesInfo[0];

      this.addNewCampaignTebStatus = true;
      this.loadingSpinner = false;
      this.dateSelected();
      this.detectChanges();
    } else {
      this.servicesService.getServicesInfo().subscribe((data: any) => {
        const {servicesInfo, serviceFields, subscriberFields} = data;
        if (servicesInfo) {
          this.servicesInfo = servicesInfo;
          this.servicesService.servicesInfo = servicesInfo;

          if (serviceFields) {
            this.serviceFields = serviceFields;
            this.servicesService.serviceFields = serviceFields;
          }

          if (subscriberFields) {
            this.subscriberFields = subscriberFields;
            this.servicesService.subscriberFields = subscriberFields;
          }

          if (this.servicesInfo.length) {
            this.selectedService = this.servicesInfo[0];
          }
        }
        this.addNewCampaignTebStatus = true;
        this.loadingSpinner = false;
        this.dateSelected();
        this.detectChanges();
      })
    }
  }

  public selectService(service): void {
    this.selectedSiteID = null;
    this.selectedService = service;
  }

  public pickerClicked(): void {
    this.changeDate();
  }

  public pickerClickedInterval() {
    this.changeDate();
  }

  public dateSelected() {
    this.changeDate();
  }

  getMinDate(): object {
    const data = new Date();
    const month = data.getUTCMonth() + 1;
    const day = data.getUTCDate();
    const year = data.getUTCFullYear();
    return {year: year, month: month, day: day}
  }

  public changeDate(): void {
    this.dateForRequest = this.formJSDate(this.selectedDate, this.selectedTime);
    this.dateForShow = moment(this.dateForRequest).format('lll');
  }


  public formJSDate(dateObj, timeObj): any {
    const formattedDate = new Date();
    if (dateObj) {
      formattedDate.setFullYear(dateObj.year);
      formattedDate.setMonth(dateObj.month - 1);
      formattedDate.setDate(dateObj.day);
      if (timeObj) {
        formattedDate.setHours(timeObj.hour);
        formattedDate.setMinutes(timeObj.minute);
      }
      return formattedDate;
    } else {
      return (Number(timeObj.hour) * 3600) + (Number(timeObj.minute) * 60)
    }
  }

  public compareDates(dateInput): boolean {
    return Number(dateInput) >= Date.now();
  }

  public decrementDuplicateCount(): void {
    this.duplicateCount -= 1;
    this.validateDuplicateCount(this.duplicateCount);
  }

  public incrementDuplicateCount(): void {
    this.duplicateCount += 1;
    this.validateDuplicateCount(this.duplicateCount);
  }

  public validateDuplicateCount(count): void {
    if (count < 1)
      this.duplicateCount = 1;
    if (count > 5)
      this.duplicateCount = 5;
  }

  public decrementNumberIntervals(): void {
    this.numberIntervals -= 1;
    this.validateNumberIntervals(this.numberIntervals);
    this.calculateInterval();
  }

  public incrementNumberIntervals(): void {
    this.numberIntervals += 1;
    this.validateNumberIntervals(this.numberIntervals);
    this.calculateInterval();
  }

  public validateNumberIntervals(number: number): void {
    if (number < 2)
      this.numberIntervals = 2;
    if (number > 48)
      this.numberIntervals = 48;
    this.calculateInterval();
  }

  public calculateInterval(): void {
    const oneDay: number = 1440; //1440 minutes - one day
    const intervalInMinutes: number = Math.round(oneDay / this.numberIntervals);

    if (intervalInMinutes < 60) {
      this.showInterval = `${intervalInMinutes} minutes`
    } else {
      const intervalHours = Math.floor(intervalInMinutes / 60);
      const intervalMinutes = intervalInMinutes - intervalHours * 60;
      if (intervalHours !== 1)
        this.showInterval = `${intervalHours} hours ${intervalMinutes} minutes`;
      else
        this.showInterval = `${intervalHours} hour ${intervalMinutes} minutes`;
    }
  }

  private detectChanges(): void {
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  public submitSiteSubscribers(): void {
    this.dataCreatingServiceCampaign.duplicateCount = this.duplicateCount;

    if (this.openedDelayedDispatch) {
      this.dataCreatingServiceCampaign.delayedDate = this.dateForRequest;
    }
    if (this.openedSendingAtIntervals) {
      this.dataCreatingServiceCampaign.numberIntervals = this.numberIntervals;
    }
    if (!this.openedDelayedDispatch && !this.openedSendingAtIntervals) {
      this.loadingSpinner = true;
    }
    if (this.selectedSiteID && this.selectedService) {
      this.dataCreatingServiceCampaign.selectedSiteID = this.selectedSiteID;
      this.dataCreatingServiceCampaign.selectedService = this.selectedService;

      this.campaignsService.sendServiceCampaign(this.dataCreatingServiceCampaign)
        .subscribe((data: any) => {
          if (data) {

            if (data.newCampaign)
              data.newCampaign.pushNotifications = data.newCampaign.pushNotifications.map(item => {
                return item.dataNotification;
              });

            if (data.statusShowCampaign) {
              this.campaign = data.newCampaign;
              this.openCampaignModal(this.campaign);
              this.loadingSpinner = false;
              this.detectChanges();
            }
          }
        }, (err) => {
          console.log(err);
        });

      this.clearAndClose();
    }
  }

  public clearAndClose(): void {
    this.dataCreatingServiceCampaign = {
      duplicateCount: 1
    };
    if (this.openedDelayedDispatch || this.openedSendingAtIntervals) {
      this.showCampaign('Campaign has been sent!!!', 'Close');
    }
    this.selectedSiteID = null;
    this.duplicateCount = 1;
    this.numberIntervals = 2;
    this.showInterval = '12 hours';
    this.openedDuplicate = false;
    this.openedDelayedDispatch = false;
    this.openedSendingAtIntervals = false;
    this.deleteModalStatus = false;
    this.ref.detectChanges();
  }

  private showCampaign(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public openCampaignModal(campaignData: object): void {
    const dialogRef = this.dialog.open(CampaignsModalContainerComponent, {
      data: {
        campaign: campaignData
      }
    });
  }

  public changeDeleteModalStatus(): void {
    this.deleteModalStatus = !this.deleteModalStatus;
  }

  public deleteService(idService): void {
    this.loadingSpinner = true;
    this.servicesService.deleteService(idService).subscribe((result: any) => {
      if (result.ok) {
        this.servicesInfo = this.servicesInfo.filter(service => {
          if (service._id !== idService)
            return service;
        });
        this.servicesService.servicesInfo = this.servicesInfo;
        this.selectedService = this.servicesInfo[0];
        this.clearAndClose();
      }
      this.loadingSpinner = false;
      this.detectChanges();
    })
  }

}
