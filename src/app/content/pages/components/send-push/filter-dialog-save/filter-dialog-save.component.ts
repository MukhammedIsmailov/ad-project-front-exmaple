import {Component, OnInit, Inject, Output, EventEmitter, Input} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
	selector: 'm-filter-dialog-save',
	templateUrl: './filter-dialog-save.component.html',
	styleUrls: ['./filter-dialog-save.component.scss']
})
export class FilterDialogSaveComponent implements OnInit {

	filterName: string = '';

	@Output() saved = new EventEmitter<string>();

	constructor(
		public dialogRef: MatDialogRef<FilterDialogSaveComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.filterName = data.filterName
	}

	ngOnInit() {
	}


	onSaveClick() {
		if (this.filterName) {
			this.dialogRef.close(this.filterName);
		}
	}

	onCloseClick() {
		this.dialogRef.close();
	}
}
