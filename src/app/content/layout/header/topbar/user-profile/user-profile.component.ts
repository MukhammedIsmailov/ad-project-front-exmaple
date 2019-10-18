import { AuthenticationService } from '../../../../../core/auth/authentication.service';
import { environment } from '../../../../../../environments/environment';
import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { UserService } from "../../../../../core/services/user.service";

@Component({
	selector: 'm-user-profile',
	templateUrl: './user-profile.component.html',
	changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileComponent implements OnInit {
	@HostBinding('class')
	// tslint:disable-next-line:max-line-length
	classes = 'm-nav__item m-topbar__user-profile m-topbar__user-profile--img m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light';

	@HostBinding('attr.m-dropdown-toggle') attrDropdownToggle = 'click';

	avatar: string = '';
	defaultAvatar: string = environment.defaultUserImg;
	avatarBg: SafeStyle = '';
	fullName: string;
	email: string;

	@ViewChild('mProfileDropdown') mProfileDropdown: ElementRef;

	constructor (
		private router: Router,
		private authService: AuthenticationService,
		private sanitizer: DomSanitizer,
		private userService: UserService,
		private cd: ChangeDetectorRef
	) {}

	ngOnInit (): void {
		if (!this.avatarBg) {
			this.avatarBg = this.sanitizer.bypassSecurityTrustStyle('url(./assets/app/media/img/misc/user_profile_bg.jpg)');
		}
		this.userService.getUserInfo().subscribe((data) => {
			this.userService.setUser(data);
		});
		this.userService.user.subscribe(user => {
			this.avatar = user.avatar;
			this.fullName = user.fullName;
			this.email = user.email;
			this.cd.detectChanges();
		});
	}

	public logout () {
		this.authService.logout(true);
	}
}
