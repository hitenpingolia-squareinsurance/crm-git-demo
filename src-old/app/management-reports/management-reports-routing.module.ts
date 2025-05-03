import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LeadReportComponent } from "./lead-report/lead-report.component";
import { AgentRetentionComponent } from "./agent-retention/agent-retention.component";
import { AgentConvertedComponent } from "./agent-converted/agent-converted.component";

const routes: Routes = [
  { path: "lead-reports", component: LeadReportComponent },
  { path: "agent-retention", component: AgentRetentionComponent },
  { path: "agent-converted", component: AgentConvertedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementReportsRoutingModule {}
