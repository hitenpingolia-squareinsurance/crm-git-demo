import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RfqQuaitViewComponent } from './rfq-quait-view/rfq-quait-view.component';


@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, RfqQuaitViewComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
	FormsModule,
    ReactiveFormsModule,
  ]
})
export class AccountModule { }
