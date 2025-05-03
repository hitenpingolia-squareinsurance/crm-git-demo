import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-offline-quote",
  templateUrl: "./offline-quote.component.html",
  styleUrls: ["./offline-quote.component.css"],
})
export class OfflineQuoteComponent implements OnInit {
  selectedFiles: File;
  RC_Motor_Front: File;
  RC_Motor_Back: File;
  Previous_Policy_Pdf: File;
  Invoice: File;
  Other: File;

  OfflineQuoteForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;
  IsNewVehicle: any = "";
  Company: any = "";
  Addons: any = "";
  TenureBox: any = "";
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

  dropdownSettingsSingle: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  RC_Motor_Front_image: any = 0;
  RC_Motor_Back_image: any = 0;
  Previous_Policy_Pdf_image: any = 0;
  Invoice_image: any = 0;
  Other_image: any = 0;

  MaxDate = new Date();
  MinDate: any;
  MappingType: any;
  MappingType1: any;
  MappingPerson: any;
  Divshow: any;
  QuoteSourceData: { Id: string; Name: string }[];
  currentUrl: string;
  EmployeeMappingPersonData: any;
  EmployeeMappingPersonval: any;
  Pan_image: number;
  Pan: File;
  Aadhaar: File;
  aadhar_image: number;
  vehicle_details: any;
  makeName: any;
  modelName: any;
  nameName: any;
  policyExpieryDate: any;
  previousInsurerName: any;
  regYearName: any;
  variantName: any;
  fuelName: any;
  vehicle_type: any;

  showDiv: boolean = false;
  makeData: any = [];
  modelData: any;
  variantData: any = [];
  modelDisable: boolean;
  fuelData: any;
  fuelTypeDisable: boolean;
  dataArr12: any;
  SelectedmakeName: any;
  SelectedmodelName: any;
  SelectedvariantName: any;
  SelectedregYearName: any;
  SelectedfuelName: any;
  empType: string;
  Selectmake: any;
  Selectmodel: any;
  Selectedfuel: any;
  SelectedCustomername: any;
  SelectedCustomermobile: any;
  SelectedCustomeremail: any;
  Selectedpreviousinsurer: any;
  RenewalDocs: any = [];

  Aadhaar_Back: File;
  Aadhaar_Front: File;
  aadhar_image_front: number;
  aadhar_image_back: number;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.Divshow = "0";

