import { HostListener, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { FollowUpTrackComponent } from "../../modals/daily-tracking-circle-followup/follow-up-track/follow-up-track.component";

class ColumnsObj {
  Id: string;
  Agent_Id: string;
  User_Id: string;
  isSelected: any;
  Emp_Id: string;
  Password: string;
  Type: string;
  Name: string;
  Email: string;
  Mobile: string;
  RM_Name: string;
  Circle_Type: string;
  Remark: string;
  Status: string;
  Update_Stamp: string;
  AddStamp: string;
  Request_Type: string;
  Created_By: string;
  FollowUp_By: string;
  Club_Status: string;
  Previous_Club: string;
  VisitCount: string;
  VirtualCount: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  SQL_Where1: any;
  CircleValue: any;
}

@Component({
  selector: "app-manager-report",
  templateUrl: "./manager-report.component.html",
  styleUrls: ["./manager-report.component.css"],
})
export class ManagerReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};
  AgentdropdownSettings: any = {};

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];
  currentUrl: any = "";
  currentCircleType: any = "";

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  FollowupLeadData: Array<any>;
  ItemEmployeeSelection: any = [];
  Manager_Emps_Ar: any = [];
  Lob_Ar: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  SqlWhere: any;
  Is_Export: any = 0;

  MessageBody: string = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  TodaysTotal: any = 0;
  TodaysTotalDue: any = 0;
  TodaysUnAttended: any = 0;
  DueData: any = "";
  Lobs: any = "";
  CircleValue: any;
  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsmultiselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  LobData: { Id: string; Name: string }[];
  ClubStatusData: { Id: string; Name: string }[];
  ReportTypeData: { Id: string; Name: string }[];
  LobDataVal: { Id: string; Name: string }[];
  ClubStatusVal: { Id: string; Name: string }[];

  TodayData: any = 0;
  TomorrowData: any = 0;
  OvermorrowData: any = 0;
  MissedData: any = 0;

  TotalPosCount: any = 0;
  ActivityDoneCount: any = 0;
  UnderFollowupCount: any = 0;
  FollowupMissedCount: any = 0;
  TodayActivityCount: any = 0;
  YesterdayActivityCount: any = 0;

  Year_Ar: any = [];
  SelectedYear: any = [];

  maxDate = new Date();
  minDate = new Date();

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Financial_Year: ["", [Validators.required]],
      Request_Type: [""],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      AgentType: [""],
      Agents_Id: [""],
      RM_Search_Type: [""],
      LobType: [""],
      AgentStatus: [""],
      DateOrDateRange: [""],
      Manager_Id: [""],
      Lead_Status: [""],
      Interaction_Type: [""],
      FollowupRemarks: [""],
      FollowupLeads: [""],
      SearchValue: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit(): void {
    this.GetManagerEmployees();
    this.SearchComponentsData();
    this.GetUserRights();
    this.Get();

    this.LobData = [
      { Id: "All", Name: "All" },
      { Id: "Club_NonMotor", Name: "Non Motor" },
      { Id: "Club_Health", Name: "Health" },
      { Id: "Club_Life", Name: "Life" },
      { Id: "Club_Finance", Name: "Finance" },
      { Id: "Club_Mutual_Fund", Name: "Mutual Fund" },
      { Id: "Club_Real_Estate", Name: "Real Estate" },
    ];
    this.LobDataVal = [{ Id: "All", Name: "All" }];

    this.ClubStatusData = [
      { Id: "All", Name: "All" },
      { Id: "Elite", Name: "Elite" },
      { Id: "Maker", Name: "Maker" },
      { Id: "Novel", Name: "Novel" },
      { Id: "Aspirant", Name: "Aspirant/Prospects" },
    ];
    this.ClubStatusVal = [{ Id: "All", Name: "All" }];

    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];

    this.FollowupLeadData = [
      { Id: "Today", Name: "Today" },
      { Id: "Tomorrow", Name: "Tomorrow" },
      { Id: "Overmorrow", Name: "Overmorrow" },
      { Id: "Missed", Name: "Missed" },
    ];
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== ENABLE DISABLE FIELDS =====//
  EnableDisableFields(Type: any) {
    //== Followup Lead Start ==//
    if (Type == "FollowUp_Lead") {
      var Value = this.SearchForm.value["FollowupLeads"];
      if (Value.length == 1) {
        this.SearchForm.get("DateOrDateRange").setValue("");
      }
    }
    //== Followup Lead End ==//

    //== Date Filter Start ==//
    if (Type == "Date_Filter") {
      var Date = this.SearchForm.value["DateOrDateRange"];
      if (Date != "") {
        this.SearchForm.get("FollowupLeads").setValue("");
      }
    }
    //== Date Filter End ==//
  }

  //===== SEARCH COMPONENTS DATA =====//
  GetFollowUpsDashboardData(SqlWhere) {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", SqlWhere);
    formData.append("LobList", this.CircleValue);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/daily-tracking-circle/DsrExtraData/GetManagerFollowUpsData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.TodayData = result["TodayData"];
            this.TomorrowData = result["TomorrowData"];
            this.OvermorrowData = result["OvermorrowData"];
            this.MissedData = result["MissedData"];
          } else {
            this.TodayData = 0;
            this.TomorrowData = 0;
            this.OvermorrowData = 0;
            this.MissedData = 0;
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET DASHBOARD DATA =====//
  GetDashboardData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", this.SQL_Where_STR);
    formData.append("SqlWhere1", this.SqlWhere);
    formData.append(
      "InteractionPurpose",
      JSON.stringify(this.SearchForm.value["InteractionPurpose"])
    );
    formData.append(
      "LobType",
      JSON.stringify(this.SearchForm.value["LobType"])
    );

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/daily-tracking-circle/DsrExtraData/GetManagerDashboardData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.TotalPosCount = result["TotalPosCount"];
            this.ActivityDoneCount = result["ActivityDoneCount"];
            this.UnderFollowupCount = result["UnderFollowupCount"];
            this.TodayActivityCount = result["TodayActivityCount"];
            this.YesterdayActivityCount = result["YesterdayActivityCount"];
          } else {
            this.TotalPosCount = 0;
            this.ActivityDoneCount = 0;
            this.UnderFollowupCount = 0;
            this.TodayActivityCount = 0;
            this.YesterdayActivityCount = 0;
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/SearchComponentsData?User_Id=" +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Club-Manager-Reports"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];

            var Values1 = this.SelectedYear[0].Id;
            var Year1 = parseInt(Values1);
            var Year2 = Year1 + 1;

            this.minDate = new Date("04-01-" + Year1);
            this.maxDate = new Date("03-31-" + Year2);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //alert(err.message);
        }
      );
  }

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    this.SearchForm.get("Emp_Id").setValue(null);

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Club-Manager-Reports");
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
        "/daily-tracking-circle/AllClubReport/GetEmployees",
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

  //SET REPORT TYPE
  SetReportType() {
    this.reportTypeVal = "";
    this.GetAgents("0");
  }

  //===== GET AGENTS DATA =====//
  GetAgents(e) {
    this.Agents_Placeholder = "Select Agents";
    this.Agents_Ar = [];

    const formData = new FormData();

    if (this.SearchForm.get("Emp_Id").value.length == 1) {
      this.ReportTypeDisable = false;
      if (e == 1) {
        this.reportTypeVal = [{ Id: "Self", Name: "Self" }];
      }
    } else {
      this.ReportTypeDisable = true;
      this.SearchForm.get("RM_Search_Type").setValue("");
      this.reportTypeVal = "";
    }

    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Portal", "CRM");
    formData.append("Agent_Type", "");
    formData.append(
      "Report_Type",
      JSON.stringify(this.SearchForm.value["RM_Search_Type"])
    );
    formData.append("RM_Ids", JSON.stringify(this.SearchForm.value["Emp_Id"]));

    this.api
      .HttpPostTypeBms(
        "daily-tracking-circle/AllClubReport/GetAgents",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Agents_Ar = result["Data"];
            this.Agents_Placeholder =
              "Select Agents (" + this.Agents_Ar.length + ")";
          } else {
            this.Agents_Ar = [];
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

  //===== GET BRANCHES DATA =====//
  GetSubBranches() {
    this.SearchForm.get("Sub_Region_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Club-Manager-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Branch_Id",
      JSON.stringify(this.SearchForm.value["Region_Id"])
    );

    this.api
      .HttpPostTypeBms(
        "daily-tracking-circle/AllClubReport/GetSubBranchesData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Sub_Branch_Ar = result["Data"];
            this.GetEmployees();
          } else {
            this.Sub_Branch_Ar = [];
            // this.SearchForm.get('Sub_Region_Id').setValue('');
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

  //===== GET EMPLOYEES DATA =====//
  GetManagerEmployees() {
    var Circle = "All";
    if (this.SearchForm.value["LobType"].length > 0) {
      Circle = this.SearchForm.value["LobType"][0]["Id"];
    }

    const formData = new FormData();
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Portal", "CRM");
    formData.append("CircleType", Circle);

    this.api
      .HttpPostTypeBms(
        "daily-tracking-circle/AllClubReport/GetManagerList",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Manager_Emps_Ar = result["ManagerData"];
            this.Lob_Ar = result["LobData"];
            this.Lobs = this.Lob_Ar.join();

            this.datatableElement.dtInstance.then(
              (dtInstance: DataTables.Api) => {
                dtInstance.draw();
              }
            );
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      var RM_Id_value, Franchisee_Id_value, ToDate, FromDate;
      var DateOrDateRange = fields["DateOrDateRange"];

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Financial_Year: fields["Financial_Year"],
        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],
        Emp_Id: fields["Emp_Id"],
        Agents_Id: fields["Agents_Id"],

        Agent_Type: fields["AgentType"],
        RM_Search_Type: fields["RM_Search_Type"],
        Lob_Type: fields["LobType"],
        Agent_Status: fields["AgentStatus"],
        Manager_Id: fields["Manager_Id"],
        Lead_Status: fields["Lead_Status"],
        Interaction_Type: fields["Interaction_Type"],
        FollowupRemarks: fields["FollowupRemarks"],
        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
        FollowUpTabValue: fields["FollowupLeads"],
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
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.DueData = "";
    var fields = this.SearchForm.reset();
    // this.SearchForm.get('Request_Type').setValue('Raised Request');
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("");
    this.SearchForm.get("RM_Search_Type").setValue("");
    //this.SearchForm.get('LobType').setValue('');
    //  this.SearchForm.get('AgentStatus').setValue('');
    this.SearchForm.get("Lead_Status").setValue("");
    this.SearchForm.get("Interaction_Type").setValue("");
    this.Agents_Placeholder = "Select Agent";
    this.Employee_Placeholder = "Select Employee";
    this.LobDataVal = [{ Id: "All", Name: "All" }];
    this.ClubStatusVal = [{ Id: "All", Name: "All" }];

    this.dataAr = [];
    this.Emps_Ar = [];
    this.ResetDT();
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.DueData = "";
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.DueData = "";
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  //===== GET USER RIGHTS =====//
  GetUserRights() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/GetUserRights?User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM"
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.UserRights = result["User_Rights"];
            if (this.UserRights.Is_Manager_Tracking_Report_View == "Self") {
              this.GetAgents("0");
            }
          } else {
            //this.api.ErrorMsg(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
        }
      );
  }

  //===== GET DUE DATA =====//
  GetDueData(val) {
    this.DueData = "Due";
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search("").draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/daily-tracking-circle/TrackingReports/GetAllManagerReport?User_Id=" +
                this.api.GetUserId() +
                "&LobData=" +
                this.Lobs +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.SQL_Where;
            that.SqlWhere = resp.SQL_Where1;
            that.CircleValue = resp.CircleValue;

            if (resp.Status == true) {
              this.GetFollowUpsDashboardData(this.SqlWhere);
              this.GetDashboardData();
            } else {
              this.TodayData = 0;
              this.TomorrowData = 0;
              this.OvermorrowData = 0;
              this.MissedData = 0;

              this.TotalPosCount = 0;
              this.ActivityDoneCount = 0;
              this.UnderFollowupCount = 0;
              this.TodayActivityCount = 0;
              this.YesterdayActivityCount = 0;
            }
            that.GetYTDChanks();

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    var Value = this.SearchForm.value["Financial_Year"];
    var fy = "2023";
    if (Value.length == 1) {
      fy = this.SearchForm.value["Financial_Year"][0]["Id"];
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var Agent_Id = this.dataAr[i]["Agent_Id"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Agent_Id", Agent_Id);
      formData.append("Financial_Year", fy);
      formData.append("Circle_Value", this.CircleValue);
      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/daily-tracking-circle/AllClubReport/GetYTDChanks";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));
          this.dataAr[i]["FTYLFY"] = data.FTYLFY;
          this.dataAr[i]["FTYCFY"] = data.FTYCFY;
          this.dataAr[i]["FTY"] = data.TotalBusiness;
          this.dataAr[i]["GrowthRate"] = data.GrowthRate;
          this.dataAr[i]["CheckNumber"] = data.CheckNumber;
        });
    }
  }

  //===== UPDATE FILTER FIELDS =====//
  UpateFilterField(val: any) {
    if (val == "Lead_Status") {
      this.SearchForm.get("Interaction_Type").setValue("");
    } else if (val == "Interaction_Type") {
      this.SearchForm.get("Lead_Status").setValue("");
    }
  }

  //===== UPDATE DATE RANGE =====//
  CheckDateLimit(item: any) {
    var Years = item.Id;
    var Explods = Years.split("-");
    var Year1 = parseInt(Explods[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    this.SearchForm.get("DateOrDateRange").setValue("");
  }

  //===== FOLLOWUP DETAILS MODAL =====//
  FollowUpTrack(Row_Id, Circle_Type, Agent_Id): void {
    const dialogRef = this.dialog.open(FollowUpTrackComponent, {
      width: "65%",
      height: "65%",
      disableClose: true,
      data: {
        Row_Id: Row_Id,
        Circle_Type: Circle_Type,
        Agent_Id: Agent_Id,
        showTab: "No",
        Action_User_Type: "Manager",
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //this.Reload();
    });
  }
}
