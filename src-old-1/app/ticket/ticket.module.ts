import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";

import { TicketRoutingModule } from './ticket-routing.module';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { ViewTicketsComponent } from './view-tickets/view-tickets.component';
import { SingleticketComponent } from './singleticket/singleticket.component';


@NgModule({
  declarations: [CreateTicketComponent, ViewTicketsComponent, SingleticketComponent],
  imports: [
    CommonModule,
    TicketRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    SharedModule

  ]
})
export class TicketModule { }
