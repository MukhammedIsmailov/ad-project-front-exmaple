import {LayoutModule} from '../layout/layout.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {PartialsModule} from '../partials/partials.module';
import {ActionComponent} from './header/action/action.component';
import {ProfileComponent} from './header/profile/profile.component';
import {MailModule} from './components/apps/mail/mail.module';
import {AutomationOverviewComponent} from './components/automation-overview/automation-overview.component';
import {ECommerceModule} from './components/apps/e-commerce/e-commerce.module';
import {CoreModule} from '../../core/core.module';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ErrorPageComponent} from './snippets/error-page/error-page.component';
import {AddNewWebsiteComponent} from './add-new-website/add-new-website.component';
import {AlertComponent} from "./components/alert/alert.component";
import {WebsiteIntegrationComponent} from "./components/website-integration/website-integration.component";
import {SendPushComponent} from "./components/send-push/send-push.component";
import {ImageCropperModule} from 'ngx-image-cropper';
import {CampaignsComponent} from './components/campaigns/campaigns.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {SitesComponent} from './components/sites/sites.component';
import {ChartsModule} from 'ng2-charts';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SitesSettingsComponent} from './components/sites-settings/sites-settings.component';
import {NgxLoadingModule} from 'ngx-loading';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {PushDetailsComponent} from './components/push-details/push-details.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {FilterDialogSaveComponent} from './components/send-push/filter-dialog-save/filter-dialog-save.component';
import {MatDialogModule} from "@angular/material";
import {AutomationComponent} from './components/automation/automation.component';
import {AddAutomationComponent} from './components/add-automation/add-automation.component';
import {ServicesPageComponent} from './components/services-page/services-page.component';
import {ServiceCampaignsComponent} from './components/service-campaigns/service-campaigns.component';
import {NgbdModalContentComponent} from './components/ngbootstrap/modal/modal.component';
import {CampaignsModalContainerComponent} from '../partials/content/widgets/general/campaigns-modal-container/campaigns-modal-container.component';
import {CampaignPageComponent} from './components/campaign-page/campaign-page.component';
import {AnalyticsPageComponent} from './components/analytics-page/analytics-page.component';
import {CommonAnalyticsComponent} from './components/analytics-page/common-analytics/common-analytics.component';
import {CountriesAnalyticsComponent} from './components/analytics-page/countries-analytics/countries-analytics.component';
import { AddServiceComponent } from './components/services-page/add-service/add-service.component';

@NgModule({
  declarations: [
    PagesComponent,
    ActionComponent,
    ProfileComponent,
    ErrorPageComponent,
    AddNewWebsiteComponent,
    AlertComponent,
    WebsiteIntegrationComponent,
    SendPushComponent,
    CampaignsComponent,
    AutomationComponent,
    AddAutomationComponent,
    SitesComponent,
    SitesSettingsComponent,
    PushDetailsComponent,
    FilterDialogSaveComponent,
    PushDetailsComponent,
    AutomationOverviewComponent,
    ServicesPageComponent,
    ServiceCampaignsComponent,
    CampaignPageComponent,
    AnalyticsPageComponent,
    CommonAnalyticsComponent,
    CountriesAnalyticsComponent,
    AddServiceComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    PagesRoutingModule,
    CoreModule,
    LayoutModule,
    PartialsModule,
    MailModule,
    ECommerceModule,
    AngularEditorModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatPaginatorModule,
    ChartsModule,
    MatButtonToggleModule,
    MatSelectModule,
    NgbModule,
    MatTableModule,
    NgxLoadingModule.forRoot({}),
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDialogModule,
  ],
  providers: [],
  entryComponents: [
    CampaignsModalContainerComponent
  ]
})
export class PagesModule { }
