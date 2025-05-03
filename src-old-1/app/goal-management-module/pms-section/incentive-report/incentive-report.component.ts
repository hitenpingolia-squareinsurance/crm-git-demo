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
import { TargetAchievementDetailsComponent } from "../modal/target-achievement-details/target-achievement-details.component";

class ColumnsObj {
  Id: string;
  Name: string;
  Emp_Code: string;
  Mobile: string;
  Profile_Type: string;
  DOJ: string;
  ResignDate: string;
  Department_Id: string;
  Status: string;
  ResignStatus: string;
  RM_Name: string;
  MonthNamCon: string;
  MonthConSr: string;
  MonthConDsr: string;
  Is_Sales: string;
  NewProfile: string;
  ServiceLocation: string;
  Coreline: string;
  IsEdit: string;
  IsEditFinal: string;
  LastSalarySequence: string;

  SelfActualCost: string;
  SelfTotalCost: string;
  ShowTeamData: string;
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
  selector: "app-incentive-report",
  templateUrl: "./incentive-report.component.html",
  styleUrls: ["./incentive-report.component.css"],
})
export class IncentiveReportComponent implements OnInit {
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

  Year_Ar: Array<any>;
  SelectedYear: any = [];

  President_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  ReportTypeData: Array<any>;
  IncentiveStatusAr: Array<any>;
  ItemEmployeeSelection: any = [];
  LobData: any = [];
  MonthArray: any = [];
  SelectedMonth: any = "";

  CurrentMonth: any = "";
  Name: any = "";
  SelectedCurrentMonth: any = [];
  SelectedMonthNo: any = "";

  Employee_Placeholder: any = "Select Employee";
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

  FilterEmpId: any;
  FilterReportType: any;
  SelectedReportType: { Id: string; Name: string }[];
  FilterVerticalId: any = "";
  fy_selected: any = "";

  ProfileName: any;
  IsSales: any;
  IdType: string;
  EmpId: any;
  LoginProfileName: any;
  PType: any;
  index: any;

  PTypeD: any;

  current_fy: any;
  month_selected: any = "";
  FunctionName: any = "/goal-management-system/pms/IncentiveReport/GetGridData";

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
      Incentive_Status: [""],
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

    this.GetData();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/goal-management-system/pms/PmsFilterFunctions/SearchComponentsData",
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
            this.IncentiveStatusAr = result["Data"]["IncentiveStatusAr"];
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

    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
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
        "/goal-management-system/pms/PmsFilterFunctions/GetVerticalData",
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
    formData.append(
      "Employee_Type",
      JSON.stringify(this.SearchForm.value["Employee_Type"])
    );

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/pms/PmsFilterFunctions/GetEmployees",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Emps_Ar = result["Data"];
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    var fields = this.SearchForm.value;

    //Search Financial Year
    if (this.SearchForm.get("Financial_Year").value.length > 0) {
      this.fy_selected = fields["Financial_Year"][0]["Id"];
    } else {
      this.fy_selected = "";
    }

    //Month Name
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

