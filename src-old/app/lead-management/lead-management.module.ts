import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
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
import { LeadManagementRoutingModule } from './lead-management-routing.module';
import { TransferLeadComponent } from './transfer-lead/transfer-lead.component';
import { ViewManagerLeadsComponent } from './view-manager-leads/view-manager-leads.component';
import { ViewRmLeadsComponent } from './view-rm-leads/view-rm-leads.component';
import { MatTooltipModule } from '@angular/material';
import { CallProgressComponent } from '../modals/lms-related/call-progress/call-progress.component';
import { AddLeadsComponent } from './add-leads/add-leads.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddExcelLeadaComponent } from './add-excel-leada/add-excel-leada.component';
import { LmsReportComponent } from './lms-report/lms-report.component';
import { LmsDashboardComponent } from './lms-dashboard/lms-dashboard.component';
import { ExtraLeadsComponent } from './extra-leads/extra-leads.component';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';



@NgModule({
  declarations: [TransferLeadComponent, ViewManagerLeadsComponent, ViewRmLeadsComponent, CallProgressComponent, AddLeadsComponent, AddExcelLeadaComponent, LmsReportComponent, LmsDashboardComponent, ExtraLeadsComponent,CampaignViewComponent],
  imports: [
    MatPaginatorModule,
    CommonModule,
    LeadManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule,
    MatDialogModule,
    MatToolbarModule, MatListModule, MatDividerModule, ScrollingModule, MatIconModule,
    MatMenuModule, MatProgressSpinnerModule, MatTabsModule, NgxSpinnerModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule,
    MatTooltipModule
  ],
  entryComponents: [TransferLeadComponent, CallProgressComponent,AddLeadsComponent,AddExcelLeadaComponent],

})
export class LeadManagementModule { }
