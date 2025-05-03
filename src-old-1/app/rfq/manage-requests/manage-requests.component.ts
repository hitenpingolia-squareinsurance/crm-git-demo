import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { RfqViewModelComponent } from "../rfq-view-model/rfq-view-model.component";

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

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
  AssignUsertype: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterData: any;
}

@Component({
  selector: "app-manage-requests",
  templateUrl: "./manage-requests.component.html",
  styleUrls: ["./manage-requests.component.css"],
})
export class ManageRequestsComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  ActionType: any = "";

  isSubmitted = false;
  buttonDisable = false;

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
  QuoteTypesVal: { Id: string; Name: string }[];
  currentUrl: string;
  dataArrr: any;
  urlSegment: string;
  Url: string;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUrl = this.router.url;
    this.urlSegment = this.router.url;
    //   //   //   console.log("CurrentUrl:", this.currentUrl);
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.Url = splitted[1];
      //   //   //   console.log("Extracted id:", this.Url);
    }

    this.SearchForm = this.fb.group({
      // Lob:[''],
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
    this.currentUrl = this.router.url;
    this.Get();
    // this.GetProducts();
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

  //===== RELOAD =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.dataAr = [];
  }
  reset() {
    this.SearchForm.reset();
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

            that.dataAr = resp.data;
            that.FilterDatatype = resp.FilterData;
            // this.Reload();
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

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.SearchData(Event);
    this.QuoteTypesVal = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  AcceptAssignQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Rfq/AcceptAssignQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation_Id
        )
        .then(
          (result: any) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.RequestedQuote = result["data"];
              this.api.Toast("Success", result["msg"]);
              this.Reload();
              this.Get();
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

  ViewOfflineQuoteDetails(QuotationId: any) {
    const dialogRef = this.dialog.open(RfqViewModelComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { id: QuotationId },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
