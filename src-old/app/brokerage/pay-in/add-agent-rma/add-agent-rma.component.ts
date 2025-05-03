import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { BmsapiService } from "../../../providers/bmsapi.service";

@Component({
  selector: "app-add-agent-rma",
  templateUrl: "./add-agent-rma.component.html",
  styleUrls: ["./add-agent-rma.component.css"],
})
export class AddAgentRmaComponent implements OnInit {
  PayInForm: FormGroup;
  isSubmitted = false;

  LOB_Ar: any = [];
  Products_Ar: any = [];
  SubProducts_Ar: any = [];
  Segment_Ar: any = [];
  Plan_Type_Ar: any = [];
  Sub_Classes_Ar: any = [];
  company: any = [];

  Emp_Ar: any = [];
  Agents_Ar: any = [];

  dropdownSettings: any = {};
  emp_dropdownSettings: any = {};

  Total_RMA: any = 0;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.PayInForm = this.fb.group({
      RMA_Type: ["Globally", [Validators.required]],
      Employee_Ids: [""],
      Agent_Ids: [""],
      LOB_Id: ["", [Validators.required]],
      Product_Ids: ["", [Validators.required]],
      Segment_Ids: ["", [Validators.required]],
      Plan_Type: ["", [Validators.required]],
      Sub_Product_Ids: [""],
      RMAGroup: this.fb.array([]),
      Effective_Date: ["", [Validators.required]],
      Remark: ["", [Validators.required]],
      company: [""],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.emp_dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.LOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Health", Name: "Health" },
    ];

    this.GetCompany();
  }

  get FC() {
    return this.PayInForm.controls;
  }

  RMAGroup(): FormArray {
    return this.PayInForm.get("RMAGroup") as FormArray;
  }

  AddMore_Test() {
    this.RMAGroup().push(this.NewPayInGroup_Test());
  }

  removePayInGroup_Test(i: number) {
    this.RMAGroup().removeAt(i);
  }

  NewPayInGroup_Test(): FormGroup {
    return this.fb.group({
      RMA: [""],
      From: [""],
      Upto: [""],
    });
  }

  GetRMA_Type(e: any) {
    var rma_type = e.target.value;
    //alert(rma_type);

    if (rma_type == "Individual") {
      this.PayInForm.get("Employee_Ids").setValidators([Validators.required]);
      this.PayInForm.get("Agent_Ids").setValidators([Validators.required]);
      this.PayInForm.get("company").setValidators([Validators.required]);

      this.api.IsLoading();
      this.api.Call("/sr/Sales/GetAll_RM?User_Id=" + this.api.GetUserId()).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Emp_Ar = result["Data"];
            //   //   //   console.log(this.Emp_Ar);

            this.api
              .Call(
                "../v2/pay-in/RMA/Get_RMA_Last_Effiectve?User_Id=" +
                  this.api.GetUserId()
              )
              .then(
                (res: any) => {
                  if (res["Status"] == true) {
                    this.Total_RMA = res["Total_RMA"];
                    for (var i = 0; i < this.Total_RMA; i++) {
                      this.AddMore_Test();
                    }

                    //this.PayInForm.patchValue(res['patchValue']);

                    for (var k = 0; k < this.Total_RMA; k++) {
                      const MenusGroupFields = (<FormArray>(
                        this.PayInForm.get("RMAGroup")
                      )).at(k);
                      MenusGroupFields.patchValue({
                        RMA: res["Data"][k]["RMA"],
                        From: res["Data"][k]["Slab_From"],
                        Upto: res["Data"][k]["Slab_UpTo"],
                      });
                      //// console.log(MenusGroupFields);
                    }
                  }
                },
                (err) => {}
              );
          } else {
            this.Emp_Ar = [];
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          //this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
    } else {
      //Globally

      (<FormArray>this.PayInForm.get("RMAGroup")).clear();

      /*
      for(var i=0; i<this.Total_RMA; i++){  
          this.removePayInGroup_Test(i);
          // console.log('Remove ',i);
      }
      this.Total_RMA=0;
      */

      this.PayInForm.get("Employee_Ids").setValidators(null);
      this.PayInForm.get("Agent_Ids").setValidators(null);
    }

    this.PayInForm.get("Employee_Ids").updateValueAndValidity();
    this.PayInForm.get("Agent_Ids").updateValueAndValidity();
    this.PayInForm.get("company").setValidators(null);
  }

