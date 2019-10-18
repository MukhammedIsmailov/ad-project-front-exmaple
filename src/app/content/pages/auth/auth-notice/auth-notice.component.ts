import { ChangeDetectorRef, Component, OnInit, Output, OnDestroy } from '@angular/core';
import { AuthNoticeService } from '../../../../core/auth/auth-notice.service';
import { AuthNotice } from '../../../../core/auth/auth-notice.interface';
import { Subscription } from 'rxjs';

@Component({
	selector: 'm-auth-notice',
	templateUrl: './auth-notice.component.html',
	styleUrls: ['./auth-notice.component.scss']
})
export class AuthNoticeComponent implements OnInit, OnDestroy {
	@Output() type: string;
	@Output() message: string;

	private noticeSubscription: Subscription;

	constructor(
		public authNoticeService: AuthNoticeService,
		public ref: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.noticeSubscription = this.authNoticeService.onNoticeChanged$.subscribe(
			(notice: AuthNotice) => {
				this.message = notice.message;
				this.type = notice.type;
				this.ref.detectChanges();
			}
		);
	}

	ngOnDestroy() {
		this.noticeSubscription.unsubscribe();
		this.authNoticeService.setNotice('', '');
	}
}
