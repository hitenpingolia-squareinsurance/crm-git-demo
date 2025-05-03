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
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { FormBuilder } from "@angular/forms";
import { OfflineQuoteDetailsComponent } from "../../modals/offline-quote-details/offline-quote-details.component";

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
  Creator_Details:string
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-offline-quote",
  templateUrl: "./offline-quote.component.html",
  styleUrls: ["./offline-quote.component.css"],
})
export class OfflineQuoteComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];
  ActivePage: string = "Default";

  filterFormData: any = [];

  Is_Export: any = 0;
  ActionType: string;
  currentUrl: string;
  urlSegment: string;
  urlSegmentRoot: string;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != undefined) {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != undefined) {
      this.urlSegmentRoot = splitted[1];
    }
  }

  ngOnInit() {
    this.datatableFunction();
  }

  //===== DATATABLE FUNCTION =====//
  datatableFunction() {
    

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
 dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/b-crm/OfflineQuoteReports/fetchOfflineQuoteReportsData?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&url=" +
              this.currentUrl +
              "&PageType=Reports" +
              "&Action=" +
              this.ActionType),
            dataTablesParameters,this.api.getHeader(environment.apiUrl)
            
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.FilterData = resp.FilterPolicyData;

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

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.filterFormData = [];
    this.filterFormData.push(event);

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
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

  ViewOfflineQuoteDetails(QuotationId: any) {
    const dialogRef = this.dialog.open(OfflineQuoteDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: QuotationId },
    });

    dialogRef.afterClosed().subscribe((result:any) => {});
  }


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
            var url = baseurl + "business-login/form/general-insurance/" + type + "/crm/" + result["User_Id"] + "/" + row_Id + "/web";
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
} //END
