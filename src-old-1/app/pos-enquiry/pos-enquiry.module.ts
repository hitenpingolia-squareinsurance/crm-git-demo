import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { PosEnquiryRoutingModule } from './pos-enquiry-routing.module';
import { PosDetailsComponent } from './pos-details/pos-details.component';

@NgModule({
  declarations: [PosDetailsComponent],
  imports: [
    CommonModule,DataTablesModule,MatDialogModule,FormsModule,ReactiveFormsModule,SharedModule,
    PosEnquiryRoutingModule
  ]
})
export class PosEnquiryModule { }
