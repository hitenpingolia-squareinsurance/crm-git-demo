import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ChangeDetectionStrategy, AfterViewInit, NgZone } from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";

import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

import { ContestPopupComponent } from "../contest-popup/contest-popup.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Category: string;
  Date: string;
  Image: string;
  Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-contest",
  templateUrl: "./view-contest.component.html",
  styleUrls: ["./view-contest.component.css"],
})
export class ViewContestComponent implements OnInit {
  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  // searchform: FormGroup;
  // isSubmitted = false;
  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;
  login_userId: any;
  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;
  re_hit: any = "yes";
  active_tab: any = "Pending";
  loading: boolean;
  totalRecordsfiltered: any;
  TotalRow: any;
  login_user_type: any;
  // active tab value
  activeCheck: string = "1";
  contestfor: string = "";
  UserType: any;
  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.login_user_type = this.api.GetUserType();
  }

  ngOnInit() {
    this.Get();
    this.login_userId = this.api.GetUserData("Id");
    this.UserType = this.api.GetUserType();
    // this.getRadioValueOnLoad();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  ResetDT() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
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

  Get1() {
    // alert(this.api.GetUserData("type"));
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
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
              environment.apiUrl +
                "/contest/contest_view?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&ContestType=" +
                this.activeCheck +
                "&ContestFor=" +
                this.contestfor
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);
            if (that.dataAr.length > 0) {
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  Get() {
    this.re_hit = "no";
    const formData = new FormData();
    // formData.append("datas", this.filterData);

    this.api
      .HttpPostType(
        "/contest/contest_view?User_Id=" +
          this.api.GetUserData("Id") +
          "&user_code=" +
          this.api.GetUserData("Code") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Page=" +
          this.pageNo +
          "&ContestType=" +
          this.activeCheck +
          "&ContestFor=" +
          this.contestfor,
        formData
      )
      .then(
        (result) => {
          this.re_hit = "yes";
          this.loading = true;

          if (result["status"] == true) {
            // alert(121);
            this.dataAr = result["data"];
            // console.log(this.dataAr);
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

  AddContest(type: any, id: any) {
    const dialogRef = this.dialog.open(ContestPopupComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { type: type, id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.ResetDT();
      this.Get();
    });
  }

  //Delete REQUEST

  DeleteRequest(DeleteId: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", DeleteId);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("contest/DeletePoster", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();
            this.Get();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
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
  }

  //Active Inactive REQUEST

  ActiveInactive(Id: any, Status: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", Id);
      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("contest/UpdateActiveInactive", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();
            this.Get();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
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
  }

  onRadioChange(event) {
    this.ResetDT();
    this.Get();
  }
  onButtonChange(event) {
    this.activeCheck = event;
    this.ResetDT();
    this.Get();
  }
}
