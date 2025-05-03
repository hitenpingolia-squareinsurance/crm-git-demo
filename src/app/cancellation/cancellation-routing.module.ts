import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCancellationComponent } from './create-cancellation/create-cancellation.component';
import { ViewCancellationComponent } from './view-cancellation/view-cancellation.component';
import { ManageCancellationComponent } from './manage-cancellation/manage-cancellation.component';

const routes: Routes = [
 { path: 'cancellation/create-requests', component: CreateCancellationComponent },
 { path: 'cancellation/view-requests', component: ViewCancellationComponent },
 { path: 'mis-reports/cancellation', component: ViewCancellationComponent },
 { path: 'cancellation/manage-requests', component: ManageCancellationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancellationRoutingModule { }
