import { Directive, ElementRef, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MenuAsideService } from "../services/layout/menu-aside.service";

@Directive({
	selector: '[mMenuAsideToggle]'
})
export class MenuAsideToggleDirective implements AfterViewInit, OnDestroy {
	toggle: any;
	constructor(
		private el: ElementRef,
		private menuAsideService: MenuAsideService,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngAfterViewInit(): void {
		this.toggle = new mToggle(this.el.nativeElement, {
			target: 'body',
			targetState: 'm-brand--minimize m-aside-left--minimize',
			togglerState: 'm-brand__toggler--active'
		});

		this.el.nativeElement.addEventListener('click', e => {
			setTimeout(()=> {
				this.menuAsideService.setLeftAsideMenuMinimized(this.document.body.classList.contains('m-aside-left--minimize'))
			}, 100);

		});
	}

	ngOnDestroy(): void { }
}
