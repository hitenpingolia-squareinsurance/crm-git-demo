import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';

import { TravelManagementRoutingModule } from './travel-management-routing.module';
import { TravelManagementComponent } from './travel-management/travel-management.component';
import { TravelViewComponent } from './travel-view/travel-view.component';
import { TravelrequestDetailsComponent } from './travelrequest-details/travelrequest-details.component';
import { TravelrequestMasterComponent } from './travelrequest-master/travelrequest-master.component';
import { TravelClaimsComponent } from './travel-claims/travel-claims.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ClaimViewComponent } from './claim-view/claim-view.component';


@NgModule({
  declarations: [TravelManagementComponent, TravelViewComponent, TravelrequestDetailsComponent, TravelrequestMasterComponent, TravelClaimsComponent, ClaimViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule,
    MatDialogModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    TravelManagementRoutingModule
  ],
  entryComponents : [TravelrequestDetailsComponent]
})
export class TravelManagementModule { }
