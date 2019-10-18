import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from "../../../../core/services/user.service";
import { Website } from "../../../../core/interfaces/website";

@Component({
	selector: 'm-website-integration',
	templateUrl: './website-integration.component.html',
	styleUrls: ['./website-integration.component.scss']
})
export class WebsiteIntegrationComponent implements OnInit {

	website: Website = {
		linkForSW: '',
		linkForSWRegistrator: ''
	};

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userServices: UserService,
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		this.userServices.getWebsiteIntegrationInfo(id).subscribe(response => {
			this.website = response.website;
			this.cdr.detectChanges();
		})
	}
}
