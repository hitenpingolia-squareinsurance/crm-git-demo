import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";
@Component({
  selector: "app-add-sr-recovery-report",
  templateUrl: "./add-sr-recovery-report.component.html",
  styleUrls: ["./add-sr-recovery-report.component.css"],
})
export class AddSrRecoveryReportComponent implements OnInit {
  dataAr: any;
  SearchString: string = "";

  RecoveryType: string = "";
  RecoveryDate: any;
  Remark: any;
  ErrorMsg: string = "Copied to clipboard.";

  Id: any;
  row: any = [];

  Payout_Details: any = [];
  PayoutMaster: any = [];

  User_Rights: any = [];
  Remarks: string;

  OperationsEmp_Ar: any;
  AccountsEmp_Ar: any;

  Operations_User_Id: any = 0;
  Accounts_User_Id: any = 0;

  Agent_Id: any;
  Base_Url: any;
  //row:any=[];
  Documents: any;
  IsDisabled: any = false;
  selectedFiles: File;

  UseFor_IT_SQL: any;

  Salutation_Type: any;
  UserForIT: any;

  SRForm: FormGroup;
  isSubmitted = false;

  Vehicle_Type: string = "GCV"; //GCV,Other  PCV,Two Wheeler,Private Car

  Estimated_Gross_Premium_Total: any;

  Other_TP_Error_Msg: any;
  Net_Premium_Error_Msg: any;

  TP_Premium: any = 0;
  Per_Passenger_Cost: any = 0;
  IsSeatingCapcityEdit: string = "0";

