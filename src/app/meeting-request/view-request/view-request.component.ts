import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { ChangeDetectionStrategy, AfterViewInit, NgZone } from "@angular/core";

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewManagerRequestComponent } from "../view-manager-request/view-manager-request.component";
class ColumnsObj {
  SrNo: string;
  id: string;
  Name: string;
  Category: string;
  Item: string;
  Create_date: string;
  Ins_type: string;
  CompanyName: string;
  Email: string;
  Mobile: string;
  City: string;
  Insertdate: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}
@Component({
  selector: "app-view-request",
  templateUrl: "./view-request.component.html",
  styleUrls: ["./view-request.component.css"],
})
export class ViewRequestComponent implements OnInit {
  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  loadAPI: Promise<any>;
  ActionType: any = "";
  dtElements: any;
  SearchForm: FormGroup;
  isSubmitted = false;
  Is_Export: number;
  url: string;
  urlSegment: any;
  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;
  re_hit: any = "yes";
  active_tab: any = "Pending";
  loading: boolean;
  totalRecordsfiltered: any;
  TotalRow: any;
  filterData: string;
  RequestType: any;
  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.url = this.router.url;
    var splitted = this.url.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }
  }

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  // Reload() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     var pageinfo = dtInstance.page.info().page;
  //     //dtInstance.draw();
  //     dtInstance.page(pageinfo).draw(false);
  //   });
  // }

  // ResetDT() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.search("").column(0).search("").draw();
  //   });
  // }

  // //===== SEARCH DATATABLE DATA =====//
  // SearchData(event: any) {
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     var TablesNumber = `${dtInstance.table().node().id}`;

  //     if (TablesNumber == "Table1") {
  //       dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
  //     }
  //   });
  // }

  SearchData(event: any) {
    this.filterData = JSON.stringify(event);
    if (this.urlSegment == "manager_request") {
      if (this.filterData == undefined || this.filterData == "undefined") {
        this.RequestType = "Raise Request";
      } else {
        var parsedFilterData = JSON.parse(this.filterData);
        //   //   //   console.log(parsedFilterData);
        this.RequestType = parsedFilterData.QuoteType[0]["Id"];
      }
    }
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

  Get() {
    this.re_hit = "no";
    const formData = new FormData();
    // formData.append("datas", this.filterData);
    formData.append("datas", this.filterData);
    this.api
      .HttpPostType(
        "/Meeting_request/ViewMeetingRequest?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Page=" +
          this.pageNo +
          "&url=" +
          this.urlSegment,
        formData
      )
      .then(
        (result) => {
          this.re_hit = "yes";
          this.loading = true;
          if (result["status"] == true) {
            this.dataAr = result["data"];
            //   //   //   console.log(this.dataAr);
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
            this.loading = false;
          } else {
            this.loading = false;
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

  AcceptManager(type: any, Id: any) {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", Id);
    formData.append("type", type);
    this.api.IsLoading();
    this.api.HttpPostType("Meeting_request/Accept", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.ResetDT();
          // this.addtoolForm.patchValue(this.dataArr);
          // this.api.Toast("Success", result["msg"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }
  //yuvraj
  ViewReq(id: any) {
    let type = "";
    //   //   //   console.log(this.filterData);
    if (this.filterData == undefined || this.filterData == "undefined") {
      type = "Raise Request";
    } else {
      var parsedFilterData = JSON.parse(this.filterData);
      //   //   //   console.log(parsedFilterData);
      type = parsedFilterData.QuoteType[0]["Id"];
    }
    // QuoteType
    const dialogRef = this.dialog.open(ViewManagerRequestComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { id: id, type: type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.ResetDT();
      this.Get();
    });
  }
}
