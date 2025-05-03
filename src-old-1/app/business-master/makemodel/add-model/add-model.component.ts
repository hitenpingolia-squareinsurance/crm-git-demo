import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { MakemodelComponent } from "../makemodel.component";

@Component({
  selector: "app-add-model",
  templateUrl: "./add-model.component.html",
  styleUrls: ["./add-model.component.css"],
})
export class AddModelComponent implements OnInit {
  SRForm: FormGroup;
  isSubmitted = false;

  File_Type_Ar: any = [];

  LOB_Ar: any;
  Segment_Ar: any;
  Classes_Ar: any;
  Sub_Classes_Ar: any;
  Products_Ar: any;
  SubProducts_Ar: any;

  Make_Ar: any;
  Models_Ar: any;
  Variants_Ar: any;

  EditBody_Type: any = "0";
  EditMake: any = "0";
  EditMake_Btn: any = "Add";
  EditModel: any = "0";
  EditModel_Btn: any = "Add";

  viewPolicyType: any = 0;
  viewPlanType: any = 0;
  viewSubProduct: any = 0;
  viewClass: any = 0;
  Plan_Type_Ar: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<MakemodelComponent>
  ) {
    this.SRForm = this.formBuilder.group({
      LOB_Id: ["", [Validators.required]],
      File_Type: ["", [Validators.required]],
      Class_Id: [""],
      Sub_Class_Id: ["", [Validators.required]],
      Segment_Id: ["", [Validators.required]],
      Plan_Type: [""],
      Product_Id: ["", [Validators.required]],
      SubProduct_Id: ["", [Validators.required]],
      Make_Id: ["", [Validators.required]],
      Model_Id: ["", [Validators.required]],
      Variant_Id: ["", [Validators.required]],
      Body_Type: ["", [Validators.required]],
      Fuel_Type: ["", [Validators.required]],
      Seating_Capcity: ["", [Validators.required]],
      GVW_CC: ["", [Validators.required]],
    });
  }

  ngOnInit() {}

  get FC() {
    return this.SRForm.controls;
  }

  columnShowHide() {
    var p = this.SRForm.value["Product_Id"];

    const Class_Id = this.SRForm.get("Class_Id");
    const Segment_Id = this.SRForm.get("Segment_Id");
    const Plan_Type = this.SRForm.get("Plan_Type");
    const SubProduct_Id = this.SRForm.get("SubProduct_Id");

    if (this.SRForm.value["LOB_Id"] == "Motor") {
      if (p == "TW" || p == "PC") {
        this.viewPolicyType = 1;
        this.viewPlanType = 1;
        this.viewSubProduct = 0;
        this.viewClass = 0;

        Class_Id.setValidators(null);
        Segment_Id.setValidators([Validators.required]);
        Plan_Type.setValidators([Validators.required]);
        SubProduct_Id.setValidators(null);
      } else if (p == "PCV") {
        this.viewPolicyType = 1;
        this.viewPlanType = 0;
        this.viewSubProduct = 1;
        this.viewClass = 0;

        Class_Id.setValidators(null);
        Segment_Id.setValidators([Validators.required]);
        SubProduct_Id.setValidators([Validators.required]);
        Plan_Type.setValidators(null);
      } else if (p == "GCV") {
        this.viewPolicyType = 1;
        this.viewPlanType = 0;
        this.viewSubProduct = 1;
        this.viewClass = 1;

        Class_Id.setValidators(null);
        Segment_Id.setValidators([Validators.required]);
        SubProduct_Id.setValidators([Validators.required]);
        Plan_Type.setValidators(null);
      } else if (p == "Misc D") {
        this.viewPolicyType = 1;
        this.viewPlanType = 0;
        this.viewSubProduct = 1;
        this.viewClass = 0;
        Class_Id.setValidators(null);
        Segment_Id.setValidators([Validators.required]);
        SubProduct_Id.setValidators([Validators.required]);
        Plan_Type.setValidators(null);
      } else if (p == "MTRR" || p == "CVEWP" || p == "MEWP") {
        this.viewPolicyType = 1;
        this.viewPlanType = 1;
        this.viewSubProduct = 1;
        this.viewClass = 0;

        Plan_Type.setValidators([Validators.required]);
        Segment_Id.setValidators([Validators.required]);
        SubProduct_Id.setValidators([Validators.required]);
        Class_Id.setValidators(null);
      }
    } else {
      this.viewPolicyType = 0;
      this.viewPlanType = 0;
      this.viewSubProduct = 0;
      this.viewClass = 0;
      Plan_Type.setValidators([Validators.required]);
      Segment_Id.setValidators([Validators.required]);
      SubProduct_Id.setValidators([Validators.required]);
      Class_Id.setValidators(null);
    }
    Plan_Type.updateValueAndValidity();
    Segment_Id.updateValueAndValidity();
    SubProduct_Id.updateValueAndValidity();
    Class_Id.updateValueAndValidity();
  }

  AddNew(type, btn) {
    if (type == "Make") {
      if (btn == "Add") {
        this.EditMake = "1";
        this.EditMake_Btn = "Cancel";
      } else {
        this.EditMake = "0";
        this.EditMake_Btn = "Add";
      }
      this.SRForm.get("Make_Id").setValue(null);
    }

    if (type == "Model") {
      if (btn == "Add") {
        this.EditModel = "1";
        this.EditModel_Btn = "Cancel";
      } else {
        this.EditModel = "0";
        this.EditModel_Btn = "Add";
      }
      this.SRForm.get("Model_Id").setValue(null);
    }
  }

  File_Types() {
    const LOB_Id = this.SRForm.value["LOB_Id"];

    this.SRForm.get("File_Type").setValue(null);
    this.SRForm.get("Product_Id").setValue(null);
    this.SRForm.get("SubProduct_Id").setValue(null);
    this.SRForm.get("Segment_Id").setValue(null);
    this.SRForm.get("Class_Id").setValue(null);
    this.SRForm.get("Sub_Class_Id").setValue(null);
    this.SRForm.get("Make_Id").setValue(null);
    this.SRForm.get("Model_Id").setValue(null);
    this.SRForm.get("Variant_Id").setValue(null);
    this.SRForm.get("Seating_Capcity").setValue(null);
    this.SRForm.get("GVW_CC").setValue(null);

    if (LOB_Id == "Motor") {
      this.File_Type_Ar = ["New", "Used", "Rollover", "Renewal"];
      this.columnShowHide();
      //this.Broker_Id = 0;
    } else if (LOB_Id == "Health") {
      this.File_Type_Ar = ["Fresh", "Renewal", "Port"];
      //this.Broker_Id = 1;
    } else if (LOB_Id == "Non Motor") {
      this.File_Type_Ar = ["Fresh", "Renewal", "Rollover"];
      //this.Broker_Id = 1;
    } else {
      this.File_Type_Ar = [];
    }
  }

  Products() {
    var LOB_Id = this.SRForm.value["LOB_Id"];
    var File_Type = this.SRForm.value["File_Type"];
    var Renewal_Policy_Vehicle_No = "";

    this.SRForm.get("Product_Id").setValue(null);
    this.SRForm.get("SubProduct_Id").setValue(null);
    this.SRForm.get("Segment_Id").setValue(null);
    this.SRForm.get("Class_Id").setValue(null);
    this.SRForm.get("Sub_Class_Id").setValue(null);
    this.SRForm.get("Make_Id").setValue(null);
    this.SRForm.get("Model_Id").setValue(null);
    this.SRForm.get("Variant_Id").setValue(null);
    this.SRForm.get("Seating_Capcity").setValue(null);
    this.SRForm.get("GVW_CC").setValue(null);

    const formData = new FormData();

    formData.append("LOB", LOB_Id);
    formData.append("File_Type", File_Type);
    formData.append("Renewal_Policy_Vehicle_No", Renewal_Policy_Vehicle_No);

    this.api.IsLoading();

    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetProducts", formData)
      .then(
        (result) => {
          // this.api.HttpPostType('../v2/pay-in/Fillter/GetProducts',formData).then((result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Products_Ar = [];
            this.SubProducts_Ar = [];
            this.Segment_Ar = [];
            this.Classes_Ar = [];
            this.Sub_Classes_Ar = [];

            this.Make_Ar = [];
            this.Models_Ar = [];
            this.Variants_Ar = [];

            this.Products_Ar = result["Data"]["Product"];

            if (File_Type == "Renewal") {
              if (result["Data"]["Renewal_Forms"] > 0) {
                var row = result["Data"]["Renewal_Data"];
                this.Products_Ar = row["Form_Components"]["Products_Ar"];
              } else {
                alert("No Renewal Data Found !");
              }
            }

            this.columnShowHide();
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  Policy_Type() {
    // alert();
    this.columnShowHide();

    if (this.SRForm.value["Product_Id"] == "AGRICULTURE - Tractor") {
      // this.KisanSuvidhaBimaPolicy=1;//
      //Kisan Suvidha Bima Policy
    }
    //alert(this.KisanSuvidhaBimaPolicy);

    this.SRForm.get("SubProduct_Id").setValue(null);
    this.SRForm.get("Segment_Id").setValue(null);
    this.SRForm.get("Plan_Type").setValue(null);
    this.SRForm.get("Class_Id").setValue(null);
    this.SRForm.get("Sub_Class_Id").setValue(null);

    const formData = new FormData();
    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);
    formData.append("LOB", this.SRForm.value["LOB_Id"]);
    formData.append("File_Type", this.SRForm.value["File_Type"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    // console.log(formData);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetPolicy_Type", formData)
      .then(
        (result) => {
          // this.api.HttpPostType('../v2/sr/SR_Form/GetPolicy_Type',formData).then((result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.SubProducts_Ar = [];
            //this.Segment_Ar =[];
            this.Classes_Ar = [];
            this.Sub_Classes_Ar = [];

            this.Make_Ar = [];
            this.Models_Ar = [];
            this.Variants_Ar = [];

            this.Segment_Ar = result["Data"]["PolicyType"];
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  Plan_Type() {
    this.SRForm.get("SubProduct_Id").setValue(null);
    //this.SRForm.get('Segment_Id').setValue(null);
    this.SRForm.get("Class_Id").setValue(null);
    this.SRForm.get("Sub_Class_Id").setValue(null);
    this.SRForm.get("Make_Id").setValue(null);
    this.SRForm.get("Model_Id").setValue(null);
    this.SRForm.get("Variant_Id").setValue(null);
    this.SRForm.get("Seating_Capcity").setValue(null);
    this.SRForm.get("GVW_CC").setValue(null);

    const formData = new FormData();
    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);
    formData.append("LOB", this.SRForm.value["LOB_Id"]);
    formData.append("File_Type", this.SRForm.value["File_Type"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    //  formData.append('KisanSuvidhaBimaPolicy',this.KisanSuvidhaBimaPolicy);

    this.api.IsLoading();

    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetPlan_Type", formData)
      .then(
        (result) => {
          // this.api.HttpPostType('../v2/sr/SR_Form/GetPlan_Type',formData).then((result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.SubProducts_Ar = [];
            //this.Segment_Ar =[];
            //this.Classes_Ar =[];
            this.Sub_Classes_Ar = [];

            this.Make_Ar = [];
            this.Models_Ar = [];
            this.Variants_Ar = [];

            var p = this.SRForm.value["Product_Id"];
            if (p == "PCV" || p == "GCV") {
              this.SubProducts_Ar = result["Data"];
            } else if (p == "Misc D") {
              this.SubProducts_Ar = result["Data"];
            } else {
              this.Plan_Type_Ar = result["Data"];
            }
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  SubProduct() {
    const formData = new FormData();

    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);

    formData.append("LOB", this.SRForm.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Plan_Type", this.SRForm.value["Plan_Type"]);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetSubProduct", formData)
      .then(
        (result) => {
          // this.api.HttpPostType('../v2/sr/SR_Form/GetSubProduct',formData).then((result) => {
          this.api.HideLoading();

          this.SubProducts_Ar = [];
          //this.Segment_Ar =[];
          this.Classes_Ar = [];
          this.Sub_Classes_Ar = [];

          this.Make_Ar = [];
          this.Models_Ar = [];
          this.Variants_Ar = [];

          if (result["Status"] == true) {
            var p = this.SRForm.value["Product_Id"];
            if (p == "TW" || p == "PC") {
              this.Sub_Classes_Ar = result["Data"];
            } else if (p == "MTRR" || p == "CVEWP" || p == "MEWP") {
              this.SubProducts_Ar = result["Data"];
            } else {
              this.SubProducts_Ar = result["Data"];
            }
            // if(this.KisanSuvidhaBimaPolicy == 1){
            //  this.Make_Ar = result['Data'];
            // }

            this.SRForm.get("SubProduct_Id").setValue(null);
            //this.SRForm.get('Segment_Id').setValue(null);
            this.SRForm.get("Class_Id").setValue(null);
            this.SRForm.get("Sub_Class_Id").setValue(null);
            this.SRForm.get("Make_Id").setValue(null);
            this.SRForm.get("Model_Id").setValue(null);
            this.SRForm.get("Variant_Id").setValue(null);
            this.SRForm.get("Body_Type").setValue(null);
            this.SRForm.get("Fuel_Type").setValue(null);
            this.SRForm.get("Seating_Capcity").setValue(null);
            this.SRForm.get("GVW_CC").setValue(null);
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  Classes() {
    var p = this.SRForm.value["Product_Id"];
    if (p == "Misc D") {
      if (this.SRForm.value["SubProduct_Id"] == "Agriculture Tractor") {
        this.viewClass = 1;
      } else {
        this.viewClass = 0;
      }
    }

    const formData = new FormData();

    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);

    formData.append("LOB", this.SRForm.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Plan_Type", this.SRForm.value["Plan_Type"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/GetClasses", formData).then(
      (result) => {
        // this.api.HttpPostType('../v2/sr/SR_Form/GetClasses',formData).then((result) => {
        this.api.HideLoading();

        this.Classes_Ar = [];
        this.Sub_Classes_Ar = [];

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        //this.SRForm.get('Segment_Id').setValue(null);
        this.SRForm.get("Class_Id").setValue(null);
        this.SRForm.get("Sub_Class_Id").setValue(null);
        this.SRForm.get("Make_Id").setValue(null);
        this.SRForm.get("Model_Id").setValue(null);
        this.SRForm.get("Variant_Id").setValue(null);
        this.SRForm.get("Body_Type").setValue(null);
        this.SRForm.get("Fuel_Type").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue(null);
        this.SRForm.get("GVW_CC").setValue(null);
        this.SRForm.get("GVW_CC").setValue(null);

        if (result["Status"] == true) {
          if (p == "PCV") {
            this.Sub_Classes_Ar = result["Data"];
          } else if (p == "GCV") {
            this.Classes_Ar = result["Data"];
          } else if (p == "Misc D") {
            if (this.SRForm.value["SubProduct_Id"] == "Agriculture Tractor") {
              this.Classes_Ar = result["Data"];
            } else {
              this.Sub_Classes_Ar = result["Data"];
            }
          } else if (p == "MTRR" || p == "CVEWP" || p == "MEWP") {
            this.Sub_Classes_Ar = result["Data"];
          } else {
          }
        } else {
          this.api.Toast("Success", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Sub_Classes() {
    const formData = new FormData();

    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);

    formData.append("LOB", this.SRForm.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Plan_Type", this.SRForm.value["Plan_Type"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);
    formData.append("Class_Id", this.SRForm.value["Class_Id"]);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetSubClasses", formData)
      .then(
        (result) => {
          // this.api.HttpPostType('../v2/sr/SR_Form/GetSubClasses',formData).then((result) => {
          this.api.HideLoading();

          this.Make_Ar = [];
          this.Models_Ar = [];
          this.Variants_Ar = [];

          this.SRForm.get("Sub_Class_Id").setValue(null);
          this.SRForm.get("Make_Id").setValue(null);
          this.SRForm.get("Model_Id").setValue(null);
          this.SRForm.get("Variant_Id").setValue(null);
          this.SRForm.get("Body_Type").setValue(null);
          this.SRForm.get("Fuel_Type").setValue(null);
          this.SRForm.get("Seating_Capcity").setValue(null);

          if (result["Status"] == true) {
            this.Sub_Classes_Ar = result["Data"];
            //this.Make_Ar = result['Make'];
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
  }

  Make() {
    const formData = new FormData();

    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);
    formData.append("KisanSuvidhaBimaPolicy", "0");

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/Make", formData).then(
      (result) => {
        // this.api.HttpPostType('../v2/sr/SR_Form/Make',formData).then((result) => {
        this.api.HideLoading();

        //if(type==0){
        //this.SRForm.get('Make_Id').setValue(null);
        this.SRForm.get("Model_Id").setValue(null);
        this.SRForm.get("Variant_Id").setValue(null);
        this.SRForm.get("Body_Type").setValue(null);
        this.SRForm.get("Fuel_Type").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue(null);

        this.Models_Ar = [];
        this.Variants_Ar = [];
        //}
        if (result["Status"] == true) {
          //if(type==0){
          this.Make_Ar = result["Data"];
          //}
          //this.Get_TP_Premium();
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Model() {
    const formData = new FormData();

    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);
    formData.append("Make_Id", this.SRForm.value["Make_Id"]);
    formData.append("KisanSuvidhaBimaPolicy", "0");

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/Models", formData).then(
      (result) => {
        // this.api.HttpPostType('../v2/sr/SR_Form/Models',formData).then((result) => {
        this.api.HideLoading();

        this.SRForm.get("Model_Id").setValue("");
        this.SRForm.get("Variant_Id").setValue("");
        this.SRForm.get("Body_Type").setValue(null);
        this.SRForm.get("Fuel_Type").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue("");

        this.Models_Ar = [];
        this.Variants_Ar = [];

        if (result["Status"] == true) {
          this.Models_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Add() {
    // console.log(this.SRForm.value);
    this.isSubmitted = true;
    if (this.SRForm.invalid) {
      return;
    } else {
      var fields = this.SRForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("User_Code", this.api.GetUserData("Code"));

      formData.append("LOB_Id", fields["LOB_Id"]);
      formData.append("File_Type", fields["File_Type"]);
      formData.append("Product_Id", fields["Product_Id"]);
      formData.append("Segment_Id", fields["Segment_Id"]);
      formData.append("Plan_Type", fields["Plan_Type"]);
      formData.append("SubProduct_Id", fields["SubProduct_Id"]);
      formData.append("Class_Id", fields["Class_Id"]);
      formData.append("Sub_Class_Id", fields["Sub_Class_Id"]);
      formData.append("Make_Id", fields["Make_Id"]);
      formData.append("Model_Id", fields["Model_Id"]);
      formData.append("Variant_Id", fields["Variant_Id"]);
      formData.append("GVW_CC", fields["GVW_CC"]);
      formData.append("Seating_Capcity", fields["Seating_Capcity"]);
      formData.append("Fuel_Type", fields["Fuel_Type"]);
      formData.append("Body_Type", fields["Body_Type"]);

      this.api.IsLoading();
      this.api.HttpForSR("post", "../data/VehicleDataNew/Add", formData).then(
        (result) => {
          this.api.HideLoading();
          this.CloseModel();
          this.business_log(result["id"]);
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.router.navigate(["/data-management/vehicle"]);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
    }
  }

  business_log(id: any) {
    let data = JSON.stringify(this.SRForm.value);
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", "square.squareMaster");
    formData.append("log", "insert");
    formData.append("id", id);
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api
      .HttpPostTypeBms("business_master/Business_Log/logInsert", formData)
      .then(
        (resp) => {
          this.SRForm.reset();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  Reset() {
    this.SRForm.reset();
    this.columnShowHide();
    this.Products_Ar = [];
    this.File_Type_Ar = [];
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
