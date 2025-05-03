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
  selector: "app-salary-remarks",
  templateUrl: "./salary-remarks.component.html",
  styleUrls: ["./salary-remarks.component.css"],
})
export class SalaryRemarksComponent implements OnInit {
  SalaryRemarkForm: FormGroup;
  isSubmitted = false;
  EmployeeId: any;
  row: any;
  MonthName: any;
  Sequence: any = 0;
  ShowDaysField: any = "No";
  Is_Refresh: any = "No";
  ShowDayField: any = "No";
  ShowSalaryField: any = "No";

  SalaryRemarksArray: any = [];
  PartialTypeArray: any = [];
  financial_year: any = "";
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialogRef: MatDialogRef<SalaryRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.SalaryRemarkForm = this.formBuilder.group({
      SalaryType: [""],
      PartialType: [""],
      Remarks: [""],
      TotalDays: [""],
      TotalSalary: [""],
    });

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.EmployeeId = this.data.EmployeeId;
    this.MonthName = this.data.MonthName;
    this.Sequence = this.data.Sequence;
    this.financial_year = this.data.financial_year;

    this.SalaryRemarksArray = [
      { Id: "Full", Name: "Full" },
      { Id: "Partial", Name: "Partial" },
      { Id: "Hold", Name: "Hold" },
      { Id: "None", Name: "Nil" },
    ];
    this.PartialTypeArray = [
      { Id: "Salary", Name: "CTC" },
      { Id: "Days", Name: "Days" },
    ];
  }

  get FC_6() {
    return this.SalaryRemarkForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
      Is_Refresh: this.Is_Refresh,
    });
  }

  //===== ON ITEM SELECT =====//
  onItemSelect(e: any) {
    this.ShowDaysField = "No";
    if (e.Id == "Partial") {
      this.ShowDaysField = "Yes";
    }
  }

  //===== ON ITEM SELECT =====//
  onItemSelect1(e: any) {
    this.ShowDayField = "No";
    this.ShowSalaryField = "No";

    if (e.Id == "Salary") {
      this.ShowSalaryField = "Yes";
      this.ShowDayField = "No";
    }

    if (e.Id == "Days") {
      this.ShowDayField = "Yes";
      this.ShowSalaryField = "No";
    }
  }

  //===== ENABLE DISABLE FIELDS =====//
  EnableDiableFields(e: any) {
    if (e == "TotalSalary") {
      this.SalaryRemarkForm.get("TotalDays").setValue("");
    } else {
      this.SalaryRemarkForm.get("TotalSalary").setValue("");
    }
  }

  //===== SUBMIT STEP 6 DATA =====//
  SubmitSalaryRemarks() {
    this.isSubmitted = true;
    if (this.SalaryRemarkForm.invalid) {
      return;
    } else {
      var fields = this.SalaryRemarkForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("EmployeeId", this.EmployeeId);
      formData.append("Sequence", this.Sequence);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", this.MonthName);
      formData.append("SalaryType", JSON.stringify(fields["SalaryType"]));
      formData.append("PartialType", JSON.stringify(fields["PartialType"]));
      formData.append("TotalDays", fields["TotalDays"]);
      formData.append("TotalSalary", fields["TotalSalary"]);
      formData.append("Remarks", fields["Remarks"]);
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/CrudFunctions/UpdateSalaryRemarks",
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
