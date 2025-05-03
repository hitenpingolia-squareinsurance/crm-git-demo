import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
//import swal from 'sweetalert';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-downloading-view",
  templateUrl: "./downloading-view.component.html",
  styleUrls: ["./downloading-view.component.css"],
})
export class DownloadingViewComponent implements OnInit {
  Report_Type: any;
  SQL_Where_STR: any;

  Percentage_Slot: any = 1;
  Is_Prepre_Excel: any = 0;
  Export_Id: any = 0;
  Limits: any = [];

  DownloadUrl: any;
  Is_Download: any = 0;
  MonthName: any;
  YearName: any;

  PrepareLimit_Action_URL: any = "";
  RunLimitsLoop_Action_URL: any = "";
  Prepre_Excel_Action_URL: any = "";
  ReportType_Str: any = "MIS";
  FinancialYear: any;
  RunLimitsLoop_Action_URL_BMS: string;
  Prepre_Excel_Action_URL_BMS: string;
  PrepareLimit_Action_URL_BMS: string;

  constructor(
    public dialogRef: MatDialogRef<DownloadingViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.Report_Type = this.data.ReportType; //SuperAdmin,MotorNonMotorHealth_SR,Finance_SR
    this.SQL_Where_STR = this.data.SQL_Where;

    if (this.Report_Type == "ProjectionReports") {
      this.YearName = this.data.YearName;
      this.MonthName = this.data.MonthName;
    }
    //this.Percentage_Slot = 25;

    if (this.Report_Type == "Posting") {
      this.PrepareLimit_Action_URL = "reports/Export/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrl + "/reports/Export/PrepareDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/Export/Prepre_Excel";
    } else if (this.Report_Type == "ExportPostingReport") {
      this.PrepareLimit_Action_URL = "reports/Export/PostingReportPrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrl + "/reports/Export/PrepareDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/Export/PostingReportPrepre_Excel";
    } else if (this.Report_Type == "BulkMailSend") {
      this.PrepareLimit_Action_URL = "reports/Export/PostingReportPrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrl + "/reports/Export/PrepareDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/Export/PostingReportPrepre_Excel";
    } else if (this.Report_Type == "SalaryReports") {
      this.PrepareLimit_Action_URL =
        "goal-management-system/Export/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/goal-management-system/AllocatedBusinessTargets/PrepareDataWithLimit";
      this.Prepre_Excel_Action_URL =
        "goal-management-system/Export/Prepre_Excel";
    } else if (this.Report_Type == "AppraisalPendencyReport") {
      this.PrepareLimit_Action_URL =
        "goal-management-system/appraisals/ExportAppraisalReport/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/goal-management-system/appraisals/ExportAppraisalReport/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL =
        "goal-management-system/appraisals/ExportAppraisalReport/Prepre_Excel";
    } else if (this.Report_Type == "DsrReports") {
      this.PrepareLimit_Action_URL =
        "daily-tracking-circle/ExportData/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/daily-tracking-circle/ExportData/PrepareDataWithLimit";
      this.Prepre_Excel_Action_URL =
        "daily-tracking-circle/ExportData/Prepre_Excel";
    } else if (this.Report_Type == "ProjectionReports") {
      this.PrepareLimit_Action_URL =
        "projection-target/ProjectionTargetExport/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/projection-target/ProjectionTargetExport/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL =
        "projection-target/ProjectionTargetExport/Prepre_Excel";
    } else if (this.Report_Type == "Mandate_Letter_Export") {
      this.PrepareLimit_Action_URL = "reports/MandateLetterExport/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/reports/MandateLetterExport/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/MandateLetterExport/Prepre_Excel";
    } else if (this.Report_Type == "PartnerStatement") {
      this.ReportType_Str = "Partner Statement";
      this.PrepareLimit_Action_URL = "reports/Statement/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrl + "/reports/Statement/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/Statement/Prepre_Excel";
    } else if (this.Report_Type == "PartnerStatementMail") {
      this.ReportType_Str = "Partner Statement";
      this.PrepareLimit_Action_URL = "reports/Statement/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrl + "/reports/Statement/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/Statement/Prepre_Excel";
    } else if (this.Report_Type == "PmsReports") {
      this.YearName = this.data.YearName;
      this.MonthName = this.data.MonthName;

      this.PrepareLimit_Action_URL =
        "goal-management-system/pms/ExportPmsReport/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/goal-management-system/pms/ExportPmsReport/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL =
        "goal-management-system/pms/ExportPmsReport/Prepre_Excel";
    } else if (this.Report_Type == "AgentReport") {
      this.ReportType_Str = "Agent";
      this.PrepareLimit_Action_URL = "reports/AgentReport/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase +
        "/reports/AgentReport/PrepareExcelDataWithLimit";
      this.Prepre_Excel_Action_URL = "reports/AgentReport/Prepre_Excel";
    }

    if (this.Report_Type == "SalaryReports") {
      this.MonthName = this.data.MonthName;
      this.FinancialYear = this.data.FinancialYear;
      this.PrepareLimitBms();
    } else if (
      this.Report_Type == "DsrReports" ||
      this.Report_Type == "Mandate_Letter_Export" ||
      this.Report_Type == "ProjectionReports" ||
      this.Report_Type == "PmsReports" ||
      this.Report_Type == "AppraisalPendencyReport" ||
      this.Report_Type == "AgentReport"
    ) {
      this.PrepareLimitBms();
    } else if (this.Report_Type == "MotorNonMotorHealth_Customize") {
      this.CustomizeReportExport();
    } else {
      this.PrepareLimit();
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  PrepareLimit() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("SQL_Where", this.SQL_Where_STR);

    //this.api.IsLoading();
    this.api.HttpPostType(this.PrepareLimit_Action_URL, formData).then(
      (result) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          this.Limits = result["Limits"];
          this.Export_Id = result["Export_Id"];
          this.DownloadUrl = result["DownloadUrl"];
          // console.log(this.Limits);

          this.RunLimitsLoop();
        } else {
          //alert(result['Message']);
          this.api.Toast("Success", result["Message"]);
        }
      },
      (err) => {
        //this.api.HideLoading();
        // console.log(err.message);
        this.api.Toast("Error", err.message);
      }
    );
  }

  //===== PREPARE BMS LIMIT =====//
  PrepareLimitBms() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("SQL_Where", this.SQL_Where_STR);
    formData.append("Portal", "CRM");

    this.api.HttpPostTypeBms(this.PrepareLimit_Action_URL, formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Limits = result["Limits"];
          this.Export_Id = result["Export_Id"];
          this.RunLimitsLoopBms();
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Error", err.message);
      }
    );
  }

  async RunLimitsLoop() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
        "Access-Control-Allow-Origin": "*",
      }),
    };
    this.Percentage_Slot = 1;
    for (let i = 0; i < this.Limits.length; i++) {
      var limitArea = this.Limits[i];

      var url =
        this.RunLimitsLoop_Action_URL +
        "?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Code=" +
        this.api.GetUserData("Code") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&Export_Id=" +
        this.Export_Id +
        "&limit=" +
        limitArea;

      await this.http
        .get<any>(
          this.api.additionParmsEnc(url),
          this.api.getHeader(this.RunLimitsLoop_Action_URL)
        )
        .toPromise()
        .then((res) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //this.Percentage_Slot = (this.Percentage_Slot+data.Percentage_Slot);
          this.Percentage_Slot = (
            parseFloat(this.Percentage_Slot) + parseFloat(data.Percentage_Slot)
          ).toFixed(2);

          if (data.Is_Prepre_Excel == 1) {
            //alert(data.Is_Prepre_Excel);
            this.Is_Prepre_Excel = 1;
            this.Percentage_Slot = 100;

            this.api
              .HttpGetType(
                this.Prepre_Excel_Action_URL +
                  "?Export_Id=" +
                  this.Export_Id +
                  "&User_Id=" +
                  this.api.GetUserData("Id") +
                  "&User_Code=" +
                  this.api.GetUserData("Code") +
                  "&User_Type=" +
                  this.api.GetUserType()
              )
              .then(
                (result) => {
                  if (result["Status"] == true) {
                    //this.api.ToastMessage(result['Message']);
                    this.Is_Prepre_Excel = 0;
                    this.Percentage_Slot = 0;
                    this.Is_Download = 1;
                    //window.open(result['DownloadUrl']);

                    this.DownloadUrl = result["DownloadUrl"];

                    // this.DownloadUrl = result['DownloadUrl'];
                    if (this.Report_Type == "PartnerStatementMail") {
                      this.dialogRef.close({
                        DownloadUrl: this.DownloadUrl,
                      });
                    }
                  } else {
                    this.api.Toast("Success", result["Message"]);
                  }
                },
                (err) => {
                  // console.log(err.message);
                  this.api.Toast("Error", err.message);
                }
              );
          }
        });
    }
  }

  async RunLimitsLoopBms() {
    this.Percentage_Slot = 1;
    for (let i = 0; i < this.Limits.length; i++) {
      var limitArea = this.Limits[i];

      if (this.Report_Type == "ProjectionReports") {
        var url =
          this.RunLimitsLoop_Action_URL +
          "?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&MonthName=" +
          this.MonthName +
          "&YearName=" +
          this.YearName +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Export_Id=" +
          this.Export_Id +
          "&limit=" +
          limitArea +
          "&Portal=CRM";
      } else if (this.Report_Type == "SalaryReports") {
        var url =
          this.RunLimitsLoop_Action_URL +
          "?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&FinancialYear=" +
          this.FinancialYear +
          "&MonthName=" +
          this.MonthName +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Export_Id=" +
          this.Export_Id +
          "&limit=" +
          limitArea +
          "&Portal=CRM";
      } else {
        var url =
          this.RunLimitsLoop_Action_URL +
          "?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&MonthName=" +
          this.MonthName +
          "&YearName=" +
          this.YearName +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Export_Id=" +
          this.Export_Id +
          "&limit=" +
          limitArea +
          "&Portal=CRM";
      }

      await this.http
        .get<any>(
          this.api.additionParmsEnc(url),
          this.api.getHeader(this.RunLimitsLoop_Action_URL)
        )
        .toPromise()
        .then((res) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //this.Percentage_Slot = (this.Percentage_Slot+data.Percentage_Slot);
          this.Percentage_Slot = (
            parseFloat(this.Percentage_Slot) + parseFloat(data.Percentage_Slot)
          ).toFixed(2);

          if (data.Is_Prepre_Excel == 1) {
            //alert(data.Is_Prepre_Excel);
            this.Is_Prepre_Excel = 1;
            this.Percentage_Slot = 100;

            const formData = new FormData();

            formData.append("User_Id", this.api.GetUserData("Id"));
            formData.append("User_Code", this.api.GetUserData("Code"));
            formData.append("Export_Id", this.Export_Id);

            this.api
              .HttpPostTypeBms(
                this.Prepre_Excel_Action_URL +
                  "?Export_Id=" +
                  this.Export_Id +
                  "&MonthName=" +
                  this.MonthName +
                  "&YearName=" +
                  this.YearName,
                formData
              )
              .then(
                (result) => {
                  if (result["Status"] == true) {
                    this.Is_Prepre_Excel = 0;
                    this.Percentage_Slot = 0;
                    this.Is_Download = 1;
                    this.DownloadUrl = result["DownloadUrl"];
                  } else {
                    this.api.Toast("Success", result["Message"]);
                  }
                },
                (err) => {
                  // console.log(err.message);
                  this.api.Toast("Error", err.message);
                }
              );
          }
        });
    }
  }

  CustomizeReportExport() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("SQL_Where", this.SQL_Where_STR);

    this.Is_Prepre_Excel = 1;
    this.Percentage_Slot = 100;
    //this.api.IsLoading();

    this.api
      .HttpForSR("post", "../reports/CustomizeReport/Sales", formData)
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            // this.RunLimitsLoopBms();

            //this.api.ToastMessage(result['Message']);
            this.Is_Prepre_Excel = 0;
            this.Percentage_Slot = 0;
            this.Is_Download = 1;

            window.open(result["DownloadUrl"]);
            // this.DownloadUrl = result['DownloadUrl'];
          } else {
            this.api.Toast("Warning", result["Message"]);

            // this.api.ErrorMsg(result['Message']);
            this.CloseModel();
          }
        },
        (err) => {
          //this.api.HideLoading();
          // console.log(err.message);
          this.api.Toast("Error", err.message);
          this.CloseModel();
        }
      );
  }

  ClickToDownload() {
    this.CloseModel();
    window.open(this.DownloadUrl);
  }
}
