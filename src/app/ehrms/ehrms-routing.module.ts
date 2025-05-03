import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalMiscellaneousClaimComponent } from './local-miscellaneous-claim/local-miscellaneous-claim.component';


const routes: Routes = [
    {path : 'localClaimAdd' , component : LocalMiscellaneousClaimComponent},
    {path : 'miscellaneousClaimAdd' , component : LocalMiscellaneousClaimComponent},
    {path : 'localClaimUpdate/:Id' , component : LocalMiscellaneousClaimComponent},
    {path : 'miscellaneousClaimUpdate/:Id' , component : LocalMiscellaneousClaimComponent},

    {path : 'miscellaneousClaim' , component : LocalMiscellaneousClaimComponent},
    {path : 'miscellaneousClaim-manager' , component : LocalMiscellaneousClaimComponent},
    {path : 'miscellaneousClaim-hod' , component : LocalMiscellaneousClaimComponent},
    {path : 'miscellaneousClaim-claim' , component : LocalMiscellaneousClaimComponent},
    {path : 'miscellaneousClaim-account' , component : LocalMiscellaneousClaimComponent},

    {path : 'localClaim' , component : LocalMiscellaneousClaimComponent},
    {path : 'localClaim-manager' , component : LocalMiscellaneousClaimComponent},
    {path : 'localClaim-hod' , component : LocalMiscellaneousClaimComponent},
    {path : 'localClaim-claim' , component : LocalMiscellaneousClaimComponent},
    {path : 'localClaim-account' , component : LocalMiscellaneousClaimComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EhrmsRoutingModule { }
