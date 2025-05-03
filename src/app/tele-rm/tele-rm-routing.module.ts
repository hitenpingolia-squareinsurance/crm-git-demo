import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeleBusniessReportsComponent } from './tele-busniess-reports/tele-busniess-reports.component';
import { ViewTeleRmComponent } from './view-tele-rm/view-tele-rm.component';

const routes: Routes = [

  { path: 'View-Tele-Rm', component: ViewTeleRmComponent },
  { path: 'View-Tele-Rm-Reports', component: ViewTeleRmComponent },
  { path: 'busniess-reports', component: TeleBusniessReportsComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TeleRmRoutingModule { }
