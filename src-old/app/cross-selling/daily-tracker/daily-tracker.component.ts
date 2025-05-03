import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { PosCategorizationComponent } from "../../modals/pos-categorization/pos-categorization.component";
import { FollowUpTrackComponent } from "../../modals/daily-tracking-circle-followup/follow-up-track/follow-up-track.component";
import { DailyTrackingCircleFollowupComponent } from "../../modals/daily-tracking-circle-followup/daily-tracking-circle-followup.component";
import { AddProspectCallComponent } from "../../modals/daily-tracking-circle-followup/add-prospect-call/add-prospect-call.component";

class ColumnsObj {
  Id: string;
  Emp_Id: string;
  Password: string;
  Type: string;
  Name: string;
  Email: string;
  Mobile: string;
  RM_Name: string;
  Status: string;
  AgentsCircle: string;
  Update_Stamp: string;
  Club_Status: string;
  Previous_Club: string;
  FollowupFlag: string;

  Occupation: string;
  Prospect_Type: string;
  Call_Type: string;
  Insert_Date: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  CircleValue: any;
}

@Component({
  selector: "app-daily-tracker",
  templateUrl: "./daily-tracker.component.html",
  styleUrls: ["./daily-tracker.component.css"],
})
export class DailyTrackerComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};
  mytime: Date = new Date();

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;
  LobFieldDisable = false;
  ClubFieldDisable = false;
  ShowProspectBtn = "Yes";
  AddProspectCallBtn = "No";
  InteractionPurposeVal: any = "";
  FunctionName: any = "GetAllPos";

  AgentdropdownSettings: any = {};

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  ReportTypeData: Array<any>;
  FollowupLeadData: Array<any>;

  ItemEmployeeSelection: any = [];
  Interaction_Purpose_Ar: any = [];
  LobData: any = [];
  ClubStatusData: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  Is_Export: any = 0;

  MessageBody: string = "";
  ActionType: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  currentUrl: string;
  urlSegment: any;
  CircleValue: any;

  Year_Ar: any = [];
  SelectedYear: any = [];

  maxDate = new Date();
  minDate = new Date();

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};
  lobList: any = "";
  Is_Daily_Tracker_View: any;
  TodayData: any = 0;
  TomorrowData: any = 0;
  OvermorrowData: any = 0;
  MissedData: any = 0;
  FollowUpTabValue: any = "";

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
      InteractionPurpose: ["", [Validators.required]],
      LobType: [""],
      AgentStatus: [""],
      Lead_Status: [""],
      Interaction_Type: [""],
      FollowupLeads: [""],
      DateOrDateRange: [""],
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
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    this.SearchComponentsData();
    this.GetUserRights();
    this.Get();

    this.Interaction_Purpose_Ar = [
      { Id: "Business Call", Name: "Business Call" },
      { Id: "Prospect Call", Name: "Prospect Call" },
      { Id: "Club", Name: "Club" },
    ];
    this.LobData = [
      { Id: "Club_NonMotor", Name: "Non Motor" },
      { Id: "Club_Health", Name: "Health" },
      { Id: "Club_Life", Name: "Life" },
      { Id: "Club_Finance", Name: "Finance" },
      { Id: "Club_Mutual_Fund", Name: "Mutual Fund" },
    ];

    this.ClubStatusData = [
      { Id: "All", Name: "All" },
      { Id: "Elite", Name: "Elite" },
      { Id: "Maker", Name: "Maker" },
      { Id: "Novel", Name: "Novel" },
      { Id: "Aspirant", Name: "Aspirant/Prospects" },
    ];

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
  EnableDisableFields(e: any, Type: any) {
    this.FunctionName = "GetAllPos";

    //== Interaction Purpose Start==//
    if (Type == "Interaction Purpose") {
      this.InteractionPurposeVal = "";
      var Value = this.SearchForm.value["InteractionPurpose"];

      if (Value.length == 1 && Value[0]["Id"] == "Business Call") {
        this.InteractionPurposeVal = "Business Call";
        this.LobFieldDisable = true;
        this.ClubFieldDisable = true;
        this.ShowProspectBtn = "Yes";

        this.SearchForm.get("LobType").setValidators(null);
        this.SearchForm.get("LobType").updateValueAndValidity();
        this.SearchForm.get("LobType").setValue("");
        this.SearchForm.get("AgentStatus").setValue("");
      } else if (Value.length == 1 && Value[0]["Id"] == "Prospect Call") {
        this.InteractionPurposeVal = "Prospect Call";
        this.FunctionName = "GetProspectCallData";

        this.LobFieldDisable = true;
        this.ClubFieldDisable = true;
        this.ShowProspectBtn = "No";

        this.SearchForm.get("LobType").setValidators(null);
        this.SearchForm.get("LobType").updateValueAndValidity();
        this.SearchForm.get("LobType").setValue("");
        this.SearchForm.get("AgentStatus").setValue("");
      } else {
        this.InteractionPurposeVal = "Club";
        this.LobFieldDisable = false;
        this.ClubFieldDisable = false;
        this.ShowProspectBtn = "No";

        if (Value.length == 1 && Value[0]["Id"] == "Club") {
          this.SearchForm.get("LobType").setValidators([Validators.required]);
          this.SearchForm.get("LobType").updateValueAndValidity();
        } else {
          this.SearchForm.get("LobType").setValidators(null);
          this.SearchForm.get("LobType").updateValueAndValidity();
        }
      }
    }
    //== Interaction Purpose End==//

    //== Club Condition Start==//
    if (Type == "Club") {
      var Value = this.SearchForm.value["AgentStatus"];
      var Value1 = this.SearchForm.value["InteractionPurpose"];

      if (Value.length >= 1) {
        this.SearchForm.get("LobType").setValidators([Validators.required]);
        this.SearchForm.get("LobType").updateValueAndValidity();
      } else {
        if (Value1.length == 1 && Value1[0]["Id"] == "Club") {
          //No chnge
        } else {
          this.SearchForm.get("LobType").setValidators(null);
          this.SearchForm.get("LobType").updateValueAndValidity();
        }
      }
    }
    //== Club Condition End==//
  }

  //===== ENABLE DISABLE FIELDS =====//
  EnableDisableFields1(Type: any) {
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
    formData.append("PageName", "Daily-Tracker");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", SqlWhere);
    formData.append("InteractionPurpose", this.InteractionPurposeVal);
    formData.append("LobList", this.lobList);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/daily-tracking-circle/DsrExtraData/GetFollowUpsDashboardData",
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

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/SearchComponentsData?User_Id=" +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Daily-Tracker"
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
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    //this.Agents_Ar=[];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.ReportTypeDisable = true;
    this.SearchForm.get("RM_Search_Type").setValue("");
    this.reportTypeVal = "";

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Daily-Tracker");
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
    this.Sub_Branch_Ar = [];

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Daily-Tracker");
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
            this.GetEmployees();
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
  SearchBtn(Type: any) {
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

      var Value = this.SearchForm.value["LobType"];
      if (Value.length == 1) {
        this.lobList = this.SearchForm.value["LobType"][0]["Id"];
      } else {
        this.lobList = "";
      }

      var query = {
        Financial_Year: fields["Financial_Year"],
        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],
        Emp_Id: fields["Emp_Id"],
        RM_Search_Type: fields["RM_Search_Type"],
        Agents_Id: fields["Agents_Id"],
        Interaction_Purpose: fields["InteractionPurpose"],
        Lob_Type: fields["LobType"],
        Agent_Status: fields["AgentStatus"],
        Lead_Status: fields["Lead_Status"],
        Interaction_Type: fields["Interaction_Type"],
        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
        SearchValue: fields["SearchValue"],
        FollowUpTabValue: fields["FollowupLeads"],
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
    var fields = this.SearchForm.reset();
    this.SearchForm.get("Request_Type").setValue("Raised Request");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("");
    this.SearchForm.get("RM_Search_Type").setValue("");
    this.SearchForm.get("LobType").setValue("");
    this.SearchForm.get("AgentStatus").setValue("");
    this.SearchForm.get("Lead_Status").setValue("");
    this.SearchForm.get("Interaction_Type").setValue("");

    this.Agents_Placeholder = "Select Agent";
    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
    this.ResetDT();
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
  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http;
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/daily-tracking-circle/AllClubReport/" +
                this.FunctionName +
                "?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&urlSegment=" +
                this.urlSegment +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.SQL_Where;

            if (resp.Status == true) {
              this.GetFollowUpsDashboardData(this.SQL_Where_STR);
            } else {
              this.TodayData = 0;
              this.TomorrowData = 0;
              this.OvermorrowData = 0;
              this.MissedData = 0;
            }

            if (this.InteractionPurposeVal == "Prospect Call") {
              this.AddProspectCallBtn = "Yes";
            } else {
              this.AddProspectCallBtn = "No";
              this.CircleValue = resp.CircleValue;
              that.GetYTDChanks();
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6], // column index (start from 0)
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
      var Agent_Id = this.dataAr[i]["Id"];

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
        .then((res) => {
          var data = JSON.parse(this.api.decryptText(res.response));
          //// console.log(data.Agent_Id);
          this.dataAr[i]["FTYLFY"] = data.FTYLFY;
          this.dataAr[i]["FTYCFY"] = data.FTYCFY;
          this.dataAr[i]["FTY"] = data.TotalBusiness;
          this.dataAr[i]["GrowthRate"] = data.GrowthRate;
          this.dataAr[i]["CheckNumber"] = data.CheckNumber;
          this.dataAr[i]["AgentsCircle"] = data.AgentsCircle;
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
            this.Is_Daily_Tracker_View = this.UserRights.Is_Daily_Tracker_View;
            if (this.UserRights.Is_Daily_Tracker_View == "Self") {
              this.GetAgents("0");
            }
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
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

  //===== SEND LEAD =====//
  AddRemark(row_Id): void {
    const dialogRef = this.dialog.open(PosCategorizationComponent, {
      width: "25%",
      height: "40%",
      disableClose: true,
      data: { Id: row_Id, lobList: this.lobList },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      // this.Reload();
    });
  }

  //===== ADD FOLLOWUP DETAILS MODAL =====//
  FollowUpActions(Row_Id, Agent_Id, Circle_Type: any): void {
    const dialogRef = this.dialog.open(DailyTrackingCircleFollowupComponent, {
      width: "35%",
      height: "70%",
      disableClose: true,
      data: {
        Row_Id: Row_Id,
        Circle_Type: Circle_Type,
        Agent_Id: Agent_Id,
        Creator_Id: "",
        showTab: "Yes",
        Action_User_Type: "RM",
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  //===== FOLLOWUP DETAILS MODAL =====//
  FollowUpTrack(Circle_Type: any, Agent_Id: any): void {
    const dialogRef = this.dialog.open(FollowUpTrackComponent, {
      width: "65%",
      height: "65%",
      disableClose: true,
      data: {
        Row_Id: "",
        Circle_Type: Circle_Type,
        Agent_Id: Agent_Id,
        showTab: "Yes",
        Action_User_Type: "RM",
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //this.Reload();
    });
  }

  //===== ADD PROSPECT CALL MODAL =====//
  AddProspectCall(): void {
    const dialogRef = this.dialog.open(AddProspectCallComponent, {
      width: "35%",
      height: "70%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.Reload();
    });
  }
}
