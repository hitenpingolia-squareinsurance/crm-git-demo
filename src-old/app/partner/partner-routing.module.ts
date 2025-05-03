import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RmAgentCreationComponent } from './rm-agent-creation/rm-agent-creation.component';
import { AgentReportComponent } from './agent-report/agent-report.component';
import { RmAgentEditComponent } from './rm-agent-edit/rm-agent-edit.component';
import { FleetComponent } from './fleet/fleet.component';
import { FleetCreationComponent } from './fleet/fleet-creation/fleet-creation.component';
import { SpPosConversionComponent } from './sp-pos-conversion/sp-pos-conversion.component';
import { SpcQcReportComponent } from './spc-qc-report/spc-qc-report.component';

const routes: Routes = [
  {path:'report',component:AgentReportComponent},
  {path:'creation',component:RmAgentCreationComponent},
  {path:'rm/edit-agent/:Id',component:RmAgentEditComponent},

  {path:'fleet/report',component:FleetComponent},
  {path:'fleet/creation',component:FleetCreationComponent},

  {path:'sp-pos-conversion-report', component: SpPosConversionComponent },
  {path:'spc-qc-report', component: SpcQcReportComponent },

  
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
