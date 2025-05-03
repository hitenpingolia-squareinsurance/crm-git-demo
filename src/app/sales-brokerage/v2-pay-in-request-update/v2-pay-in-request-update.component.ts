import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BmsapiService } from "src/app/providers/bmsapi.service";
import { V2PayInDataviewComponent } from "../v2-pay-in-dataview/v2-pay-in-dataview.component";
import { title } from "process";

@Component({
  selector: "app-v2-pay-in-request-update",
  templateUrl: "./v2-pay-in-request-update.component.html",
  styleUrls: ["./v2-pay-in-request-update.component.css"],
})
export class V2PayInRequestUpdateComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};
  dropdownSettingsFileType: any = {};
  dropdownSettingsAgent: any = {};
  LOB_dropdownSettings: any = {};
  ins_Company_dropdownSettings: any = {};
  PayInApplicableType_dropdownSettings: any = {};
  cities: any = [];
  selectedItems: any = [];

  value: any;
  selected: any;
  SubmitType: any;

  User_Rights: any = [];

  Brokers_Ar: any = [];
  Fleets_Ar: any = [];
  RM_Ar: any = [];
  Agents_Ar: any = [];
  Ins_Companies_Ar: any = [];
  Zones_Ar: any = [];
  States_Ar: any = [];
  RTO_Ar: any = [];
  LOB_Ar: any = [];

  Source_Ar: any = [];
  LI_Payment_Type_Ar: any = [];
  CPA_Ar: any = [];

  Body_Type_Ar: any = [];
  Fuel_Type_Ar: any = [];
  File_Type_Ar: any = [];
  Products_Ar: any = [];
  SubProducts_Ar: any = [];

  Segment_Ar: any = [];
  Classes_Ar: any = [];
  Plan_Type_Ar: any = [];
  Sub_Classes_Ar: any = [];

  Risk_Category_Ar: any = [];
  Risk_Occupancy_Ar: any = [];

  Make_Ar: any = [];
  Model_Ar: any = [];
  rowAr: any = [];
  rowAr_N: any = [];
  AgentsGroup: any = [];

  logsAr: any = [];

  formArData: any = [];

  PayInApplicableType_Ar: any = [];

  Agents_Placeholder: string = "Select Agents (0)";

  isCheckedAllAgents: any = true;
  Is_Body_Type: any = false;

  PayOut_OD_Readonly: any = false;
  PayOut_TP_Readonly: any = false;
  PayOut_Net_Readonly: any = false;

  EnableTwoWheelerBodyType: any = 0;

  Id: any = 0;
  ViewType: any = 0;
  Bussiness_Month: any = 0;
  minDate: any;
  maxDate: any;
  AddPartnersIndex: any = 0;

  selectedFiles: File;
  Attachment: File;

  minDateAr: any = [];
  maxDateAr: any = [];

  curDate: string;

  PayIn_TDS: any = 0;
  SlabHistory: any = [];

  Make_Flag: any = 0;
  Model_Flag: any = 0;
  States_Flag: any = 0;
  RTO_Flag: any = 0;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<V2PayInRequestUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    var dateObj = new Date();
    var d = dateObj.toLocaleDateString("en-CA");

    this.curDate = d;

    //this.minDateAr.push("2022-10-01");
    //this.minDateAr.push("2022-10-05");
    ////   //   console.log(this.minDateAr);

    this.Id = this.data.Id;
    this.ViewType = this.data.Type;
    this.Bussiness_Month = this.data.Bussiness_Month;

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.dropdownSettingsAgent = {
      singleSelection: false,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.LOB_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.dropdownSettingsFileType = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.ins_Company_dropdownSettings = {
      allowSearchFilter: true,
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.PayInApplicableType_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 1,
      idField: "Id",
      textField: "Name",
    };

    this.PayInApplicableType_Ar = [
      { Id: "OD", Name: "OD" },
      { Id: "TP", Name: "TP" },
      { Id: "Net", Name: "Net" },
    ];
  }

  ngOnInit() {
    this.PayInForm = this.fb.group({
      LOB: [""],
      File_Type: [""],
      PO_Group: [""],

      Broker_Ids: [""],
      Ins_Compaines_Ids: [""],

      Product_Ids: [""],
      Segment_Ids: [""],
      Plan_Type: [""],
      SubProduct_Ids: [""],
      Class_Ids: [""],
      Sub_Class_Ids: [""],

      Fuel_Type: [""],
      Body_Type_Ids: [""],
      CPA: [""],
      NCB_Status: [""],
      LI_Payment_Type: [""],
      VehicleAgeFrom: [""],
      VehicleAgeTo: [""],

      Zone_Ids: [""],
      States_Ids: [""],
      RTO_Ids: [""],

      Source_Type: [""],

      Make_Id: [""],
      Model_Id: [""],

      AgentGroup: this.fb.array([]),

      PayIn_Remark: [""],
      Extra_Remark: [""],
      Remark: ["", [Validators.required]],
      Effective_Date: [""],
    });

    //this.AddPayIn();
    //16617

    this.ComponentsData();
  }
  get FC() {
    return this.PayInForm.controls;
  }

  //Group
  AgentGroup(): FormArray {
    return this.PayInForm.get("AgentGroup") as FormArray;
  }

  removeNewAgentGroup(i: number) {
    this.AgentGroup().removeAt(i);
  }

  NewAgentGroup(): FormGroup {
    return this.fb.group({
      Agent_Ids: [this.rowAr.Agent_Ids],
      Agents_Name: [this.rowAr.Agents_Name],

      PayOutOD: [this.rowAr.PayOutOD],
      PayOutTP: [this.rowAr.PayOutTP],
      PayOutNet: [this.rowAr.PayOutNet],
      PayOutReward: [this.rowAr.PayOutReward],
      PayOutScheme: [this.rowAr.PayOutScheme],

      NeedMorePayOutOD: [""],
      NeedMorePayOutTP: [""],
      NeedMorePayOutNet: [""],

      PayOut_Mode: [""],
      Bussiness_Commitment: [""],
      Effective_Date: [this.curDate],
      Effective_Min_Date: [this.rowAr.minDate],
      Effective_Max_Date: [this.rowAr.maxDate],
      AttachmentSource: [""],
      Attachment_Status: ["0"],
    });
  }

  searchAgent(index: any) {
    var myar_Ids = new Array();
    //for(var i=0; i<this.PayInForm.value['AgentGroup'].length; i++){
    ////   //   console.log(this.PayInForm.value['AgentGroup'][i]['Agents_Name']);
    var selectedA = this.PayInForm.value["AgentGroup"][index]["Agents_Name"];
    for (var j = 0; j < selectedA.length; j++) {
      //   //   console.log(selectedA[j]['Id']);
      myar_Ids.push(selectedA[j]["Id"]);
    }
    //}

    var AgentIds = myar_Ids.join(",");
    //   //   console.log(myar_Ids);

    const PayInGroupFields = (<FormArray>this.PayInForm.get("AgentGroup")).at(
      index
    );
    PayInGroupFields.get("Agent_Ids").setValue(AgentIds);

    if (PayInGroupFields.value["Agents_Name"].length == 1) {
      this.onChangeRMA(AgentIds, PayInGroupFields, "Single");
    } else {
      this.onChangeRMA(AgentIds, PayInGroupFields, "Multiple");
    }

    this.AddPartnersIndex = index + 1;
  }

  onChangeRMA(Agent_Id, PayInGroupFields, SelectionType) {
    const formData = new FormData();
    //formData.append('RMA',RMA);
    formData.append("Agent_Id", Agent_Id);
    formData.append("SelectionType", SelectionType);
    formData.append("Business_Month", this.Bussiness_Month);
    formData.append("PayIn_Id", this.Id);
    formData.append("LOB", this.rowAr.LOB);
    formData.append("Product_Ids", JSON.stringify(this.rowAr.Product_Ids));
    formData.append("AgentType", this.rowAr.AgentType);
    formData.append("User_Id", this.api.GetUserId());
    formData.append("User_Role", this.api.GetUserData("User_Role"));

    this.api.IsLoading();
    this.api.HttpPostType("pay/PayIn/GetAgentBusiness", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          //this.Agents_Ar = result['Data'];

          //alert(RMA);
          var RMA = result["RMA"];

          if (this.rowAr.PayInOD != 0) {
            this.rowAr.PayOutOD =
              this.rowAr.PayInOD - (this.rowAr.PayInOD * RMA) / 100;

            PayInGroupFields.patchValue({
              PayOutOD: this.rowAr.PayOutOD,
            });
          }
          if (this.rowAr.PayInTP != 0) {
            this.rowAr.PayOutTP =
              this.rowAr.PayInTP - (this.rowAr.PayInTP * RMA) / 100;
            PayInGroupFields.patchValue({
              PayOutTP: this.rowAr.PayOutTP,
            });
          }
          if (this.rowAr.PayInNet != 0) {
            this.rowAr.PayOutNet =
              this.rowAr.PayInNet - (this.rowAr.PayInNet * RMA) / 100;
            PayInGroupFields.patchValue({
              PayOutNet: this.rowAr.PayOutNet,
            });
          }
          if (this.rowAr.PayInReward != 0) {
            this.rowAr.PayOutReward =
              this.rowAr.PayInReward - (this.rowAr.PayInReward * RMA) / 100;
            PayInGroupFields.patchValue({
              PayOutReward: this.rowAr.PayOutReward,
            });
          }
          if (this.rowAr.PayInScheme != 0) {
            this.rowAr.PayOutScheme =
              this.rowAr.PayInScheme - (this.rowAr.PayInScheme * RMA) / 100;
            PayInGroupFields.patchValue({
              PayOutScheme: this.rowAr.PayOutScheme,
            });
          }

          //(<FormArray>this.PayInForm.get("AgentGroup")).clear();

          //this.AgentGroup().push(this.NewAgentGroup());
        } else {
          //this.Agents_Ar = [];
          this.api.ErrorMsg(result["Message"]);

          //(<FormArray>this.PayInForm.get("AgentGroup")).clear();

          //this.AgentGroup().push(this.NewAgentGroup());
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  addAgentGroup() {
    for (var i = 0; i < this.PayInForm.value["AgentGroup"].length; i++) {
      if (
        JSON.stringify(this.PayInForm.value["AgentGroup"][i]["Agent_Ids"]) == ""
      ) {
        alert("Please select partners.");
        return true;
      }
    }
    this.AgentGroup().push(this.NewAgentGroup());

    //   //   console.log('Total Group : ' + this.PayInForm.value['AgentGroup'].length);

    //this.minDateAr.push(this.rowAr.minDate);

    ////   //   console.log(this.minDateAr);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("User_Role", this.api.GetUserData("User_Role"));
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append("Business_Month", this.Bussiness_Month);
    formData.append("AddPartnersIndex", this.AddPartnersIndex);
    formData.append("ViewType", this.ViewType);
    formData.append("Source", "Web");
    formData.append("PayInId", this.rowAr["Id"]);
    formData.append(
      "AgentGroup_Ar",
      JSON.stringify(this.PayInForm.value["AgentGroup"])
    );

    this.api.IsLoading();
    this.api.HttpPostType("../v2/app/PayIn/SearchAgent", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          if (result["Total_Agent"] > 0) {
            this.AgentsGroup[this.AddPartnersIndex] = result["Agents_Ar"];
          } else {
            alert("Partner selection limit has been exceeded.");
          }
        }
      },
      (err) => {
        this.api.HideLoading();
        // Error log
      }
    );
  }

  //group

  NeedMore(e, Type, index) {
    const PayInGroupFields = (<FormArray>this.PayInForm.get("AgentGroup")).at(
      index
    );
    PayInGroupFields.get(Type).setValue("0");
  }

  onChangeInput(e, Type, index) {
    //   //   console.log(index);

    //   //   console.log(this.minDateAr);

    //this.PayInForm.get("Effective_Date").setValue(null);
    //this.PayInForm.get("Effective_Date").updateValueAndValidity();

    const PayInGroupFields = (<FormArray>this.PayInForm.get("AgentGroup")).at(
      index
    );

    ////   //   console.log(PayInGroupFields.value['PayOutNet']);

    var PayOutOD = PayInGroupFields.value["PayOutOD"];
    var PayOutTP = PayInGroupFields.value["PayOutTP"];
    var PayOutNet = PayInGroupFields.value["PayOutNet"];
    var PayOutReward = PayInGroupFields.value["PayOutReward"];
    var PayOutScheme = PayInGroupFields.value["PayOutScheme"];

    var PayOut_Mode = PayInGroupFields.value["PayOut_Mode"];
    var Bussiness_Commitment = PayInGroupFields.value["Bussiness_Commitment"];
    var Effective_Date = PayInGroupFields.value["Effective_Date"];

    var flag = 0;
    var flagDate = 0;
    var flagNeedMore = 0;

    if (this.rowAr.PayInODAfterTDS < PayOutOD && Type == "PayOutOD") {
      ////   //   console.log('PayOutOD : attachment need');
      flag = 1;
    } else if (this.rowAr.PayInTPAfterTDS < PayOutTP && Type == "PayOutTP") {
      ////   //   console.log('PayOutTP : attachment need');
      flag = 1;
    } else if (this.rowAr.PayInNetAfterTDS < PayOutNet && Type == "PayOutNet") {
      ////   //   console.log('PayOutNet : attachment need');
      flag = 1;
    } else if (
      this.rowAr.PayInRewardAfterTDS < PayOutReward &&
      Type == "PayOutReward"
    ) {
      ////   //   console.log('PayOutReward : attachment need');
      flag = 1;
    } else if (
      this.rowAr.PayInSchemeAfterTDS < PayOutScheme &&
      Type == "PayOutScheme"
    ) {
      ////   //   console.log('PayOutScheme : attachment need');
      flag = 1;
    } else {
      flag = 0;
    }

    ////   //   console.log(this.rowAr);
    ////   //   console.log('hellsfdf');
    ////   //   console.log(this.rowAr_N);

    if (
      this.rowAr.PayInOD - (this.rowAr.PayInOD * 20) / 100 < PayOutOD &&
      Type == "PayOutOD"
    ) {
      //   //   console.log('PayOutOD : Effietve date change need');
      flagDate = 1;
    } else if (
      this.rowAr.PayInTP - (this.rowAr.PayInTP * 20) / 100 < PayOutTP &&
      Type == "PayOutTP"
    ) {
      //   //   console.log('PayOutTP : Effietve date change need');
      flagDate = 1;
    } else if (
      this.rowAr.PayInNet - (this.rowAr.PayInNet * 20) / 100 < PayOutNet &&
      Type == "PayOutNet"
    ) {
      //   //   console.log('PayOutNet ' + (this.rowAr.PayInNet - (this.rowAr.PayInNet * 20 / 100)) + ' : Effietve date change need');
      flagDate = 1;
    } else if (
      this.rowAr.PayInReward - (this.rowAr.PayInReward * 20) / 100 <
        PayOutReward &&
      Type == "PayOutReward"
    ) {
      //   //   console.log('PayOutReward : Effietve date change need');
      flagDate = 1;
    } else if (
      this.rowAr.PayInScheme - (this.rowAr.PayInScheme * 20) / 100 <
        PayOutScheme &&
      Type == "PayOutScheme"
    ) {
      //   //   console.log('PayOutScheme : Effietve date change need');
      flagDate = 1;
    } else {
      flagDate = 0;
    }

    //   //   console.log(flagDate);

    if (
      this.rowAr.PayInOD - (this.rowAr.PayInOD * this.PayIn_TDS) / 100 <
        PayOutOD &&
      Type == "PayOutOD"
    ) {
      //   //   console.log('PayOutOD : Need More than HOD ' + (this.rowAr.PayInOD - (this.rowAr.PayInOD * this.PayIn_TDS / 100)));
      flagNeedMore = 1;
      this.NeedMoreAlert(index, Type, PayOutOD);
    } else if (
      this.rowAr.PayInTP - (this.rowAr.PayInTP * this.PayIn_TDS) / 100 <
        PayOutTP &&
      Type == "PayOutTP"
    ) {
      //   //   console.log('PayOutTP : Need More than HOD ' + (this.rowAr.PayInTP - (this.rowAr.PayInTP * this.PayIn_TDS / 100)));
      flagNeedMore = 1;
      this.NeedMoreAlert(index, Type, PayOutTP);
    } else if (
      this.rowAr.PayInNet - (this.rowAr.PayInNet * this.PayIn_TDS) / 100 <
        PayOutNet &&
      Type == "PayOutNet"
    ) {
      //   //   console.log('PayOutNet : Need More than HOD ' + (this.rowAr.PayInNet - (this.rowAr.PayInNet * this.PayIn_TDS / 100)));
      flagNeedMore = 1;
      //PayInGroupFields.get('NeedMorePayOutNet').setValue('0');
      this.NeedMoreAlert(index, Type, PayOutNet);
    } else if (
      this.rowAr.PayInReward - (this.rowAr.PayInReward * this.PayIn_TDS) / 100 <
        PayOutReward &&
      Type == "PayOutReward"
    ) {
      //   //   console.log('PayOutReward : Need More than HOD ' + (this.rowAr.PayInReward - (this.rowAr.PayInReward * this.PayIn_TDS / 100)));
      flagNeedMore = 1;
    } else if (
      this.rowAr.PayInScheme - (this.rowAr.PayInScheme * this.PayIn_TDS) / 100 <
        PayOutScheme &&
      Type == "PayOutScheme"
    ) {
      //   //   console.log('PayOutScheme : Need More than HOD ' + (this.rowAr.PayInScheme - (this.rowAr.PayInScheme * this.PayIn_TDS / 100)));
      flagNeedMore = 1;
    } else {
      flagNeedMore = 0;
    }

    //   //   console.log('flagNeedMore status : ', flagNeedMore);

    if (flag == 1) {
      PayInGroupFields.get("Attachment_Status").setValue("1");
    } else {
      PayInGroupFields.get("Attachment_Status").setValue("0");
    }

    //this.PayInForm.get('Effective_Date').setValue(null);
    //this.PayInForm.get('Effective_Date').updateValueAndValidity();

    PayInGroupFields.get("Effective_Min_Date").setValue(null);
    PayInGroupFields.get("Effective_Min_Date").updateValueAndValidity();

    PayInGroupFields.get("Effective_Max_Date").setValue(null);
    PayInGroupFields.get("Effective_Max_Date").updateValueAndValidity();

    PayInGroupFields.get("Effective_Date").setValue(null);
    PayInGroupFields.get("Effective_Date").updateValueAndValidity();

    if (flagDate == 1) {
      //this.minDate = this.rowAr.minDate_RMA;
      //this.maxDate = this.rowAr.maxDate_RMA;
      PayInGroupFields.get("Effective_Min_Date").setValue(
        this.rowAr.minDate_RMA
      );
      PayInGroupFields.get("Effective_Max_Date").setValue(
        this.rowAr.maxDate_RMA
      );
    } else {
      //this.minDate = this.rowAr.minDate;
      //this.maxDate = this.rowAr.maxDate;

      PayInGroupFields.get("Effective_Min_Date").setValue(this.rowAr.minDate);
      PayInGroupFields.get("Effective_Max_Date").setValue(this.rowAr.maxDate);
    }
  }

  NeedMoreAlert(index, Type, v) {
    if (this.rowAr.ViewPayInStatus == 2 && this.ViewType == "View") {
      const PayInGroupFields = (<FormArray>this.PayInForm.get("AgentGroup")).at(
        index
      );
      if (
        confirm(
          "You are demanding more then HOD authority, For management approval please click below"
        ) == true
      ) {
        if (Type == "PayOutOD") {
          PayInGroupFields.get("NeedMorePayOutOD").setValue(v);
          PayInGroupFields.get("PayOutOD").setValue(
            this.rowAr.PayInOD - (this.rowAr.PayInOD * this.PayIn_TDS) / 100
          );
        }
        if (Type == "PayOutTP") {
          PayInGroupFields.get("NeedMorePayOutTP").setValue(v);
          PayInGroupFields.get("PayOutTP").setValue(
            this.rowAr.PayInTP - (this.rowAr.PayInTP * this.PayIn_TDS) / 100
          );
        }
        if (Type == "PayOutNet") {
          PayInGroupFields.get("NeedMorePayOutNet").setValue(v);
          PayInGroupFields.get("PayOutNet").setValue(
            this.rowAr.PayInNet - (this.rowAr.PayInNet * this.PayIn_TDS) / 100
          );
        }
      } else {
        PayInGroupFields.get("PayOutOD").setValue(null);
        PayInGroupFields.get("PayOutTP").setValue(null);
        PayInGroupFields.get("PayOutNet").setValue(null);
      }
    }
  }

  LoadMore(tilte: any, ar: any) {
    const dialogRef = this.dialog.open(V2PayInDataviewComponent, {
      width: "75%",
      //height:'40%',
      disableClose: true,
      data: { Type: tilte, DataAr: ar },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  LoadMore_v3(title: any, ar: any) {
    ////   //   console.log(title);
    ////   //   console.log(this.Make_Ar.length);

    if (title == "Make" && this.Make_Flag == 1) {
      this.sendPopUpData(title, this.Make_Ar);
    } else if (title == "Model" && this.Model_Flag == 1) {
      this.sendPopUpData(title, this.Model_Ar);
    } else if (title == "States" && this.States_Flag == 1) {
      this.sendPopUpData(title, this.States_Ar);
    } else if (title == "RTO" && this.RTO_Flag == 1) {
      this.sendPopUpData(title, this.RTO_Ar);
    } else {
      this.api.IsLoading();
      this.api
        .Call(
          "../v3/pay-in/WebPayIn/LoadMore_v3?&ViewType=" +
            this.ViewType +
            "&type=" +
            title +
            "&Id=" +
            this.Id +
            "&User_Id=" +
            this.api.GetUserId()
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              if (title == "Make") {
                this.Make_Flag = 1;
                this.Make_Ar = result["Data"];
              }
              if (title == "Model") {
                this.Model_Flag = 1;
                this.Model_Ar = result["Data"];
              }
              if (title == "States") {
                this.States_Flag = 1;
                this.States_Ar = result["Data"];
              }
              if (title == "RTO") {
                this.RTO_Flag = 1;
                this.RTO_Ar = result["Data"];
              }

              this.sendPopUpData(title, result["Data"]);
              ////   //   console.log(this.Make_Ar.length);
            }
          },
          (err) => {
            this.api.HideLoading();
            // Error log
          }
        );
    }
  }

  sendPopUpData(title: any, ar: any) {
    const dialogRef = this.dialog.open(V2PayInDataviewComponent, {
      width: "75%",
      //height:'40%',
      disableClose: true,
      data: { Type: title, DataAr: ar },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////   //   console.log(result);
    });
  }

  onChangeAttachment(event, index) {
    const PayInGroupFields = (<FormArray>this.PayInForm.get("AgentGroup")).at(
      index
    );

    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   console.log(this.selectedFiles);
      //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.ErrorMsg("File size is greater than 3 mb");
          PayInGroupFields.get("Attachment_Status").setValue("1");
        } else {
          //alert('hello');
          //PayInGroupFields.patchValue({
          //AttachmentSource: JSON.stringify(this.selectedFiles),
          //Attachment_Status : '2'
          //});
          //JSON.stringify(this.selectedFiles)
          PayInGroupFields.get("Attachment_Status").setValue("2");
        }
      } else {
        //   //   console.log('Extenstion is not vaild !');

        this.api.ErrorMsg(
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        PayInGroupFields.get("Attachment_Status").setValue("1");
      }
    }
  }

  ComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "../v3/pay-in/WebPayIn/GetPayInRow?User_Id=" +
          this.api.GetUserId() +
          "&User_Role=" +
          this.api.GetUserData("User_Role") +
          "&Id=" +
          this.Id +
          "&ViewType=" +
          this.ViewType +
          "&Bussiness_Month=" +
          this.Bussiness_Month
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.User_Rights = result["Data"]["SR_User_Rights"];
            this.rowAr_N = result["Data"]["rowAr"];
            this.rowAr = result["Data"]["rowAr"];
            this.SlabHistory = result["Data"]["rowAr"]["SlabHistory"];
            //   //   console.log(this.SlabHistory);

            this.logsAr = result["Data"]["logsAr"];

            this.minDate = this.rowAr["minDate"];
            this.maxDate = this.rowAr["maxDate"];

            this.PayIn_TDS = this.rowAr["PayIn_TDS"];

            var row = result["Data"]["PayInFormAr"];

            this.formArData = row;

            this.LOB_Ar = result["Data"]["LOB"];
            this.File_Type_Ar = row["File_Type"];

            this.Brokers_Ar = result["Data"]["Brokers"];
            this.Fleets_Ar = result["Data"]["Fleets"];

            this.CPA_Ar = row["CPA"];
            this.Source_Ar = row["Source_Type"];
            this.LI_Payment_Type_Ar = []; //row['LI_Payment_Type'];
            this.Fuel_Type_Ar = row["Fuel_Type"];
            this.Body_Type_Ar = row["Body_Type_Ids"];

            this.Ins_Companies_Ar = row["Ins_Compaines_Ids"];
            this.Zones_Ar = row["Zone_Ids"];
            this.States_Ar = row["States_Ids"];

            this.Products_Ar = row["Product_Ids"];
            this.Segment_Ar = row["Segment_Ids"];
            this.Plan_Type_Ar = row["Plan_Type"];
            this.SubProducts_Ar = row["SubProduct_Ids"];
            this.Classes_Ar = row["Class_Ids"];
            this.Sub_Classes_Ar = row["Sub_Class_Ids"];

            this.Make_Ar = row["Make_Id"];
            this.Model_Ar = row["Model_Id"];
            this.RTO_Ar = row["RTO_Ids"];

            this.Risk_Category_Ar = row["Risk_Category"];
            this.Risk_Occupancy_Ar = row["Risk_Occupancy"];

            if (this.ViewType == "ViewRequest") {
              this.AgentsGroup[0] = this.rowAr["Agents_Ar"];
              this.AgentGroup().push(this.NewAgentGroup());
            } else {
              //alert('h');
              this.addAgentGroup();
              //this.AgentGroup().push(this.NewAgentGroup());
            }

            this.PayInForm.patchValue(result["Data"]["PayInFormAr"]);
          } else {
            this.api.ErrorMsg(result["Message"]);
            this.CloseModel();
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
          this.CloseModel();
        }
      );
  }

  arToStr(arrc) {
    var result = [];
    var comma_value;
    //alert(arrc.length);
    //for (var i = 0; i < arrc.length; i++) {
    //result.push([arrc[i].Name]);
    //}

    console.table(result);
    ////   //   console.log(result.join(', '));
  }

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  PayInNet(e) {
    var PayInNet = e.target.value;
    const PayOutNet_Control = this.PayInForm.get("PayOutNet");
    //   //   console.log(PayInNet);
    //   //   console.log(PayInNet * 20 / 100);
    PayOutNet_Control.setValue(PayInNet - (PayInNet * 20) / 100);
  }

  PayInOD(e) {
    var PayInOD = e.target.value;
    const PayOutOD_Control = this.PayInForm.get("PayOutOD");
    //   //   console.log(PayInOD);
    //   //   console.log(PayInOD * 20 / 100);
    PayOutOD_Control.setValue(PayInOD - (PayInOD * 20) / 100);
  }

  PayInTP(e) {
    var PayInTP = e.target.value;
    const PayOutTP_Control = this.PayInForm.get("PayOutTP");
    //   //   console.log(PayInTP);
    //   //   console.log(PayInTP * 20 / 100);
    PayOutTP_Control.setValue(PayInTP - (PayInTP * 20) / 100);
  }

  checkPayInPremimSlab(e, index) {
    document.getElementById("PayInPremimSlabUpTo_Ids_" + index).innerHTML = "";
    document.getElementById("PayInPremimSlabFrom_Ids_" + index).innerHTML = "";
    /*
		const PayInNetGroupFields = (<FormArray>this.PayInForm.get("PayInNetGroup")).at(index);
		//   //   console.log(PayInNetGroupFields);
		var PayInNetPremimSlabFrom = this.PayInForm.get("PayInNetGroup").value[index]['PayInNetPremimSlabFrom'];
		var PayInNetPremimSlabUpTo = this.PayInForm.get("PayInNetGroup").value[index]['PayInNetPremimSlabUpTo'];
		//   //   console.log(PayInNetPremimSlabFrom);
		//   //   console.log(PayInNetPremimSlabUpTo);
		*/
  }

  PayInGroupPercentage(e, index, Type) {
    const PayInGroupFields = (<FormArray>this.PayInForm.get("PayInGroup")).at(
      index
    );

    var PayIn_Index_value = e.target.value;
    //   //   console.log(PayIn_Index_value * 20 / 100);

    let PayOut_value = PayIn_Index_value - (PayIn_Index_value * 20) / 100;

    if (Type == "PayIn_OD") {
      PayInGroupFields.patchValue({
        PayOut_OD: PayOut_value,
      });
      document.getElementById("PayIn_OD_Ids_" + index).innerHTML = "";
    }
    if (Type == "PayIn_TP") {
      PayInGroupFields.patchValue({
        PayOut_TP: PayOut_value,
      });
      document.getElementById("PayIn_TP_Ids_" + index).innerHTML = "";
    }

    if (Type == "PayIn_Net") {
      PayInGroupFields.patchValue({
        PayOut_Net: PayOut_value,
      });
      document.getElementById("PayIn_Net_Ids_" + index).innerHTML = "";
    }
  }

  PayInReward(e) {
    var PayInReward = e.target.value;
    const PayInRewardNet_Control = this.PayInForm.get("PayOutReward");
    //   //   console.log(PayInReward);
    //   //   console.log(PayInReward * 20 / 100);
    PayInRewardNet_Control.setValue(PayInReward - (PayInReward * 20) / 100);
  }

  PayInScheme(e) {
    var PayInScheme = e.target.value;
    const PayOutSchemeNet_Control = this.PayInForm.get("PayOutScheme");
    //   //   console.log(PayInScheme);
    //   //   console.log(PayInScheme * 20 / 100);
    PayOutSchemeNet_Control.setValue(PayInScheme - (PayInScheme * 20) / 100);
  }

  onItemSelect_SLAB(item: any, index) {
    //   //   console.log(item.Id);

    const PayInGroupFields = (<FormArray>this.PayInForm.get("PayInGroup")).at(
      index
    );
    ////   //   console.log(PayInGroupFields);

    if (item.Id == "OD") {
      PayInGroupFields.get("PayIn_OD").enable();
      PayInGroupFields.get("PayOut_OD").enable();
      this.PayOut_OD_Readonly = true;
    }

    if (item.Id == "TP") {
      PayInGroupFields.get("PayIn_TP").enable();
      PayInGroupFields.get("PayOut_TP").enable();
      this.PayOut_TP_Readonly = true;
    }

    if (item.Id == "Net") {
      PayInGroupFields.get("PayIn_Net").enable();
      PayInGroupFields.get("PayOut_Net").enable();
      this.PayOut_Net_Readonly = true;
    }
  }
  onItemDeSelect_SLAB(item: any, index) {
    //   //   console.log(item);

    const PayInGroupFields = (<FormArray>this.PayInForm.get("PayInGroup")).at(
      index
    );
    ////   //   console.log(PayInGroupFields);

    if (item.Id == "OD") {
      PayInGroupFields.get("PayIn_OD").disable();
      PayInGroupFields.get("PayOut_OD").disable();

      PayInGroupFields.get("PayIn_OD").setValue(null);
      PayInGroupFields.get("PayOut_OD").setValue(null);

      this.PayOut_OD_Readonly = true;
    }

    if (item.Id == "TP") {
      PayInGroupFields.get("PayIn_TP").disable();
      PayInGroupFields.get("PayOut_TP").disable();

      PayInGroupFields.get("PayIn_TP").setValue(null);
      PayInGroupFields.get("PayOut_TP").setValue(null);

      this.PayOut_TP_Readonly = true;
    }

    if (item.Id == "Net") {
      PayInGroupFields.get("PayIn_Net").disable();
      PayInGroupFields.get("PayOut_Net").disable();

      PayInGroupFields.get("PayIn_Net").setValue(null);
      PayInGroupFields.get("PayOut_Net").setValue(null);

      this.PayOut_Net_Readonly = false;
    }
  }

  PO_Group() {}

  LOB(Type: any) {
    if (Type == "LOB") {
      this.Ins_Companies_Ar = [];
      this.PayInForm.get("Ins_Compaines_Ids").setValue(null);
    }

    this.File_Type_Ar = [];
    this.Products_Ar = [];
    this.Plan_Type_Ar = [];
    this.Segment_Ar = [];
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.RTO_Ar = [];

    this.PayInForm.get("File_Type").setValue(null);
    this.PayInForm.get("Product_Ids").setValue(null);
    this.PayInForm.get("Plan_Type").setValue(null);
    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Segment_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);
    this.PayInForm.get("RTO_Ids").setValue(null);

    const formData = new FormData();
    formData.append("PO_Group", this.PayInForm.value["PO_Group"]);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "Ins_Compaines_Ids",
      JSON.stringify(this.PayInForm.value["Ins_Compaines_Ids"])
    );
    this.api.HttpPostType("../v2/pay-in/Fillter/GetFileTypes", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.File_Type_Ar = result["Data"]["File_Type_Ar"];
          this.Brokers_Ar = result["Data"]["Brokers"];
          this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
        } else {
          this.Products_Ar = [];
          this.Ins_Companies_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  File_Type(Type: any) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "File_Type",
      JSON.stringify(this.PayInForm.value["File_Type"])
    );
    formData.append(
      "Ins_Compaines_Ids",
      JSON.stringify(this.PayInForm.value["Ins_Compaines_Ids"])
    );
    this.api.HttpPostType("../v2/pay-in/Fillter/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"]["Product"];
          if (this.ViewType == "View") {
            this.productSelection();
          }
        } else {
          this.Products_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  productSelection() {
    this.Is_Body_Type = false;
    var p = this.PayInForm.get("Product_Ids").value;
    ////   //   console.log(p);

    for (var i = 0; i < p.length; i++) {
      if (p[i]["Id"] == "TW") {
        //   //   console.log(p[i]['Id']);
        this.Is_Body_Type = true;
      }
    }
  }

  onItemSelect(items: any, Type: any) {}
  onItemDeSelect(items: any, Type: any) {}
  onSelectAll(items: any, Type: any) {}
  onDeSelectAll(items: any, Type: any) {}

  Product(Type: any) {
    ////   //   console.log(this.PayInForm.value['Product_Ids']);

    this.Plan_Type_Ar = [];
    this.Segment_Ar = [];
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];

    this.Make_Ar = [];
    this.Model_Ar = [];

    this.PayInForm.get("Plan_Type").setValue(null);
    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Segment_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);
    this.PayInForm.get("Make_Id").setValue(null);
    this.PayInForm.get("Model_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "File_Type",
      JSON.stringify(this.PayInForm.value["File_Type"])
    );
    formData.append(
      "Company_Id",
      this.PayInForm.value["Ins_Compaines_Ids"][0]["Id"]
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );

    this.api.HttpPostType("../v2/pay-in/Fillter/GetPolicyType", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"]["PolicyType"];
          this.productSelection();
        } else {
          this.Segment_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  PolicyType(Type: any) {
    ////   //   console.log(this.PayInForm.value['Product_Ids']);

    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];

    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);
    this.PayInForm.get("Make_Id").setValue(null);
    this.PayInForm.get("Model_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "File_Type",
      JSON.stringify(this.PayInForm.value["File_Type"])
    );
    formData.append(
      "Company_Id",
      this.PayInForm.value["Ins_Compaines_Ids"][0]["Id"]
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );

    this.api.HttpPostType("../v2/pay-in/Fillter/GetPlanType", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Plan_Type_Ar = result["Data"]["PlanType"];
        } else {
          this.Plan_Type_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  PlanType(Type: any) {
    ////   //   console.log(this.PayInForm.value['Product_Ids']);

    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];

    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);
    this.PayInForm.get("Make_Id").setValue(null);
    this.PayInForm.get("Model_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "File_Type",
      JSON.stringify(this.PayInForm.value["File_Type"])
    );
    formData.append(
      "Company_Id",
      this.PayInForm.value["Ins_Compaines_Ids"][0]["Id"]
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );
    formData.append(
      "Plan_Type",
      JSON.stringify(this.PayInForm.value["Plan_Type"])
    );

    this.api.HttpPostType("../v2/pay-in/Fillter/GetSubProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.SubProducts_Ar = result["Data"]["SubProducts"];
        } else {
          this.SubProducts_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  SubProduct(Type: any) {
    ////   //   console.log(this.PayInForm.value['Product_Ids']);

    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];

    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);
    this.PayInForm.get("Make_Id").setValue(null);
    this.PayInForm.get("Model_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "File_Type",
      JSON.stringify(this.PayInForm.value["File_Type"])
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );
    formData.append(
      "Plan_Type",
      JSON.stringify(this.PayInForm.value["Plan_Type"])
    );
    formData.append(
      "SubProduct_Ids",
      JSON.stringify(this.PayInForm.value["SubProduct_Ids"])
    );

    this.api.HttpPostType("../v2/pay-in/Fillter/GetClasses", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"]["Classes"];
        } else {
          this.Classes_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }
  Classes(Type: any) {
    ////   //   console.log(this.PayInForm.value['Product_Ids']);

    this.Make_Ar = [];
    this.Model_Ar = [];

    this.PayInForm.get("Sub_Class_Ids").setValue(null);

    this.PayInForm.get("Make_Id").setValue(null);
    this.PayInForm.get("Model_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB"]);
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );
    formData.append(
      "Plan_Type",
      JSON.stringify(this.PayInForm.value["Plan_Type"])
    );
    formData.append(
      "SubProduct_Ids",
      JSON.stringify(this.PayInForm.value["SubProduct_Ids"])
    );
    formData.append(
      "Class_Ids",
      JSON.stringify(this.PayInForm.value["Class_Ids"])
    );

    this.api.HttpPostType("../v2/pay-in/Fillter/GetSubClasses", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Sub_Classes_Ar = result["Data"]["SubClasses"];
        } else {
          this.Sub_Classes_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  RTO(Type: any) {
    this.RTO_Ar = [];
    this.PayInForm.get("RTO_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append(
      "States_Ids",
      JSON.stringify(this.PayInForm.value["States_Ids"])
    );
    this.api.HttpPostType("../v2/pay-in/Fillter/GetRTO", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.RTO_Ar = result["Data"]["RTO"];
          //this.Agents_Placeholder = 'Select Agents ('+this.Agents_Ar.length+')';
        } else {
          this.RTO_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Make(Type: any) {
    this.Make_Ar = [];
    this.Model_Ar = [];

    this.PayInForm.get("Make_Id").setValue(null);
    this.PayInForm.get("Model_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Sub_Class_Ids",
      JSON.stringify(this.PayInForm.value["Sub_Class_Ids"])
    );
    formData.append("Sub_Class_Ar", JSON.stringify(this.Sub_Classes_Ar));

    this.api.HttpPostType("../v2/pay-in/Fillter/GetMake", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Make_Ar = result["Data"]["Make"];
        } else {
          this.Make_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Model(Type: any) {
    this.Model_Ar = [];

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Sub_Class_Ids",
      JSON.stringify(this.PayInForm.value["Sub_Class_Ids"])
    );
    formData.append("Make_Id", JSON.stringify(this.PayInForm.value["Make_Id"]));
    this.api.HttpPostType("../v2/pay-in/Fillter/GetModel", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Model_Ar = result["Data"]["Model"];
        } else {
          this.Model_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  onChangeAgentType() {
    var AgentType = this.PayInForm.get("AgentType").value;
    //   //   console.log(AgentType);

    //this.Agents_Ar = [];

    var Agent_IdsControl = this.PayInForm.get("Agent_Ids");
    Agent_IdsControl.setValue(null);

    if (AgentType == "All-Agents" || AgentType == "Non-Fleet-All-Agents") {
      Agent_IdsControl.setValidators(null);
    } else {
      Agent_IdsControl.setValidators([Validators.required]);
    }

    Agent_IdsControl.updateValueAndValidity();
  }
  onSelectAllAgent(e: any, index) {}

  searchAgents(e) {
    ////   //   console.log(e.target.value);
    //this.api.IsLoading();
    this.api.Call("pay/PayIn/SearchAgents?q=" + e.target.value).then(
      (result) => {
        //this.api.HideLoading();
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.isCheckedAllAgents = false;
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        // Error log
        //this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  onSubmitType(Type) {
    this.SubmitType = Type;
    //   //   console.log(this.SubmitType);
  }

  AddPayIn() {
    //   //   console.log(this.PayInForm.value);

    this.isSubmitted = true;
    if (this.PayInForm.invalid) {
      return;
    } else {
      var fields = this.PayInForm.value;
      const formData = new FormData();

      formData.append("PayIn_Id", this.Id);
      formData.append("ViewType", this.ViewType);
      formData.append("Business_Month", this.Bussiness_Month);

      formData.append("User_Id", this.api.GetUserId());
      formData.append("User_Role", this.api.GetUserData("User_Role"));

      /*
			formData.append('Broker_Ids',JSON.stringify(fields['Broker_Ids']));

			formData.append('Ins_Compaines_Ids',JSON.stringify(fields['Ins_Compaines_Ids']));

			formData.append('Zone_Ids',JSON.stringify(fields['Zone_Ids']));
			formData.append('States_Ids',JSON.stringify(fields['States_Ids']));
			formData.append('RTO_Ids',JSON.stringify(fields['RTO_Ids']));
			formData.append('CPA',JSON.stringify(fields['CPA']));

			formData.append('NCB_Status',JSON.stringify(fields['NCB_Status']));
			formData.append('LI_Payment_Type',JSON.stringify(fields['LI_Payment_Type']));
			formData.append('VehicleAgeFrom',fields['VehicleAgeFrom']);
			formData.append('VehicleAgeTo',fields['VehicleAgeTo']);

			formData.append('LOB_Ids',fields['LOB']);

			formData.append('Source_Type',JSON.stringify(fields['Source_Type']));
			formData.append('Fuel_Type_Ids',JSON.stringify(fields['Fuel_Type']));
			formData.append('File_Type_Ids',JSON.stringify(fields['File_Type']));
			formData.append('Product_Ids',JSON.stringify(fields['Product_Ids']));
			formData.append('Plan_Type',JSON.stringify(fields['Plan_Type']));
			formData.append('SubProduct_Ids',JSON.stringify(fields['SubProduct_Ids']));
			formData.append('Segment_Ids',JSON.stringify(fields['Segment_Ids']));
			formData.append('Class_Ids',JSON.stringify(fields['Class_Ids']));
			formData.append('Sub_Class_Ids',JSON.stringify(fields['Sub_Class_Ids']));
			formData.append('Body_Type_Ids',JSON.stringify(fields['Body_Type_Ids']));

			formData.append('Make_Id',JSON.stringify(fields['Make_Id']));
			formData.append('Model_Id',JSON.stringify(fields['Model_Id']));
			*/

      formData.append("AgentGroup_Ar", JSON.stringify(fields["AgentGroup"]));

      formData.append("PayInOD", this.rowAr.PayInOD);
      formData.append("PayInTP", this.rowAr.PayInTP);
      formData.append("PayInNet", this.rowAr.PayInNet);
      formData.append("PayInReward", this.rowAr.PayInReward);
      formData.append("PayInScheme", this.rowAr.PayInScheme);

      formData.append("PayInGroup", JSON.stringify(fields["PayInGroup"]));

      for (var i = 0; i < this.PayInForm.value["AgentGroup"].length; i++) {
        if (this.ViewType == "ViewRequest") {
          var o = this.PayInForm.value["AgentGroup"][i]["PayOutOD"];
          var t = this.PayInForm.value["AgentGroup"][i]["PayOutTP"];
          var n = this.PayInForm.value["AgentGroup"][i]["PayOutNet"];
          var r = this.PayInForm.value["AgentGroup"][i]["PayOutReward"];
          var s = this.PayInForm.value["AgentGroup"][i]["PayOutScheme"];

          //alert('OD='+o+'TP='+t+'Net='+n+'Reward='+r+'Scheme='+s);
          if (o == "" || o === undefined || o === null) {
            alert("Payout OD Field is Required !");
            return;
          }
          if (t == "" || t === undefined || t === null) {
            alert("Payout TP Field is Required !");
          }
          if (n == "" || n === undefined || n === null) {
            alert("Payout Net Field is Required !");
            return;
          }
          if (r == "" || r === undefined || r === null) {
            alert("Payout Reward Field is Required !");
            return;
          }
          if (s == "" || s === undefined || s === null) {
            alert("Payout Scheme Field is Required !");
            return;
          }
        }

        if (this.PayInForm.value["AgentGroup"][i]["Attachment_Status"] == "2") {
          const selectedFileList = (<HTMLInputElement>(
            document.getElementById("Attachment_" + i)
          )).files;
          const file = selectedFileList.item(0);
          ////   //   console.log(file);
          formData.append("Attachment_" + i, file);
        }

        if (this.PayInForm.value["AgentGroup"][i]["PayOut_Mode"] == "") {
          //alert('Please choose Payout mode !');
          //return;
        }
        if (
          this.PayInForm.value["AgentGroup"][i]["Bussiness_Commitment"] == ""
        ) {
          alert("Please enter Bussiness Commitment !");
          return;
        }
        if (this.PayInForm.value["AgentGroup"][i]["Effective_Date"] == "") {
          alert("Please choose Effective Date !");
          return;
        }
      }

      //formData.append('PayIn_Remark',fields['PayIn_Remark']);
      //formData.append('Extra_Remark',fields['Extra_Remark']);
      formData.append("Remark", fields["Remark"]);
      //formData.append('Effective_Date',fields['Effective_Date']);

      formData.append("SubmitType", this.SubmitType);

      var url = "../v3/pay-in/WebPayIn/AddRequest";
      if (this.ViewType == "ViewRequest") {
        url = "../v3/pay-in/WebPayIn/UpdatePayoutRequest";
      }

      this.api.IsLoading();
      this.api.HttpPostType(url, formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.ToastMessage(result["Message"]);

            this.CloseModel();
            //this.router.navigate(['/payin/pay-in-list']);
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
  }
}
