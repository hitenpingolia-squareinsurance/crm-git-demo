import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ExtraPayoutDetailsComponent } from "../../../modals/extra-payout-details/extra-payout-details.component";

class ColumnsObj {
  Id: string;
  Bulk_Id: string;
  TotalSR: string;
  Add_Stamp: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-extra-reward-files",
  templateUrl: "./extra-reward-files.component.html",
  styleUrls: ["./extra-reward-files.component.css"],
})
export class ExtraRewardFilesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  TableUsed: any = "extra_payout_files";
  selectedFiles: File;
  DownloadUrl: any = "";

  Percentage_Slot: any = 0;
  Is_CheckComplete: any = 0;
  Bulk_Id: any = 0;
  TotalSR: any = 0;
  Export_Id: any = 0;
  Limits: any = [];

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.Get();

    this.DownloadUrl =
      environment.apiUrlBmsBase +
      "/../uploads/extra-payout-sample/ExtraPayoutSample.xlsx";
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  //===== GET DATATABLE DATA =====//
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
                "/bulk-upload/ViewUploadedData/GridData?User_Id=" +
                this.api.GetUserId() +
                "&TableUsed=" +
                this.TableUsed
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

      columns: [{ data: "Id" }, { data: "Bulk_Id" }, { data: "Add_Stamp" }],
    };
  }

  //===== UPLOAD EXCEL =====//
  UploadExcel(event) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "xlsx") {
        //   //   console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.ErrorMsg("File size is greater than 2 mb");
        } else {
          this.Upload();
        }
      } else {
        //   //   console.log('Extenstion is not vaild !');
        this.api.ErrorMsg("Please choose vaild file ! Example :- xlsx");
      }
    }
  }

  //===== IMPORT/UPLOAD EXCEL =====//
  async Upload() {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to upload file?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("TableUsed", this.TableUsed);
      formData.append("ExcelFile", this.selectedFiles);

      this.api.IsLoading();
      this.api
        .HttpPostType("bulk-upload/ImportData/ImportAction", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.ToastMessage(result["Message"]);
              this.Reload();
            } else {
              //alert(result['Message']);
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            ////   //   console.log(err.message);
            this.api.ErrorMsg(err.message);
          }
        );
    }
  }

  //===== DOWNLOAD SAMPLE EXCEL =====//
  DownloadSampleExcel() {
    window.open(this.DownloadUrl);
  }

  //===== ACTIONS MODAL =====//
  ExtraPayoutDetails(Bulk_Id): void {
    //SrViewComponent SalesSrActionComponent
    const dialogRef = this.dialog.open(ExtraPayoutDetailsComponent, {
      width: "95%",
      height: "90%",
      data: { Bulk_Id: Bulk_Id, TableUsed: this.TableUsed },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
      //this.Reload();
    });
  }
}