  onItemSelectAgent(item: any) {
    // console.log('onItemSelect', item);
    var rm_id = item.Id;

    this.api.IsLoading();
    this.api.Call("/sr/Sales/Get_Agents?RM_Id=" + rm_id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
        } else {
          this.Agents_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        //this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  GetProducts() {
    this.PayInForm.get("Product_Ids").setValue(null);
    this.Products_Ar = [];

    const formData = new FormData();

    formData.append("LOB", this.PayInForm.value["LOB_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("../v2/pay-in/RMA/GetProducts", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.PayInForm.get("Product_Ids").setValue(null);
          this.Products_Ar = result["Data"];
        } else {
          this.Products_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        //this.api.HideLoading();
        //// console.log(err.message);
        this.api.HideLoading();
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  GetCompany() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("../v2/pay-in/RMA/getcompany", formData).then(
      (result) => {
        this.company = result["data"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
        this.api.HideLoading();
      },
      (err) => {
        this.api.HideLoading();
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  onItemSelect(items: any, Type: any) {
    if (Type == "Product") {
      this.Product("Select");
    } else if (Type == "PolicyType") {
      this.PolicyType("Select");
    } else if (Type == "PlanType") {
      this.PlanType("Select");
    } else if (Type == "SubProduct") {
      //this.SubProduct('Select');
    }
  }
  onItemDeSelect(items: any, Type: any) {
    if (Type == "Product") {
      this.Product("DeSelect");
    } else if (Type == "PolicyType") {
      this.PolicyType("DeSelect");
    } else if (Type == "PlanType") {
      this.PlanType("DeSelect");
    } else if (Type == "SubProduct") {
      //this.SubProduct('DeSelect');
    }
  }
  onSelectAll(items: any, Type: any) {
    if (Type == "Product") {
      this.Product("SelectAll");
    } else if (Type == "PolicyType") {
      this.PolicyType("SelectAll");
    } else if (Type == "PlanType") {
      this.PlanType("SelectAll");
    } else if (Type == "SubProduct") {
      //this.SubProduct('SelectAll');
    }
  }
  onDeSelectAll(items: any, Type: any) {
    if (Type == "Product") {
      this.Product("DeSelectAll");
    } else if (Type == "PolicyType") {
      this.PolicyType("DeSelectAll");
    } else if (Type == "PlanType") {
      this.PlanType("DeSelectAll");
    } else if (Type == "SubProduct") {
      //this.SubProduct('DeSelectAll');
    }
  }

  Product(Type: any) {
    //// console.log(this.PayInForm.value['Product_Ids']);

    this.Plan_Type_Ar = [];
    this.Segment_Ar = [];
    this.SubProducts_Ar = [];

    this.PayInForm.get("Plan_Type").setValue(null);
    this.PayInForm.get("Sub_Product_Ids").setValue(null);
    this.PayInForm.get("Segment_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Id"]);
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );

    this.api.HttpPostType("../v2/pay-in/RMA/GetPolicyType", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"];
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

    this.Plan_Type_Ar = [];
    this.SubProducts_Ar = [];

    this.PayInForm.get("Plan_Type").setValue(null);
    this.PayInForm.get("Sub_Product_Ids").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Id"]);
    formData.append(
      "Product_Ids",
      JSON.stringify(this.PayInForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.PayInForm.value["Segment_Ids"])
    );

    this.api.HttpPostType("../v2/pay-in/RMA/GetPlanType", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Plan_Type_Ar = result["Data"];
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

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB", this.PayInForm.value["LOB_Id"]);
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

    this.api.HttpPostType("../v2/pay-in/RMA/GetSubProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.SubProducts_Ar = result["Data"];
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

  AddPayInRMA() {
    this.isSubmitted = true;
    if (this.PayInForm.invalid) {
      return;
    } else {
      var fields = this.PayInForm.value;
      // // console.log(fields);
      // console.log(this.PayInForm.value["company"]);

      // return;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("RMA_Type", fields["RMA_Type"]);

      formData.append("Employee_Ids", JSON.stringify(fields["Employee_Ids"]));
      formData.append("Agent_Ids", JSON.stringify(fields["Agent_Ids"]));
      formData.append("LOB_Id", JSON.stringify(fields["LOB_Id"]));

      formData.append("RMAGroup", JSON.stringify(fields["RMAGroup"]));
      formData.append("Product_Ids", JSON.stringify(fields["Product_Ids"]));
      formData.append(
        "Segment_Ids",
        JSON.stringify(this.PayInForm.value["Segment_Ids"])
      );
      formData.append(
        "Plan_Type",
        JSON.stringify(this.PayInForm.value["Plan_Type"])
      );
      formData.append(
        "Sub_Product_Ids",
        JSON.stringify(this.PayInForm.value["Sub_Product_Ids"])
      );

      if (fields["RMA_Type"] == "Individual") {
        var DateOrDateRange = fields["Effective_Date"];
        var ToDate, FromDate;
        if (DateOrDateRange) {
          ToDate = DateOrDateRange[0];
          FromDate = DateOrDateRange[1];
        }
        formData.append(
          "company",
          JSON.stringify(this.PayInForm.value["company"])
        );

        formData.append(
          "Effective_Date_From",
          this.api.StandrdToDDMMYYY(ToDate)
        );
        formData.append(
          "Effective_Date_To",
          this.api.StandrdToDDMMYYY(FromDate)
        );
      } else {
        formData.append("Effective_Date", fields["Effective_Date"]);
      }

      formData.append("Remark", fields["Remark"]);

      this.api.IsLoading();
      this.api.HttpPostType("../v2/pay-in/RMA/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.ToastMessage(result["Message"]);

            this.router.navigate(["/pay-in/agent-rma"]);
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
