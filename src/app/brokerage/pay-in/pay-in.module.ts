import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 

import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PayInRoutingModule } from './pay-in-routing.module';
import { PayInReportComponent } from './pay-in-report/pay-in-report.component';
import { AgentRmaListComponent } from './agent-rma-list/agent-rma-list.component';
import { AddAgentRmaComponent } from './add-agent-rma/add-agent-rma.component';
import { V2PayinSalesListComponent } from './v2-payin-sales-list/v2-payin-sales-list.component';
import { V2PayInRequestListComponent } from './v2-pay-in-request-list/v2-pay-in-request-list.component';

@NgModule({
  declarations: [PayInReportComponent,
    AgentRmaListComponent,
    AddAgentRmaComponent,
    V2PayinSalesListComponent,
    V2PayInRequestListComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule,
    FormsModule, ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    PayInRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PayInModule { }
