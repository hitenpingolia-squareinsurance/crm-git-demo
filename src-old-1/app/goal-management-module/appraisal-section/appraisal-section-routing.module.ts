import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RatingsComponent } from './ratings/ratings.component';
import { KraMasterComponent } from './kra-master/kra-master.component';
import { HrRatingsComponent } from './hr-ratings/hr-ratings.component';
import { EmployeeKraComponent } from './employee-kra/employee-kra.component';
import { PmsOtpGuard } from 'src/app/guards/pmsotp.guard';

// const routes: Routes = [
//   { path: 'ratings', component: RatingsComponent },
//   { path: 'hr-ratings', component: HrRatingsComponent },
//   { path: 'kra-master', component: KraMasterComponent },
//   { path: 'kra-list', component: EmployeeKraComponent },
// ];

const routes: Routes = [
  { 
    path: 'ratings', 
    component: RatingsComponent ,
    canActivate: [PmsOtpGuard]
  },
  { 
    path: 'hr-ratings', 
    component: HrRatingsComponent ,
    canActivate: [PmsOtpGuard]
  },
  {
    path: 'kra-master', 
    component: KraMasterComponent,
    canActivate: [PmsOtpGuard]
  },
  { 
    path: 'kra-list', 
    component: EmployeeKraComponent,
    canActivate: [PmsOtpGuard] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraisalSectionRoutingModule { }
