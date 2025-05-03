import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';

const routes: Routes = [

  
  { path: 'users', component: UsersComponent },
  { path: 'pos_leads', component: UsersComponent },
  { path: 'pos_social_leads', component: UsersComponent },
  { path: 'new_pos', component: UsersComponent },
  { path: 'verified_pos', component: UsersComponent },
  { path: 'all_pos', component: UsersComponent },
  { path: 'under_training_pos', component: UsersComponent },
  { path: 'verified_posc', component: UsersComponent },
  { path: 'advisor_pos', component: UsersComponent },
  { path: 'master_advisor_pos', component: UsersComponent },
  { path: 'incomplete_pos', component: UsersComponent },
  { path: 'rejected_pos', component: UsersComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UseragentRoutingModule { }
