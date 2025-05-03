import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-payout-rm",
  templateUrl: "./edit-payout-rm.component.html",
  styleUrls: ["./edit-payout-rm.component.css"],
})
export class EditPayoutRmComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  SR_Id: any;
  SR_Index: any;
  SR_Ar: any = [];
  Sr_Data: any = [];

  flagButton: any = 1;

  constructor(
    public dialogRef: MatDialogRef<EditPayoutRmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.PayInForm = this.fb.group({
      Payout: this.fb.array([]),
      Remark: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.SR_Id = this.data.Id;
    this.SR_Index = this.data.Edit_Index;
    this.GetSR();
  }

  quantities(): FormArray {
    return this.PayInForm.get("Payout") as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      SR_Id: [""],

      Payin_OD: [""],
      PayOutOD: [""],
      Input_PayOutOD: [""],

      Payin_TP: [""],
      PayOutTP: [""],
      Input_PayOutTP: [""],

      Payin_Net: [""],
      PayOutNet: [""],
      Input_PayOutNet: [""],

      Payin_Reward: [""],
      PayOutReward: [""],
      Input_PayOutReward: [""],

      Payin_Scheme: [""],
      PayOutScheme: [""],
      Input_PayOutScheme: [""],
      Input_Remark: [""],

      //Payin_Terrorism: [''],
      //PayOutTerrorism: [''],
      //Input_PayOutTerrorism: [''],
    });
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
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
    formData.append("SR_Ids", this.SR_Id);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("brokerage/SalesPayoutEdit/GetSRData", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.SR_Ar = result["Data"];
            this.Sr_Data = result["Sr_Data"];

            for (var i = 0; i < result["Data"].length; i++) {
              this.addQuantity();

              const PayInGroupFields = (<FormArray>(
                this.PayInForm.get("Payout")
              )).at(i);

              if (result["Data"][i]["Agent_Payout_OD"] == 0) {
                PayInGroupFields.get("Input_PayOutOD").disable();
              }
              if (result["Data"][i]["Agent_Payout_TP"] == 0) {
                PayInGroupFields.get("Input_PayOutTP").disable();
              }
              if (result["Data"][i]["Agent_Payout_Net"] == 0) {
                PayInGroupFields.get("Input_PayOutNet").disable();
              }

              if (result["Data"][i]["Agent_Reward_Amount"] == 0) {
                PayInGroupFields.get("Input_PayOutReward").disable();
              }
              if (result["Data"][i]["Agent_Scheme_Amount"] == 0) {
                PayInGroupFields.get("Input_PayOutScheme").disable();
              }
              //if(result['Data'][i]['Agent_Terrorism_Payout'] == 0){
              // PayInGroupFields.get('Input_PayOutTerrorism').disable();
              //}

              PayInGroupFields.get("SR_Id").setValue(
                result["Data"][i]["SR_Id"]
              );

              PayInGroupFields.get("Payin_OD").setValue(
                result["Data"][i]["Payin_OD"]
              );
              PayInGroupFields.get("PayOutOD").setValue(
                result["Data"][i]["Agent_Payout_OD"]
              );
              PayInGroupFields.get("Input_PayOutOD").setValue(
                result["Data"][i]["Agent_Payout_OD"]
              );

              PayInGroupFields.get("Payin_TP").setValue(
                result["Data"][i]["Payin_TP"]
              );
              PayInGroupFields.get("PayOutTP").setValue(
                result["Data"][i]["Agent_Payout_TP"]
              );
              PayInGroupFields.get("Input_PayOutTP").setValue(
                result["Data"][i]["Agent_Payout_TP"]
              );

              PayInGroupFields.get("Payin_Net").setValue(
                result["Data"][i]["Payin_Net"]
              );
              PayInGroupFields.get("PayOutNet").setValue(
                result["Data"][i]["Agent_Payout_Net"]
              );
              PayInGroupFields.get("Input_PayOutNet").setValue(
                result["Data"][i]["Agent_Payout_Net"]
              );

              PayInGroupFields.get("Payin_Reward").setValue(
                result["Data"][i]["Payin_Reward_Amount"]
              );
              PayInGroupFields.get("PayOutReward").setValue(
                result["Data"][i]["Agent_Reward_Amount"]
              );
              PayInGroupFields.get("Input_PayOutReward").setValue(
                result["Data"][i]["Agent_Reward_Amount"]
              );

              PayInGroupFields.get("Payin_Scheme").setValue(
                result["Data"][i]["Payin_Scheme_Amount"]
              );
              PayInGroupFields.get("PayOutScheme").setValue(
                result["Data"][i]["Agent_Scheme_Amount"]
              );
              PayInGroupFields.get("Input_PayOutScheme").setValue(
                result["Data"][i]["Agent_Scheme_Amount"]
              );

              //PayInGroupFields.get('Payin_Terrorism').setValue(result['Data'][i]['Payin_Terrorism']);
              //PayInGroupFields.get('PayOutTerrorism').setValue(result['Data'][i]['Agent_Terrorism_Payout']);
              //PayInGroupFields.get('Input_PayOutTerrorism').setValue(result['Data'][i]['Agent_Terrorism_Payout']);
            }

            ////   //   console.log(result['patchValueAr']);

            /*  
          this.PayInForm.get('PayOutTerrorism').setValue(this.SR_Ar['Agent_Terrorism_Payout']);
  
          this.PayInForm.get('PayOutOD').setValue(this.SR_Ar['Agent_Payout_OD']);
  
          this.PayInForm.get('PayOutTP').setValue(this.SR_Ar['Agent_Payout_TP']);
          
          this.PayInForm.get('PayOutNet').setValue(this.SR_Ar['Agent_Payout_Net']);
  
          this.PayInForm.get('PayOutReward').setValue(this.SR_Ar['Agent_Reward_Amount']);
  
          this.PayInForm.get('PayOutScheme').setValue(this.SR_Ar['Agent_Scheme_Amount']);
      
          if(this.SR_Ar['Agent_Terrorism_Payout']==0){
            this.PayInForm.get('PayOutTerrorism').disable();
          }
          if(this.SR_Ar['Agent_Payout_OD']==0){
            this.PayInForm.get('PayOutOD').disable();
          } 
          if(this.SR_Ar['Agent_Payout_TP']==0){
            this.PayInForm.get('PayOutTP').disable();
          }
          if(this.SR_Ar['Agent_Payout_Net']==0){
            this.PayInForm.get('PayOutNet').disable();
          }
          if(this.SR_Ar['Agent_Reward_Amount']==0){
            this.PayInForm.get('PayOutReward').disable();
          }
          if(this.SR_Ar['Agent_Scheme_Amount']==0){
            this.PayInForm.get('PayOutScheme').disable();
          }
          
          this.PayInForm.get('PayOutTerrorism').updateValueAndValidity();
          this.PayInForm.get('PayOutOD').updateValueAndValidity();
          this.PayInForm.get('PayOutTP').updateValueAndValidity();
          this.PayInForm.get('PayOutNet').updateValueAndValidity();
          this.PayInForm.get('PayOutReward').updateValueAndValidity();
          this.PayInForm.get('PayOutScheme').updateValueAndValidity();
          */
          } else {
            this.api.Toast("Sucess", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Network Error, Please try again ! ", +err.message);
        }
      );
  }

  onChangeInput(e: any, Type: string, index: any) {
    //   //   //   console.log(e.target.value);
    //   //   //   console.log(Type);
    //   //   //   console.log(index);

    const PayInGroupFields = (<FormArray>this.PayInForm.get("Payout")).at(
      index
    );

    var PayOutOD = PayInGroupFields.value["Input_PayOutOD"];
    var PayOutTP = PayInGroupFields.value["Input_PayOutTP"];
    var PayOutNet = PayInGroupFields.value["Input_PayOutNet"];
    var PayOutReward = PayInGroupFields.value["Input_PayOutReward"];
    var PayOutScheme = PayInGroupFields.value["Input_PayOutScheme"];
    //   //   //   console.log(PayOutOD);

    this.flagButton = 0;

    //   //   //   console.log('Total Days : '+(this.Sr_Data[index]['PO_Update_Days']));

    if (this.Sr_Data[index]["PO_Update_Days"] > 5) {
      if (
        this.SR_Ar[index].Main_Payin_OD -
          (this.SR_Ar[index].Main_Payin_OD * 20) / 100 <
          PayOutOD &&
        Type == "OD"
      ) {
        //   //   //   console.log('PayOutOD '+(this.SR_Ar[index].Main_Payin_OD-(this.SR_Ar[index].Main_Payin_OD*20/100))+': Effietve date change need');
        this.flagButton = 2;
      } else if (
        this.SR_Ar[index].Main_Payin_TP -
          (this.SR_Ar[index].Main_Payin_TP * 20) / 100 <
          PayOutTP &&
        Type == "TP"
      ) {
        //   //   //   console.log('PayOutTP : Effietve date change need');
        this.flagButton = 2;
      } else if (
        this.SR_Ar[index].Main_Payin_Net -
          (this.SR_Ar[index].Main_Payin_Net * 20) / 100 <
          PayOutNet &&
        Type == "Net"
      ) {
        //   //   //   console.log('PayOutNet '+(this.SR_Ar[index].Main_Payin_Net-(this.SR_Ar[index].Main_Payin_Net*20/100))+' : Effietve date change need');
        this.flagButton = 2;
      } else if (
        this.SR_Ar[index].Main_Payin_Reward_Amount -
          (this.SR_Ar[index].Main_Payin_Reward_Amount * 20) / 100 <
          PayOutReward &&
        Type == "Reward"
      ) {
        //   //   //   console.log('PayOutReward : Effietve date change need');
        this.flagButton = 2;
      } else if (
        this.SR_Ar[index].Main_Payin_Scheme_Amount -
          (this.SR_Ar[index].Main_Payin_Scheme_Amount * 20) / 100 <
          PayOutScheme &&
        Type == "Scheme"
      ) {
        //   //   //   console.log('PayOutScheme : Effietve date change need');
        this.flagButton = 2;
      } else {
        this.flagButton = 0;
      }
    }

    if (this.api.GetUserData("User_Id_Dec") == 80) {
      this.flagButton = 0;
    }
    this.SR_Ar[index]["flagButton"] = this.flagButton;

    //   //   //   console.log(this.flagButton);
  }

  PayInOD(e) {
    var PayInOD = e.target.value;
    const PayOutOD_Control = this.PayInForm.get("PayOutOD");
    //   //   //   console.log(PayInOD);
    //   //   //   console.log(PayInOD*20/100);
    PayOutOD_Control.setValue(PayInOD - (PayInOD * 20) / 100);
  }

  PayInTP(e) {
    var PayInTP = e.target.value;
    const PayOutTP_Control = this.PayInForm.get("PayOutTP");
    //   //   //   console.log(PayInTP);
    //   //   //   console.log(PayInTP*20/100);
    PayOutTP_Control.setValue(PayInTP - (PayInTP * 20) / 100);
  }

  PayInNet(e) {
    var PayInNet = e.target.value;
    const PayOutNet_Control = this.PayInForm.get("PayOutNet");
    //   //   //   console.log(PayInNet);
    //   //   //   console.log(PayInNet*20/100);
    PayOutNet_Control.setValue(PayInNet - (PayInNet * 20) / 100);
  }

  PayInTerrorism(e) {
    var PayInTerrorism = e.target.value;
    const PayOutTerrorism_Control = this.PayInForm.get("PayOutTerrorism");
    //   //   //   console.log(PayInTerrorism);
    //   //   //   console.log(PayInTerrorism*20/100);
    PayOutTerrorism_Control.setValue(
      PayInTerrorism - (PayInTerrorism * 20) / 100
    );
  }

  PayInReward(e) {
    var PayInReward = e.target.value;
    const PayInRewardNet_Control = this.PayInForm.get("PayOutReward");
    //   //   //   console.log(PayInReward);
    //   //   //   console.log(PayInReward*20/100);
    PayInRewardNet_Control.setValue(PayInReward - (PayInReward * 20) / 100);
  }

  PayInScheme(e) {
    var PayInScheme = e.target.value;
    const PayOutSchemeNet_Control = this.PayInForm.get("PayOutScheme");
    //   //   //   console.log(PayInScheme);
    //   //   //   console.log(PayInScheme*20/100);
    PayOutSchemeNet_Control.setValue(PayInScheme - (PayInScheme * 20) / 100);
  }

  AddPayInSingle(index: any) {
    var fields = this.PayInForm.value;
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());

    const PayInGroupFields = (<FormArray>this.PayInForm.get("Payout")).at(
      index
    );
    //   //   //   console.log(PayInGroupFields.value);

    //formData.append('Payout',JSON.stringify(fields['Payout']));
    formData.append("Payout", JSON.stringify(PayInGroupFields.value));
    formData.append("Remark", PayInGroupFields.value["Input_Remark"]);

    if (PayInGroupFields.value["Input_Remark"] == "") {
      alert("Please enter remark !");
      return;
    }

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "brokerage/SalesPayoutEdit/UpdatePayoutRequestBySR",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Sr_Data[index]["Is_Update"] = "1";

            this.api.Toast("Sucess", result["Message"]);
            //this.CloseModel();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Network Error, Please try again ! ", +err.message);
        }
      );
  }

  AddPayIn() {
    this.isSubmitted = true;
    if (this.PayInForm.invalid) {
      return;
    } else {
      var fields = this.PayInForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      /*  
      formData.append('SR_Id',this.SR_Id); 
       
      formData.append('Agent_Terrorism_PayIn',this.SR_Ar['Agent_Terrorism_PayIn']);	
      formData.append('PayOutTerrorism',this.SR_Ar['Agent_Terrorism_Payout']);	
      formData.append('Input_PayOutTerrorism',fields['PayOutTerrorism']);
      
      formData.append('Payin_OD',this.SR_Ar['Payin_OD']);
      formData.append('PayOutOD',this.SR_Ar['Agent_Payout_OD']);
      formData.append('Input_PayOutOD',fields['PayOutOD']);
      
      formData.append('Payin_TP',this.SR_Ar['Payin_TP']);		
      formData.append('PayOutTP',this.SR_Ar['Agent_Payout_TP']);		
      formData.append('Input_PayOutTP',fields['PayOutTP']);
       
      formData.append('Payin_Net',this.SR_Ar['Payin_Net']);		
      formData.append('PayOutNet',this.SR_Ar['Agent_Payout_Net']);		
      formData.append('Input_PayOutNet',fields['PayOutNet']);
     
      formData.append('Payin_Reward_Amount',this.SR_Ar['Payin_Reward_Amount']);	 
      formData.append('PayOutReward',this.SR_Ar['Agent_Reward_Amount']);	 
      formData.append('Input_PayOutReward',fields['PayOutReward']);
      
      formData.append('Payin_Scheme_Amount',this.SR_Ar['Payin_Scheme_Amount']);		
      formData.append('PayOutScheme',this.SR_Ar['Agent_Scheme_Amount']);		
      formData.append('Input_PayOutScheme',fields['PayOutScheme']); 
      */

      formData.append("Payout", JSON.stringify(fields["Payout"]));
      formData.append("Remark", fields["Remark"]);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "brokerage/SalesPayoutEdit/UpdatePayoutRequestBySR",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Sucess", result["Message"]);
              this.CloseModel();
            } else {
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast("Network Error, Please try again ! ", +err.message);
          }
        );
    }
  }
}
