import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-target-achievement-details-old",
  templateUrl: "./target-achievement-details-old.component.html",
  styleUrls: ["./target-achievement-details-old.component.css"],
})
export class TargetAchievementDetailsOldComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted = false;
  dataAr: any = [];

  SalaryRemarkForm: FormGroup;
  isSubmitted1 = false;
  row: any;
  Sequence: any = 0;
  ShowDaysField: any = "No";
  Is_Refresh: any = "No";
  ShowDayField: any = "No";
  ShowSalaryField: any = "No";

  Employee_Id: any = "";
  Vertical_Data: any = "";
  MonthNamCon: any = "";
  MonthConSr: any = "";
  MonthConDsr: any = "";
  IsSales: any = "";
  Department_Id: any = "";
  financial_year: any = "";
  LoginProfileName: any = "";
  Profile_Type: any = "";
  ShowSelfData: any = "";
  ShowTeamData: any = "";

  ProfileTotalTarget: any = "0";
  ProfileTotalBusiness: any = "0";
  ProfileAchievement: any = "0.00";

  AllocatedTeamTarget: any = "0";
  AllocatedTeamBusiness: any = "0";
  AllocatedTeamAchievement: any = "0.00";

  AllocatedSelfTarget: any = "0";
  AllocatedSelfBusiness: any = "0";
  AllocatedSelfAchievement: any = "0.00";

  ProfileTotalTargetStr: any = "0.00";
  ProfileTotalBusinessStr: any = "0.00";
  AllocatedTeamTargetStr: any = "0.00";
  AllocatedTeamBusinessStr: any = "0.00";
  AllocatedSelfTargetStr: any = "0.00";
  AllocatedSelfBusinessStr: any = "0.00";

  TotalRevenue: any = "0";
  TeamRevenue: any = "0";
  SelfRevenue: any = "0";

  TotalRevenueStr: any = "0.00";
  TeamRevenueStr: any = "0.00";
  SelfRevenueStr: any = "0.00";

  TotalActiveDays: any;
  TotalBusinessVirtual: any;
  TotalBusinessVisit: any;
  LmsCallCount: any;
  TeleRmCallCount: any;
  RenewalCallCount: any;

  TotalTotalCost: any = "0";
  TeamTotalCost: any = "0";
  SelfTotalCost: any = "0";
  ActualTotalCost: any = "0";
  TeamActualCost: any = "0";
  SelfActualCost: any = "0";
  AllTotalCost: any = "0";
  AllActualCost: any = "0";
  TotalTotalCostStr: any = "0.00";
  TeamTotalCostStr: any = "0.00";
  SelfTotalCostStr: any = "0.00";
  ActualTotalCostStr: any = "0.00";
  TeamActualCostStr: any = "0.00";
  SelfActualCostStr: any = "0.00";

  ShowSelfActualCost: any = "No";
  ShowTeamActualCost: any = "No";
  ShowSelfTotalCost: any = "No";
  ShowTeamTotalCost: any = "No";
  ShowTotalTotalCost: any = "No";
  ShowTotalActualCost: any = "No";

  SalaryRemarksArray: { Id: string; Name: string }[];
  PartialTypeArray: { Id: string; Name: string }[];

  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialogRef: MatDialogRef<TargetAchievementDetailsOldComponent>,
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
    this.Employee_Id = this.data.Employee_Id;
    this.Vertical_Data = this.data.Vertical_Data;
    this.MonthNamCon = this.data.MonthNamCon;
    this.MonthConSr = this.data.MonthConSr;
    this.MonthConDsr = this.data.MonthConDsr;
    this.IsSales = this.data.IsSales;
    this.Department_Id = this.data.Department_Id;
    this.financial_year = this.data.financial_year;
    this.LoginProfileName = this.data.LoginProfileName;
    this.Profile_Type = this.data.Profile_Type;
    this.SelfTotalCost = this.data.SelfTotalCost;
    this.SelfActualCost = this.data.SelfActualCost;
    this.ShowSelfData = this.data.ShowSelfData;
    this.Sequence = this.data.Sequence;
    this.ShowTeamData = this.data.ShowTeamData;

    this.GetBasicDetails();
    this.GetCostDetails();
    this.GetSalaryRemarksTrack();

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

  //===== GET EMPLOYEES EXTRA DATA =====//
  GetBasicDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("Department_Id", this.Department_Id);
    formData.append("MonthNamCon", this.MonthNamCon);
    formData.append("MonthConSr", this.MonthConSr);
    formData.append("MonthConDsr", this.MonthConDsr);
    formData.append("IsSales", this.IsSales);
    formData.append("Portal", "CRM");
    formData.append("Vertical_Data", this.Vertical_Data);
    formData.append("financial_year", this.financial_year);

    this.api
      .HttpPostTypeBms(
        "goal-management-system/AllocatedBusinessTargets/GetExtraData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            //== Profile Target Related ==//
            this.ProfileTotalTarget = result["ProfileTotalTarget"];
            this.ProfileTotalTargetStr = result["ProfileTotalTargetStr"];
            this.ProfileTotalBusiness = result["ProfileTotalBusiness"];
            this.ProfileTotalBusinessStr = result["ProfileTotalBusinessStr"];
            this.ProfileAchievement = result["ProfileAchievement"];

            this.AllocatedTeamTarget = result["AllocatedTeamTarget"];
            this.AllocatedTeamTargetStr = result["AllocatedTeamTargetStr"];
            this.AllocatedTeamBusiness = result["AllocatedTeamBusiness"];
            this.AllocatedTeamBusinessStr = result["AllocatedTeamBusinessStr"];
            this.AllocatedTeamAchievement = result["AllocatedTeamAchievement"];

            this.AllocatedSelfTarget = result["AllocatedSelfTarget"];
            this.AllocatedSelfTargetStr = result["AllocatedSelfTargetStr"];
            this.AllocatedSelfBusiness = result["AllocatedSelfBusiness"];
            this.AllocatedSelfBusinessStr = result["AllocatedSelfBusinessStr"];
            this.AllocatedSelfAchievement = result["AllocatedSelfAchievement"];

            this.TeamRevenue = result["TeamRevenue"];
            this.SelfRevenue = result["SelfRevenue"];
            this.TotalRevenue = result["TotalRevenue"];

            this.TeamRevenueStr = result["TeamRevenueStr"];
            this.SelfRevenueStr = result["SelfRevenueStr"];
            this.TotalRevenueStr = result["TotalRevenueStr"];

            this.TotalActiveDays = result["TotalActiveDays"];
            this.TotalBusinessVirtual = result["TotalBusinessVirtual"];
            this.TotalBusinessVisit = result["TotalBusinessVisit"];
            this.LmsCallCount = result["LmsCallCount"];
            this.TeleRmCallCount = result["TeleRmCallCount"];
            this.RenewalCallCount = result["RenewalCallCount"];
          } else {
            this.api.Toast("Warning", "Some error occured!");
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== GET TEAM TOTAL COST IN CHUNKS =====//
  GetCostDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("Department_Id", this.Department_Id);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("Portal", "CRM");
    formData.append("Vertical_Data", this.Vertical_Data);
    formData.append("financial_year", this.financial_year);
    formData.append("SelfTotalCost", this.SelfTotalCost);
    formData.append("SelfActualCost", this.SelfActualCost);

    this.api
      .HttpPostTypeBms(
        "goal-management-system/LazyCalculations/GetTotalTeamCost",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.TotalTotalCost = result["TotalTotalCost"];
            this.TotalTotalCostStr = result["TotalTotalCostStr"];
            this.TeamTotalCost = result["TeamTotalCost"];
            this.TeamTotalCostStr = result["TeamTotalCostStr"];
            this.SelfTotalCostStr = result["SelfTotalCostStr"];

            this.ActualTotalCost = result["ActualTotalCost"];
            this.ActualTotalCostStr = result["ActualTotalCostStr"];
            this.TeamActualCost = result["TeamActualCost"];
            this.TeamActualCostStr = result["TeamActualCostStr"];
            this.SelfActualCostStr = result["SelfActualCostStr"];

            this.AllTotalCost = result["TotalTotalCost"];
            this.TotalTotalCostStr = result["TotalTotalCostStr"];
            this.AllActualCost = result["ActualTotalCost"];
            this.ActualTotalCostStr = result["ActualTotalCostStr"];
          } else {
            this.api.Toast("Warning", "Some error occured!");
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== SUBMIT FORM =====//
  GetSalaryRemarksTrack() {
    const formData = new FormData();
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/CrudFunctions/GetSalaryRemarksTrack",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.dataAr = result["Data"];
          } else {
            this.dataAr = result["Data"];
          }
        },
        (err) => { }
      );
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
      formData.append("EmployeeId", this.Employee_Id);
      formData.append("Sequence", this.Sequence);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", this.MonthNamCon);
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

  //===== SHOW HIDE TOTAL COST =====//
  ShowHideCost(Type: any, Value: any) {
    if (Type == "SelfActual") {
      this.ShowSelfActualCost = Value;
    }

    if (Type == "TeamActual") {
      this.ShowTeamActualCost = Value;
    }

    if (Type == "SelfTotal") {
      this.ShowSelfTotalCost = Value;
    }

    if (Type == "TeamTotal") {
      this.ShowTeamTotalCost = Value;
    }

    if (Type == "TotalTotal") {
      this.ShowTotalTotalCost = Value;
    }

    if (Type == "TotalActual") {
      this.ShowTotalActualCost = Value;
    }
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
