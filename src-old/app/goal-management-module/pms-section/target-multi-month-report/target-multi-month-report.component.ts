import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { TargetDetailsComponent } from "../../../modals/goal-management/target-details/target-details.component";
import { SalaryRemarksComponent } from "../../../modals/goal-management/salary-remarks/salary-remarks.component";
import { SalaryRemarksTrackComponent } from "../../../modals/goal-management/salary-remarks-track/salary-remarks-track.component";
import { EditLwpComponent } from "../../../modals/goal-management/edit-lwp/edit-lwp.component";

import { DownloadingViewComponent } from "../../../modals/downloading-view/downloading-view.component";
import { ViewGivenTargetComponent } from "../../../modals/goal-management/view-given-target/view-given-target.component";

class ColumnsObj {
  Id: string;
  Name: string;
  Mobile: string;
  Profile_Type: string;
  DOJ: string;
  Department_Id: string;
  Status: string;
  ResignStatus: string;
  Revenue: string;
  SelfRevenue: string;
  TotalRevenue: string;
  TotalCost: string;
  TeamTotalCost: string;
  T_Total_Cost: string;

  ActualCost: string;
  TeamActualCost: string;
  T_Actual_Cost: string;

  Business: string;
  SelfBusiness: string;
  TotalBusiness: string;
  Total_Allocated_Target: string;
  SelfTotalAllocatedTarget: string;

  Total_Profile_Target: string;
  TotalProfileBusiness: string;
  ProfileAchivement: string;

  AchivementPercent: string;
  SelfAchivementPercent: string;
  TotalActiveDays: string;
  MonthNamCon: string;
  MonthConSr: string;
  MonthConDsr: string;
  SalaryRemarks: string;
  DaysCount: string;
  TotalLwp: string;
  FinalLwp: string;
  LastLwpSequence: string;
  TotalSalary: string;
  Remarks: string;
  IsEdit: string;
  Is_Sales: string;
  LastSalarySequence: string;
  NewProfile: string;
  ServiceLocation: string;
  SalaryUpdatedBy: string;
  ShowTeamData: string;
  ShowSelfActualCost: string;
  ShowTotalActualCost: string;
  ShowTeamActualCost: string;
  ShowSelfTotalCost: string;
  ShowTeamTotalCost: string;
  ShowTotalTotalCost: string;
  TimeExceed: string;
  TotalBusinessVirtual: string;
  TotalBusinessVisit: string;
  LmsCallCount: string;
  TeleRmCallCount: string;
  RenewalCallCount: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  MonthConDsr: any;
  MonthConSr: any;
  MonthNamCon: any;
  PmsJoin: any;
  ShowAllocatedTargetTab: any;
}

