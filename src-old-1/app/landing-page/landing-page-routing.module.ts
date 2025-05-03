import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthLangingPageComponent } from './health-langing-page/health-langing-page.component';


const routes: Routes = [
  { path: 'health-landing-page', component: HealthLangingPageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
