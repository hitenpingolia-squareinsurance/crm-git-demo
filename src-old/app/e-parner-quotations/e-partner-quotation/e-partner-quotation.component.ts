import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  NgZone,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { OfflineQuoteDetailsComponent } from "../../modals/offline-quote-details/offline-quote-details.component";
import { Router, ActivatedRoute } from "@angular/router";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";

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
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  Total: any[];
  total: any[];
  totalRecords: any;
  Data: any[];
}

@Component({
  selector: "app-e-partner-quotation",
  templateUrl: "./e-partner-quotation.component.html",
  styleUrls: ["./e-partner-quotation.component.css"],
})
export class EPartnerQuotationComponent implements OnInit, AfterViewInit {
  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[] = [];
  SearchForm: FormGroup;
  Company: any = [];
  Is_Export: any = 0;
  currentUrl: string;
  Total: any[];
  totalRecords: any;
  totalQuotationIds: number = 0;
  Net_premium: any;
  PaymentStatus: any;
  Conversion: any;
  isSearched = false;

  row: any;
  Id: any;
  urlSegments: string;
  DataAr: any = [];
  Agent_Id: any;
  FilterData: any;
  AgentCode: any;
  LastPageId: number = 0;
  checkNoPageno: number = 1;
  totalRecordsfiltered: any;
  FilterDatatype: any;
  RenewalQuery: any;
  TotalRow: any;
  NetPremiumFilteredRecords: any;
  TotalRenewalFilteredRecords: any;
  NestedPagesList: any;
  post: any[] = [];
  responseData: any[] = [];
  AgentId: any;
  encodedId: any;
  total: number;
  apiUrl: string;
  dtInstance: any;

