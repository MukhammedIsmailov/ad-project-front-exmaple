import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorage } from './token-storage.service';


@Injectable()
export class AuthGuard implements CanActivate {

	private token: any;

	constructor(
		private router: Router,
		private tokenStorage: TokenStorage
	) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
		this.tokenStorage.getAccessToken().subscribe(token => this.token = token);
		if (this.token) {
			return true;
		}
		this.router.navigate(['/login']);
		return false;
	}
}