  constructor(
    public dialogRef: MatDialogRef<AddSrRecoveryReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.SRForm = this.formBuilder.group({
      Basic_OD: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Basic_OD_Recover: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Basic_TP: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Other_TP: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      PA_Owner_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Net_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Estimated_Gross_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],

      //Terrorism_Premium: ['', [ Validators.pattern("^[0-9]*$") ] ],
      //Sum_Insured: ['', [ Validators.pattern("^[0-9]*$") ] ],

      PayOutOD: [""],
      PayOutOD_Recover: [""],

      PayOutNet: [""],
      PayOutNet_Recover: [""],

      PayOutTP: [""],
      PayOutTP_Recover: [""],

      PayOutReward: [""],
      PayOutReward_Recover: [""],

      PayOutScheme: [""],
      PayOutScheme_Recover: [""],

      /*
		PayInTP: [''],
		PayOutTP: [''],
		
		PayInNet: [''],
		PayOutNet: [''],
		
		PayInReward: [''],
		PayOutReward: [''],
		PayInScheme: [''],
		PayOutScheme: [''],
		*/
      RecoveryDate: ["", [Validators.required]],
      Remark: ["", [Validators.required]],
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  get FC() {
    return this.SRForm.controls;
  }

  onChangeRecoveryType(e) {
    var Type = e.target.value;
    //alert(Type);

    const Basic_OD_Control = this.SRForm.get("Basic_OD");
    const Basic_OD_Recover_Control = this.SRForm.get("Basic_OD_Recover");
    const Basic_TP_Control = this.SRForm.get("Basic_TP");
    const Other_TP_Control = this.SRForm.get("Other_TP");
    const PA_Owner_Premium_Control = this.SRForm.get("PA_Owner_Premium");
    const Net_Premium_Control = this.SRForm.get("Net_Premium");
    const Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );

    if (Type == "Cheque Bounced/Policy Cancelled" || Type == "PO Correction") {
      Basic_OD_Control.setValidators(null);
      Basic_OD_Recover_Control.setValidators(null);
      Basic_TP_Control.setValidators(null);
      Other_TP_Control.setValidators(null);
      PA_Owner_Premium_Control.setValidators(null);
      Net_Premium_Control.setValidators(null);
      Estimated_Gross_Premium_Control.setValidators(null);
    } else if (Type == "Premium Correction") {
      Basic_OD_Control.setValidators([Validators.required]);
      Basic_OD_Recover_Control.setValidators([Validators.required]);
      Basic_TP_Control.setValidators([Validators.required]);
      Other_TP_Control.setValidators([Validators.required]);
      PA_Owner_Premium_Control.setValidators([Validators.required]);
      Net_Premium_Control.setValidators([Validators.required]);
      Estimated_Gross_Premium_Control.setValidators([Validators.required]);
    }

    Basic_OD_Control.updateValueAndValidity();
    Basic_OD_Recover_Control.updateValueAndValidity();
    Basic_TP_Control.updateValueAndValidity();
    Other_TP_Control.updateValueAndValidity();
    PA_Owner_Premium_Control.updateValueAndValidity();
    Net_Premium_Control.updateValueAndValidity();
    Estimated_Gross_Premium_Control.updateValueAndValidity();
  }

  Search() {
    if (this.RecoveryType == "") {
      this.ErrorMsg = "Please choose recovery type !";
      this.Totast();
    } else if (this.SearchString == "") {
      this.ErrorMsg = "Please Enter SR NO/Reg No !";
      this.Totast();
    } else {
      this.api.IsLoading();
      this.api
        .Call(
          "sr/EditSR/ViewById?Type=Recovery&Id=" +
            this.SearchString +
            "&User_Id=" +
            this.api.GetUserId()
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              //this.CloseModel();

              this.row = result["Data"];
              this.User_Rights = result["SR_User_Rights"];
              this.Payout_Details = result["Payout_Details"];
              this.PayoutMaster = result["PayoutMaster"];

              this.Documents = result["Documents"];

              if (
                result["IsDisabled"] === "true" &&
                this.row.SR_Status == "Pending"
              ) {
                this.IsDisabled = false;
              } else {
                this.IsDisabled = true;
              }
              //alert(this.IsDisabled);

              this.Base_Url = result["Base_Url"] + this.row.Id + "/";

              const Class_Id = this.row["Class_Id"];

              if (
                Class_Id == "Public Carrier" ||
                Class_Id == "Private Carrier"
              ) {
                this.Vehicle_Type = "GCV";
              } else {
                this.Vehicle_Type = "Other";
              }

              //alert(this.row['Net_Premium']);

              var Type = this.row["Segment_Id"];

              const Basic_OD_Control = this.SRForm.get("Basic_OD");
              const Basic_TP_Control = this.SRForm.get("Basic_TP");
              const Other_TP_Control = this.SRForm.get("Other_TP");
              var PA_Owner_Premium_Control =
                this.SRForm.get("PA_Owner_Premium");
              var Net_Premium_Control = this.SRForm.get("Net_Premium");
              var Estimated_Gross_Premium_Control = this.SRForm.get(
                "Estimated_Gross_Premium"
              );

              const PayOutOD_Control = this.SRForm.get("PayOutOD");
              const PayOutNet_Control = this.SRForm.get("PayOutNet");
              const PayOutTP_Control = this.SRForm.get("PayOutTP");
              const PayOutReward_Control = this.SRForm.get("PayOutReward");
              const PayOutScheme_Control = this.SRForm.get("PayOutScheme");

              if (Type == "Comprehensive") {
                //Basic_TP_Control.setValue(0);
                //PA_Owner_Premium_Control.setValue(0);

                Basic_OD_Control.setValidators([Validators.required]);
                Basic_OD_Control.enable();

                Basic_TP_Control.setValidators([Validators.required]);
                Basic_TP_Control.enable();
              } else if (Type == "Standalone Third Party") {
                //Basic_TP_Control.setValue(0);
                //PA_Owner_Premium_Control.setValue(0);

                Basic_OD_Control.setValidators(null);
                Basic_OD_Control.disable();

                Basic_TP_Control.setValidators([Validators.required]);
                Basic_TP_Control.enable();
              } else if (Type == "Standalone Own Damage") {
                //Basic_TP_Control.setValue(0);
                //PA_Owner_Premium_Control.setValue(0);

                Basic_OD_Control.setValidators([Validators.required]);
                Basic_OD_Control.enable();

                Basic_TP_Control.setValidators(null);
                Basic_TP_Control.disable();
              }

              Basic_OD_Control.setValue(this.row["Basic_OD"]);
              Basic_TP_Control.setValue(this.row["Basic_TP"]);
              Other_TP_Control.setValue(this.row["Other_TP"]);
              PA_Owner_Premium_Control.setValue(this.row["PA_Owner_Premium"]);
              Net_Premium_Control.setValue(this.row["Net_Premium"]);
              Estimated_Gross_Premium_Control.setValue(
                this.row["Estimated_Gross_Premium"]
              );

              PayOutOD_Control.setValue(this.row["Agent_Payout_OD"]);
              PayOutNet_Control.setValue(this.row["Agent_Payout_Net"]);
              PayOutTP_Control.setValue(this.row["Agent_Payout_TP"]);
              PayOutReward_Control.setValue(this.row["Agent_Reward_Amount"]);
              PayOutScheme_Control.setValue(this.row["Agent_Scheme_Amount"]);

              Basic_OD_Control.updateValueAndValidity();
              Basic_TP_Control.updateValueAndValidity();
              Other_TP_Control.updateValueAndValidity();
              PA_Owner_Premium_Control.updateValueAndValidity();
              Net_Premium_Control.updateValueAndValidity();
              Estimated_Gross_Premium_Control.updateValueAndValidity();

              PayOutOD_Control.updateValueAndValidity();
              PayOutNet_Control.updateValueAndValidity();
              PayOutTP_Control.updateValueAndValidity();
              PayOutReward_Control.updateValueAndValidity();
              PayOutScheme_Control.updateValueAndValidity();
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

  Basic_OD_Recover() {
    var Basic_OD_Recover = this.SRForm.value["Basic_OD_Recover"]
      ? this.SRForm.value["Basic_OD_Recover"]
      : 0;
    var Basic_OD_Control = this.SRForm.get("Basic_OD");

    if (Basic_OD_Recover > this.row["Basic_OD"]) {
      alert("Recover OD Premium Can't Grater than Basic OD !");
      Basic_OD_Control.setValue(this.row["Basic_OD"]);
      this.SRForm.get("Basic_OD_Recover").setValue(null);
    } else {
      Basic_OD_Control.setValue(
        Math.round(this.row["Basic_OD"] - Basic_OD_Recover)
      );
    }

    this.Basic_OD();
  }

  PayoutRecover(e, type) {
    var val = e.target.value;

    const PayOutOD_Control = this.SRForm.get("PayOutOD");
    const PayOutNet_Control = this.SRForm.get("PayOutNet");
    const PayOutTP_Control = this.SRForm.get("PayOutTP");
    const PayOutReward_Control = this.SRForm.get("PayOutReward");
    const PayOutScheme_Control = this.SRForm.get("PayOutScheme");

    if (type == "OD") {
      if (val > this.row["Agent_Payout_OD"]) {
        alert("Pay-Out Recover OD Can't Grater than Pay-Out OD !");
        this.SRForm.get("PayOutOD_Recover").setValue(null);
        PayOutOD_Control.setValue(this.row["Agent_Payout_OD"]);
      } else {
        PayOutOD_Control.setValue(this.row["Agent_Payout_OD"] - val);
      }
    } else if (type == "Net") {
      if (val > this.row["Agent_Payout_Net"]) {
        alert("Pay-Out Recover Net Can't Grater than Pay-Out Net !");
        this.SRForm.get("PayOutNet_Recover").setValue(null);
        PayOutNet_Control.setValue(this.row["Agent_Payout_Net"]);
      } else {
        PayOutNet_Control.setValue(this.row["Agent_Payout_Net"] - val);
      }
    } else if (type == "TP") {
      if (val > this.row["Agent_Payout_TP"]) {
        alert("Pay-Out Recover TP Can't Grater than Pay-Out TP !");
        this.SRForm.get("PayOutTP_Recover").setValue(null);
        PayOutTP_Control.setValue(this.row["Agent_Payout_TP"]);
      } else {
        PayOutTP_Control.setValue(this.row["Agent_Payout_TP"] - val);
      }
    } else if (type == "Reward") {
      if (val > this.row["Agent_Reward_Amount"]) {
        alert("Pay-Out Recover Reward Can't Grater than Pay-Out Reward !");
        this.SRForm.get("PayOutReward_Recover").setValue(null);
        PayOutReward_Control.setValue(this.row["Agent_Reward_Amount"]);
      } else {
        PayOutReward_Control.setValue(this.row["Agent_Reward_Amount"] - val);
      }
    } else if (type == "Scheme") {
      if (val > this.row["Agent_Scheme_Amount"]) {
        alert("Pay-Out Recover Scheme Can't Grater than Pay-Out Scheme !");
        this.SRForm.get("PayOutScheme_Recover").setValue(null);
        PayOutScheme_Control.setValue(this.row["Agent_Scheme_Amount"]);
      } else {
        PayOutScheme_Control.setValue(this.row["Agent_Scheme_Amount"] - val);
      }
    }

    PayOutOD_Control.updateValueAndValidity();
    PayOutNet_Control.updateValueAndValidity();
    PayOutTP_Control.updateValueAndValidity();
    PayOutReward_Control.updateValueAndValidity();
    PayOutScheme_Control.updateValueAndValidity();
  }

  Basic_OD() {
    var Net_Premium_Control = this.SRForm.get("Net_Premium");

    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );

    var Basic_OD = this.SRForm.value["Basic_OD"]
      ? this.SRForm.value["Basic_OD"]
      : 0;
    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;
    var Other_TP = this.SRForm.value["Other_TP"]
      ? this.SRForm.value["Other_TP"]
      : 0;
    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    //Basic_OD = (this.row['Basic_OD']-Basic_OD);

    //// console.log(this.row['Basic_OD']);
    //// console.log(Basic_OD);
    //// console.log(this.Vehicle_Type);

    var Segment_Type = this.row["Segment_Id"];

    if (Segment_Type == "Comprehensive") {
      // Segment Type Comprehensive

      var Net_Premium =
        parseInt(Basic_OD) +
        parseInt(Basic_TP) +
        parseInt(Other_TP) +
        parseInt(PA_Owner_Premium);
      var Net_Premium_V =
        parseInt(Basic_OD) +
        parseInt(Basic_TP) +
        parseInt(Other_TP) +
        parseInt(PA_Owner_Premium);

      Net_Premium_Control.setValue(Net_Premium);

      var GST_AMT = (Net_Premium_V * 18) / 100;
      var Gross_Premium = Net_Premium_V + GST_AMT;

      if (this.Vehicle_Type == "GCV") {
        var six_ = (parseInt(Basic_TP) * 6) / 100;
        Estimated_Gross_Premium_Control.setValue(
          Math.round(Gross_Premium) - six_
        );
      } else {
        Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
      }
    } else if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');
    } else if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');

      var Net_Premium =
        parseInt(Basic_OD) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);
      var Net_Premium_V =
        parseInt(Basic_OD) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      Net_Premium_Control.setValue(Net_Premium);

      var GST_AMT = (Net_Premium_V * 18) / 100;
      var Gross_Premium = Net_Premium_V + GST_AMT;

      Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
    }
  }

