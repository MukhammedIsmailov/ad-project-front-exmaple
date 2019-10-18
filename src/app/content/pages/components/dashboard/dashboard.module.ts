import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layout/layout.module';
import { PartialsModule } from '../../../partials/partials.module';
import { ListTimelineModule } from '../../../partials/layout/quick-sidebar/list-timeline/list-timeline.module';
import { WidgetChartsModule } from '../../../partials/content/widgets/charts/widget-charts.module';
import { MyCampaignsStatisticModule } from '../my-campaigns-statistic/my-campaigns-statistic.module';
import { MyWebsitesModule } from '../my-websites/my-websites.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
	imports: [
		CommonModule,
		LayoutModule,
		PartialsModule,
		ListTimelineModule,
		WidgetChartsModule,
		MyCampaignsStatisticModule,
		MyWebsitesModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			}
		]),
		NgxLoadingModule.forRoot({})
	],
	providers: [],
	declarations: [DashboardComponent]
})
export class DashboardModule {}