    var query = {
      urlSegment: this.urlSegment,
      Financial_Year: fields["Financial_Year"],
      President_Id: fields["President_Id"],
      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Emp_Id: fields["Emp_Id"],
      Report_Type: fields["Report_Type"],
      Month_Name: fields["Month_Name"],
      Incentive_Status: fields["Incentive_Status"],
      SearchValue: fields["SearchValue"],
    };

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.FilterReportType = "";
    this.FilterEmpId = "";
    this.FilterVerticalId = "";
    this.EmpId = this.api.GetUserData("Code");
    this.IdType = "Code";
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];

    this.SearchForm.get("President_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("SearchValue").setValue("");
    this.Employee_Placeholder = "Select Employee";

    this.Emps_Ar = [];
    this.dataAr = [];

    this.SearchComponentsData();
    this.ResetDT();
    this.GetData();
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
      dtInstance.draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  GetData() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                this.FunctionName +
                "?User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var result = JSON.parse(this.api.decryptText(res.response));

            this.SQL_Where_STR = result["SQL_Where"];
            if (result["Status"] == true) {
              this.dataAr = result["data"];
              this.GetYTDChanks();
              this.GetEmployeeExtraData("1");
            } else {
              this.dataAr = [];
              this.Sub_Branch_Ar = [];
              this.GetEmployees();
            }

            callback({
              recordsTotal: result.recordsTotal,
              recordsFiltered: result.recordsFiltered,
              data: [],
            });
          });
      },
    };
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
      var Coreline = this.dataAr[i]["Coreline"];

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
      formData.append("Coreline", Coreline);
      formData.append("financial_year", this.fy_selected);

      if (this.fy_selected > "2023") {
        var url =
          environment.apiUrlBmsBase +
          "/goal-management-system/pms/BusinessTargets/GetExtraData";
      } else {
        var url =
          environment.apiUrlBmsBase +
          "/goal-management-system/AllocatedBusinessTargets/GetExtraData";
      }

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          if (this.fy_selected > "2023") {
            //== Profile Target Related ==//
            this.dataAr[i]["TotalTarget"] = data.TotalTarget;
            this.dataAr[i]["TotalTargetStr"] = data.TotalTargetStr;
            this.dataAr[i]["TeamTarget"] = data.TeamTarget;
            this.dataAr[i]["TeamTargetStr"] = data.TeamTargetStr;
            this.dataAr[i]["SelfTarget"] = data.SelfTarget;
            this.dataAr[i]["SelfTargetStr"] = data.SelfTargetStr;

            this.dataAr[i]["TotalActualBusiness"] = data.TotalActualBusiness;
            this.dataAr[i]["TotalActualBusinessStr"] =
              data.TotalActualBusinessStr;
            this.dataAr[i]["SelfActualBusiness"] = data.SelfActualBusiness;
            this.dataAr[i]["SelfActualBusinessStr"] =
              data.SelfActualBusinessStr;
            this.dataAr[i]["TeamActualBusiness"] = data.TeamActualBusiness;
            this.dataAr[i]["TeamActualBusinessStr"] =
              data.TeamActualBusinessStr;

            this.dataAr[i]["TotalActualAchPercent"] =
              data.TotalActualAchPercent;
            this.dataAr[i]["SelfActualAchPercent"] = data.SelfActualAchPercent;
            this.dataAr[i]["TeamActualAchPercent"] = data.TeamActualAchPercent;

            this.dataAr[i]["TotalWeightageBusiness"] =
              data.TotalWeightageBusiness;
            this.dataAr[i]["TotalWeightageBusinessStr"] =
              data.TotalWeightageBusinessStr;
            this.dataAr[i]["TeamWeightageBusiness"] =
              data.TeamWeightageBusiness;
            this.dataAr[i]["TeamWeightageBusinessStr"] =
              data.TeamWeightageBusinessStr;
            this.dataAr[i]["SelfWeightageBusiness"] =
              data.SelfWeightageBusiness;
            this.dataAr[i]["SelfWeightageBusinessStr"] =
              data.SelfWeightageBusinessStr;

            this.dataAr[i]["TotalWeightageAchPercent"] =
              data.TotalWeightageAchPercent;
            this.dataAr[i]["TeamWeightageAchPercent"] =
              data.TeamWeightageAchPercent;
            this.dataAr[i]["SelfWeightageAchPercent"] =
              data.SelfWeightageAchPercent;

            this.dataAr[i]["TeamRevenue"] = data.TeamRevenue;
            this.dataAr[i]["SelfRevenue"] = data.SelfRevenue;
            this.dataAr[i]["TotalRevenue"] = data.TotalRevenue;

            this.dataAr[i]["TeamRevenueStr"] = data.TeamRevenueStr;
            this.dataAr[i]["SelfRevenueStr"] = data.SelfRevenueStr;
            this.dataAr[i]["TotalRevenueStr"] = data.TotalRevenueStr;

            this.dataAr[i]["TotalActiveDays"] = data.TotalActiveDays;
            this.dataAr[i]["TotalBusinessVirtual"] = data.TotalBusinessVirtual;
            this.dataAr[i]["TotalBusinessVisit"] = data.TotalBusinessVisit;
            this.dataAr[i]["LmsCallCount"] = data.LmsCallCount;
            this.dataAr[i]["TeleRmCallCount"] = data.TeleRmCallCount;
            this.dataAr[i]["RenewalCallCount"] = data.RenewalCallCount;
          } else {
            //== Profile Target Related ==//
            this.dataAr[i]["ProfileTotalTarget"] = data.ProfileTotalTarget;
            this.dataAr[i]["ProfileTotalTargetStr"] =
              data.ProfileTotalTargetStr;
            this.dataAr[i]["ProfileTotalBusiness"] = data.ProfileTotalBusiness;
            this.dataAr[i]["ProfileTotalBusinessStr"] =
              data.ProfileTotalBusinessStr;
            this.dataAr[i]["ProfileAchievement"] = data.ProfileAchievement;

            this.dataAr[i]["AllocatedTeamTarget"] = data.AllocatedTeamTarget;
            this.dataAr[i]["AllocatedTeamTargetStr"] =
              data.AllocatedTeamTargetStr;
            this.dataAr[i]["AllocatedTeamBusiness"] =
              data.AllocatedTeamBusiness;
            this.dataAr[i]["AllocatedTeamBusinessStr"] =
              data.AllocatedTeamBusinessStr;
            this.dataAr[i]["AllocatedTeamAchievement"] =
              data.AllocatedTeamAchievement;

            this.dataAr[i]["AllocatedSelfTarget"] = data.AllocatedSelfTarget;
            this.dataAr[i]["AllocatedSelfTargetStr"] =
              data.AllocatedSelfTargetStr;
            this.dataAr[i]["AllocatedSelfBusiness"] =
              data.AllocatedSelfBusiness;
            this.dataAr[i]["AllocatedSelfBusinessStr"] =
              data.AllocatedSelfBusinessStr;
            this.dataAr[i]["AllocatedSelfAchievement"] =
              data.AllocatedSelfAchievement;

            this.dataAr[i]["TeamRevenue"] = data.TeamRevenue;
            this.dataAr[i]["SelfRevenue"] = data.SelfRevenue;
            this.dataAr[i]["TotalRevenue"] = data.TotalRevenue;

            this.dataAr[i]["TeamRevenueStr"] = data.TeamRevenueStr;
            this.dataAr[i]["SelfRevenueStr"] = data.SelfRevenueStr;
            this.dataAr[i]["TotalRevenueStr"] = data.TotalRevenueStr;

            this.dataAr[i]["TotalActiveDays"] = data.TotalActiveDays;
            this.dataAr[i]["TotalBusinessVirtual"] = data.TotalBusinessVirtual;
            this.dataAr[i]["TotalBusinessVisit"] = data.TotalBusinessVisit;
            this.dataAr[i]["LmsCallCount"] = data.LmsCallCount;
            this.dataAr[i]["TeleRmCallCount"] = data.TeleRmCallCount;
            this.dataAr[i]["RenewalCallCount"] = data.RenewalCallCount;
          }
        });
    }
  }

  //===== GET EMPLOYEES EXTRA DATA =====//
  GetEmployeeExtraData(type: any) {
    if (type == 0) {
      this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];
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

  //===== INDIVIDUAL TARGET ACHIEVEMENT DETAILS =====//
  TargetAchievementDetails(i: any): void {
    var Vertical_Data: any;
    if (this.FilterVerticalId == "") {
      Vertical_Data = "";
    } else {
      Vertical_Data = JSON.stringify(this.FilterVerticalId);
    }

    var Employee_Id = this.dataAr[i]["Id"];
    var MonthNamCon = this.dataAr[i]["MonthNamCon"];
    var MonthConSr = this.dataAr[i]["MonthConSr"];
    var MonthConDsr = this.dataAr[i]["MonthConDsr"];
    var IsSales = this.dataAr[i]["Is_Sales"];
    var Department_Id = this.dataAr[i]["Department_Id"];
    var Profile_Type = this.dataAr[i]["Profile_Type"];
    var Coreline = this.dataAr[i]["Coreline"];

    var IsEdit = "No";
    var IsEditFinal = "No";
    var LastSalarySequence = "";

    var SelfTotalCost = this.dataAr[i]["SelfTotalCost"];
    var SelfActualCost = this.dataAr[i]["SelfActualCost"];
    var ShowTeamData = this.dataAr[i]["ShowTeamData"];

    var ShowSelfData = "No";
    var Emp_Code = this.dataAr[i]["Emp_Code"];
    if (Emp_Code == this.api.GetUserData("Code")) {
      ShowSelfData = "Yes";
    }

    const dialogRef = this.dialog.open(TargetAchievementDetailsComponent, {
      width: "60%",
      height: "90%",
      disableClose: false,
      data: {
        Employee_Id: Employee_Id,
        Vertical_Data: Vertical_Data,
        Department_Id: Department_Id,
        MonthNamCon: MonthNamCon,
        MonthConSr: MonthConSr,
        MonthConDsr: MonthConDsr,
        IsSales: IsSales,
        financial_year: this.fy_selected,
        LoginProfileName: this.LoginProfileName,
        Profile_Type: Profile_Type,
        Coreline: Coreline,
        SelfTotalCost: SelfTotalCost,
        SelfActualCost: SelfActualCost,
        ShowSelfData: ShowSelfData,
        ShowTeamData: ShowTeamData,
        IsEdit: IsEdit,
        IsEditFinal: IsEditFinal,
        LastSalarySequence: LastSalarySequence,
        Sequence: 0,
        Broker_Id: "",
        Modal_Type: "Incentive",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
