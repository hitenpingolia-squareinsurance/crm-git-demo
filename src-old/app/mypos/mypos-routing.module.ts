import { PosEnquiryComponent } from "./pos-enquiry/pos-enquiry.component";
import { AddposComponent } from "./addpos/addpos.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyposComponent } from "./mypos/mypos.component";
import { ChildCreationComponent } from "./child-creation/child-creation.component";
import { PosDataComponent } from "./pos-data/pos-data.component";
import { LspWiseReportComponent } from "./lsp-wise-report/lsp-wise-report.component";

const routes: Routes = [
  { path: "View-pos", component: MyposComponent },
  { path: "View-Lsp", component: LspWiseReportComponent },
  { path: "View-client", component: MyposComponent },
  { path: "Add-pos", component: AddposComponent },
  { path: "Edit-pos/:Id", component: AddposComponent },
  { path: "Add-client", component: AddposComponent },
  { path: "Pos-enquiry", component: PosEnquiryComponent },
  { path: "Client-enquiry", component: PosEnquiryComponent },
  { path: "childcreation", component: ChildCreationComponent },
  { path: "update-request-ba-bp-manager", component: PosDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyposRoutingModule {}
