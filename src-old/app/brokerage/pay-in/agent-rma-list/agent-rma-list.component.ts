import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { PayinRmaDetailsComponent } from "../../../modals/brokerage/payin-rma-details/payin-rma-details.component";

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
  SQL_Where: any;
}

@Component({
  selector: "app-agent-rma-list",
  templateUrl: "./agent-rma-list.component.html",
  styleUrls: ["./agent-rma-list.component.css"],
})
export class AgentRmaListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.Get();
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
                "/../v2/pay-in/RMA/GridData_RMA?User_Id=" +
                this.api.GetUserId()
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
    };
  }

  DeleteRMAuthority(Id) {
    var r = confirm(
      "are you sure you want to delete this pay-in permanently !"
    );
    if (r == true) {
      //txt = "You pressed OK!";

      this.api.IsLoading();
      this.api
        .Call(
          "/v2/pay-in/RMA/DeleteRMA?Id=" +
            Id +
            "&User_Id=" +
            this.api.GetUserId()
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.ToastMessage(result["Message"]);
              this.Reload();
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            alert(err.message);
          }
        );
    } else {
      //txt = "You pressed Cancel!";
    }
  }

  DisableRMAuthority(Id) {
    var r = confirm(
      "are you sure you want to disable this pay-in permanently !"
    );
    if (r == true) {
      //txt = "You pressed OK!";

      this.api.IsLoading();
      this.api
        .Call(
          "/v2/pay-in/RMA/DisableRMA?Id=" +
            Id +
            "&User_Id=" +
            this.api.GetUserId()
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.ToastMessage(result["Message"]);
              this.Reload();
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            alert(err.message);
          }
        );
    } else {
      //txt = "You pressed Cancel!";
    }
  }

  ViewDetails(RMA_Id: any) {
    //alert(RMA_Id);

    const dialogRef = this.dialog.open(PayinRmaDetailsComponent, {
      width: "50%",
      height: "50%",
      disableClose: true,
      data: { RMA_Id: RMA_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
