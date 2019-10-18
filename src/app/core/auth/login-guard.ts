import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorage } from './token-storage.service';


@Injectable()
export class LoginGuard implements CanActivate {

	private token: any;

	constructor(
		private router: Router,
		private tokenStorage: TokenStorage
	) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
		this.tokenStorage.getAccessToken().subscribe(token => this.token = token);
		if (this.token) {
			this.router.navigate(['/']);
			return false;
		}
		return true;
	}
}
