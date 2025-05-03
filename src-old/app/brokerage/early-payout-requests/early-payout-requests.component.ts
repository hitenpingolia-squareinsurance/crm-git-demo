import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "../../providers/bmsapi.service";
import { Router } from "@angular/router";
import { EarlyPayoutFilesComponent } from "../brokerage-report/early-payout-files/early-payout-files.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

class ColumnsObj {
  Id: string;
  SrNo: string;
  status: string;
  request_id: string;
  request_amt: string;
  request_po: string;
  posting_status: string;
  add_stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-early-payout-requests",
  templateUrl: "./early-payout-requests.component.html",
  styleUrls: ["./early-payout-requests.component.css"],
})
export class EarlyPayoutRequestsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SQL_Where_STR: any;
  Is_Export: any = 0;

  sr_ids: any = "";
  total_po: any = 0;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.Get();
  }

  ViewFiles(id: any) {
    const dialogRef = this.dialog.open(EarlyPayoutFilesComponent, {
      width: "95%",
      height: "75%",
      data: { id: id, type: "accounts" },
      //disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });
  }

  rejectRequest(id: any, request_id: any) {
    if (confirm("Are you sure?") === true) {
      this.api.IsLoading();
      this.api
        .Call(
          "../v3/pay-in/EarlyPayout/rejectRequest?User_Id=" +
            this.api.GetUserId() +
            "&id=" +
            id +
            "&request_id=" +
            request_id
        )
        .then(
          (result) => {
            //this.api.HideLoading();
            if (result["status"] == true) {
              this.Reload();
            } else {
              //alert(result['Message']);
            }
          },
          (err) => {
            // Error log
            //this.api.HideLoading();
            //// console.log(err.message);
            alert(err.message);
          }
        );
    }
  }

  PostData(id: any, request_id: any, posting_status: any) {
    //if(posting_status == 'Yes'){
    if (confirm("Are you sure?") === true) {
      this.api.IsLoading();
      this.api
        .Call(
          "../v3/pay-in/EarlyPayout/PostData?User_Id=" +
            this.api.GetUserId() +
            "&id=" +
            id +
            "&request_id=" +
            request_id
        )
        .then(
          (result) => {
            //this.api.HideLoading();

            alert(result["message"]);

            if (result["status"] == true) {
              this.Reload();
            } else {
              //
            }
          },
          (err) => {
            // Error log
            //this.api.HideLoading();
            //// console.log(err.message);
            alert(err.message);
          }
        );
    }
    //}else{
    //alert("This request QC not completed.");
    //}
  }

  ClearSearch() {
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
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
                "/../v3/pay-in/EarlyPayout/GridData_Requests?User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      // columns: [
      //   { data: "Id" },
      //   { data: "Status" },
      //   { data: "Request_Amount" },
      //   { data: "Request_Date_Time" },
      // ],
    };
  }
}
