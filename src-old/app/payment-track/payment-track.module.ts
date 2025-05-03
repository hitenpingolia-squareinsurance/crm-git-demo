import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";


import { PaymentTrackRoutingModule } from './payment-track-routing.module';
import { FailedpaymenttracklogComponent } from "./failedpaymenttracklog/failedpaymenttracklog.component";
import { MappinglogComponent } from './mappinglog/mappinglog.component';


@NgModule({
  declarations: [FailedpaymenttracklogComponent, MappinglogComponent],
  imports: [
    CommonModule,SharedModule,
    PaymentTrackRoutingModule,BsDatepickerModule,
    FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,

  ],
})
export class PaymentTrackModule { }
