import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";

@Component({
  selector: "app-updatation-mis-report-name",
  templateUrl: "./updatation-mis-report-name.component.html",
  styleUrls: ["./updatation-mis-report-name.component.css"],
})
export class UpdatationMisReportNameComponent implements OnInit {
  SQL_Where: any;
  columnAr: any;
  my_reports: any;
  recent_downloads: any;
  ReportBtn: any = 0;
  report_type: any = "";
  report_name: any = "";

  checkedIDs: any = [];
  type: any;

  constructor(
    public dialogRef: MatDialogRef<UpdatationMisReportNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public api: BmsapiService
  ) {}

  ngOnInit() {
    this.SQL_Where = this.data.SQL_Where;
    this.type = this.data.type;
    this.Get();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  Get() {
    this.api.IsLoading();

    let url = "../v2/reports/SrUpdationReport/GetMisReportColumn";
    if (this.type == "Regulatory") {
      url = "../v2/reports/SrUpdationReportRegulatory/GetMisReportColumn";
    }
    this.api.Call(url + "?User_Id=" + this.api.GetUserId()).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.columnAr = result["Data"];
          //this.my_reports = result['my_reports'];
          this.recent_downloads = result["recent_downloads"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg(err.message);
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

    let url = "../v2/reports/SrUpdationReport/DeleteCreatedReport";
    if (this.type == "Regulatory") {
      url = "../v2/reports/SrUpdationReportRegulatory/DeleteCreatedReport";
    }

    this.api.Call(url + "?User_Id=" + this.api.GetUserId() + "&Id=" + id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.recent_downloads = result["recent_downloads"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  ExportExcel() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("reportType", this.report_type);
    formData.append("reportName", this.report_name);
    formData.append("columns", this.checkedIDs);

    let url = "../v2/reports/SrUpdationReport/CreateSampleFormat";
    if (this.type == "Regulatory") {
      url = "../v2/reports/SrUpdationReportRegulatory/CreateSampleFormat";
    }

    this.api.IsLoading();
    this.api.HttpPostType(url, formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          window.open(result["DownloadUrl"]);
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }
}