  pageNumbers: { [key: string]: number } = {
    business: 1,
    "offline-quote": 1,
    claims: 1,
    gems: 1,
    renewal: 1,
  };
  re_hit: string = "yes";
  loading: boolean = false;
  Filter: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    public formBuilder: FormBuilder,
    public ActivatedRoute: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.SearchForm = this.formBuilder.group({
      Lob: [""],
      DateOrDateRange: [""],
      FinancialYear: [""],
      PolicyFileType: [""],
      SearchValue: [""],
    });
  }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe((params) => {
      this.encodedId = params.get("id");
      const decodedId = atob(this.encodedId);
      this.Id = decodedId;
    });

    this.Tab_change();
    this.GetSinglePosDetails(this.Id);
  }
  Tab_changeNew() {
    let newurl = this.urlSegments;
    this.Tab_change();
    this.dataAr = [];
    this.post = [];
    this.pageNumbers[newurl] = 1;

    //  this.ResetDT();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  ClearSearch() {
    // alert(123);
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  ResetDT() {
    this.Is_Export = 0;
    this.SearchForm.reset();
    this.pageNumbers[this.urlSegments] = 1;
    this.post = [];
  }

  Reload() {
    this.post = [];
    this.pageNumbers[this.urlSegments] = 1;
    this.Get();
  }

  SearchData(event: any) {
    this.Is_Export = 0;
    this.Filter = JSON.stringify(event);
    this.pageNumbers[this.urlSegments] = 1;
    // this.post = [];
    // this.Get();
    this.Tab_changeNew();
    //   //   //   console.log(this.Filter);
  }

  ngAfterViewInit(): void {
    this.api.data1$.subscribe(() => {
      this.post = [];
      this.pageNumbers[this.urlSegments] = 1;
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
            if (this.re_hit === "yes") {
              this.Tab_change();
            }
          });
        });
    });
  }

  Tab_change(): void {
    this.currentUrl = this.router.url;
    this.urlSegments = this.router.url.split("/")[4];

    switch (this.urlSegments) {
      case "business":
        this.apiUrl =
          environment.apiUrl +
          "/Epartner/BusinessQuotations?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&SectionUrl=" +
          this.urlSegments +
          "&Id=" +
          this.Id +
          "&Page=" +
          this.pageNumbers.business;
        break;
      case "offline-quote":
        this.apiUrl =
          environment.apiUrl +
          "/Epartner/OfflineQuotation?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&SectionUrl=" +
          this.urlSegments +
          "&Id=" +
          this.Id +
          "&Page=" +
          this.pageNumbers["offline-quote"];
        break;
      case "claims":
        this.apiUrl =
          environment.apiUrl +
          "/Epartner/Claims?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&SectionUrl=" +
          this.urlSegments +
          "&Id=" +
          this.Id +
          "&Page=" +
          this.pageNumbers.claims;
        break;
      case "gems":
        this.apiUrl =
          environment.apiUrl +
          "/PrimeAgent/GemsViewDetails?Agent_Id=" +
          btoa(this.Id) +
          "&Login_Id=" +
          this.api.GetUserData("Id") +
          "&Session_Year=" +
          "2023-24" +
          "&Login_User_Id=" +
          this.api.GetUserData("Id") +
          "&Login_User_Type=" +
          this.api.GetUserType() +
          "&SectionUrl=" +
          this.urlSegments +
          "&Page=" +
          this.pageNumbers.gems;
        //alert(this.apiUrl);

        break;
      case "renewal":
        this.apiUrl =
          environment.apiUrl +
          "/myaccount/GirdDataReports?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&PageType=Reports" +
          "&url=" +
          this.urlSegments +
          "&AgentId=" +
          this.Id +
          "&Page=" +
          this.pageNumbers.renewal;
        break;
      default:
        this.apiUrl = "";
    }
    //alert(this.apiUrl);
    this.http
      .get(
        this.api.additionParmsEnc(this.apiUrl),
        this.api.getHeader(this.apiUrl)
      )
      .subscribe(
        (resp: any) => {},
        (error: any) => {
          console.error(error);
        }
      );

    this.Get();
  }

  Get() {
    this.re_hit = "yes";
    this.loading = true;
    const formData = new FormData();
    formData.append("datas", this.Filter);
    this.http
      .post(
        this.api.additionParmsEnc(this.apiUrl),
        this.api.enc_FormData(formData),
        this.api.getHeader(this.apiUrl)
      )
      .subscribe(
        (res: any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

          if (
            this.urlSegments == "business" ||
            this.urlSegments == "offline-quote" ||
            this.urlSegments == "claims"
          ) {
            this.http
              .post(
                this.api.additionParmsEnc(this.apiUrl),
                this.api.enc_FormData(formData),
                this.api.getHeader(this.apiUrl)
              )
              .subscribe((res: any) => {
                var resp = JSON.parse(this.api.decryptText(res.response));

                if (
                  this.urlSegments == "business" ||
                  this.urlSegments == "offline-quote"
                ) {
                  this.total = resp.recordsFiltered;
                  this.totalQuotationIds = resp.recordsFiltered;
                  this.PaymentStatus = resp.Total.filter(
                    (item) => item.payment_status !== "0"
                  ).length;
                  this.Conversion =
                    (
                      (this.PaymentStatus / this.totalQuotationIds) *
                      100
                    ).toFixed(2) + "%";

                  this.Net_premium = 0;
                  if (this.PaymentStatus != 0) {
                    resp.Total.forEach((item) => {
                      if (item.payment_status === "1") {
                        this.Net_premium += parseFloat(item.Net_premium);
                      }
                    });
                    this.Net_premium = this.Net_premium.toFixed(2);
                  }

                  if (resp.recordsTotal == 0) {
                    this.Net_premium = 0;
                    this.PaymentStatus = 0;
                    this.totalQuotationIds = 0;
                    this.Conversion = 0;
                  }
                }

                if (!Array.isArray(this.post && this.responseData)) {
                  this.post = [];
                  this.responseData = [];
                }

                this.responseData = resp.data.filter(
                  (newItem) =>
                    !this.post.some(
                      (existingItem) =>
                        existingItem.Quotation_Id == newItem.Quotation_Id
                    )
                );
                //   //   //   console.log(this.responseData);
                this.post = this.post.concat(this.responseData);
                this.dataAr = this.post;

                if (resp.totalPages > resp.page) {
                  this.pageNumbers[this.urlSegments]++;
                }
              });
            this.loading = false;
          } else if (this.urlSegments == "gems") {
            this.http
              .post(
                this.api.additionParmsEnc(this.apiUrl),
                {},
                this.api.getHeader(this.apiUrl)
              )
              .subscribe((res: any) => {
                var resp = JSON.parse(this.api.decryptText(res.response));
                this.dataAr = resp.Data;
                this.total = resp.recordsFiltered;
              });
          } else if (this.urlSegments == "renewal") {
            this.re_hit = "yes";
            this.loading = true;

            this.http
              .post(
                this.api.additionParmsEnc(this.apiUrl),
                this.api.enc_FormData(formData),
                this.api.getHeader(this.apiUrl)
              )
              .subscribe((res: any) => {
                var resp = JSON.parse(this.api.decryptText(res.response));
                this.dataAr = resp["data"];
                this.total = resp["recordsFiltered"];
                this.totalRecordsfiltered = resp["recordsFiltered"];
                this.FilterDatatype = resp["FilterData"];
                this.RenewalQuery = resp["RenewalQuery"];
                this.TotalRow = resp["recordsFiltered"];
                this.NetPremiumFilteredRecords =
                  resp["NetPremiumFilteredRecords"];
                this.TotalRenewalFilteredRecords =
                  resp["TotalRenewalFilteredRecords"];
                this.NestedPagesList = resp["NestedPagesList"];

                if (!Array.isArray(this.post && this.responseData)) {
                  this.post = [];
                  this.responseData = [];
                }

                this.responseData = resp["data"].filter(
                  (newItem) =>
                    !this.post.some(
                      (existingItem) =>
                        existingItem.Quotation_Id == newItem.Quotation_Id
                    )
                );
                //   //   //   console.log(this.responseData);
                this.post = this.post.concat(this.responseData);
                this.dataAr = this.post;

                this.loading = false;
              });
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  GetSinglePosDetails(Id: any) {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Epartner/UserDetails?Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then((resp: any) => {
        this.api.HideLoading();
        this.DataAr = resp.data;
      });
  }

  //Ouote module
  ViewOfflineQuoteDetails(QuotationId: any) {
    const dialogRef = this.dialog.open(OfflineQuoteDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: QuotationId },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href = Url;
    } else {
      a.href = Url;
    }
    a.click();
  }
}
