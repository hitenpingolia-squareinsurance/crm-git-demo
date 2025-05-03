import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";

import { MycontactsRoutingModule } from './mycontacts-routing.module';
import { MyContactComponent } from './my-contact/my-contact.component';
import { AddContactComponent } from './add-contact/add-contact.component';


@NgModule({
  declarations: [MyContactComponent, AddContactComponent],
  imports: [
    CommonModule,MatDialogModule,FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,
    MycontactsRoutingModule
  ],
  entryComponents: [AddContactComponent]
})
export class MycontactsModule { }
