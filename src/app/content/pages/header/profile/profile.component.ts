import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/interfaces/user';
import { UtilsService } from '../../../../core/services/utils.service';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../../../../environments/environment';

// TODO fixed template(delete unnecessary fields)
@Component({
	selector: 'm-profile',
	templateUrl: './profile.component.html',
	changeDetection: ChangeDetectionStrategy.Default
})
export class ProfileComponent implements OnInit {
	defaultAvatar = environment.defaultUserImg;
	user: User = {
		fullName: '',
		email: '',
		avatar: '',
		phone: ''
	};
	fieldsForEditing:any = {};
	passwordFields: any = {};

	file: any;
	@Output() onChange: EventEmitter<File> = new EventEmitter<File>();

	constructor(
		private userService: UserService,
		private cd: ChangeDetectorRef,
		private utils: UtilsService,
	    public snackBar: MatSnackBar
	) {
	}

	ngOnInit() {
		this.userService.getUserInfo().subscribe((data) => {
			this.userService.setUser(data);
		});
		this.userService.user.subscribe(user => {
			this.user = user;
			this.fieldsForEditing = user;
			this.cd.detectChanges();
		})
	}

	saveChanges() {
		this.userService.changeUserInfo(this.fieldsForEditing).subscribe((data)=> {
			this.userService.setUser(data);
			this.openSnackBar('Saved', 'Close')
		},error => {
			this.openSnackBar('Error', 'Close')
		})
	}

	fileChangeEvent(event: any): void {
		const icon = new FormData();
		icon.append('webSiteIcon', event.target['files'][0]);
		this.userService.uploadIcon(icon)
			.subscribe(response => {
				this.fieldsForEditing.avatar = response.filePath;
				this.userService.changeUserInfo(this.fieldsForEditing)
			})
	}

	resetChanges() {
		this.fieldsForEditing = this.utils.mergeDeep(this.fieldsForEditing, this.user);
		this.cd.markForCheck()
	}

	changePassword() {
		const oldPassword = this.passwordFields.old;
		const newPassword = this.passwordFields.new;
		const passwordConfirm = this.passwordFields.confirm;


		const passwordValid = this.validatePassword(newPassword, passwordConfirm);

		if (passwordValid) {
			this.userService.changePassword(oldPassword, newPassword).subscribe((response)=> {

				console.log('Response',response);
				if (response.done) {
					this.openSnackBar('Password has been changed', 'Close');
					this.passwordFields = {};
				} else {
					this.openSnackBar('Password change error', 'Close');
				}
			}, error =>  {
				this.openSnackBar('Password change error', 'Close');
			});
		}
	}

	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 2000,
		});
	}

	validatePassword(newPassword, passwordConfirm) {
		let passwordIsValid = (newPassword.length > 6) ? true : false;
		passwordIsValid =  (newPassword === passwordConfirm) ? true : false;
		return passwordIsValid;
	}
}
