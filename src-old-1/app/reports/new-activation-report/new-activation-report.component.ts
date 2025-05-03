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
import { AddEmployeeCallComponent } from "../../modals/dsr-related/add-employee-call/add-employee-call.component";

import { DownloadingViewComponent } from "../../modals/downloading-view/downloading-view.component";

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
  Action_User_Con: any;
}

@Component({
  selector: "app-new-activation-report",
  templateUrl: "./new-activation-report.component.html",
  styleUrls: ["./new-activation-report.component.css"],
})
export class NewActivationReportComponent implements OnInit {
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
  Action_User_Con: any = "";
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
  show_spinner: any = "yes";
  re_hit: any = "yes";
  ShowDashboardLoader: string = "No";
  ActivityDonePercanteage: any = 0;
  StatusActiveInactive: any;

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
            if (this.re_hit == "yes") {
              this.Get();
            }
          });
        });
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.filterData = JSON.stringify(event);
    this.FunctionName = event["function_name"];

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

    if (this.pageNo == 1) {
      this.api.IsLoading();
    }
    this.api
      .HttpPostType(
        "V2/Reports/ActivationReport?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&PageType=Reports" +
          "&url=" +
          this.currentUrl +
          "&Page=" +
          this.pageNo +
          "&urlSegment=" +
          this.urlSegment +
          "&User_Code=" +
          this.api.GetUserData("Code") +
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
            this.SqlWhere = result["SqlWhereSr"];
            this.StatusActiveInactive = result["StatusActiveInactive"];

            // this.AllAgentId = result["AllAgentId"];
            // this.CircleValue = result["CircleValue"];
            // this.Action_User_Con = result["Action_User_Con"];

            this.dataAr = result["data"];
            if (this.pageNo <= 1) {
              this.GetAgentDashboardValue();
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
          } else if (this.pageNo == 1 && result["Status"] == false) {
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

          if (result["Status"] == false) {
            this.show_spinner = "no";
          }
        },
        (err) => {
          this.show_spinner = "no";

          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }
  GetAgentDashboardValue() {
    this.ShowDashboardLoader = "Yes";
    this.api.callme("CustomTable");
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "activation-reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", this.SQL_Where_STR);
    formData.append("StatusActiveInactive", this.StatusActiveInactive);
    formData.append("SqlWhereSr", this.SqlWhere);
    // this.api.IsLoading();
    this.api
      .HttpPostType("V2/Reports/GetAgentActivationDashboardValue", formData)
      .then(
        (result: any) => {
          // this.api.HideLoading();

          if (result["Status"] == true) {
            this.TotalPosCount = result["Data"]["TotalPosp"];
            this.ActivityDoneCount = result["Data"]["TotalfilterPosp"];
            this.ActivityDonePercanteage =
              result["Data"]["TotalFilterActivationPercanteage"];
          } else {
            this.TotalPosCount = 0;

            this.ActivityDoneCount = 0;
            this.ActivityDonePercanteage = 0;
          }

          this.ShowDashboardLoader = "No";
        },
        (err) => {
          this.ShowDashboardLoader = "No";
          // this.api.HideLoading();
        }
      );
  }
}
