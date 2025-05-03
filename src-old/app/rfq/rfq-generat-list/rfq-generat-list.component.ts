import { Component, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { RfqViewModelComponent } from "../rfq-view-model/rfq-view-model.component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { RejectquoteComponent } from "src/app/myaccount/OfflineQuote/rejectquote/rejectquote.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterData: any;
  datas: ColumnsObj[];
  CustomerDetail: ColumnsObj[];
}

@Component({
  selector: "app-rfq-generat-list",
  templateUrl: "./rfq-generat-list.component.html",
  styleUrls: ["./rfq-generat-list.component.css"],
})
export class RfqGeneratListComponent implements OnInit {
  [x: string]: any;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;
  @ViewChild("scroller1", { static: false })
  scroller1: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  // FilterData: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  SendmailForm: FormGroup;
  buttonDisable = false;

  //selected
  ItemLOBSelection: any = [];
  minDate: Date;
  maxDate: Date;
  financialYearVal: { Id: string; Name: string }[];
  Login_Type: string | null;
  videourl: any;
  ActionType: string;
  results: any;
  currentUrl: string;
  urlSegment: string;
  FilterDatatype: any;
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    public fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Type: [""],
      DateOrDateRange: [""],
      BusniessType: [""],
      PolicyType: [""],
      Product_Type: [""],
      QuotesStatus: [""],
      SearchValue: [""],
      QuoteType: ["", [Validators.required]],
    });

    this.dropdownSingleSelect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownMultiSelect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.ProductType = [
      { Id: "1", Name: "Bike" },
      { Id: "2", Name: "Private Car" },
      { Id: "3", Name: "Pcv" },
      { Id: "4", Name: "Gcv" },
      { Id: "5", Name: "MISC-D" },
    ];
    this.PolicyType = [
      { Id: "1", Name: "Comprehensive" },
      { Id: "2", Name: "Third Party" },
      { Id: "3", Name: "Saod" },
    ];
    this.PolicyFileType = [
      { Id: "New", Name: "New" },
      { Id: "Rollover", Name: "Rollover" },
      { Id: "Used", Name: "Used" },
    ];
    this.QuotesStatus = [
      { Id: "1", Name: "Quote Requested" },
      { Id: "2", Name: "Quotes Released" },
      { Id: "3", Name: "Quotes Accepted" },
      {
        Id: "4",
        Name: "Payment URL Shared / Payment For Cheque / Payment For Cash",
      },
      { Id: "5", Name: "Pending For Approval" },
      { Id: "6", Name: "Complete" },
      { Id: "0", Name: "Rejected" },
    ];
    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.QuoteTypesVal = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  ngOnInit(): void {
    this.Get();
    this.ResetDT();

    this.currentUrl = this.router.url;
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      this.buttonDisable = false;

      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          dtElement.dtInstance.then((dtInstance: any) => {
            var TablesNumber = `${dtInstance.table().node().id}`;
            if (TablesNumber == "Table1") {
              var fields = this.SearchForm.value;
              var DateOrDateRange = fields["DateOrDateRange"];
              var ToDate, FromDate;
              if (DateOrDateRange) {
                ToDate = DateOrDateRange[0];
                FromDate = DateOrDateRange[1];
              }
              var query = {
                User_Id: this.api.GetUserData("Id"),
                User_Type: this.api.GetUserType(),

                SearchValue: fields["SearchValue"],
                Product_Type: fields["Product_Type"],
                BusniessType: fields["BusniessType"],
                PolicyType: fields["PolicyType"],
                QuotesStatus: fields["QuotesStatus"],
                QuoteType: fields["QuoteType"],

                To_Date: this.api.StandrdToDDMMYYY(ToDate),
                From_Date: this.api.StandrdToDDMMYYY(FromDate),
              };
              //   //   //   console.log(query);

              dtInstance
                .column(0)
                .search(this.api.encryptText(JSON.stringify(query)))
                .draw();
            }
          });
        }
      );
    }
  }

  //===== CLEAR DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.SearchData(Event);
    this.QuoteTypesVal = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  //===== RELOAD =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.post = [];
    this.pageNo = 1;
  }
  reset() {
    this.SearchForm.reset();
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

  //===== GET ALL DATA DATATABLE FUNCTION =====//
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
                "/Rfq/QuotationDataFetch?User_Id=" +
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
            this.buttonDisable = false;

            that.dataAr = resp.CustomerDetail;
            that.dataA = resp.data;
            //   //   //   console.log(that.dataAr);
            //   //   //   console.log(that.dataA);
            that.FilterDatatype = resp.FilterData;

            if (that.dataA.length > 0) {
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

  AcceptAssignQuote(id: any, status_man: any) {
    var confirms = confirm("Aru You Sure..?");
    if (confirms == true) {
      const formData = new FormData();
      formData.append("status_man", status_man);
      formData.append("id", id);
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Name", this.api.GetUserData("Name"));
      formData.append("User_Type", this.api.GetUserData("Type"));

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Rfq/UpdateRfqGenerate?Url=" +
            this.urlSegment +
            "&User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&PageType=Reports",
          formData
        )
        .then(
          (result: any) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.Reload();

              this.dataAr = result["Data1"];
              //  this.dataArr = result['Data2'];
              //  //   //   console.log(this.dataAr);
              //  //   //   console.log(this.dataArr);
            } else {
              this.api.HideLoading();
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

  AcceptPunchingTeamQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Rfq/AcceptPunchingTeamQuote?User_Id=" +
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

  AcceptAccountTeamQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Rfq/AcceptAccountTeamQuote?User_Id=" +
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

  ApprovedAccountTeam(id: any, Quotation: any) {
    const formData = new FormData();
    formData.append("id", id);
    //   //   //   console.log(id, Quotation);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Rfq/ApprovedAccountTeam?User_Id=" +
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

  ViewOfflineQuoteDetails(row_Id): void {
    const dialogRef = this.dialog.open(RfqViewModelComponent, {
      width: "95%",
      height: "90%",
      disableClose: true,
      data: { id: row_Id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }

  RejectAccountTeam(id: any, Quotation: any) {
    const formData = new FormData();
    formData.append("id", id);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Rfq/RejectAccountTeam?User_Id=" +
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

  RejectedQuoteModel(QUOTE: any) {
    const dialogRef = this.dialog.open(RejectquoteComponent, {
      width: "45%",
      height: "45%",
      disableClose: true,
      data: { Id: QUOTE },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

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
}
