import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IAnalyticsCategory} from "../../../../../core/interfaces/analyticsCategory";
import {IService} from "../../../../../core/interfaces/service";
import {ICountryStatistic} from "../../../../../core/interfaces/countryStatistics";
import {ServicesService} from "../../../../../core/services/services.service";
import {AnalyticsService} from "../../../../../core/services/analytics/analytics.service";
import {ngxLoadingAnimationTypes} from "ngx-loading";
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import * as moment from 'moment';
import {isChangedDate} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools";

@Component({
  selector: 'm-countries-analytics',
  templateUrl: './countries-analytics.component.html',
  styleUrls: ['./countries-analytics.component.scss']
})

export class CountriesAnalyticsComponent implements OnInit {
  @Input() selectedAnalyticsCategory: IAnalyticsCategory;

  public servicesInfo: IService[] = [];

  public countriesStatistics: ICountryStatistic[] = [];
  public viewCountriesStatistics: ICountryStatistic[] = [];

  public selectedService: IService = {
    _id: 'r1fvb9ok2t-all-services',
    name: 'All services',
    url: null,
    query: null
  };

  public displayedColumns: string[] = ['listNumber', 'country', 'sent', 'delivered', 'clicks'];
  dataSource = new MatTableDataSource<ICountryStatistic>(this.countriesStatistics);

  public loadingSpinner: boolean = false;
  public spinnerConfig = {
    animationType: ngxLoadingAnimationTypes.circle,
    primaryColour: '#ffffff',
    secondaryColour: '#ccc',
    backdropBorderRadius: '3px',
    fullScreenBackdrop: true
  };

  public openedSelectorDate: boolean = false;

  public dateForRequest: string;
  public dateForShow: any = moment().format('lll');

  public selectedDate: any = {
    year: Number(moment().year()),
    month: Number(moment().month() + 1),
    day: Number(moment().format('D')),
  };

  public oldDate: any = {
    year: Number(moment().year()),
    month: Number(moment().month() + 1),
    day: Number(moment().format('D')),
  };

  public maxDate: any;

  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  public pageIndex: number = 0;

  constructor(
    private servicesService: ServicesService,
    private analyticsService: AnalyticsService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loadServiceData();
    this.loadTableData();
    this.maxDate = this.getMaxDate();
    this.setOldDate();
    this.changeDate()
  }

  private loadServiceData(): void {
    this.loadingSpinner = true;
    if(this.servicesService.servicesInfo.length){
      this.servicesInfo = this.servicesService.servicesInfo.reduce((accum: IService[], service: IService) => {
        accum.push(service);
        return accum;
      }, [this.selectedService]);
      this.loadingSpinner = false;
      this.detectChanges();
    } else {
      this.servicesService.getServicesInfo().subscribe((data: any) => {
        const {servicesInfo, serviceFields, subscriberFields} = data;

        if (servicesInfo) {
          this.servicesInfo = servicesInfo.reduce((accum: IService[], service: IService) => {
            accum.push(service);
            return accum;
          }, [this.selectedService]);
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

  public getDataWithOrWithoutDate(): void {
    this.loadTableData();
  }

  public dateSelected(): void {
    this.changeDate();
    const isChangeDate = this.checkChangeDate();
    if (isChangeDate) {
      this.loadTableData();
      this.setOldDate();
    }
  }

  private checkChangeDate(): boolean {
    return this.oldDate.year !== this.selectedDate.year ||
      this.oldDate.month !== this.selectedDate.month ||
      this.oldDate.day !== this.selectedDate.day;
  }

  private setOldDate(): void {
    this.oldDate.year = this.selectedDate.year;
    this.oldDate.month = this.selectedDate.month;
    this.oldDate.day = this.selectedDate.day;
  }

  private getMaxDate(): object {
    const month = Number(moment().month() + 1);
    const day = Number(moment().format('D'));
    const year = Number(moment().year());
    return {year: year, month: month, day: day}
  }

  private changeDate(): void {
    this.dateForRequest = this.formJSDate(this.selectedDate);
    this.dateForShow = moment(this.selectedDate).format('D MMM YYYY');
  }

  private formJSDate(dateObj: any): string {
    const date = {
      year: dateObj.year,
      month: dateObj.month - 1,
      day: dateObj.day + 1
    };
    const dateString = moment(date).toISOString();
    return `date=${dateString}`;
  }

  private detectChanges(): void {
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  private loadTableData(): void {
    this.loadingSpinner = true;

    const category = this.selectedAnalyticsCategory.name;

    const queryParams = {
      serviceID: this.selectedService._id,
      date: null
    };

    if (this.openedSelectorDate)
      queryParams.date = this.dateForRequest;

    this.analyticsService.getAnalyticsStatistic(category, queryParams).subscribe((data: ICountryStatistic[]) => {
      if (data.length) {
        data.sort((country: ICountryStatistic, nextCountry: ICountryStatistic): number => {
          return nextCountry.clicks - country.clicks
        });

        this.countriesStatistics = data.map((countryStatistic: ICountryStatistic, index: number): ICountryStatistic => {
          countryStatistic.countryFlag = `https://www.countryflags.io/${(countryStatistic.ISO2).toLowerCase()}/flat/32.png`;
          countryStatistic.percentageDelivered = Math.round(countryStatistic.delivered / (countryStatistic.sent / 100));
          countryStatistic.percentageClicks = Math.round(countryStatistic.clicks / (countryStatistic.delivered / 100));
          countryStatistic.listNumber = index + 1;
          return countryStatistic;
        });
      } else {
        this.countriesStatistics = [];
      }

      this.updateViewCountriesStatistics();
      this.loadingSpinner = false;
      this.detectChanges();
    });
  }

  public serviceSelectorChanged(newSelectedService): void {
    this.selectedService = newSelectedService;
    this.loadTableData();
  }

  private updateViewCountriesStatistics(): void {
    const startCampaign = this.pageIndex * this.pageSize;
    const endCampaign = this.pageIndex * this.pageSize + this.pageSize;
    this.viewCountriesStatistics = this.countriesStatistics.slice(startCampaign, endCampaign);
  }

  public pageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateViewCountriesStatistics();
  }

}
