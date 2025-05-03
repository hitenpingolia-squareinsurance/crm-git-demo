import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FilterModuleRoutingModule } from './filter-module-routing.module';
import { CurrentMappingFilterComponent } from './current-mapping-filter/current-mapping-filter.component';
import { AllDataFilterComponent } from './all-data-filter/all-data-filter.component';
import { BusinessRelatedFilterComponent } from './business-related-filter/business-related-filter.component';

@NgModule({

  declarations: [CurrentMappingFilterComponent, AllDataFilterComponent, BusinessRelatedFilterComponent],

  imports: [
    CommonModule,
    FilterModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
  ],

  exports: [CurrentMappingFilterComponent, AllDataFilterComponent, BusinessRelatedFilterComponent]

})

export class FilterModuleModule { }
