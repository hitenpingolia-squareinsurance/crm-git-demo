import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";

import { DownloadingSrComponent } from "../downloading-sr/downloading-sr.component";

@Component({
  selector: "app-sr-export",
  templateUrl: "./sr-export.component.html",
  styleUrls: ["./sr-export.component.css"],
})
export class SrExportComponent implements OnInit {
  SQL_Where: any;
  columnAr: any;
  my_reports: any;
  recent_downloads: any;
  ReportBtn: any = 0;
  report_type: any = "";
  report_name: any = "";

  checkedIDs = [];

  constructor(
    public dialogRef: MatDialogRef<SrExportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public api: ApiService
  ) {}

  ngOnInit() {
    this.SQL_Where = this.data.SQL_Where;
    this.Get();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  Get() {
    this.api.IsLoading();
    this.api
      .HttpForSR(
        "get",
        "../reports/CustomizeReport/GetMisReportColumn?User_Id=" +
          this.api.GetUserData("User_Id") +
          "&Portal=BMS",
        ""
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.columnAr = result["Data"];
            this.my_reports = result["my_reports"];
            this.recent_downloads = result["recent_downloads"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  changeSelection() {
    this.fetchCheckedIDs();
  }

  fetchCheckedIDs() {
    this.checkedIDs = [];
    this.columnAr.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedIDs.push(value.id);
      }
    });
  }

  promptfn() {
    var msg = prompt("Please Enter Report Name", "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return this.promptfn();
    } else {
      return msg;
    }
  }

  Export(id) {
    if (id == 1) {
      this.ReportBtn = 1;
    } else if (id == 2) {
      this.report_type = "download";
      this.report_name = "";
      this.ExportExcel();
    } else if (id == 3) {
      this.report_type = "create";
      this.report_name = this.promptfn();
      // console.log(this.report_name);
      if (this.report_name != "") {
        this.ExportExcel();
      }
    }
  }

  createdExport(id) {
    this.report_type = "exists_download";
    this.report_name = id;
    this.ExportExcel();
  }
  Is_Delete(id) {
    this.api.IsLoading();
    this.api
      .HttpForSR(
        "get",
        "reports/CustomizeReport/DeleteCreatedReport?User_Id=" +
          this.api.GetUserId() +
          "&Id=" +
          id,
        ""
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.my_reports = result["my_reports"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  ExportExcel(): void {
    const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    //dialogConfig.position = 'absolute';
    dialogConfig.hasBackdrop = false;
    //dialogConfig.closeOnNavigation = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    var d = JSON.stringify({
      reportType: this.report_type,
      reportName: this.report_name,
      columns: this.checkedIDs,
      Where: this.SQL_Where,
    });

    dialogConfig.data = {
      ReportType: "MotorNonMotorHealth_Customize",
      SQL_Where: d,
    };

    //this.Is_Export = 0;
    this.CloseModel();

    const dialogRef = this.dialog.open(DownloadingSrComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
