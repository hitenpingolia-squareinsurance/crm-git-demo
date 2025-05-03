import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotfoundRoutingModule } from './page-notfound-routing.module';
import { NotfoundComponent } from './notfound/notfound.component';


@NgModule({
  declarations: [NotfoundComponent],
  imports: [
    CommonModule,
    PageNotfoundRoutingModule
  ]
})
export class PageNotfoundModule { }
