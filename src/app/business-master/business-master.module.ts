import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BusinessMasterRoutingModule } from "./business-master-routing.module";
import { BrokerComponent } from "./broker/broker.component";
import { BusinessMasterLogComponent } from "./business-master-log/business-master-log.component";
import { CompanyMasterComponent } from "./company-master/company-master.component";
import { MakemodelComponent } from "./makemodel/makemodel.component";
import { ManageMakeComponent } from "./manage-make/manage-make.component";
import { ProductComponent } from "./product/product.component";
import { ProductReportComponent } from "./product-report/product-report.component";
import { RtoMasterComponent } from "./rto-master/rto-master.component";
import { StateComponent } from "./state/state.component";
import { AddBrokerComponent } from "./broker/add-broker/add-broker.component";
import { EditBrokerComponent } from "./broker/edit-broker/edit-broker.component";
import { AddModelComponent } from "./makemodel/add-model/add-model.component";
import { EditModelComponent } from "./makemodel/edit-model/edit-model.component";
import { AddProductComponent } from "./product/add-product/add-product.component";
import { UpdateProductComponent } from "./product/update-product/update-product.component";
import { ProductFormComponent } from "./product-report/product-form/product-form.component";
import { ProductUpdateComponent } from "./product-report/product-update/product-update.component";
import { RtoAddComponent } from "./rto-master/rto-add/rto-add.component";
import { RtoUpdateComponent } from "./rto-master/rto-update/rto-update.component";
import { CompanyBranchComponent } from "./company-branch/company-branch.component";
import { AddBranchComponent } from "./company-branch/add-branch/add-branch.component";
import { UpdateBranchComponent } from "./company-branch/update-branch/update-branch.component";
import { CompanyAddComponent } from "./company-master/company-add/company-add.component";
import { CompanyUpdateComponent } from "./company-master/company-update/company-update.component";
import { PincodeMasterComponent } from "./pincode-master/pincode-master.component";
import { AddPincodeComponent } from "./pincode-master/add-pincode/add-pincode.component";
import { UpdatePincodeComponent } from "./pincode-master/update-pincode/update-pincode.component";
import { BusinessInsurerDocsComponent } from "./business-insurer-docs/business-insurer-docs.component";
import { AddBusinessInsurerDocsComponent } from "./business-insurer-docs/add-business-insurer-docs/add-business-insurer-docs.component";
import { ViewBusinessExtractComponent } from './business-insurer-docs/view-business-extract/view-business-extract.component';
import { BusinessMapModalComponent } from './business-insurer-docs/business-map-modal/business-map-modal.component';
import { InsurerChannelComponent } from './insurer-channel/insurer-channel.component';
import {AddchannelComponent} from './insurer-channel/addchannel/addchannel.component';
import { UpdatechannelComponent } from "./insurer-channel/updatechannel/updatechannel.component";

@NgModule({
  declarations: [
    BrokerComponent,
    BusinessMasterLogComponent,
    CompanyMasterComponent,
    MakemodelComponent,
    ManageMakeComponent,
    ProductComponent,
    ProductReportComponent,
    RtoMasterComponent,
    StateComponent,
    AddBrokerComponent,
    EditBrokerComponent,
    AddModelComponent,
    EditModelComponent,
    AddProductComponent,
    UpdateProductComponent,
    ProductFormComponent,
    ProductUpdateComponent,
    RtoAddComponent,
    RtoUpdateComponent,
    CompanyBranchComponent,
    AddBranchComponent,
    UpdateBranchComponent,
    CompanyAddComponent,
    CompanyUpdateComponent,
    PincodeMasterComponent,
    AddPincodeComponent,
    UpdatePincodeComponent,
    BusinessInsurerDocsComponent,
    AddBusinessInsurerDocsComponent,
    ViewBusinessExtractComponent,
    BusinessMapModalComponent,
    InsurerChannelComponent,
    AddchannelComponent,UpdatechannelComponent
  ],

  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule,
    BusinessMasterRoutingModule,
  ],

  entryComponents: [
    ProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    RtoAddComponent,
    RtoUpdateComponent,
    AddModelComponent,
    EditModelComponent,
    AddBrokerComponent,
    EditBrokerComponent,
    ProductFormComponent,
    ProductUpdateComponent,
    CompanyAddComponent,
    CompanyUpdateComponent,
    AddBranchComponent,
    UpdateBranchComponent,
    AddPincodeComponent,
    UpdatePincodeComponent,
    AddBusinessInsurerDocsComponent,
    ViewBusinessExtractComponent,
    BusinessMapModalComponent,
    AddchannelComponent,UpdatechannelComponent

  ],
})
export class BusinessMasterModule {}
