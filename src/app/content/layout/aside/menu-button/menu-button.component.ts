import {
	Component,
	OnInit,
	AfterViewInit,
	Input, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
	selector: 'm-menu-button',
	templateUrl: './menu-button.component.html',
	styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {
	@Input() item: any;
	@Input() menuAsideMinimized: boolean = false;

	constructor(@Inject(DOCUMENT) private document: Document){};

	ngOnInit() {
		//this.menuAsideMinimized = this.document.body.classList.contains('m-aside-left--minimize');
	}
}
