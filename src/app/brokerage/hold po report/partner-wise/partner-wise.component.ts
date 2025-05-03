import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { BmsapiService } from "../../../providers/bmsapi.service";

import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { HoldPoReportComponent } from "../../hold-po-report/hold-po-report.component";
import { environment } from "src/environments/environment";

class ColumnsObj {
  Id: string;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalPORecord: any;
  TotalNOP: any;
  totalPremium: any;
}
@Component({
  selector: "app-partner-wise",
  templateUrl: "./partner-wise.component.html",
  styleUrls: ["./partner-wise.component.css"],
})
export class PartnerWiseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];

  Masking: any = "Temp";
  Is_Export: number;
  urlSegment: string;
  totalRecords: number;
  TotalNOP: any;
  totalPORecord: any;
  totalPremium: any;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.urlSegment = this.router.url;
    this.Get();
  }

  Add(): void {
    const dialogRef = this.dialog.open(HoldPoReportComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: 0 },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v3/hold-po/Partner/FetchData?User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp["status"] == 1) {
              this.totalRecords = resp.recordsFiltered;
              this.TotalNOP = resp.TotalNOP;
              this.totalPORecord = resp.totalPORecord;
              this.totalPremium = resp.totalPremium;
              // console.log(this.TotalNOP);
              // console.log(this.totalPremium);
              // console.log(this.totalPORecord);
              // console.log(this.totalRecords);

              that.dataAr = resp.data;
            } else {
              that.dataAr = [];
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

  UnHold(Id: any, Agent_Id: any) {
    var formData = new FormData();
    var querySegment = this.urlSegment.includes("partner-wise")
      ? "partner-wise"
      : "sr-wise";

    formData.append("Id", Id);

    this.api
      .HttpPostType(
        `/../../v3/hold-po/Partner/unHoldData?urlSegment=${querySegment}`,
        formData
      )
      .then(
        (response) => {
          this.api.ToastMessage(response["message"]);
          this.Reload();
        },
        (error) => {
          console.error("Error", error);
        }
      );
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  Actions(row_Id): void {}
  ViewDocuments(row_Id): void {}
}
