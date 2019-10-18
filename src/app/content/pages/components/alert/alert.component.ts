import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AlertService } from "../../../../core/services/alert.service";
import { Subscription } from "rxjs";

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.scss'],
	animations: [
		trigger(
			'alertAnimation', [
				transition(':enter', [
					style({ 'margin-top': '-50px', opacity: 0 }),
					animate('500ms', style({ 'margin-top': 0, opacity: 1 }))
				]),
				transition(':leave', [
					style({ 'margin-top': 0, opacity: 1 }),
					animate('500ms', style({ 'margin-top': '-50px', opacity: 0 }))
				])
			]
		)
	],
})
export class AlertComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	message: any;

	constructor(
		private alertService: AlertService,
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.subscription = this.alertService.getMessage().subscribe(message => {
			this.message = message;
			setTimeout(() => this.message = false, 2000);
			this.cdr.detectChanges();
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
