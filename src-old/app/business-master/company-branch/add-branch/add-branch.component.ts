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
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent {

  AddFieldForm: FormGroup;
  isSubmitted = false;

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  company: any[];
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
    private dialogRef: MatDialogRef<CompanyBranchComponent>
  ) {

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



    this.statusAr = [
      { Id: '1', Name: 'Active' },
      { Id: '0', Name: 'Inactive' },
    ];


  }

  ngOnInit() {
    this.getCompany();
  }

  get FC() { return this.AddFieldForm.controls; }


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

  SubBtn() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      const feilds = this.AddFieldForm.value
      const formData = new FormData();
      formData.append("branch", feilds['branch']);
      formData.append("company", JSON.stringify(feilds['company']));
      formData.append("status", JSON.stringify(feilds['status']));
      this.api.IsLoading();
      this.api
        .HttpPostType("reports/BussinessReport/CompanyBranchAdd", formData)
        .then(
          (resp:any) => {
            this.api.HideLoading();
            this.api.Toast(resp['status'], resp['msg'])
            if (resp['status'] == true) {
              this.CloseModel();
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




