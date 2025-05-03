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
import { TargetAchievementDetailsOldComponent } from "../modal/target-achievement-details-old/target-achievement-details-old.component";
import { ViewGivenTargetComponent } from "../../../modals/goal-management/view-given-target/view-given-target.component";
import { PmsTargetBusinessDetailsComponent } from "../modal/pms-target-business-details/pms-target-business-details.component";
import { DownloadingViewComponent } from "../../../modals/downloading-view/downloading-view.component";
import { TargetDetailsComponent } from "../../../modals/goal-management/target-details/target-details.component";

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
  SystemAge: string;
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
  selector: "app-pms-targets-report",
  templateUrl: "./pms-targets-report.component.html",
  styleUrls: ["./pms-targets-report.component.css"],
})
export class PmsTargetsReportComponent implements OnInit {
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
  Agents_Ar: Array<any>;
  ReportTypeData: Array<any>;
  SalaryRemarkTypeAr: Array<any>;
  EmployeeTypeAr: Array<any>;
  BrokersAr: Array<any>;
  SalaryRemarkStatusAr: Array<any>;
  SalaryPaidStatusAr: Array<any>;
  ItemEmployeeSelection: any = [];
  LobData: any = [];
  MonthArray: any = [];
  SelectedMonth: any = "";
  Broker_Id: any = "";
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

  AllocatedTarget: any = 0;
  AllocatedAcivement: any = 0;
  MonthlyAllocatedAcivement: any = 0;

  MonthlyAllocatedTarget: any = 0;
  MonthlyAllocatedTargetStr: any = "";
  CurrentMonthAllocatedTarget: any = 0;
  CurrentMonthAllocatedTargetStr: any = "";

  PoolTarget: any = 0;
  AchivementData: any = 0;
  MonthlyAchivementData: any = 0;

  FilterEmpId: any;
  FilterReportType: any;
  SelectedReportType: { Id: string; Name: string }[];
  FilterVerticalId: any = "";
  fy_selected: any = "";

  NewGivenTarget: any = "";
  AllocatedTargetStr: any = "";
  NewPoolTarget: any = "";
  NewAchivementData: any = "";
  MonthlyNewAchivementData: any = "";

  CurrentMonthAchivementData: any = 0;
  CurrentMonthNewAchivementData: any = "";

  TotalMappedFixProfileTarget: any = 0;
  NewTotalMappedFixProfileTarget: any = "";

  NewProfileTarget: any = "";
  NewAllocatedTarget: any = "";

  ProfileTarget: any = 0;
  ProfileAchivement: any = 0;
  MonthlyProfileAchivement: any = 0;

  ProfileName: any;
  IsSales: any;
  IdType: string;
  EmpId: any;
  LoginProfileName: any;
  PType: any;
  LoginIsSales: any;
  TotalRevenue: any = 0;
  TotalRevenueString: any = "";

  TotalFixedCost: any = 0;
  TotalFixedCostString: any = "";

  TotalVariablePay: any = 0;
  TotalVariablePayString: any = "";

  TotalCost: any = 0;
  TotalCostString: any = "";
  ActualCost: any = 0;
  ActualCostString: any = "";
  Sequence: any = 0;
  index: any;

  PTypeD: any;
  MonthSrCondition: any;
  PmsJoin: any;
  ShowAllocatedTargetTab: any = "";
  ShowHideAllocatedTargetTab: any = "No";
  TotalAllocatedTarget: any = 0;
  TotalAllocatedTargetString: any = "";

  CompleteMonthlyTarget: any = 0;
  CompleteMonthlyTargetString: any = "";

  CompleteMonthlyProfileTarget: any = 0;
  CompleteMonthlyProfileTargetString: any = "";
  CompleteMonthlyAllocatedTarget: any = 0;
  CompleteMonthlyAllocatedTargetString: any = "";

  current_fy: any;
  month_selected: any = "";
  FunctionName: any =
    "/goal-management-system/pms/TargetsReport/GetSingleMonthGridData";
  Is_Multi_Month: any = "No";
  Select_Multi_Month: any = "No";
  ShowDashboardLoader: string = "No";
  Dashboard_Data_Status: string = "No";
  TotalProfileTargetString: string = "";
  TotalProfileTarget: 0;
  NewProfileName: any;

