import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {NgxPermissionsGuard} from 'ngx-permissions';
import {ProfileComponent} from './header/profile/profile.component';
import {ErrorPageComponent} from './snippets/error-page/error-page.component';
import {AddNewWebsiteComponent} from './add-new-website/add-new-website.component';
import {AuthGuard} from '../../core/auth/auth-guard';
import {LoginGuard} from '../../core/auth/login-guard';
import {WebsiteIntegrationComponent} from "./components/website-integration/website-integration.component";
import {SendPushComponent} from "./components/send-push/send-push.component";
import {CampaignsComponent} from "./components/campaigns/campaigns.component";
import {ServiceCampaignsComponent} from './components/service-campaigns/service-campaigns.component';
import {SitesComponent} from "./components/sites/sites.component"
import {SitesSettingsComponent} from "./components/sites-settings/sites-settings.component";
import {PushDetailsComponent} from "./components/push-details/push-details.component";
import {ServicesPageComponent} from "./components/services-page/services-page.component";
import {CampaignPageComponent} from "./components/campaign-page/campaign-page.component";
import {AnalyticsPageComponent} from './components/analytics-page/analytics-page.component';

import {AutomationComponent} from './components/automation/automation.component';
import {AddAutomationComponent} from './components/add-automation/add-automation.component';
import {AutomationOverviewComponent} from './components/automation-overview/automation-overview.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './components/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'my-campaigns',
        component: CampaignsComponent,
      },
      {
        path: 'service-campaigns',
        component: ServiceCampaignsComponent,
      },
      {
        path: 'service-campaign/:id',
        component: CampaignPageComponent,
      },
      {
        path: 'analytics',
        component: AnalyticsPageComponent,
      },
      // {
      // 	path: 'automation',
      // 	component: AutomationComponent,
      // },
      // {
      // 	path: 'automation/add',
      // 	component: AddAutomationComponent,
      // },
      {
        path: 'add-new',
        component: AddNewWebsiteComponent
      },
      // {
      // 	path: 'automation-overview',
      // 	component: AutomationOverviewComponent
      // },
      {
        path: 'add-new/integration',
        component: WebsiteIntegrationComponent
      },
      {
        path: 'send-push',
        component: SendPushComponent
      },
      {
        path: 'sites/:id',
        component: SitesComponent
      },
      {
        path: 'sites-settings/:id',
        component: SitesSettingsComponent
      },

      {
        path: 'push-details/:id',
        component: PushDetailsComponent
      },
      {
        path: 'services',
        component: ServicesPageComponent
      },
    ]
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: '404',
    component: ErrorPageComponent
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
