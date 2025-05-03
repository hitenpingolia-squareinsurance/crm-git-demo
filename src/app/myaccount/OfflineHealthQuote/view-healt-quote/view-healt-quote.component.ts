import { QuotationComponent } from "./../../quotation/quotation.component";
import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from "@angular/forms";

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewHealthOfflineDetailsComponent } from "../../../modals/view-health-offline-details/view-health-offline-details.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  Quotation_Id: string;
  Company: string;
  QuoteDetails: string;
  CreateDate: string;
  Vehicle_No: string;
  ProductName: string;
  Action: string;
  BusniessType: string;
  CustomerName: string;
  CustomerMobile: string;
  CustomerEmail: string;
  AssignUser: string;
  RejectedStatus: any;
  Status: string;
  Creator_Details: string;
  Punching_team: string;
  Account_team: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  Sql: any;
  recordsFiltered: number;
  recordsTotal: number;
  rights: any;
}

@Component({
  selector: "app-view-healt-quote",
  templateUrl: "./view-healt-quote.component.html",
  styleUrls: ["./view-healt-quote.component.css"],
})
export class ViewHealtQuoteComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  searchForm: FormGroup;
  ActionType: any = "";

  isSubmitted = false;

  dropdownSettingsGlobelLOB: any = {};
  dropdownSettingsBusniessType: any = {};
  dropdownSettingsType: any = {};
  PolicyFileType: any;
  ProductType: any;
  PolicyType: any;
  QuotesStatus: { Id: string; Name: string }[];
  QuoteTypes: { Id: string; Name: string }[];
  dropdownSingleSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownMultiSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  RequestedQuote: any;
  FilterDatatype: any;
  currentUrl: string;
  filterFormData: any;
  loginid: any;
  TatTable: any;
  RightsManu: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.Get();

    this.loginid = this.api.GetUserData("Id");

    this.api.TargetComponent.subscribe(
      (page) => {
        if (page == "offline_quotation" || page == "offline_quotation") {
          this.Reload();
        }
      },
      (err) => {}
    );
  }

  //===== RELOAD =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== FILTER DATA =====//
  SearchData(event: any) {
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

  //===== GET DATATABLE DATA =====//
  Get() {
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
                "/Offlinehealthquote/QuotationDataFetch?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&source=Web&PageType=ManageRequests" +
                "&Manege_request=Manege_request" +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            if (that.dataAr.length > 0) {
              // this.GetOfflineQuoteDataDayAndHourWise(resp.Sql);
              that.dataAr = resp.data;
              //   //   //   console.log(that.dataAr);
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

  GetOfflineQuoteDataDayAndHourWise(Sql: any) {
    const formData = new FormData();

    formData.append("Sql", Sql);

    // if (confirm("Are you sure !") == true) {
    this.api.IsLoading();
    this.api
      .HttpPostType(
        "Offlinehealthquote/GetOfflineQuoteDataDayAndHourWise?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.TatTable = result["data"];
          } else {
            this.api.Toast("Warning", result["msg"]);
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
    // }
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.searchForm.reset();
    this.Get();
    // this.Is_Export = 0;
    this.ResetDT();
  }

  //===== Reset FILTER =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== Health Offline View Details Model Open =====//
  ViewHealthOfflineDetails(QuotationId: any) {
    const dialogRef = this.dialog.open(ViewHealthOfflineDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: QuotationId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== Accept Punching Team Quote =====//
  AcceptPunchingTeamQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Offlinehealthquote/AcceptPunchingTeamQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation_Id
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              // this.RequestedQuote = result["data"];
              // // this.SearchBtn();
              this.api.Toast("Success", result["msg"]);

              this.Reload();
            } else {
              this.api.Toast("Warning", result["msg"]);
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

  //===== Accept Account Team Quote =====//
  AcceptAccountTeamQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Offlinehealthquote/AcceptAccountTeamQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation_Id
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              // this.RequestedQuote = result["data"];
              // // this.SearchBtn();
              this.api.Toast("Success", result["msg"]);

              this.Reload();
            } else {
              this.api.Toast("Warning", result["msg"]);
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

  //===== Approved AccountTeam  Quote=====//
  ApprovedAccountTeam(id: any, Quotation: any) {
    const formData = new FormData();
    formData.append("id", id);
    //   //   //   console.log(id, Quotation);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Offlinehealthquote/ApprovedAccountTeam?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation,
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.RequestedQuote = result["data"];
              this.api.Toast("Success", result["msg"]);
              this.Reload();
            } else {
              this.api.Toast("Warning", result["msg"]);
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

  //===== Reject Account Team  Quote=====//
  RejectAccountTeam(id: any, Quotation: any) {
    const formData = new FormData();
    formData.append("id", id);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Offlinehealthquote/RejectAccountTeam?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation,
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.RequestedQuote = result["data"];
              this.api.Toast("Success", result["msg"]);
              this.Reload();
            } else {
              this.api.Toast("Warning", result["msg"]);
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

  //===== SR Popup Open =====//
  SrPopup(type, row_Id): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result) => {
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
}
