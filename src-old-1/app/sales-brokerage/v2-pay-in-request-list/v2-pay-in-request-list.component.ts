import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "src/app/providers/bmsapi.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { V2PayInRequestUpdateComponent } from "../v2-pay-in-request-update/v2-pay-in-request-update.component";

class ColumnsObj {
  Id: string;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
  SlabType: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-v2-pay-in-request-list",
  templateUrl: "./v2-pay-in-request-list.component.html",
  styleUrls: ["./v2-pay-in-request-list.component.css"],
})
export class V2PayInRequestListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  PayInForm: FormGroup;
  isSubmitted = false;

  SQL_Where_STR: any;
  Is_Export: any = 0;

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

  BusinessMonths_Ar: any = [];
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

  isCheckedAllAgents: any = true;
  Is_Body_Type: any = false;

  PageType: any;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.dropdownSettingsFileType = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
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

    //this.PageType = this.activatedRoute.snapshot.paramMap.get('PageType');

    if (this.router.url == "/sales-brokerage/my-po-request") {
      this.PageType = "My PO Request";
    } else if (this.router.url == "/sales-brokerage/team-po-request") {
      this.PageType = "Team PO Request";
    } else {
      alert("Unkown URI Segment");
    }
  }

  ngOnInit() {
    this.PayInForm = this.fb.group({
      PO_Group: [""],
      LOB: [""],
      File_Type: [""],

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

      States_Ids: [""],
      RTO_Ids: [""],

      AgentType: [""],
      Agent_Ids: [""],

      Source_Type: [""],

      Make_Id: [""],
      Model_Id: [""],
      DateOrDateRange: [""],
      Payout_Mode: [""],
      RequestType: [""],
    });

    this.Get();
    this.ComponentsData();
  }

  get FC() {
    return this.PayInForm.controls;
  }

  ComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "../v2/pay-in/Fillter/AddPayInFormComponentsAr?User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.User_Rights = result["Data"]["SR_User_Rights"];
            this.LOB_Ar = result["Data"]["LOB"];

            this.Brokers_Ar = result["Data"]["Brokers"];
            this.Fleets_Ar = result["Data"]["Fleets"];

            this.CPA_Ar = result["Data"]["CPA"];
            this.Source_Ar = result["Data"]["Source"];
            this.Fuel_Type_Ar = result["Data"]["Fuel"];
            this.Body_Type_Ar = result["Data"]["Body"];

            //this.RM_Ar = result['Data']['RM_Ar'];
            //this.Agents_Ar = result['Data']['Agents_Ar'];

            //this.Agents_Placeholder = 'Select Agents ('+this.Agents_Ar.length+')';

            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
            this.Zones_Ar = result["Data"]["Zones"];
            this.States_Ar = result["Data"]["States"];

            this.SearchBtn();
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
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

  onChangeAgentType(e) {
    var AgentType = e.target.value;
    //   //   console.log(AgentType);

    this.Agents_Ar = [];

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

  SearchBtn() {
    this.isSubmitted = true;
    if (this.PayInForm.invalid) {
      return;
    } else {
      ////   //   console.log(this.PayInForm.value);
      var ToDate, FromDate;

      var fields = this.PayInForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        LOB: fields["LOB"],
        File_Type: fields["File_Type"],

        Broker_Ids: fields["Broker_Ids"],
        Ins_Compaines_Ids: fields["Ins_Compaines_Ids"],

        Product_Ids: fields["Product_Ids"],
        Segment_Ids: fields["Segment_Ids"],
        Plan_Type: fields["Plan_Type"],
        SubProduct_Ids: fields["SubProduct_Ids"],
        Class_Ids: fields["Class_Ids"],
        Sub_Class_Ids: fields["Sub_Class_Ids"],

        Fuel_Type: fields["Fuel_Type"],
        Body_Type_Ids: fields["Body_Type_Ids"],
        CPA: fields["CPA"],
        NCB_Status: fields["NCB_Status"],

        States_Ids: fields["States_Ids"],
        RTO_Ids: fields["RTO_Ids"],

        AgentType: fields["AgentType"],
        Agent_Ids: fields["Agent_Ids"],

        Source_Type: fields["Source_Type"],

        Make_Id: fields["Make_Id"],
        Model_Id: fields["Model_Id"],
        RequestType: fields["RequestType"],
        Payout_Mode: fields["Payout_Mode"],

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
      };

      //   //   console.log(query);
      this.Is_Export = 0;
      this.dataAr = [];

      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      });
    }
  }

  ExportExcel(): void {
    ////   //   console.log(this.SQL_Where_STR);

    const dialogConfig = new MatDialogConfig();
    //   //   console.log(dialogConfig);

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    //dialogConfig.position = 'absolute';
    dialogConfig.hasBackdrop = false;
    //dialogConfig.closeOnNavigation = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "PayIn",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;
    /*
		const dialogRef = this.dialog.open(DownloadingViewComponent,dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			//   //   console.log(result);
		});
		*/
  }

  ClearSearch() {
    var fields = this.PayInForm.reset();

    this.Products_Ar = [];
    this.SubProducts_Ar = [];

    this.Segment_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];

    this.Is_Export = 0;
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBms +
                "/../../v3/pay-in/WebPayIn/RequestsGridData?PageType=" +
                this.PageType +
                "&User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBms)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            that.SQL_Where_STR = resp.SQL_Where;
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "Id" },
        { data: "SR_No" },
        { data: "LOB_Name" },
        { data: "File_Type" },
        { data: "Customer_Name" },
        { data: "RM_Name" },
        { data: "Estimated_Gross_Premium" },
        { data: "Add_Stamp" },
      ],
    };
  }

  //===== ADD PAYIN =====//
  AddPayIn(Id, Type) {
    const dialogRef = this.dialog.open(V2PayInRequestUpdateComponent, {
      width: "98%",
      height: "95%",
      //disableClose : true,
      data: { Id: Id, Type: Type, Bussiness_Month: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  //===== VIEW RM AUTHORITY =====//
  ViewRMAuthority(Id) {
    //alert(Id);
    /*
		const dialogRef = this.dialog.open(PayInAdminViewComponent, {
			width: '98%',
			height:'95%',
			//disableClose : true,
			data: {Id : Id}
		});

		dialogRef.afterClosed().subscribe(result => {
			//   //   console.log(result);
		});
		*/
  }
}
