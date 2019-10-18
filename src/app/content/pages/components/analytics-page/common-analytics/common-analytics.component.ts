import {ChangeDetectorRef, Component, OnInit, Input, ViewChild} from '@angular/core';
import {ngxLoadingAnimationTypes} from "ngx-loading";
import {IAnalyticsCategory} from '../../../../../core/interfaces/analyticsCategory';
import {ServicesService} from "../../../../../core/services/services.service";
import {AnalyticsService} from "../../../../../core/services/analytics/analytics.service";
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import * as moment from 'moment';
import {BaseChartDirective} from "ng2-charts";
import {IService} from "../../../../../core/interfaces/service";

@Component({
  selector: 'm-common-analytics',
  templateUrl: './common-analytics.component.html',
  styleUrls: ['./common-analytics.component.scss']
})
export class CommonAnalyticsComponent implements OnInit {
  @Input() selectedAnalyticsCategory: IAnalyticsCategory;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public servicesInfo: IService[] = [];

  public selectedService: IService = {
    _id: 'r1fvb9ok2t-all-services',
    name: 'All services',
    url: null,
    query: null
  };

  public cardsStatistics: any;

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {xAxes: [{}], yAxes: [{}]},
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public chartLabels: string[];
  public chartType: string = 'bar';
  public chartLegend: boolean = true;

  public chartData: any[] = [
    {data: [], label: 'Series A'},
  ];

  public groupFilter = 'hour';
  public periodFilter = 'day';

  public periods = [
    {value: 'day', viewValue: 'During a day'},
    {value: 'week', viewValue: 'During a week'},
    {value: 'month', viewValue: 'During a month'},
  ];

  public showGroupFilter: boolean = true;

  public loadingSpinner: boolean = false;
  public spinnerConfig = {
    animationType: ngxLoadingAnimationTypes.circle,
    primaryColour: '#ffffff',
    secondaryColour: '#ccc',
    backdropBorderRadius: '3px',
    fullScreenBackdrop: true
  };

  constructor(
    private servicesService: ServicesService,
    private analyticsService: AnalyticsService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loadServiceData();
    this.loadChartData();
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

  private detectChanges(): void {
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  private loadChartData(): void {
    this.loadingSpinner = true;

    const category = this.selectedAnalyticsCategory.name;

    const queryParams = {
      group: this.groupFilter,
      period: this.periodFilter,
      serviceID: this.selectedService._id
    };

    this.analyticsService.getAnalyticsStatistic(category, queryParams).subscribe((data: any) => {
      this.chartLabels = [];
      this.chartData = [
        {data: [], label: 'Clicks'}
      ];

      const notifications = parseInt(data.notifications) || 0;
      const delivered = parseInt(data.delivered) || 0;
      const clicks = parseInt(data.clicked) || 0;
      const sent = parseInt(data.sent) || 0;

      this.cardsStatistics = {
        notifications: notifications,
        sent: sent,
        delivered: delivered,
        deliveredPercentage: Math.round(((delivered) / (sent || 1) * 100) * 10) / 10,
        clicks: clicks,
        clicksPercentage: Math.round(((clicks) / (delivered || 1) * 100) * 10) / 10
      };

      const graphStatistics = data.graphStatistic;

      if (graphStatistics) {
        graphStatistics.forEach(graphItem => {
          this.chartData[0].data.push(graphItem.clicked || 0);
          const formattedDate = (this.groupFilter === 'hour')
            ? moment(graphItem.period.from).format('HH:mm') + ' - ' + moment(graphItem.period.to).format('HH:mm')
            : moment(graphItem.period.from).format('L');
          this.chartLabels.push(formattedDate);
        });
        setTimeout(() => {
          if (this.chart && this.chart.chart && this.chart.chart.config) {
            this.chart.chart.config.data.labels = this.chartLabels;
            this.chart.chart.update();
          }
        });
      }

      this.loadingSpinner = false;
      this.detectChanges();
    })
  }

  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  public periodSelectorChanged(event): void {
    this.periodFilter = event.value;
    if (event.value === 'month' || event.value === 'week') {
      this.showGroupFilter = false;
      this.groupFilter = 'day';
    } else {
      this.showGroupFilter = true;
      this.groupFilter = 'hour';
    }
    this.loadChartData();
  }

  public serviceSelectorChanged(newSelectedService): void {
    this.selectedService = newSelectedService;
    this.loadChartData();
  }

}
