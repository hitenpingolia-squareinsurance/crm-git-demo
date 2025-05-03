import { DataTableDirective } from "angular-datatables";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { NgZone } from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";

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
  selector: "app-viev-emp-doc-request",
  templateUrl: "./viev-emp-doc-request.component.html",
  styleUrls: ["./viev-emp-doc-request.component.css"],
})
export class VievEmpDocRequestComponent implements OnInit {
  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;
  UploadRemark: FormGroup;

  ActionType: any = "";
  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;
  url: string;
  urlSegment: string;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;
  re_hit: any = "yes";
  active_tab: any = "Pending";
  loading: boolean;
  totalRecordsfiltered: any;
  TotalRow: any;
  filterData: string;
  Type: any;
  IDs: any;
  status: any;
  className: string;
  QuoteTypes: { Id: string; Name: string }[];
  statusData: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];

  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  // login_userId: any;

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

    this.UploadRemark = this.formBuilder.group({
      remark: ["", Validators.required],
    });

    this.SearchForm = this.formBuilder.group({
      QuoteType: [""],
      status: [""],
      SearchValue: [""],
    });

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
      allowSearchFilter: true,
    };

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];

    this.statusData = [
      { Id: "Pending", Name: "Pending" },
      { Id: "Approve", Name: "Approve" },
      { Id: "Deny", Name: "Deny" },
    ];
  }

  ngOnInit() {
    this.Get();
    // this.login_userId = this.api.GetUserData("Id");
    this.QuoteTypeVal = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  // SearchData(event: any) {

  //   this.filterData = JSON.stringify(event);

  //   this.active_tab = event['tab_name'];

  //   this.post = [];
  //   this.pageNo = 1;

  //   this.Get();
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  // }

  SearchData() {
    var fields = this.SearchForm.value;

    var query = {
      QuoteType: fields["QuoteType"],
      status: fields["status"],
      SearchValue: fields["SearchValue"],
    };

    this.filterData = JSON.stringify(query);

    // dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();

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

  Remark(type: any, id: any, Status: any) {
    this.Type = type;
    this.IDs = id;
    this.status = Status;
  }

  get formControls() {
    return this.UploadRemark.controls;
  }

  submitRemark() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.UploadRemark.invalid) {
      return;
    } else {
      var fields = this.UploadRemark.value;
      const formData = new FormData();

      formData.append("remark", fields["remark"]);
      formData.append("id", this.IDs);
      formData.append("type", this.Type);
      formData.append("status", this.status);

      this.api.IsLoading();

      this.api.HttpPostType("Profile/DocsStatus", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            document.getElementById("closeModel").click();

            this.ResetDT();
            this.Reload();
            // this.SearchData('');
            this.Get();
            this.api.Toast("Success", result["msg"]);
            // this.router.navigate(["/Assets/Products"]);
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

  Get() {
    this.re_hit = "no";
    const formData = new FormData();
    formData.append("datas", this.filterData);

    // formData.append('datas', this.SearchForm.value);
    this.api
      .HttpPostType(
        "/Profile/ViewDocsRequest?User_Id=" +
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
        (result: any) => {
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
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", Id);
    formData.append("type", type);

    this.api.IsLoading();
    this.api.HttpPostType("Profile/Accept", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.ResetDT();
          this.Reload();
          // this.SearchData('');
          this.Get();
          // this.addtoolForm.patchValue(this.dataArr);

          // this.api.Toast("Success", result["msg"]);
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

  ProfileApproveDeny(type: any, Id: any, status: any) {
    if (type == "Approve") {
      var confirms = confirm(
        "Are You Sure You want to approve this request..!"
      );
    } else {
      var confirms = confirm("Are You Sure You want to deny this request..!");
    }

    if (confirms == true) {
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("id", Id);
      formData.append("type", type);
      formData.append("status", status);

      this.api.IsLoading();
      this.api.HttpPostType("Profile/DocsStatus", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();
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

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
}
