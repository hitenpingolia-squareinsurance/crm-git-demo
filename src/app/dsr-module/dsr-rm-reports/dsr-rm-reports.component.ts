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
  selector: "app-dsr-rm-reports",
  templateUrl: "./dsr-rm-reports.component.html",
  styleUrls: ["./dsr-rm-reports.component.css"],
})
export class DsrRmReportsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any;

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
  active_tab: any = "Business Call";
  show_spinner: any = "yes";
  re_hit: any = "yes";
  ShowDashboardLoader: string = "no";
  click_tab: any = "Yes";

  isLoadingExportReward:boolean=false;

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

    // this.SetActiveTab("Business Call");

    this.api.SetActiveTabModuleWise("Business Call", "dsr-rm-report");
    this.active_tab = "Business Call";

    this.GetUserRights();

    // this.pageNo = 1;

    this.Get();
  }

  // ngAfterViewInit(): void {
  //   this.api.data1$.subscribe((data) => {
  //     this.post = [];
  //     this.pageNo = 1;
  //     this.scroller
  //       .elementScrolled()
  //       .pipe(
  //         map(() => this.scroller.measureScrollOffset("bottom")),
  //         pairwise(),
  //         filter(([y1, y2]) => y2 < y1 && y2 < 140),
  //         throttleTime(900)
  //       )
  //       .subscribe(() => {
  //         this.ngZone.run(() => {
  //           if (this.re_hit == "yes") {
  //             this.Get();
  //           }
  //         });
  //       });
  //   });
  // }

  //===== SET ACTIVE TAB =====//
  SetActiveTab(tab_value: any) {
    this.active_tab = "";
    this.post = [];
    this.dataAr = "";
    this.pageNo = 1;

    this.TodayData = 0;
    this.TomorrowData = 0;
    this.OvermorrowData = 0;
    this.MissedData = 0;

    this.TotalPosCount = 0;
    this.ActivityDoneCount = 0;
    this.UnderFollowupCount = 0;
    this.TodayActivityCount = 0;
    this.YesterdayActivityCount = 0;

    this.api.SetActiveTabModuleWise(tab_value, "dsr-rm-report");
    this.active_tab = tab_value;

    this.ResetDT();
  }

  //===== SEARCH COMPONENTS DATA =====//
  GetFollowUpsDashboardData(sqlWhere: any) {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", this.SQL_Where_STR);
    formData.append("InteractionPurpose", this.active_tab);
    formData.append("LobList", this.lobList);
    formData.append("Action_User_Con", this.Action_User_Con);

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

  //===== GET DASHBOARD DATA =====//
  GetDashboardData() {

    console.log("this.SQL_Where_STR",this.SQL_Where_STR);
    console.log("this.SqlWhere",this.SqlWhere);
    console.log("this.AllAgentId",this.AllAgentId);

    this.ShowDashboardLoader = "Yes";
    this.api.callme("CustomTable");
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", this.SQL_Where_STR);
    formData.append("SqlWhere1", this.SqlWhere);
    formData.append("AllAgentId", this.AllAgentId);
    formData.append("InteractionPurpose", this.active_tab);
    formData.append("LobType", "");
    formData.append("Action_User_Con", this.Action_User_Con);

    // formData.append('InteractionPurpose', JSON.stringify(this.SearchForm.value['InteractionPurpose']));
    // formData.append('LobType', JSON.stringify(this.SearchForm.value['LobType']));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/daily-tracking-circle/DsrExtraData/GetRMDashboardData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.click_tab = "Yes";

            this.TotalPosCount = result["TotalPosCount"];
            this.ActivityDoneCount = result["ActivityDoneCount"];
            this.UnderFollowupCount = result["UnderFollowupCount"];
            this.TodayActivityCount = result["TodayActivityCount"];
            this.YesterdayActivityCount = result["YesterdayActivityCount"];
          } else {
            this.click_tab = "Yes";

            this.TotalPosCount = 0;
            this.ActivityDoneCount = 0;
            this.UnderFollowupCount = 0;
            this.TodayActivityCount = 0;
            this.YesterdayActivityCount = 0;
          }

          this.ShowDashboardLoader = "No";
        },
        (err) => {
          this.ShowDashboardLoader = "No";
          this.api.HideLoading();
        }
      );
  }

  SearchData(event: any) {
    //    // console.log(event);
    // alert();

    this.filterData = JSON.stringify(event);
    this.FunctionName = event["function_name"];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      // alert();
      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
    // this.api.IsLoading();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    //var fields = this.SearchForm.reset();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
    this.Is_Export = 0;
  }

  //===== REFRESH TABLE =====//
  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }

  Get() {
    this.click_tab = "No";

    this.re_hit = "no";

    this.show_spinner = "yes";
    const formData = new FormData();
    formData.append("datas", this.filterData);

    if (this.pageNo == 1) {
      this.api.IsLoading();
    }

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/dsr/DsrReports/" +
                this.FunctionName +
                "?User_Id=" +
                this.api.GetUserId() +
                "&urlSegment=" +
                this.urlSegment +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM&Page=" +
                this.pageNo
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var result = JSON.parse(this.api.decryptText(res.response));

            this.api.HideLoading();
            this.re_hit = "yes";
            this.show_spinner = "no";

            if (result["Status"] == true) {
              this.SQL_Where_STR = result["SQL_Where"];
              this.SqlWhere = result["SQL_Where1"];
              this.AllAgentId = result["AllAgentId"];
              this.CircleValue = result["CircleValue"];
              this.Action_User_Con = result["Action_User_Con"];

              this.dataAr = result["data"];

              if (this.pageNo <= 1) {
                this.totalRecordsfiltered = result["recordsFiltered"];
                this.TotalRow = result["recordsFiltered"];
              }

              if (this.active_tab != "Employee Call" && this.pageNo == 1) {
                this.GetFollowUpsDashboardData(this.SqlWhere);
                this.GetDashboardData();
              }

              this.responseData = result["data"];
              // this.post = this.post.concat(this.responseData);
              // this.pageNo++;
              // var keyss = 0;

              // this.post = this.post.map((item) => {
              //   keyss++;
              //   item.SrNo = keyss;
              //   return item;
              // });

              if (
                this.active_tab != "Prospect Call" &&
                this.active_tab != "Employee Call"
              ) {
                this.GetYTDChanks();
              }
            } else if (result["Status"] == false) {
              this.TodayData = 0;
              this.TomorrowData = 0;
              this.OvermorrowData = 0;
              this.MissedData = 0;
              this.dataAr = [];

              this.TotalPosCount = 0;
              this.ActivityDoneCount = 0;
              this.UnderFollowupCount = 0;
              this.TodayActivityCount = 0;
              this.YesterdayActivityCount = 0;
            }

            if (result["Status"] == false) {
              this.show_spinner = "no";
              this.ShowDashboardLoader = "No";
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

  // //===== GET DATATABLE DATA =====//
  // Get() {
  //   this.click_tab = "No";

  //   this.re_hit = "no";

  //   this.show_spinner = "yes";
  //   const formData = new FormData();
  //   formData.append("datas", this.filterData);

  //   if (this.pageNo == 1) {
  //     this.api.IsLoading();
  //   }
  //   this.api
  //     .HttpPostTypeBms(
  //       "dsr/DsrReports/" +
  //         this.FunctionName +
  //         "?User_Id=" +
  //         this.api.GetUserId() +
  //         "&urlSegment=" +
  //         this.urlSegment +
  //         "&User_Code=" +
  //         this.api.GetUserData("Code") +
  //         "&Portal=CRM&Page=" +
  //         this.pageNo,
  //       formData
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         this.re_hit = "yes";
  //         this.show_spinner = "no";

  //         if (result["Status"] == true) {
  //           this.SQL_Where_STR = result["SQL_Where"];
  //           this.SqlWhere = result["SQL_Where1"];
  //           this.AllAgentId = result["AllAgentId"];
  //           this.CircleValue = result["CircleValue"];
  //           this.Action_User_Con = result["Action_User_Con"];

  //           this.dataAr = result["data"];
  //           if (this.pageNo <= 1) {
  //             this.totalRecordsfiltered = result["recordsFiltered"];
  //             this.TotalRow = result["recordsFiltered"];
  //           }

  //           if (this.active_tab != "Employee Call" && this.pageNo == 1) {
  //             this.GetFollowUpsDashboardData(this.SqlWhere);
  //             this.GetDashboardData();
  //           }

  //           this.responseData = result["data"];
  //           this.post = this.post.concat(this.responseData);
  //           this.pageNo++;
  //           var keyss = 0;

  //           this.post = this.post.map((item) => {
  //             keyss++;
  //             item.SrNo = keyss;
  //             return item;
  //           });

  //           if (
  //             this.active_tab != "Prospect Call" &&
  //             this.active_tab != "Employee Call"
  //           ) {
  //             this.GetYTDChanks();
  //           }
  //         } else if (this.pageNo == 1 && result["Status"] == false) {
  //           this.TodayData = 0;
  //           this.TomorrowData = 0;
  //           this.OvermorrowData = 0;
  //           this.MissedData = 0;

  //           this.TotalPosCount = 0;
  //           this.ActivityDoneCount = 0;
  //           this.UnderFollowupCount = 0;
  //           this.TodayActivityCount = 0;
  //           this.YesterdayActivityCount = 0;
  //         }

  //         if (result["Status"] == false) {
  //           this.show_spinner = "no";
  //           this.ShowDashboardLoader = "No";
  //         }
  //       },
  //       (err) => {
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    var Value = ""; //this.SearchForm.value['Financial_Year'];
    var fy = "";
    if (Value.length == 1) {
      fy = "2023"; //this.SearchForm.value['Financial_Year'][0]['Id'];
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var Agent_Id = this.dataAr[i]["Id"];

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

  //===== GET USER RIGHTS =====//
  GetUserRights() {
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/GetUserRights?User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM"
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.UserRights = result["User_Rights"];
            if (this.UserRights.Is_RM_Tracking_Report_View == "Self") {
            }
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
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
      // height: '40%',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== SEND LEAD =====//
  AddEmployeeCall(int_type: any): void {
    var width = "25%";
    var height = "45%";
    if (int_type == "Meeting") {
      width = "30%";
      height = "70%";
    }

    const dialogRef = this.dialog.open(AddEmployeeCallComponent, {
      width: width,
      height: height,
      disableClose: true,
      data: { int_type: int_type },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== EXPORT SALARY REPORTS =====//
  ExportDSRReport(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    dialogConfig.hasBackdrop = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "DsrReports",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;
    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }

  //===== EXPORT SALARY REPORTS =====//
  ExportClubReward() {
 
    console.log("this.click_tab",this.click_tab);
    if (!this.dataAr || this.dataAr.length === 0) {
      this.api.Toast(
          "Info", 
          "Please apply a filter to fetch data before exporting. The export function works only after filtering the data."
      );
      return; // Function ko yahi stop kar do
  }

    // Set the loading state based on which button was clicked
    this.isLoadingExportReward = true;

    console.log("this.SQL_Where_STR",this.SQL_Where_STR);
    console.log("this.SqlWhere",this.SqlWhere);
    console.log("this.AllAgentId",this.AllAgentId);
  
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SqlWhere", this.SQL_Where_STR);
    formData.append("SqlWhere1", this.SqlWhere);
    formData.append("AllAgentId", this.AllAgentId);
    formData.append("InteractionPurpose", this.active_tab);
    formData.append("LobType", "");
    formData.append("Action_User_Con", this.Action_User_Con);
    
    this.api.Toast("Info", "Please Wait Processing your request...");
    this.api.HttpPostTypeBms(`daily-tracking-circle/DsrExtraData/ExportClubReward`, formData)
        .then(result => {
            this.isLoadingExportReward = false; // Reset loading state
            if (result['Status']) {
                let DownloadUrl = result['DownloadUrl'];
                let TotalExport = result['TotalExport'];
                this.api.HideLoading();
                this.api.Toast("Success", `Export successful! ${TotalExport} rows created.`);
                if (DownloadUrl) {
                  window.location.href = DownloadUrl;
                }
            } else {
              this.api.Toast("Warning", "Some error occurred!");
            }
        })
        .catch(err => {
            this.isLoadingExportReward = false; // Reset loading state
            this.api.Toast("Warning", `Network Error: ${err.name} (${err.statusText})`);
        });
  }
}
