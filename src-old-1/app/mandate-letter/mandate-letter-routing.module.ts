import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MandateLetterComponent } from './mandate-letter/mandate-letter.component';

const routes: Routes = [
  { path : '', component : MandateLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandateLetterRoutingModule { }
