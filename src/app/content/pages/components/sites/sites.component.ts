import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {StatisticsService} from "../../../../core/services/statistics.service";
import {UserService} from "../../../../core/services/user.service";
import * as moment from "moment";
import {BaseChartDirective} from "ng2-charts";
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";


@Component({
	selector: 'm-sites',
	templateUrl: './sites.component.html',
	styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
	@ViewChild(BaseChartDirective) chart: BaseChartDirective;
	@ViewChild(MatPaginator) paginator: MatPaginator;



	id = +this.route.snapshot.paramMap.get('id');
	public siteStatistics: any = {};
	public siteStatisticsForCards: any = {};
	public periodStatistics: any = {};
	public siteName = this.id;
	public currentStatus: string = 'any';
	private subscribersFormatedData: any;
	public isOpenFilter: boolean = false;
	public filterCountry: string = '';
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

	public groupFilter = 'new';
	public periodFilter = 'today';

	public groups = [
		{value: 'all', viewValue: 'Number of subscribers'},
		{value: 'new', viewValue: 'New subscribers'},
	]

	public periods = [
		{value: 'today', viewValue: 'Today'},
		{value: 'yesterday', viewValue: 'Yesterday'},
		{value: 'week', viewValue: 'Week'},
		{value: 'month', viewValue: 'Month'},
	]

	displayedColumns: string[] = ['browser', 'region', 'date', 'options'];
	subscribersData = new MatTableDataSource<any>([
	]);

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
		private statisticsService: StatisticsService,
		private userService: UserService,
		public ref: ChangeDetectorRef
	) {

	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.id = params.id;
			this.loadChartData();
			this.loadTableData()
		});
		this.subscribersData.paginator = this.paginator;
	}

	detectChanges(){
		if (!this.ref['destroyed']) {
			this.ref.detectChanges();
		}
	}

	loadTableData() {
		this.loadingSpinner = true;
		this.userService.getWebsiteIntegrationInfo(this.id).subscribe((data:any) => {
			if (data) {
				const subscribers = data.website.subscribers;

				const subscribersFormatedData = subscribers.map((item) => {
					return {
						id: item._id,
						browser: item.browser,
						os: item.os,
						date: moment(item.date).format('l'),
						time: moment(item.date).format('HH:mm'),
						region: item.region || 'Unrecognized region',
						ip: item.ip || 'Unrecognized IP',
						unsubscribeDate: (item.unsubscribeDate ? moment(item.date).format('l') : '')
					}
				});
				this.subscribersFormatedData = subscribersFormatedData;
				this.subscribersData = new MatTableDataSource<any>(subscribersFormatedData);
				this.subscribersData.paginator = this.paginator;
				setTimeout(() => {
					this.loadingSpinner = false;
					this.detectChanges();
				}, 1000);
				this.detectChanges();
			}
		}, (error) => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000);
		})
	}
	public filterData() : void {
		const newSubscribers = this.subscribersFormatedData.filter(item => {
			const currentCountry = item.region.country.toLocaleLowerCase();
			const filterCountry = this.filterCountry.toLocaleLowerCase();
			let isValidStatus;
			 if (this.currentStatus === 'any') {
				 isValidStatus = true;
			 } else if (this.currentStatus === 'active') {
				 isValidStatus = !!!item.unsubscribeDate;
			 } else if (this.currentStatus === 'disabled') {
				 isValidStatus = !!item.unsubscribeDate;
			 }
			return currentCountry.includes(filterCountry) && isValidStatus;
		});
		this.subscribersData = new MatTableDataSource<any>(newSubscribers);
		this.subscribersData.paginator = this.paginator;
		this.isOpenFilter = false;
	}

	public resetFilter() : void {
		this.currentStatus = 'any';
		this.filterCountry = '';
	}
	public cancelFilter() : void {
		this.currentStatus = 'any';
		this.filterCountry = '';
		this.subscribersData = new MatTableDataSource<any>(this.subscribersFormatedData);
		this.subscribersData.paginator = this.paginator;
		this.isOpenFilter = false;
	}
	loadChartData() {
		this.loadingSpinner = true;
		this.statisticsService.getSiteStatistics(this.id, this.periodFilter).subscribe((data:any) => {
			this.siteStatistics = data;
			this.renderStatistics();
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000)
		}, (error) => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000)
		});
	}

	renderStatistics() {
		if (this.siteStatistics) {
			this.siteName = this.siteStatistics.url || this.id
			this.chartLabels = [];

			if (this.groupFilter === 'new') {
				this.chartData = [
					{data: [], label: 'New', backgroundColor:'#F59E07' },
				];
			} else {
				this.chartData = [
					{data: [], label: 'Subscribers', backgroundColor:'#2F35EB'},
					{data: [], label: 'New', backgroundColor:'#F59E07'},
					{data: [], label: 'Unsubscribers', backgroundColor:'#F50707'}
				];
			}

			const allSubscribers = parseInt(this.siteStatistics.allSubscribers) || 0;
			const activeSubscribers = parseInt(this.siteStatistics.activeSubscribers) || 0;
			const newSubscribersCount = parseInt(this.siteStatistics.newSubscribersCount) || 0;
			const unsubscribeCount = parseInt(this.siteStatistics.unsubscribeCount) || 0;
			const campaigns = parseInt(this.siteStatistics.campaigns) || 0;

			this.siteStatisticsForCards = {
				allSubscribers,
				activeSubscribers,
				newSubscribersCount,
				unsubscribeCount,
				campaigns
			}

			const graphStatistics = this.siteStatistics.dataForGraph;

			let periodNewSubscribersCount =  0;
			let periodUnsubscribeCount = 0;

			if (graphStatistics) {
				graphStatistics.forEach(graphItem => {

					periodNewSubscribersCount += graphItem.new || 0;
					periodUnsubscribeCount += graphItem.unsubscribed || 0;

					if (this.groupFilter === 'new') {
						this.chartData[0].data.push(graphItem.new || 0);
					} else {
						this.chartData[0].data.push(graphItem.total || 0);
						this.chartData[1].data.push(graphItem.new || 0);
						this.chartData[2].data.push(graphItem.unsubscribed || 0);
					}
					const formattedDate = (this.periodFilter === 'today' || this.periodFilter === 'yesterday')
						? moment(graphItem.date).format('HH:00') + ' - ' + moment(graphItem.date).add(1, 'hour').format('HH:00')
						: moment(graphItem.date).format('L');
					this.chartLabels.push(formattedDate);
				})

				setTimeout(() => {
					if (this.chart && this.chart.chart && this.chart.chart.config) {
						this.chart.chart.config.data.labels = this.chartLabels;
						this.chart.chart.config.data.datasets = this.chartData;
						this.chart.chart.update();
					}
				});

				this.periodStatistics = {
					periodNewSubscribersCount,
					periodUnsubscribeCount
				}
			}
			this.detectChanges();
		}
	}

	setPaginator() {
		setTimeout(() => this.subscribersData.paginator = this.paginator);
	}

	// events
	chartClicked (e: any): void {
	}

	chartHovered (e: any): void {
	}

	groupSelectorChanged(event) {
		this.groupFilter = event.value
		this.renderStatistics();
	}

	periodSelectorChanged(event) {
		this.periodFilter = event.value
		this.loadChartData();
	}

	deleteSubscriber(subscriberID) {
		this.loadingSpinner = true;
		this.userService.deleteWebsiteSubscriber(this.id, subscriberID).subscribe((response)=> {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.loadTableData();
				this.detectChanges();
			}, 1000)
		}, (error) => {
			setTimeout(() => {
				this.loadingSpinner = false;
				this.detectChanges();
			}, 1000)
		})
	}


}
