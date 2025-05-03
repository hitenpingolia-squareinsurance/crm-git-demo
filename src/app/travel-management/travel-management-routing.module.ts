import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelManagementComponent } from './travel-management/travel-management.component';
import { TravelViewComponent } from './travel-view/travel-view.component';
import { TravelrequestMasterComponent } from './travelrequest-master/travelrequest-master.component';
import { TravelClaimsComponent } from './travel-claims/travel-claims.component';
import { ClaimViewComponent } from './claim-view/claim-view.component';


const routes: Routes = [
  { path:'request' , component:TravelManagementComponent },
  { path:'request/:Id' , component:TravelManagementComponent },
  {path : 'employee' , component:TravelViewComponent},

  {path : 'manager' , component:TravelViewComponent},
  {path : 'travel-desk' , component:TravelViewComponent},
  {path : 'account-desk' , component:TravelViewComponent},


  {path : 'visit_data/:Id' , component : TravelrequestMasterComponent},
  {path : 'mode_data/:Id' , component : TravelrequestMasterComponent},
  {path : 'guestHouse_data/:Id' , component : TravelrequestMasterComponent},
  {path : 'TA-DA_data/:Id' , component : TravelrequestMasterComponent},
  {path : 'Local-conveyance_data/:Id' , component : TravelrequestMasterComponent},
  {path : 'Mis-claim_data/:Id' , component : TravelrequestMasterComponent},


  {path : 'visit_data' , component : TravelrequestMasterComponent},
  {path : 'mode_data' , component : TravelrequestMasterComponent},
  {path : 'guestHouse_data' , component : TravelrequestMasterComponent},
  {path : 'TA-DA_data' , component : TravelrequestMasterComponent},
  {path : 'Local-conveyance_data' , component : TravelrequestMasterComponent},
  {path : 'Mis-claim_data' , component : TravelrequestMasterComponent},

  {path : 'claim/:Id' , component : TravelClaimsComponent},
  {path : 'edit_claim/:Id' , component : TravelClaimsComponent},

  {path : 'claimManager' , component : ClaimViewComponent},
  {path : 'claimHOD' , component : ClaimViewComponent},
  {path : 'claimTravel' , component : ClaimViewComponent},
  {path : 'claimAccount' , component : ClaimViewComponent},

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelManagementRoutingModule { }
