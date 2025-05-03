import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-brokrage-request-loader",
  templateUrl: "./brokrage-request-loader.component.html",
  styleUrls: ["./brokrage-request-loader.component.css"],
})
export class BrokrageRequestLoaderComponent implements OnInit {
  Percentage_Slot: any = 1;
  Type: any;
  Payout_Mode: any;
  TotalRequest: any;
  Store_Id: any;
  url: any;

  constructor(
    public dialogRef: MatDialogRef<BrokrageRequestLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService,
    private http: HttpClient
  ) {
    this.Type = this.data.Type;
    this.Payout_Mode = this.data.Payout_Mode;
    this.TotalRequest = this.data.TotalRequest;
    this.Store_Id = this.data.Store_Id;

    if (this.Type == "Posting") {
      this.url =
        environment.apiUrlBmsBase +
        "/brokerage/LPA_PayoutPosting/PrepareRequestChunks";
    } else if (this.Type == "PayoutRequest") {
      this.url =
        environment.apiUrlBmsBase +
        "/brokerage/LPA_PayoutRequest/PrepareRequestChunks";
    } else if (this.Type == "UpdateUTRNo") {
      this.url =
        environment.apiUrlBmsBase +
        "/brokerage/LPA_PayoutRequest/UpdateUTRNOChunks";
    } else if (this.Type == "BBR_Request") {
      this.url =
        environment.apiUrlBmsBase + "/brokerage/BBR/LPA_PrepareRequestChunks";
    }

    this.PrepareRequestChunks();
  }

  ngOnInit() {}

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  async PrepareRequestChunks() {
    for (let i = 0; i < this.TotalRequest; i++) {
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Payout_Mode", this.Payout_Mode);
      formData.append("Store_Id", this.Store_Id);

      await this.http
        .post<any>(
          this.api.additionParmsEnc(this.url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //// console.log(data.Agent_Id);
          if (data.Status == true) {
            if (data.PendingRequests == 0) {
              this.Percentage_Slot = 100;
              this.CloseModel();
              this.api.ToastMessage(data.Message);
            } else {
              this.Percentage_Slot = (
                parseFloat(this.Percentage_Slot) +
                parseFloat(data.Percentage_Slot)
              ).toFixed(2);
            }
          } else {
            this.api.ToastMessage(data.Message);
          }
        });
    }
  }
}
