
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";
import { TeleRmRoutingModule } from './tele-rm-routing.module';
import { ViewTeleRmComponent } from './view-tele-rm/view-tele-rm.component';
import { FollowUpTeleRmComponent } from './follow-up-tele-rm/follow-up-tele-rm.component';
import { TeleBusniessReportsComponent } from './tele-busniess-reports/tele-busniess-reports.component';
@NgModule({
  declarations: [ViewTeleRmComponent, FollowUpTeleRmComponent, TeleBusniessReportsComponent],
  imports: [
    CommonModule,MatDialogModule,BsDatepickerModule,
    TeleRmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    SharedModule
  ],
  entryComponents: [FollowUpTeleRmComponent]
})
export class TeleRmModule { }
