import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
// import { ViewgemsdetailspopupComponent } from "src/app/modals/viewgemsdetailspopup/viewgemsdetailspopup.component";

@Component({
  selector: "app-gems-transaction",
  templateUrl: "./gems-transaction.component.html",
  styleUrls: ["./gems-transaction.component.css"],
})
export class GemsTransactionComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  ViewRequests: any;
  TotalBalance: any;
  loginId: any;
  logintype: string;
  FinancialYear: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GemsTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loginId = this.data.Id;
    this.FinancialYear = this.data.FinancialYear;
    this.logintype = "agent";

    this.AddForm = this.formBuilder.group({
      ReedemPoint: ["", [Validators.required]],
      Remarks: ["", [Validators.required]],
      TotalWalletBalance: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.ViewRequest();
    this.AddForm.get("TotalWalletBalance").setValue("0");

    this.onkeypress();
    this.ReedemAmountCalculation();
  }
  CloseModel(): void {
    this.dialogRef.close({});
  }

  ReedemAmountCalculation() {
    const formData = new FormData();
    formData.append("User_Id", this.loginId);
    formData.append("User_Type", this.logintype);
    formData.append("Portal", "Bms");
    formData.append("financialyear", this.FinancialYear);

    this.api.HttpPostType("GemsWallet/GetWalletBalance", formData).then(
      (result) => {
        if (result["status"] == 1) {
          this.TotalBalance = result["RemainingPoints"];
          this.AddForm.get("TotalWalletBalance").setValue(this.TotalBalance);
        } else {
          this.TotalBalance = 0;
          this.AddForm.get("TotalWalletBalance").setValue(this.TotalBalance);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  onkeypress() {
    // alert();
    var fields = this.AddForm.value;

    // const From_Netpremium1 = this.SearchForm.get("From_Netpremium").value();
    // const To_Netpremium1 = this.SearchForm.get("To_Netpremium").value();

    var TotalWalletBalance = fields["TotalWalletBalance"];
    var ReedemPoint = fields["ReedemPoint"];

    if (TotalWalletBalance > ReedemPoint) {
      // alert();

      const ReedemPoint = this.AddForm.get("ReedemPoint");

      ReedemPoint.setValidators([
        Validators.pattern("[0-9]*"),
        Validators.required,
        Validators.min(500),
        Validators.max(TotalWalletBalance),
      ]);
      ReedemPoint.updateValueAndValidity();
    }
    if (ReedemPoint < TotalWalletBalance) {
      // alert();

      const ReedemPoint = this.AddForm.get("ReedemPoint");

      ReedemPoint.setValidators([
        Validators.pattern("[0-9]*"),
        Validators.required,
        Validators.min(500),
        Validators.max(TotalWalletBalance),
      ]);
      ReedemPoint.updateValueAndValidity();
    }
  }

  get formControls() {
    return this.AddForm.controls;
  }
  AddGemsForm() {
    this.isSubmitted = true;
    // console.log(this.AddForm.invalid);
    this.onkeypress();

    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;
      const formData = new FormData();
      formData.append("login_id", this.loginId);
      formData.append("login_type", this.logintype);
      formData.append("RedeemPoint", fields["ReedemPoint"]);
      formData.append("Remarks", fields["Remarks"]);
      formData.append("TotalWalletBalance", fields["TotalWalletBalance"]);
      formData.append("financialyear", this.FinancialYear);

      this.api.IsLoading();
      this.api.HttpPostType("GemsWallet/CreateRewardRequest", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.AddForm.reset();
            // this.router.navigate(["Wallet/gems-wallet"]);
            this.ViewRequest();
            this.ReedemAmountCalculation();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  // ViewGemsDetails(Id: number,FinancialYear:string) {

  //   const dialogRef = this.dialog.open(ViewgemsdetailspopupComponent, {
  //     width: '60%',
  //     height: '60%',
  //     data: { Id: btoa(this.api.GetUserData("Id")),FinancialYear:'123',Type:'Wallet' },
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }

  ViewRequest() {
    const formData = new FormData();
    formData.append("User_Id", this.loginId);
    formData.append("User_Type", this.logintype);
    formData.append("Portal", "Bms");
    formData.append("financialyear", this.FinancialYear);

    this.api.HttpPostType("GemsWallet/ViewRequests", formData).then(
      (result) => {
        this.ViewRequests = result;
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
}
