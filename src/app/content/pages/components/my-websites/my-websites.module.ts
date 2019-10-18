import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyWebsitesComponent} from './my-websites.component';

@NgModule({
	imports: [CommonModule],
	exports: [MyWebsitesComponent],
	providers: [],
	declarations: [MyWebsitesComponent]
})
export class MyWebsitesModule {}
