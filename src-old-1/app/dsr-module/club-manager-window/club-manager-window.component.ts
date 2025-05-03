import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  NgZone,
} from "@angular/core";

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { timer } from "rxjs";

import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import $ from "jquery";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { AgentsReportDetailsComponent } from "../../modals/dsr-related/agents-report-details/agents-report-details.component";
import { AddFollowUpsComponent } from "../../modals/dsr-related/add-follow-ups/add-follow-ups.component";
import { ActivityTrackComponent } from "../../modals/dsr-related/activity-track/activity-track.component";
import { ShareAspirantComponent } from "../../modals/dsr-related/share-aspirant/share-aspirant.component";
import { ClubCriteriaComponent } from "../../modals/dsr-related/club-criteria/club-criteria.component";

class ColumnsObj {
  Id: string;
  Emp_Id: string;
  Password: string;
  Type: string;
  Name: string;
  Email: string;
  Mobile: string;
  RM_Name: string;
  Remark: string;
  Status: string;
  Update_Stamp: string;
  Club_Status: string;
  Previous_Club: string;
  FollowupFlag: string;
  VisitCount: string;
  VirtualCount: string;
  AgentType: string;
  AgentLob: string;
  CityName: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  FilterData: any[];
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  SQL_Where1: any;
  CircleValue: any;
  AllAgentId: any;
}

@Component({
  selector: "app-club-manager-window",
  templateUrl: "./club-manager-window.component.html",
  styleUrls: ["./club-manager-window.component.css"],
})
export class ClubManagerWindowComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];
  AddProspectCallBtn = "No";
  InteractionPurposeVal: any = "";
  FunctionName: any = "GetRMReportData";

  SQL_Where_STR: any;
  SqlWhere: any;
  Is_Export: any = 0;
  AllAgentId: any = "";

  MessageBody: string = "";
  lobList: string = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  currentUrl: string;
  urlSegment: any;
  CircleValue: any;

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

  totalRecordsfiltered: number;
  TotalRow: number;
  filterData: string;
  AgentName: any;
  dataArNested: any;
  NestedPagesList: any;
  loading = false;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  AgentId: string;
  ShowProspectBtn: string = "Yes";
  active_tab: any = "Business Call";
  show_spinner: any = "yes";
  re_hit: any = "yes";
  currentCircleType: any = "";
  currentLob: any = "";
  check_rights: any = "yes";

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }
    this.SetActiveTab("");
    this.pageNo = 1;
  }

  ngAfterViewInit(): void {
    this.api.data1$.subscribe((data) => {
      this.post = [];
      this.pageNo = 1;
      this.scroller
        .elementScrolled()
        .pipe(
          map(() => this.scroller.measureScrollOffset("bottom")),
          pairwise(),
          filter(([y1, y2]) => y2 < y1 && y2 < 140),
          throttleTime(900)
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            if (this.re_hit == "yes" && this.currentCircleType != "") {
              this.Get();
            }
          });
        });
    });
  }

  //===== SET ACTIVE TAB =====//
  SetActiveTab(tab_value: any) {
    this.active_tab = "";
    this.post = [];
    this.pageNo = 1;

    this.TodayData = 0;
    this.TomorrowData = 0;
    this.OvermorrowData = 0;
    this.MissedData = 0;

    // alert(tab_value);
    // alert(this.currentCircleType);

    this.api.SetActiveTabModuleWise(tab_value, "dsr-club-manager");

    if (this.check_rights == "yes") {
      this.api
        .CallBms(
          "dsr/DsrCommon/GetUserRights?User_Code=" +
            this.api.GetUserData("Code")
        )
        .then((result: any) => {
          if (result["Status"] == true) {
            this.check_rights = "no";
            this.UserRights = result["User_Rights"];

            if (this.UserRights["Is_Circle_Health"] == "All") {
              tab_value = "Health";
            } else if (this.UserRights["Is_Circle_Non_Motor"] == "All") {
              tab_value = "Non Motor";
            } else if (this.UserRights["Is_Circle_Life"] == "All") {
              tab_value = "Life";
            } else if (this.UserRights["Is_Circle_Finance"] == "All") {
              tab_value = "Finance";
            } else if (this.UserRights["Is_Circle_Health"] == "All") {
              tab_value = "Mutual Fund";
            } else if (this.UserRights["Is_Circle_Real_Estate"] == "All") {
              tab_value = "Real Estate";
            }

            this.active_tab = tab_value;
            this.currentCircleType = "";
            if (this.active_tab == "Health") {
              this.currentCircleType = "Health";
              this.currentLob = "Club_Health";
            } else if (this.active_tab == "Non Motor") {
              this.currentCircleType = "Non Motor";
              this.currentLob = "Club_NonMotor";
            } else if (this.active_tab == "Life") {
              this.currentCircleType = "LI";
              this.currentLob = "Club_Life";
            } else if (this.active_tab == "Finance") {
              this.currentCircleType = "Finance";
              this.currentLob = "Club_Finance";
            } else if (this.active_tab == "Mutual Fund") {
              this.currentCircleType = "Mutual Fund";
              this.currentLob = "Club_Mutual_Fund";
            } else if (this.active_tab == "Real Estate") {
              this.currentCircleType = "Mutual Fund";
              this.currentLob = "Club_Mutual_Fund";
            }

            this.api.SetActiveTabModuleWise(tab_value, "dsr-club-manager");
          }
        });
    } else {
      this.active_tab = tab_value;
      this.currentCircleType = "";
      if (this.active_tab == "Health") {
        this.currentCircleType = "Health";
        this.currentLob = "Club_Health";
      } else if (this.active_tab == "Non Motor") {
        this.currentCircleType = "Non Motor";
        this.currentLob = "Club_NonMotor";
      } else if (this.active_tab == "Life") {
        this.currentCircleType = "LI";
        this.currentLob = "Club_Life";
      } else if (this.active_tab == "Finance") {
        this.currentCircleType = "Finance";
        this.currentLob = "Club_Finance";
      } else if (this.active_tab == "Mutual Fund") {
        this.currentCircleType = "Mutual Fund";
        this.currentLob = "Club_Mutual_Fund";
      } else if (this.active_tab == "Real Estate") {
        this.currentCircleType = "Mutual Fund";
        this.currentLob = "Club_Mutual_Fund";
      }
    }
  }

  //===== SEARCH COMPONENTS DATA =====//
  GetFollowUpsDashboardData(sqlWhere: any) {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", sqlWhere);
    formData.append("InteractionPurpose", this.active_tab);
    formData.append("LobList", this.lobList);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/daily-tracking-circle/DsrExtraData/GetFollowUpsDashboardData",
        formData
      )
      .then(
        (result: any) => {
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

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.filterData = JSON.stringify(event);
    this.active_tab = event["tab_name"];

    this.post = [];
    this.pageNo = 1;

    this.Get();
    this.Is_Export = 0;
    this.dataAr = [];
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    this.re_hit = "no";

    this.show_spinner = "yes";
    const formData = new FormData();
    formData.append("datas", this.filterData);
    if (this.currentCircleType == "") {
      return;
    }

    if (this.pageNo == 1) {
      this.api.IsLoading();
    }

    this.api
      .HttpPostTypeBms(
        "dsr/ClubManager/ManagerGridData" +
          "?User_Id=" +
          this.api.GetUserId() +
          "&urlSegment=" +
          this.urlSegment +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&circleType=" +
          this.currentCircleType +
          "&Portal=CRM&Page=" +
          this.pageNo,
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          this.re_hit = "yes";
          this.show_spinner = "no";

          if (result["Status"] == true) {
            this.SQL_Where_STR = result["SQL_Where"];
            this.SqlWhere = result["SQL_Where1"];
            this.AllAgentId = result["AllAgentId"];
            this.CircleValue = result["CircleValue"];

            this.dataAr = result["data"];
            if (this.pageNo <= 1) {
              this.totalRecordsfiltered = result["recordsFiltered"];
              this.TotalRow = result["recordsFiltered"];
            }

            this.responseData = result["data"];
            this.post = this.post.concat(this.responseData);
            this.pageNo++;
            var keyss = 0;

            this.post = this.post.map((item) => {
              keyss++;
              item.SrNo = keyss;
              return item;
            });

            if (this.active_tab != "Prospect Call") {
              this.GetYTDChanks();
            }

            this.GetFollowUpsDashboardData(this.SqlWhere);
          } else if (this.pageNo == 1 && result["Status"] == false) {
            this.TodayData = 0;
            this.TomorrowData = 0;
            this.OvermorrowData = 0;
            this.MissedData = 0;
          }

          if (result["Status"] == false) {
            this.show_spinner = "no";
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
    var Value = ""; //this.SearchForm.value['Financial_Year'];
    var fy = "";
    if (Value.length == 1) {
      fy = "2023"; //this.SearchForm.value['Financial_Year'][0]['Id'];
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var Agent_Id = this.dataAr[i]["Agent_Id"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("agent_id", Agent_Id);
      formData.append("portal", "CRM");
      formData.append("Financial_Year", fy);

      var url =
        environment.apiUrlBmsBase +
        "/dsr/DsrBusinessCalculation/GetBusinessData";

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
          this.dataAr[i]["FTYLFY"] = data.lfy_till_total;
          this.dataAr[i]["FTYLFY_STR"] = data.lfy_till_total_str;

          this.dataAr[i]["FTYCFY"] = data.cfy_till_total;
          this.dataAr[i]["FTYCFY_STR"] = data.cfy_till_total_str;

          this.dataAr[i]["FTY"] = data.lfy_total_sum;
          this.dataAr[i]["FTY_STR"] = data.lfy_total_sum_str;

          this.dataAr[i]["GrowthRate"] = data.overall_growth_rate;
          this.dataAr[i]["CheckNumber"] = data.overall_growth_int;
        });
    }
  }

  //===== FOLLOWUP DETAILS MODAL =====//
  FollowUpTrack(Agent_Id: any, Agent_Name: any, Circle_Type: any): void {
    const dialogRef = this.dialog.open(ActivityTrackComponent, {
      width: "75%",
      height: "90%",
      disableClose: true,
      data: {
        Row_Id: "",
        Circle_Type: Circle_Type,
        Agent_Id: Agent_Id,
        Agent_Name: Agent_Name,
        showTab: "Yes",
        Action_User_Type: "RM",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== GET AGENTS BUSINESS =====//
  GetBusinessDetails(agent_id: any, agent_name: any): void {
    const dialogRef = this.dialog.open(AgentsReportDetailsComponent, {
      width: "75%",
      height: "50%",
      disableClose: true,
      data: { agent_id: agent_id, agent_name: agent_name },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== ADD FOLLOWUPS DATA MODAL =====//
  AddFollowUpData(action_type: any, circle_type: any): void {
    const dialogRef = this.dialog.open(AddFollowUpsComponent, {
      width: "35%",
      height: "525px",
      disableClose: true,
      data: {
        action_type: action_type,
        circle_type: circle_type,
        action_user: "rm",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
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

  //===== SEND LEAD =====//
  ShowClubCriteria(): void {
    const dialogRef = this.dialog.open(ClubCriteriaComponent, {
      width: "65%",
      height: "40%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
