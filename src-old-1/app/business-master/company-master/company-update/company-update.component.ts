import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
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
  selector: "app-company-update",
  templateUrl: "./company-update.component.html",
  styleUrls: ["./company-update.component.css"],
})
export class CompanyUpdateComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
  id: any;
  dataAr: any[] = [];
  isSubmitted = false;
  fileError: any;
  FileNames: any;
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
  Products_Ar:any=[];
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
  
  logoUrl: any;
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

    private dialogRef: MatDialogRef<CompanyMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;

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
      id: [""],
      company: ["", [Validators.required, Validators.pattern("[a-zA-Z. ]*")]],
      motor: [false],
      health: [false],
      nonM: [false],
      life: [false],
      pa: [false],
      travel: [false],
      status: ["", Validators.required],
      logo: [""],
      payin: ['', Validators.required],
      split: ['', Validators.required],
      product: [[]],
      policy_type:[[]],
      plan_type:[[]]
    });

    this.active = [
      { Id: "Active", Name: "Active" },
      { Id: "Inactive", Name: "Inactive" },
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
    this.fetch();
    this.AddFieldForm.get('split').valueChanges.subscribe(() => {
      this.onSplitChange();
    });
  }


  async fetch() {
    const formData = new FormData();
    formData.append("id", this.id);
    this.api.IsLoading();
  
    try {
      const resp = await this.api.HttpPostTypeBms("../v2/business_master/CompanyMaster/fetch", formData);
      this.dataAr[0] = resp[0];
  
      const splitValue = this.dataAr[0].Split == 1 ? { Id: 1, Name: 'Yes' } : { Id: 0, Name: 'No' };
  
      this.AddFieldForm.patchValue({
        id: this.dataAr[0].Id,
        company: this.dataAr[0].Name,
        motor: this.dataAr[0].Motor,
        health: this.dataAr[0].Health,
        nonM: this.dataAr[0].Non_Motor,
        life: this.dataAr[0].Life,
        pa: this.dataAr[0].PA,
        travel: this.dataAr[0].Travel,
        payin: [{
          Id: this.dataAr[0].Payout == 1 ? "1" : "2",
          Name: this.dataAr[0].Payout == 1 ? "Risk Start Date" : "Issue Date"
        }],
        status: [{
          Id: this.dataAr[0].Status == 1 ? "Active" : "Inactive",
          Name: this.dataAr[0].Status == 1 ? "Active" : "Inactive"
        }],
        split: [splitValue]
      });
  
      if (splitValue.Id == 1 && this.dataAr[0].Motor) {
        await this.GetProducts();
        const selectedProducts = this.getSelectedOptions(this.Products_Ar, this.dataAr[0].Split_Products);
        this.AddFieldForm.get('product').setValue(selectedProducts);

        await this.GetPolicyType();
        const selectedPolicyTypes = this.getSelectedOptions(this.PolicyType_Ar, this.dataAr[0].Split_Policy_Type);
        this.AddFieldForm.get('policy_type').setValue(selectedPolicyTypes);

        await this.GetPlanType();
        const selectedPlanTypes = this.getSelectedOptions(this.PlanType_Ar, this.dataAr[0].Split_Plan_Type);
        this.AddFieldForm.get('plan_type').setValue(selectedPlanTypes);

      }
  
      this.clickMultiple();
      this.api.HideLoading();
    } catch (err) {
      this.api.HideLoading();
      this.api.Toast("Error", "Something went wrong while loading data");
    }
  }
  

  UploadDocs(event) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {

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

  clickMultiple() {
    document.getElementById("click").click();
  }

  SubBtn() {

    this.isSubmitted = true;
    var field = this.AddFieldForm.value;

    if (field["status"][0]["Name"] == "Active") {
      field["status"][0]["Id"] = 1;
    } else {
      field["status"][0]["Id"] = 0;
    }

    if (this.AddFieldForm.valid) {
      if (
        field["travel"] == 1 ||
        field["pa"] == 1 ||
        field["life"] == 1 ||
        field["health"] == 1 ||
        field["motor"] == 1 ||
        field["nonM"] == 1
      ) {
        let data = JSON.stringify(this.AddFieldForm.value);
        console.log(data);
        const formData = new FormData();
        formData.append("data", data);
        formData.append("file", this.selectedFiles);
        this.api.IsLoading();
        this.api
          .HttpPostTypeBms(
            "../v2/business_master/CompanyMaster/updateCompany",
            formData
          )
          .then(
            (resp) => {
              this.api.HideLoading();
              this.CloseModel();
              this.api.Toast(resp["status"], resp["msg"]);
              this.business_log(this.id);
              this.isSubmitted = false;
            },
            (err) => {
              this.api.HideLoading();
            }
          );
      } else {
        this.api.Toast("Warning", "Select One Check Box");
      }
    }
  }

  business_log(id: any) {
    let data = JSON.stringify(this.AddFieldForm.value);
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", "square.d_ins_companies");
    formData.append("log", "update");
    formData.append("id", id);
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api
      .HttpPostTypeBms("../v2/business_master/Business_Log/logInsert", formData)
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
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // toggleCheckbox(checked: boolean, form: string) {
  //   this.AddFieldForm.get(form).setValue(checked ? true : false);
  // }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }


  //begin::Added by paras
  filterSelectedOptions(savedArray: any[], masterArray: any[]): any[] {
    if (!Array.isArray(savedArray)) return [];
    return masterArray.filter(opt => savedArray.some(sel => sel.Id == opt.Id));
  }
  

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
    if (motorVal && isSplitYes && this.Products_Ar.length ==0) {
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
  
  GetProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('LOB', 'Motor');
      this.api.IsLoading();
  
      this.api.HttpPostTypeBms('../v2/business_master/CompanyMaster/GetProducts', formData).then(result => {
        this.api.HideLoading();
        if (result['Status']) {
          this.Products_Ar = result['Data']['Product'].map((product: any) => ({
            Id: product.Id, Name: product.Name
          }));
          resolve();
        } else {
          this.api.Toast('Warning', result['Message']);
          reject();
        }
      }).catch(() => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Please try again!');
        reject();
      });
    });
  }
  
  GetPolicyType(): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectedProducts = this.AddFieldForm.get('product').value || [];
      if (!selectedProducts.length) return resolve(); // nothing to load
  
      const productIds = selectedProducts.map((x: any) => x.Id).join(',');
      const formData = new FormData();
      formData.append('LOB', 'Motor');
      formData.append('Product_Id', productIds);
      this.api.IsLoading();
  
      this.api.HttpPostTypeBms('../v2/business_master/CompanyMaster/GetPolicyType', formData).then(result => {
        this.api.HideLoading();
        if (result['Status']) {
          this.PolicyType_Ar = result['Data'].map((item: any) => ({ Id: item.Id, Name: item.Name }));
          resolve();
        } else {
          this.PolicyType_Ar = [];
          this.api.Toast('Warning', result['Message']);
          resolve(); // still resolve, don't block next
        }
      }).catch(() => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Please try again!');
        reject();
      });
    });
  }
  
  GetPlanType(): Promise<void> {
    return new Promise((resolve, reject) => {
      const selectedProducts = this.AddFieldForm.get('product').value || [];
      const selectedPolicyTypes = this.AddFieldForm.get('policy_type').value || [];
  
      if (!selectedProducts.length || !selectedPolicyTypes.length) {
        this.PlanType_Ar = [];
        return resolve();
      }
  
      const formData = new FormData();
      formData.append('LOB', 'Motor');
      formData.append('Product_Id', selectedProducts.map((x: any) => x.Id).join(','));
      formData.append('Segment_Id', selectedPolicyTypes.map((x: any) => x.Id).join(','));
  
      this.api.IsLoading();
  
      this.api.HttpPostTypeBms('../v2/business_master/CompanyMaster/GetPlanType', formData).then(result => {
        this.api.HideLoading();
        if (result['status'] === true && Array.isArray(result['data'])) {
          this.PlanType_Ar = result['data'].map((item: any) => ({ Id: item.Id, Name: item.Name }));
        } else {
          this.PlanType_Ar = [];
          this.api.Toast('Warning', result['message'] || 'No data found');
        }
        resolve();
      }).catch(() => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Please try again!');
        reject();
      });
    });
  }
  

  getSelectedOptions(fullArray: any[], commaSeparatedString: string): any[] {
    if (!commaSeparatedString || !Array.isArray(fullArray)) return [];
  
    const selectedIds = commaSeparatedString.split(',').map(id => id.trim().toLowerCase());
  
    const selectedOptions = fullArray.filter(item =>
      selectedIds.includes(String(item.Id).toLowerCase())
    );
  
    return selectedOptions.length > 0 ? selectedOptions : []; // Empty array if no match
  }
  
  
  //end::Added by paras

 
}
