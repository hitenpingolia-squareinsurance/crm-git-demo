import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CompanyMasterComponent } from './company-master/company-master.component'; 
import { RtoMasterComponent } from './rto-master/rto-master.component';
import { StateComponent } from './state/state.component';
import { MakemodelComponent } from './makemodel/makemodel.component';
import { BrokerComponent } from './broker/broker.component';
import { BusinessMasterLogComponent } from './business-master-log/business-master-log.component';
import { ManageMakeComponent } from './manage-make/manage-make.component';
import { ProductReportComponent } from './product-report/product-report.component';
import { CompanyBranchComponent } from './company-branch/company-branch.component';
import { PincodeMasterComponent } from './pincode-master/pincode-master.component';
import { BusinessInsurerDocsComponent } from './business-insurer-docs/business-insurer-docs.component';
import { InsurerChannelComponent } from './insurer-channel/insurer-channel.component';

const routes: Routes = [
  { path: 'CPA', component: ProductComponent },
  { path: 'company', component: CompanyMasterComponent },
  { path: 'rto-master', component: RtoMasterComponent },
  { path: 'state', component: StateComponent },
  { path: 'make-model', component: MakemodelComponent },
  { path: 'broker', component: BrokerComponent },
  { path: 'business-log', component: BusinessMasterLogComponent },
  { path: 'manage-make', component: ManageMakeComponent },
  { path: 'product', component: ProductReportComponent },
  { path: 'company-branch', component: CompanyBranchComponent },
  { path: 'pincode-master', component: PincodeMasterComponent },
  { path: 'business-insurer-docs', component: BusinessInsurerDocsComponent },
  { path: 'insurer-channels', component: InsurerChannelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessMasterRoutingModule { }
