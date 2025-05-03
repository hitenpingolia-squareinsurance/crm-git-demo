import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy,
} from "@angular/core";

import {
  CdkVirtualScrollViewport,
  ScrollDispatcher,
} from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { timer } from "rxjs";

import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import $ from "jquery";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { RenewalfollowformComponent } from "../renewalfollowform/renewalfollowform.component";
import { RenewalfollowdetailsComponent } from "../renewalfollowdetails/renewalfollowdetails.component";
import { EmailsendpopupsComponent } from "../emailsendpopups/emailsendpopups.component";
import { PolicydetailsComponent } from "../../modals/policydetails/policydetails.component";
import { EmployeerenewalpopupComponent } from "../employeerenewalpopup/employeerenewalpopup.component";

import { RenewalnewgadiComponent } from "../../modals/renewalnewgadi/renewalnewgadi.component";
import { RenewalnoticeComponent } from "../../modals/renewalnotice/renewalnotice.component";
import { ViewSrDetailsComponent } from "../../modals/view-sr-details/view-sr-details.component";
import { RenewalonlinequoteCreationComponent } from "../../modals/renewalonlinequote-creation/renewalonlinequote-creation.component";
import { RenewalfollowformwithagetgroupComponent } from "../renewalfollowformwithagetgroup/renewalfollowformwithagetgroup.component";
import { AgentRenewalDetailsComponent } from "../agent-renewal-details/agent-renewal-details.component";

class ColumnsObj {
  Id: string;
  LOB: string;
  ProductName: string;
  Quotation_Id: string;
  CustomerName: string;
  ExpiryStatus: string;
  CustomerMobile: string;
  MakeModelName: string;
  Vehicle_No: string;
  Download_Url: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterData: any[];
  RenewalQuery: any[];
  NetPremiumFilteredRecords: any;
}

