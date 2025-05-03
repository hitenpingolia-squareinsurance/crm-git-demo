import { ProfileRequestComponent } from './profile-request/profile-request.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
// import { BrowserModule } from './view-profile/view-profile.component';
import { VievEmpDocRequestComponent } from './viev-emp-doc-request/viev-emp-doc-request.component';


const routes: Routes = [
  {path: 'profile', component: ProfileComponent},
  {path: 'profile-requests', component: ProfileRequestComponent},
  {path: 'profile-manager', component: ViewProfileComponent},
  {path: 'profile-banking', component: ViewProfileComponent},
  {path: 'profile-account', component: ViewProfileComponent},
  {path: 'view_docs', component: VievEmpDocRequestComponent},
  {path: 'view_docs_manager', component: VievEmpDocRequestComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
