import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-editsrpayout",
  templateUrl: "./editsrpayout.component.html",
  styleUrls: ["./editsrpayout.component.css"],
})
export class EditsrpayoutComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  SR_Id: any;
  SR_Index: any;
  SR_Ar: any = [];

  constructor(
    public dialogRef: MatDialogRef<EditsrpayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.PayInForm = this.fb.group({
      PayInTerrorism: [""],
      PayOutTerrorism: [""],

      PayInOD: [""],
      PayOutOD: [""],
      PayInTP: [""],
      PayOutTP: [""],
      PayInNet: [""],
      PayOutNet: [""],

      PayInReward: [""],
      PayOutReward: [""],
      PayInScheme: [""],
      PayOutScheme: [""],
    });
  }

  ngOnInit() {
    this.SR_Id = this.data.Id;
    this.SR_Index = this.data.Edit_Index;
    this.GetSR();
  }

  get FC() {
    return this.PayInForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetSR() {
    const formData = new FormData();
    formData.append("SR_Id", this.SR_Id);
    formData.append("User_Id", this.api.GetUserId());

    this.api.IsLoading();
    this.api.HttpPostType("brokerage/LPA_PostingData/GetSRData", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.SR_Ar = result["Data"];

          this.PayInForm.get("PayInTerrorism").setValue(
            this.SR_Ar["Agent_Terrorism_PayIn"]
          );
          this.PayInForm.get("PayOutTerrorism").setValue(
            this.SR_Ar["Agent_Terrorism_Payout"]
          );

          this.PayInForm.get("PayInOD").setValue(this.SR_Ar["Payin_OD"]);
          this.PayInForm.get("PayOutOD").setValue(
            this.SR_Ar["Agent_Payout_OD"]
          );

          this.PayInForm.get("PayInTP").setValue(this.SR_Ar["Payin_TP"]);
          this.PayInForm.get("PayOutTP").setValue(
            this.SR_Ar["Agent_Payout_TP"]
          );

          this.PayInForm.get("PayInNet").setValue(this.SR_Ar["Payin_Net"]);
          this.PayInForm.get("PayOutNet").setValue(
            this.SR_Ar["Agent_Payout_Net"]
          );

          this.PayInForm.get("PayInReward").setValue(
            this.SR_Ar["Payin_Reward_Amount"]
          );
          this.PayInForm.get("PayOutReward").setValue(
            this.SR_Ar["Agent_Reward_Amount"]
          );

          this.PayInForm.get("PayInScheme").setValue(
            this.SR_Ar["Payin_Scheme_Amount"]
          );
          this.PayInForm.get("PayOutScheme").setValue(
            this.SR_Ar["Agent_Scheme_Amount"]
          );
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  PayInOD(e) {
    var PayInOD = e.target.value;
    const PayOutOD_Control = this.PayInForm.get("PayOutOD");
    // console.log(PayInOD);
    // console.log(PayInOD*20/100);
    PayOutOD_Control.setValue(PayInOD - (PayInOD * 20) / 100);
  }

  PayInTP(e) {
    var PayInTP = e.target.value;
    const PayOutTP_Control = this.PayInForm.get("PayOutTP");
    // console.log(PayInTP);
    // console.log(PayInTP*20/100);
    PayOutTP_Control.setValue(PayInTP - (PayInTP * 20) / 100);
  }

  PayInNet(e) {
    var PayInNet = e.target.value;
    const PayOutNet_Control = this.PayInForm.get("PayOutNet");
    // console.log(PayInNet);
    // console.log(PayInNet*20/100);
    PayOutNet_Control.setValue(PayInNet - (PayInNet * 20) / 100);
  }

  PayInTerrorism(e) {
    var PayInTerrorism = e.target.value;
    const PayOutTerrorism_Control = this.PayInForm.get("PayOutTerrorism");
    // console.log(PayInTerrorism);
    // console.log(PayInTerrorism*20/100);
    PayOutTerrorism_Control.setValue(
      PayInTerrorism - (PayInTerrorism * 20) / 100
    );
  }

  PayInReward(e) {
    var PayInReward = e.target.value;
    const PayInRewardNet_Control = this.PayInForm.get("PayOutReward");
    // console.log(PayInReward);
    // console.log(PayInReward*20/100);
    PayInRewardNet_Control.setValue(PayInReward - (PayInReward * 20) / 100);
  }

  PayInScheme(e) {
    var PayInScheme = e.target.value;
    const PayOutSchemeNet_Control = this.PayInForm.get("PayOutScheme");
    // console.log(PayInScheme);
    // console.log(PayInScheme*20/100);
    PayOutSchemeNet_Control.setValue(PayInScheme - (PayInScheme * 20) / 100);
  }

  AddPayIn() {
    this.isSubmitted = true;
    if (this.PayInForm.invalid) {
      return;
    } else {
      var fields = this.PayInForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("SR_Id", this.SR_Id);

      formData.append("PayInTerrorism", fields["PayInTerrorism"].toFixed(2));
      formData.append("PayOutTerrorism", fields["PayOutTerrorism"].toFixed(2));

      formData.append("PayInOD", fields["PayInOD"].toFixed(2));
      formData.append("PayOutOD", fields["PayOutOD"].toFixed(2));
      formData.append("PayInTP", fields["PayInTP"].toFixed(2));
      formData.append("PayOutTP", fields["PayOutTP"].toFixed(2));

      formData.append("PayInNet", fields["PayInNet"].toFixed(2));
      formData.append("PayOutNet", fields["PayOutNet"].toFixed(2));

      formData.append("PayInReward", fields["PayInReward"].toFixed(2));
      formData.append("PayOutReward", fields["PayOutReward"].toFixed(2));
      formData.append("PayInScheme", fields["PayInScheme"].toFixed(2));
      formData.append("PayOutScheme", fields["PayOutScheme"].toFixed(2));

      this.api.IsLoading();
      this.api
        .HttpPostType("brokerage/LPA_PostingData/PayoutUpdateBySR", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.ToastMessage(result["Message"]);
              this.CloseModel();
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.ErrorMsg(
              "Network Error, Please try again ! " + err.message
            );
          }
        );
    }
  }
}