@Component({
  selector: "app-maneger-renewal-section",
  templateUrl: "./maneger-renewal-section.component.html",
  styleUrls: ["./maneger-renewal-section.component.css"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ManegerRenewalSectionComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;

  @ViewChild("scroller1", { static: false })
  scroller1: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";
  buttonDisable = false;

  SearchForm: FormGroup;
  isSubmitted = false;
  MaskingAgentMobile: any = "Temp";

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};
  GlobelLOB: any = [];
  Ins_Compaines: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];

  Company_Ar: any = [];
  Renewals: any = [];
  LOB_Ar: any = [];
  Product_Ar: any = [];
  data_Ar: any = [];
  Source: any = [];

  Is_Export: any = 0;
  FilterDatatype: any;
  totalRecordsfiltered: number;
  RenewalStatuss: { Id: string; Name: string }[];
  RangeButton: boolean = false;
  DisabledButonDateRangepicker: boolean = false;
  RangeButton2: boolean = false;
  UserRoleType: string;
  Tab_Type_Display: boolean = false;
  RenewalQuery: any;
  MonthRenewal: any = [];
  currentUrl: string;
  urlSegment: string;
  urlSegmentroot: string;
  loginType: string | null;
  NetPremiumFilteredRecords: any;
  TotalRow: number;
  filterData: string;
  AgentName: any;
  dataArNested: any;
  NestedPagesList: any;
  loading = false;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  postNested: Array<any> = [];
  responseDataNested: any;

  AgentId: string;
  pageNoNested: number = 1;
  filterData1: string;

  post1: Array<any> = [];
  pageNo1: any = 1;
  pageval: string;
  scroll: string;
  scrollvas: number;
  TotalRenewalFilteredRecords: any;
  DivshowAgent: number = 1;
  LastPageId: number = 0;
  checkNoPageno: number = 1;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private scrollDispatcher: ScrollDispatcher
  ) {
    this.SearchForm = this.fb.group({
      Lob: [""],
      DateOrDateRange: [""],
      Company: [""],
      FinancialYear: [""],
      PolicyFileType: [""],
      SearchValue: [""],
      Source: [""],
      ProductType: [""],
      Tab_Type: [""],
      RenewalStatus: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.Renewals = [
      { Id: "All", Name: "45 Days" },
      { Id: "Today", Name: "Today" },
      { Id: "2_Days", Name: "2 Days" },
      { Id: "7_Days", Name: "7 Days" },
      { Id: "15_Days", Name: "15 Days" },
      { Id: "30_Days", Name: "30 Days" },
    ];

    this.RenewalStatuss = [
      { Id: "0", Name: "Pending" },
      { Id: "1", Name: "Follow Up" },
      { Id: "2", Name: "Renewed" },
      { Id: "3", Name: "Lost" },
      { Id: "4", Name: "Missed" },
    ];
    this.SearchForm.get("Tab_Type").setValue([{ Id: "All", Name: "45 Days" }]);

    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }
    if (typeof splitted[1] != "undefined") {
      this.urlSegmentroot = splitted[1];
    }

    // alert( this.urlSegmentroot);

    this.loginType = this.api.GetUserType();
    this.OpenAgentPoupup(0, "", "", "", "");
    // this.DivshowAgent = 0;
  }

  ngOnInit(): void {
    // this.Get();
    this.FilterDataType();
    this.FilterData();

    this.UserRoleType = this.api.GetUserType();

    // this.FilterDataGetMonthRenewal();

    this.pageNo = 1;
  }

  OpenAgentPoupup(Val, AgentName, AgentIds, type, page) {
    // alert(Val);

    if (Val == 1) {
      this.AgentName = AgentName;
      this.AgentId = AgentIds;
      this.pageval = page;

      this.GetBulkCases(this.AgentName, this.AgentId, type, page);
    } else {
      this.AgentName = "";
      this.AgentId = "";
      this.pageval = "";
    }
    this.DivshowAgent = Val;
  }

  ngAfterViewInit(): void {
    this.pageNo = 1;

    // this.scrollDispatcher.scrolled().pipe(
    //   filter(event => this.virtualScroll.getRenderedRange().end === this.virtualScroll.getDataLength())
    // ).subscribe(event => {

    //   this.Get();
    //   alert(this.pageNo);

    // });

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
          // alert('page no '+this.pageNo);
          this.Get();
        });
      });

    this.pageNoNested = 1;
    this.scroller1
      .elementScrolled()
      .pipe(
        map(() => this.scroller1.measureScrollOffset("bottom")),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(900)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.GetBulkCases(
            this.AgentName,
            this.AgentId,
            "",
            this.pageNoNested
          );
        });
      });
  }

  ShowEmailPopups(
    Id: number,
    ExpiryDays,
    Agent_Mobile: string,
    Agent_Email: string,
    Customer_Mobile: string,
    Customer_Email: string,
    Lob: string
  ) {
    const dialogRef = this.dialog.open(EmailsendpopupsComponent, {
      width: "60%",
      height: "60%",
      data: {
        Id: Id,
        Type: "User",
        Days: ExpiryDays,
        Agent_Mobile: Agent_Mobile,
        Agent_Email: Agent_Email,
        Customer_Mobile: Customer_Mobile,
        Customer_Email: Customer_Email,
        Lob: Lob,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  // FilterDataGetMonthRenewal() {
  //   this.api
  //     .HttpGetType(
  //       "myaccount/GetMonthRenewal?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType() +
  //       "&PageType=Reports"
  //     )
  //     .then(
  //       (result: any) => {
  //         if (result["Status"] == true) {
  //           this.MonthRenewal = result["Data"];

  //           // // console.log(this.MonthRenewal);
  //           // // console.log(12345678);
  //         } else {
  //           //alert(result['message']);
  //           this.api.Toast("Warning", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         // Error log
  //         //// console.log(err);

  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //         //this.api.ErrorMsg('Network Error :- ' + err.message);
  //       }
  //     );
  // }

  FilterDataType() {
    this.api
      .HttpGetType(
        "Globel/PolicyFilterType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result: any) => {
          if (result["Status"] == true) {
            this.GlobelLOB = result["Data"]["GlobelLOB"];
            this.Ins_Compaines = result["Data"]["Ins_Compaines"];
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];
            this.SRSource_Ar = [
              { Id: "BMS", Name: "Offline" },
              { Id: "Web", Name: "Online" },
              { Id: "Excel", Name: "Excel" },
            ];

            //  this.PolicyType = result['Data']['PolicyType'];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);

          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  FilterData() {
    // this.api
    //   .HttpGetType(
    //     "myaccount/index?User_Id=" +
    //     this.api.GetUserData("Id") +
    //     "&User_Type=" +
    //     this.api.GetUserType() +
    //     "&PageType=Reports"
    //   )
    //   .then(
    //     (result: any) => {
    //       if (result["Status"] == true) {
    //         this.data_Ar = result["Data"];
    //       } else {
    //         //alert(result['message']);
    //         this.api.Toast("Warning", result["Message"]);
    //       }
    //     },
    //     (err) => {
    //       // Error log
    //       //// console.log(err);
    //       this.api.Toast(
    //         "Warning",
    //         "Network Error : " + err.name + "(" + err.statusText + ")"
    //       );
    //       //this.api.ErrorMsg('Network Error :- ' + err.message);
    //     }
    //   );
  }

  onItemSelect(item: any, type) {}
  onItemDeSelect(item: any, type) {}

  Renew(Quotation_Id) {
    alert(Quotation_Id);
  }

  ClearSearch() {
    //var fields = this.SearchForm.reset();

    this.dataAr = [];

    this.ResetDT();

    var fields = this.SearchForm.reset();
    this.Tab_Type_Display = false;
    this.SearchForm.get("Tab_Type").setValue([
      { Id: "45_Days", Name: "45 Days" },
    ]);
    this.Is_Export = 0;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    // alert();
    $("#fillterSearchId").prop("disabled", true);

    this.filterData = JSON.stringify(event);
    this.post = [];
    this.FilterDatatype = [];
    this.TotalRenewalFilteredRecords = 0;
    this.NetPremiumFilteredRecords = 0;
    this.pageNo = 1;

    this.LastPageId = 0;

    this.Get();

    this.Is_Export = 0;
    this.dataAr = [];
    this.checkNoPageno = 1;
  }

  Reload() {
    this.post = [];
    this.pageNo = 1;
  }

  ResetDT() {
    this.post = [];
    this.pageNo = 1;
  }

  Removedatass(books: any) {
    // var filterArray = books.reduce((accumulator, current) => {
    //   if (!accumulator.some((item) => item.Agent_Code === current.Agent_Code)) {
    //     accumulator.push(current);
    //   }
    //   return accumulator;
    // }, []);

    // return filterArray;

    const expected = new Set();
    const unique = books.filter((item) =>
      !expected.has(JSON.stringify(item))
        ? expected.add(JSON.stringify(item))
        : false
    );

    return unique;
  }

  Get() {
    if (this.checkNoPageno === 1) {
      this.LastPageId = this.pageNo;

      $(".spinner-item").css("display", "block");

      const formData = new FormData();
      formData.append("datas", this.filterData);

      this.api
        .HttpPostType(
          "myaccount/GirdDataReports?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&PageType=Reports" +
            "&url=" +
            this.currentUrl +
            "&Page=" +
            this.pageNo,
          formData
        )
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.dataAr = result["data"];
              this.buttonDisable = false;
              $("#fillterSearchId").prop("disabled", false);

              $(".spinner-item").css("display", "none");

              if (this.pageNo <= 1) {
                this.totalRecordsfiltered = result["recordsFiltered"];
                this.FilterDatatype = result["FilterData"];
                this.api.Send_Renewal_mail_Set_Condition(1);
                this.RenewalQuery = result["RenewalQuery"];
                this.SharedRenewalQuery(this.RenewalQuery);
                this.TotalRow = result["recordsFiltered"];
                this.NetPremiumFilteredRecords =
                  result["NetPremiumFilteredRecords"];
                this.TotalRenewalFilteredRecords =
                  result["TotalRenewalFilteredRecords"];
                this.NestedPagesList = result["NestedPagesList"];
              }

              if (this.dataAr.length > 0) {
                this.responseData = result["data"];

                this.post = this.post.concat(this.responseData);
                this.post = this.Removedatass(this.post);

                var keyss = 0;
                this.post = this.post.map((item) => {
                  keyss++;
                  item.SrNo = keyss;
                  return item;
                });

                var pagess = Math.ceil(this.post.length / 15);
                this.pageNo = pagess + 1;

                // this.pageNo++;
              } else {
                this.checkNoPageno = 0;
              }
            } else {
              $(".spinner-item").css("display", "none");
              $("#fillterSearchId").prop("disabled", false);

              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            $(".spinner-item").css("display", "none");
            $("#fillterSearchId").prop("disabled", false);

            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    } else {
      $("#fillterSearchId").prop("disabled", false);
    }
  }

  Sendmails(ids, expierydates, types) {
    var Conirms = confirm("Are you sure...!");

    if (Conirms == false) return;

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("SrTableId", ids);
    formData.append("MailType", types);

    formData.append("ToEmail", "");
    formData.append("CCEmail", "");
    formData.append("ToEmailCommaSeprated", "");
    formData.append("UserType", "");
    formData.append("Days", expierydates);

    this.api.IsLoading();

    this.api
      .HttpPostType("WebPolicyMailRenewalReminder/SendManualMail", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
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

  GetBulkCases(AgentName: string, AgentIds: string, types = "", page) {
    // this.DivshowAgent = 1;
    // this.api.IsLoading();
    // alert("GetBulkCases");
    // return false;
    this.scrollvas = 0;
    $(".spinner-item").css("display", "block");

    if (types == "click") {
      this.postNested = [];
    }

    if (types == "val") {
      this.postNested = [];
      this.pageNoNested = 1;
    }
    //  this.pagek

    this.AgentName = AgentName;
    this.AgentId = AgentIds;
    this.pageval = page;

    const formData = new FormData();
    formData.append("datas", this.filterData1);
    formData.append("AgentId", this.AgentId);
    // console.log(this.NestedPagesList);

    formData.append("NestedPagesListQuery", this.NestedPagesList);

    const dialogRef = this.dialog.open(AgentRenewalDetailsComponent, {
      disableClose: true,
      data: {
        AgentName: AgentName,
        AgentId: this.AgentId,
        types: types,
        page: page,
        datas: this.filterData1,
        NestedPagesListQuery: this.NestedPagesList,
        Types: "manager",
      },
      panelClass: "custom-dialog-container",
      backdropClass: "custom-backdrop", // Custom CSS class for styling the backdrop
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
    });

    // this.api.IsLoading();

    // this.api
    //   .HttpPostType(
    //     "/myaccount/girdDataNested?User_Id=" +
    //       this.api.GetUserData("Id") +
    //       "&User_Type=" +
    //       this.api.GetUserType() +
    //       "&PageType=Reports" +
    //       "&url=" +
    //       this.currentUrl +
    //       "&Page=" +
    //       this.pageval,
    //     formData
    //   )
    //   .then(
    //     (result: any) => {
    //       // this.api.HideLoading();

    //       if (result["status"] == true) {
    //         this.dataArNested = result["data"];
    //         this.responseDataNested = result["data"];
    //         this.postNested = this.postNested.concat(this.responseDataNested);

    //         this.pageNoNested++;

    //         var keysNested = 1;
    //         this.postNested = this.postNested.map((item) => {
    //           item.SrNo = keysNested;
    //           keysNested++;
    //           return item;
    //         });

    //         this.scrollvas = 1;
    //         $(".spinner-item").css("display", "none");
    //       } else {
    //         this.api.Toast("Warning", result["msg"]);
    //       }
    //     },
    //     (err) => {
    //       // this.api.HideLoading();
    //       this.api.Toast(
    //         "Warning",
    //         "Network Error : " + err.name + "(" + err.statusText + ")"
    //       );
    //     }
    //   );
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  GetUrl(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ChangeStatusRenewals1(e: any, Id: number) {
    var Values = e.target.value;
    if (Values == "") this.api.Toast("Warning", "Status is mandatory..!");
    else {
      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api
          .HttpGetType(
            "Myaccount/ChangeStatus?Page=User&User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Id=" +
              Id +
              "&Status=" +
              Values
          )
          .then(
            (result: any) => {
              if (result["status"] == true) {
                this.api.Toast("Success", result["msg"]);
                setTimeout(() => {
                  this.ResetDT();
                }, 500);
              } else {
                this.api.Toast("Warning", result["msg"]);
                setTimeout(() => {
                  this.router.navigate([result["data"]["Return"]]);
                }, 1000);
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
    }
  }

  CreateRenewalQuote(Quotation) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    var userType: any = this.api.GetUserType();
    formData.append("login_type", userType);

    formData.append("Quotation", Quotation);

    this.api.HttpPostType("Myaccount/RenewalQuoteMotor", formData).then(
      (result: any) => {
        // console.log(result);

        if (result["status"] == true) {
          this.QuoteToWeb(result["Url"]);

          // this.api.Toast("Success", result["msg"]);
          // this.buttonDisable = false;
        } else {
          this.buttonDisable = false;
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   Url;
    } else {
      if (GetUserType == "user") {
        GetUserType = "agent";
      }

      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
      //   Url;
    }
    a.click();
  }
  // QuoteToWeb(Url) {
  //   var UserDatas = this.api.GetUserData("Id");
  //   var GetUserType = this.api.GetUserType();

  //   let a = document.createElement("a");
  //   a.target = "_blank";
  //   if (GetUserType == "employee") {
  //     a.href = Url;
  //   } else {
  //     a.href = Url;
  //   }
  //   a.click();
  // }

  groupFollowupForm(Id: number, Action: string) {
    const dialogRef = this.dialog.open(
      RenewalfollowformwithagetgroupComponent,
      {
        width: "60%",
        height: "60%",
        data: { Id: Id, Status: "", Status2: "", ActionUser: "user" },
      }
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        $("#ClosePOUPUP").trigger("click");
      }, 500);
    });
  }

  ChangeStatusRenewals(e: any, Id: number, Action: string) {
    if (Action == "Button") {
      var Values = e;
    } else {
      var Values = e.target.value;
    }
    // var Values = e.target.value;
    var Values2 = 1;
    if (Values == "") {
    } else {
      const dialogRef = this.dialog.open(RenewalfollowformComponent, {
        width: "60%",
        height: "60%",
        data: { Id: Id, Status: Values, Status2: Values2, ActionUser: "user" },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        setTimeout(() => {
          this.Reload();
          $("#ClosePOUPUP").trigger("click");
          // console.log("works");
        }, 500);
      });
    }
  }

  DetailShowPopup(Id: number, Status: string) {
    const dialogRef = this.dialog.open(RenewalfollowdetailsComponent, {
      width: "60%",
      height: "60%",
      data: { Id: Id, Type: "User", Status: Status },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  CreateNewSr(row_Id: any, SrNo: any, lob: any): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result: any) => {
          if (result["Status"] == true) {
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/general-insurance/0/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web-renewal-" +
              lob +
              "-" +
              SrNo +
              "";
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }

  ChangeStatus(Type: any) {
    this.api.ChangeRenwalTabtype(Type);
  }

  SentMailDataRange() {
    var fields = this.SearchForm.value;

    var DateOrDateRange = fields["DateOrDateRange"];
    this.RangeButton = false;
    if (DateOrDateRange == "") {
      this.RangeButton = true;
      this.RangeButton2 = false;
      return false;
    } else {
      this.RangeButton2 = false;
      this.RangeButton = false;
    }

    var DateOrDateRange = fields["DateOrDateRange"];
    var ToDate, FromDate;
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var date1 = new Date(ToDate);
    var date2 = new Date(FromDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    // console.log(Difference_In_Days);
    if (Difference_In_Days > 29) {
      this.RangeButton2 = true;
      this.RangeButton = false;
      return false;
    } else {
      this.RangeButton2 = false;
      this.RangeButton = false;
    }

    const dialogRef = this.dialog.open(EmployeerenewalpopupComponent, {
      width: "50%",
      height: "50%",
      disableClose: true,
      data: { DateOrDateRange: DateOrDateRange },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  GetPolicyDetails(Type: any) {
    // const dialogRef = this.dialog.open(PolicydetailsComponent, {
    //   width: "70%",
    //   height: "70%",
    //   disableClose: true,
    //   data: { Id: Type },
    // });
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "75%",
      height: "75%",
      data: { Id: Type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  // GetPolicyDetails(Type: any) {
  //   const dialogRef = this.dialog.open(PolicydetailsComponent, {
  //     width: "70%",
  //     height: "70%",
  //     disableClose: true,
  //     data: { Id: Type },
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {});
  // }

  ChangeDateRanges(e: any) {
    if (e !== null) {
      this.SearchForm.get("Tab_Type").setValue("");
      this.Tab_Type_Display = true;
    }
  }

  SendRenewalsFromReports(Agent_Id, Agent_Code, Agent_Name, ids, Querys) {
    var explodes = Agent_Name.split("-");
    var Agent_Name_New = Agent_Code + "-" + explodes[0];
    var Arrays = [{ Id: Agent_Id, Name: Agent_Name_New }];

    // // console.log(Querys);
    // return false;

    var DateOrDateRange = this.api.SetDateRangeGet();

    $(".error_class_daterange").html("");
    if (DateOrDateRange == null) {
      $("#" + ids).html("Date Range is required");
      $("#" + ids).css({ color: "red" });

      return false;
    } else {
      $("#" + ids).html("");
      $("#" + ids).css({ color: "red" });
    }

    var ToDate, FromDate;
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var date1 = new Date(ToDate);
    var date2 = new Date(FromDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (Difference_In_Days > 30) {
      $("#" + ids).html("Only 30 days is allowed");
      $("#" + ids).css({ color: "red" });
      return false;
    } else {
      $("#" + ids).html("");
      $("#" + ids).css({ color: "red" });
    }
    let data_range = ToDate + "," + FromDate;
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("Users", JSON.stringify(Arrays));
    formData.append("UsersTypes", "Employee");
    formData.append("DateOrDateRange", data_range);
    formData.append("Querys", Querys);
    this.api.IsLoading();

    this.api
      .HttpPostType(
        "WebPolicyMailRenewalReminder/SendEmployeeRenewalEmails2",
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  SharedRenewalQuery(value: any) {
    this.api.RenewalQueryGet(value);
  }

  CommonFunctionRenewalCreate(Quotation, Typess, File_Type, RegNo, RegNoss) {
    var confirms = confirm("Are You Sure..!");

    if (confirms == true) {
      //true

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      var userType: any = this.api.GetUserType();
      formData.append("login_type", userType);

      formData.append("Quotation", Quotation);
      formData.append("RegNo", RegNo);
      formData.append("File_Type", File_Type);

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Myaccount/RenewalQuoteMotor2/quick/user/" + Typess,
          formData
        )
        .then(
          (result: any) => {
            //// console.log(result);

            if (result["status"] == true) {
              this.QuoteToWeb(result["Url"]);

              if (File_Type == "New") {
                this.Reload();
              }
            } else {
              this.buttonDisable = false;
              const msg = "msg";
              this.api.Toast("Warning", result["msg"]);
            }
            this.api.HideLoading();
          },
          (err) => {
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
            this.api.HideLoading();
          }
        );
    }
  }

  CreateQuickRenewalQuote(Quotation, Typess, File_Type, RegNoss) {
    if (File_Type == "New") {
      const dialogRef = this.dialog.open(RenewalnewgadiComponent, {
        width: "50%",
        height: "50%",
        disableClose: true,
        data: { RegNoss: RegNoss },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        //// console.log(result.RegNo+' '+result.HitTypes);
        if (result.HitTypes == 1) {
          this.CommonFunctionRenewalCreate(
            Quotation,
            Typess,
            File_Type,
            result.RegNo,
            RegNoss
          );
        }
      });
    } else
      this.CommonFunctionRenewalCreate(
        Quotation,
        Typess,
        File_Type,
        "",
        RegNoss
      );
  } //true

  CreateNewQuoteofflinePolicy(SrId, FileType, RegNo, ProductType) {
    const dialogRef = this.dialog.open(RenewalonlinequoteCreationComponent, {
      width: "50%",
      height: "50%",
      disableClose: true,
      data: {
        SrId: SrId,
        FileType: FileType,
        RegNo: RegNo,
        ProductType: ProductType,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  } //true

  showRenewalNotoces(Id: number) {
    const dialogRef = this.dialog.open(RenewalnoticeComponent, {
      width: "38%",
      height: "60%",
      disableClose: true,
      data: { Id: Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  CreateOfflineQuote(Srid) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    var userType: any = this.api.GetUserType();
    formData.append("login_type", userType);

    formData.append("Srid", Srid);

    this.api
      .HttpPostType("Offlinequote/CraeteRenewalOfflineQuote", formData)
      .then(
        (result: any) => {
          // console.log(result);
          // alert();

          if (result["status"] == true) {
            // this.api.Toast("Success", result["msg"]);
            // this.buttonDisable = false;
          } else {
            this.buttonDisable = false;
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== SR POPUP =====//
  SrPopup(type, row_Id): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result: any) => {
          if (result["Status"] == true) {
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/general-insurance/" +
              type +
              "/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web";
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }

  ShowMaskingField(i) {
    this.MaskingAgentMobile = i;
  }
}