  // PMS Target achievement POPUP USE COST
  currentPage = 1;
  recordsPerPage = 10;
  totalRecords = 0;
  totalPages = 0;

  loadTotalRevenueCost: boolean = false;

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
      Employee_Type: [""],
      Emp_Id: [""],
      Report_Type: [""],
      Month_Name: [""],
      Salary_Remark_Type: [""],
      Salary_Remark_Status: [""],
      Salary_Paid_Status: [""],
      Broker_Id: [""],
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
            //   //   //   console.log(" this.SelectedCurrentMonth", this.SelectedCurrentMonth);
            this.EmployeeTypeAr = result["Data"]["EmployeeTypeAr"];
            this.SalaryRemarkTypeAr = result["Data"]["SalaryRemarkTypeAr"];
            this.BrokersAr = result["Data"]["BrokersAr"];
            this.SalaryRemarkStatusAr = result["Data"]["SalaryRemarkStatusAr"];
            this.SalaryPaidStatusAr = result["Data"]["SalaryPaidStatusAr"];
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
    this.Dashboard_Data_Status = "Load";

    var fields = this.SearchForm.value;

    //Search Financial Year
    if (this.SearchForm.get("Financial_Year").value.length > 0) {
      this.fy_selected = fields["Financial_Year"][0]["Id"];
    } else {
      this.fy_selected = "";
    }

    //Month Name
    this.Is_Multi_Month = "No";
    this.FunctionName =
      "/goal-management-system/pms/TargetsReport/GetSingleMonthGridData";
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
        this.FunctionName =
          "/goal-management-system/pms/TargetsReport/GetMultiMonthGridData";
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

    //Report Type
    var fields = this.SearchForm.value;
    const broker_ar = [];
    for (const pair of fields["Broker_Id"]) {
      broker_ar.push(pair.Id);
    }

    this.Broker_Id = broker_ar;