    this.currentUrl = this.router.url;

    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
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
      limitSelection: 5,
    };

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.MaxDate = new Date();

    this.OfflineQuoteForm = this.formBuilder.group({
      customername: [""],
      customeremail: [""],
      customermobileno: [""],
      VehicleTypeId: ["", Validators.required],
      PolicyTypeId: ["", Validators.required],
      IsNewVehicle: ["", Validators.required],
      RegistrationDate: [""],
      VintageNumber: ["", Validators.required],
      Registration_State_Code: [""],
      Registration_District_Code: [""],
      RegistrationNo: [""],
      Registration_City_Code: [{ value: "" }],
      Registration_Code: [{ value: "" }],
      Pypexpirydate: [{ value: "", disabled: true }],
      IsClaimRequest: [{ value: "", disabled: true }],
      previousinsurer: [{ value: "", disabled: true }, [Validators.required]],
      OwnerChange: [{ value: "", disabled: true }],
      NCBProtection: [{ value: "", disabled: true }],

      lastyearncb: [{ value: "", disabled: true }],
      requiredinsurer: [{ value: "", disabled: true }],
      requiredaddons: [{ value: "" }],
      idvlowestvalue: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(3),
          Validators.maxLength(12),
        ],
      ],
      idvhighestvalue: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(3),
          Validators.maxLength(12),
        ],
      ],

      RcFront: [""],
      RcBack: [""],
      PreviousPolicyPdf: [{ value: "", disabled: true }],
      InvoiceImage: [{ value: "", disabled: true }],
      OtherDocument: [""],
      pan_document: [""],
      aadhaar_document_back: [""],
      aadhaar_document_front: [""],

      Tenure_Comprehensive: [""],
      TPpolicynumber: [""],
      TPexpirydate: [""],
      TPpolicyinsurer: [""],
      remark: ["", Validators.required],
      IsBestQuote: ["No", [Validators.required]],
      IsPyp: ["Yes", [Validators.required]],
      login_role_id: [""],
      login_role_type: [""],
      QuoteSource: [""],
      EmployeeMappingPerson: [""],

      make: [""],
      model: [""],
      fuelType: [""],
      variant: [""],
      registration_years: [""],
      customerDetail: ["Yes", Validators.required],
    });

    this.TenureBox = [
      { Id: "1", Name: "1" },
      { Id: "2", Name: "2" },
      { Id: "3", Name: "3" },
    ];

    this.OfflineQuoteForm.get("Tenure_Comprehensive").setValue([
      { Id: "1", Name: "1" },
    ]);

    this.QuoteSourceData = [
      { Id: "Whatsapp", Name: "Whatsapp" },
      { Id: "Call", Name: "Call" },
      { Id: "Mail", Name: "Mail" },
    ];

    this.MappingType = [
      { Id: "Employee", Name: "Employee" },
      { Id: "Agent", Name: "Pos" },
      { Id: "Sp", Name: "Sp" },
    ];
    this.MappingType1 = [
      { Id: "Agent", Name: "Pos" },
      { Id: "Sp", Name: "Sp" },
    ];
  }

  ngOnInit() {
    this.FileType_Status();
    this.FilterDatacompany();
    this.FileType_Status2();
    this.CheckCreaterRights();
    this.searchMakes();
  }

  onChangeFileType_Status(e) {
    this.IsNewVehicle = e.target.value;
    //   //   //   console.log(this.IsNewVehicle);
  }

  FileType_Status() {
    const IsPyp = this.OfflineQuoteForm.get("IsPyp");
    const Previous_expirydate = this.OfflineQuoteForm.get("Pypexpirydate");
    const IsClaimRequest = this.OfflineQuoteForm.get("IsClaimRequest");

    const lastyearncb = this.OfflineQuoteForm.get("lastyearncb");
    const previousinsurer = this.OfflineQuoteForm.get("previousinsurer");
    const Invoice = this.OfflineQuoteForm.get("InvoiceImage");
    const PreviousPolicyPdf = this.OfflineQuoteForm.get("PreviousPolicyPdf");

    const Registration_City_Code = this.OfflineQuoteForm.get(
      "Registration_City_Code"
    );

    const Registration_Code = this.OfflineQuoteForm.get("Registration_Code");
    const RcFront = this.OfflineQuoteForm.get("RcFront");
    const RegistrationDate = this.OfflineQuoteForm.get("RegistrationDate");
    const Registration_State_Code = this.OfflineQuoteForm.get(
      "Registration_State_Code"
    );
    const Registration_District_Code = this.OfflineQuoteForm.get(
      "Registration_District_Code"
    );

    this.OfflineQuoteForm.get("IsNewVehicle").valueChanges.subscribe((Type) => {
      if (Type == "New") {
        IsPyp.setValidators(null);
        Previous_expirydate.setValidators(null);
        IsClaimRequest.setValidators(null);
        lastyearncb.setValidators(null);
        previousinsurer.setValidators(null);
        PreviousPolicyPdf.setValidators(null);
        Registration_City_Code.setValidators(null);
        Registration_Code.setValidators(null);
        Invoice.setValidators([Validators.required]);
        Registration_State_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators([Validators.required]);

        RegistrationDate.setValidators(null);

        RegistrationDate.setValue("");

        IsPyp.setValue("");
        Previous_expirydate.setValue("");
        IsClaimRequest.setValue("");
        lastyearncb.setValue("");
        previousinsurer.setValue("");
        PreviousPolicyPdf.setValue("");
        Registration_City_Code.setValue("");
        Registration_Code.setValue("");

        RegistrationDate.disable();

        Invoice.enable();
        IsPyp.disable();
        PreviousPolicyPdf.disable();
        lastyearncb.disable();
        IsClaimRequest.disable();
        previousinsurer.disable();
        Previous_expirydate.disable();

        Registration_City_Code.disable();
        Registration_Code.disable();

        this.MinDate = new Date();
        this.MaxDate.setDate(this.MaxDate.getDate() + 60);
      }

      if (Type == "Rollover") {
        this.MinDate = new Date("DD-MM-YYYY");
        this.MaxDate = new Date("DD-MM-YYYY");

        RegistrationDate.setValue("");

        IsPyp.setValidators([Validators.required]);
        RegistrationDate.setValidators([Validators.required]);

        Previous_expirydate.setValidators([Validators.required]);
        PreviousPolicyPdf.setValidators([Validators.required]);
        IsClaimRequest.setValidators([Validators.required]);
        previousinsurer.setValidators([Validators.required]);
        Registration_State_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators([Validators.required]);
        Registration_City_Code.setValidators([Validators.required]);
        Registration_Code.setValidators([Validators.required]);
        RcFront.setValidators([Validators.required]);

        Invoice.setValidators(null);

        IsPyp.setValue("Yes");

        Previous_expirydate.setValue("");
        IsClaimRequest.setValue("");
        lastyearncb.setValue("");
        previousinsurer.setValue("");
        PreviousPolicyPdf.setValue("");
        Registration_City_Code.setValue("");
        Registration_Code.setValue("");

        Invoice.disable();
        Registration_City_Code.enable();
        Registration_Code.enable();
        PreviousPolicyPdf.enable();
        IsPyp.enable();
        Previous_expirydate.enable();
        lastyearncb.enable();
        IsClaimRequest.enable();
        previousinsurer.enable();
        RegistrationDate.enable();
      }

      if (Type == "Used") {
        this.MinDate = new Date("DD-MM-YYYY");
        this.MaxDate = new Date("DD-MM-YYYY");

        RegistrationDate.setValue("");
        Previous_expirydate.setValidators(null);
        IsClaimRequest.setValidators(null);
        lastyearncb.setValidators(null);
        previousinsurer.setValidators(null);
        PreviousPolicyPdf.setValidators(null);
        RegistrationDate.setValidators([Validators.required]);

        Registration_State_Code.setValidators([Validators.required]);
        Registration_District_Code.setValidators([Validators.required]);
        Registration_City_Code.setValidators([Validators.required]);
        Registration_Code.setValidators([Validators.required]);
        RcFront.setValidators([Validators.required]);

        Invoice.setValidators(null);

        IsPyp.setValue("No");

        Previous_expirydate.setValue("");
        IsClaimRequest.setValue("");
        lastyearncb.setValue("");
        previousinsurer.setValue("");
        PreviousPolicyPdf.setValue("");
        Registration_City_Code.setValue("");
        Registration_Code.setValue("");

        Invoice.disable();
        Registration_City_Code.enable();
        Registration_Code.enable();
        IsPyp.disable();
        PreviousPolicyPdf.disable();
        lastyearncb.disable();
        IsClaimRequest.disable();
        previousinsurer.disable();
        Previous_expirydate.disable();
        RegistrationDate.enable();
      }

      if (Type == "Renewal") {
        PreviousPolicyPdf.setValidators(null);

        PreviousPolicyPdf.setValue("");
      }

      Invoice.updateValueAndValidity();
      RegistrationDate.updateValueAndValidity();
      IsPyp.updateValueAndValidity();
      Previous_expirydate.updateValueAndValidity();
      lastyearncb.updateValueAndValidity();
      IsClaimRequest.updateValueAndValidity();
      previousinsurer.updateValueAndValidity();
      Registration_Code.updateValueAndValidity();
      PreviousPolicyPdf.updateValueAndValidity();
      Registration_City_Code.updateValueAndValidity();
      RcFront.updateValueAndValidity();
      Registration_State_Code.updateValueAndValidity();
      Registration_District_Code.updateValueAndValidity();
    });

    const requiredinsurer = this.OfflineQuoteForm.get("requiredinsurer");
    const addons = this.OfflineQuoteForm.get("requiredaddons");
    const idvlowestvalue = this.OfflineQuoteForm.get("idvlowestvalue");
    const idvhighestvalue = this.OfflineQuoteForm.get("idvhighestvalue");
    const RegistrationNo = this.OfflineQuoteForm.get("RegistrationNo");

    this.OfflineQuoteForm.get("IsBestQuote").valueChanges.subscribe((type) => {
      if (type == "No") {
        this.FileType_Status();

        requiredinsurer.setValidators(null);
        addons.setValidators(null);
      } else {
        this.FileType_Status();

        requiredinsurer.enable();
        addons.enable();

        requiredinsurer.setValidators([Validators.required]);
      }

      requiredinsurer.updateValueAndValidity();
      addons.updateValueAndValidity();
    });

    this.OfflineQuoteForm.get("VintageNumber").valueChanges.subscribe(
      (type) => {
        var fields = this.OfflineQuoteForm.value;
        if (type == "Normal") {
          if (fields["IsNewVehicle"] == "new") {
            Registration_State_Code.setValidators([Validators.required]);
            Registration_District_Code.setValidators([Validators.required]);
            Registration_City_Code.setValidators(null);
            Registration_Code.setValidators(null);
            RegistrationNo.setValidators(null);
          } else if (
            fields["IsNewVehicle"] == "Rollover" ||
            fields["IsNewVehicle"] == "Used"
          ) {
            Registration_State_Code.setValidators([Validators.required]);
            Registration_District_Code.setValidators([Validators.required]);
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
        Registration_State_Code.updateValueAndValidity();
        Registration_District_Code.updateValueAndValidity();
      }
    );

    this.clickDontknow(this.OfflineQuoteForm.value["PolicyTypeId"]);
  }

  //=====SEARCH MAKE=====//
  searchMakes() {
    const formData = new FormData();

    formData.append("source", "Online");

    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/searchMakes", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.makeData = result["data"];
          //this.selectedMake = result['makeValue'];
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
  searchModels() {
    // console.log(this.SelectedmakeName);

    this.Selectmake = this.SelectedmakeName[0].Name;

    const formData = new FormData();
    if (this.Selectmake != "") {
      formData.append("make", this.SelectedmakeName[0].Name);
    } else {
      this.makeName = this.OfflineQuoteForm.get("make").value[0].Name;
      formData.append("make", this.makeName);
    }

    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/searchModels", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.modelData = result["data"];
          //this.selectedModel = result['modelValue'];
          this.variantData = [];
          this.SelectedmodelName = this.dataArr12.model;

          this.searchFuelType();
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

  searchFuelType() {
    this.Selectmodel = this.SelectedmodelName[0].Name;

    const formData = new FormData();
    if (this.Selectmodel != "") {
      formData.append("model", this.Selectmodel);
    } else {
      this.modelName = this.OfflineQuoteForm.get("model").value[0].Name;
      formData.append("model", this.modelName);
    }

    this.api.HttpPostType("Offlinequote/searchFuelType", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.fuelData = result["data"];

          this.SelectedfuelName = this.dataArr12.fuelType;
          this.searchVariants();
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

  searchVariants() {
    this.Selectmodel = this.SelectedmodelName[0].Name;

    const formData = new FormData();
    if (this.Selectmodel != "") {
      formData.append("model", this.Selectmodel);
    } else {
      this.modelName = this.OfflineQuoteForm.get("model").value[0].Name;
      formData.append("model", this.modelName);
    }

    this.Selectedfuel = this.SelectedfuelName[0].Name;

    if (this.Selectedfuel != "") {
      formData.append("fuelName", this.Selectedfuel);
    } else {
      this.fuelName = this.OfflineQuoteForm.get("fuelType").value[0].Name;
      formData.append("fuelName", this.fuelName);
    }

    // formData.append("model", this.modelName);
    // formData.append("fuelName", this.fuelName);

    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/searchVariants", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.variantData = result["data"];

          this.SelectedvariantName = this.dataArr12.variant;
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

  Changegaditype(Type) {
    this.OfflineQuoteForm.get("requiredaddons").setValue("");

    if (Type == 1) {
      this.Addons = [
        { Id: "Zero Depreciation Cover", Name: "Zero Depreciation Cover" },
        { Id: "Return to Invoice", Name: "Return to Invoice" },
      ];
    }
    if (Type == 2) {
      this.Addons = [
        { Id: "Zero Depreciation Cover", Name: "Zero Depreciation Cover" },
        { Id: "Consumable", Name: "Consumable" },
        { Id: "Engine Protection", Name: "Engine Protection" },
        { Id: "Tyre Cover", Name: "Tyre Cover" },
        { Id: "Return to Invoice", Name: "Return to Invoice" },
        {
          Id: "Loss of Personal Belonging",
          Name: "Loss of Personal Belonging",
        },
        { Id: "Road Side Assistance", Name: "Road Side Assistance" },
        { Id: "Loss of Key", Name: "Loss of Key" },
        { Id: "NCB Protection", Name: "NCB Protection" },
        { Id: "Passenger Assist Cover", Name: "Passenger Assist Cover" },
      ];
    }
    if (Type == 3) {
      this.Addons = [
        { Id: "IMT 23", Name: "IMT 23" },
        { Id: "Zero Depreciation Cover", Name: "Zero Depreciation Cover" },
        { Id: "Consumable", Name: "Consumable" },
        { Id: "Engine Protection", Name: "Engine Protection" },
        { Id: "Towing Cover", Name: "Towing Cover" },
      ];
    }
    if (Type == 4) {
      this.Addons = [
        { Id: "IMT 23", Name: "IMT 23" },
        { Id: "Zero Depreciation Cover", Name: "Zero Depreciation Cover" },
        { Id: "Consumable", Name: "Consumable" },
        { Id: "Engine Protection", Name: "Engine Protection" },
        { Id: "Towing Cover", Name: "Towing Cover" },
      ];
    }
    if (Type == 5) {
      this.Addons = [
        { Id: "IMT 23", Name: "IMT 23" },
        { Id: "IMT 34", Name: "IMT 34" },
        { Id: "IMT 47", Name: "IMT 47" },
      ];
    }
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

  // ngAfterViewInit() {
  //   const Previous_expirydate = this.OfflineQuoteForm.get("Pypexpirydate");
  //   const IsClaimRequest = this.OfflineQuoteForm.get("IsClaimRequest");
  //   const NCBProtection = this.OfflineQuoteForm.get("NCBProtection");
  //   const OwnerChange = this.OfflineQuoteForm.get("OwnerChange");

  //   const lastyearncb = this.OfflineQuoteForm.get("lastyearncb");
  //   const previousinsurer = this.OfflineQuoteForm.get("previousinsurer");
  //   const PreviousPolicyPdf = this.OfflineQuoteForm.get("PreviousPolicyPdf");

  //   //for saod start
  //   const TPexpirydate = this.OfflineQuoteForm.get("TPexpirydate");
  //   const TPpolicynumber = this.OfflineQuoteForm.get("TPpolicynumber");
  //   const TPpolicyinsurer = this.OfflineQuoteForm.get("TPpolicyinsurer");
  //   const IsPyp = this.OfflineQuoteForm.get("IsPyp");
  //   const Tenure_Comprehensive = this.OfflineQuoteForm.get(
  //     "Tenure_Comprehensive"
  //   );
  //   const IsNewVehicle = this.OfflineQuoteForm.get("IsNewVehicle");

  //   //end

  //   this.OfflineQuoteForm.get("IsPyp").valueChanges.subscribe((Type) => {
  //     if (Type == "No") {
  //       Previous_expirydate.setValidators(null);
  //       IsClaimRequest.setValidators(null);
  //       NCBProtection.setValidators(null);
  //       OwnerChange.setValidators(null);

  //       lastyearncb.setValidators(null);
  //       previousinsurer.setValidators(null);
  //       PreviousPolicyPdf.setValidators(null);

  //       Previous_expirydate.disable();

  //       lastyearncb.disable();
  //       IsClaimRequest.disable();

  //       NCBProtection.disable();
  //       OwnerChange.disable();
  //       previousinsurer.disable();
  //       PreviousPolicyPdf.disable();

  //       //disable previous policy status new
  //     }
  //     if (Type == "Yes") {
  //       if (this.OfflineQuoteForm.value["IsNewVehicle"] != "New") {
  //         Previous_expirydate.setValidators([Validators.required]);
  //         IsClaimRequest.setValidators([Validators.required]);
  //         previousinsurer.setValidators([Validators.required]);
  //         PreviousPolicyPdf.setValidators([Validators.required]);
  //         NCBProtection.setValidators([Validators.required]);
  //         OwnerChange.setValidators([Validators.required]);

  //         NCBProtection.enable();
  //         OwnerChange.enable();

  //         Previous_expirydate.enable();
  //         lastyearncb.enable();
  //         IsClaimRequest.enable();
  //         previousinsurer.enable();
  //         PreviousPolicyPdf.enable();

  //         if (this.OfflineQuoteForm.value["IsNewVehicle"].value == "Renewal") {
  //           PreviousPolicyPdf.disable();
  //           PreviousPolicyPdf.setValidators(null);
  //         }
  //       }
  //     }

  //     Previous_expirydate.updateValueAndValidity();

  //     previousinsurer.updateValueAndValidity();
  //     PreviousPolicyPdf.updateValueAndValidity();
  //     OwnerChange.updateValueAndValidity();
  //     IsClaimRequest.updateValueAndValidity();
  //     lastyearncb.updateValueAndValidity();
  //     NCBProtection.updateValueAndValidity();
  //   });

  //   this.OfflineQuoteForm.get("PolicyTypeId").valueChanges.subscribe((Type) => {
  //     if (Type == "3") {
  //       TPexpirydate.setValidators([Validators.required]);
  //       TPpolicyinsurer.setValidators([Validators.required]);
  //       TPpolicynumber.setValidators([Validators.required]);
  //       this.OfflineQuoteForm.get("IsPyp").setValue("Yes");
  //       this.OfflineQuoteForm.get("IsNewVehicle").setValue("Rollover");

  //       // IsNewVehicle.disable();
  //     } else if (Type == "1") {
  //       Tenure_Comprehensive.setValidators([Validators.required]);

  //       TPexpirydate.setValidators(null);
  //       TPpolicyinsurer.setValidators(null);
  //       TPpolicynumber.setValidators(null);
  //     } else {
  //       // IsNewVehicle.enable();

  //       TPexpirydate.setValidators(null);
  //       TPpolicyinsurer.setValidators(null);
  //       TPpolicynumber.setValidators(null);
  //     }

  //     TPexpirydate.updateValueAndValidity();
  //     TPpolicynumber.updateValueAndValidity();
  //     TPpolicyinsurer.updateValueAndValidity();

  //     this.clickDontknow(this.OfflineQuoteForm.value["PolicyTypeId"]);
  //   });

  //   // this.OfflineQuoteForm.get("PolicyTypeId").valueChanges.subscribe(
  //   //   (Type) => {}
  //   // );

  //   // this.OfflineQuoteForm.get("VehicleTypeId").valueChanges.subscribe(
  //   //   (Type) => {
  //   //     this.OfflineQuoteForm.get("PolicyTypeId").setValue("1");
  //   //     this.OfflineQuoteForm.get("IsNewVehicle").setValue("New");
  //   //   }
  //   // );
  // }

  // AddonsData() {
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "Offlinequote/GetAddon?User_Id=" +
  //         this.api.GetUserData("Id") +
  //         "&User_Type=" +
  //         this.api.GetUserType()
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["Status"] == true) {
  //           this.Addons = result["Addon"];
  //         } else {
  //           this.api.Toast("Warning", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

  handleRadioChange(value: string) {
    const make = this.OfflineQuoteForm.get("make");
    const model = this.OfflineQuoteForm.get("model");
    const fuel_typedyn = this.OfflineQuoteForm.get("fuelType");
    const variant = this.OfflineQuoteForm.get("variant");
    const registration_years = this.OfflineQuoteForm.get("registration_years");

    if (value == "Normal") {
      make.setValidators([Validators.required]);
      model.setValidators([Validators.required]);
      fuel_typedyn.setValidators([Validators.required]);
      variant.setValidators([Validators.required]);
      registration_years.setValidators([Validators.required]);
    }

    if (value == "Vintage") {
      this.dataArr12 = [];

      this.OfflineQuoteForm.get("make").setValue("");
      this.OfflineQuoteForm.get("model").setValue("");
      this.OfflineQuoteForm.get("fuelType").setValue("");
      this.OfflineQuoteForm.get("variant").setValue("");
      this.OfflineQuoteForm.get("registration_years").setValue("");

      make.setValidators(null);
      model.setValidators(null);
      fuel_typedyn.setValidators(null);
      variant.setValidators(null);
      registration_years.setValidators(null);
    }

    if (value == "Bharat Series") {
      this.dataArr12 = [];

      this.OfflineQuoteForm.get("make").setValue("");
      this.OfflineQuoteForm.get("model").setValue("");
      this.OfflineQuoteForm.get("fuelType").setValue("");
      this.OfflineQuoteForm.get("variant").setValue("");
      this.OfflineQuoteForm.get("registration_years").setValue("");

      make.setValidators([Validators.required]);
      model.setValidators([Validators.required]);
      fuel_typedyn.setValidators([Validators.required]);
      variant.setValidators([Validators.required]);
      registration_years.setValidators([Validators.required]);
    }

    make.updateValueAndValidity();
    model.updateValueAndValidity();
    fuel_typedyn.updateValueAndValidity();
    variant.updateValueAndValidity();
    registration_years.updateValueAndValidity();
  }

  customerDetailFunction(value: string) {
    const customername = this.OfflineQuoteForm.get("customername");
    const customeremail = this.OfflineQuoteForm.get("customeremail");
    const customermobileno = this.OfflineQuoteForm.get("CustomerMobileNo");

    if (value == "Yes") {
      customername.setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z ]*$"),
      ]);
      customeremail.setValidators([
        Validators.pattern(
          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$"
        ),
      ]);
      customermobileno.setValidators([
        Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    }
    if (value == "No") {
      customername.setValidators(null);
      customeremail.setValidators(null);
      customermobileno.setValidators(null);
    }

    customername.updateValueAndValidity();
    customeremail.updateValueAndValidity();
    customermobileno.updateValueAndValidity();
  }

  clickDontknow(event) {
    const IsClaimRequest = this.OfflineQuoteForm.get("IsClaimRequest");
    const NCBProtection = this.OfflineQuoteForm.get("NCBProtection");
    const OwnerChange = this.OfflineQuoteForm.get("OwnerChange");
    const lastyearncb = this.OfflineQuoteForm.get("lastyearncb");

    if (event == 2) {
      IsClaimRequest.setValidators(null);
      NCBProtection.setValidators(null);
      OwnerChange.setValidators(null);
      lastyearncb.setValidators(null);

      IsClaimRequest.disable();
      NCBProtection.disable();
      OwnerChange.disable();
      lastyearncb.disable();
    } else {
      this.OfflineQuoteForm.get("IsPyp").valueChanges.subscribe((Type) => {
        if (Type == "No") {
          IsClaimRequest.setValidators(null);
          NCBProtection.setValidators(null);
          OwnerChange.setValidators(null);

          lastyearncb.setValidators(null);

          lastyearncb.disable();
          IsClaimRequest.disable();

          NCBProtection.disable();
          OwnerChange.disable();

          //disable previous policy status new
        }
        if (Type == "Yes") {
          if (this.OfflineQuoteForm.value["IsNewVehicle"] != "New") {
            lastyearncb.setValidators(null);
            IsClaimRequest.setValidators([Validators.required]);
            NCBProtection.setValidators([Validators.required]);
            OwnerChange.setValidators([Validators.required]);

            NCBProtection.enable();
            OwnerChange.enable();

            lastyearncb.enable();
            IsClaimRequest.enable();
          }
        }
      });
    }

    OwnerChange.updateValueAndValidity();
    IsClaimRequest.updateValueAndValidity();
    lastyearncb.updateValueAndValidity();

    NCBProtection.updateValueAndValidity();
  }

  FileType_Status2() {
    const Previous_expirydate = this.OfflineQuoteForm.get("Pypexpirydate");
    const IsClaimRequest = this.OfflineQuoteForm.get("IsClaimRequest");
    const NCBProtection = this.OfflineQuoteForm.get("NCBProtection");
    const OwnerChange = this.OfflineQuoteForm.get("OwnerChange");

    const lastyearncb = this.OfflineQuoteForm.get("lastyearncb");
    const previousinsurer = this.OfflineQuoteForm.get("previousinsurer");

    //for saod start
    const TPexpirydate = this.OfflineQuoteForm.get("TPexpirydate");
    const TPpolicynumber = this.OfflineQuoteForm.get("TPpolicynumber");
    const TPpolicyinsurer = this.OfflineQuoteForm.get("TPpolicyinsurer");
    const IsPyp = this.OfflineQuoteForm.get("IsPyp");
    const Tenure_Comprehensive = this.OfflineQuoteForm.get(
      "Tenure_Comprehensive"
    );
    const IsNewVehicle = this.OfflineQuoteForm.get("IsNewVehicle");
    const PreviousPolicyPdf = this.OfflineQuoteForm.get("PreviousPolicyPdf");

    const RcFront = this.OfflineQuoteForm.get("RcFront");
    //end

    this.OfflineQuoteForm.get("IsPyp").valueChanges.subscribe((Type) => {
      if (Type == "No") {
        Previous_expirydate.setValidators(null);
        IsClaimRequest.setValidators(null);
        NCBProtection.setValidators(null);
        OwnerChange.setValidators(null);

        lastyearncb.setValidators(null);
        previousinsurer.setValidators(null);
        PreviousPolicyPdf.setValidators(null);

        Previous_expirydate.disable();

        lastyearncb.disable();
        IsClaimRequest.disable();

        NCBProtection.disable();
        OwnerChange.disable();
        previousinsurer.disable();
        PreviousPolicyPdf.disable();
        RcFront.enable();
        RcFront.setValidators([Validators.required]);
        //disable previous policy status new
      }
      if (Type == "Yes") {
        if (this.OfflineQuoteForm.value["IsNewVehicle"] != "New") {
          Previous_expirydate.setValidators([Validators.required]);
          IsClaimRequest.setValidators([Validators.required]);
          previousinsurer.setValidators([Validators.required]);
          PreviousPolicyPdf.setValidators([Validators.required]);
          NCBProtection.setValidators([Validators.required]);
          OwnerChange.setValidators([Validators.required]);

          NCBProtection.enable();
          OwnerChange.enable();

          Previous_expirydate.enable();
          lastyearncb.enable();
          IsClaimRequest.enable();
          previousinsurer.enable();
          PreviousPolicyPdf.enable();
        }
      }

      Previous_expirydate.updateValueAndValidity();
      RcFront.updateValueAndValidity();

      previousinsurer.updateValueAndValidity();
      PreviousPolicyPdf.updateValueAndValidity();
      OwnerChange.updateValueAndValidity();
      IsClaimRequest.updateValueAndValidity();
      lastyearncb.updateValueAndValidity();
      NCBProtection.updateValueAndValidity();
      NCBProtection.updateValueAndValidity();
    });

    this.OfflineQuoteForm.get("PolicyTypeId").valueChanges.subscribe((Type) => {
      if (Type == "3") {
        TPexpirydate.setValidators([Validators.required]);
        TPpolicyinsurer.setValidators([Validators.required]);
        TPpolicynumber.setValidators([Validators.required]);
        this.OfflineQuoteForm.get("IsPyp").setValue("Yes");
        this.OfflineQuoteForm.get("IsNewVehicle").setValue("Rollover");

        // IsNewVehicle.disable();
      } else if (Type == "1") {
        Tenure_Comprehensive.setValidators([Validators.required]);

        TPexpirydate.setValidators(null);
        TPpolicyinsurer.setValidators(null);
        TPpolicynumber.setValidators(null);
      } else {
        // IsNewVehicle.enable();

        TPexpirydate.setValidators(null);
        TPpolicyinsurer.setValidators(null);
        TPpolicynumber.setValidators(null);
      }

      TPexpirydate.updateValueAndValidity();
      TPpolicynumber.updateValueAndValidity();
      TPpolicyinsurer.updateValueAndValidity();

      this.clickDontknow(this.OfflineQuoteForm.value["PolicyTypeId"]);
    });

    // this.OfflineQuoteForm.get("PolicyTypeId").valueChanges.subscribe(
    //   (Type) => {}
    // );

    // this.OfflineQuoteForm.get("VehicleTypeId").valueChanges.subscribe(
    //   (Type) => {
    //     this.OfflineQuoteForm.get("PolicyTypeId").setValue("1");
    //     this.OfflineQuoteForm.get("IsNewVehicle").setValue("New");
    //   }
    // );
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   //   console.log(this.selectedFiles);
      //   //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        //   //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "RC_Motor_Front") {
            this.OfflineQuoteForm.get("RcFront").setValue("");
            this.RC_Motor_Front_image = 0;
          }

          if (Type == "RC_Motor_Back") {
            this.OfflineQuoteForm.get("RcBack").setValue("");
            this.RC_Motor_Back_image = 0;
          }

          if (Type == "Previous_Policy_Pdf") {
            this.OfflineQuoteForm.get("PreviousPolicyPdf").setValue("");
            this.Previous_Policy_Pdf_image = 0;
          }

          if (Type == "Invoice") {
            this.OfflineQuoteForm.get("InvoiceImage").setValue("");
            this.Invoice_image = 0;
          }

          if (Type == "Other") {
            this.OfflineQuoteForm.get("OtherDocument").setValue("");
            this.Other_image = 0;
          }

          if (Type == "Pan_image") {
            this.OfflineQuoteForm.get("Pan_image").setValue("");
            this.Pan_image = 0;
          }

          if (Type == "aadhar_image_back") {
            this.OfflineQuoteForm.get("aadhaar_document_back").setValue("");
            this.aadhar_image_back = 0;
          }

          if (Type == "aadhar_image_front") {
            this.OfflineQuoteForm.get("aadhaar_document_front").setValue("");
            this.aadhar_image_front = 0;
          }
        } else {
          if (Type == "RC_Motor_Front") {
            this.RC_Motor_Front = this.selectedFiles;

            this.RC_Motor_Front_image = 1;
          }

          if (Type == "RC_Motor_Back") {
            this.RC_Motor_Back = this.selectedFiles;
            this.RC_Motor_Back_image = 1;
          }
          if (Type == "Previous_Policy_Pdf") {
            this.Previous_Policy_Pdf = this.selectedFiles;
            this.Previous_Policy_Pdf_image = 1;
          }
          if (Type == "Invoice") {
            this.Invoice = this.selectedFiles;
            this.Invoice_image = 1;
          }
          if (Type == "Other") {
            this.Other = this.selectedFiles;
            this.Other_image = 1;
          }

          if (Type == "Pan_image") {
            this.Pan = this.selectedFiles;
            this.Pan_image = 1;
          }
          if (Type == "aadhar_image_back") {
            this.Aadhaar_Back = this.selectedFiles;
            this.aadhar_image_back = 1;
          }

          if (Type == "aadhar_image_front") {
            this.Aadhaar_Front = this.selectedFiles;
            this.aadhar_image_front = 1;
          }
        }
      } else {
        //   //   //   console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  get formControls() {
    return this.OfflineQuoteForm.controls;
  }

  AddOfflineQuote() {
    // alert(this.Divshow);

    var fields = this.OfflineQuoteForm.value;
    //   //   //   console.log(this.RenewalDocs);
    //   //   //   console.log(this.OfflineQuoteForm);

    this.isSubmitted = true;
    //   //   //   console.log(this.OfflineQuoteForm.invalid);

    if (this.OfflineQuoteForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      var fields = this.OfflineQuoteForm.value;

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("login_role_id", JSON.stringify(fields["login_role_id"]));
      formData.append(
        "login_role_type",
        JSON.stringify(fields["login_role_type"])
      );
      formData.append("QuoteSource", JSON.stringify(fields["QuoteSource"]));
      formData.append(
        "EmployeeMappingPerson",
        JSON.stringify(fields["EmployeeMappingPerson"])
      );

      formData.append("Divshow", this.Divshow);

      formData.append("customername", fields["customername"]);
      formData.append("customeremail", fields["customeremail"]);
      formData.append("customermobileno", fields["customermobileno"]);
      formData.append("VehicleTypeId", fields["VehicleTypeId"]);
      formData.append("PolicyTypeId", fields["PolicyTypeId"]);
      formData.append("IsNewVehicle", fields["IsNewVehicle"]);
      formData.append("RegistrationDate", fields["RegistrationDate"]);
      formData.append(
        "Registration_State_Code",
        fields["Registration_State_Code"]
      );
      formData.append(
        "Registration_District_Code",
        fields["Registration_District_Code"]
      );
      formData.append(
        "Registration_City_Code",
        fields["Registration_City_Code"]
      );

      formData.append("Registration_Code", fields["Registration_Code"]);

      formData.append("VintageNumber", fields["VintageNumber"]);
      formData.append("RegistrationNo", fields["RegistrationNo"]);
      formData.append("IsPyp", fields["IsPyp"]);
      formData.append("Pypexpirydate", fields["Pypexpirydate"]);

      formData.append("IsClaimRequest", fields["IsClaimRequest"]);
      formData.append("OwnerChange", fields["OwnerChange"]);
      formData.append("NcbProtection", fields["NCBProtection"]);
      formData.append("customerDetail", fields["customerDetail"]);

      formData.append(
        "previousinsurer",
        JSON.stringify(fields["previousinsurer"])
      );
      formData.append("lastyearncb", fields["lastyearncb"]);
      formData.append("IsBestQuote", fields["IsBestQuote"]);
      formData.append(
        "requiredinsurer",
        JSON.stringify(fields["requiredinsurer"])
      );
      formData.append(
        "requiredaddons",
        JSON.stringify(fields["requiredaddons"])
      );

      formData.append("idvlowestvalue", fields["idvlowestvalue"]);
      formData.append("idvhighestvalue", fields["idvhighestvalue"]);
      formData.append("RcFront", this.RC_Motor_Front);
      formData.append("RcBack", this.RC_Motor_Back);
      formData.append("InvoiceImage", this.Invoice);
      formData.append("PreviousPolicyPdf", this.Previous_Policy_Pdf);
      formData.append("OtherDocument", this.Other);

      formData.append("pan_document", this.Pan);

      formData.append("Aadhaar_Back", this.Aadhaar_Back);
      formData.append("Aadhaar_Front", this.Aadhaar_Front);

      // formData.append("aadhaar_document", this.Aadhaar);

      formData.append("remark", fields["remark"]);
      formData.append("TPexpirydate", fields["TPexpirydate"]);
      formData.append("TPpolicynumber", fields["TPpolicynumber"]);

      formData.append("make", JSON.stringify(fields["make"]));
      formData.append("model", JSON.stringify(fields["model"]));
      formData.append("fuel_type", JSON.stringify(fields["fuelType"]));
      formData.append("variant", JSON.stringify(fields["variant"]));
      formData.append(
        "registration_years",
        JSON.stringify(fields["registration_years"])
      );

      formData.append("Source", "Web");
      formData.append(
        "TPpolicyinsurer",
        JSON.stringify(fields["TPpolicyinsurer"])
      );

      formData.append(
        "Tenure_Comprehensive",
        JSON.stringify(fields["Tenure_Comprehensive"])
      );
      formData.append("RenewalDocs", JSON.stringify(this.RenewalDocs));

      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("Offlinequote/Submit", formData).then(
        (result) => {
          this.api.HideLoading();

          //   //   //   console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.buttonDisable = false;
            // alert(this.Divshow )
            if (result["TempVal"] == "1") {
              // alert(123);
              this.router.navigate([
                "manage-requests/view-offline-quote/" + result["quotation_id"],
              ]);

              return false;
            } else {
              this.router.navigate(["offline-quote/view-requests"]);
            }

            // if(this.Divshow == '1'){

            // }else{
            //   // this.router.navigate(["offline-quote/view-requests"]);

            // }
          } else {
            this.buttonDisable = false;
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.buttonDisable = false;

          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  FilterData(item: any) {
    if (item != 1 && item != "OneByOneDeSelect") {
      this.EmployeeMappingPersonval = item;
    }

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("empType", this.empType);

    var fields = this.OfflineQuoteForm.value;

    formData.append("login_role_type", fields["login_role_type"][0]["Id"]);

    formData.append(
      "SelectedEmployee",
      JSON.stringify(fields["EmployeeMappingPerson"])
    );

    this.MappingPerson = [];
    if (item != "OneByOneDeSelect") {
      // formData.append("login_type",  );

      // console.log(formData);

      this.api.IsLoading();
      this.api
        .HttpPostType("Offlinequote/MappingViaSearviceLocation1", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            //   //   //   console.log(result);

            if (result["status"] == 1) {
              // this.api.Toast("Success", result["msg"]);

              this.EmployeeMappingPersonData =
                result["EmployeeMappingPersonData"];

              this.MappingPerson = result["Data"];
            } else {
              const msg = "msg";
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

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var item = item.Id;
    // console.log(item.Id);
    if (Type == "login_role_type") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterData(item);

      if (item == "Agent" || item == "Sp") {
        this.OfflineQuoteForm.get("login_role_id").setValidators([
          Validators.required,
        ]);
        this.OfflineQuoteForm.get("login_role_id").setValue("");
      } else {
        this.OfflineQuoteForm.get("login_role_id").setValue("");
        this.OfflineQuoteForm.get("login_role_id").setValidators(null);
      }
      this.OfflineQuoteForm.get("login_role_id").updateValueAndValidity();
    }
    if (Type == "EmployeeMappingPerson") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.OfflineQuoteForm.get("login_role_id").setValue("");
      this.OfflineQuoteForm.get("login_role_id").updateValueAndValidity();
      this.FilterData(1);
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "login_role_type") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.EmployeeMappingPersonval = "";

      this.FilterData("OneByOneDeSelect");
      this.OfflineQuoteForm.get("login_role_id").setValidators(null);
      this.OfflineQuoteForm.get("login_role_id").updateValueAndValidity();
    }
    if (Type == "EmployeeMappingPerson") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.OfflineQuoteForm.get("login_role_id").setValue("");
      this.OfflineQuoteForm.get("login_role_id").updateValueAndValidity();

      this.FilterData("OneByOneDeSelect");
    }
  }

  CheckCreaterRights() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Url", this.currentUrl);

    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/CheckRights", formData).then(
      (result) => {
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

  AutoTabRegistrationNo(input, maxLength, libAutoTab) {
    const length = input.target.value.length;

    if (length >= maxLength && libAutoTab) {
      const field = document.getElementById(libAutoTab);
      if (field) {
        field.focus();
      }
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect11(Type: any) {
    //Vertical

    if (Type == "Make") {
      this.OfflineQuoteForm.get("model").setValue("");
      this.OfflineQuoteForm.get("variant").setValue("");
      this.OfflineQuoteForm.get("fuelType").setValue("");

      this.searchModels();
      this.searchVariants();
      this.searchFuelType();
    }

    if (Type == "Model") {
      this.OfflineQuoteForm.get("fuelType").setValue("");
      this.OfflineQuoteForm.get("variant").setValue("");

      this.searchVariants();
      this.searchFuelType();
    }

    if (Type == "Fuel") {
      this.OfflineQuoteForm.get("variant").setValue("");

      this.searchVariants();
      this.searchFuelType();
    }

    //  this.FilterModal(item);
  }

  MakeModelChange(Type: any) {
    if (Type == "Make") {
      this.OfflineQuoteForm.get("model").setValue("");
      this.OfflineQuoteForm.get("variant").setValue("");
      this.OfflineQuoteForm.get("fuelType").setValue("");
    }

    if (Type == "Model") {
      this.OfflineQuoteForm.get("fuelType").setValue("");
      this.OfflineQuoteForm.get("variant").setValue("");
    }

    if (Type == "Fuel") {
      this.OfflineQuoteForm.get("variant").setValue("");
    }
  }

  GetRenewalFields() {
    var Renewal_Policy_Vehicle_No: any = "";
    let p = prompt("Please enter Renewal Policy/Vehicle No.", "");
    const PreviousPolicyPdf = this.OfflineQuoteForm.get("PreviousPolicyPdf");

    const RcFront = this.OfflineQuoteForm.get("RcFront");
    // console.log(p);
    if (p == null || p == "") {
      this.OfflineQuoteForm.get("IsNewVehicle").setValue(null);
      this.OfflineQuoteForm.get("IsNewVehicle").updateValueAndValidity();
      return false;
    } else {
      Renewal_Policy_Vehicle_No = p;
    }

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Renewal_Policy_Vehicle_No", Renewal_Policy_Vehicle_No);

    // console.log(formData);
    this.api.IsLoading();
    this.api
      .HttpPostType("Offlinequote/GetVehicleDetailsByRenewal", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          //   //   //   console.log(result);

          if (result["status"] == 1) {
            //   //   //   console.log(result.data);

            this.dataArr12 = result.data;

            this.RenewalDocs = this.dataArr12.Sr_Docs;

            // alert(this.RenewalDocs);

            // console.log(this.RenewalDocs);

            this.OfflineQuoteForm.get("VintageNumber").setValue(
              this.dataArr12.VintageNumber
            );
            this.OfflineQuoteForm.get("customerDetail").setValue("Yes");
            this.OfflineQuoteForm.get("IsPyp").setValue("Yes");
            this.clickDontknow("Yes");

            this.OfflineQuoteForm.get("Pypexpirydate").setValue(
              this.dataArr12.Policy_End_Date_OD
            );
            this.Selectedpreviousinsurer = this.dataArr12.previousinsurer;

            // this.OfflineQuoteForm.get("previousinsurer").setValue(
            //   this.dataArr12.previousinsurer
            // );

            if (this.dataArr12.VintageNumber == "Normal") {
              this.OfflineQuoteForm.get("Registration_State_Code").setValue(
                this.dataArr12.Registration_State_Code
              );

              this.OfflineQuoteForm.get("Registration_District_Code").setValue(
                this.dataArr12.Registration_District_Code
              );

              this.OfflineQuoteForm.get("Registration_City_Code").setValue(
                this.dataArr12.Registration_City_Code
              );

              this.OfflineQuoteForm.get("Registration_Code").setValue(
                this.dataArr12.Registration_Code
              );
            } else {
              this.OfflineQuoteForm.get("RegistrationNo").setValue(
                this.dataArr12.Registration_No
              );
            }

            this.SelectedmakeName = this.dataArr12.make;
            this.SelectedregYearName = this.dataArr12.reg_year;

            this.SelectedCustomername = this.dataArr12.Customername;
            this.SelectedCustomermobile = this.dataArr12.Customermobile;
            this.SelectedCustomeremail = this.dataArr12.Customeremail;

            this.OfflineQuoteForm.get("VehicleTypeId").setValue(
              this.dataArr12.VechileType
            );
            this.Changegaditype(this.dataArr12.VechileType);

            this.OfflineQuoteForm.get("RegistrationDate").setValue(
              this.dataArr12.registration_date
            );

            this.OfflineQuoteForm.get("IsBestQuote").setValue("Yes");

            this.Changegaditype(this.dataArr12.VechileType);

            if (this.dataArr12.make != "") {
              this.searchModels();
            }

            if (this.OfflineQuoteForm.value["IsNewVehicle"] == "Renewal") {
              PreviousPolicyPdf.disable();
              PreviousPolicyPdf.setValidators(null);

              RcFront.enable();
              RcFront.setValidators([Validators.required]);
            } else {
              RcFront.enable();
              RcFront.setValidators([Validators.required]);
            }

            PreviousPolicyPdf.updateValueAndValidity();
            RcFront.updateValueAndValidity();
          } else {
            RcFront.enable();
            RcFront.setValidators([Validators.required]);

            this.FileType_Status2();
            RcFront.updateValueAndValidity();
            const msg = "msg";
            var r = confirm("Enter Policy/Vehicle No. Not Matched");
            if (r == true) {
              let currentUrl = this.router.url;
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = "reload";
              this.router.navigate([currentUrl]);
            }
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";

          var r = confirm("Enter Policy/Vehicle No. Not Matched");
          if (r == true) {
            let currentUrl = this.router.url;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = "reload";
            this.router.navigate([currentUrl]);

            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        }
      );
  }

  GetVehicleDetails() {
    const formData = new FormData();
    const fields = this.OfflineQuoteForm.value;

    formData.append(
      "Registration_State_Code",
      fields["Registration_State_Code"]
    );
    formData.append(
      "Registration_District_Code",
      fields["Registration_District_Code"]
    );
    formData.append("Registration_City_Code", fields["Registration_City_Code"]);
    formData.append("Registration_Code", fields["Registration_Code"]);

    // Make a POST request to your API

    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/GetVehicleDetailsByReg", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.dataArr12 = result.data;

          this.SelectedmakeName = this.dataArr12.make;
          this.SelectedregYearName = this.dataArr12.reg_year;

          this.SelectedCustomername = this.dataArr12.Customername;
          this.SelectedCustomermobile = this.dataArr12.Customermobile;
          this.SelectedCustomeremail = this.dataArr12.Customeremail;

          this.OfflineQuoteForm.get("VehicleTypeId").setValue(
            this.dataArr12.VechileType
          );

          this.Changegaditype(this.dataArr12.VechileType);
          this.OfflineQuoteForm.get("RegistrationDate").setValue(
            this.dataArr12.registration_date
          );

          if (this.OfflineQuoteForm.get("IsNewVehicle").value == "Used") {
            this.clickDontknow("No");
          } else {
            this.OfflineQuoteForm.get("IsPyp").setValue("Yes");
            this.clickDontknow("Yes");
            this.OfflineQuoteForm.get("Pypexpirydate").setValue(
              this.dataArr12.policy_expiery_date
            );

            this.OfflineQuoteForm.get("NCBProtection").setValue("No");

            this.OfflineQuoteForm.get("OwnerChange").setValue("No");
          }

          this.Selectedpreviousinsurer = this.dataArr12.Previousinsurar;

          this.OfflineQuoteForm.get("IsBestQuote").setValue("Yes");

          if (this.dataArr12.make != "") {
            this.searchModels();
          }
        } else {
          this.SelectedmakeName = "";
          this.SelectedregYearName = "";

          this.SelectedCustomername = "";
          this.SelectedCustomermobile = "";
          this.SelectedCustomeremail = "";

          this.OfflineQuoteForm.get("VehicleTypeId").setValue("");

          this.Changegaditype("");
          this.OfflineQuoteForm.get("RegistrationDate").setValue("");

          this.OfflineQuoteForm.get("IsPyp").setValue("");

          this.OfflineQuoteForm.get("Pypexpirydate").setValue("");

          this.OfflineQuoteForm.get("NCBProtection").setValue("");

          this.OfflineQuoteForm.get("OwnerChange").setValue("");

          this.OfflineQuoteForm.get("IsBestQuote").setValue("");

          const msg = "msg";
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
