import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";

import { MatTabsModule } from '@angular/material/tabs';
import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from "../shared/shared.module";

import { AdvisorsRoutingModule } from './advisors-routing.module';
import { MyAdvisorsComponent } from './my-advisors/my-advisors.component';
import { RemoveAdvisorComponent } from './remove-advisor/remove-advisor.component';
import { ViewTeleLeadsComponent } from './view-tele-leads/view-tele-leads.component';
import { MatTooltipModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [MyAdvisorsComponent, RemoveAdvisorComponent, ViewTeleLeadsComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,SharedModule,MatTabsModule,NgxSpinnerModule,BsDatepickerModule,MatToolbarModule,
    AdvisorsRoutingModule,MatListModule,MatDividerModule,ScrollingModule,MatIconModule,MatMenuModule,MatProgressSpinnerModule,MatPaginatorModule,MatTooltipModule
  ]
})

export class AdvisorsModule { }
