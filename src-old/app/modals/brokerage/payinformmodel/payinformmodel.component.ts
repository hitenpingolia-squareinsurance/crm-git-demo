import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BmsapiService } from "../../../providers/bmsapi.service";

@Component({
  selector: "app-payinformmodel",
  templateUrl: "./payinformmodel.component.html",
  styleUrls: ["./payinformmodel.component.css"],
})
export class PayinformmodelComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};
  dropdownSettingsFileType: any = {};
  LOB_dropdownSettings: any = {};
  ins_Company_dropdownSettings: any = {};
  PayInApplicableType_dropdownSettings: any = {};
  cities: any = [];
  selectedItems: any = [];

  value: any;
  selected: any;

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
  PayInDataAr: any = [];

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

  Make_Ar: any = [];
  Model_Ar: any = [];

  PayInApplicableType_Ar: any = [];

  Agents_Placeholder: string = "Select Agents (0)";

  isCheckedAllAgents: any = true;
  Is_Body_Type: any = false;

  PayOut_OD_Readonly: any = false;
  PayOut_TP_Readonly: any = false;
  PayOut_Net_Readonly: any = false;

  EnableTwoWheelerBodyType: any = 0;
  Risk_ColumnStatus: any = 0;
  HEV_Ar: any = [];
  Hev_Status: any = false;

  Id: any = 0;
  ViewType: any = 0;
  Action: any = "";
  Risk_Category_Ar: any = [];
  Risk_Occupancy_Ar: any = [];

  constructor(
    public api: BmsapiService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PayinformmodelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
    this.ViewType = this.data.Type;

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
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

    this.HEV_Ar = [
      { Id: "None", Name: "None" },
      { Id: "AUDI", Name: "AUDI" },
      { Id: "BENTLEY", Name: "BENTLEY" },
      { Id: "BMW", Name: "BMW" },
      { Id: "CADILLAC", Name: "CADILLAC" },
      { Id: "HUMMER", Name: "HUMMER" },
      { Id: "JAGUAR", Name: "JAGUAR" },
      { Id: "LEXUS", Name: "LEXUS" },
      { Id: "MAYBACH", Name: "MAYBACH" },
      { Id: "MERCEDES", Name: "MERCEDES" },
      { Id: "PORSCHE", Name: "PORSCHE" },
      { Id: "ROLLS ROYCE", Name: "ROLLS ROYCE" },
      { Id: "ROVER", Name: "ROVER" },
    ];

    this.Risk_Category_Ar = [
      { Id: "Prefered", Name: "Prefered" },
      { Id: "Referred", Name: "Referred" },
      { Id: "Decline", Name: "Decline" },
    ];
  }

  ngOnInit() {
    this.PayInForm = this.fb.group({
      LOB: ["", [Validators.required]],
      File_Type: ["", [Validators.required]],
      PO_Group: ["", [Validators.required]],

      Broker_Ids: ["", [Validators.required]],
      Ins_Compaines_Ids: ["", [Validators.required]],

      Product_Ids: ["", [Validators.required]],
      Segment_Ids: ["", [Validators.required]],
      Plan_Type: ["", [Validators.required]],
      SubProduct_Ids: [""],
      Class_Ids: [""],
      Sub_Class_Ids: [""],
      Risk_Category: [""],
      Risk_Occupancy: [""],

      HEV: [""],
      Fuel_Type: [""],
      Body_Type_Ids: [""],
      CPA: [""],
      NCB_Status: [""],
      LI_Payment_Type: [""],
      VehicleAgeFrom: [""],
      VehicleAgeTo: [""],

      Zone_Ids: ["", [Validators.required]],
      States_Ids: [""],
      RTO_Ids: [""],

      AgentType: ["", [Validators.required]],
      Agent_Ids: ["", [Validators.required]],
      SlabType: ["", [Validators.required]],
      Source_Type: ["", [Validators.required]],

      Make_Id: [""],
      Model_Id: [""],

      PayInOD: ["0"],
      PayOutOD: ["0"],
      PayInTP: ["0"],
      PayOutTP: ["0"],

      PayInNet: ["0"],
      PayOutNet: ["0"],

      PayInReward: ["0"],
      PayOutReward: ["0"],
      PayInScheme: ["0"],
      PayOutScheme: ["0"],

      PayInGroup: this.fb.array([]),
      PayInSumInsuredGroup: this.fb.array([]),

      PayIn_Remark: ["", [Validators.required]],
      Extra_Remark: ["", [Validators.required]],
      Effective_Date: ["", [Validators.required]],
    });

    //this.AddPayIn();

    this.ComponentsData();

    this.PayInGroup().push(this.NewPayInGroup());

    this.quantities().push(this.newQuantity());
  }
  get FC() {
    return this.PayInForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  PayInGroup(): FormArray {
    return this.PayInForm.get("PayInGroup") as FormArray;
  }

  removePayInGroup(i: number) {
    this.PayInGroup().removeAt(i);
  }

  NewPayInGroup(): FormGroup {
    return this.fb.group({
      PayInPremimSlabFrom: [""],
      PayInPremimSlabUpTo: [""],

      PayInSlabApplicableType: [""],
      PayInApplicableType: [""],

      PayIn_OD: [{ value: "", disabled: true }],
      PayOut_OD: [{ value: "", disabled: true }],

      PayIn_TP: [{ value: "", disabled: true }],
      PayOut_TP: [{ value: "", disabled: true }],

      PayIn_Net: [{ value: "", disabled: true }],
      PayOut_Net: [{ value: "", disabled: true }],
    });
  }

  AddMore() {
    this.PayInGroup().push(this.NewPayInGroup());
  }

  quantities(): FormArray {
    return this.PayInForm.get("PayInSumInsuredGroup") as FormArray;
  }
  newQuantity(): FormGroup {
    return this.fb.group({
      PremimSlabFrom: "",
      PremimSlabUpTo: "",
    });
  }
  addQuantity() {
    this.quantities().push(this.newQuantity());
  }
  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  PayInNet(e) {
    var PayInNet = e.target.value;
    const PayOutNet_Control = this.PayInForm.get("PayOutNet");
    // console.log(PayInNet);
    // console.log(PayInNet*20/100);
    PayOutNet_Control.setValue(PayInNet - (PayInNet * 20) / 100);
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

  checkPayInPremimSlab(e, index) {
    document.getElementById("PayInPremimSlabUpTo_Ids_" + index).innerHTML = "";
    document.getElementById("PayInPremimSlabFrom_Ids_" + index).innerHTML = "";
    /*
	const PayInNetGroupFields = (<FormArray>this.PayInForm.get("PayInNetGroup")).at(index);
	// console.log(PayInNetGroupFields);
	var PayInNetPremimSlabFrom = this.PayInForm.get("PayInNetGroup").value[index]['PayInNetPremimSlabFrom'];
	var PayInNetPremimSlabUpTo = this.PayInForm.get("PayInNetGroup").value[index]['PayInNetPremimSlabUpTo'];
	// console.log(PayInNetPremimSlabFrom);
	// console.log(PayInNetPremimSlabUpTo);
	*/
  }

  PayInGroupPercentage(e, index, Type) {
    const PayInGroupFields = (<FormArray>this.PayInForm.get("PayInGroup")).at(
      index
    );

    var PayIn_Index_value = e.target.value;
    // console.log(PayIn_Index_value*20/100);

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

  onItemSelect_SLAB(item: any, index) {
    // console.log(item.Id);

    const PayInGroupFields = (<FormArray>this.PayInForm.get("PayInGroup")).at(
      index
    );
    //// console.log(PayInGroupFields);

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
    // console.log(item);

    const PayInGroupFields = (<FormArray>this.PayInForm.get("PayInGroup")).at(
      index
    );
    //// console.log(PayInGroupFields);

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

  ComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "../v2/pay-in/Fillter/AddPayInFormComponentsAr?User_Id=" +
          this.api.GetUserId() +
          "&Id=" +
          this.Id +
          "&ViewType=" +
          this.ViewType
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.User_Rights = result["Data"]["SR_User_Rights"];
            this.LOB_Ar = result["Data"]["LOB"];
            this.File_Type_Ar = result["Data"]["File_ar"];

            this.Brokers_Ar = result["Data"]["Brokers"];
            this.Fleets_Ar = result["Data"]["Fleets"];

            this.CPA_Ar = result["Data"]["CPA"];
            this.Source_Ar = result["Data"]["Source"];
            this.LI_Payment_Type_Ar = result["Data"]["LI_Payment_Type"];
            this.Fuel_Type_Ar = result["Data"]["Fuel"];
            this.Body_Type_Ar = result["Data"]["Body"];

            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
            this.Zones_Ar = result["Data"]["Zones"];
            this.States_Ar = result["Data"]["States"];
            this.PayInDataAr = result["Data"]["PayInDataAr"];
            this.Risk_Occupancy_Ar = result["Data"]["Risk_Occupancy_Ar"];

            if (this.ViewType == "View") {
              this.Segment_Ar = result["Data"]["PolicyType"];
              this.Plan_Type_Ar = result["Data"]["PlanType"];
              this.SubProducts_Ar = result["Data"]["SubProducts"];
              this.Classes_Ar = result["Data"]["Classes_Ar"];
              this.Sub_Classes_Ar = result["Data"]["Sub_Classes_Ar"];
              this.Make_Ar = result["Data"]["Make_Ar"];
              this.Model_Ar = result["Data"]["Model_Ar"];
              this.RTO_Ar = result["Data"]["RTO_Ar"];

              if (result["Data"]["PayInFormAr"]["AgentType"] == "Search") {
                this.Agents_Ar = result["Data"]["PayInFormAr"]["Agent_Ids"];
                this.selected = result["Data"]["PayInFormAr"]["Agent_Ids"];
              }

              this.PayInForm.patchValue(result["Data"]["PayInFormAr"]);
              this.File_Type("Company");
              if (result["Data"]["PayInFormAr"]["AgentType"] != "Fleet") {
                this.onChangeAgentType();
              }
            }
          } else {
            this.api.ErrorMsg(result["Message"]);
            this.CloseModel();
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
          this.CloseModel();
        }
      );
  }

  PO_Group() {
    this.PayInForm.get("LOB").setValue(null);
    this.PayInForm.get("File_Type").setValue(null);

    this.PayInForm.get("Broker_Ids").setValue(null);
  }

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

          if (this.PayInForm.value["PO_Group"] == 1) {
            this.PayInForm.get("Broker_Ids").setValue([
              { Id: "1", Name: "SIBPL" },
            ]);
          } else {
            this.PayInForm.get("Broker_Ids").setValue(null);
          }
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
    this.Hev_Status = false;
    this.Risk_ColumnStatus = 0;
    var p = this.PayInForm.get("Product_Ids").value;
    //// console.log(p);

    for (var i = 0; i < p.length; i++) {
      if (p[i]["Id"] == "TW") {
        // console.log(p[i]['Id']);
        this.Is_Body_Type = true;
      }

      if (p[i]["Id"] == "PC") {
        // console.log(p[i]['Id']);
        this.Hev_Status = true;
      }

      if (p[i]["Id"] == "Fire") {
        this.Risk_ColumnStatus = 1;
      }
    }
  }

  onItemSelect(items: any, Type: any) {
    if (Type == "File_Type") {
      this.Plan_Type_Ar = [];
      this.Segment_Ar = [];
      this.SubProducts_Ar = [];
      this.Classes_Ar = [];
      this.Sub_Classes_Ar = [];

      this.Make_Ar = [];
      this.Model_Ar = [];

      this.PayInForm.get("Product_Ids").setValue(null);
      this.PayInForm.get("Plan_Type").setValue(null);
      this.PayInForm.get("SubProduct_Ids").setValue(null);
      this.PayInForm.get("Segment_Ids").setValue(null);
      this.PayInForm.get("Class_Ids").setValue(null);
      this.PayInForm.get("Sub_Class_Ids").setValue(null);
      this.PayInForm.get("Make_Id").setValue(null);
      this.PayInForm.get("Model_Id").setValue(null);

      this.File_Type("File_Type");
    } else if (Type == "InsuranceCompany") {
      this.File_Type("Company");
    } else if (Type == "Product") {
      this.Product("Select");
    } else if (Type == "PolicyType") {
      this.PolicyType("Select");
    } else if (Type == "PlanType") {
      this.PlanType("Select");
    } else if (Type == "SubProduct") {
      this.SubProduct("Select");
    } else if (Type == "Class") {
      this.Classes("Select");
    } else if (Type == "State") {
      this.RTO("Select");
    } else if (Type == "SubClass") {
      this.Make("Select");
    } else if (Type == "Make") {
      this.Model("Select");
    }
  }
  onItemDeSelect(items: any, Type: any) {
    if (Type == "File_Type") {
      this.File_Type("File_Type");
    } else if (Type == "InsuranceCompany") {
      this.File_Type("Company");
    } else if (Type == "Product") {
      this.Product("DeSelect");
    } else if (Type == "PolicyType") {
      this.PolicyType("DeSelect");
    } else if (Type == "PlanType") {
      this.PlanType("DeSelect");
    } else if (Type == "SubProduct") {
      this.SubProduct("DeSelect");
    } else if (Type == "Class") {
      this.Classes("DeSelect");
    } else if (Type == "State") {
      this.RTO("DeSelect");
    } else if (Type == "SubClass") {
      this.Make("DeSelect");
    } else if (Type == "Make") {
      this.Model("DeSelect");
    }
  }
  onSelectAll(items: any, Type: any) {
    if (Type == "File_Type") {
      this.File_Type("File_Type");
    } else if (Type == "Product") {
      this.Product("SelectAll");
    } else if (Type == "PolicyType") {
      this.PolicyType("SelectAll");
    } else if (Type == "PlanType") {
      this.PlanType("SelectAll");
    } else if (Type == "SubProduct") {
      this.SubProduct("SelectAll");
    } else if (Type == "Class") {
      this.Classes("SelectAll");
    } else if (Type == "State") {
      this.RTO("SelectAll");
    } else if (Type == "SubClass") {
      this.Make("SelectAll");
    } else if (Type == "Make") {
      this.Model("SelectAll");
    }
  }
  onDeSelectAll(items: any, Type: any) {
    if (Type == "File_Type") {
      this.File_Type("File_Type");
    } else if (Type == "Product") {
      this.Product("DeSelectAll");
    } else if (Type == "PolicyType") {
      this.PolicyType("DeSelectAll");
    } else if (Type == "PlanType") {
      this.PlanType("DeSelectAll");
    } else if (Type == "SubProduct") {
      this.SubProduct("DeSelectAll");
    } else if (Type == "Class") {
      this.Classes("DeSelectAll");
    } else if (Type == "State") {
      this.RTO("DeSelectAll");
    } else if (Type == "SubClass") {
      this.Make("DeSelectAll");
    } else if (Type == "Make") {
      this.Model("DeSelectAll");
    }
  }

  Product(Type: any) {
    //// console.log(this.PayInForm.value['Product_Ids']);

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
    //// console.log(this.PayInForm.value['Product_Ids']);

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
    //// console.log(this.PayInForm.value['Product_Ids']);

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
    //// console.log(this.PayInForm.value['Product_Ids']);

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
    //// console.log(this.PayInForm.value['Product_Ids']);

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
    //this.RTO_Ar = [];
    //this.PayInForm.get('RTO_Ids').setValue(null);

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
      "Sub_Class_Ids",
      JSON.stringify(this.PayInForm.value["Sub_Class_Ids"])
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
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
    // console.log(AgentType);

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

  searchAgents(e) {
    //// console.log(e.target.value);
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
        //// console.log(err.message);
        alert(err.message);
      }
    );
  }

  ActionBtn(type) {
    //alert(type);
    this.Action = type;
    this.AddPayIn();
  }

  AddPayIn() {
    // console.log(this.PayInForm.value);

    if (this.PayInForm.value["SlabType"] == "Slab") {
      var PayInGroupForm = this.PayInForm.get("PayInGroup").value; //[index]['PayInNetPremimSlabFrom'];

      // console.log(PayInGroupForm);

      for (var i = 0; i < PayInGroupForm.length; i++) {
        var from = PayInGroupForm[i]["PayInPremimSlabFrom"];
        var upTo = PayInGroupForm[i]["PayInPremimSlabUpTo"];

        var PayInSlabApplicableType =
          PayInGroupForm[i]["PayInSlabApplicableType"];
        var PayInApplicableType = PayInGroupForm[i]["PayInApplicableType"];

        var PayIn_OD = PayInGroupForm[i]["PayIn_OD"];
        var PayOut_OD = PayInGroupForm[i]["PayOut_OD"];

        var PayIn_TP = PayInGroupForm[i]["PayIn_TP"];
        var PayOut_TP = PayInGroupForm[i]["PayOut_TP"];

        var PayIn_Net = PayInGroupForm[i]["PayIn_Net"];
        var PayOut_Net = PayInGroupForm[i]["PayOut_Net"];

        if (PayInSlabApplicableType == "" || PayInSlabApplicableType == null) {
          document.getElementById("PayInType_Ids_" + i).innerHTML =
            "Please enter Pay-In Slab Applicable Type";
        } else {
          document.getElementById("PayInType_Ids_" + i).innerHTML = "";
        }

        if (from == "" || from == null) {
          document.getElementById("PayInPremimSlabFrom_Ids_" + i).innerHTML =
            "Please enter Pay-In Premimum Slab From";
        } else {
          document.getElementById("PayInPremimSlabFrom_Ids_" + i).innerHTML =
            "";
        }

        if (upTo == "" || upTo == null) {
          document.getElementById("PayInPremimSlabUpTo_Ids_" + i).innerHTML =
            "Please enter Pay-In Premimum Slab UpTo";
        } else {
          document.getElementById("PayInPremimSlabUpTo_Ids_" + i).innerHTML =
            "";
        }

        if (from > upTo) {
          var msg =
            "Please Enter Premimum Slab UpTo Greater than equal to Premimum Slab From";
          //alert(msg);
          document.getElementById("PayInPremimSlabUpTo_Ids_" + i).innerHTML =
            msg;
        } else {
          //document.getElementById("PayInNetPremimSlabUpTo_Ids_"+i).innerHTML='';
        }

        // console.log(PayInApplicableType.length);
        var flag = 0;
        if (PayInApplicableType.length == 0) {
          document.getElementById("PayInApplicableType_Ids_" + i).innerHTML =
            "Please enter Pay-In Applicable Type";

          document.getElementById("PayIn_OD_Ids_" + i).innerHTML = "";
          document.getElementById("PayIn_TP_Ids_" + i).innerHTML = "";
          document.getElementById("PayIn_Net_Ids_" + i).innerHTML = "";
        } else {
          document.getElementById("PayInApplicableType_Ids_" + i).innerHTML =
            "";

          document.getElementById("PayIn_OD_Ids_" + i).innerHTML = "";
          document.getElementById("PayIn_TP_Ids_" + i).innerHTML = "";
          document.getElementById("PayIn_Net_Ids_" + i).innerHTML = "";

          for (var j = 0; j < PayInApplicableType.length; j++) {
            if (PayInApplicableType[j]["Name"] == "OD") {
              if (PayIn_OD == "" || PayIn_OD == null) {
                document.getElementById("PayIn_OD_Ids_" + i).innerHTML =
                  "Please enter Pay-In OD";
                return;
              }
            }
            if (PayInApplicableType[j]["Name"] == "TP") {
              if (PayIn_TP == "" || PayIn_TP == null) {
                document.getElementById("PayIn_TP_Ids_" + i).innerHTML =
                  "Please enter Pay-In TP";
                return;
              }
            }
            if (PayInApplicableType[j]["Name"] == "Net") {
              if (PayIn_Net == "" || PayIn_Net == null) {
                document.getElementById("PayIn_Net_Ids_" + i).innerHTML =
                  "Please enter Pay-In Net";
                return;
              }
            }
          }
        }

        if (
          from == "" ||
          from == null ||
          upTo == "" ||
          upTo == null ||
          //(PayIn=='' || PayIn== null) ||
          //(PayOut=='' || PayOut== null) ||
          PayInSlabApplicableType == "" ||
          PayInSlabApplicableType == null
          //||
          //(PayInApplicableType=='' || PayInApplicableType== null)
        ) {
          return;
        }

        // console.log(from);
        // console.log(upTo);
      }
    }

    this.isSubmitted = true;
    if (this.PayInForm.invalid) {
      return;
    } else {
      var fields = this.PayInForm.value;
      const formData = new FormData();

      formData.append("PayIn_Id", this.Id);
      formData.append("ViewType", this.ViewType);
      formData.append("Action", this.Action);

      formData.append("User_Id", this.api.GetUserId());
      formData.append("Broker_Ids", JSON.stringify(fields["Broker_Ids"]));

      formData.append("AgentType", fields["AgentType"]);
      formData.append("Agent_Ids", JSON.stringify(fields["Agent_Ids"]));

      formData.append(
        "Ins_Compaines_Ids",
        JSON.stringify(fields["Ins_Compaines_Ids"])
      );
      formData.append("SlabType", fields["SlabType"]);

      formData.append("Zone_Ids", JSON.stringify(fields["Zone_Ids"]));
      formData.append("States_Ids", JSON.stringify(fields["States_Ids"]));
      formData.append("RTO_Ids", JSON.stringify(fields["RTO_Ids"]));
      formData.append("CPA", JSON.stringify(fields["CPA"]));

      formData.append("NCB_Status", JSON.stringify(fields["NCB_Status"]));
      formData.append(
        "LI_Payment_Type",
        JSON.stringify(fields["LI_Payment_Type"])
      );
      formData.append("VehicleAgeFrom", fields["VehicleAgeFrom"]);
      formData.append("VehicleAgeTo", fields["VehicleAgeTo"]);

      formData.append("LOB_Ids", fields["LOB"]);

      formData.append("Source_Type", JSON.stringify(fields["Source_Type"]));
      formData.append("Fuel_Type_Ids", JSON.stringify(fields["Fuel_Type"]));
      formData.append("File_Type_Ids", JSON.stringify(fields["File_Type"]));
      formData.append("Product_Ids", JSON.stringify(fields["Product_Ids"]));
      formData.append("Plan_Type", JSON.stringify(fields["Plan_Type"]));
      formData.append(
        "SubProduct_Ids",
        JSON.stringify(fields["SubProduct_Ids"])
      );
      formData.append("Segment_Ids", JSON.stringify(fields["Segment_Ids"]));

      formData.append("Risk_Category", JSON.stringify(fields["Risk_Category"]));
      formData.append(
        "Risk_Occupancy",
        JSON.stringify(fields["Risk_Occupancy"])
      );

      formData.append("Class_Ids", JSON.stringify(fields["Class_Ids"]));
      formData.append("Sub_Class_Ids", JSON.stringify(fields["Sub_Class_Ids"]));
      formData.append("Body_Type_Ids", JSON.stringify(fields["Body_Type_Ids"]));

      formData.append("HEV", JSON.stringify(fields["HEV"]));
      formData.append("Make_Id", JSON.stringify(fields["Make_Id"]));
      formData.append("Model_Id", JSON.stringify(fields["Model_Id"]));

      formData.append("PayInOD", fields["PayInOD"]);
      formData.append("PayOutOD", fields["PayOutOD"]);
      formData.append("PayInTP", fields["PayInTP"]);
      formData.append("PayOutTP", fields["PayOutTP"]);

      formData.append("PayInNet", fields["PayInNet"]);
      formData.append("PayOutNet", fields["PayOutNet"]);

      formData.append("PayInReward", fields["PayInReward"]);
      formData.append("PayOutReward", fields["PayOutReward"]);
      formData.append("PayInScheme", fields["PayInScheme"]);
      formData.append("PayOutScheme", fields["PayOutScheme"]);

      formData.append("PayInGroup", JSON.stringify(fields["PayInGroup"]));

      formData.append("PayIn_Remark", fields["PayIn_Remark"]);
      formData.append("Extra_Remark", fields["Extra_Remark"]);
      formData.append("Effective_Date", fields["Effective_Date"]);

      this.api.IsLoading();
      this.api.HttpPostType("../v2/pay-in/PayIn/Add", formData).then(
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
