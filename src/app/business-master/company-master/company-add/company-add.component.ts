import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";


import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { CompanyMasterComponent } from "../company-master.component";

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.css']
})
export class CompanyAddComponent implements OnInit {

  AddFieldForm: FormGroup;
  active: any[];
  isSubmitted = false;
  fileError: any;
  FileNames: any;
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
  Products_Ar:any;
  PolicyType_Ar:any;
  PlanType_Ar:any;
  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsmultiselectProduct: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsmultiselectPolicyType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsmultiselectPlanType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  

  selectedFiles: any;
  payin: { Id: string; Name: string; }[];
  split: { Id: number; Name: string; }[];
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<CompanyMasterComponent>
  ) {

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselectProduct = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselectPolicyType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselectPlanType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };


    this.AddFieldForm = this.formBuilder.group({
      company: ['', [Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
      motor: ['0'],
      health: ['0'],
      nonM: ['0'],
      life: ['0'],
      pa: ['0'],
      travel: ['0'],
      status: ['', Validators.required],
      logo: ['', Validators.required],
      payin: ['', Validators.required],
      split: [[{ Id: 0, Name: 'No' }], Validators.required],
      product: [[]],
      policy_type:[[]],
      plan_type:[[]]
    });

    this.active = [
      { Id: 1, Name: 'Active' },
      { Id: 0, Name: 'Inactive' },
    ];

    this.payin = [
      { Id: '1', Name: 'Risk Start Date' },
      { Id: '2', Name: 'Issue Date' },
    ];

    this.split = [
      {Id:0,Name:'No'},
      {Id:1,Name:'Yes'}
    ];
  }

  ngOnInit() {
    this.AddFieldForm.get('split').valueChanges.subscribe(() => {
      this.onSplitChange();
    });
  }
  

  onFileChange(event: any) {
    
    this.fileError = null;
    const file = event.target.files[0];
    
    const extension = file.name.split(".").pop().toLowerCase();
    if (!this.validImageExtensions.includes(extension)) {
      this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
      return;
    }
    this.FileNames = file;
    
  }

  UploadDocs(event) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      console.log(this.selectedFiles);

      var str = this.selectedFiles.name;
      var ar = str.split(".");

      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 2) {
          this.api.Toast("Warning", "File size is greater than 2 mb");
         // this.SetImagesValues("unset", Image_no, this.selectedFiles);
        } else {
          //this.SetImagesValues("set", Image_no, this.selectedFiles);
        }
      } else {
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        //this.SetImagesValues("unset", Image_no, this.selectedFiles);
      }
    }
  }

  SubBtn() {
    var field = this.AddFieldForm.value;
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      if (field['travel'] == 1 || field['pa'] == 1 || field['life'] == 1 || field['health'] == 1 || field['motor'] == 1 || field['nonM'] == 1) {
        let data = (JSON.stringify(this.AddFieldForm.value));
        console.log(data);
        const formData = new FormData();
        formData.append("data", data);
        formData.append("file", this.selectedFiles);
        this.api.IsLoading();
        this.api
          .HttpPostTypeBms('../v2/business_master/CompanyMaster/addCompany', formData)
          .then(
            (resp) => {
              this.api.HideLoading();
              this.api.Toast(resp['status'], resp['msg'])
              if (resp['status'] == 'Success') {
                this.CloseModel();
                this.business_log(resp['id']);
                this.isSubmitted = false;
              }
            },
            (err) => {
              this.api.HideLoading();
            }
          );
      }else{
        this.api.Toast('Warning', 'Select One Check Box');
      }
    }
  }

  business_log(id: any) {
    let data = (JSON.stringify(this.AddFieldForm.value));
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", 'square.d_ins_companies');
    formData.append("log", 'insert');
    formData.append("id", id);
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api
      .HttpPostTypeBms('../v2/business_master/Business_Log/logInsert', formData)
      .then(
        (resp) => {
          this.AddFieldForm.reset();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //begin::Added by paras
  toggleCheckbox(checked: boolean, form: string) {
    const formChecked = !!checked;
    this.AddFieldForm.get(form).setValue(formChecked);
    const motorVal = this.AddFieldForm.get('motor').value;
    const healthVal = this.AddFieldForm.get('health').value;
    if (!motorVal && !healthVal) {
      this.AddFieldForm.get('split').setValue([{ Id: 0, Name: 'No' }]);
    }
    if (!motorVal) {
      ['product', 'policy_type', 'plan_type'].forEach(field => this.clearField(field));
    }
    const splitVal = this.AddFieldForm.get('split').value;
    const isSplitYes = Array.isArray(splitVal) && splitVal.some(item => item['Name'] === 'Yes');
    if (motorVal && isSplitYes) {
      this.onSplitChange();
    }
  }
  
  clearField(controlName: string) {
    const control = this.AddFieldForm.get(controlName);
    control.setValue([]);
    control.clearValidators();
    control.updateValueAndValidity();
  }
  
  isSplitYes(): boolean {
    const split = this.AddFieldForm.get('split').value;
    return Array.isArray(split) && split.some(item => item.Name === 'Yes');
  }
  
  onSplitChange() {
    const isYes = this.isSplitYes();
    const fields = ['product', 'policy_type', 'plan_type'];
    if (isYes && this.AddFieldForm.get('motor').value == 1) {
      this.GetProducts();
      fields.forEach(field => {
        const control = this.AddFieldForm.get(field);
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      });
    } else {
      fields.forEach(field => this.clearField(field));
    }
  }
  
  GetProducts() {
    let LOB_Id = 'Motor';
    const formData = new FormData();
    formData.append('LOB', LOB_Id);
  
    this.api.IsLoading();
  
    this.api.HttpPostTypeBms('../v2/business_master/CompanyMaster/GetProducts', formData).then((result) => {
      if (result['Status'] === true) {
        let productData = result['Data']['Product'];
        this.Products_Ar = [];
        for (let product of productData) {
          this.Products_Ar.push({ Id: product['Id'], Name: product['Name'] });
        }
      } else {
        this.api.Toast('Success', result['Message']);
      }
  
      this.api.HideLoading();
    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Please try again !');
    });
  }
  
  GetPolicyType() {
    let LOB_Id = 'Motor';
    const selectedProducts = this.AddFieldForm.get('product').value || [];
    if (!selectedProducts.length) {
      this.PolicyType_Ar = [];
      return;
    }
  
    const productIds = selectedProducts.map((x: any) => x.Id).join(',');
  
    const formData = new FormData();
    formData.append('LOB', LOB_Id);
    formData.append('Product_Id', productIds);
  
    this.api.IsLoading();
  
    this.api.HttpPostTypeBms('../v2/business_master/CompanyMaster/GetPolicyType', formData).then((result) => {
      this.api.HideLoading();
      if (result['Status'] === true) {
        let policyTypeData = result['Data'];
        this.PolicyType_Ar = policyTypeData.map((policyType: any) => ({
          Id: policyType['Id'],
          Name: policyType['Name']
        }));
  
        // Reset policy_type selection and call GetPlanType
        this.AddFieldForm.get('policy_type').setValue([]);
        this.GetPlanType(); // Trigger PlanType fetch after policy types are loaded (optional)
  
      } else {
        this.PolicyType_Ar = [];
        this.api.Toast('Warning', result['Message']);
      }
    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Please try again !');
    });
  }
  
  GetPlanType() {
    const LOB_Id = 'Motor';
  
    const selectedProducts = this.AddFieldForm.get('product').value || [];
    const selectedPolicyTypes = this.AddFieldForm.get('policy_type').value || [];
  
    if (!selectedProducts.length || !selectedPolicyTypes.length) {
      this.PlanType_Ar = [];
      return;
    }
  
    const productIds = selectedProducts.map((item: any) => item.Id).join(',');
    const policyTypeIds = selectedPolicyTypes.map((item: any) => item.Id).join(',');
  
    const formData = new FormData();
    formData.append('LOB', LOB_Id);
    formData.append('Product_Id', productIds);
    formData.append('Segment_Id', policyTypeIds);
  
    this.api.IsLoading();
  
    this.api.HttpPostTypeBms('../v2/business_master/CompanyMaster/GetPlanType', formData).then(
      (result) => {
        this.api.HideLoading();
        if (result['status'] === true && Array.isArray(result['data'])) {
          this.PlanType_Ar = result['data'].map((planType: any) => ({
            Id: planType.Id,
            Name: planType.Name
          }));
        } else {
          this.PlanType_Ar = [];
          this.api.Toast('Warning', result['message'] || 'No data found');
        }
      },
      (error) => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Please try again!');
      }
    );
  }
  //end::Added by paras

  
  

}
