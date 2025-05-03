import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPlanBenifitComponent } from './PA/view-plan-benifit/view-plan-benifit.component';
import { ViewBourcherHealthComponent } from './PA/bourcher_health/view-bourcher-health/view-bourcher-health.component';
import { ViewHospitalListComponent } from './PA/Hospital-list/view-hospital-list/view-hospital-list.component';

import { ViewHighlightComponent } from './PA/highlight-label-new/view-highlight/view-highlight.component';
import { ViewYoutubeComponent } from './PA/youtube-url-new/view-youtube/view-youtube.component';
const routes: Routes = [

  { path: 'plan-benefit', component: ViewPlanBenifitComponent },
  { path: '', component: ViewPlanBenifitComponent },
  { path: 'bourcher', component: ViewBourcherHealthComponent },
  { path: 'hospital', component: ViewHospitalListComponent },
  { path: 'highlight-label', component: ViewHighlightComponent },
  { path: 'youtube-url', component: ViewYoutubeComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteProductIntegrationRoutingModule { }
