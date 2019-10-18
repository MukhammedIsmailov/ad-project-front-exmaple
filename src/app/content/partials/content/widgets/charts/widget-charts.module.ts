import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { RecentCampaignsChartComponent} from "./recent-campaigns-chart/recent-campaigns-chart.component";
import { ChartsModule } from 'ng2-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
	imports: [
		CommonModule,
		ChartsModule,
		MatButtonToggleModule,
		MatSelectModule,
		NgxLoadingModule.forRoot({})
	],
	exports: [
		BarChartComponent,
		DoughnutChartComponent,
		RecentCampaignsChartComponent,
	],
	declarations: [
		BarChartComponent,
		DoughnutChartComponent,
		RecentCampaignsChartComponent,
	]
})
export class WidgetChartsModule {}
