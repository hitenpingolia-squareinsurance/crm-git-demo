import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-add-payin",
  templateUrl: "./add-payin.component.html",
  styleUrls: ["./add-payin.component.css"],
})
export class AddPayinComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};
  File_TypedropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  ins_Company_dropdownSettings: any = {};
  PayInApplicableType_dropdownSettings: any = {};
  cities: any = [];
  selectedItems: any = [];

  value: any;
  selected: any;

  User_Rights: any = [];

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;

  Brokers_Ar: any = [];
  Fleets_Ar: any = [];
  RM_Ar: any = [];

  Ins_Companies_Ar: any = [];
  States_Ar: any = [];
  RTO_Ar: any = [];
  LOB_Ar: any = [];

  SRLOB_Ar: any = [];
  Body_Type_Ar: any = [];
  Fuel_Type_Ar: any = [];
  File_Type_Ar: any = [];
  Products_Ar: any = [];
  SubProducts_Ar: any = [];

  Segment_Ar: any = [];
  Classes_Ar: any = [];
  Sub_Classes_Ar: any = [];

  ItemSelection: any = [];
  ItemSelectionState: any = [];
  ItemSelectionProducts: any = [];
  ItemSelectionSubProducts: any = [];
  ItemSelectionSegment: any = [];
  ItemSelectionClass: any = [];

  ItemSelectionNMSegment: any = [];
  ItemSelectionNMClass: any = [];
  ItemSelectionNMProducts: any = [];

  PayInApplicableType_Ar: any = [];

  Agents_Placeholder: string = "Select Agents (0)";

  isCheckedAllAgents: any = true;

  isChecked_Motor: any = false;
  isChecked_Health: any = false;
  isChecked_NonMotor: any = false;

  PayOut_OD_Readonly: any = false;
  PayOut_TP_Readonly: any = false;
  PayOut_Net_Readonly: any = false;

  EnableTwoWheelerBodyType: any = 0;

  ItemLOBSelection: any = [];

  ActivePage: string = "";
  ActiveLOB: string = "Motor";
  Plan_Type_Ar: any = [];
  Is_Body_Type: boolean;
  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    selectAllText: string;
    unSelectAllText: string;
    allowSearchFilter: boolean;
  };

  constructor(
    public api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.router.events.subscribe((value) => {
      //// console.log(value);
      //// console.log('current route: ', router.url.toString());
      if (router.url.toString() == "/payin-payout/add-payin/agent-wise") {
        this.ActivePage = "Add New Pay-In Agent Wise";
      } else if (router.url.toString() == "/payin-payout/add-payin/all") {
        this.ActivePage = "Add New Pay-In";
      } else {
        this.ActivePage = "";
      }
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      allowSearchFilter: true,
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.File_TypedropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.LOB_dropdownSettings = {
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

    this.SRLOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Life", Name: "Life" },
      { Id: "Travel", Name: "Travel" },
      { Id: "Personal Accident", Name: "Personal Accident" },
    ];
  }

  ngOnInit() {
    this.ComponentsData();

    this.SearchAgents("", 0);

    this.PayInForm = this.fb.group({
      Agent_Id: [""],

      Ins_Compaines_Ids: ["", [Validators.required]],
      LOB_Ids: ["", [Validators.required]],

      Plan_Type: [""],
      File_Type: [""],
      Product_Ids: ["", [Validators.required]],
      SubProduct_Ids: [""],
      Segment_Ids: [""],
      Class_Ids: [""],
      Sub_Class_Ids: [""],

      Manufacturer_Year: [""],

      VehicleAgeFrom: [""],
      VehicleAgeTo: [""],

      PayInNet: [""],
      PayOutNet: [""],

      PayInOD: [""],
      PayOutOD: [""],
      PayInTP: [""],
      PayOutTP: [""],

      PayInReward_Type: [""],
      PayInReward: [""],
      PayOutReward: [""],
      PayInScheme: [""],
      PayOutScheme: [""],

      PayInTerrorism: [""],
      PayOutTerrorism: [""],

      PayInSumInsuredGroup: this.fb.array([]),
      Effective_Date: ["", [Validators.required]],
    });

    this.AddPayIn();

    this.quantities().push(this.newQuantity());
  }
  get FC() {
    return this.PayInForm.controls;
  }

  quantities(): FormArray {
    return this.PayInForm.get("PayInSumInsuredGroup") as FormArray;
  }
  newQuantity(): FormGroup {
    return this.fb.group({
      PremimSlabFrom: "",
      PremimSlabUpTo: "",

      PayInNet: [""],
      PayOutNet: [""],

      PayInReward_Type: [""],
      PayInReward: [""],
      PayOutReward: [""],
      PayInScheme: [""],
      PayOutScheme: [""],

      PayInTerrorism: [""],
      PayOutTerrorism: [""],
    });
  }
  addQuantity() {
    this.quantities().push(this.newQuantity());
  }
  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }
  checkPayInPremimSlab(event, i) {}

  ComponentsData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "reports/BussinessReport/SearchComponentsData?Page=AddPayIn&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Region_Ar = result['Data']['Region_Ar'];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  SearchAgents(e, Type) {
    var q = "Default";
    if (Type == 1) {
      q = e.target.value;
    }

    // console.log(q);
    //this.api.IsLoading();
    this.api.HttpGetType("reports/BussinessReport/SearchAgents?q=" + q).then(
      (result) => {
        //this.api.HideLoading();

        this.Agents_Ar = result["Data"];

        if (result["Status"] == true) {
          //this.api.Toast('Success',result['Message']);
          //// console.log(result['data']);
        } else {
          //alert(result['message']);
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        //// console.log(err);
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }

  GetNMSegments(Type) {
    this.Products_Ar = [];
    this.SubProducts_Ar = [];
    this.Segment_Ar = [];

    this.PayInForm.get("Segment_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Product_Ids").setValue(null);
    this.PayInForm.get("SubProduct_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    this.api
      .HttpPostType("reports/BussinessReport/GetNMSegments", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Segment_Ar = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  GetNMClass(Type) {
    this.Products_Ar = [];
    this.SubProducts_Ar = [];
    //this.Segment_Ar = [];

    //this.PayInForm.get('Segment_Ids').setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Product_Ids").setValue(null);
    this.PayInForm.get("SubProduct_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );

    this.api.HttpPostType("reports/BussinessReport/GetNMClass", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  GetNMProducts(Type) {
    this.Products_Ar = [];
    this.SubProducts_Ar = [];

    this.PayInForm.get("Product_Ids").setValue(null);
    this.PayInForm.get("SubProduct_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );
    formData.append(
      "Class_Ids",
      JSON.stringify(this.PayInForm.value["Class_Ids"])
    );

    this.api
      .HttpPostType("reports/BussinessReport/GetNMProducts", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Products_Ar = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  GetNMSubProducts(Type) {
    this.SubProducts_Ar = [];

    this.PayInForm.get("SubProduct_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.PayInForm.value["LOB_Ids"]));
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );
    formData.append(
      "Class_Ids",
      JSON.stringify(this.PayInForm.value["Class_Ids"])
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );

    this.api
      .HttpPostType("reports/BussinessReport/GetNMSubProducts", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.SubProducts_Ar = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  //NM

  PayInGroupPercentage(e, index, Type) {
    const PayInGroupFields = (<FormArray>(
      this.PayInForm.get("PayInSumInsuredGroup")
    )).at(index);

    var PayIn_Index_value = e.target.value;
    // console.log(PayIn_Index_value*20/100);

    let PayOut_value = PayIn_Index_value - (PayIn_Index_value * 20) / 100;

    if (Type == "PayIn_Net") {
      PayInGroupFields.patchValue({
        PayOutNet: PayOut_value,
      });
      //document.getElementById("PayIn_Net_Ids_"+index).innerHTML='';
    }
    if (Type == "PayIn_Terrorism") {
      PayInGroupFields.patchValue({
        PayOutTerrorism: PayOut_value,
      });
      //document.getElementById("PayIn_TP_Ids_"+index).innerHTML='';
    }
    if (Type == "PayIn_Reward") {
      PayInGroupFields.patchValue({
        PayOutReward: PayOut_value,
      });
      //document.getElementById("PayIn_TP_Ids_"+index).innerHTML='';
    }

    if (Type == "PayIn_Scheme") {
      PayInGroupFields.patchValue({
        PayOutScheme: PayOut_value,
      });
      //document.getElementById("PayIn_TP_Ids_"+index).innerHTML='';
    }
  }

  PayInNet(e) {
    var PayInNet = e.target.value;
    const PayOutNet_Control = this.PayInForm.get("PayOutNet");
    // console.log(PayInNet);
    // console.log((PayInNet * 20) / 100);
    PayOutNet_Control.setValue(PayInNet - (PayInNet * 20) / 100);
  }

  PayInTerrorism(e) {
    var PayInTerrorism = e.target.value;
    const PayOutTerrorism_Control = this.PayInForm.get("PayOutTerrorism");
    // console.log(PayInTerrorism);
    // console.log((PayInTerrorism * 20) / 100);
    PayOutTerrorism_Control.setValue(
      PayInTerrorism - (PayInTerrorism * 20) / 100
    );
  }

  PayInOD(e) {
    var PayInOD = e.target.value;
    const PayOutOD_Control = this.PayInForm.get("PayOutOD");
    // console.log(PayInOD);
    // console.log((PayInOD * 20) / 100);
    PayOutOD_Control.setValue(PayInOD - (PayInOD * 20) / 100);
  }

  PayInTP(e) {
    var PayInTP = e.target.value;
    const PayOutTP_Control = this.PayInForm.get("PayOutTP");
    // console.log(PayInTP);
    // console.log((PayInTP * 20) / 100);
    PayOutTP_Control.setValue(PayInTP - (PayInTP * 20) / 100);
  }
  PayInReward(e) {
    var PayInReward = e.target.value;
    const PayInRewardNet_Control = this.PayInForm.get("PayOutReward");
    // console.log(PayInReward);
    // console.log((PayInReward * 20) / 100);
    PayInRewardNet_Control.setValue(PayInReward - (PayInReward * 20) / 100);
  }

  PayInScheme(e) {
    var PayInScheme = e.target.value;
    const PayOutSchemeNet_Control = this.PayInForm.get("PayOutScheme");
    // console.log(PayInScheme);
    // console.log((PayInScheme * 20) / 100);
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

      formData.append("ActivePage", this.ActivePage);
      formData.append("Agent_Id", JSON.stringify(fields["Agent_Id"]));
      formData.append(
        "Ins_Compaines_Ids",
        JSON.stringify(fields["Ins_Compaines_Ids"])
      );

      formData.append("LOB_Ids", fields["LOB_Ids"]);
      formData.append("Plan_Type", JSON.stringify(fields["Plan_Type"]));
      formData.append("File_Type", JSON.stringify(fields["File_Type"]));

      formData.append("Product_Ids", JSON.stringify(fields["Product_Ids"]));
      formData.append(
        "SubProduct_Ids",
        JSON.stringify(fields["SubProduct_Ids"])
      );
      formData.append("Segment_Ids", JSON.stringify(fields["Segment_Ids"]));
      formData.append("Class_Ids", JSON.stringify(fields["Class_Ids"]));
      formData.append("Sub_Class_Ids", JSON.stringify(fields["Sub_Class_Ids"]));

      formData.append(
        "PayInSumInsuredGroup",
        JSON.stringify(fields["PayInSumInsuredGroup"])
      );

      formData.append("Manufacturer_Year", fields["Manufacturer_Year"]);

      formData.append("VehicleAgeFrom", fields["VehicleAgeFrom"]);
      formData.append("VehicleAgeTo", fields["VehicleAgeTo"]);

      formData.append("PayInNet", fields["PayInNet"]);
      formData.append("PayOutNet", fields["PayOutNet"]);

      formData.append("PayInOD", fields["PayInOD"]);
      formData.append("PayInOD", fields["PayInOD"]);
      formData.append("PayOutOD", fields["PayOutOD"]);
      formData.append("PayInTP", fields["PayInTP"]);
      formData.append("PayOutTP", fields["PayOutTP"]);

      formData.append("PayInReward_Type", fields["PayInReward_Type"]);

      formData.append("PayInReward", fields["PayInReward"]);
      formData.append("PayOutReward", fields["PayOutReward"]);
      formData.append("PayInScheme", fields["PayInScheme"]);
      formData.append("PayOutScheme", fields["PayOutScheme"]);

      formData.append("PayInTerrorism", fields["PayInTerrorism"]);
      formData.append("PayOutTerrorism", fields["PayOutTerrorism"]);

      formData.append("Effective_Date", fields["Effective_Date"]);

      this.api.IsLoading();
      this.api.HttpPostType("reports/PayIn/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            if (this.ActivePage == "Add New Pay-In Agent Wise") {
              this.router.navigate(["/agents-payin"]);
            } else {
              this.router.navigate(["/payin-payout"]);
            }
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

    const formData = new FormData();
    formData.append("PO_Group", this.PayInForm.value["PO_Group"]);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
    formData.append(
      "Ins_Compaines_Ids",
      JSON.stringify(this.PayInForm.value["Ins_Compaines_Ids"])
    );
    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetFileTypes", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.File_Type_Ar = result["Data"]["File_Type_Ar"];
            this.Brokers_Ar = result["Data"]["Brokers"];
            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
          } else {
            this.Products_Ar = [];
            this.Ins_Companies_Ar = [];
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  File_Type(Type: any) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
    formData.append(
      "File_Type",
      JSON.stringify(this.PayInForm.value["File_Type"])
    );
    formData.append(
      "Ins_Compaines_Ids",
      JSON.stringify(this.PayInForm.value["Ins_Compaines_Ids"])
    );
    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetProducts", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Products_Ar = result["Data"]["Product"];
            this.productSelection();
          } else {
            this.Products_Ar = [];
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  productSelection() {
    this.Is_Body_Type = false;
    var p = this.PayInForm.get("Product_Ids").value;

    for (var i = 0; i < p.length; i++) {
      if (p[i]["Id"] == "TW") {
        // console.log(p[i]["Id"]);
        this.Is_Body_Type = true;
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

      this.PayInForm.get("Product_Ids").setValue(null);
      this.PayInForm.get("Plan_Type").setValue(null);
      this.PayInForm.get("SubProduct_Ids").setValue(null);
      this.PayInForm.get("Segment_Ids").setValue(null);
      this.PayInForm.get("Class_Ids").setValue(null);
      this.PayInForm.get("Sub_Class_Ids").setValue(null);

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
    }
  }

  Product(Type: any) {
    //// console.log(this.PayInForm.value['Product_Ids']);

    this.Plan_Type_Ar = [];
    this.Segment_Ar = [];
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];

    this.PayInForm.get("Plan_Type").setValue(null);
    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Segment_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
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

    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetPolicyType", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Segment_Ar = result["Data"]["PolicyType"];
            this.productSelection();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  PolicyType(Type: any) {
    //// console.log(this.PayInForm.value['Product_Ids']);

    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];

    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
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

    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetPlanType", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Plan_Type_Ar = result["Data"]["PlanType"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  PlanType(Type: any) {
    //// console.log(this.PayInForm.value['Product_Ids']);

    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];

    this.PayInForm.get("SubProduct_Ids").setValue(null);
    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
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

    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetSubProducts", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.SubProducts_Ar = result["Data"]["SubProducts"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }

  SubProduct(Type: any) {
    //// console.log(this.PayInForm.value['Product_Ids']);

    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];

    this.PayInForm.get("Class_Ids").setValue(null);
    this.PayInForm.get("Sub_Class_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
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

    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetClasses", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Classes_Ar = result["Data"]["Classes"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }
  Classes(Type: any) {
    this.PayInForm.get("Sub_Class_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Ids"]);
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

    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetSubClasses", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Sub_Classes_Ar = result["Data"]["SubClasses"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
  }
}
