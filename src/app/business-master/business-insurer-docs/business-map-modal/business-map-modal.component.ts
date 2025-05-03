import { Component, Inject, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog ,MatDialogRef} from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/providers/api.service';
import { BmsapiService } from 'src/app/providers/bmsapi.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-business-map-modal',
  templateUrl: './business-map-modal.component.html',
  styleUrls: ['./business-map-modal.component.css']
})
export class BusinessMapModalComponent implements OnInit {


  //MAPPING CONST
  AddMappingForm: FormGroup;
  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; noDataAvailablePlaceholderText: string; };
  isSubmitted: boolean;
  CompanyArr: any;

  constructor(
    public dialogRef: MatDialogRef<BusinessMapModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialog: MatDialog,
    public api: ApiService,
    public bmsApi: BmsapiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
  }


  ngOnInit() {
    this.CompanyArr = this.data.company;

    this.AddMappingForm = this.formBuilder.group({
      company: ['', Validators.required],
      productMapGroups: this.formBuilder.array([ // Change 'productGroups' to 'productMapGroups'
        this.createProductMapGroup() // Initialize with one group
      ])
    });


    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'No records available'
    };
    
  }


  
  get FC() {
    return this.AddMappingForm.controls;
  }

  createProductMapGroup(): FormGroup {
    return this.formBuilder.group({
      product_master: ['', Validators.required],
      product_values: ['', Validators.required]
    });
  }


  productMapGroupsNew(){
    return this.AddMappingForm.get('productMapGroups') as FormArray;

  }

  addProductMapGroup() {
    const productMapGroups = this.AddMappingForm.get('productMapGroups') as FormArray;
    productMapGroups.push(this.createProductMapGroup());
  }
  
  removeProductMapGroup(index: number) {
    const productMapGroups = this.AddMappingForm.get('productMapGroups') as FormArray;
    productMapGroups.removeAt(index);
  }
 

  closeMappingDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  
  SubmitMappedRecords(){
    this.isSubmitted = true;
    console.log("this.AddFieldForm",this.AddMappingForm);
  
    if (this.AddMappingForm.valid) {
      console.log("this.AddMappingForm",this.AddMappingForm);
    
    }
  }


  onMasterCompanyChange(event: any) {
    
    console.log("event",event);

    const productMapGroupsArray = this.AddMappingForm.get('productMapGroups') as FormArray;
    if (productMapGroupsArray) {
      productMapGroupsArray.clear(); // Remove all existing form controls
    }

  }

  getMasterMappingData(companyId: string) {
    let url = `${environment.apiUrlBmsBase}/../v2/business_master/BusinessInsurerDocs/getMasterMappingData?CompanyId=${companyId}&User_Id=${this.api.GetUserData("Id")}&User_Type=${this.api.GetUserType()}&User_Code=${this.api.GetUserData("Code")}`;
  
    this.http.get<any>(url).subscribe(
      (result) => {
        this.api.HideLoading();
        if (result["status"] === true) {
          let data = result["data"];
          console.log(data); // For example, log the data to the console
        } else {
          this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      }
    );
  }
  

}
