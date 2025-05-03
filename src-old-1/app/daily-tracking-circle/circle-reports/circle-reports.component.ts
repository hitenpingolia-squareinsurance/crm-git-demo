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
import { DailyTrackingCircleFollowupComponent } from "../../modals/daily-tracking-circle-followup/daily-tracking-circle-followup.component";
import { FollowUpTrackComponent } from "../../modals/daily-tracking-circle-followup/follow-up-track/follow-up-track.component";
import { ShareAspirantComponent } from "../../modals/dsr-related/share-aspirant/share-aspirant.component";

class ColumnsObj {
  Id: string;
  Agent_Id: string;
  User_Id: string;
  isSelected: any;
  Emp_Id: string;
  Password: string;
  Type: string;
  Agent_Name: string;
  Email: string;
  Mobile: string;
  RM_Name: string;
  Circle_Type: string;
  Status: string;
  Update_Stamp: string;
  AddStamp: string;
  Request_Type: string;
  Created_By: string;
  ActionUser: string;
  Club_Status: string;
  Previous_Club: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TodaysTotal: number;
  TodaysTotalDue: number;
  SQL_Where: any;
  SQL_Where1: any;
  CircleValue: any;
}

@Component({
  selector: "app-circle-reports",
  templateUrl: "./circle-reports.component.html",
  styleUrls: ["./circle-reports.component.css"],
})
export class CircleReportsComponent implements OnInit {
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
  currentLob: any = "";
  SqlWhere: any;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  FollowupLeadData: Array<any>;
  ItemEmployeeSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  Is_Export: any = 0;

  MessageBody: string = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  TodaysTotal: any = 0;
  TodaysTotalDue: any = 0;
  DueData: any = "";
  CircleValue: any;
  ShowActivityBy: any = "No";

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
  ClubStatusData: { Id: string; Name: string }[];
  LobData: { Id: string; Name: string }[];
  ReportTypeData: { Id: string; Name: string }[];
  ClubStatusValue: { Id: string; Name: string }[];

