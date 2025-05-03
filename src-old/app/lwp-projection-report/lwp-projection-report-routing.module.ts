import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LwpProjectionReportComponent } from './lwp-projection-report/lwp-projection-report.component';


const routes: Routes = [
  {path:'lwp' , component:LwpProjectionReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LwpProjectionReportRoutingModule { }
