import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";

import { ServiceProviderRoutingModule } from './service-provider-routing.module';
import { ServiceproviderComponent } from './serviceprovider/serviceprovider.component';


@NgModule({
  declarations: [ServiceproviderComponent],
  imports: [
    CommonModule,MatDialogModule,FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,
    ServiceProviderRoutingModule
  ]
})
export class ServiceProviderModule { }
