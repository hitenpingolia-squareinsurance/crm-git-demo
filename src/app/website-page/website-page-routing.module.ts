import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { SectionComponent } from './section/section.component';
import { ViewSectionDetailsComponent } from './view-section-details/view-section-details.component';
import { CompanyMessageComponent } from './company-message/company-message.component';
const routes: Routes = [

  { path: "Pages", component: PagesComponent },
  { path: "section/:Id", component: SectionComponent },
  { path: 'view-section/:Id', component: ViewSectionDetailsComponent },
  { path: 'company-msg',component:CompanyMessageComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsitePageRoutingModule { }
