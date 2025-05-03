import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { BmsapiService } from "../../../providers/bmsapi.service";

import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog } from "@angular/material/dialog";

class ColumnsObj {
  Id: string;
  Bulk_Id: string;
  New: string;
  Skipped: string;
  Add_Stamp: string;
  Update_Stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-excel-sr-bulk-upload",
  templateUrl: "./excel-sr-bulk-upload.component.html",
  styleUrls: ["./excel-sr-bulk-upload.component.css"],
})
export class ExcelSrBulkUploadComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  selectedFiles: File;

  Percentage_Slot: any = 0;
  Is_CheckComplete: any = 0;
  Bulk_Id: any = 0;
  TotalSR: any = 0;
  Export_Id: any = 0;
  Limits: any = [];
  Is_Complete: any = 0;
  Percentage: any = 0;
  upload_msg: string = "";
  DownloadUrl: any = "";
  url: string;
  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.url = environment.apiUrlBmsBase;
    this.Get();
    // alert(environment.apiUrlBmsBase);
    this.DownloadUrl =
      environment.apiUrlBmsBase +
      "/../uploads/extra-payout-sample/ExtraPayoutSample.xlsx";
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  DonwloadLoadFormat() {
    window.open(this.DownloadUrl);
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
                "/../v2/reports/Bulk_Upload/GridData?User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            // return;
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "Id" },
        { data: "Bulk_Id" },
        { data: "New" },
        { data: "Skipped" },
        { data: "Add_Stamp" },
        { data: "Update_Stamp" },
      ],
    };
  }

  UploadExcel(event) {
    this.selectedFiles = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      //   //   console.log(this.selectedFiles);
      //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      ////   //   console.log(ext);

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

  async Upload() {
    this.Percentage = 0;

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("ExcelFile", this.selectedFiles);

    this.api.IsLoading();
    this.api.HttpPostType("../v2/reports/Bulk_Upload/Upload", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          //   //   console.log(result);

          this.Bulk_Id = result["Bulk_Id"];
          this.Limits = result["Limits"];
          this.Percentage = result["Percentage_Slot"];
          this.upload_msg = "Validation checking";
          this.StartValidationChecking(this.Limits);
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

    //}
  }

  async StartValidationChecking(Limits) {
    this.Percentage_Slot = 0;

    for (let i = 0; i < Limits; i++) {
      var url =
        environment.apiUrlBmsBase +
        "../../v2/reports/Bulk_Upload/StartValidationChecking?User_Id=" +
        this.api.GetUserId() +
        "&Bulk_Id=" +
        this.Bulk_Id +
        "&Percentage_Slot=" +
        this.Percentage;

      await this.http
        .get<any>(url)
        .toPromise()
        .then((data) => {
          //alert(this.Percentage_Slot);
          this.Percentage_Slot = (
            parseFloat(this.Percentage_Slot) + parseFloat(data.Percentage_Slot)
          ).toFixed(2);

          if (this.Percentage_Slot >= 99) {
            this.upload_msg = "Validation checking done, wait a few moments...";
            this.Percentage_Slot = 100;
          }

          if (data.Is_Complete == 1) {
            this.Is_Complete = data.Is_Complete;
            //this.Percentage = 100;
            this.Percentage_Slot = 100;
            this.Limits = data["Limits"];
          }
        });
    }

    if (this.Is_Complete) {
      this.upload_msg = "SR Uploading...";
      this.SR_Move(this.Limits);
    }
  }

  async SR_Move(Limits: any) {
    this.Is_Complete = 0;
    this.Percentage_Slot = 0;

    for (let i = 0; i < Limits; i++) {
      var url =
        environment.apiUrlBmsBase +
        "../../v2/reports/Bulk_Upload/temp_move_sr_in_sr_master?User_Id=" +
        this.api.GetUserId() +
        "&Bulk_Id=" +
        this.Bulk_Id +
        "&Percentage_Slot=" +
        this.Percentage;

      await this.http
        .get<any>(url)
        .toPromise()
        .then((data) => {
          this.Percentage_Slot = (
            parseFloat(this.Percentage_Slot) + parseFloat(data.Percentage_Slot)
          ).toFixed(2);
          if (this.Percentage_Slot >= 99) {
            this.upload_msg = "SR Uploading done, wait a few moments...";
            this.Percentage_Slot = 100;
          }

          if (data.Is_Complete == 1) {
            this.Is_Complete = data.Is_Complete;
            this.Percentage_Slot = 100;
          }

          if (data.Status == false) {
            alert(data.Message);
          }
        });
    }

    if (this.Is_Complete) {
      this.upload_msg = "SR No Assign...";
      this.SR_No_Assign(this.Limits);
    }
  }

  async SR_No_Assign(Limits: any) {
    this.Is_Complete = 0;
    this.Percentage_Slot = 0;

    for (let i = 0; i < Limits; i++) {
      var url =
        environment.apiUrlBmsBase +
        "../../v2/reports/Bulk_Upload/SR_No_Assign?User_Id=" +
        this.api.GetUserId() +
        "&Bulk_Id=" +
        this.Bulk_Id +
        "&Percentage_Slot=" +
        this.Percentage;

      await this.http
        .get<any>(url)
        .toPromise()
        .then((data) => {
          this.Percentage_Slot = (
            parseFloat(this.Percentage_Slot) + parseFloat(data.Percentage_Slot)
          ).toFixed(2);
          if (this.Percentage_Slot >= 99) {
            this.upload_msg = "SR No Assign done, wait a few moments...";
            this.Percentage_Slot = 100;
          }

          if (data.Is_Complete == 1) {
            this.Is_Complete = 0;
            this.Percentage_Slot = 0;
            this.api.ToastMessage(data.Message);
            this.Reload();
          }
        });
    }
  }
}
