import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from "../../providers/api.service";
import { MatDialogRef } from "@angular/material/dialog";

// table 
import { DataTableDirective } from "angular-datatables";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";

import { Router, ActivatedRoute } from "@angular/router";
import { NgZone } from "@angular/core";

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
  selector: 'app-view-manager-request',
  templateUrl: './view-manager-request.component.html',
  styleUrls: ['./view-manager-request.component.css']
})
export class ViewManagerRequestComponent implements OnInit {
  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ViewType: any;
  post: Array<any> = [];
  pageNo: any = 1;

  // new 
  loadAPI: Promise<any>;
  ActionType: any = "";
  dtElements: any;
  isSubmitted = false;
  Is_Export: number;
  url: string;
  urlSegment: string;
  responseData: any;
  re_hit: any = 'yes';
  active_tab: any = "Pending";
  loading: boolean;
  totalRecordsfiltered: any;
  TotalRow: any;
  filterData: string;
  ReqType: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService, private dialogRef: MatDialogRef<ViewManagerRequestComponent>,
    private ngZone: NgZone,
    private router: Router,) {
    this.ViewType = this.data.id;
    this.ReqType = this.data.type;
  }

  ngOnInit() {
    this.Get();
    this.urlSegment = 'manager_request';
  }

  // ClearSearch() {
  //   var fields = this.SearchForm.reset();
  //   this.Is_Export = 0;
  // }

  // SearchData(event: any) {
  //   this.filterData = JSON.stringify(event);
  //   this.active_tab = event['tab_name'];
  //   this.post = [];
  //   this.pageNo = 1;
  //   this.Get();
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  // }


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
            if (this.re_hit == 'yes') {
              this.Get();
            }
          });
        });
    });
  }

  Get() {
    this.re_hit = 'no';
    const formData = new FormData();
    // formData.append("datas", this.filterData);
    formData.append('datas', this.filterData);
    this.api
      .HttpPostType(
        "/Meeting_request/Viewrequest?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&Page=" +
        this.pageNo
        + "&url=" + 'manager_request'
        + "&RequestType=" + this.ReqType
        + "&meeting_topic=" + this.ViewType,
        formData
      )
      .then(
        (result) => {
          this.re_hit = 'yes';
          this.loading = true;

          if (result["status"] == true) {
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
            this.loading = false;

          }
          else {
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
        } else {
          const msg = "msg";
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
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }
  CloseModel() {
    this.dialogRef.close();
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }
}//end
