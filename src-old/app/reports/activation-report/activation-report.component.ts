import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FollowUpReportComponent } from "../../modals/follow-up-report/follow-up-report.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PrimerejectdetailspopupComponent } from "../../modals/primerejectdetailspopup/primerejectdetailspopup.component";
import { AddprimerequestpopupComponent } from "../../modals/addprimerequestpopup/addprimerequestpopup.component";
import { GemsDetailsViewRemarkComponent } from "../../modals/gems-details-view-remark/gems-details-view-remark.component";
import { ViewgemsdetailspopupComponent } from "../../modals/viewgemsdetailspopup/viewgemsdetailspopup.component";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { PosDetailsComponent } from "../../modals/pos-details/pos-details.component";
import { PoliciesDataComponent } from "../../modals/policies-data/policies-data.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Status: any;
  Name: any;
  AgentId: any;
  Email: string;
  Mobile_No: string;
  Employee: any;
  Busniess: string;
  Totalpolicy: string;
  LastLogin: string;
  LastModifiedDate: string;
  CreateDate: string;
  NetPremium: string;
  TotalPolicy: string;
  LastPolicyDate: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalPos: number;
  StatusActiveInactive: string = "";
  percetage: string;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-activation-report",
  templateUrl: "./activation-report.component.html",
  styleUrls: ["./activation-report.component.css"],
})
export class ActivationReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  filterData1: string;
  filterData: string;

  post1: Array<any> = [];
  pageNo1: any = 1;
  pageval: string;
  scroll: string;
  scrollvas: number;
  TotalRenewalFilteredRecords: any;
  LastPageId: number = 0;
  checkNoPageno: number = 1;

  ActivePage: string = "Default";
  SearchForm: FormGroup;
  isSubmitted = false;

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;
  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  postNested: Array<any> = [];
  responseDataNested: any;

  //selected
  currentUrl: string;
  PageType: string;
  urlSegment: string;
  Total: number;
  TotalPos: any;
  StatusActiveInactive: any = "";
  percetage: any;
  urlSegmentRoot: string;
  dataArToDate: string;
  dataArFromDate: string;

  ngZone: any;
  re_hit: string;
  totalRecordsfiltered: any;
  FilterDatatype: any;
  RenewalQuery: any;
  TotalRow: any;
  NetPremiumFilteredRecords: any;
  NestedPagesList: any;
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({});
    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page);
        if (page == "Prime" || page == "Prime") {
          this.Get();
        }
      },
      (err) => {}
    );
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (this.urlSegment == "active-inactive-pos-reports") {
      this.PageType = "Reports";
    } else {
      this.PageType = "";
    }
  }

  ngAfterViewInit(): void {
    this.api.data1$.subscribe((data) => {
      this.dataAr = [];
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

  Removedatass(books: any) {
    // var filterArray = books.reduce((accumulator, current) => {
    //   if (!accumulator.some((item) => item.FullSRNo === current.FullSRNo)) {
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
    this.LastPageId = this.pageNo;

    const formData = new FormData();

    $(".spinner-item").css("display", "block");

    formData.append("datas", this.filterData);

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
          this.pageNo,
        formData
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            $("#fillterSearchId").prop("disabled", false);

            // alert();

            this.dataAr = result["data"];
            $(".spinner-item").css("display", "none");

            if (this.pageNo <= 1) {
              this.totalRecordsfiltered = result["recordsFiltered"];
              this.FilterDatatype = result["FilterData"];
              this.RenewalQuery = result["RenewalQuery"];
              this.TotalRow = result["recordsFiltered"];
              this.NetPremiumFilteredRecords =
                result["NetPremiumFilteredRecords"];
              this.TotalRenewalFilteredRecords =
                result["TotalRenewalFilteredRecords"];
              this.NestedPagesList = result["NestedPagesList"];
            }

            this.responseData = result["data"];

            if (this.dataAr.length > 0) {
              this.post = this.post.concat(this.responseData);
              this.post = this.Removedatass(this.post);
              var keyss = 0;
              this.post = this.post.map((item) => {
                keyss++;
                item.SrNo = keyss;
                return item;
              });

              var pages = Math.ceil(this.post.length / 15);
              this.pageNo = pages + 1;
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
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.filterData = JSON.stringify(event);
    this.post = [];
    this.pageNo = 1;
    this.LastPageId = 0;
    this.checkNoPageno = 1;

    $("#fillterSearchId").prop("disabled", true);

    this.FilterDatatype = [];
    this.TotalRenewalFilteredRecords = 0;
    this.NetPremiumFilteredRecords = 0;
    this.Get();

    this.Is_Export = 0;
    this.dataAr = [];
  }

  Reload() {
    this.post = [];
    this.checkNoPageno = 1;
    this.pageNo = 1;
  }

  ResetDT() {
    this.post = [];
    this.checkNoPageno = 1;
    this.pageNo = 1;
  }
}
