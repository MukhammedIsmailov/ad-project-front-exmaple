import {Component, OnInit, ViewChild} from '@angular/core';
import {ngxLoadingAnimationTypes} from "ngx-loading";
import {IAnalyticsCategory} from '../../../../core/interfaces/analyticsCategory';
import {AnalyticsService} from "../../../../core/services/analytics/analytics.service";
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts/ng2-charts';

@Component({
  selector: 'm-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public analyticsInfo: IAnalyticsCategory[] = [];
  public selectedAnalyticsCategory: IAnalyticsCategory = null;

  constructor(
    private analyticsService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData(): void {
    this.analyticsInfo = this.analyticsService.analyticsInfo;

    if (this.analyticsInfo.length)
      this.selectedAnalyticsCategory = this.analyticsInfo[0];
  }

  public selectAnalyticsCategory(analyticsCategory: any): void {
    this.selectedAnalyticsCategory = analyticsCategory;
  }
}
