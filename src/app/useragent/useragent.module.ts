import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UseragentRoutingModule } from './useragent-routing.module';
import { UsersComponent } from './users/users.component';
import { SharedModule } from "../shared/shared.module";
import { AddpossocialleadsComponent } from './addpossocialleads/addpossocialleads.component';
import { EditComponent } from './edit/edit.component';
import { MoreactionComponent } from './moreaction/moreaction.component';


@NgModule({
  declarations: [UsersComponent, AddpossocialleadsComponent, EditComponent, MoreactionComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,SharedModule,NgMultiSelectDropDownModule,
    UseragentRoutingModule
  ],
  entryComponents: [AddpossocialleadsComponent,EditComponent,MoreactionComponent]
})

export class UseragentModule { }
