import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
@Component({
  selector: "app-add-leads",
  templateUrl: "./add-leads.component.html",
  styleUrls: ["./add-leads.component.css"],
})
export class AddLeadsComponent implements OnInit {
  homePageForm: FormGroup;
  isSubmitted = false;

  S_CallbackForm: FormGroup;
  S_CallbackisSubmitted = false;

  productPageForm: FormGroup;
  productPageFormSubmitted = false;

  ContactForm: FormGroup;
  contactSubmitted = false;

  landingPageForm: FormGroup;
  LPisSubmitted = false;

  becomePospForm: FormGroup;
  PospFormIsSubmitted = false;
  ButtonDisableTrue: false;

  StepI: string = "1";
  StepII: string = "0";
  StepIII: string = "0";
  StepIV: string = "0";
  StepV: string = "0";
  StepFinal: string = "0";
  StepVI: string = "0";

  LobData: { Id: string; Name: string }[];
  GenderData: { Id: string; Name: string }[];
  source: any = "home page";
  selctedLob: any;
  selctedconvancey: any;
  MedicalData: { Id: string; Name: string }[];
  OccupationData: { Id: string; Name: string }[];
  planTypeData: { Id: string; Name: string }[];
  CommodityData: { Id: string; Name: string }[];
  ConveyanceData: { Id: string; Name: string }[];
  CurrencyData: { Id: string; Name: string }[];
  PackingData: { Id: string; Name: string }[];
  OdcData: { Id: string; Name: string }[];
  voyageFromData: { Id: string; Name: string }[];
  ValuationData: { Id: string; Name: string }[];
  voyagetoData: { Id: string; Name: string }[];
  CoverageData: { Id: string; Name: string }[];
  productTypeData: { Id: string; Name: string }[];
  v_persent: { Id: string; Name: string }[];
  MotorProductType: { Id: string; Name: string }[];

  // Motor form
  productData: { Id: string; Name: string }[];
  insurerData: { Id: string; Name: string }[];
  makeData: { Id: string; Name: string }[];
  modelData: { Id: string; Name: string }[];
  variantData: { Id: string; Name: string }[];
  fuelData: { Id: string; Name: string }[];
  manufactureYearData: any = [];

  PAshow: boolean = false;
  Lifeshow: boolean = false;
  Marineshow: boolean = false;
  MotorShow: boolean = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PosterImage: File;
  Suminusred: any;
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  // === new variabls

  isActive: boolean = true;
  isActive1: boolean = false;
  isActive2: boolean = false;
  isActive3: boolean = false;
  isActive4: boolean = false;
  isActive5: boolean = false;
  LandingTypeData: { Id: string; Name: string }[];
  RegistrationData: { Id: string; Name: string }[];
  Vintage: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<AddLeadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.homePageForm = this.formBuilder.group({
      Name: [""],
      Email: [""],
      Lob: [""],
      Pincode: [""],
      Mobile: [""],
      Gender: [""],
      dateOfBirth: [""],
      AnnualIncome: [""],
      Occupation: [""],
      Medical_history: [""],

      planType: [""],
      estimeted_dateof_shipment: [""],
      Commodity: [""],
      Additional_details_of_Commodity: [""],
      Conveyance: [""],
      Bulk_Cargo_Dimensional: [""],
      Packing: [""],
      Currency: [""],
      voyageFrom: [""],
      voyageFromPort: [""],
      voyageto: [""],
      voyagetoPort: [""],
      currencyValue: [""],
      Valuation: [""],
      Invoice_Value_Currency: [""],
      CargoSumInsured: [""],
      choseValuationPercentage: [""],

      // Motor coloms

      RegistrationNumber: [""],
      product: [""],
      make: [""],
      model: [""],
      fuel: [""],
      variant: [""],
      insurerName: [""],
      rto: [""],
      manufactureYear: [""],
      engineNo: [""],
      chassisNo: [""],
      IsNewVehicle: [""],
      RegistrationDate: [""],
      VintageNumber: [""],
      RegistrationNo: [""],
      Registration_Code: [""],
      Registration_District_Code: [""],
      Registration_State_Code: [""],
      Registration_City_Code: [""],
    });
    // Product page form fileds