@Component({
  selector: "app-target-multi-month-report",
  templateUrl: "./target-multi-month-report.component.html",
  styleUrls: ["./target-multi-month-report.component.css"],
})
export class TargetMultiMonthReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};
  mytime: Date = new Date();

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;

  UserRights: any = [];
  ShowLoader12: string = "No";

  Year_Ar: Array<any>;
  SelectedYear: any = [];

  President_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  ReportTypeData: Array<any>;
  ItemEmployeeSelection: any = [];
  LobData: any = [];
  MonthArray: any = [];
  SelectedMonth: any = "";
  CurrentMonth: any = "";
  Name: any = "";
  SelectedCurrentMonth: any = [];
  SelectedMonthNo: any = "";

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  MonthConDsr: any;
  MonthConSr: any;
  MonthNamCon: any;
  Is_Export: any = 0;

  MessageBody: string = "";
  ActionType: any = "";

  checklist: any = [];
  checkedList: any = [];
  currentUrl: string;
  urlSegment: any;

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  GivenTarget: any = 0;
  GivenAchivement: any = 0;
  MonthlyGivenAchivement: any = 0;
  ProfileTarget: any = 0;
  ProfileAchivement: any = 0;
  MonthlyProfileAchivement: any = 0;
  AllocatedTarget: any = 0;
  AllocatedAcivement: any = 0;
  MonthlyAllocatedAcivement: any = 0;
  PoolTarget: any = 0;
  AchivementData: any = 0;
  MonthlyAchivementData: any = 0;

  FilterEmpId: any;
  FilterReportType: any;
  SelectedReportType: { Id: string; Name: string }[];
  FilterVerticalId: any = "";
  fy_selected: any = "";

  NewGivenTarget: any = "";
  NewProfileTarget: any = "";
  NewAllocatedTarget: any = "";
  NewPoolTarget: any = "";
  NewAchivementData: any = "";
  MonthlyNewAchivementData: any = "";

  ProfileName: any;
  IsSales: any;
  IdType: string;
  EmpId: any;
  LoginProfileName: any;
  PType: any;
  LoginIsSales: any;
  TotalRevenue: any = 0;
  TotalRevenueString: any = "";
  TotalCost: any = 0;
  TotalCostString: any = "";
  ActualCost: any = 0;
  ActualCostString: any = "";
  Sequence: any = 0;
  index: any;

  activePage: any = 0;

  total: any = 0;
  flag: any = 0;
  flagArray: any = [];

  pageStart: any = [];
  PTypeD: any;
  MonthSrCondition: any;
  PmsJoin: any;
  ShowAllocatedTargetTab: any = "";
  ShowHideAllocatedTargetTab: any = "No";
  TotalAllocatedTarget: any = 0;
  TotalAllocatedTargetString: any = "";
  TotalProfileTarget: any = 0;
  TotalProfileTargetString: any = "";
  CompleteMonthlyProfileTarget: any = 0;
  CompleteMonthlyProfileTargetString: any = "";
  CompleteMonthlyAllocatedTarget: any = 0;
  CompleteMonthlyAllocatedTargetString: any = "";
  current_fy: any;
  month_selected: any = "";
  FunctionName: string;
  Is_Multi_Month: any = "No";
  Select_Multi_Month: any = "No";
  Remarks: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Financial_Year: [""],
      President_Id: [""],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      Report_Type: [""],
      Month_Name: [""],
      SearchValue: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit(): void {
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    this.EmpId = this.api.GetUserData("Code");
    this.IdType = "Code";

    this.SearchComponentsData();
    this.GetEmployeeExtraData("0");
    this.GetLoginEmployeeData();

    this.LobData = [
      { Id: "Club_NonMotor", Name: "Non Motor" },
      { Id: "Club_Health", Name: "Health" },
      { Id: "Club_Life", Name: "Life" },
      { Id: "Club_Finance", Name: "Finance" },
      { Id: "Club_Mutual_Fund", Name: "Mutual Fund" },
    ];

    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];

    //Month Related Filter Values
    const d = new Date();
    this.CurrentMonth = d.getMonth();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    //Month String Value
    this.Name = month[d.getMonth()];

    //Month Numeric Value
    this.CurrentMonth = +this.CurrentMonth + +1;
    if (this.CurrentMonth < 10) {
      this.CurrentMonth = "0" + this.CurrentMonth;
    }
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/SearchComponentsData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];
            this.President_Ar = result["Data"]["President_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.current_fy = result["Data"]["current_fy"];
            this.MonthArray = result["Data"]["MonthArray"];
            this.SelectedCurrentMonth = result["Data"]["SelectedCurrentMonth"];

            this.GetEmployees();
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET VERTICAL DATA =====//
  GetVerticalData() {
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];
    this.Select_Multi_Month = "No";
    if (this.SearchForm.get("President_Id").value.length == 1) {
      this.Select_Multi_Month = "Yes";
    }

    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";
    this.SearchForm.get("Emp_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "President_Id",
      JSON.stringify(this.SearchForm.value["President_Id"])
    );

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetVerticalData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.SearchForm.get("Vertical_Id").setValue("");
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

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    this.SearchForm.get("Emp_Id").setValue("");
    this.Select_Multi_Month = "No";
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Vertical_Id",
      JSON.stringify(this.SearchForm.value["Vertical_Id"])
    );
    formData.append(
      "Region_Id",
      JSON.stringify(this.SearchForm.value["Region_Id"])
    );
    formData.append(
      "Sub_Region_Id",
      JSON.stringify(this.SearchForm.value["Sub_Region_Id"])
    );

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetEmployees",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Emps_Ar = result["Data"];
            this.Employee_Placeholder =
              "Select Employee (" + this.Emps_Ar.length + ")";
            this.Agents_Placeholder = "Select Agent";
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.SearchForm.get("Emp_Id").setValue("");
            this.Emps_Ar = [];
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

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.flagArray = [];
    this.total = 0;
    var fields = this.SearchForm.reset();

    this.FilterReportType = "";
    this.FilterEmpId = "";
    this.FilterVerticalId = "";
    this.EmpId = this.api.GetUserData("Code");
    this.IdType = "Code";
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];

    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("SearchValue").setValue("");

    this.Agents_Placeholder = "Select Agent";
    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
    //this.ResetDT();

    this.GivenTarget = 0;
    this.NewGivenTarget = "";
    this.GivenAchivement = 0;
    this.MonthlyGivenAchivement = 0;
    this.ProfileTarget = 0;
    this.NewProfileTarget = "";
    this.ProfileAchivement = 0;
    this.MonthlyProfileAchivement = 0;
    this.AllocatedTarget = 0;
    this.NewAllocatedTarget = "";
    this.AllocatedAcivement = 0;
    this.MonthlyAllocatedAcivement = 0;
    this.AchivementData = 0;
    this.NewAchivementData = "";
    this.MonthlyAchivementData = 0;
    this.MonthlyNewAchivementData = "";
    this.PoolTarget = 0;
    this.NewPoolTarget = "";
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== DISPLAY ACTIVE PAGE =====//
  displayActivePage(activePageNumber: number, btnType: any): void {
    if (btnType == "search") {
      this.flagArray = [];
    }

    this.activePage = activePageNumber;
    this.GetData();
  }

  //===== GET DATA =====//
  GetData() {
    if (typeof this.flagArray[this.activePage] === "undefined") {
      var fields = this.SearchForm.value;

      //Search Financial Year
      if (this.SearchForm.get("Financial_Year").value.length > 0) {
        this.fy_selected = fields["Financial_Year"][0]["Id"];
      } else {
        this.fy_selected = "";
      }

      //Month Name
      this.Is_Multi_Month = "No";
      this.FunctionName = "pms/TargetsReport/GetSingleMonthGridData";
      if (this.SearchForm.get("Month_Name").value.length > 0) {
        // Using a loop to create an object
        const month_name_ar = [];
        const month_no_ar = [];
        for (const pair of fields["Month_Name"]) {
          month_name_ar.push(pair.Name);
          month_no_ar.push(pair.Id);
        }

        this.SelectedMonth = month_name_ar;
        this.SelectedMonthNo = month_no_ar;
        this.month_selected = month_name_ar;

        if (
          this.SearchForm.get("Month_Name").value.length > 1 &&
          (this.SearchForm.get("Emp_Id").value.length == 1 ||
            this.SearchForm.get("President_Id").value.length == 1)
        ) {
          this.FunctionName = "pms/TargetsReport/GetMultiMonthGridData";
          this.Is_Multi_Month = "Yes";
        }
      } else {
        this.SelectedMonth = this.Name;
        this.SelectedMonthNo = this.CurrentMonth;
        this.month_selected = "";
      }

      //Search Vertical ID
      if (this.SearchForm.get("Vertical_Id").value.length > 0) {
        this.FilterVerticalId = fields["Vertical_Id"];
      } else {
        this.FilterVerticalId = "";
      }

      //Search Employee ID
      if (this.SearchForm.get("Emp_Id").value.length == 1) {
        this.FilterEmpId = fields["Emp_Id"][0]["Id"];
        this.EmpId = this.SearchForm.value["Emp_Id"][0]["Id"];
        this.IdType = "Id";
      } else if (this.SearchForm.get("President_Id").value.length == 1) {
        this.FilterEmpId = fields["President_Id"][0]["Id"];
        this.EmpId = this.SearchForm.value["President_Id"][0]["Id"];
        this.IdType = "Id";
      } else {
        this.FilterEmpId = "";
        this.EmpId = this.api.GetUserData("Code");
        this.IdType = "Code";
      }

      //Report Type
      if (this.SearchForm.get("Report_Type").value.length == 1) {
        this.FilterReportType = fields["Report_Type"][0]["Id"];
      } else {
        this.FilterReportType = "";
      }

      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("urlSegment", this.urlSegment);
      formData.append("Portal", "CRM");
      formData.append("Page", this.activePage);
      formData.append(
        "Financial_Year",
        JSON.stringify(fields["Financial_Year"])
      );
      formData.append("President_Id", JSON.stringify(fields["President_Id"]));
      formData.append("Vertical_Id", JSON.stringify(fields["Vertical_Id"]));
      formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
      formData.append("Emp_Id", JSON.stringify(fields["Emp_Id"]));
      formData.append("Report_Type", JSON.stringify(fields["Report_Type"]));
      formData.append("Month_Name", JSON.stringify(fields["Month_Name"]));
      formData.append("SearchValue", fields["SearchValue"]);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/" + this.FunctionName,
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            this.SQL_Where_STR = result["SQL_Where"];

            if (result["Status"] == true) {
              this.MonthSrCondition = result["MonthConSr"];
              this.PmsJoin = result["PmsJoin"];
              this.ShowAllocatedTargetTab = result["ShowAllocatedTargetTab"];
              if (this.activePage == 1) {
                this.total = result["recordsTotal"];
              }

              this.ShowHideAllocatedTargetTab = "No";
              if (
                this.ShowAllocatedTargetTab == "Yes" &&
                (this.LoginProfileName == "MD" ||
                  this.LoginProfileName == "CEO" ||
                  this.LoginProfileName == "President")
              ) {
                this.ShowAllocatedTargetData();
                this.ShowHideAllocatedTargetTab = "Yes";
              }

              this.dataAr = result["data"];
              this.GetYTDChanks();
              this.GetTeamCostChunks();

              if (this.activePage == 1) {
                this.GetTotalRevenueCost();
                this.GetHeaderMonthlyTarget();
                this.GetHeaderData();
              }

              this.pageStart[this.activePage] = result["pageStart"];
              this.flagArray[this.activePage] = result["data"];

              this.GetEmployeeExtraData("1");
            } else {
              this.Sub_Branch_Ar = [];
              this.GetEmployees();
            }
          },
          (err) => {}
        );
    }
  }

  //===== SHOW ALLOCATED TARGET DATA TAB=====//
  ShowAllocatedTargetData() {
    const formData = new FormData();

    formData.append("Portal", "CRM");
    formData.append("VerticalId", this.FilterVerticalId[0]["Id"]);
    formData.append("MonthName", this.SelectedMonth);
    formData.append("financial_year", this.fy_selected);

    this.api
      .HttpPostTypeBms(
        "goal-management-system/LazyCalculations/ShowAllocatedTargetTabData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.TotalAllocatedTarget = result["AllocatedTotalTarget"];
            this.TotalAllocatedTargetString =
              result["AllocatedTotalTargetString"];
            this.TotalProfileTarget = result["ProfileTotalTarget"];
            this.TotalProfileTargetString = result["ProfileTotalTargetString"];
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  //===== GET TOTAL REVENUE AND COST DATA =====//
  GetTotalRevenueCost() {
    var fields = this.SearchForm.value;
    var vert: any = "";
    if (this.SearchForm.get("Vertical_Id").value.length > 0) {
      vert = fields["Vertical_Id"];
    }

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    //formData.append('President_Id', JSON.stringify(fields['President_Id']));
    formData.append("Report_Type", this.FilterReportType);
    formData.append("financial_year", this.fy_selected);
    formData.append("MonthName", this.SelectedMonth);
    formData.append("SqlWhere", this.SQL_Where_STR);
    formData.append("PmsJoin", this.PmsJoin);
    formData.append("EmpId", this.EmpId);
    formData.append("IdType", this.IdType);
    formData.append("Is_Multi_Month", this.Is_Multi_Month);
    formData.append("Vertical_Data", JSON.stringify(vert));

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/LazyCalculations/GetTotalRevenueCost",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.TotalRevenue = result["TotalRevenue"];
            this.TotalRevenueString = result["TotalRevenueString"];
            this.TotalCost = result["TotalCost"];
            this.TotalCostString = result["TotalCostString"];
            this.ActualCost = result["ActualCost"];
            this.ActualCostString = result["ActualCostString"];
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    var Vertical_Data: any;
    if (this.FilterVerticalId == "") {
      Vertical_Data = "";
    } else {
      Vertical_Data = JSON.stringify(this.FilterVerticalId);
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var Employee_Id = this.dataAr[i]["Id"];
      var MonthNamCon = this.dataAr[i]["MonthNamCon"];
      var MonthConSr = this.dataAr[i]["MonthConSr"];
      var MonthConDsr = this.dataAr[i]["MonthConDsr"];
      var IsSales = this.dataAr[i]["Is_Sales"];
      var Department_Id = this.dataAr[i]["Department_Id"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", Employee_Id);
      formData.append("Department_Id", Department_Id);
      formData.append("MonthNamCon", MonthNamCon);
      formData.append("MonthConSr", MonthConSr);
      formData.append("MonthConDsr", MonthConDsr);
      formData.append("IsSales", IsSales);
      formData.append("Portal", "CRM");
      formData.append("Vertical_Data", Vertical_Data);
      formData.append("financial_year", this.fy_selected);

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/AllocatedBusinessTargets/GetExtraData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          ////   //   console.log(data.Agent_Id);
          var data = JSON.parse(this.api.decryptText(res.response));

          this.flagArray[this.activePage][i]["Total_Profile_Target"] =
            data.ProfileTotalTarget;
          this.flagArray[this.activePage][i]["ProfileTotalBusiness"] =
            data.ProfileTotalBusiness;
          this.flagArray[this.activePage][i]["ProfileAchivement"] =
            data.ProfileAchivement;

          this.flagArray[this.activePage][i]["Total_Allocated_Target"] =
            data.AllocatedTeamTarget;
          this.flagArray[this.activePage][i]["Business"] = data.AchivementData;
          this.flagArray[this.activePage][i]["AchivementPercent"] =
            data.AllocatedAcivement;

          this.flagArray[this.activePage][i]["SelfTotalAllocatedTarget"] =
            data.AllocatedSelfTarget;

          this.flagArray[this.activePage][i]["SelfAchivementPercent"] =
            data.SelfAllocatedAchivement;
          this.flagArray[this.activePage][i]["SelfBusiness"] =
            data.SelfBusiness;
          this.flagArray[this.activePage][i]["Revenue"] = data.Revenue;
          this.flagArray[this.activePage][i]["SelfRevenue"] = data.SelfRevenue;
          this.flagArray[this.activePage][i]["TotalRevenue"] =
            data.TotalRevenue;
          this.flagArray[this.activePage][i]["TotalActiveDays"] =
            data.TotalActiveDays;
          this.flagArray[this.activePage][i]["TotalBusinessVirtual"] =
            data.TotalBusinessVirtual;
          this.flagArray[this.activePage][i]["TotalBusinessVisit"] =
            data.TotalBusinessVisit;
          this.flagArray[this.activePage][i]["LmsCallCount"] =
            data.LmsCallCount;
          this.flagArray[this.activePage][i]["TeleRmCallCount"] =
            data.TeleRmCallCount;
          this.flagArray[this.activePage][i]["RenewalCallCount"] =
            data.RenewalCallCount;
        });
    }
  }

  //===== GET TEAM TOTAL COST IN CHUNKS =====//
  async GetTeamCostChunks() {
    var Vertical_Data;
    if (this.FilterVerticalId == "") {
      Vertical_Data = "";
    } else {
      Vertical_Data = JSON.stringify(this.FilterVerticalId);
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var Employee_Id = this.dataAr[i]["Id"];
      var MonthName = this.dataAr[i]["MonthNamCon"];
      var SelfTotalCost = this.dataAr[i]["TotalCost"];
      var SelfActualCost = this.dataAr[i]["ActualCost"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", Employee_Id);
      formData.append("financial_year", this.fy_selected);
      formData.append("MonthName", MonthName);
      formData.append("Portal", "CRM");
      formData.append("Vertical_Data", Vertical_Data);
      formData.append("SelfTotalCost", SelfTotalCost);
      formData.append("SelfActualCost", SelfActualCost);

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/LazyCalculations/GetTotalTeamCost";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.flagArray[this.activePage][i]["TeamTotalCost"] =
            data.TeamTotalCost;
          this.flagArray[this.activePage][i]["T_Total_Cost"] =
            data.T_Total_Cost;

          this.flagArray[this.activePage][i]["TeamActualCost"] =
            data.TeamActualCost;
          this.flagArray[this.activePage][i]["T_Actual_Cost"] =
            data.T_Actual_Cost;
        });
    }
  }

  //===== GET EMPLOYEES DATA =====//
  GetHeaderData() {
    this.ShowLoader12 = "Yes";

    var Vertical_Data;
    if (this.FilterVerticalId == "") {
      Vertical_Data = "";
    } else {
      Vertical_Data = JSON.stringify(this.FilterVerticalId);
    }

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("President_Id", JSON.stringify(fields["President_Id"]));
    formData.append("Vertical_Data", Vertical_Data);
    formData.append("Employee_Id", this.FilterEmpId);
    formData.append("Report_Type", this.FilterReportType);
    formData.append("MonthName", this.SelectedMonth);
    formData.append("MonthSrCondition", this.MonthSrCondition);
    formData.append("financial_year", this.fy_selected);

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/AllocatedBusinessTargets/GetHeaderData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.ShowLoader12 = "No";

            this.GivenTarget = result["GivenTarget"];
            this.NewGivenTarget = result["NewGivenTarget"];
            this.GivenAchivement = result["GivenAchivement"];
            this.MonthlyGivenAchivement = result["MonthlyGivenAchivement"];

            this.ProfileTarget = result["ProfileTarget"];
            this.NewProfileTarget = result["NewProfileTarget"];
            this.ProfileAchivement = result["ProfileAchivement"];
            this.MonthlyProfileAchivement = result["MonthlyProfileAchivement"];

            this.AllocatedTarget = result["AllocatedTarget"];
            this.NewAllocatedTarget = result["NewAllocatedTarget"];
            this.AllocatedAcivement = result["AllocatedAcivement"];
            this.MonthlyAllocatedAcivement =
              result["MonthlyAllocatedAcivement"];

            this.AchivementData = result["AchivementData"];
            this.NewAchivementData = result["NewAchivementData"];
            this.MonthlyAchivementData = result["MonthlyAchivementData"];
            this.MonthlyNewAchivementData = result["MonthlyNewAchivementData"];

            this.PoolTarget = result["PoolTarget"];
            this.NewPoolTarget = result["NewPoolTarget"];
          } else {
            this.ShowLoader12 = "No";
            this.api.Toast("Warning", result["Message"]);
            this.SearchForm.get("Emp_Id").setValue("");
            this.Emps_Ar = [];
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

  //===== GET EMPLOYEES DATA =====//
  GetHeaderMonthlyTarget() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("MonthName", this.SelectedMonth);
    formData.append("financial_year", this.fy_selected);

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/AllocatedBusinessTargets/GetHeaderMonthlyTarget",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.CompleteMonthlyProfileTarget = result["MonthlyProfileTarget"];
            this.CompleteMonthlyProfileTargetString =
              result["MonthlyProfileTargetString"];
            this.CompleteMonthlyAllocatedTarget =
              result["MonthlyAllocatedTarget"];
            this.CompleteMonthlyAllocatedTargetString =
              result["MonthlyAllocatedTargetString"];
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  //===== GET EMPLOYEES EXTRA DATA =====//
  GetEmployeeExtraData(type: any) {
    if (type == 0) {
      this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];
    }

    this.Select_Multi_Month = "No";
    if (
      this.SearchForm.get("Emp_Id").value.length == 1 ||
      (type == 1 && this.SearchForm.get("President_Id").value.length == 1)
    ) {
      this.Select_Multi_Month = "Yes";
    }

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Employee_Id", this.EmpId);
    formData.append("IdType", this.IdType);

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetEmployeeExtraData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.ProfileName = result["ProfileName"];
            this.IsSales = result["IsSales"];
            this.PTypeD = result["PType"];
          } else {
            this.ProfileName = "";
            this.IsSales = 0;
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

  //===== GET LOGIN EMPLOYEE DATA =====//
  GetLoginEmployeeData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("IdType", "Code");
    formData.append("UrlSegment", "Employee-Targets");

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetLoginEmployeeData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            //   //   //   console.log(result);
            this.LoginProfileName = result["ProfileName"];
            this.LoginIsSales = result["IsSales"];
            this.Sequence = result["Sequence"];
            this.PType = result["PType"];
          } else {
            this.ProfileName = "";
            this.IsSales = 0;
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

  //===== SHOW HIDE TOTAL COST =====//
  ShowHideCost(Index: any, Type: any, Value: any) {
    if (Type == "SelfActual") {
      this.flagArray[this.activePage][Index]["ShowSelfActualCost"] = Value;
    }

    if (Type == "TeamActual") {
      this.flagArray[this.activePage][Index]["ShowTeamActualCost"] = Value;
    }

    if (Type == "SelfTotal") {
      this.flagArray[this.activePage][Index]["ShowSelfTotalCost"] = Value;
    }

    if (Type == "TeamTotal") {
      this.flagArray[this.activePage][Index]["ShowTeamTotalCost"] = Value;
    }

    if (Type == "TotalTotal") {
      this.flagArray[this.activePage][Index]["ShowTotalTotalCost"] = Value;
    }

    if (Type == "TotalActual") {
      this.flagArray[this.activePage][Index]["ShowTotalActualCost"] = Value;
    }
  }

  //===== INDIVIDUAL TARGET DETAILS =====//
  TargetDetails(row_Id: any, Profile_Name: any, Is_Sales: any, DOJ: any): void {
    const dialogRef = this.dialog.open(TargetDetailsComponent, {
      width: "99%",
      height: "90%",
      maxWidth: "99vw",
      disableClose: false,
      data: {
        Id: row_Id,
        Profile_Name: Profile_Name,
        VerticalId: this.FilterVerticalId,
        Is_Sales: Is_Sales,
        UrlSegment: "EmployeeTarget",
        Sequence: this.Sequence,
        DOJ: DOJ,
        financial_year: this.fy_selected,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Is_Refresh == "Yes") {
        this.flagArray = [];
        this.GetData();
        //this.Reload();
      }
    });
  }

  //===== UPDATE SALARY REMARKS =====//
  SalaryRemarks(row_Id: any, index: any): void {
    const dialogRef = this.dialog.open(SalaryRemarksComponent, {
      width: "25%",
      height: "45%",
      disableClose: true,
      data: {
        EmployeeId: row_Id,
        MonthName: this.SelectedMonth,
        Sequence: this.Sequence,
        financial_year: this.fy_selected,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Is_Refresh == "Yes") {
        this.GetUpdatedSalaryRemarks(index, row_Id, this.SelectedMonth);
      }
    });
  }

  //===== UPDATE SALARY REMARKS =====//
  EditLwpCount(row_Id: any, index: any): void {
    const dialogRef = this.dialog.open(EditLwpComponent, {
      width: "25%",
      height: "45%",
      disableClose: true,
      data: {
        EmployeeId: row_Id,
        MonthName: this.SelectedMonth,
        Sequence: this.Sequence,
        financial_year: this.fy_selected,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Is_Refresh == "Yes") {
        this.GetUpdatedSalaryRemarks(index, row_Id, this.SelectedMonth);
      }
    });
  }

  //===== GET YTD DATA IN CHUNKS =====//
  async GetUpdatedSalaryRemarks(index: any, Employee_Id: any, MonthName: any) {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", Employee_Id);
    formData.append("MonthName", MonthName);
    formData.append("financial_year", this.fy_selected);
    formData.append("Portal", "CRM");

    var url =
      environment.apiUrlBmsBase +
      "/goal-management-system/CrudFunctions/GetUpdatedSalaryRemarks";

    await this.http
      .post<any>(
        this.api.additionParmsEnc(url),
        this.api.enc_FormData(formData),
        this.api.getHeader(environment.apiUrlBmsBase)
      )
      .toPromise()
      .then((res: any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        ////   //   console.log(data.Agent_Id);
        this.dataAr[index]["SalaryRemarks"] = data.SalaryRemarks;
        this.dataAr[index]["TotalSalary"] = data.TotalSalary;
        this.dataAr[index]["DaysCount"] = data.DaysCount;
        this.dataAr[index]["LastSalarySequence"] = data.LastSalarySequence;
        this.dataAr[index]["Remarks"] = data.Remarks;
        this.dataAr[index]["SalaryUpdatedBy"] = data.SalaryUpdatedBy;
      });
  }

  //===== SALARY REMARKS TRACK DETAILS =====//
  SalaryRemarksTrack(row_Id: any, month_name: any): void {
    const dialogRef = this.dialog.open(SalaryRemarksTrackComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: {
        EmployeeId: row_Id,
        MonthName: month_name,
        financial_year: this.fy_selected,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== EXPORT REPORTS =====//
  ExportReport(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    dialogConfig.hasBackdrop = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "PmsReports",
    };

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }

  //===== EXPORT P&L REPORTS =====//
  ExportReportPL(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    dialogConfig.hasBackdrop = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "PmsPLReports",
    };

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }

  //===== INDIVIDUAL TARGET DETAILS =====//
  ViewGivenTargetModal(target_type: any): void {
    var Vertical = "";
    if (this.FilterVerticalId == "") {
      Vertical = "";
    } else {
      Vertical = this.FilterVerticalId[0]["Id"];
    }

    const dialogRef = this.dialog.open(ViewGivenTargetComponent, {
      width: "75%",
      height: "80%",
      disableClose: true,
      data: {
        target_type: target_type,
        financial_year: this.fy_selected,
        vertical_id: Vertical,
        selected_month: this.month_selected,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result.Is_Refresh);
      this.ResetDT();
    });
  }
}
