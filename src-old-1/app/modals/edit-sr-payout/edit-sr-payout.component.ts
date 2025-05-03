import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-sr-payout",
  templateUrl: "./edit-sr-payout.component.html",
  styleUrls: ["./edit-sr-payout.component.css"],
})
export class EditSrPayoutComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  SR_Id: any;
  SR_Index: any;
  SR_Ar: any = [];

  constructor(
    public dialogRef: MatDialogRef<EditSrPayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.PayInForm = this.fb.group({
      PayInOD: [""],
      PayOutOD: [""],
      PayInTP: [""],
      PayOutTP: [""],

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

    this.api.IsLoading();
    this.api.HttpPostType("reports/PayoutPosting/GetSRData", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.SR_Ar = result["Data"];

          this.PayInForm.get("PayInOD").setValue(this.SR_Ar["Web_Payin_OD"]);
          this.PayInForm.get("PayOutOD").setValue(
            this.SR_Ar["Web_Agent_Payout_OD"]
          );

          this.PayInForm.get("PayInTP").setValue(this.SR_Ar["Web_Payin_TP"]);
          this.PayInForm.get("PayOutTP").setValue(
            this.SR_Ar["Web_Agent_Payout_TP"]
          );

          this.PayInForm.get("PayInReward").setValue(
            this.SR_Ar["Web_Payin_Reward_Amount"]
          );
          this.PayInForm.get("PayOutReward").setValue(
            this.SR_Ar["Web_Agent_Reward_Amount"]
          );

          this.PayInForm.get("PayInScheme").setValue(
            this.SR_Ar["Web_Payin_Scheme_Amount"]
          );
          this.PayInForm.get("PayOutScheme").setValue(
            this.SR_Ar["Web_Agent_Scheme_Amount"]
          );
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
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

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("SR_Id", this.SR_Id);

      formData.append("PayInOD", fields["PayInOD"]);
      formData.append("PayOutOD", fields["PayOutOD"]);
      formData.append("PayInTP", fields["PayInTP"]);
      formData.append("PayOutTP", fields["PayOutTP"]);

      formData.append("PayInReward", fields["PayInReward"]);
      formData.append("PayOutReward", fields["PayOutReward"]);
      formData.append("PayInScheme", fields["PayInScheme"]);
      formData.append("PayOutScheme", fields["PayOutScheme"]);

      this.api.IsLoading();
      this.api
        .HttpPostType("reports/PayoutPosting/PayoutUpdateBySR", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);
              this.dialogRef.close({
                SR_Id: this.SR_Id,
                UpdateIndex: this.SR_Index,
                Payout_Update_Columns: result["Payout_Update_Column"],
              });
            } else {
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error, Please try again ! " + err.message
            );
          }
        );
    }
  }
}
