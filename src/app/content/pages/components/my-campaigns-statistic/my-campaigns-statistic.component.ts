import { Component, OnInit, Input } from '@angular/core';
import {CampaignStatistic} from '../../../../core/interfaces/campaignStatistic';

@Component({
  selector: 'm-my-campaigns-statistic',
  templateUrl: './my-campaigns-statistic.component.html',
  styleUrls: ['./my-campaigns-statistic.component.scss']
})
export class MyCampaignsStatisticComponent implements OnInit {

	//TODO: campaignStatistic
	@Input() campaignStatistic: CampaignStatistic;
  constructor() { }

  ngOnInit() {
  }

}
