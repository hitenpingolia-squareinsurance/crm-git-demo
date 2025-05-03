import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';

import { CancellationRoutingModule } from './cancellation-routing.module';
import { SharedModule } from "../shared/shared.module";

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CreateCancellationComponent } from './create-cancellation/create-cancellation.component';
import { ViewCancellationComponent } from './view-cancellation/view-cancellation.component';
import { AddRequestModalComponent } from './add-request-modal/add-request-modal.component';
import { ViewRequestModalComponent } from './view-request-modal/view-request-modal.component';
import { ManageCancellationComponent } from './manage-cancellation/manage-cancellation.component';


@NgModule({
  declarations: [
    CreateCancellationComponent,
    ViewCancellationComponent,
    AddRequestModalComponent,
    ViewRequestModalComponent,
    ManageCancellationComponent
  ],

  imports: [
    CommonModule,
    CancellationRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule,
    SharedModule
  ],

  entryComponents: [AddRequestModalComponent, ViewRequestModalComponent]

})
export class CancellationModule { }
