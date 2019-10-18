import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ICampaign } from '../../../../../../core/interfaces/campaign';

export interface DialogData {
  campaign: ICampaign;
}

@Component({
  selector: 'm-campaigns-modal-container',
  templateUrl: './campaigns-modal-container.component.html',
  styleUrls: ['./campaigns-modal-container.component.scss']
})
export class CampaignsModalContainerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CampaignsModalContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

  // TODO: close button for modal
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

