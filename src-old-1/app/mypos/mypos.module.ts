import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";

import { MyposRoutingModule } from './mypos-routing.module';
import { MyposComponent } from './mypos/mypos.component';
// import { PosDetailsComponent } from '../modals/pos-details/pos-details.component';
// import { PoliciesDataComponent } from '../modals/policies-data/policies-data.component';
import { AddposComponent } from './addpos/addpos.component';
import { PosEnquiryComponent } from './pos-enquiry/pos-enquiry.component';
//  import { PospReportingViewComponent } from './posp-reporting-view/posp-reporting-view.component';
// import { ClipboardModule } from 'ngx-clipboard';
import { ChildCreationPopupComponent } from './child-creation-popup/child-creation-popup.component';
import { ChildCreationComponent } from './child-creation/child-creation.component';
import { PosDataComponent } from "./pos-data/pos-data.component";
import { LspWiseReportComponent } from './lsp-wise-report/lsp-wise-report.component';

// PospReportingViewComponent,
@NgModule({
  declarations: [MyposComponent, AddposComponent, PosEnquiryComponent,ChildCreationPopupComponent,ChildCreationComponent,PosDataComponent, LspWiseReportComponent],
  imports: [
    CommonModule,
    MyposRoutingModule,DataTablesModule,FormsModule,ReactiveFormsModule,MatDialogModule,NgMultiSelectDropDownModule,BsDatepickerModule,SharedModule,
  ],
  // entryComponents: [PosDetailsComponent,PoliciesDataComponent]
  entryComponents: [ChildCreationPopupComponent]

})
export class MyposModule { }
