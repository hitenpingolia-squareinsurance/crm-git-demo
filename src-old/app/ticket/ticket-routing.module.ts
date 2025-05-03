import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { SingleticketComponent } from './singleticket/singleticket.component';
import { ViewTicketsComponent } from './view-tickets/view-tickets.component';


const routes: Routes = [

  // {
  //   path : 'raise-ticket', component : CreateTicketComponent

  // },
  // {

  //   path : 'all-tickets-user', component : ViewTicketsComponent

  // },
  // {

  //   path : 'all-tickets-assign', component : ViewTicketsComponent

  // },
  // {

  //   path : 'all-tickets-user/:Ticket_Id', component : SingleticketComponent

  // },
  // {

  //   path : 'all-tickets-assign/:Ticket_Id', component : SingleticketComponent

  // }
  // {path : 'claim-assistance/view-claim/:poupup/:Claim_Id', component : ViewClaimComponent},


  {  path : 'raise-ticket', component : CreateTicketComponent   },
  {  path : 'all-tickets-user', component : ViewTicketsComponent },
  {  path : 'all-tickets-assign', component : ViewTicketsComponent },
  {  path : 'all-tickets-user/:Ticket_Id', component : SingleticketComponent },
  {  path : 'all-tickets-assign/:Ticket_Id', component : SingleticketComponent },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule {



}
