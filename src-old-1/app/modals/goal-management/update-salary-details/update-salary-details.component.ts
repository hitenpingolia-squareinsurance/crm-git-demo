import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-salary-details",
  templateUrl: "./update-salary-details.component.html",
  styleUrls: ["./update-salary-details.component.css"],
})
export class UpdateSalaryDetailsComponent implements OnInit {
  EditTargetForm: FormGroup;
  isSubmitted = false;
  MonthName: any;
  selectedFiles: File;
  ExcelFile: File;
  Other_image: any = 0;
  Is_Refresh: any = "No";
  MonthArray: any = [];
  FinancialYear: any = [];
  dropdownSettingsingleselect1: any = {};

  constructor(
    public dialogRef: MatDialogRef<UpdateSalaryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.EditTargetForm = this.formBuilder.group({
      Excel_File: [""],
    });

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.FinancialYear = [
      { Id: "2024", Name: "2024-2025" },
      { Id: "2023", Name: "2023-2024" },
      { Id: "2022", Name: "2022-2023" },
    ];

    this.MonthArray = [
      { Id: "April", Name: "April" },
      { Id: "May", Name: "May" },
      { Id: "June", Name: "June" },
      { Id: "July", Name: "July" },
      { Id: "August", Name: "August" },
      { Id: "September", Name: "September" },
      { Id: "October", Name: "October" },
      { Id: "November", Name: "November" },
      { Id: "December", Name: "December" },
      { Id: "January", Name: "January" },
      { Id: "February", Name: "February" },
      { Id: "March", Name: "March" },
    ];
  }

  get FC_6() {
    return this.EditTargetForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
      Is_Refresh: this.Is_Refresh,
    });
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

  //===== SUBMIT STEP 6 DATA =====//
  UploadFinalSalary() {
    this.isSubmitted = true;
    if (this.EditTargetForm.invalid) {
      return;
    } else {
      var fields = this.EditTargetForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("ExcelFile", this.ExcelFile);
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/pms/UpdateSalaryDetails/BulkUpdateSalaryDetails",
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
