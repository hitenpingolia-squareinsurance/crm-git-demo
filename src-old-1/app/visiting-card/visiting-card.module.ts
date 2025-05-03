import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { VisitingCardRoutingModule } from "./visiting-card-routing.module";
import { ViewVisitingCardComponent } from "./view-visiting-card/view-visiting-card.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { RequestApprovalComponent } from "./request-approval/request-approval.component";

@NgModule({
  declarations: [ViewVisitingCardComponent, RequestApprovalComponent],
  imports: [
    CommonModule,
    VisitingCardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule,
  ],
  entryComponents: [RequestApprovalComponent],
})
export class VisitingCardModule {}
