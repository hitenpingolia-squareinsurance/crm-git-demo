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
import { ViewEndorsementDetailsComponent } from "./../../modals/view-endorsement-details/view-endorsement-details.component";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PolicydetailsComponent } from "./../../modals/policydetails/policydetails.component";
import { ViewSrDetailsComponent } from "../../modals/view-sr-details/view-sr-details.component";
import * as $ from "jquery";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  BookingDate: string;
  NetPremium: string;
  IssuedDate: string;
  GrossPremium: string;
  TotalFiles: string;
  TotalPremium: string;

  Posting_Status_Web: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
  FilterToTalPolicyAndPremium: any[];
  TotalEarning: any;
  TotalFiles: any;
  TotalPremium: any;
  FilterArray: any;
}

@Component({
  selector: "app-tele-busniess-reports",
  templateUrl: "./tele-busniess-reports.component.html",
  styleUrls: ["./tele-busniess-reports.component.css"],
})
export class TeleBusniessReportsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];
  FilterToTalPolicyAndPremium: ColumnsObj[];
  ActivePage: string = "Default";

  filterFormData: any = [];

  Is_Export: any = 0;
  ActionType: string;
  currentUrl: string;
  urlSegment: string;
  pageHeading: string;
  TotalEarning: any;
  TotalFiles: any;
  TotalPremium: any;

  TotalNetPremium: number = 0.0;
  TotalBookedPremium: number = 0.0;
  TotalUnBookedPremium: number = 0.0;

  TotalSR: number = 0;
  TotalBookedSR: number = 0;
  TotalUnBookedSR: number = 0;

  TotalCancelledSR: number = 0;
  TotalCancelledNetPremium: number = 0;
  TotalCancelledRevenue: number = 0;

  TotalRevenue: number = 0;
  TotalBookedRevenue: number = 0;
  TotalUnBookedRevenue: number = 0;

  checkLob: any = "motor";

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];

      if (
        this.urlSegment == "business" ||
        this.urlSegment == "business-reports"
      ) {
        this.pageHeading = "Business";
      } else if (this.urlSegment == "renewal") {
        this.pageHeading = "Renewal";
      } else if (
        this.urlSegment == "earning" ||
        this.urlSegment == "earning-reports"
      ) {
        this.pageHeading = "Earnings";
      } else if (
        this.urlSegment == "policy-issuance" ||
        this.urlSegment == "policy-issuance-reports"
      ) {
        this.pageHeading = "Issuance";
      }
    }

    this.datatableFunction();
  }

  //===== DATATABLE FUNCTION =====//
  datatableFunction() {
    const that = this;
    that.TotalSR =
      that.TotalBookedSR =
      that.TotalUnBookedSR =
      that.TotalNetPremium =
      that.TotalBookedPremium =
      that.TotalUnBookedPremium =
      that.TotalCancelledSR =
      that.TotalCancelledNetPremium =
      that.TotalCancelledRevenue =
      that.TotalRevenue =
      that.TotalBookedRevenue =
      that.TotalUnBookedRevenue =
        0;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    var urls = "/V2/TeleRmReport/BusniessVerticalReports";

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
                urls +
                "?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType +
                "&RightType=" +
                this.api.DataRightsGetNavigation()
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            that.CalculateTotalData(resp.FilterArray);

            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
              FilterArray: [],
            });
          });
      },
    };
  }

  CalculateTotalData(Query: any) {
    this.api.callme("CustomTable");
    const that = this;
    // this.callme();

    that.TotalSR =
      that.TotalBookedSR =
      that.TotalUnBookedSR =
      that.TotalNetPremium =
      that.TotalBookedPremium =
      that.TotalUnBookedPremium =
      that.TotalCancelledSR =
      that.TotalCancelledNetPremium =
      that.TotalCancelledRevenue =
      that.TotalRevenue =
      that.TotalBookedRevenue =
      that.TotalUnBookedRevenue =
        0;

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Query", Query);

    if (
      this.urlSegment == "business-reports" ||
      this.urlSegment == "policy-issuance-reports" ||
      this.urlSegment == "earning-reports"
    ) {
      var urls = "/V2/Reports/TotalDataGet";
    } else {
      urls = "/b-crm/reports/TotalDataGet";
    }

    // this.api.IsLoading();
    this.api.HttpPostType(urls, formData).then(
      (result) => {
        // this.api.HideLoading();
        // alert();
        if (result["Status"] == true) {
          this.api.callmestop("CustomTable");

          // Data
          that.TotalSR = result["Data"].TotalSR;
          that.TotalBookedSR = result["Data"].TotalBookedSR;
          that.TotalUnBookedSR = result["Data"].TotalUnBookedSR;
          that.TotalNetPremium = result["Data"].TotalPremium;
          that.TotalBookedPremium = result["Data"].TotalBookedPremium;
          that.TotalUnBookedPremium = result["Data"].TotalUnBookedPremium;
          that.TotalCancelledSR = result["Data"].TotalCancelledSR;
          that.TotalCancelledNetPremium =
            result["Data"].TotalCancelledNetPremium;
          that.TotalCancelledRevenue = result["Data"].TotalCancelledRevenue;
          that.TotalRevenue = result["Data"].TotalRevenue;
          that.TotalBookedRevenue = result["Data"].TotalBookedRevenue;
          that.TotalUnBookedRevenue = result["Data"].TotalUnBookedRevenue;

          // this.callmestop();
        } else {
          this.api.Toast("Warning", result["Message"]);
          this.api.callmestop("CustomTable");
        }
      },
      (err) => {
        this.api.callmestop("CustomTable");

        // this.callmestop();
        // this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    //    // console.log(event);

    if (event["Lob"] != "") {
      this.checkLob = event["Lob"][0]["Id"];
    }

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

  //===== CLEAR FILTER =====//
  ClearSearch() {
    //var fields = this.SearchForm.reset();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
    this.Is_Export = 0;
  }

  //===== REFRESH TABLE =====//
  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
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

  ViewEndrosmentUsingSrNo(srno: any) {
    const dialogRef = this.dialog.open(ViewEndorsementDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: srno },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
} //END
