import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PospReportsComponent } from "./posp-reports/posp-reports.component";
import { BusinessReportsComponent } from "./business-reports/business-reports.component";
import { ActivationReportComponent } from "./activation-report/activation-report.component";
import { SlabReportsComponent } from "./slab-reports/slab-reports.component";
import { NewActivationReportComponent } from "./new-activation-report/new-activation-report.component";
import {QcTransferReportComponent} from "./qc-transfer-report/qc-transfer-report.component";
import { BusinessStuckCasesComponent } from "./business-stuck-cases/business-stuck-cases.component";

const routes: Routes = [
  { path: "Posp-reports", component: PospReportsComponent },
  { path: "business-reports", component: BusinessReportsComponent },
  { path: "business-reports-new", component: BusinessReportsComponent },

  {
    path: "business-reports-new-regulartory",
    component: BusinessReportsComponent,
  },
  // { path: "activation-reports", component: ActivationReportComponent },
  { path: "activation-reports", component: NewActivationReportComponent },
  { path: "slab_report/:Url", component: SlabReportsComponent },
  { path: "business-reports-support", component: BusinessReportsComponent },
  { path: "qc-transfer-report", component: QcTransferReportComponent },
  { path: "business-stuck", component: BusinessStuckCasesComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ReportsRoutingModule {}
