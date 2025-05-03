import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DigitalLeadsRoutingModule } from './digital-leads-routing.module';
import { ShowLeadsComponent } from './show-leads/show-leads.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ShowLeadsComponent],
  imports: [
    CommonModule,DataTablesModule,SharedModule,FormsModule,ReactiveFormsModule,MatDialogModule,
    DigitalLeadsRoutingModule
  ]
})


export class DigitalLeadsModule { }