  TodayData: any = 0;
  TomorrowData: any = 0;
  OvermorrowData: any = 0;
  MissedData: any = 0;
  Year_Ar: any = [];
  SelectedYear: any = [];
  RequestTypeAr: any = [];
  SelRequestType: any = [];
  LeadStatusData: any = [];
  InteractionTypeData: any = [];
  function_url = "/daily-tracking-circle/CircleReports/GridData";

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
      Request_Type: ["", [Validators.required]],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      AgentType: [""],
      Agents_Id: [""],
      RM_Search_Type: [""],
      LobType: [""],
      AgentStatus: [""],
      Lead_Status: [""],
      Interaction_Type: [""],
      DateOrDateRange: [""],
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
    //Get Current Circle Type
    this.function_url = "/daily-tracking-circle/CircleReports/GridData";
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      if (splitted[2] == "circle-health") {
        this.currentCircleType = "Health";
        this.currentLob = "Club_Health";
      } else if (splitted[2] == "circle-non-motor") {
        this.currentCircleType = "Non Motor";
        this.currentLob = "Club_NonMotor";
      } else if (splitted[2] == "circle-life") {
        this.currentCircleType = "LI";
        this.currentLob = "Club_Life";
      } else if (splitted[2] == "circle-finance") {
        this.currentCircleType = "Finance";
        this.currentLob = "Club_Finance";
      } else if (splitted[2] == "circle-mutual-fund") {
        this.currentCircleType = "Mutual Fund";
        this.currentLob = "Club_Mutual_Fund";
      } else if (splitted[2] == "circle-real-estate") {
        this.currentCircleType = "Real Estate";
        this.currentLob = "Club_Real_Estate";
      } else if (splitted[2] == "circle-credit-card") {
        this.currentCircleType = "Credit Card";
        this.currentLob = "Club_Credit_Card";
      } else if (splitted[2] == "non-club") {
        this.function_url =
          "/daily-tracking-circle/NonClubPosData/GetNonClubPosData";
        this.currentCircleType = "Non Club";
        this.currentLob = "Non_Club";
      }
    }

    this.SearchComponentsData();
    this.GetUserRights();
    this.Get();
  }

  get FC() {
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
  GetFollowUpsDashboardData(SqlWhere: any) {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", SqlWhere);

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

  //===== CHANGE CLUB TYPE =====//
  ChangeClub(e: any) {
    var RequestType = this.SearchForm.value["Request_Type"];
    if (
      RequestType.length > 0 &&
      (RequestType[0]["Id"] == "My Request" ||
        RequestType[0]["Id"] == "Team Requests")
    ) {
      this.ClubStatusValue = [{ Id: "Aspirant", Name: "Aspirant/Prospects" }];
    } else {
      this.ClubStatusValue = [];
    }
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/SearchComponentsData?User_Id=" +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Club-Manager"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];

            this.RequestTypeAr = result["Data"]["RequestTypeAr"];
            this.SelRequestType = result["Data"]["SelRequestType"];

            this.ClubStatusData = result["Data"]["ClubStatusData"];
            this.ReportTypeData = result["Data"]["ReportTypeData"];

            this.FollowupLeadData = result["Data"]["FollowupLeadData"];

            this.LeadStatusData = result["Data"]["LeadStatusData"];
            this.InteractionTypeData = result["Data"]["InteractionTypeData"];

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
    //this.Agents_Ar=[];

    this.SearchForm.get("Emp_Id").setValue(null);
    //this.SearchForm.get('Agent_Id').setValue(null);

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Club Manager");
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
    formData.append("PageName", "Club-Manager");
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    var fields = this.SearchForm.value;
    var RM_Id_value, Franchisee_Id_value, ToDate, FromDate;
    var DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    if (
      fields["Request_Type"] == "My Request" ||
      fields["Request_Type"] == "Team Requests"
    ) {
      this.ShowActivityBy = "Yes";
    } else {
      this.ShowActivityBy = "No";
    }

    var query = {
      Financial_Year: fields["Financial_Year"],
      Request_Type: fields["Request_Type"],
      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],
      Emp_Id: fields["Emp_Id"],
      Agents_Id: fields["Agents_Id"],

      Agent_Type: fields["AgentType"],
      RM_Search_Type: fields["RM_Search_Type"],
      Lob_Type: this.currentLob,
      Agent_Status: fields["AgentStatus"],
      Lead_Status: fields["Lead_Status"],
      Interaction_Type: fields["Interaction_Type"],
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

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.DueData = "";
    this.ShowActivityBy = "No";
    this.SearchForm.reset();
    this.SearchComponentsData();

    this.SearchForm.get("Financial_Year").setValue("");
    this.SearchForm.get("Request_Type").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("");
    this.SearchForm.get("RM_Search_Type").setValue("");
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
          } else {
            //this.api.ErrorMsg(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          //this.api.ErrorMsg(err.message);
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
                this.function_url +
                "?User_Id=" +
                this.api.GetUserId() +
                "&circleType=" +
                this.currentCircleType +
                "&DueData=" +
                this.DueData +
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

            if (resp.Status == true && this.currentCircleType != "Non Club") {
              this.GetFollowUpsDashboardData(this.SqlWhere);
            } else {
              this.TodayData = 0;
              this.TomorrowData = 0;
              this.OvermorrowData = 0;
              this.MissedData = 0;
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

  //===== UPDATE FILTER FIELDS =====//
  UpateFilterField(val: any) {
    if (val == "Lead_Status") {
      this.SearchForm.get("Interaction_Type").setValue("");
    } else if (val == "Interaction_Type") {
      this.SearchForm.get("Lead_Status").setValue("");
    }
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
          ////   //   console.log(data.Agent_Id);
          this.dataAr[i]["FTYLFY"] = data.FTYLFY;
          this.dataAr[i]["FTYCFY"] = data.FTYCFY;
          this.dataAr[i]["FTY"] = data.TotalBusiness;
          this.dataAr[i]["GrowthRate"] = data.GrowthRate;
          this.dataAr[i]["CheckNumber"] = data.CheckNumber;
        });
    }
  }

  //===== ACCEPT CIRCLE LEAD REQUEST =====//
  AcceptRequest(Id: any, Agent_Id: any) {
    var Confirms = confirm("Are You Sure..!");

    if (Confirms == true) {
      const formData = new FormData();
      formData.append("Id", Id);
      formData.append("Agent_Id", Agent_Id);
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "daily-tracking-circle/CircleReports/acceptRequest",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.api.Toast("Success", result["Message"]);
              this.Reload();
            } else {
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
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
  FollowUpActions(Row_Id, Agent_Id, Creator_Id): void {
    const dialogRef = this.dialog.open(DailyTrackingCircleFollowupComponent, {
      width: "35%",
      height: "70%",
      disableClose: true,
      data: {
        Row_Id: Row_Id,
        Circle_Type: this.currentCircleType,
        Agent_Id: Agent_Id,
        Creator_Id: Creator_Id,
        showTab: "No",
        Action_User_Type: "Manager",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
      //this.Reload();
    });
  }

  //===== FOLLOWUP DETAILS MODAL =====//
  FollowUpTrack(Row_Id: any, Circle_Type: any, Agent_Id: any): void {
    const dialogRef = this.dialog.open(FollowUpTrackComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: {
        Row_Id: Row_Id,
        Circle_Type: this.currentCircleType,
        Agent_Id: Agent_Id,
        showTab: "No",
        Action_User_Type: "Manager",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
      //this.Reload();
    });
  }

  //===== SEND LEAD =====//
  ShareAspirant(row_Id: any): void {
    const dialogRef = this.dialog.open(ShareAspirantComponent, {
      width: "25%",
      height: "40%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
