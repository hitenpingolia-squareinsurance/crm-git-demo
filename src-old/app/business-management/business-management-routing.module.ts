import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LifeRenewalsComponent } from "./life-renewals/life-renewals.component";

import { SrReportComponent } from "./sr-report/sr-report.component";

import { LifeGroupSrComponent } from "./life-group-sr/life-group-sr.component";
import { HealthGroupSrComponent } from "./health-group-sr/health-group-sr.component";
import { PaGroupSrComponent } from "./pa-group-sr/pa-group-sr.component";
import { LifeRenewalsReportComponent } from "./life-renewals-report/life-renewals-report.component";
import { LifeProductsListComponent } from "./life-products-list/life-products-list.component";
import { LifeRenewalReportComponent } from "./life-renewal-report/life-renewal-report.component";
import { HealthInstallmentReportComponent } from "./health-installment-report/health-installment-report.component";
import { QcTransferReportComponent } from "./qc-transfer-report/qc-transfer-report.component";

const routes: Routes = [
  { path: "life-renewals-report", component: LifeRenewalsReportComponent },

  { path: "premium-due", component: LifeRenewalsComponent },
  { path: "renewals", component: LifeRenewalsComponent },
  { path: "life-renewal-report", component: LifeRenewalReportComponent },
  { path: "life-products", component: LifeProductsListComponent },
  { path: "life-insurance/sr-qc-report", component: SrReportComponent },
  { path: "general-insurance/sr-qc-report", component: SrReportComponent },
  { path: "health-group-sr", component: HealthGroupSrComponent },
  { path: "life-group-sr", component: LifeGroupSrComponent },
  { path: "pa-group-sr", component: PaGroupSrComponent },
  { path: "health-installment-report", component: HealthInstallmentReportComponent },
  { path: "qc-transfer-report", component: QcTransferReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessManagementRoutingModule {}
