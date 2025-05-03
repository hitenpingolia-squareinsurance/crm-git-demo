import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewgemsdetailspopupComponent } from "../../modals/viewgemsdetailspopup/viewgemsdetailspopup.component";
import { empty } from "rxjs";

@Component({
  selector: "app-gems-wallet",
  templateUrl: "./gems-wallet.component.html",
  styleUrls: ["./gems-wallet.component.css"],
})
export class GemsWalletComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  ViewRequests: any;
  TotalBalance: any;
  ReedembalePoints: any;
  BalancePoints: any;
  reedemedpoints: any;
  SR_Session_Year = [
    { Id: "2025-26", Name: "2025-26" },
    { Id: "2024-25", Name: "2024-25" },
    { Id: "2017-24", Name: "2017-24" },
  ];
  dropdownSettingsingleselect: any = {};
  financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.AddForm = this.formBuilder.group({
      FinancialYear: ["", [Validators.required]],
      ReedemPoint: ["", [Validators.required]],
      Remarks: ["", [Validators.required]],
      TotalWalletBalance: ["", [Validators.required]],
    });
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.AddForm.get("TotalWalletBalance").setValue("0");
    this.ViewRequest();
    this.onkeypress();
  }

  getFinancialYears(): Array<{ id: string; name: string }> {
    const financialYears = [];
    financialYears.push();

    // return;
    // for (let year = 2017; year < 2025; year++) {
    //   const financialYear = `${year}-${(year + 1).toString().slice(-2)}`;
    //   financialYears.push({ Id: financialYear, Name: financialYear });
    // }
    return financialYears;
  }

  ReedemAmountCalculation() {
    const formData = new FormData();
    var fields = this.AddForm.value;

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append(
      "financialyear",
      JSON.stringify(fields["FinancialYear"][0]["Id"])
    );
    formData.append("Portal", "");

    this.api.HttpPostType("GemsWallet/GetWalletBalance", formData).then(
      (result) => {
        if (result["status"] == 1) {
          this.TotalBalance = result["TotalPoints"];
          this.AddForm.get("TotalWalletBalance").setValue(
            result["ReedememblePoints"]
          );
          this.ReedembalePoints = result["ReedememblePoints"];
          this.BalancePoints = result["BalancePoints"];
          this.reedemedpoints = result["withdraw_points"];
        } else {
          this.TotalBalance = 0;
          this.AddForm.get("TotalWalletBalance").setValue(
            result["ReedememblePoints"]
          );
          this.ReedembalePoints = 0;
          this.BalancePoints = 0;
          this.reedemedpoints = 0;
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
    // alert(TotalWalletBalance);
    if (TotalWalletBalance > ReedemPoint) {
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
      const ReedemPoint = this.AddForm.get("ReedemPoint");

      ReedemPoint.setValidators([
        Validators.pattern("[0-9]*"),
        Validators.required,
        Validators.min(500),
        Validators.max(TotalWalletBalance),
      ]);
      ReedemPoint.updateValueAndValidity();
    }

    // this.ViewRequest();
  }

  get formControls() {
    return this.AddForm.controls;
  }
  AddGemsForm() {
    this.isSubmitted = true;
    // console.log(this.AddForm.invalid);

    // this.onkeypress();

    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;

      // console.log(fields);
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("RedeemPoint", fields["ReedemPoint"]);
      formData.append("Remarks", fields["Remarks"]);
      formData.append("TotalWalletBalance", fields["TotalWalletBalance"]);
      formData.append("Agent_Code", this.api.GetUserData("Code"));
      formData.append("financialyear", fields["FinancialYear"][0]["Id"]);

      var TotalWalletBalance = fields["TotalWalletBalance"];
      var RedeemPointss = fields["ReedemPoint"];

      // console.log(fields);
      // console.log(formData);
      // return false;
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "GemsWallet/CreateRewardRequest/" +
            TotalWalletBalance +
            "/" +
            RedeemPointss,
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            // console.log(result);

            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);

              this.AddForm.get("ReedemPoint").setValue("");
              this.AddForm.get("Remarks").setValue("");
              // this.AddForm.reset();
              // this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];

              // this.router.navigate(["Wallet/gems-wallet"]);
              this.ViewRequest();
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

  ViewGemsDetails() {
    var fields = this.AddForm.value;
    var FinancialYear = "2024-25";
    if (fields["FinancialYear"] !== "") {
      var FinancialYear = "2024-25";
    } else {
      FinancialYear = JSON.stringify(fields["FinancialYear"][0]["Id"]);
    }

    const dialogRef = this.dialog.open(ViewgemsdetailspopupComponent, {
      width: "60%",
      height: "60%",
      data: {
        Id: btoa(this.api.GetUserData("Id")),
        FinancialYear: FinancialYear,
        Type: "Wallet",
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  ViewRequest() {
    var fields = this.AddForm.value;
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    if (fields["FinancialYear"] == "") {
      formData.append("financialyear", "2024-25");
    } else {
      formData.append(
        "financialyear",
        JSON.stringify(fields["FinancialYear"][0]["Id"])
      );
    }

    this.api.HttpPostType("GemsWallet/ViewRequests", formData).then(
      (result) => {
        this.ViewRequests = result;
        this.ReedemAmountCalculation();
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
