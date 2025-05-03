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

import { CompanyBranchComponent } from "../company-branch.component";

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.css']
})
export class UpdateBranchComponent {

  AddFieldForm: FormGroup;
  active: { Id: string; Name: string }[];
  status: { Id: string; Name: string }[];
  type: { Id: string; Name: string }[];
  isSubmitted = false;

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: any;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettings: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  
  company: any[];
  id: any;
  dataAr: any[];
  statusAr: any[];
  

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
    private dialogRef: MatDialogRef<CompanyBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.id = data.id;

    this.AddFieldForm = this.formBuilder.group({
      branch: ['', [Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
      company: ['', Validators.required],
      status: ['', Validators.required],
     
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.statusAr = [
      { Id: '1', Name: 'Active' },
      { Id: '0', Name: 'Inactive' },
    ];

  
  }

  ngOnInit() {
   
    this.fetchData();
    this.getCompany();
  }

  get FC() { return this.AddFieldForm.controls; }

  // getCompany(lob: any) {
  //   // this.AddFieldForm.get('company').reset();
  //   const formData = new FormData();
  //   formData.append('lob', JSON.stringify(lob));
  //   this.api
  //     .HttpPostTypeBms('../v2/business_master/CompanyBranch/getcompany', formData)
  //     .then(
  //       (resp) => {
  //         this.company = resp['data'].map(item => ({ Id: item.Id, Name: item.Name }));
  //       },
  //       (err) => {
  //         console.error('HTTP error:', err);
  //       }
  //     );
  // }

  // fetchData() {
  //   const formData = new FormData();
  //   formData.append("id", this.id);
  //   this.api.IsLoading();
  //   this.api
  //     .HttpPostTypeBms('../v2/business_master/CompanyBranch/fetchData', formData)
  //     .then(
  //       (resp) => {

  //         this.AddFieldForm.patchValue({
  //           branch: resp['branch'],
  //           company: [{ Id: resp['company_id'], Name: resp['company'] }],
  //           status: [{ Id: resp['status'], Name: resp['status'] == 1 ? 'Active' : 'Inactive' }],
  //           file: resp['lob'].map(item => ({ Id: item.id, Name: item.Name })),
  //         })
  //         this.api.HideLoading();
  //         document.getElementById('click-close').click();
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //       }
  //     );
  // }

  // SubBtn() {
  //   this.isSubmitted = true;
  //   if (this.AddFieldForm.valid) {

  //     let data = (JSON.stringify(this.AddFieldForm.value));
  //     const formData = new FormData();
  //     formData.append("data", data);
  //     formData.append("id", this.id);
  //     this.api.IsLoading();
  //     this.api
  //       .HttpPostTypeBms('../v2/business_master/CompanyBranch/updateBranch', formData)
  //       .then(
  //         (resp) => {
  //           this.api.HideLoading();
  //           this.api.Toast(resp['status'], resp['msg'])
  //           if (resp['status'] == 'Success') {
  //             this.CloseModel();
  //           }
  //           this.isSubmitted = false;
  //         },
  //         (err) => {
  //           this.api.HideLoading();
  //         }
  //       );
  //   }
  // }

  getCompany() {
    const formData = new FormData();
    formData.append('loginId' , this.api.GetUserData("Id"));
    formData.append('loginType' , this.api.GetUserType());
    this.api
      .HttpPostType("reports/BussinessReport/Company", formData)
      .then(
        (resp:any) => {
         
          this.company = resp;
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  fetchData() {
    const formData = new FormData();
    formData.append("updateId", this.id);
    // this.api.IsLoading();
    this.api
      .HttpPostType('reports/BussinessReport/CompanyBranch', formData)
      .then(
        (resp:any) => {
        const result = resp.data;

          this.AddFieldForm.patchValue({
            branch: result[0].branchName,
            status: [{ Id: result[0].status, Name: result[0].status == 1 ? 'Active' : 'Inactive' }],
            company : [
              { Id: resp.companyDataUpdate.Id, Name: resp.companyDataUpdate.Name }
            ]
           
          });
        
          document.getElementById('click-close').click();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  SubBtn() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      const feilds = this.AddFieldForm.value
      const formData = new FormData();
      formData.append("branch", feilds['branch']);
      formData.append("company", JSON.stringify(feilds['company']));
      formData.append("status", JSON.stringify(feilds['status']));
      formData.append("updateId", this.id);
      this.api.IsLoading();
      this.api
        .HttpPostType("reports/BussinessReport/CompanyBranchAdd", formData)
        .then(
          (resp:any) => {
            this.api.HideLoading();
           
            if (resp['status'] == true) {
              this.CloseModel();
              this.api.Toast("Success" , resp['msg']);
            }
            this.isSubmitted = false;
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

}




