import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-payment-frequency",
  templateUrl: "./update-payment-frequency.component.html",
  styleUrls: ["./update-payment-frequency.component.css"],
})
export class UpdatePaymentFrequencyComponent implements OnInit {
  ActionForm: FormGroup;
  isSubmitted = false;
  Id: any;
  Track_Id: any;
  Lob_Name: any;
  row: any;
  User_Rights: any = [];
  FrequencyArray: any = [];
  StepData: any = [];
  RenewalYear: any = 1;

  dropdownSettingsingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialogRef: MatDialogRef<UpdatePaymentFrequencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ActionForm = this.formBuilder.group({
      Payment_Frequency: [""],
      LI_Rider_Premium: [""],
      LI_Rider_Gross_Premium: [""],
      LI_Base_Premium: [""],
      LI_Net_Premium: [""],
      LI_Gross_Premium: [""],
      LI_Rider_Net_Premium: [""],
      LI_Term_Gross_Premium: [""],
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
    this.Id = this.data.Id;
    this.RenewalYear = this.data.RenewalYear;
    this.GetSR();

    this.FrequencyArray = [
      { Id: "Monthly", Name: "Monthly" },
      { Id: "Quarterly", Name: "Quarterly" },
      { Id: "Half Yearly", Name: "Half Yearly" },
      { Id: "Yearly", Name: "Yearly" },
    ];
  }

  get FC_6() {
    return this.ActionForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== GET SR DETAILS =====//
  GetSR() {
    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("Lob_Name", "LI");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/GetSrStatusDetails", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.User_Rights = result["SR_User_Rights"];
          this.StepData = result["Data"];
          // console.log(this.StepData);
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  //===== SUBMIT STEP 6 DATA =====//
  UpdatePaymentFrequency() {
    var fields = this.ActionForm.value;

    const formData = new FormData();

    formData.append("SR_Id", this.Id);
    formData.append("LOB_Id", "LI");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Payment_Frequency",
      JSON.stringify(fields["Payment_Frequency"])
    );

    formData.append("LI_Rider_Premium", fields["LI_Rider_Premium"]);
    formData.append("LI_Rider_Gross_Premium", fields["LI_Rider_Gross_Premium"]);
    formData.append("LI_Base_Premium", fields["LI_Base_Premium"]);

    formData.append("LI_Term_Net_Premium", fields["LI_Term_Net_Premium"]);
    formData.append("LI_Term_Gross_Premium", fields["LI_Term_Gross_Premium"]);

    formData.append("LI_Net_Premium", fields["LI_Net_Premium"]);
    formData.append("LI_Gross_Premium", fields["LI_Gross_Premium"]);
    formData.append("StepData", JSON.stringify(this.StepData));

    this.api.IsLoading();
    this.api.HttpForSR("post", "Renewal/UpdatePaymentFrequency", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.api.Toast("Success", result["Message"]);
          this.CloseModel();
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  //===== CALUATION =====//
  Calculation(type: any) {
    var fields = this.ActionForm.value;
    const formData = new FormData();

    formData.append("Step_Id", this.Id);
    formData.append("LOB_Id", "LI");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    formData.append("CurrentInput", type);

    formData.append("LI_Rider_Premium", fields["LI_Rider_Premium"]);
    formData.append("LI_Rider_Gross_Premium", fields["LI_Rider_Gross_Premium"]);
    formData.append("LI_Base_Premium", fields["LI_Base_Premium"]);

    formData.append("LI_Term_Net_Premium", fields["LI_Term_Net_Premium"]);
    formData.append("LI_Term_Gross_Premium", fields["LI_Term_Gross_Premium"]);

    formData.append("LI_Net_Premium", fields["LI_Net_Premium"]);
    formData.append("LI_Gross_Premium", fields["LI_Gross_Premium"]);
    formData.append("Is_Gst_Applicable", this.StepData["Is_Gst_Applicable"]);
    formData.append("Renewal_Year", this.RenewalYear);
    formData.append("StepData", JSON.stringify(this.StepData));

    //this.api.IsLoading();
    this.api.HttpForSR("post", "Calculation/index", formData).then(
      (result) => {
        if (result["Status"] == true) {
          var res = result["Data"];

          var LI_Rider_Premium_Control =
            this.ActionForm.get("LI_Rider_Premium");
          var LI_Rider_Gross_Premium_Control = this.ActionForm.get(
            "LI_Rider_Gross_Premium"
          );

          var LI_Term_Net_Premium_Control = this.ActionForm.get(
            "LI_Term_Net_Premium"
          );
          var LI_Term_Gross_Premium_Control = this.ActionForm.get(
            "LI_Term_Gross_Premium"
          );

          var LI_Net_Premium_Control = this.ActionForm.get("LI_Net_Premium");
          var LI_Gross_Premium_Control =
            this.ActionForm.get("LI_Gross_Premium");

          if (type == "LI_Rider_Premium") {
            LI_Rider_Gross_Premium_Control.setValue(
              res["Estimated_Rider_Gross_Premium"]
            );
            LI_Rider_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "LI_Rider_Gross_Premium") {
            LI_Rider_Premium_Control.setValue(res["Rider_Net_Premium"]);
            LI_Rider_Premium_Control.updateValueAndValidity();
          }

          if (type == "Term_Net_Premium_LI") {
            LI_Term_Gross_Premium_Control.setValue(
              res["Estimated_Gross_Premium"]
            );
            LI_Term_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "Term_Gross_Premium_LI") {
            LI_Term_Net_Premium_Control.setValue(res["Net_Premium"]);
            LI_Term_Net_Premium_Control.updateValueAndValidity();
          }

          if (type == "Net_Premium_LI") {
            LI_Gross_Premium_Control.setValue(res["Estimated_Gross_Premium"]);
            LI_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "Gross_Premium_LI") {
            LI_Net_Premium_Control.setValue(res["Net_Premium"]);
            LI_Net_Premium_Control.updateValueAndValidity();
          }
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }
}