    this.productPageForm = this.formBuilder.group({
      Product_type: [""],
      Mobile: [""],
      Name: [""],
      RegisterNumber: [""],
    });
    this.ContactForm = this.formBuilder.group({
      MSG: ["", [Validators.required]],
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ],
      ],
      Name: ["", [Validators.required]],
      Email: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"),
        ],
      ],
    });
    this.becomePospForm = this.formBuilder.group({
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ],
      ],
    });

    this.S_CallbackForm = this.formBuilder.group({
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ],
      ],
    });
    this.landingPageForm = this.formBuilder.group({
      ClientName: ["", [Validators.required]],
      ConcernName: ["", [Validators.required]],
      ClientAddress: ["", [Validators.required]],
      ConcernNatureofWork: ["", [Validators.required]],
      // Mobile: ["",[Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([0-9]{10})$')]],
      ConcernMobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ],
      ],
      ConcernEmail: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"),
        ],
      ],

      // PolicyDetails: ["",[Validators.required]],
      Type: ["", [Validators.required]],
    });

    this.LobData = [
      { Id: "Health", Name: "Health" },
      { Id: "Motor", Name: "Motor" },
      { Id: "Travel", Name: "Travel" },
      { Id: "Pa", Name: "Personal Accident" },
      { Id: "Life", Name: "Life" },
      { Id: "Marine", Name: "Marine" },
    ];
    this.productTypeData = [
      { Id: "Health", Name: "Health" },
      { Id: "Car", Name: "Car" },
      { Id: "Bike", Name: "Bike" },
      { Id: "Property", Name: "Property" },
      { Id: "Travel", Name: "Travel" },
      { Id: "Pa", Name: "Personal Accident" },
      { Id: "Life", Name: "Life" },
      { Id: "Marine", Name: "Marine" },
    ];
    this.GenderData = [
      { Id: "Male", Name: "Male" },
      { Id: "Female", Name: "Female" },
    ];
    this.planTypeData = [
      { Id: "Individual", Name: "Individual" },
      { Id: "Corporate", Name: "Corporate" },
    ];
    this.OdcData = [
      { Id: "ODC", Name: "ODC" },
      { Id: "Bulk Cargo", Name: "Bulk Cargo" },
      { Id: "NO ODC or Bulk Cargo", Name: "NO ODC or Bulk Cargo" },
    ];
    this.v_persent = [
      { Id: "+0%", Name: "+0%" },
      { Id: "+10%", Name: "+10%" },
      { Id: "+15%", Name: "+15%" },
      { Id: "+20%", Name: "+20%" },
      { Id: "+25%", Name: "+25%" },
      { Id: "+30%", Name: "+30%" },
    ];

    this.MotorProductType = [
      { Id: "1", Name: "TW" },
      { Id: "2", Name: "PC" },
      { Id: "3", Name: "PCV" },
      { Id: "4", Name: "GCV" },
      { Id: "5", Name: "MISC-D" },
    ];
    this.LandingTypeData = [{ Id: "Insurance Audit", Name: "Insurance Audit" }];
    this.MedicalData = [
      { Id: "Yes", Name: "Yes" },
      { Id: "No", Name: "No" },
    ];
    this.RegistrationData = [
      { Id: "Normal", Name: "Normal" },
      { Id: "Vintage", Name: "Vintage" },
      { Id: "Bharat Series", Name: "Bharat Series" },
    ];
  }

  onItemDeSelect(Value: any, type: any) {}

  ngOnInit() {
    this.GetOccupationData();
    this.GetMarineAllData();
    this.changeForm(this.source);
  }

  changeForm(FormType) {
    this.source = FormType;

    if (FormType == "home page") {
      this.homePageForm.get("Lob").setValidators([Validators.required]);
      this.homePageForm.get("Lob").updateValueAndValidity();
      this.StepI = "1";
      this.StepII = "0";
      this.StepIII = "0";
      this.StepIV = "0";
      this.StepV = "0";
      this.StepVI = "0";
      this.isActive = !this.isActive;
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = false;
    }
    if (FormType == "product page") {
      this.productPageForm
        .get("Product_type")
        .setValidators([Validators.required]);
      this.productPageForm.get("Product_type").updateValueAndValidity();
      this.StepI = "0";
      this.StepII = "1";
      this.StepIII = "0";
      this.StepIV = "0";
      this.StepV = "0";
      this.StepVI = "0";
      this.isActive = false;
      this.isActive1 = !this.isActive1;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = false;
    }
    if (FormType == "landing page") {
      this.StepI = "0";
      this.StepII = "0";
      this.StepIII = "1";
      this.StepIV = "0";
      this.StepV = "0";
      this.StepVI = "0";
      this.isActive = false;
      this.isActive1 = false;
      this.isActive2 = !this.isActive2;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = false;
    }

    if (FormType == "contact us") {
      this.StepI = "0";
      this.StepII = "0";
      this.StepIII = "0";
      this.StepIV = "1";
      this.StepV = "0";
      this.StepVI = "0";
      this.isActive = false;
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = !this.isActive3;
      this.isActive4 = false;
      this.isActive5 = false;
    }
    if (FormType == "become posp") {
      this.StepI = "0";
      this.StepII = "0";
      this.StepIII = "0";
      this.StepIV = "0";
      this.StepV = "1";
      this.StepVI = "0";
      this.isActive = false;
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive5 = false;
      this.isActive4 = !this.isActive4;
    }
    if (FormType == "schedule a call back") {
      this.StepI = "0";
      this.StepII = "0";
      this.StepIII = "0";
      this.StepIV = "0";
      this.StepV = "0";
      this.StepVI = "1";
      this.isActive = false;
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = !this.isActive5;
    }
  }

  GetLobData(selectedValue: any): void {
    this.selctedLob = selectedValue["Id"];

    this.resetValidators("home page");

    if (this.selctedLob == "Health") {
      document.getElementById("dateOfBirth").style.display = "none";
      document.getElementById("showOccupation").style.display = "none";
      document.getElementById("showAnnualIncome").style.display = "none";
      document.getElementById("showMedicalHistoty").style.display = "block";

      this.homePageForm
        .get("Name")
        .setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z_ ]*$"),
        ]);
      this.homePageForm.get("Gender").setValidators([Validators.required]);
      this.homePageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);
      this.homePageForm.get("Pincode").setValidators([Validators.required]);
      this.homePageForm
        .get("Medical_history")
        .setValidators([Validators.required]);
      this.homePageForm
        .get("Email")
        .setValidators([
          Validators.required,
          Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"),
        ]);

      this.homePageForm.get("Name").updateValueAndValidity();
      this.homePageForm.get("Gender").updateValueAndValidity();
      this.homePageForm.get("Mobile").updateValueAndValidity();
      this.homePageForm.get("Email").updateValueAndValidity();
      this.homePageForm.get("Pincode").updateValueAndValidity();
      this.homePageForm.get("Medical_history").updateValueAndValidity();
    }

    if (this.selctedLob == "Pa") {
      document.getElementById("dateOfBirth").style.display = "none";

      document.getElementById("showOccupation").style.display = "Block";
      document.getElementById("showAnnualIncome").style.display = "Block";
      document.getElementById("showMedicalHistoty").style.display = "block";

      this.PAshow = true;
      this.homePageForm
        .get("Medical_history")
        .setValidators([Validators.required]);
      this.homePageForm
        .get("Name")
        .setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z_ ]*$"),
        ]);
      this.homePageForm.get("Gender").setValidators([Validators.required]);
      this.homePageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);
      this.homePageForm.get("Pincode").setValidators([Validators.required]);
      this.homePageForm.get("Occupation").setValidators([Validators.required]);
      this.homePageForm
        .get("AnnualIncome")
        .setValidators([Validators.required]);

      this.homePageForm.get("Name").updateValueAndValidity();
      this.homePageForm.get("Gender").updateValueAndValidity();
      this.homePageForm.get("Mobile").updateValueAndValidity();
      this.homePageForm.get("Pincode").updateValueAndValidity();
      this.homePageForm.get("Occupation").updateValueAndValidity();
      this.homePageForm.get("AnnualIncome").updateValueAndValidity();
      this.homePageForm.get("Medical_history").updateValueAndValidity();
    }

    if (this.selctedLob == "Life") {
      let pincode = document.getElementById("showPincode");
      pincode.style.display = "none";
      document.getElementById("showOccupation").style.display = "none";
      document.getElementById("showAnnualIncome").style.display = "none";
      document.getElementById("dateOfBirth").style.display = "block";
      document.getElementById("showMedicalHistoty").style.display = "block";

      this.homePageForm
        .get("Name")
        .setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z_ ]*$"),
        ]);
      this.homePageForm.get("Gender").setValidators([Validators.required]);
      this.homePageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);
      this.homePageForm
        .get("Email")
        .setValidators([
          Validators.required,
          Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"),
        ]);
      this.homePageForm.get("dateOfBirth").setValidators([Validators.required]);
      this.homePageForm
        .get("Medical_history")
        .setValidators([Validators.required]);

      this.homePageForm.get("Name").updateValueAndValidity();
      this.homePageForm.get("Gender").updateValueAndValidity();
      this.homePageForm.get("Mobile").updateValueAndValidity();
      this.homePageForm.get("Email").updateValueAndValidity();
      this.homePageForm.get("dateOfBirth").updateValueAndValidity();
      this.homePageForm.get("Medical_history").updateValueAndValidity();
    } else {
      document.getElementById("showPincode").style.display = "Block";
    }

    if (this.selctedLob == "Marine") {
      document.getElementById("showGender").style.display = "none";
      document.getElementById("showemail").style.display = "none";
      document.getElementById("showPincode").style.display = "none";
      document.getElementById("showOccupation").style.display = "none";
      document.getElementById("showAnnualIncome").style.display = "none";
      document.getElementById("dateOfBirth").style.display = "none";

      this.Marineshow = true;
      this.homePageForm
        .get("Name")
        .setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z_ ]*$"),
        ]);
      this.homePageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);
      this.homePageForm.get("planType").setValidators([Validators.required]);
      this.homePageForm
        .get("estimeted_dateof_shipment")
        .setValidators([Validators.required]);
      this.homePageForm.get("Commodity").setValidators([Validators.required]);
      this.homePageForm
        .get("Additional_details_of_Commodity")
        .setValidators([Validators.required]);
      this.homePageForm.get("Conveyance").setValidators([Validators.required]);
      this.homePageForm
        .get("Bulk_Cargo_Dimensional")
        .setValidators([Validators.required]);
      this.homePageForm.get("Packing").setValidators([Validators.required]);
      this.homePageForm.get("Currency").setValidators([Validators.required]);
      this.homePageForm.get("voyageFrom").setValidators([Validators.required]);
      this.homePageForm
        .get("voyageFromPort")
        .setValidators([Validators.required]);
      this.homePageForm.get("voyageto").setValidators([Validators.required]);
      this.homePageForm
        .get("voyagetoPort")
        .setValidators([Validators.required]);
      this.homePageForm
        .get("currencyValue")
        .setValidators([Validators.required]);
      this.homePageForm.get("Valuation").setValidators([Validators.required]);
      this.homePageForm
        .get("Invoice_Value_Currency")
        .setValidators([Validators.required]);
      this.homePageForm
        .get("CargoSumInsured")
        .setValidators([Validators.required]);

      this.homePageForm.get("Name").updateValueAndValidity();
      this.homePageForm.get("Mobile").updateValueAndValidity();
      this.homePageForm.get("planType").updateValueAndValidity();
      this.homePageForm
        .get("estimeted_dateof_shipment")
        .updateValueAndValidity();
      this.homePageForm.get("Commodity").updateValueAndValidity();
      this.homePageForm
        .get("Additional_details_of_Commodity")
        .updateValueAndValidity();
      this.homePageForm.get("Conveyance").updateValueAndValidity();
      this.homePageForm.get("Bulk_Cargo_Dimensional").updateValueAndValidity();
      this.homePageForm.get("Packing").updateValueAndValidity();
      this.homePageForm.get("Currency").updateValueAndValidity();
      this.homePageForm.get("voyageFrom").updateValueAndValidity();
      this.homePageForm.get("voyageFromPort").updateValueAndValidity();
      this.homePageForm.get("voyageto").updateValueAndValidity();
      this.homePageForm.get("voyagetoPort").updateValueAndValidity();
      this.homePageForm.get("currencyValue").updateValueAndValidity();
      this.homePageForm.get("Valuation").updateValueAndValidity();
      this.homePageForm.get("Invoice_Value_Currency").updateValueAndValidity();
      this.homePageForm.get("CargoSumInsured").updateValueAndValidity();
    } else {
      document.getElementById("showGender").style.display = "Block";
      document.getElementById("showemail").style.display = "Block";
      this.Marineshow = false;
    }

    if (this.selctedLob == "Motor") {
      this.searchProducts();
      this.getManufactureYearData();
      // this.FileType_Status();

      this.MotorShow = true;
      document.getElementById("showGender").style.display = "none";
      document.getElementById("showPincode").style.display = "none";
      document.getElementById("showOccupation").style.display = "none";
      document.getElementById("showAnnualIncome").style.display = "none";
      document.getElementById("dateOfBirth").style.display = "none";

      this.homePageForm
        .get("Name")
        .setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z_ ]*$"),
        ]);
      this.homePageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);
      this.homePageForm
        .get("Email")
        .setValidators([
          Validators.required,
          Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"),
        ]);
      this.homePageForm.get("product").setValidators([Validators.required]);
      this.homePageForm.get("make").setValidators([Validators.required]);
      this.homePageForm.get("model").setValidators([Validators.required]);
      this.homePageForm.get("fuel").setValidators([Validators.required]);
      this.homePageForm.get("variant").setValidators([Validators.required]);
      this.homePageForm.get("insurerName").setValidators([Validators.required]);
      // this.homePageForm.get('rto').setValidators([Validators.required]);
      this.homePageForm
        .get("manufactureYear")
        .setValidators([Validators.required]);
      this.homePageForm.get("engineNo").setValidators([Validators.required]);
      this.homePageForm.get("chassisNo").setValidators([Validators.required]);
      this.homePageForm
        .get("IsNewVehicle")
        .setValidators([Validators.required]);
      // this.homePageForm.get('RegistrationDate').setValidators([Validators.required]);
      this.homePageForm
        .get("VintageNumber")
        .setValidators([Validators.required]);
      this.homePageForm
        .get("RegistrationNo")
        .setValidators([Validators.required]);
      this.homePageForm
        .get("Registration_Code")
        .setValidators([Validators.required]);
      // this.homePageForm.get('Registration_District_Code').setValidators([Validators.required]);
      // this.homePageForm.get('Registration_State_Code').setValidators([Validators.required]);

      this.homePageForm.get("Name").updateValueAndValidity();
      this.homePageForm.get("Mobile").updateValueAndValidity();
      this.homePageForm.get("Email").updateValueAndValidity();
      this.homePageForm.get("product").updateValueAndValidity();
      this.homePageForm.get("make").updateValueAndValidity();
      this.homePageForm.get("model").updateValueAndValidity();
      this.homePageForm.get("fuel").updateValueAndValidity();
      this.homePageForm.get("variant").updateValueAndValidity();
      this.homePageForm.get("insurerName").updateValueAndValidity();
      // this.homePageForm.get('rto').updateValueAndValidity();
      this.homePageForm.get("manufactureYear").updateValueAndValidity();
      this.homePageForm.get("engineNo").updateValueAndValidity();
      this.homePageForm.get("chassisNo").updateValueAndValidity();
      this.homePageForm.get("IsNewVehicle").updateValueAndValidity();
      // this.homePageForm.get('RegistrationDate').updateValueAndValidity();
      this.homePageForm.get("VintageNumber").updateValueAndValidity();
      this.homePageForm.get("RegistrationNo").updateValueAndValidity();
      this.homePageForm.get("Registration_Code").updateValueAndValidity();
      // this.homePageForm.get('Registration_District_Code').updateValueAndValidity();
      // this.homePageForm.get('Registration_State_Code').updateValueAndValidity();
    } else {
      this.MotorShow = false;
    }
  }

  HomePageForm() {
    this.isSubmitted = true;
    if (this.homePageForm.invalid) {
      return;
    } else {
      let fields = this.homePageForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("Name", fields["Name"]);
      formData.append("Email", fields["Email"]);
      formData.append("Pincode", fields["Pincode"]);
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Source", this.source);
      formData.append("Occupation", JSON.stringify(fields["Occupation"]));
      formData.append("Gender", JSON.stringify(fields["Gender"]));
      formData.append(
        "Medical_history",
        JSON.stringify(fields["Medical_history"])
      );
      formData.append("Lob", JSON.stringify(fields["Lob"]));
      formData.append("AnnualIncome", fields["AnnualIncome"]);
      formData.append("dateOfBirth", fields["dateOfBirth"]);

      formData.append("planType", JSON.stringify(fields["planType"]));
      formData.append(
        "estimeted_dateof_shipment",
        fields["estimeted_dateof_shipment"]
      );
      formData.append("Commodity", JSON.stringify(fields["Commodity"]));
      formData.append(
        "Additional_details_of_Commodity",
        fields["Additional_details_of_Commodity"]
      );
      formData.append("Conveyance", JSON.stringify(fields["Conveyance"]));
      formData.append(
        "Bulk_Cargo_Dimensional",
        JSON.stringify(fields["Bulk_Cargo_Dimensional"])
      );
      formData.append("Packing", JSON.stringify(fields["Packing"]));
      formData.append("Currency", JSON.stringify(fields["Currency"]));
      formData.append("voyageFrom", JSON.stringify(fields["voyageFrom"]));
      formData.append("voyageFromPort", fields["voyageFromPort"]);
      formData.append("voyageto", JSON.stringify(fields["voyageto"]));
      formData.append("voyagetoPort", fields["voyagetoPort"]);
      formData.append("currencyValue", fields["currencyValue"]);
      formData.append("Valuation", JSON.stringify(fields["Valuation"]));
      formData.append(
        "Invoice_Value_Currency",
        fields["Invoice_Value_Currency"]
      );
      formData.append("CargoSumInsured", fields["CargoSumInsured"]);

      // Motor fields
      formData.append("IsNewVehicle", fields["IsNewVehicle"]);
      formData.append("RegistrationNumber", fields["RegistrationNumber"]);
      formData.append("product", JSON.stringify(fields["product"]));
      formData.append("make", JSON.stringify(fields["make"]));
      formData.append("model", JSON.stringify(fields["model"]));
      formData.append("fuel", JSON.stringify(fields["fuel"]));
      formData.append("variant", JSON.stringify(fields["variant"]));
      formData.append("insurerName", JSON.stringify(fields["insurerName"]));
      formData.append(
        "manufactureYear",
        JSON.stringify(fields["manufactureYear"])
      );
      formData.append("engineNo", fields["engineNo"]);
      formData.append("chassisNo", fields["chassisNo"]);
      formData.append("RegistrationDate", fields["RegistrationDate"]);
      formData.append("Registration_Code", fields["Registration_Code"]);
      formData.append(
        "Registration_District_Code",
        fields["Registration_District_Code"]
      );
      formData.append(
        "Registration_State_Code",
        fields["Registration_State_Code"]
      );
      formData.append(
        "Registration_City_Code",
        fields["Registration_City_Code"]
      );

      this.api.IsLoading();
      this.api.HttpPostTypeBms("lms/LmsCommon/Addleads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
  }

  productPage_Form() {
    this.productPageFormSubmitted = true;
    if (this.productPageForm.invalid) {
      return;
    } else {
      let fields = this.productPageForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("Name", fields["Name"]);
      formData.append("RegisterNumber", fields["RegisterNumber"]);
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Source", this.source);
      formData.append("product_type", JSON.stringify(fields["Product_type"]));

      this.api.IsLoading();
      this.api.HttpPostTypeBms("lms/LmsCommon/Addleads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
  }

  ContactForm_submit() {
    this.contactSubmitted = true;
    if (this.ContactForm.invalid) {
      return;
    } else {
      let fields = this.ContactForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("Name", fields["Name"]);
      formData.append("Email", fields["Email"]);
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Source", this.source);
      formData.append("msg", fields["MSG"]);

      this.api.IsLoading();
      this.api.HttpPostTypeBms("lms/LmsCommon/Addleads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
  }

  b_pospForm_submit() {
    this.PospFormIsSubmitted = true;
    if (this.becomePospForm.invalid) {
      return;
    } else {
      let fields = this.becomePospForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Source", this.source);

      this.api.IsLoading();
      this.api.HttpPostTypeBms("lms/LmsCommon/Addleads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
  }
  S_CallbackForm_submit() {
    this.S_CallbackisSubmitted = true;
    if (this.S_CallbackForm.invalid) {
      return;
    } else {
      let fields = this.S_CallbackForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Source", this.source);

      this.api.IsLoading();
      this.api.HttpPostTypeBms("lms/LmsCommon/Addleads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
  }

  landingPageForm_submit() {
    this.LPisSubmitted = true;
    if (this.landingPageForm.invalid) {
      return;
    } else {
      let fields = this.landingPageForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("ConcernMobile", fields["ConcernMobile"]);
      formData.append("Source", this.source);
      formData.append("ClientName", fields["ClientName"]);
      formData.append("ConcernName", fields["ConcernName"]);
      formData.append("ClientAddress", fields["ClientAddress"]);
      formData.append("ConcernNatureofWork", fields["ConcernNatureofWork"]);
      formData.append("ConcernEmail", fields["ConcernEmail"]);
      // formData.append("PolicyDetails", fields["PolicyDetails"]);
      formData.append("Lob", JSON.stringify(fields["Type"]));

      this.api.IsLoading();
      this.api.HttpPostTypeBms("lms/LmsCommon/Addleads", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.homePageForm.controls;
  }
  get fc_productPageForm() {
    return this.productPageForm.controls;
  }
  get fc_contactForm() {
    return this.ContactForm.controls;
  }
  get fc_landingPageForm() {
    return this.landingPageForm.controls;
  }
  get fc_B_pospForm() {
    return this.becomePospForm.controls;
  }
  get fcS_CallbackForm() {
    return this.S_CallbackForm.controls;
  }

  resetValidators(type: any) {
    if (type == "home page") {
      this.homePageForm.get("Name").setValidators(null);
      this.homePageForm.get("Occupation").setValidators(null);
      this.homePageForm.get("AnnualIncome").setValidators(null);
      this.homePageForm.get("Pincode").setValidators(null);
      this.homePageForm.get("Gender").setValidators(null);
      this.homePageForm.get("Email").setValidators(null);
      this.homePageForm.get("Medical_history").setValidators(null);
      this.homePageForm.get("dateOfBirth").setValidators(null);
      this.homePageForm.get("planType").setValidators(null);
      this.homePageForm.get("estimeted_dateof_shipment").setValidators(null);
      this.homePageForm.get("Commodity").setValidators(null);
      this.homePageForm
        .get("Additional_details_of_Commodity")
        .setValidators(null);
      this.homePageForm.get("Conveyance").setValidators(null);
      this.homePageForm.get("Bulk_Cargo_Dimensional").setValidators(null);
      this.homePageForm.get("Packing").setValidators(null);
      this.homePageForm.get("Currency").setValidators(null);
      this.homePageForm.get("voyageFrom").setValidators(null);
      this.homePageForm.get("voyageFromPort").setValidators(null);
      this.homePageForm.get("voyageto").setValidators(null);
      this.homePageForm.get("voyagetoPort").setValidators(null);
      this.homePageForm.get("currencyValue").setValidators(null);
      this.homePageForm.get("Valuation").setValidators(null);
      this.homePageForm.get("Invoice_Value_Currency").setValidators(null);
      this.homePageForm.get("CargoSumInsured").setValidators(null);

      this.homePageForm.get("product").setValidators(null);
      this.homePageForm.get("make").setValidators(null);
      this.homePageForm.get("model").setValidators(null);
      this.homePageForm.get("fuel").setValidators(null);
      this.homePageForm.get("variant").setValidators(null);
      this.homePageForm.get("insurerName").setValidators(null);
      this.homePageForm.get("rto").setValidators(null);
      this.homePageForm.get("manufactureYear").setValidators(null);
      this.homePageForm.get("engineNo").setValidators(null);
      this.homePageForm.get("chassisNo").setValidators(null);
      this.homePageForm.get("IsNewVehicle").setValidators(null);
      this.homePageForm.get("RegistrationDate").setValidators(null);
      this.homePageForm.get("VintageNumber").setValidators(null);
      this.homePageForm.get("RegistrationNo").setValidators(null);
      this.homePageForm.get("Registration_Code").setValidators(null);
      this.homePageForm.get("Registration_District_Code").setValidators(null);
      this.homePageForm.get("Registration_State_Code").setValidators(null);

      this.homePageForm.get("Name").updateValueAndValidity();
      this.homePageForm.get("Occupation").updateValueAndValidity();
      this.homePageForm.get("AnnualIncome").updateValueAndValidity();
      this.homePageForm.get("Pincode").updateValueAndValidity();
      this.homePageForm.get("Gender").updateValueAndValidity();
      this.homePageForm.get("Email").updateValueAndValidity();
      this.homePageForm.get("dateOfBirth").updateValueAndValidity();
      this.homePageForm.get("planType").updateValueAndValidity();
      this.homePageForm
        .get("estimeted_dateof_shipment")
        .updateValueAndValidity();
      this.homePageForm.get("Commodity").updateValueAndValidity();
      this.homePageForm
        .get("Additional_details_of_Commodity")
        .updateValueAndValidity();
      this.homePageForm.get("Conveyance").updateValueAndValidity();
      this.homePageForm.get("Bulk_Cargo_Dimensional").updateValueAndValidity();
      this.homePageForm.get("Packing").updateValueAndValidity();
      this.homePageForm.get("Currency").updateValueAndValidity();
      this.homePageForm.get("voyageFrom").updateValueAndValidity();
      this.homePageForm.get("voyageFromPort").updateValueAndValidity();
      this.homePageForm.get("voyageto").updateValueAndValidity();
      this.homePageForm.get("voyagetoPort").updateValueAndValidity();
      this.homePageForm.get("currencyValue").updateValueAndValidity();
      this.homePageForm.get("Valuation").updateValueAndValidity();
      this.homePageForm.get("Invoice_Value_Currency").updateValueAndValidity();
      this.homePageForm.get("CargoSumInsured").updateValueAndValidity();

      this.homePageForm.get("product").updateValueAndValidity();
      this.homePageForm.get("make").updateValueAndValidity();
      this.homePageForm.get("model").updateValueAndValidity();
      this.homePageForm.get("fuel").updateValueAndValidity();
      this.homePageForm.get("variant").updateValueAndValidity();
      this.homePageForm.get("insurerName").updateValueAndValidity();
      this.homePageForm.get("rto").updateValueAndValidity();
      this.homePageForm.get("manufactureYear").updateValueAndValidity();
      this.homePageForm.get("engineNo").updateValueAndValidity();
      this.homePageForm.get("chassisNo").updateValueAndValidity();
      this.homePageForm.get("IsNewVehicle").updateValueAndValidity();
      this.homePageForm.get("RegistrationDate").updateValueAndValidity();
      this.homePageForm.get("VintageNumber").updateValueAndValidity();
      this.homePageForm.get("RegistrationNo").updateValueAndValidity();
      this.homePageForm.get("Registration_Code").updateValueAndValidity();
      this.homePageForm
        .get("Registration_District_Code")
        .updateValueAndValidity();
      this.homePageForm.get("Registration_State_Code").updateValueAndValidity();
      this.homePageForm.get("Medical_history").updateValueAndValidity();
    }

    if (type == "product page") {
      this.productPageForm.get("Mobile").setValidators(null);
      this.productPageForm.get("Name").setValidators(null);
      this.productPageForm.get("RegisterNumber").setValidators(null);

      this.productPageForm.get("Mobile").updateValueAndValidity();
      this.productPageForm.get("Name").updateValueAndValidity();
      this.productPageForm.get("RegisterNumber").updateValueAndValidity();
    }
  }

  GetOccupationData() {
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());

    this.api
      .HttpPostTypeBms("lms/LmsCommon/GetOcupation", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.OccupationData = result["data"];
        }
      });
  }
  GetMarineAllData() {
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());

    this.api
      .HttpPostTypeBms("lms/LmsCommon/GetMarineAllData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.CommodityData = result["data"]["commodity"];
          this.ConveyanceData = result["data"]["conveyance"];
          this.PackingData = result["data"]["packing"];
          this.CurrencyData = result["data"]["currency"];
          this.voyageFromData = result["data"]["country"];
          this.voyagetoData = result["data"]["country"];
          this.ValuationData = result["data"]["valuation"];
        }
      });
  }

  GetCoverageData(selectedValue: any): void {
    this.selctedconvancey = selectedValue["Id"];

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("Conveyance", this.selctedconvancey);

    this.api
      .HttpPostTypeBms("lms/LmsCommon/Get_Coverage", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.CoverageData = result["data"];
        }
      });
  }

  changeCurrencyType(selectedValue: any): void {
    let currencyValue = selectedValue["Id"];

    if (currencyValue == "INR") {
      let c_value = 1;

      this.homePageForm.get("currencyValue").setValue(c_value);
      this.homePageForm.get("currencyValue").disable();
    } else {
      this.homePageForm.get("currencyValue").enable();
    }
  }

  updateValues() {
    const valuationPercentage = this.homePageForm.get(
      "choseValuationPercentage"
    ).value;
    // const valuationPercentage = parseFloat(this.homePageForm.get('currencyValue').value) || 0;
    const invoiceValueCurrency =
      this.homePageForm.get("Invoice_Value_Currency").value || 0;
    var val_persent = 0;

    const currencyValueInput =
      parseFloat(this.homePageForm.get("currencyValue").value) || 0;

    //   //   //   console.log(currencyValueInput);
    //   //   //   console.log(invoiceValueCurrency);
    if (valuationPercentage == "") {
      val_persent = 0;
    } else {
      val_persent = valuationPercentage[0].Id.replace("%", "").replace("+", "");
    }
    //   //   //   console.log(val_persent);

    const totalSum = invoiceValueCurrency * currencyValueInput;
    const roundVal = Math.round(totalSum);

    if (val_persent > 0) {
      const newValues =
        invoiceValueCurrency + (invoiceValueCurrency * val_persent) / 100;
      const newCargoSuminsured = newValues * currencyValueInput;
      this.homePageForm.get("CargoSumInsured").setValue(newCargoSuminsured);
    } else {
      this.homePageForm.get("CargoSumInsured").setValue(roundVal);
    }
  }
  changeValuationpercent(e: any) {
    this.updateValues();
  }

  GetProductChange(selectedValue: any): void {
    let product_type = selectedValue["Id"];

    this.resetValidators("product page");

    if (
      product_type == "Health" ||
      product_type == "Life" ||
      product_type == "Travel" ||
      product_type == "Marine" ||
      product_type == "Property"
    ) {
      document.getElementById("prodcutReg_number").style.display = "none";
      document.getElementById("nameid").style.display = "Block";

      this.productPageForm.get("Name").setValidators([Validators.required]);
      this.productPageForm.get("Name").updateValueAndValidity();
      this.productPageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);
      this.productPageForm.get("Mobile").updateValueAndValidity();
    }
    if (product_type == "Car" || product_type == "Bike") {
      document.getElementById("prodcutReg_number").style.display = "block";
      document.getElementById("nameid").style.display = "none";

      this.productPageForm
        .get("RegisterNumber")
        .setValidators([Validators.required]);
      this.productPageForm
        .get("Mobile")
        .setValidators([
          Validators.required,
          Validators.pattern("^([0|+[0-9]{1,5})?([0-9]{10})$"),
        ]);

      this.productPageForm.get("RegisterNumber").updateValueAndValidity();
      this.productPageForm.get("Mobile").updateValueAndValidity();
    }
  }

  searchProducts() {
    this.api.HttpGetType("b-crm/Universal/searchProducts").then(
      (result) => {
        if (result["status"] == true) {
          this.productData = result["data"];
          this.insurerData = result["insurer"];

          this.makeData = [];
          this.modelData = [];
          this.variantData = [];
        } else {
          //this.api.Toast('Warning',result['msg']);
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

  //=====SEARCH MAKE=====//
  searchMakes() {
    this.homePageForm.get("make").setValue("");
    this.homePageForm.get("model").setValue("");
    this.homePageForm.get("fuel").setValue("");
    this.homePageForm.get("variant").setValue("");

    var product = this.homePageForm.get("product");
    var productId = product.value[0].Id;

    const formData = new FormData();
    formData.append("product", productId);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Universal/searchMakes", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.makeData = result["data"];
          this.modelData = [];
          this.fuelData = [];
          this.variantData = [];
        } else {
          //this.api.Toast('Warning',result['msg']);
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

  //=====SEARCH MODEL=====//

  searchModels(e) {
    this.homePageForm.get("model").setValue("");
    this.homePageForm.get("fuel").setValue("");
    this.homePageForm.get("variant").setValue("");

    var make = this.homePageForm.get("make");
    var product = this.homePageForm.get("product");

    var productId = product.value[0].Id;

    var makeName = make.value[0].Name;

    const formData = new FormData();
    formData.append("make", makeName);
    formData.append("product", productId);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Universal/searchModels", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.modelData = result["data"];
          this.fuelData = [];
          this.variantData = [];
        } else {
          // this.api.Toast('Warning',result['msg']);
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

  searchFuel(e) {
    this.homePageForm.get("fuel").setValue("");
    this.homePageForm.get("variant").setValue("");

    var model = this.homePageForm.get("model");
    var product = this.homePageForm.get("product");

    var productId = product.value[0].Id;
    var modelName = model.value[0].Name;

    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("product", productId);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Universal/searchFuel", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.fuelData = result["data"];
          this.variantData = [];
        } else {
          // this.api.Toast('Warning',result['msg']);
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

  //=====SEARCH MODEL=====//
  searchVariants(e) {
    var product = this.homePageForm.get("product");

    var fueltype = this.homePageForm.get("fuel");

    var fuel = fueltype.value[0].Name;
    var productId = product.value[0].Id;

    var model = this.homePageForm.get("model");
    var modelName = model.value[0].Name;

    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("product", productId);
    formData.append("fuel", fuel);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Universal/searchVariants", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.variantData = result["data"];
        } else {
          // this.api.Toast('Warning',result['msg']);
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

  //===== MANUFACTUREYEAR DATA=====//
  getManufactureYearData() {
    var a = 1;
    var currentYear = new Date().getFullYear();

    for (let i = 1990; i <= currentYear; i++) {
      var b = a++;
      this.manufactureYearData.push({ Id: i, Name: i });
    }
    this.manufactureYearData.reverse();
  }
  AutoTabRegistrationNo(input, maxLength, libAutoTab) {
    const length = input.target.value.length;

    if (length >= maxLength && libAutoTab) {
      const field = document.getElementById(libAutoTab);
      if (field) {
        field.focus();
      }
    }
  }

  FileType_Status() {
    const Registration_City_Code = this.homePageForm.get(
      "Registration_City_Code"
    );

    const Registration_Code = this.homePageForm.get("Registration_Code");
    const RegistrationDate = this.homePageForm.get("RegistrationDate");
    const Registration_State_Code = this.homePageForm.get(
      "Registration_State_Code"
    );
    const Registration_District_Code = this.homePageForm.get(
      "Registration_District_Code"
    );
    const RegistrationNo = this.homePageForm.get("RegistrationNo");

    // this.homePageForm.get("VintageNumber").valueChanges.subscribe(
    //   (type) => {
    var fields = this.homePageForm.value;

    this.Vintage = fields["VintageNumber"][0]["Name"];
    //   //   //   console.log(this.Vintage);

    if (this.Vintage == "Normal") {
      if (fields["IsNewVehicle"] == "new") {
        Registration_State_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators([Validators.required]);
        Registration_City_Code.setValidators(null);
        Registration_Code.setValidators(null);
        RegistrationNo.setValidators(null);
        RegistrationDate.setValidators(null);
      } else if (
        fields["IsNewVehicle"] == "Rollover" ||
        fields["IsNewVehicle"] == "Used"
      ) {
        Registration_State_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators([Validators.required]);
        RegistrationDate.setValidators([Validators.required]);
        Registration_City_Code.setValidators([Validators.required]);
        Registration_Code.setValidators([Validators.required]);
        RegistrationNo.setValidators(null);
      }
    } else {
      Registration_State_Code.setValidators(null);
      Registration_District_Code.setValidators(null);
      Registration_City_Code.setValidators(null);
      Registration_Code.setValidators(null);
      RegistrationNo.setValidators([Validators.required]);
    }

    RegistrationNo.updateValueAndValidity();
    Registration_Code.updateValueAndValidity();
    Registration_City_Code.updateValueAndValidity();
    RegistrationDate.updateValueAndValidity();
    Registration_State_Code.updateValueAndValidity();
    Registration_District_Code.updateValueAndValidity();
  }
  // );

  // }
}