    var query = {
      urlSegment: this.urlSegment,
      Financial_Year: fields["Financial_Year"],
      President_Id: fields["President_Id"],
      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Employee_Type: fields["Employee_Type"],
      Emp_Id: fields["Emp_Id"],
      Report_Type: fields["Report_Type"],
      Month_Name: fields["Month_Name"],
      Salary_Remark_Type: fields["Salary_Remark_Type"],
      Salary_Remark_Status: fields["Salary_Remark_Status"],
      Salary_Paid_Status: fields["Salary_Paid_Status"],
      Broker_Id: fields["Broker_Id"],
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
    this.Dashboard_Data_Status = "No";
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
    this.SearchForm.get("Employee_Type").setValue("");
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("SearchValue").setValue("");
    this.SearchForm.get("Salary_Remark_Type").setValue("");
    this.SearchForm.get("Salary_Remark_Status").setValue("");
    this.SearchForm.get("Salary_Paid_Status").setValue("");
    this.SearchForm.get("Broker_Id").setValue("");

    this.Employee_Placeholder = "Select Employee";

    this.Emps_Ar = [];
    //this.ResetDT();

    this.GivenTarget = 0;
    this.NewGivenTarget = "";
    this.GivenAchivement = 0;
    this.MonthlyGivenAchivement = 0;

    this.AllocatedTarget = 0;
    this.AllocatedTargetStr = "";
    this.MonthlyAllocatedTarget = 0;
    this.MonthlyAllocatedTargetStr = "";
    this.CurrentMonthAllocatedTarget = 0;
    this.CurrentMonthAllocatedTargetStr = "";

    this.AllocatedAcivement = 0;
    this.MonthlyAllocatedAcivement = 0;
    this.AchivementData = 0;
    this.NewAchivementData = "";
    this.MonthlyAchivementData = 0;
    this.MonthlyNewAchivementData = "";
    this.CurrentMonthAchivementData = 0;
    this.CurrentMonthNewAchivementData = "";

    this.TotalMappedFixProfileTarget = 0;
    this.NewTotalMappedFixProfileTarget = "";

    this.PoolTarget = 0;
    this.NewPoolTarget = "";

    this.SearchComponentsData();

    this.dataAr = [];
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
  GetData(): Promise<void> {
    this.totalPages = 0;
    return new Promise((resolve) => {
      const that = this;
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          const pageIndex =
            dataTablesParameters.start / dataTablesParameters.length + 1;
          that.currentPage = pageIndex;
          that.recordsPerPage = dataTablesParameters.length;
          that.http
            .post<DataTablesResponse>(
              this.api.additionParmsEnc(
                environment.apiUrlBmsBase +
                  this.FunctionName +
                  "?User_Code=" +
                  this.api.GetUserData("Code") +
                  "&Portal=CRM"
              ),
              {
                ...dataTablesParameters,
                start: (pageIndex - 1) * this.recordsPerPage,
              },
              this.api.getHeader(environment.apiUrlBmsBase)
            )
            .subscribe((res: any) => {
              var result = JSON.parse(this.api.decryptText(res.response));
              this.SQL_Where_STR = result["SQL_Where"];
              if (result["Status"] === true) {
                this.dataAr = result["data"];
                this.totalPages = Math.ceil(
                  result.recordsTotal / this.dtOptions.pageLength
                );

                this.MonthSrCondition = result["MonthConSr"];
                this.PmsJoin = result["PmsJoin"];
                this.ShowAllocatedTargetTab = result["ShowAllocatedTargetTab"];

                this.ShowHideAllocatedTargetTab = "No";
                if (
                  this.ShowAllocatedTargetTab === "Yes" &&
                  (this.LoginProfileName === "MD" ||
                    this.LoginProfileName === "CEO" ||
                    this.LoginProfileName === "President")
                ) {
                  this.ShowAllocatedTargetData();
                  this.ShowHideAllocatedTargetTab = "Yes";
                }
                if (this.Is_Multi_Month === "Yes") {
                  this.GetYTDChanks();
                  this.GetTeamCostChunks();
                }

                this.GetTotalRevenueCost();
                //this.GetHeaderMonthlyTarget();
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

              resolve(); // Resolve after the data is processed
            });
        },
      };
    });
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
      formData.append("Broker_Id", this.Broker_Id);
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

  //===== GET TEAM TOTAL COST IN CHUNKS =====//
  async GetTeamCostChunks() {
    var Vertical_Data;
    if (this.FilterVerticalId == "") {
      Vertical_Data = "";
    } else {
      Vertical_Data = JSON.stringify(this.FilterVerticalId);
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var ShowSelfData = "No";
      var Emp_Code = this.dataAr[i]["Emp_Code"];
      if (Emp_Code == this.api.GetUserData("Code")) {
        ShowSelfData = "Yes";
      }

      this.dataAr[i]["ShowSelfData"] = ShowSelfData;

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

          this.dataAr[i]["TotalTotalCost"] = data.TotalTotalCost;
          this.dataAr[i]["TotalTotalCostStr"] = data.TotalTotalCostStr;
          this.dataAr[i]["TeamTotalCost"] = data.TeamTotalCost;
          this.dataAr[i]["TeamTotalCostStr"] = data.TeamTotalCostStr;
          this.dataAr[i]["SelfTotalCostStr"] = data.SelfTotalCostStr;

          this.dataAr[i]["ActualTotalCost"] = data.ActualTotalCost;
          this.dataAr[i]["ActualTotalCostStr"] = data.ActualTotalCostStr;
          this.dataAr[i]["TeamActualCost"] = data.TeamActualCost;
          this.dataAr[i]["TeamActualCostStr"] = data.TeamActualCostStr;
          this.dataAr[i]["SelfActualCostStr"] = data.SelfActualCostStr;

          this.dataAr[i]["AllTotalCost"] = data.TotalTotalCost;
          this.dataAr[i]["TotalTotalCostStr"] = data.TotalTotalCostStr;
          this.dataAr[i]["AllActualCost"] = data.ActualTotalCost;
          this.dataAr[i]["ActualTotalCostStr"] = data.ActualTotalCostStr;
        });
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

    this.loadTotalRevenueCost = true;
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

            this.TotalFixedCost = result["FixedCost"];
            this.TotalFixedCostString = result["FixedCostString"];

            this.TotalVariablePay = result["VariablePay"];
            this.TotalVariablePayString = result["VariablePayString"];

            this.TotalCost = result["TotalCost"];
            this.TotalCostString = result["TotalCostString"];
            this.ActualCost = result["ActualCost"];
            this.ActualCostString = result["ActualCostString"];
            this.loadTotalRevenueCost = false;
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.loadTotalRevenueCost = false;
          }
        },
        (err) => {
          this.loadTotalRevenueCost = false;
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== GET EMPLOYEES DATA =====//
  GetHeaderData() {
    if (this.Dashboard_Data_Status == "No") {
      return;
    }

    this.Dashboard_Data_Status = "No";
    this.ShowDashboardLoader = "Yes";

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

    this.GivenTarget =
      this.PoolTarget =
      this.AllocatedTarget =
      this.MonthlyAllocatedTarget =
      this.CurrentMonthAllocatedTarget =
      this.AchivementData =
      this.MonthlyAchivementData =
      this.CurrentMonthAchivementData =
      this.TotalMappedFixProfileTarget =
        0;

    this.NewGivenTarget =
      this.NewPoolTarget =
      this.AllocatedTargetStr =
      this.MonthlyAllocatedTargetStr =
      this.CurrentMonthAllocatedTargetStr =
      this.NewAchivementData =
      this.MonthlyNewAchivementData =
      this.CurrentMonthNewAchivementData =
      this.NewTotalMappedFixProfileTarget =
        "";

    if (this.fy_selected > "2023") {
      var url = "goal-management-system/pms/BusinessTargets/GetHeaderData";
    } else {
      var url = "goal-management-system/AllocatedBusinessTargets/GetHeaderData";
    }

    this.api.HttpPostTypeBms(url, formData).then(
      (result) => {
        if (result["Status"] == true) {
          if (this.fy_selected > "2023") {
            this.GivenTarget = result["GivenTarget"];
            this.NewGivenTarget = result["NewGivenTarget"];
            this.GivenAchivement = result["GivenAchivement"];
            this.MonthlyGivenAchivement = result["MonthlyGivenAchivement"];

            //ALLOCATED PROFILE TARGET DATA
            this.AllocatedTarget = result["AllocatedTarget"];
            this.AllocatedTargetStr = result["AllocatedTargetStr"];
            this.AllocatedAcivement = result["AllocatedAcivement"];
            this.MonthlyAllocatedAcivement =
              result["MonthlyAllocatedAcivement"];

            this.MonthlyAllocatedTarget = result["MonthlyAllocatedTarget"];
            this.MonthlyAllocatedTargetStr =
              result["MonthlyAllocatedTargetStr"];

            this.CurrentMonthAllocatedTarget =
              result["CurrentMonthAllocatedTarget"];
            this.CurrentMonthAllocatedTargetStr =
              result["CurrentMonthAllocatedTargetStr"];

            //ACTUAL ACHIEVEMENT DATA
            this.AchivementData = result["AchivementData"];
            this.NewAchivementData = result["NewAchivementData"];
            this.MonthlyAchivementData = result["MonthlyAchivementData"];
            this.MonthlyNewAchivementData = result["MonthlyNewAchivementData"];

            this.CurrentMonthAchivementData =
              result["CurrentMonthAchivementData"];
            this.CurrentMonthNewAchivementData =
              result["CurrentMonthNewAchivementData"];

            //PROFILE MAPPING TARGETS FIXED DATA
            this.TotalMappedFixProfileTarget =
              result["TotalMappedFixProfileTarget"];
            this.NewTotalMappedFixProfileTarget =
              result["NewTotalMappedFixProfileTarget"];

            this.PoolTarget = result["PoolTarget"];
            this.NewPoolTarget = result["NewPoolTarget"];
          } else {
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

            this.CurrentMonthAchivementData =
              result["CurrentMonthAchivementData"];
            this.CurrentMonthNewAchivementData =
              result["CurrentMonthNewAchivementData"];

            this.PoolTarget = result["PoolTarget"];
            this.NewPoolTarget = result["NewPoolTarget"];
          }
        } else {
          this.api.Toast("Warning", result["Message"]);
          this.SearchForm.get("Emp_Id").setValue("");
          this.Emps_Ar = [];
        }

        this.ShowDashboardLoader = "No";
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

    if (this.fy_selected > "2023") {
      var url =
        "goal-management-system/pms/BusinessTargets/GetHeaderMonthlyTarget";
    } else {
      var url =
        "goal-management-system/AllocatedBusinessTargets/GetHeaderMonthlyTarget";
    }

    this.api.HttpPostTypeBms(url, formData).then(
      (result) => {
        if (result["Status"] == true) {
          if (this.fy_selected > "2023") {
            this.CompleteMonthlyTarget = result["MonthlyTarget"];
            this.CompleteMonthlyTargetString = result["MonthlyTargetString"];
          } else {
            this.CompleteMonthlyProfileTarget = result["MonthlyProfileTarget"];
            this.CompleteMonthlyProfileTargetString =
              result["MonthlyProfileTargetString"];
            this.CompleteMonthlyAllocatedTarget =
              result["MonthlyAllocatedTarget"];
            this.CompleteMonthlyAllocatedTargetString =
              result["MonthlyAllocatedTargetString"];
          }
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
      //this.SelectedCurrentMonth = [{ 'Id': this.CurrentMonth, 'Name': this.Name }];
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
            this.NewProfileName = result["NewProfile"];
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

  //===== INDIVIDUAL TARGET DETAILS =====//
  TargetDetails(
    row_Id: any,
    Profile_Name: any,
    Is_Sales: any,
    DOJ: any,
    Coreline: any
  ): void {
    if (this.fy_selected > "2023") {
      const dialogRef = this.dialog.open(PmsTargetBusinessDetailsComponent, {
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
          Coreline: Coreline,
          financial_year: this.fy_selected,
          Broker_Id: this.Broker_Id,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.Is_Refresh == "Yes") {
          this.GetData();
        }
      });
    } else {
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
          Coreline: Coreline,
          financial_year: this.fy_selected,
          Broker_Id: this.Broker_Id,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.Is_Refresh == "Yes") {
          this.GetData();
        }
      });
    }
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
    var SystemAge = this.dataAr[i]["SystemAge"];
    var ResignDate = this.dataAr[i]["ResignDate"];
    var ResignStatus = this.dataAr[i]["ResignStatus"];

    var EmployeeName = this.dataAr[i]["Name"];
    var ReportingManager = this.dataAr[i]["RM_Name"];
    var ServiceLocation = this.dataAr[i]["ServiceLocation"];
    var EmployeeProfile = this.dataAr[i]["NewProfile"];

    var IsEdit = this.dataAr[i]["IsEdit"];
    var IsEditFinal = this.dataAr[i]["IsEditFinal"];
    var LastSalarySequence = this.dataAr[i]["LastSalarySequence"];

    var SelfTotalCost = this.dataAr[i]["SelfTotalCost"];
    var SelfActualCost = this.dataAr[i]["SelfActualCost"];
    var ShowTeamData = this.dataAr[i]["ShowTeamData"];

    var ShowSelfData = "No";
    var Emp_Code = this.dataAr[i]["Emp_Code"];
    if (Emp_Code == this.api.GetUserData("Code")) {
      ShowSelfData = "Yes";
    }

    if (this.fy_selected > "2023") {
      ////==== POPUP PREVIOUS NEXT NAVIGATION ===////
      let selectedIndex = i || 0;
      let totalRecords = this.dataAr.length;
      let totalPages = this.totalPages;
      let currentPage = Math.max(this.currentPage, 1);

      let NextButtonShow = false;
      let PreviewButtonShow = currentPage > 1 || selectedIndex > 0;
      if (currentPage == totalPages) {
        NextButtonShow = selectedIndex < totalRecords - 1;
      } else {
        NextButtonShow =
          currentPage < totalPages || selectedIndex < totalRecords - 1;
      }
      PreviewButtonShow =
        PreviewButtonShow && (currentPage > 1 || selectedIndex > 0);

      const dialogRef = this.dialog.open(TargetAchievementDetailsComponent, {
        width: "75%",
        height: "90%",
        disableClose: false,
        panelClass: "achievementPMSCSS",
        data: {
          currentIndex: selectedIndex,
          PmsTargetDataAr: this.dataAr,
          TargetAchievementNextAndPreview:
            this.TargetAchievementNextAndPreview.bind(this),
          NextButtonShow: NextButtonShow,
          PreviewButtonShow: PreviewButtonShow,
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
          Sequence: this.Sequence,
          Broker_Id: this.Broker_Id,
          Modal_Type: "Salary",
          NewProfileName: this.NewProfileName,
          EmployeeName: EmployeeName,
          ReportingManager: ReportingManager,
          ServiceLocation: ServiceLocation,
          EmployeeProfile: EmployeeProfile,
          SystemAge: SystemAge,
          ResignDate: ResignDate,
          ResignStatus: ResignStatus,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        //   //   //   console.log('Popup closed.');
      });
    } else {
      const dialogRef = this.dialog.open(TargetAchievementDetailsOldComponent, {
        width: "70%",
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
          Sequence: this.Sequence,
          Broker_Id: this.Broker_Id,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  //===== PMS TARGET ACHIEVEMENT MODEL NAVIGATION BUTTON PAGINATION =====//
  setCurrentPage(pageNumber: number): Promise<void> {
    this.currentPage = pageNumber;
    return new Promise((resolve) => {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        const pageIndex = this.currentPage - 1;
        const recordsPerPage = this.recordsPerPage;
        dtInstance.page(pageIndex).draw(false);
        dtInstance.one("draw", () => {
          dtInstance.page.len(recordsPerPage).draw(false);
          resolve();
        });
      });
    });
  }

  //===== PMS TARGET ACHIEVEMENT MODEL NAVIGATION BUTTON =====//
  TargetAchievementNextAndPreview(i: any, navigate: string): void {
    if (this.dataAr.length === 0) return;
    this.api.IsLoading();
    if (
      (navigate === "next" && this.dataAr.length === i) ||
      (navigate === "preview" && i < 0)
    ) {
      this.currentPage =
        navigate === "next"
          ? this.currentPage + 1
          : Math.max(this.currentPage - 1, 0);
      this.setCurrentPage(this.currentPage).then(() => {
        if (this.dataAr.length > 0) {
          const index = navigate === "preview" ? this.dataAr.length - 1 : 0;
          this.TargetAchievementDetails(index);
          // Scroll to the target element
          const element = document.getElementById("row-" + index);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          this.api.HideLoading();
        }
      });
    } else {
      this.TargetAchievementDetails(i);
      // Scroll to the target element
      const element = document.getElementById("row-" + i);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      this.api.HideLoading();
    }
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
      width: "96%",
      height: "95%",
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
      MonthName: this.month_selected,
      YearName: this.fy_selected,
    };

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }

  //===== SHOW HIDE TOTAL COST =====//
  ShowHideCost(Index: any, Type: any, Value: any) {
    if (Type == "SelfActual") {
      this.dataAr[Index]["ShowSelfActualCost"] = Value;
    }

    if (Type == "TeamActual") {
      this.dataAr[Index]["ShowTeamActualCost"] = Value;
    }

    if (Type == "SelfTotal") {
      this.dataAr[Index]["ShowSelfTotalCost"] = Value;
    }

    if (Type == "TeamTotal") {
      this.dataAr[Index]["ShowTeamTotalCost"] = Value;
    }

    if (Type == "TotalTotal") {
      this.dataAr[Index]["ShowTotalTotalCost"] = Value;
    }

    if (Type == "TotalActual") {
      this.dataAr[Index]["ShowTotalActualCost"] = Value;
    }
  }

  //=== FORMAT MONTHS ARRAY DATA ===//
  formatMonths(months: { Id: string; Name: string }[]): string {
    if (!months || months.length === 0) {
      return "";
    }

    // Map of month names to their corresponding index in the year
    const monthOrder = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Remove duplicate months based on Name
    const uniqueMonths = Array.from(
      new Map(months.map((item) => [item.Name, item])).values()
    );

    // Sort months by their position in the year
    uniqueMonths.sort((a, b) => monthOrder[a.Name] - monthOrder[b.Name]);

    let result: string[] = [];
    let rangeStart: string = uniqueMonths[0].Name;

    for (let i = 1; i < uniqueMonths.length; i++) {
      const currentId = +uniqueMonths[i].Id;
      const prevId = +uniqueMonths[i - 1].Id;

      // If the current and previous months are continuous, continue the range.
      if (
        monthOrder[uniqueMonths[i].Name] ===
        monthOrder[uniqueMonths[i - 1].Name] + 1
      ) {
        continue;
      } else {
        // Push the current range and reset for the next one
        result.push(
          rangeStart === uniqueMonths[i - 1].Name
            ? rangeStart
            : `${rangeStart} to ${uniqueMonths[i - 1].Name}`
        );
        rangeStart = uniqueMonths[i].Name; // Start a new range
      }
    }

    // Add the last range
    result.push(
      rangeStart === uniqueMonths[uniqueMonths.length - 1].Name
        ? rangeStart
        : `${rangeStart} to ${uniqueMonths[uniqueMonths.length - 1].Name}`
    );

    // Join the result with commas and return the formatted string
    return result.join(", ");
  }
}
