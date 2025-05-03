import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDocsWalletComponent } from './view-docs-wallet/view-docs-wallet.component';


const routes: Routes = [
  { path: 'view-docs-wallet', component: ViewDocsWalletComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsWalletRoutingModule { }
