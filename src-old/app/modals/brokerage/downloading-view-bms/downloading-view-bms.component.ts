import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-downloading-view-bms",
  templateUrl: "./downloading-view-bms.component.html",
  styleUrls: ["./downloading-view-bms.component.css"],
})
export class DownloadingViewBmsComponent implements OnInit {
  Report_Type: any;
  SQL_Where_STR: any;

  Percentage_Slot: any = 1;
  Is_Prepre_Excel: any = 0;
  Export_Id: any = 0;
  Limits: any = [];
  UserRights: any = [];

  DownloadUrl: any;
  Is_Download: any = 0;

  PrepareLimit_Action_URL: any = "";
  RunLimitsLoop_Action_URL: any = "";
  Prepre_Excel_Action_URL: any = "";
  ReportType_Str: any = "MIS";

  DateRangeValue: any = "";

  constructor(
    public dialogRef: MatDialogRef<DownloadingViewBmsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService,
    private http: HttpClient
  ) {
    this.GetUserRigths();
  }

  ngOnInit() {}

  loadData() {
    this.Report_Type = this.data.ReportType; //SuperAdmin,MotorNonMotorHealth_SR,Finance_SR
    this.SQL_Where_STR = this.data.SQL_Where;

    if (this.Report_Type == "SuperAdminPivot") {
      this.DateRangeValue = this.data.DateRangeValue;
    }

    if (this.Report_Type == "SchedulerReport") {
      this.ReportType_Str = "PO Calculation";
      this.PrepareLimit_Action_URL =
        "../v2/reports/SchedulerReport/PrepareLimit";
      this.RunLimitsLoop_Action_URL =
        environment.apiUrlBmsBase + "/../v2/reports/SchedulerReport/Chunks";
      this.Prepre_Excel_Action_URL =
        "../v2/reports/SchedulerReport/Prepre_Excel";
      this.PrepareLimit_Scheduler();
    } else {
      //this.Percentage_Slot = 25;

      if (this.Report_Type == "MotorNonMotorHealth_SR") {
        this.PrepareLimit_Action_URL = "sr/Agent/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase + "/sr/AgentTest/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "sr/Agent/Prepre_Excel";
      } else if (this.Report_Type == "Finance_SR") {
        this.PrepareLimit_Action_URL = "finance/FinanceSR/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/finance/FinanceSR/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "finance/FinanceSR/Prepre_Excel";
      } else if (this.Report_Type == "Finance_DSA_Report") {
        this.PrepareLimit_Action_URL = "finance/DSAReport/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/finance/DSAReport/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "finance/DSAReport/Prepre_Excel";
      } else if (this.Report_Type == "AgentReport") {
        this.ReportType_Str = "Agent";
        this.PrepareLimit_Action_URL = "reports/AgentReport/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/reports/AgentReport/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "reports/AgentReport/Prepre_Excel";
      } else if (this.Report_Type == "CrossSellingReport") {
        this.ReportType_Str = "Cross-selling";
        this.PrepareLimit_Action_URL = "reports/CrossSelling/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/reports/CrossSelling/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "reports/CrossSelling/Prepre_Excel";
      } else if (this.Report_Type == "PayIn") {
        this.ReportType_Str = "Pay-In";
        this.PrepareLimit_Action_URL = "pay/ExportPayIn/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/pay/ExportPayIn/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "pay/ExportPayIn/Prepre_Excel";
      } else if (this.Report_Type == "PostingReport") {
        this.ReportType_Str = "Posting";
        this.PrepareLimit_Action_URL = "brokerage/Export/PO_PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/brokerage/Export/PO_PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "brokerage/Export/PO_Prepre_Excel";
      } else if (this.Report_Type == "PayoutRequest") {
        this.ReportType_Str = "Payout-Request";
        this.PrepareLimit_Action_URL = "brokerage/Export/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/brokerage/Export/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "brokerage/Export/Prepre_Excel";
      } else if (this.Report_Type == "RMPayoutRequestExport") {
        this.ReportType_Str = "RM-Payout-Request";
        this.PrepareLimit_Action_URL = "pay/RMPayoutExport/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/pay/RMPayoutExport/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "pay/RMPayoutExport/Prepre_Excel";
      } else if (this.Report_Type == "SingelPostingRequestData") {
        this.ReportType_Str = "Posting";
        this.PrepareLimit_Action_URL =
          "brokerage/Export/PO_PrepareLimit_According_Posting_Id";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/brokerage/Export/PO_PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "brokerage/Export/PO_Prepre_Excel";
      } else if (this.Report_Type == "SuperAdminPivot") {
        this.ReportType_Str = "Pivot";
        this.PrepareLimit_Action_URL = "brokerage/Pivot/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/brokerage/Pivot/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "brokerage/Pivot/Prepre_Excel";
      } else if (this.Report_Type == "Reconciliation") {
        this.ReportType_Str = "Reconciliation";
        this.PrepareLimit_Action_URL = "reports/Reconciliation/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/reports/Reconciliation/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "reports/Reconciliation/Prepre_Excel";
      } else if (this.Report_Type == "PartnerStatement") {
        this.ReportType_Str = "Partner Statement";
        this.PrepareLimit_Action_URL = "brokerage/PartnerEarning/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/brokerage/PartnerEarning/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "brokerage/PartnerEarning/Prepre_Excel";
      } else if (this.Report_Type == "PartnerStatementMail") {
        this.ReportType_Str = "Partner Statement";
        this.PrepareLimit_Action_URL = "brokerage/PartnerEarning/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/brokerage/PartnerEarning/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "brokerage/PartnerEarning/Prepre_Excel";
      } else if (this.Report_Type == "64VB_Export") {
        this.PrepareLimit_Action_URL = "reports/CashReportExport/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/reports/CashReportExport/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL = "reports/CashReportExport/Prepre_Excel";
      } else if (this.Report_Type == "Mandate_Letter_Export") {
        this.PrepareLimit_Action_URL =
          "reports/MandateLetterExport/PrepareLimit";
        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/reports/MandateLetterExport/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL =
          "reports/MandateLetterExport/Prepre_Excel";
      } else if (this.Report_Type == "SAIBA_Export") {
        this.PrepareLimit_Action_URL =
          "../v2/reports/SAIBA_Report/PrepareLimit";

        this.RunLimitsLoop_Action_URL =
          environment.apiUrlBmsBase +
          "/../v2/reports/SAIBA_Report/PrepareExcelDataWithLimit";
        this.Prepre_Excel_Action_URL =
          "../v2/reports/SAIBA_Report/Prepre_Excel";
      }

      if (
        (this.api.GetUserData("User_Role") == "SuperAdmin" &&
          this.Report_Type == "SuperAdmin") ||
        (this.UserRights["Is_Brokerage"] == "1" &&
          this.UserRights["Is_Bussiness_Report"] == "1" &&
          this.Report_Type == "SuperAdmin")
      ) {
        //alert(this.Report_Type);
        //this.AdminPrepareLimit();
        this.CustomizeReportExport();
      } else if (this.Report_Type == "MotorNonMotorHealth_Customize") {
        this.CustomizeReportExport();
      } else if (this.Report_Type == "partner_login_report") {
        this.CustomizeReportExport();
      } else {
        // Sales User
        this.PrepareLimit();
      }
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetUserRigths() {
    this.api.IsLoading();
    this.api
      .Call(
        "sr/Agent/SearchComponentsData?portal=crm&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.UserRights = result["Data"]["SR_User_Rights"];
            this.loadData();
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();

          //alert(err.message);
        }
      );
  }

  PrepareLimit() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("SQL_Where", this.SQL_Where_STR);
    formData.append("DateRangeValue", this.DateRangeValue);

    //this.api.IsLoading();
    this.api.HttpPostType(this.PrepareLimit_Action_URL, formData).then(
      (result: any) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          //this.api.ToastMessage(result['Message']);

          if (this.Report_Type == "SAIBA_Export") {
            this.CloseModel();

            this.Is_Prepre_Excel = 0;
            this.Percentage_Slot = 0;
            this.Is_Download = 1;
            //window.open(result['DownloadUrl']);
            this.DownloadUrl = result["DownloadUrl"];

            window.open(result["DownloadUrl"]);
          }
          this.Limits = result["Limits"];
          this.Export_Id = result["Export_Id"];
          // console.log(this.Limits);

          this.RunLimitsLoop();
        } else {
          //alert(result['Message']);
          this.api.ErrorMsg(result["Message"]);
          this.CloseModel();
        }
      },
      (err) => {
        //this.api.HideLoading();
        // console.log(err.message);
        this.api.ErrorMsg(err.message);
        this.CloseModel();
      }
    );
  }

  async RunLimitsLoop() {
    this.Percentage_Slot = 1;

    for (let i = 0; i < this.Limits.length; i++) {
      var limitArea = this.Limits[i];

      var url =
        this.RunLimitsLoop_Action_URL +
        "?portal=crm&User_Id=" +
        this.api.GetUserId() +
        "&Export_Id=" +
        this.Export_Id +
        "&limit=" +
        limitArea;

      await this.http
        .get<any>(
          this.api.additionParmsEnc(url),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
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
              .Call(
                this.Prepre_Excel_Action_URL +
                  "?portal=crm&Export_Id=" +
                  this.Export_Id +
                  "&User_Id=" +
                  this.api.GetUserId()
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
                    if (this.Report_Type == "PartnerStatementMail") {
                      this.dialogRef.close({
                        DownloadUrl: this.DownloadUrl,
                      });
                    }
                  } else {
                    this.api.ErrorMsg(result["Message"]);
                    this.CloseModel();
                  }
                },
                (err) => {
                  // console.log(err.message);
                  this.api.ErrorMsg(err.message);
                  this.CloseModel();
                }
              );
          }
        });
    }
  }

  AdminPrepareLimit() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("SQL_Where", this.SQL_Where_STR);
    formData.append("DateRangeValue", this.DateRangeValue);

    //this.api.IsLoading();
    this.api.HttpPostType("reports/AdminSrReport/PrepareLimit", formData).then(
      (result) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          //this.api.ToastMessage(result['Message']);
          //window.open(result['DownloadUrl']);
          this.Limits = result["Limits"];
          this.Export_Id = result["Export_Id"];
          // console.log(this.Limits);

          this.AdminRunLimitsLoop();
        } else {
          //alert(result['Message']);
          this.api.ErrorMsg(result["Message"]);
          this.CloseModel();
        }
      },
      (err) => {
        //this.api.HideLoading();
        // console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  async AdminRunLimitsLoop() {
    this.Percentage_Slot = 1;

    for (let i = 0; i < this.Limits.length; i++) {
      var limitArea = this.Limits[i];

      var url =
        environment.apiUrlBmsBase +
        "/reports/AdminSrReport/PrepareExcelDataWithLimit?User_Id=" +
        this.api.GetUserId() +
        "&Export_Id=" +
        this.Export_Id +
        "&limit=" +
        limitArea;

      await this.http
        .get<any>(
          this.api.additionParmsEnc(url),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
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
              .Call(
                "reports/AdminSrReport/Prepre_Excel?Export_Id=" +
                  this.Export_Id +
                  "&User_Id=" +
                  this.api.GetUserId()
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
                  } else {
                    this.api.ErrorMsg(result["Message"]);
                  }
                },
                (err) => {
                  // console.log(err.message);
                  this.api.ErrorMsg(err.message);
                  this.CloseModel();
                }
              );
          }
        });
    }
  }

  CustomizeReportExportBms() {
    // alert(132);
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("SQL_Where", this.SQL_Where_STR);
    formData.append("portal", "crm");

    this.Is_Prepre_Excel = 1;
    this.Percentage_Slot = 100;
    //this.api.IsLoading();
    // this.api.HttpPostType("reports/CustomizeReport/Sales", formData).then(
    //   (result) => {
    //     //this.api.HideLoading();
    //     if (result["Status"] == true) {
    //       //this.api.ToastMessage(result['Message']);
    //       this.Is_Prepre_Excel = 0;
    //       this.Percentage_Slot = 0;
    //       this.Is_Download = 1;

    //       //window.open(result['DownloadUrl']);
    //       this.DownloadUrl = result["DownloadUrl"];
    //     } else {
    //       this.api.ErrorMsg(result["Message"]);
    //       this.CloseModel();
    //     }
    //   },
    //   (err) => {
    //     //this.api.HideLoading();
    //     // console.log(err.message);
    //     this.api.ErrorMsg(err.message);
    //     this.CloseModel();
    //   }
    // );
  }

  CustomizeReportExport() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("SQL_Where", this.SQL_Where_STR);
    formData.append("portal", "crm");

    this.Is_Prepre_Excel = 1;
    this.Percentage_Slot = 100;
    //this.api.IsLoading();
    this.api.HttpPostType("reports/CustomizeReport/Sales", formData).then(
      (result) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          //this.api.ToastMessage(result['Message']);
          this.Is_Prepre_Excel = 0;
          this.Percentage_Slot = 0;
          this.Is_Download = 1;

          //window.open(result['DownloadUrl']);
          this.DownloadUrl = result["DownloadUrl"];
        } else {
          this.api.ErrorMsg(result["Message"]);
          this.CloseModel();
        }
      },
      (err) => {
        //this.api.HideLoading();
        // console.log(err.message);
        this.api.ErrorMsg(err.message);
        this.CloseModel();
      }
    );
  }

  ClickToDownload() {
    this.CloseModel();
    window.open(this.DownloadUrl);
  }

  PrepareLimit_Scheduler() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("SQL_Where", this.SQL_Where_STR);
    formData.append("DateRangeValue", this.DateRangeValue);
    formData.append("portal", "crm");

    //this.api.IsLoading();
    this.api.HttpPostType(this.PrepareLimit_Action_URL, formData).then(
      (result) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          //this.api.ToastMessage(result['Message']);
          //window.open(result['DownloadUrl']);
          this.Limits = result["Limits"];
          this.Export_Id = result["Export_Id"];
          //// console.log(this.Limits);
          this.Percentage_Slot = 99;
          this.ReportType_Str = result["totalCulationTime"];
          this.RunLimitsLoop_Scheduler();
        } else {
          //alert(result['Message']);
          this.api.ErrorMsg(result["Message"]);
          this.CloseModel();
        }
      },
      (err) => {
        //this.api.HideLoading();
        // console.log(err.message);
        this.api.ErrorMsg(err.message);
        this.CloseModel();
      }
    );
  }

  async RunLimitsLoop_Scheduler() {
    //this.Percentage_Slot = 99;

    for (let i = 0; i < this.Limits.length; i++) {
      var limitArea = this.Limits[i]["Limitvalue"];

      var url =
        this.RunLimitsLoop_Action_URL +
        "?portal=crm&User_Id=" +
        this.api.GetUserId() +
        "&Export_Id=" +
        this.Export_Id +
        "&limit=" +
        limitArea;

      await this.http
        .get<any>(
          this.api.additionParmsEnc(url),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //this.Percentage_Slot = (this.Percentage_Slot+data.Percentage_Slot);
          this.ReportType_Str = data["totalCulationTime"];
          this.Percentage_Slot = 99;

          if (data.totalCulationTime == 0) {
            this.api.ToastMessage(data["Message"]);
            this.CloseModel();
          }
        });
    }
  }
}