  Other_TP() {
    var Basic_OD_Control = this.SRForm.get("Basic_OD");
    var Other_TP_Control = this.SRForm.get("Other_TP");

    var Net_Premium_Control = this.SRForm.get("Net_Premium");
    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );

    var Basic_OD = this.SRForm.value["Basic_OD"]
      ? this.SRForm.value["Basic_OD"]
      : 0;

    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;
    var Other_TP = this.SRForm.value["Other_TP"]
      ? this.SRForm.value["Other_TP"]
      : 0;
    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    var Net_Premium = this.SRForm.value["Net_Premium"]
      ? this.SRForm.value["Net_Premium"]
      : 0;

    var Segment_Type = this.row["Segment_Id"];

    if (Segment_Type == "Comprehensive") {
      // Segment Type Comprehensive

      var Total =
        parseInt(Basic_TP) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      if (Basic_OD <= Other_TP) {
        //// console.log('asdff');
        Other_TP_Control.setValue(0);
        this.Other_TP_Error_Msg =
          "Other TP Can't Grater than Or Equal Final OD !";
        return;
      } else {
        //// console.log('test');
        this.Other_TP_Error_Msg = "";
        Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
      }
    } else if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');
      var Total_Net_Premium =
        parseInt(Basic_TP) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      Net_Premium_Control.setValue(Total_Net_Premium);

