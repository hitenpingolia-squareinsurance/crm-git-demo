import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { SharedRoutingModule } from "./shared-routing.module";
import { BmsFilterComponent } from "./bms-filter/bms-filter.component";
import { SquareFilterComponent } from "./square-filter/square-filter.component";
import { BmsFilterV2Component } from "./bms-filter-v2/bms-filter-v2.component";
import { SquareFilterV2Component } from "./square-filter-v2/square-filter-v2.component";
import { BmsFilterV3Component } from "./bms-filter-v3/bms-filter-v3.component";
import { AgentRenewalFilterComponent } from "./agent-renewal-filter/agent-renewal-filter.component";
import { BusinessFilterComponent } from "./business-filter/business-filter.component";
import { CommonFilterComponent } from "./common-filter/common-filter.component";

@NgModule({
  declarations: [
    BmsFilterComponent,
    CommonFilterComponent,
    SquareFilterComponent,
    BmsFilterV2Component,
    SquareFilterV2Component,
    BmsFilterV3Component,
    AgentRenewalFilterComponent,
    BusinessFilterComponent,
  ],

  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
  ],

  exports: [
    BmsFilterComponent,
    SquareFilterComponent,
    BmsFilterV2Component,
    SquareFilterV2Component,
    AgentRenewalFilterComponent,
    BmsFilterV3Component,
    BusinessFilterComponent,
    CommonFilterComponent,
  ],
})
export class SharedModule {}
