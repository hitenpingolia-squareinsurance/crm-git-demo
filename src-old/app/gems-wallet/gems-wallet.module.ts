import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManegerTeamComponent } from './maneger-team/maneger-team.component';
 
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GemsWalletRoutingModule } from './gems-wallet-routing.module';

import { GemsWalletComponent } from './gems-wallet/gems-wallet.component';


@NgModule({
  declarations: [ManegerTeamComponent,GemsWalletComponent],
  imports: [
    CommonModule,
    GemsWalletRoutingModule, FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,NgMultiSelectDropDownModule
  ]
  

})
export class GemsWalletModule { }