      var GST_AMT = (Total_Net_Premium * 18) / 100;
      var Gross_Premium = Total_Net_Premium + GST_AMT;

      if (this.Vehicle_Type == "GCV") {
        var six_ = (Basic_TP * 6) / 100;
        Estimated_Gross_Premium_Control.setValue(
          Math.round(Gross_Premium) - six_
        );
      } else {
        Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
      }
    } // end of segment Type Standalone Third Party
    else if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');
      var Total = parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      if (Basic_OD <= Other_TP) {
        //// console.log('asdff');
        Other_TP_Control.setValue(0);
        this.Other_TP_Error_Msg =
          "Other TP Can't Grater than Or Equal Final OD !";
        return;
      } else {
        //// console.log('test');
        this.Other_TP_Error_Msg = "";
        Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
      }
    } // end of segment Type Standalone wn Damage
  }

  NetPremium() {
    var Basic_OD_Control = this.SRForm.get("Basic_OD");
    var Other_TP_Control = this.SRForm.get("Other_TP");

    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );
    var Net_Premium = this.SRForm.value["Net_Premium"]
      ? this.SRForm.value["Net_Premium"]
      : 0;
    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;

    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    var Segment_Type = this.row["Segment_Id"];

    if (Segment_Type == "Comprehensive") {
      // Segment Type Comprehensive

      var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

      if (Net >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg =
          "Can't less than Or Basic TP + P A Owner !";
        Basic_OD_Control.setValue(0);
        Estimated_Gross_Premium_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        Basic_OD_Control.setValue(Net_Premium - Net);

        var GST_AMT = (parseInt(Net_Premium) * 18) / 100;
        var Gross_Premium = parseInt(Net_Premium) + GST_AMT;

        if (this.Vehicle_Type == "GCV") {
          var six_ = (parseInt(Basic_TP) * 6) / 100;
          Estimated_Gross_Premium_Control.setValue(
            Math.round(Gross_Premium) - six_
          );
        } else {
          Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
        }
      }
    } // end of segment Type Comprehensive
    else if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');

      var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

      if (Net >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg =
          "Can't less than Or Basic TP + P A Owner !";
        Other_TP_Control.setValue(0);
        Estimated_Gross_Premium_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        Other_TP_Control.setValue(Net_Premium - Net);

        var GST_AMT = (parseInt(Net_Premium) * 18) / 100;
        var Gross_Premium = parseInt(Net_Premium) + GST_AMT;

        if (this.Vehicle_Type == "GCV") {
          var six_ = (parseInt(Basic_TP) * 6) / 100;
          Estimated_Gross_Premium_Control.setValue(
            Math.round(Gross_Premium) - six_
          );
        } else {
          Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
        }
      }
    } // end of segment Type Standalone Third Party
    else if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');

      var Net = parseInt(PA_Owner_Premium);

      if (Net >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg =
          "Can't less than Or Basic TP + P A Owner !";

        Estimated_Gross_Premium_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        var Other_TP = this.SRForm.value["Basic_TP"]
          ? this.SRForm.value["Other_TP"]
          : 0;

        var Net = parseInt(Other_TP) + parseInt(PA_Owner_Premium);

        Basic_OD_Control.setValue(Net_Premium - Net);

        var GST_AMT = (parseInt(Net_Premium) * 18) / 100;
        var Gross_Premium = parseInt(Net_Premium) + GST_AMT;

        Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
      }
    } // end of segment Type Standalone wn Damage
  }

  EstimatedGrossPremium() {
    var Net_Premium_Control = this.SRForm.get("Net_Premium");
    var Estimated_Gross_Premium = this.SRForm.value["Estimated_Gross_Premium"]
      ? this.SRForm.value["Estimated_Gross_Premium"]
      : 0;

    var Basic_OD_Control = this.SRForm.get("Basic_OD");
    var Other_TP_Control = this.SRForm.get("Other_TP");

    //var Estimated_Gross_Premium_Control = this.SRForm.get('Estimated_Gross_Premium');

    var Segment_Type = this.row["Segment_Id"] ? this.row["Segment_Id"] : 0;

    var Basic_OD = this.SRForm.value["Basic_OD"]
      ? this.SRForm.value["Basic_OD"]
      : 0;

    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;
    var Other_TP = this.SRForm.value["Other_TP"]
      ? this.SRForm.value["Other_TP"]
      : 0;
    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    var Net_Premium = this.SRForm.value["Net_Premium"]
      ? this.SRForm.value["Net_Premium"]
      : 0;

    if (Segment_Type == "Comprehensive") {
      if (this.Vehicle_Type == "GCV") {
        //var six_ = parseInt(Basic_TP)*6/100;
        //Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium)-six_);
        var _18 = (parseFloat(Basic_TP) * 12) / 100;

        //// console.log(_18);

        var final_Gross_Revs =
          parseFloat(Estimated_Gross_Premium) - (parseFloat(Basic_TP) + _18);

        //// console.log(final_Gross_Revs);

        var gross_after_basic_TP = (final_Gross_Revs * 100) / 118;

        //// console.log(gross_after_basic_TP);

        var add_basic_TP_Amt = parseFloat(Basic_TP) + gross_after_basic_TP;

        //// console.log(add_basic_TP_Amt);
        var New_Net_Premium = add_basic_TP_Amt;

        Net_Premium_Control.setValue(Math.round(New_Net_Premium));

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";

          var Net_Premium = this.SRForm.value["Net_Premium"]
            ? this.SRForm.value["Net_Premium"]
            : 0;
          var Total =
            parseInt(Basic_TP) +
            parseInt(Other_TP) +
            parseInt(PA_Owner_Premium);

          Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
        }
      } else {
        var Net = (parseInt(Estimated_Gross_Premium) * 100) / 118;
        Net_Premium_Control.setValue(Math.round(Net));

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";

          var Net_Premium = this.SRForm.value["Net_Premium"]
            ? this.SRForm.value["Net_Premium"]
            : 0;
          var Total =
            parseInt(Basic_TP) +
            parseInt(Other_TP) +
            parseInt(PA_Owner_Premium);

          Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
        }
      }
    } // end of Comprehensive

    if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');

      if (this.Vehicle_Type == "GCV") {
        var _18 = (parseFloat(Basic_TP) * 12) / 100;

        //// console.log(_18);

        var final_Gross_Revs =
          parseFloat(Estimated_Gross_Premium) - (parseFloat(Basic_TP) + _18);

        //// console.log(final_Gross_Revs);

        var gross_after_basic_TP = (final_Gross_Revs * 100) / 118;

        //// console.log(gross_after_basic_TP);

        var add_basic_TP_Amt = parseFloat(Basic_TP) + gross_after_basic_TP;

        //// console.log(add_basic_TP_Amt);
        var New_Net_Premium = add_basic_TP_Amt;

        Net_Premium_Control.setValue(Math.round(New_Net_Premium));

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";
        }

        var Total = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        Other_TP_Control.setValue(parseInt(Net_Premium) - Total);
      } else {
        // Other

        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net_P = (parseInt(Estimated_Gross_Premium) * 100) / 118;

        Net_Premium_Control.setValue(Math.round(Net_P));
        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        // console.log(Net_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";

          // console.log(Net_Premium);

          var Total = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

          Other_TP_Control.setValue(parseInt(Net_Premium) - Total);
        }
      }
    }
    if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');

      var Net = (parseInt(Estimated_Gross_Premium) * 100) / 118;
      Net_Premium_Control.setValue(Math.round(Net));

      var Net_Premium = this.SRForm.value["Net_Premium"]
        ? this.SRForm.value["Net_Premium"]
        : 0;
      // console.log(Net_Premium);

      if (parseInt(PA_Owner_Premium) >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg = "Can't less than Or Equal to P A Owner !";
        Basic_OD_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Total = parseInt(Other_TP) + parseInt(PA_Owner_Premium);

        Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
      }
    }
  }

  NM_NetPremium(e) {
    var NetPremium = e.target.value;
    // console.log(NetPremium);
    var GST_AMT = (parseInt(NetPremium) / 100) * 18;
    var Gross_Premium = parseInt(NetPremium) + GST_AMT;
    this.SRForm.get("Estimated_Gross_Premium").setValue(
      Math.round(Gross_Premium)
    );
  }
  NM_EstimatedGrossPremium(e) {
    var GrossPremium = e.target.value;
    // console.log(GrossPremium);

    var NetPremium = (parseInt(GrossPremium) * 100) / 118;
    this.SRForm.get("Net_Premium").setValue(Math.round(NetPremium));
  }

  PayInNet(e) {
    var PayInNet = e.target.value;
    const PayOutNet_Control = this.SRForm.get("PayOutNet");
    // console.log(PayInNet);
    // console.log(PayInNet*20/100);
    PayOutNet_Control.setValue(PayInNet - (PayInNet * 20) / 100);
  }

  PayInOD(e) {
    var PayInOD = e.target.value;
    const PayOutOD_Control = this.SRForm.get("PayOutOD");
    // console.log(PayInOD);
    // console.log(PayInOD*20/100);
    PayOutOD_Control.setValue(PayInOD - (PayInOD * 20) / 100);
  }

  PayInTP(e) {
    var PayInTP = e.target.value;
    const PayOutTP_Control = this.SRForm.get("PayOutTP");
    // console.log(PayInTP);
    // console.log(PayInTP*20/100);
    PayOutTP_Control.setValue(PayInTP - (PayInTP * 20) / 100);
  }

  PayInReward(e) {
    var PayInReward = e.target.value;
    const PayInRewardNet_Control = this.SRForm.get("PayOutReward");
    // console.log(PayInReward);
    // console.log(PayInReward*20/100);
    PayInRewardNet_Control.setValue(PayInReward - (PayInReward * 20) / 100);
  }

  PayInScheme(e) {
    var PayInScheme = e.target.value;
    const PayOutSchemeNet_Control = this.SRForm.get("PayOutScheme");
    // console.log(PayInScheme);
    // console.log(PayInScheme*20/100);
    PayOutSchemeNet_Control.setValue(PayInScheme - (PayInScheme * 20) / 100);
  }

  ViewDocument(name) {
    let url;
    if (this.row.Source == "Web") {
      url = name;
    } else {
      url = this.Base_Url + name;
    }
    // console.log(this.row.Source);
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  Totast() {
    //this.snackbar_msg = msg;
    var x = document.getElementById("snackbar2");
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  Add_Recovery() {
    this.isSubmitted = true;
    if (this.SRForm.invalid) {
      return;
    } else {
      var fields = this.SRForm.value;

      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("SR_Id", this.row.Id);
      formData.append("Basic_OD", fields["Basic_OD"]);
      formData.append("Basic_OD_Recover", fields["Basic_OD_Recover"]);
      formData.append("Basic_TP", fields["Basic_TP"]);
      formData.append("Other_TP", fields["Other_TP"]);
      formData.append("PA_Owner_Premium", fields["PA_Owner_Premium"]);
      formData.append("IDV", fields["IDV"]);
      formData.append("NCB", fields["NCB"]);
      formData.append("Discount", fields["Discount"]);
      formData.append("Net_Premium", fields["Net_Premium"]);
      formData.append(
        "Estimated_Gross_Premium",
        fields["Estimated_Gross_Premium"]
      );

      //formData.append('Terrorism_Premium',fields['Terrorism_Premium']);
      //formData.append('Sum_Insured',fields['Sum_Insured']);

      formData.append("PayOutOD", fields["PayOutOD"]);
      formData.append("PayOutOD_Recover", fields["PayOutOD_Recover"]);

      formData.append("PayOutTP", fields["PayOutTP"]);
      formData.append("PayOutTP_Recover", fields["PayOutTP_Recover"]);

      formData.append("PayOutNet", fields["PayOutNet"]);
      formData.append("PayOutNet_Recover", fields["PayOutNet_Recover"]);

      formData.append("PayOutReward", fields["PayOutReward"]);
      formData.append("PayOutReward_Recover", fields["PayOutReward_Recover"]);

      formData.append("PayOutScheme", fields["PayOutScheme"]);
      formData.append("PayOutScheme_Recover", fields["PayOutScheme_Recover"]);

      /*
	formData.append('PayInTP',fields['PayInTP']);
	formData.append('PayOutTP',fields['PayOutTP']);
	
	formData.append('PayInNet',fields['PayInNet']);
	formData.append('PayOutNet',fields['PayOutNet']);
	
	formData.append('PayInReward',fields['PayInReward']);
	formData.append('PayOutReward',fields['PayOutReward']);
	formData.append('PayInScheme',fields['PayInScheme']);
	formData.append('PayOutScheme',fields['PayOutScheme']);
	*/

      formData.append("RecoveryType", this.RecoveryType);
      formData.append("RecoveryDate", fields["RecoveryDate"]);
      formData.append("Remark", fields["Remark"]);

      this.api.IsLoading();
      this.api.HttpPostType("sr/Recovery/Add_Recovery", formData).then(
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
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
    }
  }
}
