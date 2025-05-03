import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { CashlessgarageRoutingModule } from "./cashlessgarage-routing.module";
import { CashlessgarageComponent } from "./cashlessgarage/cashlessgarage.component";

@NgModule({
  declarations: [CashlessgarageComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    CashlessgarageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
})
export class CashlessgarageModule {}
