import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-appraisal-letter",
  templateUrl: "./create-appraisal-letter.component.html",
  styleUrls: ["./create-appraisal-letter.component.css"],
})
export class CreateAppraisalLetterComponent implements OnInit {
  CreateSalaryForm: FormGroup;
  isSubmitted = false;
  row: any;
  TargetValue: any;
  Is_Refresh: any = "No";
  YearsArray: any = [];
  MonthsArray: any = [];
  PFStatusArray: any = [];
  dropdownSettingSingleSelect: {};

  action_type: any = "";
  emp_id: any;
  rating: any = "";
  f_rating: any = "";
  financial_year: any = "";
  is_promoted: any = "";

  selectedFiles: File;
  ExcelFile: File;
  Other_image: any = 0;

  constructor(
    public dialogRef: MatDialogRef<CreateAppraisalLetterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.CreateSalaryForm = this.formBuilder.group({
      pf_status: [""],
      gross_salary: [""],
      gratuity: [""],
      variable_pay: [""],
      effective_month: ["", [Validators.required]],
      effective_year: ["", [Validators.required]],
      excel_file: [""],
    });

    this.dropdownSettingSingleSelect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
    };
  }

  ngOnInit() {
    this.action_type = this.data.action_type;
    this.emp_id = this.data.emp_id;
    this.rating = this.data.rating;
    this.f_rating = this.data.f_rating;
    this.financial_year = this.data.financial_year;
    this.is_promoted = this.data.is_promoted;

    if (this.rating == "" || this.rating == "Calculating...") {
      this.CloseModel();
    }

    if (this.action_type == "bulk") {
      this.CreateSalaryForm.get("excel_file").setValidators([
        Validators.required,
      ]);
      this.CreateSalaryForm.get("excel_file").updateValueAndValidity();
    } else {
      this.CreateSalaryForm.get("pf_status").setValidators([
        Validators.required,
      ]);
      this.CreateSalaryForm.get("pf_status").updateValueAndValidity();

      this.CreateSalaryForm.get("gross_salary").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*.?[0-9]*$"),
      ]);
      this.CreateSalaryForm.get("gross_salary").updateValueAndValidity();

      this.CreateSalaryForm.get("gratuity").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*.?[0-9]*$"),
      ]);
      this.CreateSalaryForm.get("gratuity").updateValueAndValidity();

      this.CreateSalaryForm.get("variable_pay").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*.?[0-9]*$"),
      ]);
      this.CreateSalaryForm.get("variable_pay").updateValueAndValidity();
    }

    this.SearchComponentsData();
  }

  get formControls() {
    return this.CreateSalaryForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
      Is_Refresh: this.Is_Refresh,
    });
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/appraisals/HrRatings/GetCreateAppraisalLetterFormArrays",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.YearsArray = result["Data"]["YearsArray"];
            this.MonthsArray = result["Data"]["MonthsArray"];
            this.PFStatusArray = result["Data"]["PFStatusArray"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.Other_image = 0;
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "xlsx" || ext == "Xlsx" || ext == "XLSX") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 2 mb");
        } else {
          if (Type == "Excel") {
            this.ExcelFile = this.selectedFiles;
          }
          this.Other_image = 1;
        }
      } else {
        this.api.Toast("Error", "Please choose vaild file ! Example :- xlsx");
      }
    }
  }

  //===== CREATE OFFER LETTER =====//
  CreateAppraisalLetter() {
    this.isSubmitted = true;
    if (this.CreateSalaryForm.invalid) {
      return;
    } else {
      var fields = this.CreateSalaryForm.value;
      var fun_name = "CreateAppraisalLetter";
      const formData = new FormData();
      formData.append("user_code", this.api.GetUserData("Code"));
      formData.append("action_type", this.action_type);
      formData.append("type", "Appraisal");

      if (this.action_type == "bulk") {
        formData.append("ExcelFile", this.ExcelFile);
        var fun_name = "CreateAppraisalLetterInBulk";
      } else {
        formData.append("emp_id", this.emp_id);
        formData.append("rating", this.rating);
        formData.append("f_rating", this.f_rating);
        formData.append("financial_year", this.financial_year);
        formData.append("is_promoted", this.is_promoted);
        formData.append("pf_status", JSON.stringify(fields["pf_status"]));
        formData.append("gross_salary", fields["gross_salary"]);
        formData.append("gratuity", fields["gratuity"]);
        formData.append("variable_pay", fields["variable_pay"]);
      }

      formData.append(
        "effective_month",
        JSON.stringify(fields["effective_month"])
      );
      formData.append(
        "effective_year",
        JSON.stringify(fields["effective_year"])
      );

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/appraisals/HrRatings/" + fun_name,
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Is_Refresh = "Yes";
              this.api.Toast("Success", result["Message"]);
              this.CloseModel();
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast("Warning", "Network Error, Please try again ! ");
          }
        );
    }
  }
}
