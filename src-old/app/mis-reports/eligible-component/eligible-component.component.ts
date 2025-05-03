import { Component, OnInit, Inject } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";



import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-eligible-component',
  templateUrl: './eligible-component.component.html',
  styleUrls: ['./eligible-component.component.css']
})
export class EligibleComponentComponent implements OnInit {

  AddEligible: FormGroup;




  isSubmitted = false;

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  typeEligible: { Id: string; Name: string }[] = [
    { Id: 'NA', Name: 'None' },
    { Id: 'Prime', Name: 'Prime' },
    { Id: 'Silver', Name: 'Silver' },
    { Id: 'Gold', Name: 'Gold' },
    { Id: 'Diamond', Name: 'Diamond' },
    { Id: 'Platinum', Name: 'Platinum' },
    { Id: 'Titanium', Name: 'Titanium' },
    { Id: 'Original', Name: 'Original Business' },

  ];

  currentUrl: string;
  RoleId: any;
  Role_Type: any;
  table_id: any;
  FinancialYear: any;




  constructor(private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<EligibleComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.currentUrl = this.router.url;
    this.RoleId = this.data.Role_Id;
    this.Role_Type = this.data.Role_Type;
    this.table_id = this.data.Id;
    this.FinancialYear = this.data.FinancialYear;


    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };






    this.AddEligible = this.fb.group({
      type: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  ngOnInit() {
  }
  submit() {
    this.isSubmitted = true;
    if (this.AddEligible.invalid) {
      return;
    }
    else {
      var fields = this.AddEligible.value;

      const formData = new FormData();

      formData.append("table_id", this.table_id);
      formData.append("type", fields["type"][0].Id);
      formData.append("roleId", this.RoleId);
      formData.append("roleType", this.Role_Type);
      formData.append("description", fields['description']);
      formData.append("FinancialYear", this.FinancialYear);

      this.api.IsLoading();
      this.api.HttpPostType("GemsWallet/UpdateForclyRemarks", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {

          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );

        }
      )
    }

  }


  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.AddEligible.controls;
  }

}
