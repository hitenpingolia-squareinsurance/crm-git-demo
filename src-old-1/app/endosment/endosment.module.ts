import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from "../shared/shared.module";

import { EndosmentRoutingModule } from './endosment-routing.module';
import { CreateEndosmentComponent } from './create-endosment/create-endosment.component';
import { EndosmentFormComponent } from './endosment-form/endosment-form.component';
import { FormRelatedComponent } from './form-related/form-related.component';
import { ViewEndosmentComponent } from './view-endosment/view-endosment.component';
import { ManageEndosmentComponent } from './manage-endosment/manage-endosment.component';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

@NgModule({
  declarations: [
    CreateEndosmentComponent,
    EndosmentFormComponent,
    FormRelatedComponent,
    ViewEndosmentComponent,
    ManageEndosmentComponent,
    ViewDetailsModalComponent,
    ViewDetailsComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    EndosmentRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule
  ],

  entryComponents: [FormRelatedComponent, ViewDetailsModalComponent]

})
export class EndosmentModule { }
