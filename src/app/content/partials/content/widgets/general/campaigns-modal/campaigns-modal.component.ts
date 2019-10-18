import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { ICampaign } from '../../../../../../core/interfaces/campaign';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'm-campaigns-modal',
  templateUrl: './campaigns-modal.component.html',
  styleUrls: ['./campaigns-modal.component.scss']
})
export class CampaignsModalComponent implements OnInit {
  @Input() campaign: ICampaign;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['title', 'body', 'icon', 'link'];
  campaignRows = new MatTableDataSource<any>([]);

  constructor() { }

  ngOnInit() {
    this.campaignRows = new MatTableDataSource<any>(this.campaign.pushNotifications);
    this.campaignRows.paginator = this.paginator;
  }
}
