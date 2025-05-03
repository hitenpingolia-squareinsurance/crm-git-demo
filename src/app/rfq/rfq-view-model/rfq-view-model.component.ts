import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-rfq-view-model",
  templateUrl: "./rfq-view-model.component.html",
  styleUrls: ["./rfq-view-model.component.css"],
})
export class RfqViewModelComponent implements OnInit {
  id: any;
  row: any;
  BaseUrl: any;
  name: string | Blob;
  myFiles: any = [];
  multiple_banar: string[] = [];
  Banner: any;
  snackbar_msg: any;
  youtubelinkmsg: any;
  dataArr: any;
  Quotation_Id: any;
  dataArrLoop: any;
  urlSegment: string;
  dataAr: any;
  // LogData: any[] = [];
  today = new Date();
  todaysDataTime = "";
  isSubmitted = false;
  Ids: any;
  showInputField = false;
  GetSingleData: any;
  Status: any;
  RejectedStatus: any;
  reject_status: any;
  QuoteAction: any;
  calculatorData: any;
  fireExpiringId: any;
  action_time: any;
  currentUrl: string;
  Url: string;
  Url2: string;
  dataArrEdtit: any;
  dataDownload: any;
  Time = "";
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RfqViewModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.todaysDataTime = formatDate(
      this.today,
      "dd-MM-yyyy hh:mm:ss a",
      "en-US",
      "+0530"
    );

    this.Quotation_Id = data.id;
    this.currentUrl = this.router.url;
    this.urlSegment = this.router.url;
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.Url = splitted[1];
      this.Url2 = splitted[2];
    }
  }

  ngOnInit() {
    // this.id = this.data.id;
    this.Get();
    this.getdata();
    this.OfflineEditFormLog();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
    this.Get();
  }

  closeModelAndNavigate(quotation: string): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
    this.router.navigate(["/rfq/Edit-Fire-Form", quotation]);
  }

  Get() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Rfq/SingleData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Quotation_Id
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.row = result["data"];
            this.calculatorData = result["calculatorData"];
            this.RejectedStatus = result["RejectedStatus"];
            this.Status = result["Status"];
            // this.LogData = result["sql_datatype"];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
            // console.log("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          ////   //   console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  timeAgo() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Rfq/timeAgo?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Quotation_Id +
          "&time=" +
          this.Time // Add the time parameter
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.row = result["data"];
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  // ViewDocument(url) {
  //   // alert(url);
  //   window.open(url, "", "left=100,top=50,width=800%,height=600");
  // }
  encodeData(data) {
    return btoa(data); // Base64 encoding
  }

  //   getWhatsAppShareLink(): string {
  //     const message = 'https://crm.squareinsurance.in' + this.ViewLogs();
  //     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  //     window.open("https://crm.squareinsurance.in/backuplivelife_uat/api/Rfq/GetLogsByID?QuoteId="+id,"", "left=100,top=50,width=800%,height=600");

  //     return whatsappUrl;
  // }

  ViewLogs(id: any) {
    const userId = this.encodeData(this.api.GetUserData("Id"));
    const userType = this.encodeData(this.api.GetUserType());
    const quoteId = encodeURIComponent(id);
    window.open(
      `https://crm.squareinsurance.in/backuplivelife_uat/api/Rfq/GetLogsByID?QuoteId=${quoteId}&UserId=${userId}&UserType=${userType}`,
      "",
      "left=100,top=50,width=800%,height=600"
    );
  }

  getdata() {
    this.api.IsLoading();
    this.api
      .HttpGetType("Rfq/OfflineQuoteslog?QuoteId=" + this.Quotation_Id)
      .then(
        (result) => {
          this.api.HideLoading();
          this.dataArr = result;
        },
        (err) => {
          this.api.HideLoading();
          this.dataArr = err["error"]["text"];
          // console.log( this.dataArr);
        }
      );
  }

  OfflineEditFormLog() {
    this.api.IsLoading();
    this.api
      .HttpGetType("Rfq/OfflineEditFormLog?QuoteId=" + this.Quotation_Id)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.dataArrEdtit = result["data"];
            // console.log(this.dataArrEdtit);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.dataArr = err["error"]["text"];
          // console.log( this.dataArr);
        }
      );
  }

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  downloadLeadExcel(quotation_id: any) {
    this.api.IsLoading();
    const formData = new FormData();
    formData.append("quotation_id", quotation_id);
    this.api
      .HttpPostType("Rfq/downloadLeadPDF?Url=" + this.currentUrl, formData)
      .then(
        (resp: any) => {
          this.api.HideLoading();
          if (resp["Status"] == true) {
            this.dataDownload = resp;
            //   //   //   console.log(this.dataDownload);
            window.open(resp["DownloadUrl"]);
            // setTimeout(() => {
            //   window.location.reload();
            // }, 2000);
            // this.Get();
            // this.ResetDT();
          } else {
            this.api.Toast("Warning", resp["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }
}
