import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManegerTeamComponent } from './maneger-team/maneger-team.component';
import { GemsWalletComponent } from './gems-wallet/gems-wallet.component';


const routes: Routes = [
  { path: 'Maneger-wallet', component: ManegerTeamComponent },
  { path: 'gems-wallet', component: GemsWalletComponent  },
  { path: 'Gems-Banking-wallet', component: ManegerTeamComponent  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GemsWalletRoutingModule { }
