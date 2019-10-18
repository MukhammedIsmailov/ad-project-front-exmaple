import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { StatisticsService } from '../../../../../../core/services/statistics.service'
import {BaseChartDirective} from 'ng2-charts/ng2-charts';
import * as moment from 'moment';
import {ngxLoadingAnimationTypes} from "ngx-loading";

@Component({
  selector: 'm-recent-campaigns-chart',
  templateUrl: './recent-campaigns-chart.component.html',
  styleUrls: ['./recent-campaigns-chart.component.scss']
})
export class RecentCampaignsChartComponent implements OnInit {
	@ViewChild(BaseChartDirective) chart: BaseChartDirective;

	public chartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true,
		legend: {
			labels: {
				fontSize: 14
			}
		},
		scales: {
			yAxes: [{
				ticks: {
					fontSize: 15
				}
			}],
			xAxes: [{
				ticks: {
					fontSize: 15
				}
			}]
		}
	};
	public chartLabels: string[];
	public chartType: string = 'bar';
	public chartLegend: boolean = true;

	public chartData: any[] = [
		{data: [], label: 'Series A'},
		{data: [], label: 'Series B'}
	];

	public groupFilter = 'day';
	public periodFilter = 'week';

	public periods = [
		{ value:'week', viewValue:'During a week' },
		{ value:'month', viewValue:'During a month' },
		{ value:'quarter', viewValue:'During a quarter' },
	];

	public cardsStatistics: any;

	public loadingSpinner = false;
	public spinnerConfig = {
		animationType: ngxLoadingAnimationTypes.circle,
		primaryColour: '#ffffff',
		secondaryColour: '#ccc',
		backdropBorderRadius: '3px',
		fullScreenBackdrop: false
	};

	constructor (
		private statisticsService: StatisticsService,
		public ref: ChangeDetectorRef
	) { }


	ngOnInit () {
		this.loadChartData();
	}

	detectChanges(){
		if (!this.ref['destroyed']) {
			this.ref.detectChanges();
		}
	}

	loadChartData () {
		this.loadingSpinner = true;
		this.statisticsService.getNotificationStatistics(this.groupFilter, this.periodFilter).subscribe((data:any) => {

			this.chartLabels = [];
			this.chartData = [
				{data: [], label: 'Delivered'},
				{data: [], label: 'Clicks'}
			];

			const campaigns = parseInt(data.campaigns) || 0;
			const delivered = parseInt(data.delivered) || 0;
			const clicks = parseInt(data.clicked) || 0;
			const sent = parseInt(data.sended) || 0;

			this.cardsStatistics = {
				campaigns : campaigns,
				sent: sent,
				delivered : delivered,
				deliveredPercentage : Math.round(((delivered) / (sent || 1) * 100) * 10) / 10,
				clicks : clicks,
				clicksPercentage : Math.round(((clicks) / (delivered || 1) * 100) * 10) / 10
			};

			const graphStatistics = data.graphStatistic;

			if (graphStatistics) {
				graphStatistics.forEach( graphItem => {
					this.chartData[0].data.push(graphItem.delivered || 0 );
					this.chartData[1].data.push(graphItem.clicked || 0 );
					const formattedDate = (this.groupFilter === 'week')
						? moment(graphItem.period.from).format('L') + ' - ' + moment(graphItem.period.to).format('L')
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
		} );
	}

	// events
	chartClicked (e: any): void {
	}

	chartHovered (e: any): void {
	}

	groupFilterChanged(event) {
		if (this.groupFilter !== event.value) {
			this.groupFilter = event.value;
			this.loadChartData();
		}
	}

	periodSelectorChanged(event) {
		this.periodFilter = event.value;
		this.loadChartData();
	}
}
