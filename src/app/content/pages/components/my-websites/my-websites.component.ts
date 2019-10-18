import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-my-websites',
  templateUrl: './my-websites.component.html',
  styleUrls: ['./my-websites.component.scss']
})
export class MyWebsitesComponent implements OnInit {

	@Input() sites: any;
	@Output() delete = new EventEmitter();
	constructor() { }
  ngOnInit() {
  }

}
