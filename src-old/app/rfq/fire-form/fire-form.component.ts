import { empty } from "rxjs";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { el } from "date-fns/locale";

@Component({
  selector: "app-fire-form",
  templateUrl: "./fire-form.component.html",
  styleUrls: ["./fire-form.component.css"],
})
export class FireFormComponent implements OnInit {
  [x: string]: any;
  FireForm: FormGroup;
  isSubmitted = false;

  dropdownSettingsType: any = "";
  dropdownSettingsMultiselect: any = "";
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSingleSettingsTypeNew: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    disable: boolean;
  };

  AddFieldForm: FormGroup;
  LeadForm: any;
  AddedField = 0;

  currentUrl: string;
  fireexpirings: any;
  Fire_Fighting_AV: string[] = [];

  FirePlanName = "Bharat Griha Raksha Policy";
  BuildUpYearData: { Id: string; Name: string }[];
  FloorNumberData: { Id: string; Name: string }[];
  FieldFetch: any = [];
  sampleform: FormGroup;
  dataArr: any;
  quotation_id: string;
  occupancyToData: any[];
  stocksValue: string;
  showInput: boolean = false;
  GenerateOccupancy: any;
  occupancyAllData: any[];
  Pincode: any;
  PincodeAllData: any[];
  // Fire_Fighting_Arrangements: any[];
  HomeContents: any;
  CoverValuableContents: any;
  factor: any;
  factor1: any;
  Divshow: any;
  Rfq_URL: any;
  quote_URL: any;
  selectFacingValue: any = [];

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.currentUrl = this.router.url;

    this.currentUrl = this.router.url;

    //   //   //   console.log('CurrentUrl:', this.currentUrl);
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.Rfq_URL = splitted[1];
      this.quote_URL = splitted[2];
      this.quotation_id = splitted[3];
      //   //   //   console.log('Extracted id:', this.quotation_id);
    }

    // console.log('id:', this.id);/

    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSingleSettingsTypeNew = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
      disable: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.dropdownSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.Divshow = "0";
    this.FireForm = this.formBuilder.group({
      calculat_suminsured: [""],
      building_structure: [""],
      plant_machinery: [""],
      furniture_fixtures: [""],
      BusinessCoverValuableContents: [""],
      other_contents: [""],
      Business_total: [""],
      FireProduct: ["", [Validators.required]],
      FirePolicy: ["", [Validators.required]],
      FireOwnershipType: ["", [Validators.required]],

      PolicyDuration: ["12 months"],
      PolicyRiskStartDate: [""],
      PolicyRiskEndDate: [""],

      FireExpiring: [""],
      FirePreviousPolicyNo: [""],
      FireExpiryDate: [""],
      PastLossExperiences: [""],

      HomeContents: [""],

      furnitureandFixtures: [""],
      ElectricElectronicItem: [""],
      OtherProperty: [""],

      CoverValuableContents: [""],
      MaxSumInsuredperitem: [""],
      STFI: ["1"],
      stock: [""],
      Earthquake: ["1"],
      Terrorism: [""],
      total: [""],
      terrorismsumtotal: [""],

      Type_of_Construction: ["", [Validators.required]], //
      Basement_Exposed: ["", [Validators.required]],
      Basement_Exposed_Details: [""],
      Fire_Fighting_Arrangements: [[]],
      Floor_Number: ["", [Validators.required]],
      Number_of_floors: [""],
      Build_Up_Year: ["", [Validators.required]],
      Address: ["", [Validators.required]],
      Occupancy_Type: [""],
      Pincode: ["", [Validators.required]],
      SumInsured_valuation: [""],
      Description_property: [""],
      Hypothecated: [""],
      Carpet_Area_sq: [""],
      Rate_per_Sq: [""],
    });
  }
  // this.AddFormField();

  ngOnInit() {
    // alert();
    this.FilterData();
    this.CheckCreaterRights();
    this.SuminsuredTotal();
    this.FilterDatacompany();
    if (this.Suminsured != "" || this.Suminsured != "0") {
      this.multiplyAndSetValues3();
    }

    if (
      this.Rfq_URL == "rfq" &&
      this.quote_URL == "Edit-Fire-Form" &&
      this.quotation_id != ""
    ) {
      this.GetEditForm();
    }
  }

  // updateValidation() {
  //   const fireFightingArrangements = this.Suminsured;
  //   if (!fireFightingArrangements.value || fireFightingArrangements.value.length === 0) {
  //     fireFightingArrangements.setErrors({ required: true });
  //   } else {
  //     fireFightingArrangements.setErrors(null);
  //   }
  // }

  BasementExposed(e: any) {
    const Basement_Exposed_Details = this.FireForm.get(
      "Basement_Exposed_Details"
    );
    if (e == "Yes") {
      Basement_Exposed_Details.setValidators([Validators.required]);
    } else if (e == "Only Parking") {
      Basement_Exposed_Details.setValidators(null);
    }
    if (e == "No") {
      Basement_Exposed_Details.setValidators(null);
    }
    Basement_Exposed_Details.updateValueAndValidity();
  }

  FireFormSet(e: any) {
    const FireExpiring = this.FireForm.get("FireExpiring");
    const FirePreviousPolicyNo = this.FireForm.get("FirePreviousPolicyNo");
    const FireExpiryDate = this.FireForm.get("FireExpiryDate");
    const PastLossExperiences = this.FireForm.get("PastLossExperiences");

    if (e == "New Business") {
      FireExpiring.setValidators(null);
      FirePreviousPolicyNo.setValidators(null);
      FireExpiryDate.setValidators(null);
      PastLossExperiences.setValidators(null);

      //disable previous policy status new
    } else if (e == "Rollover") {
      FireExpiring.setValidators([Validators.required]);
      FirePreviousPolicyNo.setValidators([Validators.required]);
      FireExpiryDate.setValidators([Validators.required]); //Validators.pattern("^[a-zA-Z_ ]*$")
      PastLossExperiences.setValidators([Validators.required]); //Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$")
    }
    if (e == "Renewal") {
      FireExpiring.setValidators([Validators.required]);
      FirePreviousPolicyNo.setValidators([Validators.required]);
      FireExpiryDate.setValidators([Validators.required]);
      PastLossExperiences.setValidators([Validators.required]);
    }
    FireExpiring.updateValueAndValidity();
    FirePreviousPolicyNo.updateValueAndValidity();
    FireExpiryDate.updateValueAndValidity();
    PastLossExperiences.updateValueAndValidity();
  }

  ChangeProductType(E: any) {
    this.FirePlanName = E;
    if (this.FirePlanName == "Bharat Griha Raksha Policy") {
      const formControlNames = [
        "MaxSumInsuredperitem",

        "total",
        "terrorismsumtotal",
      ];
      formControlNames.forEach((controlName) => {
        const control = this.FireForm.get(controlName);
        if (control) {
          control.setValue(null);
        }
      });
    } else {
      const formControlNames = [
        "building_structure",
        "plant_machinery",
        "furniture_fixtures",
        "BusinessCoverValuableContents",
        "other_contents",
        "Business_total",
      ];
      formControlNames.forEach((controlName) => {
        const control = this.FireForm.get(controlName);
        if (control) {
          control.setValue(null);
        }
      });
    }
  }
  // Loop through each form control and set its value to null

  GetEditForm() {
    const formData = new FormData();
    if (this.quote_URL == "Edit-Fire-Form") {
      formData.append("Url_Type", this.quote_URL);
      formData.append("Quotation", this.quotation_id);
    }

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "Rfq/GetEditData?Url=" +
          this.CurrentUrl +
          "&User_Id=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Data = result["data"];
            this.Addres = this.Data.Address;
            this.FireProductV = this.Data.FireProduct;
            this.FirePolicyV = this.Data.FirePolicy;
            this.FireOwnershipTypeV = this.Data.FireOwnershipType;
            this.PolicyRiskStartDateV = this.Data.PolicyRiskStartDate;
            this.PolicyRiskEndDateV = this.Data.PolicyRiskEndDate;
            this.FirePreviousPolicyNoV = this.Data.FirePreviousPolicyNo;
            this.FireExpiryDateV = this.Data.FireExpiryDate;
            this.PastLossExperiencesV = this.Data.PastLossExperiences;
            this.HomeContentsV = this.Data.HomeContents;

            this.furnitureandFixturesV = this.Data.furnitureandFixtures;
            this.ElectricElectronicItemV = this.Data.ElectricElectronicItem;
            this.OtherPropertyV = this.Data.OtherProperty;

            this.CoverValeVs = this.Data.CoverValuableContents;
            this.MaxSumInsuredperitemV = this.Data.MaxSumInsuredperitem;
            this.Basement_Exposed_DetailsV = this.Data.Basement_Exposed_Details;
            this.Type_of_ConstructionV = this.Data.Type_of_Construction;
            this.Basement_ExposedV = this.Data.Basement_Exposed;
            this.Floor_NumberV = this.Data.Floor_Number;
            this.Build_Up_YearV = this.Data.Build_Up_Year;
            this.SumInsured_valuationV = this.Data.SumInsured_valuation;
            this.Description_propertyV = this.Data.Description_property;
            this.HypothecatedV = this.Data.Hypothecated;
            this.Carpet_Area_sqV = this.Data.Carpet_Area_sq;
            this.Rate_per_SqV = this.Data.Rate_per_Sq;
            this.Number_of_floorsV = this.Data.Number_of_floors;
            this.FireExpiringV = result["FireExpiring"];
            this.building_structure = this.Data.building_structure;
            this.plant_machinery = this.Data.plant_machinery;
            this.furniture_fixtures = this.Data.furniture_fixtures;
            this.BusinessCoverValuableContents =
              this.Data.CoverValuableContents;
            this.other_contents = this.Data.other_contents;
            this.stock = this.Data.stock;
            this.Business_total = this.Data.Business_total;
            this.Suminsured = this.Data.total;
            this.Terrorism = this.Data.Terrorism;
            this.terrorismsm = this.Data.terrorismsumtotal;
            this.Fire_Fighting_AV1 = result["Fire_F1"]["0"];
            this.Fire_Fighting_AV2 = result["Fire_F1"]["1"];
            this.Fire_Fighting_AV3 = result["Fire_F1"]["2"];
            this.Fire_Fighting_AV4 = result["Fire_F1"]["3"];
            //  //   //   console.log(this.Fire_Fighting_AV1);
            //  //   //   console.log(this.Fire_Fighting_AV2);
            //  //   //   console.log(this.Fire_Fighting_AV3);
            //  //   //   console.log(this.Fire_Fighting_AV4);
          } else {
            this.api.Toast("Success", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  Getpincode(e, Type) {
    const formData = new FormData();
    if (Type == 1) {
      formData.append("search", e.target.value);
      // alert( e.target.value);
    }

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "Rfq/RfqFormFilterData?Url=" +
          this.CurrentUrl +
          "&User_Id=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.occupancyAllData = result["occupancyAllData"];
            this.PincodeAllData = result["PincodeAllData"];
            //   //   //   console.log(this.occupancyAllData);
            //   //   //   console.log(this.PincodeAllData);

            this.FieldFetch = result["FieldFatch"];
            // this.setSelectedOccupancy();
            // this.formValidation();
          } else {
            this.api.Toast("Success", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  FilterDatacompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/GetIns_Companies?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Company = result["Ins_Compaines"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  FilterData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Rfq/RfqFormFilterData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation_Id=" +
          this.quotation_id
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.occupancyToData = result["occupancyToData"];
            this.occupancyAllData = result["occupancyAllData"];
            this.PincodeAllData = result["PincodeAllData"];
            this.GenerateOccupancy = result["GenerateOccupancy"];
            this.GenerateOName = result["GenerateOccupancy"][0]["Name"];
            //   //   //   console.log(this.GenerateOName);
            // console.log(this.GenerateOName !== 'Dwellings' && this.GenerateOName !== 'Dwellings: Cooperative Society')
            this.Pincode = result["Pincode"];
            this.Suminsured = result["Suminsured"];

            this.FieldFetch = result["FieldFatch"];
            //   //   //   console.log(this.Suminsured);
            this.SuminsuredTotal();
            // this.updateValidation();
          } else {
            this.api.Toast("Success", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  get formControls() {
    return this.FireForm.controls;
  }

  multiplyAndSetValues3() {
    const FireProduct = parseFloat(this.FireForm.get("FireProduct").value) || 0;
    const building_structure =
      parseFloat(this.FireForm.get("building_structure").value) || 0;
    const plant_machinery =
      parseFloat(this.FireForm.get("plant_machinery").value) || 0;
    const furniture_fixtures =
      parseFloat(this.FireForm.get("furniture_fixtures").value) || 0;
    const BusinessCoverValuableContents =
      parseFloat(this.FireForm.get("BusinessCoverValuableContents").value) || 0;
    const other_contents =
      parseFloat(this.FireForm.get("other_contents").value) || 0;
    const stock = parseFloat(this.FireForm.get("stock").value) || 0;

    // if (Business_total > 50000000 && FireProduct == 2) {
    //   this.building_structureErrors = 'Value must be upto 5cr for Business';
    //   // console.log(building_structure);
    //   return;
    // } else if ((Business_total > 50000000 || Business_total < 500000000) && FireProduct == 3) {

    //   this.building_structureErrors = 'Value must be between 5cr to 50cr for Business';
    //   // console.log(building_structure);
    //   return;
    // } else if (Business_total < 500000000 && FireProduct == 4) {
    //   // alert(1);
    //   this.building_structureErrors = 'Value must be above 50cr for Business';
    //   // console.log(building_structure);
    //   return;
    // } else {
    //   this.building_structureErrors = '';
    // }

    // Check if any of the values are NaN (not a number)
    if (
      isNaN(building_structure) ||
      isNaN(plant_machinery) ||
      isNaN(furniture_fixtures) ||
      isNaN(other_contents) ||
      isNaN(stock) ||
      isNaN(BusinessCoverValuableContents)
    ) {
      console.error("One of the input values is not a number.");
      return; // Exit the function if any value is not a number
    }

    const totalbuilding_structure =
      building_structure +
      plant_machinery +
      furniture_fixtures +
      BusinessCoverValuableContents +
      other_contents +
      stock;
    this.FireForm.get("total").setValue(totalbuilding_structure);
    // this.Suminsured = totalbuilding_structure;

    const Business_total = parseFloat(this.FireForm.get("total").value) || 0;

    if (Business_total > 50000000 && FireProduct == 2) {
      this.building_structureErrors = "Value must be upto 5cr for Business";
      // console.log(building_structure);
      return;
    } else if (
      (Business_total < 50000000 || Business_total > 500000000) &&
      FireProduct == 3
    ) {
      this.building_structureErrors =
        "Value must be between 5cr to 50cr for Business";
      // console.log(building_structure);
      return;
    } else if (Business_total < 500000000 && FireProduct == 4) {
      // alert(1);
      this.building_structureErrors = "Value must be above 50cr for Business";
      // console.log(building_structure);
      return;
    } else {
      this.building_structureErrors = "";
    }
    this.Suminsured = Business_total;
  }

  RfqFormSubmit() {
    //   //   //   console.log(this.FireForm.value);
    this.isSubmitted = true;
    if (this.building_structureErrors != "") {
      return;
    }

    if (this.FireForm.invalid) {
      return;
    }

    const formData = new FormData();
    var fields = this.FireForm.value;
    //   //   //   console.log(fields);
    //   //   //   console.log(this.FireForm.value);
    formData.append("Url_Type", this.quote_URL);
    formData.append("FireExpiring", JSON.stringify(fields["FireExpiring"]));
    formData.append("Quotation_Id", this.quotation_id);
    formData.append("FirePolicy", fields["FirePolicy"]);
    formData.append("FireOwnershipType", fields["FireOwnershipType"]);
    formData.append("FireProduct", fields["FireProduct"]);
    formData.append("PolicyDuration", fields["PolicyDuration"]);
    formData.append("PolicyRiskStartDate", fields["PolicyRiskStartDate"]);
    formData.append("PolicyRiskEndDate", fields["PolicyRiskEndDate"]);

    formData.append("FirePreviousPolicyNo", fields["FirePreviousPolicyNo"]);
    formData.append("FireExpiryDate", fields["FireExpiryDate"]);
    formData.append("PastLossExperiences", fields["PastLossExperiences"]);
    formData.append("HomeContents", fields["HomeContents"]);

    formData.append("furnitureandFixtures", fields["furnitureandFixtures"]);
    formData.append("ElectricElectronicItem", fields["ElectricElectronicItem"]);
    formData.append("OtherProperty", fields["OtherProperty"]);

    formData.append("CoverValuableContents", fields["CoverValuableContents"]);
    formData.append("MaxSumInsuredperitem", fields["MaxSumInsuredperitem"]);

    formData.append("plant_machinery", fields["plant_machinery"]);
    formData.append("building_structure", fields["building_structure"]);
    formData.append("furniture_fixtures", fields["furniture_fixtures"]);
    formData.append("STFI", fields["STFI"]);
    formData.append("stock", fields["stock"]);
    formData.append("other_contents", fields["other_contents"]);
    formData.append("Earthquake", fields["Earthquake"]);
    formData.append("Terrorism", fields["Terrorism"]);
    formData.append("total", this.Suminsured);
    formData.append("terrorismsumtotal", fields["terrorismsumtotal"]);

    formData.append(
      "Basement_Exposed_Details",
      fields["Basement_Exposed_Details"]
    );
    formData.append("Type_of_Construction", fields["Type_of_Construction"]);
    formData.append("Basement_Exposed", fields["Basement_Exposed"]);
    formData.append(
      "Fire_Fighting_Arrangements",
      JSON.stringify(this.selectFacingValue)
    );
    // formData.append('Fire_Fighting_Arrangements', fields['Fire_Fighting_Arrangements']);
    formData.append("Floor_Number", fields["Floor_Number"]);
    formData.append("Number_of_floors", fields["Number_of_floors"]);
    formData.append("Build_Up_Year", fields["Build_Up_Year"]);
    formData.append("Address", fields["Address"]);
    formData.append("Occupancy_Type", fields["Occupancy_Type"][0]["Name"]);
    formData.append("Pincode", fields["Pincode"][0]["Name"]);
    formData.append("SumInsured_valuation", fields["SumInsured_valuation"]);
    formData.append("Description_property", fields["Description_property"]);
    formData.append("Hypothecated", fields["Hypothecated"]);
    formData.append("Carpet_Area_sq", fields["Carpet_Area_sq"]);
    formData.append("Rate_per_Sq", fields["Rate_per_Sq"]);

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserData("Type"));
    formData.append("customeremail", this.api.GetUserData("Email"));
    formData.append("customermobileno", this.api.GetUserData("Mobile"));
    formData.append("customername", this.api.GetUserData("Name"));
    formData.append("Divshow", this.Divshow);

    this.api
      .HttpPostType("Rfq/Fire_Form_Submited", formData)
      .then((result: any) => {
        if (result["status"] == 1) {
          this.dataArr = result["data"];
          //   //   //   console.log("status : " + this.dataArr);
          this.api.Toast("Success", result["msg"]);
          this.FireForm.reset();

          if (this.quote_URL == "Edit-Fire-Form") {
            this.router.navigate([
              `/rfq/view-offline-quote/${this.quotation_id}`,
            ]);
          } else {
            setTimeout(() => {
              this.router.navigate(["/rfq/offline-manage-requests"]);
            }, 1000);
          }

          this.isSubmitted = false;
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  CheckCreaterRights() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Url", this.currentUrl);

    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("Rfq/CheckRights", formData).then(
      (result: any) => {
        this.api.HideLoading();

        //   //   //   console.log(result);

        if (result["status"] == 1) {
          // this.api.Toast("Success", result["msg"]);

          this.empType = result["Data"];

          this.Divshow = "1";
        } else {
          const msg = "msg";
          // this.api.Toast("Warning", result["msg"]);
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

  toggleInputVisibility(event: any) {
    this.showInput = event.target.checked;
  }

  SuminsuredTotal() {
    const TotalMax2 = this.Suminsured;
    if (TotalMax2 == "" || TotalMax2 == null) {
      return;
    }

    const two2 = 20;
    const MaxSum2 = (TotalMax2 * two2) / 100;
    const MaxSum3 = (MaxSum2 * two2) / 100;
    const TotaleFinle3 = MaxSum2 - MaxSum3;
    const TotaleFinle2 = TotalMax2 - MaxSum2;
    this.FireForm.get("HomeContents").setValue(TotaleFinle2);
    this.FireForm.get("CoverValuableContents").setValue(TotaleFinle3);
    // this.FireForm.get("MaxSumInsuredperitem").setValue(MaxSum3);
    this.MaxSum3V = MaxSum3;
    this.TotalMax23V2 = TotalMax2;
  }

  stockValueAddInTotal() {
    const stockvalue = parseFloat(this.FireForm.get("stock").value) || 0;
    const totalvlue = parseFloat(this.Suminsured);
    if (isNaN(stockvalue)) {
      console.error("One of the input values is not a number.");
      return;
    }
    const totalSetvalue = totalvlue + stockvalue;
    this.FireForm.get("total").setValue(totalSetvalue);
  }

  onInput13Change() {
    const factor1 = parseFloat(this.FireForm.get("Carpet_Area_sq").value) || 0;
    const factor = parseFloat(this.FireForm.get("Rate_per_Sq").value) || 0;

    const TotalMax = factor1 * factor;
    const two2 = 20;

    const MaxSum22 = (TotalMax * two2) / 100;
    const MaxSum33 = (MaxSum22 * two2) / 100;
    const TotaleFinle33 = MaxSum22 - MaxSum33;
    const TotaleFinle22 = TotalMax - MaxSum22;

    this.TotalMax23V2 = TotalMax;
    this.Suminsured = TotalMax;

    if (isNaN(factor1) || isNaN(factor)) {
      console.error("One of the input values is not a number.");
      return;
    }

    this.FireForm.get("HomeContents").setValue(TotaleFinle22);
    this.FireForm.get("CoverValuableContents").setValue(TotaleFinle33);
    this.FireForm.get("MaxSumInsuredperitem").setValue(MaxSum33);
  }

  PolicyRiskStart(dateValue: any) {
    const startDate = new Date(dateValue);
    // Add 12 months to the date
    startDate.setMonth(startDate.getMonth() + 12);
    // Retrieve the year, month, and day from the modified date
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month index
    const day = startDate.getDate() - 1;
    // Format the modified date as yyyy-mm-dd
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    // Log the modified date

    this.FireForm.get("PolicyRiskEndDate").setValue(formattedDate);
  }

  // toggleCheckbox(checked: boolean, value: string) {

  //     // const currentValues = this.FireForm.get('Fire_Fighting_Arrangements').value;

  //     if (checked) {
  //     //   //   //   console.log(currentValues.push(value));

  //     } else {
  //       const index = currentValues.indexOf(value);
  //       if (index > -1) {
  //         currentValues.splice(index, 1);
  //       }
  //     }
  //     this.FireForm.get('Fire_Fighting_Arrangements').setValue(currentValues);
  //   }

  Checkboxfacingvalue(event: any) {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the feature value to the selectedFeatures array
      this.selectFacingValue.push(value);
    } else {
      // Remove the feature value from the selectFacingValue array
      const index = this.selectFacingValue.indexOf(value);
      if (index > -1) {
        this.selectFacingValue.splice(index, 1);
      }
    }
  }
}
