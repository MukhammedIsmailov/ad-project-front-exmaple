import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../core/services/utils.service';
import { environment } from '../../../../environments/environment';
import { UserService } from "../../../core/services/user.service";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: 'm-add-new-website',
	templateUrl: './add-new-website.component.html',
	styleUrls: ['./add-new-website.component.scss']
})
export class AddNewWebsiteComponent implements OnInit {
	defaultImg: string = environment.defaultImg;
	selectedProtocol: string;
	websiteUrl = new FormControl('', [Validators.required]);
	validationError = { error: '' };
	isUrlValid = false;

	constructor(
		private utils: UtilsService,
		private userServices: UserService,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private dom: DomSanitizer
) {
	}

// Emit an event when a file has been picked. Here we return the file itself
	@Output() onChange: EventEmitter<File> = new EventEmitter<File>();

	// Uses FileReader to read the file from the input
	source: any = '';
	file: any;
	imageChangedEvent: any = '';
	croppedImage: any = '';
// If the input has changed(file picked) we project the file into the img previewer
	updateSource($event: Event) {
		// We access he file with $event.target['files'][0]
		this.projectImage($event.target['files'][0]);
		this.file = $event.target['files'][0];
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}
	imageCropped(event) {
		this.croppedImage = event.file;
		this.source = this.dom.bypassSecurityTrustUrl(URL.createObjectURL(this.croppedImage))
	}

	projectImage(file: File) {
		const reader = new FileReader;
		reader.onload = (e: any) => {
			// Simply set e.target.result as our <img> src in the layout
			this.source = e.target.result;
			this.onChange.emit(file);
		};
		// This will process our file and get it's attributes/data
		reader.readAsDataURL(file);
	}

	checkUrl() {
		this.utils.validatorForURL(this.selectedProtocol, this.websiteUrl.value).then(
			result => {
				this.validationError = result;
				this.isUrlValid = this.validationError.error === '';
				this.cdr.detectChanges();
			}
		);
		this.cdr.detectChanges();
	}

	ngOnInit() {
	}

	/**
	 * if user uploaded icon => upload it into server,
	 * save valid website into DB,
	 * redirect to integration page
	 */
	addWebSiteToDataBase() {
		if (this.croppedImage) {
			const icon = new FormData();
			icon.append('webSiteIcon', this.croppedImage);
			this.userServices.uploadIcon(icon)
				.subscribe(response => {
					const website = {
						url: this.selectedProtocol + this.websiteUrl.value,
						icon: response.filePath
					};
					this.userServices.saveWebSiteToDataBase(website)
						.subscribe(response => {
							this.router.navigate(['add-new/integration', { id: response.websiteID }],)
						})
				});
		} else {
			const website = {
				url: this.selectedProtocol + this.websiteUrl.value,
			};
			this.userServices.saveWebSiteToDataBase(website)
				.subscribe(response => {
					this.router.navigate(['add-new/integration', { id: response.websiteID }],)
				})
		}
	}
}
