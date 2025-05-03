import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBourcherHealthComponent } from './bourcher_health/view-bourcher-health/view-bourcher-health.component';
import { ViewHospitalListComponent } from './Hospital-list/view-hospital-list/view-hospital-list.component';
import { ViewPlanBenifitComponent } from './plan-benifit/view-plan-benifit/view-plan-benifit.component';


const routes: Routes = [

  { path: 'Hospital-list', component: ViewHospitalListComponent },
  { path: 'Plan-benifit', component: ViewPlanBenifitComponent },
  { path: 'Bourcher-health', component: ViewBourcherHealthComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteHealthSectionRoutingModule { }
