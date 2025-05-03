import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { empty } from "rxjs";

@Component({
  selector: "app-create-survey",
  templateUrl: "./create-survey.component.html",
  styleUrls: ["./create-survey.component.css"],
})
export class CreateSurveyComponent implements OnInit {
  createSurveyForm: FormGroup;
  isSubmitted = false;
  butDisabled = false;
  surveyData: any = [];
  currentUrl: any = "";
  loginId: any = "";
  loginType: any = "";
  mainOption: any = "";
  subOption: any = "";
  rightType: any = "";
  pincodeData: any = [];
  employeeData: any = [];
  agentData: any = [];
  insurerData: any = [];
  productData: any = [];
  PincodData_Ar: any = [];
  makeData: any = [];
  modelData: any = [];
  fuelData: any = [];

  variantData: any = [];
  manufactureYearData: any = [];
  employeeMobile: any = "";
  agentMobile: any = "";
  selectedFiles: File;
  rcFront: File;
  rcBack: File;
  quotationDoc: File;

  showPolicySrBox = "Policy";

  policySrValue: any = "";
  productValue: any = "";
  makeValue: any = "";
  modelValue: any = "";
  variantValue: any = "";
  insurerValue: any = "";
  manufactureYearValue: any = "";
  registrationValue: any = "";
  rtoValue: any = "";
  chassisNoValue: any = "";
  engineNoValue: any = "";

  empName: any = "";
  empMobile: any = "";
  posName: any = "";
  posMobile: any = "";

  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};
  dropdownSettingsType1: any = {};

  statusData: any = [];
  statuss: any = "";
  statusRemarks: any = "";

  selectedSurveyType: any = [];
  selectedPincode: any;
  selectedProduct: any;
  selectedMake: any;
  selectedModel: any;
  selectedVariant: any;
  selectedFuel: any;
  selectedInsurer: any;
  // selectedMF: any;
  selectedStatus: any;

  quoteId: any = "";
  surveyPurpose: any;
  curStatus: any;
  endorsementId: any = "";
  inspectionModeData: { Id: string; Name: string }[];
  dataType: string;

  RC_Motor_Front_image: any = 0;
  RC_Motor_Back_image: any = 0;
  Quotation_Doc_image: any = 0;
  fuelValue: any;
  QuoteSourceData: { Id: string; Name: string }[];
  MappingType: { Id: string; Name: string }[];
  Divshow: any;
  MappingPerson: { Id: string; Name: string }[];
  EmployeeMappingPersonval: string;
  EmployeeMappingPersonData: any;
  dataArr12: any;
  // SelectedmakeName: any;
  SelectedregYearName: any;
  SelectedCustomername: any;
  SelectedCustomermobile: any;
  SelectedCustomeremail: any;
  Selectedpreviousinsurer: any;
  SelecteVechileType: any;
  // SelecteVechileTypeData:[{Id:'ID', Name: 'Name'}];
  SelecteVechileTypeData: [{ Id: string; Name: string }];
  selectedMF: [{ Id: number; Name: number }];
  SelectedmakeName: [{ Id: string; Name: string }];
  SelectedmodalName: [{ Id: string; Name: string }];
  SelectedfuleType: [{ Id: string; Name: string }];
  SelectedPreviousinsurar: [{ Id: string; Name: string }];

  // sumbit image form fild
  imageForm: any;
  ImageForm: FormGroup;
  selectedImage: File;
  RC_Motor_Front: File;
  front_car_image: File;
  front_car_image_color: any = 0;

  car_left_image_color: any = 0;
  car_left_image: File;

  car_right_image_color: any = 0;
  car_right_image: File;

  car_back_image_color: any = 0;
  car_back_image: File;
  vehicle_chassis_color: any = 0;
  vehicle_chassis: File;

  vehicle_engine_department_color: any = 0;
  vehicle_engine_department: File;

  undercarriage_color: any = 0;
  undercarriage: File;

  front_mirror_color: any = 0;
  front_mirror: File;

  inside_mirror_color: any = 0;
  inside_mirror: File;

  vehicle_meter_color: any = 0;
  vehicle_meter: File;

  myself_and_car_color: any = 0;
  myself_and_car: File;

  One_minute_car_video_color: any = 0;
  One_minute_car_video: File;

  last_meter_color: any = 0;
  last_meter: File;
  Back_left_color: any = 0;
  Back_left: File;
  Back_Right_color: any = 0;
  Back_Right: File;
  Cabin_color: any = 0;
  Cabin: File;
  Open_dicky_color: any = 0;
  Open_dicky: File;
  Right_color: any = 0;
  Right: File;
  Left_color: any = 0;
  Left: File;

  RC_photo_color: any = 0;
  RC_photo: File;
  mymeenimage_url: any;

  front_car_image_ImageUrl: string | ArrayBuffer;
  car_left_image_ImageUrl: string | ArrayBuffer;
  car_right_image_ImageUrl: string | ArrayBuffer;
  car_back_image_ImageUrl: string | ArrayBuffer;
  vehicle_chassis_ImageUrl: string | ArrayBuffer;
  vehicle_engine_department_ImageUrl: string | ArrayBuffer;
  undercarriage_ImageUrl: string | ArrayBuffer;
  front_mirror_ImageUrl: string | ArrayBuffer;
  inside_mirror_ImageUrl: string | ArrayBuffer;
  vehicle_meter_ImageUrl: string | ArrayBuffer;
  myself_and_car_ImageUrl: string | ArrayBuffer;
  One_minute_car_video_ImageUrl: string | ArrayBuffer;
  last_meter_ImageUrl: string | ArrayBuffer;
  Back_left_ImageUrl: string | ArrayBuffer;
  Back_Right_ImageUrl: string | ArrayBuffer;
  Cabin_ImageUrl: string | ArrayBuffer;
  Open_dicky_ImageUrl: string | ArrayBuffer;
  Right_ImageUrl: string | ArrayBuffer;
  Left_ImageUrl: string | ArrayBuffer;
  RC_photo_ImageUrl: string | ArrayBuffer;
  model_open: 0;
  Chack_video_photo: any;
  enable_value: any;
  registrationValues: any;

  // end

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) {
    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();
    this.currentUrl = this.router.url;
    this.Divshow = 0;

    //Check Add page Or Edit Page
    var splitted = this.currentUrl.split("/");
    if (
      typeof splitted[2] != "undefined" &&
      typeof splitted[3] != "undefined" &&
      splitted[2] == "edit-requests" &&
      splitted[3] != ""
    ) {
      this.endorsementId = splitted[3];
      this.dataType = "Endorsement";
    }
    //Get Quotation ID
    if (
      typeof splitted[2] != "undefined" &&
      typeof splitted[3] != "undefined" &&
      splitted[2] == "create-requests" &&
      splitted[3] != ""
    ) {
      this.quoteId = splitted[3];
      this.dataType = "Quotation";
    }

    this.inspectionModeData = [
      { Id: "1", Name: "Self" },
      { Id: "2", Name: "Agency" },
    ];
    this.statusData = [
      { Id: 0, Name: "Pending" },
      { Id: 1, Name: "In Process" },
      { Id: 2, Name: "Recommended" },
      { Id: 3, Name: "Reject" },
    ];

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsType1 = {
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
    };

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

    this.ImageForm = this.fb.group({
      front_car_image: [""],
      car_left_image: [""],
      car_right_image: [""],
      car_back_image: [""],
      vehicle_chassis: [""],
      vehicle_engine_department: [""],
      undercarriage: [""],
      front_mirror: [""],
      inside_mirror: [""],
      vehicle_meter: [""],
      myself_and_car: [""],
      One_minute_car_video: [""],
      last_meter: [""],
      Back_left: [""],
      Back_Right: [""],
      Cabin: [""],
      Open_dicky: [""],
      Right: [""],
      Left: [""],
      RC_photo: [""],
    });
    this.createSurveyForm = this.formBuilder.group({
      login_role_id: [""],
      login_role_type: [""],
      QuoteSource: [""],
      EmployeeMappingPerson: [""],
      Registration_State_Code: [""],
      Registration_District_Code: [""],
      RegistrationNo: [""],
      // Registration_City_Code: [{ value: "" }],
      Registration_City_Code: [""],
      // Registration_Code: [{ value: "" }],
      Registration_Code: [""],

      customerName: ["", [Validators.required]],
      customerEmail: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
          ),
        ],
      ],
      customerEmailAlt: [
        "",
        [
          Validators.pattern(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
          ),
        ],
      ],
      customerMobileNo: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        ],
      ],
      customerMobileNoAlt: [
        "",
        [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")],
      ],
      customerAddress: ["", [Validators.required]],
      customerPincode: ["", [Validators.required]],
      customerState: ["", [Validators.required]],
      customerCity: ["", [Validators.required]],
      vehicleLocation: ["", [Validators.required]],
      inspectionMode: ["", [Validators.required]],
      // employeeName: [''],
      // employeeMobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]],
      // agentName: [''],
      // agentMobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]],
      product: [""],
      make: [""],
      model: [""],
      variant: [""],
      insurerName: ["", [Validators.required]],
      registrationNo: [
        "",
        [
          Validators.pattern(
            "^[A-Za-z]{2}[0-9]{1,2}(?:[A-Za-z])?(?:[A-Za-z]*)?[0-9]{4}$"
          ),
        ],
      ],
      rto: [""],
      manufactureYear: [""],
      engineNo: ["", [Validators.pattern("^[A-Za-z0-9]{5,25}$")]],
      chassisNo: ["", [Validators.pattern("^[A-Za-z0-9]{5,25}$")]],
      RcFront: ["", [Validators.required]],
      RcBack: ["", [Validators.required]],
      quotationDoc: [""],
      remarks: ["", [Validators.required]],
      fuel: [""],
    });
  }

  //=====ngOnInit MANAGEMENT=====//
  ngOnInit() {
    this.CheckCreaterRights();
    this.getLoginUserRights();
    if (this.endorsementId != "") {
      this.showPolicySrBox = "Endosment";
      this.getSinglePolicyDetails();
    }
    this.updateValidation();
    this.searchPincodes("", 0);
    this.searchProducts();
    this.getManufactureYearData();
    // this.checkFormType();
    if (this.quoteId != "") {
      this.GetOfflineQuoteDetails();
    }
  }
  onDropdownChange(selectedValues: any) {
    //   //   //   console.log("Selected values:", selectedValues[0]["Name"]);
    // alert(selectedValues[0]['Name'])
    if (selectedValues[0]["Name"] == "Self") {
      const Self_model = document.getElementById("Self_model");
      Self_model.click();
    }
  }

  //FORM CONTROLS
  get formControls() {
    return this.createSurveyForm.controls;
  }

  //SUBMIT FORM DATA
  // CreateSurvey() {
  //   this.isSubmitted = true;
  //   var sumbit_Chack = "";
  //   if (
  //     this.createSurveyForm.value &&
  //     this.createSurveyForm.value["inspectionMode"] &&
  //     this.createSurveyForm.value["inspectionMode"].length > 0 &&
  //     this.createSurveyForm.value["inspectionMode"][0]["Name"]
  //   ) {
  //     sumbit_Chack = this.createSurveyForm.value["inspectionMode"][0]["Name"];
  //   }
  //   if (this.createSurveyForm.invalid && sumbit_Chack != "Self") {
  //     return;
  //   } else {
  //     var fields = this.createSurveyForm.value;
  //     if (fields["insurerName"] == undefined || fields["insurerName"] == '' || fields["customerEmail"] == undefined || fields["customerEmail"] == '' || fields["customerName"] == undefined || fields["customerName"] == '') {
  //       return;
  //     }

  //     const stateCode = fields["Registration_State_Code"];
  //     const districtCode = fields["Registration_District_Code"];
  //     const cityCode = fields["Registration_City_Code"];
  //     const registrationCode = fields["Registration_Code"];
  //     // console.log(this.endorsementId);
  //     if (this.endorsementId != "") {
  //       this.productValue = fields["product"];
  //       // this.insurerValue = fields["insurerName"];
  //       this.insurerValue = fields["insurerName"][0]["Id"];
  //       this.manufactureYearValue = fields["manufactureYear"];
  //       this.makeValue = fields["make"];
  //       this.modelValue = fields["model"];
  //       this.variantValue = fields["variant"];
  //       this.fuelValue = fields["fuel"];
  //       // this.registrationValue = fields["registrationNo"];
  //       this.registrationValues = `${stateCode}${districtCode}${cityCode}${registrationCode}`;
  //       this.rtoValue = fields["rto"];
  //       this.engineNoValue = fields["engineNo"];
  //       this.chassisNoValue = fields["chassisNo"];
  //     } else {
  //       // if(fields["inspectionMode"][0]["Name"] != 'Self'){
  //       // this.productValue = fields["product"][0]["Name"];
  //       this.insurerValue = fields["insurerName"][0]["Id"];
  //       // this.manufactureYearValue = fields["manufactureYear"][0]["Name"];
  //       // this.makeValue = fields["make"][0]["Name"];
  //       // this.modelValue = fields["model"][0]["Name"];
  //       // this.variantValue = fields["variant"][0]["Name"];
  //       this.fuelValue = fields["fuel"][0]["Name"];
  //       // }

  //       this.productValue = JSON.stringify(fields["product"]);
  //       // this.insurerValue = JSON.stringify(fields["insurerName"]);
  //       this.manufactureYearValue = JSON.stringify(fields["manufactureYear"]);
  //       this.makeValue = JSON.stringify(fields["make"]);
  //       this.modelValue = JSON.stringify(fields["model"]);
  //       this.variantValue = JSON.stringify(fields["variant"]);
  //       // this.fuelValue = JSON.stringify(fields["fuel"]);

  //       // this.registrationValue = fields["registrationNo"];
  //       this.registrationValues = `${stateCode}${districtCode}${cityCode}${registrationCode}`;
  //       this.rtoValue = fields["rto"];
  //       this.engineNoValue = fields["engineNo"];
  //       this.chassisNoValue = fields["chassisNo"];
  //     }

  //     if (this.endorsementId != "" || this.quoteId != "") {
  //     } else {
  //       this.empName = JSON.stringify(fields["employeeName"]);
  //       this.empMobile = fields["employeeMobileNo"];
  //       this.posName = JSON.stringify(fields["agentName"]);
  //       this.posMobile = fields["agentMobileNo"];
  //     }
  //     const formData = new FormData();
  //     // formData.append("quoteId", this.quoteId);
  //     // formData.append("endorsementId", this.endorsementId);
  //     formData.append("front_car_image", this.front_car_image);
  //     formData.append("car_left_image", this.car_left_image);
  //     formData.append("car_right_image", this.car_right_image);
  //     formData.append("car_back_image", this.car_back_image);
  //     formData.append("vehicle_chassis", this.vehicle_chassis);
  //     formData.append(
  //       "vehicle_engine_department",
  //       this.vehicle_engine_department
  //     );
  //     formData.append("undercarriage", this.undercarriage);
  //     formData.append("front_mirror", this.front_mirror);
  //     formData.append("inside_mirror", this.inside_mirror);
  //     formData.append("vehicle_meter", this.vehicle_meter);
  //     formData.append("myself_and_car", this.myself_and_car);
  //     formData.append("One_minute_car_video", this.One_minute_car_video);
  //     formData.append("last_meter", this.last_meter);
  //     formData.append("Back_left", this.Back_left);
  //     formData.append("Back_Right", this.Back_Right);
  //     formData.append("Cabin", this.Cabin);
  //     formData.append("Open_dicky", this.Open_dicky);
  //     formData.append("Right", this.Right);
  //     formData.append("Left", this.Left);
  //     // formData.append("RC_photo", this.RC_photo);
  //     formData.append("login_id", this.api.GetUserData("Id"));
  //     formData.append("login_type", this.api.GetUserType());

  //     formData.append("login_role_id", JSON.stringify(fields["login_role_id"]));
  //     formData.append(
  //       "login_role_type",
  //       JSON.stringify(fields["login_role_type"])
  //     );
  //     formData.append("QuoteSource", JSON.stringify(fields["QuoteSource"]));
  //     formData.append(
  //       "EmployeeMappingPerson",
  //       JSON.stringify(fields["EmployeeMappingPerson"])
  //     );

  //     formData.append("Divshow", this.Divshow);
  //     // formData.append("login_role_id", JSON.stringify(fields["login_role_id"]));
  //     // formData.append("login_role_type", JSON.stringify(fields["login_role_type"]));
  //     // formData.append("QuoteSource", JSON.stringify(fields["QuoteSource"]));
  //     formData.append("actionType", "Add");
  //     formData.append("quoteId", this.quoteId);
  //     formData.append("endorsementId", this.endorsementId);
  //     formData.append("loginId", this.api.GetUserData("Id"));
  //     formData.append("loginType", this.api.GetUserType());
  //     formData.append("customerName", fields["customerName"]);
  //     formData.append("customerEmail", fields["customerEmail"]);
  //     formData.append("customerEmailAlt", fields["customerEmailAlt"]);
  //     formData.append("customerMobile", fields["customerMobileNo"]);
  //     formData.append("customerMobileAlt", fields["customerMobileNoAlt"]);
  //     formData.append("customerAddress", fields["customerAddress"]);
  //     // if(fields["inspectionMode"][0]["Name"] != 'Self'){
  //     //   formData.append("pincode", fields["customerPincode"][0]["Name"]);
  //     // }
  //     formData.append("pincode", JSON.stringify(fields["customerPincode"]));
  //     formData.append("state", fields["customerState"]);
  //     formData.append("city", fields["customerCity"]);
  //     formData.append("vehicleLocation", fields["vehicleLocation"]);
  //     // formData.append('employeeName', this.empName);
  //     // formData.append('employeeMobile', this.empMobile);
  //     // formData.append('agentName', this.posName);
  //     // formData.append('agentMobile', this.posMobile);
  //     formData.append("inspectionMode", fields["inspectionMode"][0]["Name"]);
  //     formData.append("product", this.productValue);
  //     formData.append("insurerName", this.insurerValue);
  //     formData.append("registrationNo", this.registrationValues);
  //     formData.append("manufactureYear", this.manufactureYearValue);
  //     formData.append("rto", this.rtoValue);
  //     formData.append("make", this.makeValue);
  //     formData.append("model", this.modelValue);
  //     formData.append("variant", this.variantValue);
  //     formData.append("fuel", this.fuelValue);
  //     formData.append("engineNo", this.engineNoValue);
  //     formData.append("chassisNo", this.chassisNoValue);
  //     formData.append("inceptionType", this.showPolicySrBox);
  //     if (fields["inspectionMode"][0]["Name"] == "Self") {
  //       // this.ImageForm.value["RC_photo"]
  //       if (this.ImageForm.value["RC_photo"] == "" && this.createSurveyForm.value["RcFront"] == '') {
  //         alert("Select RC photo");
  //         return;
  //       }
  //       else {
  //         if (this.createSurveyForm.value["RcFront"] != '') {
  //           formData.append("rcFront", this.rcFront);
  //         } else {
  //           formData.append("rcFront", this.RC_photo);
  //         }
  //         if (this.ImageForm.value["RC_photo"] == "") {
  //           formData.append("RC_photo", this.rcFront);
  //         } else {
  //           formData.append("RC_photo", this.RC_photo);
  //         }
  //       }
  //     }
  //     else {
  //       formData.append("rcFront", this.rcFront);
  //       formData.append("RC_photo", this.RC_photo);
  //     }

  //     formData.append("rcBack", this.rcBack);

  //     formData.append("quotationDoc", this.quotationDoc);
  //     formData.append("remarks", fields["remarks"]);

  //     this.api.IsLoading();
  //     this.api.HttpPostType("b-crm/Survey/createSurvey", formData).then(
  //       (result: any) => {
  //         this.api.HideLoading();

  //         if (result["status"] == 1) {
  //           this.api.Toast("Success", result["msg"]);

  //           this.router.navigate(["survey/view-requests"]);
  //         } else {
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         const newLocal = "Warning";
  //         this.api.Toast(
  //           newLocal,
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  //   }
  // }
  CreateSurvey() {
    this.isSubmitted = true;
    var sumbit_Chack = "";
    if (
      this.createSurveyForm.value &&
      this.createSurveyForm.value["inspectionMode"] &&
      this.createSurveyForm.value["inspectionMode"].length > 0 &&
      this.createSurveyForm.value["inspectionMode"][0]["Name"]
    ) {
      sumbit_Chack = this.createSurveyForm.value["inspectionMode"][0]["Name"];
    }
    if (this.createSurveyForm.invalid && sumbit_Chack != "Self") {
      return;
    } else {
      var fields = this.createSurveyForm.value;
      if (
        fields["insurerName"] == undefined ||
        fields["insurerName"] == "" ||
        fields["customerEmail"] == undefined ||
        fields["customerEmail"] == "" ||
        fields["customerName"] == undefined ||
        fields["customerName"] == ""
      ) {
        return;
      }

      const stateCode = fields["Registration_State_Code"];
      const districtCode = fields["Registration_District_Code"];
      const cityCode = fields["Registration_City_Code"];
      const registrationCode = fields["Registration_Code"];
      // console.log(this.endorsementId);
      if (this.endorsementId != "") {
        this.productValue = fields["product"];
        // this.insurerValue = fields["insurerName"];
        this.insurerValue = fields["insurerName"][0]["Id"];
        this.manufactureYearValue = fields["manufactureYear"];
        this.makeValue = fields["make"];
        this.modelValue = fields["model"];
        this.variantValue = fields["variant"];
        this.fuelValue = fields["fuel"];
        // this.registrationValue = fields["registrationNo"];
        this.registrationValues = `${stateCode}${districtCode}${cityCode}${registrationCode}`;
        this.rtoValue = fields["rto"];
        this.engineNoValue = fields["engineNo"];
        this.chassisNoValue = fields["chassisNo"];
      } else {
        // if(fields["inspectionMode"][0]["Name"] != 'Self'){
        // this.productValue = fields["product"][0]["Name"];
        this.insurerValue = fields["insurerName"][0]["Id"];
        // this.manufactureYearValue = fields["manufactureYear"][0]["Name"];
        // this.makeValue = fields["make"][0]["Name"];
        // this.modelValue = fields["model"][0]["Name"];
        // this.variantValue = fields["variant"][0]["Name"];
        this.fuelValue = fields["fuel"][0]["Name"];
        // }

        this.productValue = JSON.stringify(fields["product"]);
        // this.insurerValue = JSON.stringify(fields["insurerName"]);
        this.manufactureYearValue = JSON.stringify(fields["manufactureYear"]);
        this.makeValue = JSON.stringify(fields["make"]);
        this.modelValue = JSON.stringify(fields["model"]);
        this.variantValue = JSON.stringify(fields["variant"]);
        // this.fuelValue = JSON.stringify(fields["fuel"]);

        // this.registrationValue = fields["registrationNo"];
        this.registrationValues = `${stateCode}${districtCode}${cityCode}${registrationCode}`;
        this.rtoValue = fields["rto"];
        this.engineNoValue = fields["engineNo"];
        this.chassisNoValue = fields["chassisNo"];
      }

      if (this.endorsementId != "" || this.quoteId != "") {
      } else {
        this.empName = JSON.stringify(fields["employeeName"]);
        this.empMobile = fields["employeeMobileNo"];
        this.posName = JSON.stringify(fields["agentName"]);
        this.posMobile = fields["agentMobileNo"];
      }
      const formData = new FormData();
      // formData.append("quoteId", this.quoteId);
      // formData.append("endorsementId", this.endorsementId);
      formData.append("Front", this.front_car_image);
      formData.append("Front_Left", this.car_left_image);
      formData.append("Front_Right", this.car_right_image);
      formData.append("Back", this.car_back_image);
      formData.append("Chassis_No", this.vehicle_chassis);
      formData.append("Engine", this.vehicle_engine_department);
      formData.append("Under_Carriage", this.undercarriage);
      formData.append("Windshield_Outside", this.front_mirror);
      formData.append("Windshield_Inside", this.inside_mirror);
      formData.append("Meter", this.vehicle_meter);
      formData.append("Selfie", this.myself_and_car);
      formData.append("Capture_Video", this.One_minute_car_video);
      formData.append("last_meter", this.last_meter);
      formData.append("Back_left", this.Back_left);
      formData.append("Back_Right", this.Back_Right);
      formData.append("Cabin", this.Cabin);
      formData.append("Open_dicky", this.Open_dicky);
      formData.append("Right", this.Right);
      formData.append("Left", this.Left);
      // formData.append("RC_photo", this.RC_photo);
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
      // formData.append("login_role_id", JSON.stringify(fields["login_role_id"]));
      // formData.append("login_role_type", JSON.stringify(fields["login_role_type"]));
      // formData.append("QuoteSource", JSON.stringify(fields["QuoteSource"]));
      formData.append("actionType", "Add");
      formData.append("quoteId", this.quoteId);
      formData.append("endorsementId", this.endorsementId);
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("customerName", fields["customerName"]);
      formData.append("customerEmail", fields["customerEmail"]);
      formData.append("customerEmailAlt", fields["customerEmailAlt"]);
      formData.append("customerMobile", fields["customerMobileNo"]);
      formData.append("customerMobileAlt", fields["customerMobileNoAlt"]);
      formData.append("customerAddress", fields["customerAddress"]);
      // if(fields["inspectionMode"][0]["Name"] != 'Self'){
      //   formData.append("pincode", fields["customerPincode"][0]["Name"]);
      // }
      formData.append("pincode", JSON.stringify(fields["customerPincode"]));
      formData.append("state", fields["customerState"]);
      formData.append("city", fields["customerCity"]);
      formData.append("vehicleLocation", fields["vehicleLocation"]);
      // formData.append('employeeName', this.empName);
      // formData.append('employeeMobile', this.empMobile);
      // formData.append('agentName', this.posName);
      // formData.append('agentMobile', this.posMobile);
      formData.append("inspectionMode", fields["inspectionMode"][0]["Name"]);
      formData.append("product", this.productValue);
      formData.append("insurerName", this.insurerValue);
      formData.append("registrationNo", this.registrationValues);
      formData.append("manufactureYear", this.manufactureYearValue);
      formData.append("rto", this.rtoValue);
      formData.append("make", this.makeValue);
      formData.append("model", this.modelValue);
      formData.append("variant", this.variantValue);
      formData.append("fuel", this.fuelValue);
      formData.append("engineNo", this.engineNoValue);
      formData.append("chassisNo", this.chassisNoValue);
      formData.append("inceptionType", this.showPolicySrBox);
      if (fields["inspectionMode"][0]["Name"] == "Self") {
        // this.ImageForm.value["RC_photo"]
        if (
          this.ImageForm.value["RC_photo"] == "" &&
          this.createSurveyForm.value["RcFront"] == ""
        ) {
          alert("Select RC photo");
          return;
        } else {
          if (this.createSurveyForm.value["RcFront"] != "") {
            formData.append("rcFront", this.rcFront);
          } else {
            formData.append("rcFront", this.RC_photo);
          }
          if (this.ImageForm.value["RC_photo"] == "") {
            formData.append("RC_photo", this.rcFront);
          } else {
            formData.append("RC_photo", this.RC_photo);
          }
        }
      } else {
        formData.append("rcFront", this.rcFront);
        formData.append("RC_photo", this.RC_photo);
      }

      formData.append("rcBack", this.rcBack);

      formData.append("quotationDoc", this.quotationDoc);
      formData.append("remarks", fields["remarks"]);

      this.api.IsLoading();
      this.api.HttpPostType("b-crm/Survey/createSurvey", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);

            this.router.navigate(["survey/view-requests"]);
          } else {
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

  //===== GET SURVEY DETAILS=====//
  GetOfflineQuoteDetails() {
    const formData = new FormData();

    formData.append("Id", this.quoteId);
    formData.append("dataType", this.dataType);

    this.api.HttpPostType("b-crm/Survey/GetOfflineQuoteDetails", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          this.surveyData = result["data"];

          this.createSurveyForm.patchValue(result["data"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  //===== GET SURVEY DETAILS=====//
  getSinglePolicyDetails() {
    const formData = new FormData();
    formData.append("Id", this.endorsementId);
    formData.append("dataType", this.dataType);

    this.api.HttpPostType("b-crm/Survey/getSinglePolicyDetails", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.surveyData = result["data"];
          this.showPolicySrDiv(result["data"]["surveyType"], 0);

          //this.quoteId = result['data']['quoteId'];

          this.createSurveyForm
            .get("customerName")
            .setValue(result["data"]["customerName"]);
          this.createSurveyForm
            .get("customerEmail")
            .setValue(result["data"]["customerEmail"]);
          this.createSurveyForm
            .get("customerMobileNo")
            .setValue(result["data"]["customerMobile"]);
          this.createSurveyForm
            .get("customerAddress")
            .setValue(result["data"]["customerAddress"]);
          this.selectedPincode = result["data"]["pincode"];

          this.createSurveyForm
            .get("customerState")
            .setValue(result["data"]["state"]);
          this.createSurveyForm
            .get("customerCity")
            .setValue(result["data"]["city"]);
          this.createSurveyForm
            .get("vehicleLocation")
            .setValue(result["data"]["vehicleLocation"]);

          this.createSurveyForm
            .get("product")
            .setValue(result["data"]["Product"]);
          this.createSurveyForm.get("make").setValue(result["data"]["Make"]);
          this.createSurveyForm.get("model").setValue(result["data"]["Model"]);
          this.createSurveyForm
            .get("variant")
            .setValue(result["data"]["Variant"]);
          this.createSurveyForm
            .get("insurerName")
            .setValue(result["data"]["insurerName"]);
          this.createSurveyForm
            .get("manufactureYear")
            .setValue(result["data"]["manufactureYear"]);

          this.createSurveyForm
            .get("registrationNo")
            .setValue(result["data"]["RegistrationNo"]);

          if (result["data"]["RegistrationNo"] != "") {
            var rto = result["data"]["RegistrationNo"].substring(0, 4);
            this.createSurveyForm.get("rto").setValue(rto);
          }

          this.createSurveyForm
            .get("engineNo")
            .setValue(result["data"]["EngineNo"]);
          this.createSurveyForm
            .get("chassisNo")
            .setValue(result["data"]["ChassisNo"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  //==== UPDATE VALIDATION AS PER LOGIN USER =====//
  // updateValidation() {
  //   const employeeName = this.createSurveyForm.get("employeeName");
  //   const employeeMobileNo = this.createSurveyForm.get("employeeMobileNo");
  //   const agentName = this.createSurveyForm.get("agentName");
  //   const agentMobileNo = this.createSurveyForm.get("agentMobileNo");

  //   if (
  //     this.loginType == "agent" ||
  //     this.loginType == "user" ||
  //     this.loginType == "sp"
  //   ) {
  //     employeeName.setValidators(null);
  //     employeeMobileNo.setValidators(null);
  //     agentName.setValidators(null);
  //     agentMobileNo.setValidators(null);

  //     employeeName.updateValueAndValidity();
  //     employeeMobileNo.updateValueAndValidity();
  //     agentName.updateValueAndValidity();
  //     agentMobileNo.updateValueAndValidity();
  //   }
  // }

  updateValidation() {
    const employeeName = this.createSurveyForm.get("employeeName");
    const employeeMobileNo = this.createSurveyForm.get("employeeMobileNo");
    const agentName = this.createSurveyForm.get("agentName");
    const agentMobileNo = this.createSurveyForm.get("agentMobileNo");

    if (
      this.loginType == "agent" ||
      this.loginType == "user" ||
      this.loginType == "sp"
    ) {
      if (employeeName) {
        employeeName.setValidators(null);
        employeeName.updateValueAndValidity();
      }

      if (employeeMobileNo) {
        employeeMobileNo.setValidators(null);
        employeeMobileNo.updateValueAndValidity();
      }

      if (agentName) {
        agentName.setValidators(null);
        agentName.updateValueAndValidity();
      }

      if (agentMobileNo) {
        agentMobileNo.setValidators(null);
        agentMobileNo.updateValueAndValidity();
      }
    }
  }

  //=====SEARCH PINCODES=====//
  searchPincodes(e: any, Type: any) {
    var pincode = "";
    if (Type == 1) {
      pincode = e.target.value;
    }
    this.api
      .HttpGetType("b-crm/Universal/searchPincodes?pincode=" + pincode)
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.pincodeData = result["data"];
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

  //GET STATE CITY DETAILS
  getStateCityDetails(item: any) {
    this.api.IsLoading();
    this.api
      .HttpGetType("b-crm/Universal/selectStateCityData?Id=" + item.Id)
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            let row = result["data"];
            this.PincodData_Ar = row;
            this.createSurveyForm.get("customerState").setValue(row.State_Name);
            this.createSurveyForm
              .get("customerCity")
              .setValue(row.City_or_Village_Name);
          } else {
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

  //=====SEARCH EMPLOYEE Details=====//

  // searchEmployee(e: any, type: any) {
  //   var searchTerm = '';
  //   var mainOption = 5;
  //   var subOption = 'Is_View';

  //   if (type == 1) {
  //     searchTerm = e.target.value;
  //   }

  //   this.api.HttpGetType('b-crm/Universal/searchEmployee?searchTerm=' + searchTerm + '&loginId=' + this.loginId + '&mainOption=' + mainOption + '&subOption=' + subOption).then((result:any) => {

  //     if (result['status'] == true) {
  //       this.employeeData = result['data'];
  //       this.agentData = [];
  //     }
  //   },
  //   );
  // }

  //=====SEARCH AGENTS=====//
  // searchAgents(e: any, type: any) {

  //   this.createSurveyForm.get('employeeMobileNo').setValue('');
  //   this.createSurveyForm.get('agentName').setValue('');
  //   this.createSurveyForm.get('agentMobileNo').setValue('');

  //   var employee = this.createSurveyForm.get('employeeName');
  //   var employeeId = employee.value[0].Id;
  //   var employeeName = employee.value[0].Name;
  //   if (employee.value[0].Name === 'Direct') {

  //     this.createSurveyForm.get('employeeMobileNo').setValidators(null);
  //     this.createSurveyForm.get('agentName').setValidators(null);
  //     this.createSurveyForm.get('agentMobileNo').setValidators(null);

  //     this.createSurveyForm.controls['employeeMobileNo'].disable();
  //     this.createSurveyForm.controls['agentName'].disable();
  //     this.createSurveyForm.controls['agentMobileNo'].disable();
  //     this.butDisabled = true;

  //   } else {
  //     this.createSurveyForm.controls['employeeMobileNo'].enable();
  //     this.createSurveyForm.controls['agentName'].enable();
  //     this.createSurveyForm.controls['agentMobileNo'].enable();
  //     this.butDisabled = false;
  //     this.getEmployeeDetails(employeeId);
  //   }

  //   var agent = '';
  //   if (type == 1) {
  //     agent = e.target.value;
  //   }

  //   this.api.HttpGetType('b-crm/Universal/searchAgents?employee=' + employeeId + '&employeeName=' + employeeName + '&agent=' + agent).then((result:any) => {

  //     if (result['status'] == true) {
  //       this.agentData = result['data'];
  //     }
  //   },

  //   );

  // }

  //===== GET EMPLOYEE DETAILS =====//
  getEmployeeDetails(employeeId) {
    const formData = new FormData();
    formData.append("id", employeeId);
    formData.append("table", "employee");

    this.api.HttpPostType("b-crm/Universal/searchSingleData", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          this.employeeMobile = result["data"]["mobile"];
          this.createSurveyForm
            .get("employeeMobileNo")
            .setValue(this.employeeMobile);
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

  //===== GET AGENT DETAILS =====//
  getAgentDetails() {
    var agent = this.createSurveyForm.get("agentName");
    var agentId = agent.value[0].Id;
    var agentName = agent.value[0].Name;
    this.api
      .HttpGetType(
        "b-crm/Universal/searchSingleAgentSpData?id=" +
          agentId +
          "&agentName=" +
          agentName
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.agentMobile = result["data"]["mobile"];
            this.createSurveyForm
              .get("agentMobileNo")
              .setValue(this.agentMobile);
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

  //===== SHOW POLICY SR DIV =====//
  showPolicySrDiv(e: any, type) {
    this.createSurveyForm.get("product").setValue("");
    this.createSurveyForm.get("make").setValue("");
    this.createSurveyForm.get("model").setValue("");
    this.createSurveyForm.get("variant").setValue("");
    this.createSurveyForm.get("fuel").setValue("");

    this.createSurveyForm.get("insurerName").setValue("");
    this.createSurveyForm.get("manufactureYear").setValue("");
    this.createSurveyForm.get("registrationNo").setValue("");
    this.createSurveyForm.get("engineNo").setValue("");
    this.createSurveyForm.get("chassisNo").setValue("");
    this.createSurveyForm.get("rto").setValue("");

    if (this.showPolicySrBox == "Endosment") {
      this.showPolicySrBox = "Endosment";
      this.createSurveyForm.get("product").setValidators(null);
      this.createSurveyForm.get("make").setValidators(null);
      this.createSurveyForm.get("model").setValidators(null);
      this.createSurveyForm.get("variant").setValidators(null);
      this.createSurveyForm.get("fuel").setValidators(null);
      this.createSurveyForm.get("insurerName").setValidators(null);
      this.createSurveyForm.get("manufactureYear").setValidators(null);
      this.createSurveyForm.get("registrationNo").setValidators(null);
      this.createSurveyForm.get("rto").setValidators(null);
      this.createSurveyForm.get("engineNo").setValidators(null);
      this.createSurveyForm.get("chassisNo").setValidators(null);
    } else {
      this.showPolicySrBox = "Policy";
      this.createSurveyForm.get("product").setValidators([Validators.required]);
      this.createSurveyForm.get("make").setValidators([Validators.required]);
      this.createSurveyForm.get("model").setValidators([Validators.required]);
      this.createSurveyForm.get("variant").setValidators([Validators.required]);
      this.createSurveyForm.get("fuel").setValidators([Validators.required]);
      this.createSurveyForm
        .get("insurerName")
        .setValidators([Validators.required]);
      this.createSurveyForm
        .get("manufactureYear")
        .setValidators([Validators.required]);
      this.createSurveyForm
        .get("registrationNo")
        .setValidators([
          Validators.required,
          Validators.pattern(
            "^[A-Za-z]{2}[0-9]{1,2}(?:[A-Za-z])?(?:[A-Za-z]*)?[0-9]{4}$"
          ),
        ]);
      this.createSurveyForm.get("rto").setValidators([Validators.required]);
      this.createSurveyForm
        .get("engineNo")
        .setValidators([Validators.pattern("^[A-Za-z0-9]{5,25}$")]);
      this.createSurveyForm
        .get("chassisNo")
        .setValidators([Validators.pattern("^[A-Za-z0-9]{5,25}$")]);
    }
  }

  //=====SEARCH POLICY DETAILS=====//
  searchEndosmentDetails(e: any) {
    var policySrNo = e.target.value;

    if (policySrNo != "") {
      this.api
        .HttpGetType(
          "b-crm/Survey/searchEndosmentDetails?policySrNo=" +
            policySrNo +
            "&loginType=" +
            this.loginType +
            "&loginId=" +
            this.loginId
        )
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.productValue = result["data"]["Product_Id"];
              this.makeValue = result["data"]["Make_Id"];
              this.modelValue = result["data"]["Model_Id"];
              this.variantValue = result["data"]["Variant_Id"];
              this.insurerValue = result["endInsurer"];
              this.registrationValue = result["data"]["Registration_No"];
              this.manufactureYearValue = result["data"]["Manufacture_Year"];
              this.rtoValue = result["data"]["RTO_Id"];
              this.engineNoValue = result["data"]["Engine_No"];
              this.chassisNoValue = result["data"]["Chasis_No"];

              this.createSurveyForm.get("product").setValue(this.productValue);
              this.createSurveyForm.get("make").setValue(this.makeValue);
              this.createSurveyForm.get("model").setValue(this.modelValue);
              this.createSurveyForm.get("variant").setValue(this.variantValue);
              this.createSurveyForm
                .get("insurerName")
                .setValue(this.insurerValue);
              this.createSurveyForm
                .get("registrationNo")
                .setValue(this.registrationValue);
              this.createSurveyForm
                .get("manufactureYear")
                .setValue(this.manufactureYearValue);

              if (this.registrationValue != "") {
                var rto = this.registrationValue.substring(0, 4);
                this.createSurveyForm.get("rto").setValue(rto);
              }

              this.createSurveyForm
                .get("engineNo")
                .setValue(this.engineNoValue);
              this.createSurveyForm
                .get("chassisNo")
                .setValue(this.chassisNoValue);
            } else {
              this.api.Toast("Warning", result["msg"]);
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
    } else {
      this.createSurveyForm.get("product").setValue("");
      this.createSurveyForm.get("make").setValue("");
      this.createSurveyForm.get("model").setValue("");
      this.createSurveyForm.get("variant").setValue("");
      this.createSurveyForm.get("insurerName").setValue("");
      this.createSurveyForm.get("manufactureYear").setValue("");
      this.createSurveyForm.get("registrationNo").setValue("");
      this.createSurveyForm.get("engineNo").setValue("");
      this.createSurveyForm.get("chassisNo").setValue("");
      this.createSurveyForm.get("rto").setValue("");
    }
  }

  //=====SEARCH PRODUCTS=====//

  searchProducts() {
    this.api.HttpGetType("b-crm/Universal/searchProducts").then(
      (result: any) => {
        if (result["status"] == true) {
          this.productData = result["data"];
          this.insurerData = result["insurer"];

          // console.log(this.insurerData);
          // console.log(this.productData);

          // this.makeData = [];
          // this.modelData = [];
          // this.variantData = [];
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
  searchMakes(e: any) {
    // console.log(e);

    this.createSurveyForm.get("make").setValue("");
    this.createSurveyForm.get("model").setValue("");
    this.createSurveyForm.get("fuel").setValue("");
    this.createSurveyForm.get("variant").setValue("");

    if (e != "") {
      var productId = e[0]["Id"];
    } else {
      var product = this.createSurveyForm.get("product");
      var productId = product.value[0].Id;
    }
    // var product = this.createSurveyForm.get("product");
    // var productId = product.value[0].Id;
    const formData = new FormData();
    formData.append("product", productId);

    this.api.IsLoading();
    // this.api.HttpPostType("b-crm/Universal/searchMakes", formData).then(
    this.api.HttpPostType("Offlinequote/searchMakes", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.makeData = result["data"];

          // this.searchModels('')
          if (e == "") {
            this.modelData = [];
            this.fuelData = [];
            this.variantData = [];
          }
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

  searchModels(e: any) {
    if (e && e.length > 0 && e[0] && e[0].Id !== undefined && e[0].Id !== "") {
      // alert(e[0].Id);
      var productId = this.SelecteVechileTypeData[0]["Id"];
      var makeName = e[0]["Id"];
    } else {
      this.createSurveyForm.get("model").setValue("");
      this.createSurveyForm.get("fuel").setValue("");
      this.createSurveyForm.get("variant").setValue("");

      var make = this.createSurveyForm.get("make");
      var product = this.createSurveyForm.get("product");
      var productId: string = product.value[0].Id;
      var makeName = make.value[0].Name;
    }
    const formData = new FormData();
    formData.append("make", makeName);
    formData.append("product", productId);
    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/searchModels", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.modelData = result["data"];
          // console.log(this.modelData);

          if (
            e &&
            e.length > 0 &&
            e[0] &&
            e[0].Id !== undefined &&
            e[0].Id !== ""
          ) {
          } else {
            this.fuelData = [];
            this.variantData = [];
          }
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
    var productId = "";
    if (e && e.length > 0 && e[0] && e[0].Id !== undefined && e[0].Id !== "") {
      // alert(e[0].Id);
      productId = this.SelecteVechileTypeData[0]["Id"];
      var modelName = e[0]["Id"];
    } else {
      this.createSurveyForm.get("fuel").setValue("");
      this.createSurveyForm.get("variant").setValue("");

      var model = this.createSurveyForm.get("model");
      var product = this.createSurveyForm.get("product");
      productId = product.value[0].Id;
      var modelName = model.value[0].Name;
    }
    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("product", productId);

    this.api.IsLoading();
    // this.api.HttpPostType("b-crm/Universal/searchFuel", formData).then(
    this.api.HttpPostType("Offlinequote/searchFuelType", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.fuelData = result["data"];

          if (
            e &&
            e.length > 0 &&
            e[0] &&
            e[0].Id !== undefined &&
            e[0].Id !== ""
          ) {
          } else {
            this.variantData = [];
          }
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
    var product = this.createSurveyForm.get("product");
    var fueltype = this.createSurveyForm.get("fuel");
    var productId = "";
    var modelName = "";
    if (e && e.length > 0 && e[0] && e[0].Id !== undefined && e[0].Id !== "") {
      // alert(e[0].Id);
      productId = this.SelecteVechileTypeData[0]["Id"];
      var fuel = e[0]["Id"];
      modelName = this.SelectedmodalName[0]["Id"];
    } else {
      var fuel = fueltype.value[0].Name;
      productId = product.value[0].Name;

      var model = this.createSurveyForm.get("model");
      modelName = model.value[0].Name;
    }

    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("product", productId);
    // formData.append("fuel", fuel);
    formData.append("fuelName", fuel);

    this.api.IsLoading();
    // this.api.HttpPostType("b-crm/Universal/searchVariants", formData).then(
    this.api.HttpPostType("Offlinequote/searchVariants", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          // data
          this.variantData = result["data"];
          // console.log(this.variantData);
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

  //===== GET RTO NO. =====//
  getRtoNo(reg: any) {
    var regNo = reg.target.value;
    var rto = regNo.substring(0, 4);
    this.createSurveyForm.get("rto").setValue(rto);
  }

  //=====SHOW POLICY SR DIV =====//
  // checkFormType() {

  //   if (this.quoteId != '' || this.endorsementId != '') {
  //     //  this.createSurveyForm.get('employeeName').setValidators(null);
  //     //  this.createSurveyForm.get('employeeMobileno').setValidators(null);
  //     //  this.createSurveyForm.get('agentName').setValidators(null);
  //     //  this.createSurveyForm.get('agentMobileno').setValidators(null);

  //   } else {
  //     this.createSurveyForm.get('employeeName').setValidators(Validators.required);
  //     this.createSurveyForm.get('employeeMobileno').setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);
  //     this.createSurveyForm.get('agentMobileno').setValidators([Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);

  //     this.createSurveyForm.get('employeeName').updateValueAndValidity();
  //     this.createSurveyForm.get('employeeMobileno').updateValueAndValidity();
  //     this.createSurveyForm.get('agentMobileno').updateValueAndValidity();
  //   }
  // }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      if (
        ext == "png" ||
        ext == "jpeg" ||
        ext == "jpg" ||
        ext == "pdf" ||
        ext == "Pdf"
      ) {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 3) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 3 mb");

          if (Type == "RC_Motor_Front") {
            this.createSurveyForm.get("RcFront").setValue("");
            this.RC_Motor_Front_image = 0;
          }
          if (Type == "RC_Motor_Back") {
            this.createSurveyForm.get("RcBack").setValue("");
            this.RC_Motor_Back_image = 0;
          }
          if (Type == "Request_Letter") {
            this.createSurveyForm.get("quotationDoc").setValue("");
            this.Quotation_Doc_image = 0;
          }
        } else {
          if (Type == "RC_Motor_Front") {
            this.RC_Motor_Front_image = 1;
            this.rcFront = this.selectedFiles;
          }
          if (Type == "RC_Motor_Back") {
            this.RC_Motor_Back_image = 1;
            this.rcBack = this.selectedFiles;
          }
          if (Type == "Quotation_Doc") {
            this.Quotation_Doc_image = 1;
            this.quotationDoc = this.selectedFiles;
          }

          // if(Type == 'RC_Motor_Front'){this.rcFront = this.selectedFiles; }
          // if(Type == 'RC_Motor_Back'){this.rcBack = this.selectedFiles; }
          // if(Type == 'Quotation_Doc'){this.quotationDoc = this.selectedFiles; }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "RC_Motor_Front") {
          this.createSurveyForm.get("RcFront").setValue("");
          this.RC_Motor_Front_image = 0;
        }
        if (Type == "RC_Motor_Back") {
          this.createSurveyForm.get("RcBack").setValue("");
          this.RC_Motor_Back_image = 0;
        }
        if (Type == "Request_Letter") {
          this.createSurveyForm.get("quotationDoc").setValue("");
          this.Quotation_Doc_image = 0;
        }
      }
    }
  }

  //===== ON ITEM DESELECT =====//
  onItemDeSelect(item: any, type: any) {
    if (type === "product") {
      this.createSurveyForm.get("make").setValue("");
      this.createSurveyForm.get("model").setValue("");
      this.createSurveyForm.get("fuel").setValue("");
      this.createSurveyForm.get("variant").setValue("");

      this.makeData = [];
      this.modelData = [];
      this.fuelData = [];
      this.variantData = [];
    }

    if (type === "make") {
      this.createSurveyForm.get("model").setValue(null);
      this.createSurveyForm.get("fuel").setValue("");
      this.createSurveyForm.get("variant").setValue(null);

      this.modelData = [];
      this.fuelData = [];
      this.variantData = [];
    }

    if (type === "model") {
      this.createSurveyForm.get("variant").setValue("");
      this.createSurveyForm.get("fuel").setValue("");

      this.fuelData = [];
      this.variantData = [];
    }

    if (type === "fuel") {
      this.createSurveyForm.get("variant").setValue("");
      this.variantData = [];
    }

    // if (type === 'employee') {
    //   this.createSurveyForm.get("employeeMobileNo").setValue('');
    //   this.createSurveyForm.get("agentName").setValue('');
    //   this.createSurveyForm.get("agentMobileNo").setValue('');
    //   this.agentData = [];
    // }
    if (type == "login_role_type") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.EmployeeMappingPersonval = "";

      this.FilterData("OneByOneDeSelect");
      this.createSurveyForm.get("login_role_id").setValidators(null);
      this.createSurveyForm.get("login_role_id").updateValueAndValidity();
    }
    if (type == "EmployeeMappingPerson") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.createSurveyForm.get("login_role_id").setValue("");
      this.createSurveyForm.get("login_role_id").updateValueAndValidity();

      this.FilterData("OneByOneDeSelect");
    }
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

  //===== GET LOGIN USER'S RIGHTS ======//
  getLoginUserRights() {
    //If Admin Login
    if (this.loginType == "admin") {
      this.rightType = "All";
      // this.searchEmployee('', 0);
      //If Others Login
    } else {
      this.mainOption = 5;
      this.subOption = "Is_Create";

      const formData = new FormData();
      formData.append("loginId", this.loginId);
      formData.append("loginType", this.loginType);
      formData.append("mainOption", this.loginId);
      formData.append("subOption", this.subOption);

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Universal/getLoginUserRights", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.rightType = result["data"];

              //If Login Type Is Employee
              if (this.loginType == "employee") {
                // this.searchEmployee('', 0);
              }
            } else {
              this.api.Toast("Warning", result["msg"]);
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
  }

  FilterData(item: any) {
    if (item != 1 && item != "OneByOneDeSelect") {
      this.EmployeeMappingPersonval = item;
    }
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    var fields = this.createSurveyForm.value;

    formData.append("login_role_type", fields["login_role_type"][0]["Id"]);
    formData.append(
      "SelectedEmployee",
      JSON.stringify(fields["EmployeeMappingPerson"])
    );

    this.MappingPerson = [];
    if (item != "OneByOneDeSelect") {
      // formData.append("login_type",  );

      // // console.log(formData);

      this.api.IsLoading();
      this.api
        .HttpPostType("Offlinequote/MappingViaSearviceLocation1", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();

            // console.log(result);

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

  // FilterData(item: any) {
  //   const formData = new FormData();
  //   formData.append("login_id", this.api.GetUserData("Id"));
  //   formData.append("login_type", this.api.GetUserType());

  //   formData.append("item", item);
  //   this.MappingPerson = [];
  //   if (item != "OneByOneDeSelect") {
  //     // formData.append("login_type",  );

  //     // // console.log(formData);
  //     this.api.IsLoading();
  //     this.api
  //       .HttpPostType("Offlinequote/MappingViaSearviceLocation", formData)
  //       .then(
  //         (result:any) => {
  //           this.api.HideLoading();

  //           // console.log(result);

  //           if (result["status"] == 1) {
  //             // this.api.Toast("Success", result["msg"]);
  //             this.MappingPerson = result["Data"];
  //           } else {
  //             const msg = "msg";
  //             // this.api.Toast("Warning", result["msg"]);
  //           }
  //         },
  //         (err) => {
  //           this.api.HideLoading();
  //           const newLocal = "Warning";
  //           this.api.Toast(
  //             newLocal,
  //             "Network Error : " + err.name + "(" + err.statusText + ")"
  //           );
  //         }
  //       );
  //   }
  // }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    var item = item.Id;
    // // console.log(item.Id);
    if (Type == "login_role_type") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterData(item);
      if (item == "Agent" || item == "Sp") {
        this.createSurveyForm
          .get("login_role_id")
          .setValidators([Validators.required]);
      } else {
        this.createSurveyForm.get("login_role_id").setValidators(null);
      }
      this.createSurveyForm.get("login_role_id").updateValueAndValidity();
    }
    if (Type == "EmployeeMappingPerson") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.createSurveyForm.get("login_role_id").setValue("");
      this.createSurveyForm.get("login_role_id").updateValueAndValidity();
      this.FilterData(1);
    }
  }

  CheckCreaterRights() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Url", this.currentUrl);

    // // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/CheckRights", formData).then(
      (result: any) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["status"] == 1) {
          // this.api.Toast("Success", result["msg"]);
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

  GetVehicleDetails() {
    const formData = new FormData();
    const fields = this.createSurveyForm.value;
    const registrationStateCode1 = fields["Registration_State_Code"];
    const registrationDistrictCode2 = fields["Registration_District_Code"];
    const concatenatedValue1 =
      registrationStateCode1 + registrationDistrictCode2;
    this.createSurveyForm.get("rto").setValue(concatenatedValue1);
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

        this.enable_value = "1";

        if (result["status"] == 1) {
          // console.log(result.data);
          this.dataArr12 = result.data;
          this.SelectedregYearName = this.dataArr12.reg_year;
          this.SelectedCustomername = this.dataArr12.Customername;
          this.SelectedCustomermobile = this.dataArr12.Customermobile;
          var emailValue = this.dataArr12.Customeremail;
          if (emailValue != "") {
            this.SelectedCustomeremail = this.dataArr12.Customeremail;
          }

          this.SelecteVechileType = this.dataArr12.VechileType;
          // this.SelectedPreviousinsurar = this.dataArr12.Previousinsurar;
          if (this.SelecteVechileType == 1) {
            this.SelecteVechileTypeData = [{ Id: "3335", Name: "TW" }];
          } else if (this.SelecteVechileType == 2) {
            this.SelecteVechileTypeData = [{ Id: "3314", Name: "PC" }];
          } else if (this.SelecteVechileType == 3) {
            this.SelecteVechileTypeData = [{ Id: "3351", Name: "PCV" }];
          } else if (this.SelecteVechileType == 4) {
            this.SelecteVechileTypeData = [{ Id: "3418", Name: "GCV" }];
          } else if (this.SelecteVechileType == 5) {
            this.SelecteVechileTypeData = [{ Id: "3442", Name: "Misc D" }];
          }
          const registrationYear = parseInt(this.dataArr12.reg_year);
          this.selectedMF = [{ Id: registrationYear, Name: registrationYear }];

          //   //   //   console.log(this.manufactureYearData);
          //   //   //   console.log(this.selectedMF);

          // this.SelectedmakeName = this.dataArr12.make;
          // this.SelectedmodalName = this.dataArr12.model;
          // this.SelectedfuleType = this.dataArr12.fuelType;
          // this.selectedVariant = this.dataArr12.variant;

          this.searchMakes(this.SelecteVechileTypeData);

          this.SelectedmakeName = this.dataArr12.make;
          this.searchModels(this.SelectedmakeName);
          this.SelectedmodalName = this.dataArr12.model;
          this.searchFuel(this.SelectedmodalName);
          this.SelectedfuleType = this.dataArr12.fuelType;
          this.searchVariants(this.SelectedfuleType);
          this.selectedVariant = this.dataArr12.variant;

          // console.log(this.SelectedmakeName);
          // console.log(this.SelectedmodalName);
          // console.log(this.SelectedfuleType);
          // console.log(this.selectedVariant);
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

  AutoTabRegistrationNo(input, maxLength, libAutoTab) {
    const length = input.target.value.length;

    if (length >= maxLength && libAutoTab) {
      const field = document.getElementById(libAutoTab);
      if (field) {
        field.focus();
      }
    }
    // var regNo = input.target.value;
    // var rto = regNo.substring(0, 4);
    // this.createSurveyForm.get("rto").setValue(rto);
  }

  // sumbit image

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
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
        if (Total_Size >= 10240) {
          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "front_car_image") {
            this.ImageForm.get("front_car_image").setValue("");
            this.front_car_image_color = 0;
          }
          if (Type == "car_left_image") {
            this.ImageForm.get("car_left_image").setValue("");
            this.car_left_image_color = 0;
          }
          if (Type == "car_right_image") {
            this.ImageForm.get("car_right_image").setValue("");
            this.car_right_image_color = 0;
          }
          if (Type == "car_back_image") {
            this.ImageForm.get("car_back_image").setValue("");
            this.car_back_image_color = 0;
          }
          if (Type == "vehicle_chassis") {
            this.ImageForm.get("vehicle_chassis").setValue("");
            this.vehicle_chassis_color = 0;
          }
          if (Type == "undercarriage") {
            this.ImageForm.get("undercarriage").setValue("");
            this.undercarriage_color = 0;
          }
          if (Type == "front_mirror") {
            this.ImageForm.get("front_mirror").setValue("");
            this.front_mirror_color = 0;
          }
          if (Type == "inside_mirror") {
            this.ImageForm.get("inside_mirror").setValue("");
            this.inside_mirror_color = 0;
          }
          if (Type == "vehicle_meter") {
            this.ImageForm.get("vehicle_meter").setValue("");
            this.vehicle_meter_color = 0;
          }

          if (Type == "myself_and_car") {
            this.ImageForm.get("myself_and_car").setValue("");
            this.myself_and_car_color = 0;
          }

          if (Type == "One_minute_car_video") {
            this.ImageForm.get("One_minute_car_video").setValue("");
            this.One_minute_car_video_color = 0;
          }

          if (Type == "last_meter") {
            this.ImageForm.get("last_meter").setValue("");
            this.last_meter_color = 0;
          }
          if (Type == "Back_left") {
            this.ImageForm.get("Back_left").setValue("");
            this.Back_left_color = 0;
          }
          if (Type == "Back_Right") {
            this.ImageForm.get("Back_Right").setValue("");
            this.Back_Right_color = 0;
          }
          if (Type == "Cabin") {
            this.ImageForm.get("Cabin").setValue("");
            this.Cabin_color = 0;
          }
          if (Type == "Open_dicky") {
            this.ImageForm.get("Open_dicky").setValue("");
            this.Open_dicky_color = 0;
          }
          if (Type == "Right") {
            this.ImageForm.get("Right").setValue("");
            this.Right_color = 0;
          }
          if (Type == "Left") {
            this.ImageForm.get("Left").setValue("");
            this.Left_color = 0;
          }
          if (Type == "RC_photo") {
            this.ImageForm.get("RC_photo").setValue("");
            this.RC_photo_color = 0;
          }
        } else {
          const reader = new FileReader();
          if (Type == "front_car_image") {
            this.front_car_image = this.selectedFiles;

            reader.onload = (e: any) => {
              this.front_car_image_ImageUrl = e.target.result;
              this.front_car_image_color = 1;
            };
            reader.readAsDataURL(this.selectedFiles);
            this.front_car_image_color = 1;
          }

          if (Type == "car_left_image") {
            this.car_left_image = this.selectedFiles;
            reader.onload = (e: any) => {
              this.car_left_image_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
            this.car_left_image_color = 1;
          }
          if (Type == "car_right_image") {
            this.car_right_image = this.selectedFiles;
            this.car_right_image_color = 1;
            reader.onload = (e: any) => {
              this.car_right_image_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "car_back_image") {
            this.car_back_image = this.selectedFiles;
            this.car_back_image_color = 1;
            reader.onload = (e: any) => {
              this.car_back_image_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "vehicle_chassis") {
            this.vehicle_chassis = this.selectedFiles;
            this.vehicle_chassis_color = 1;
            reader.onload = (e: any) => {
              this.vehicle_chassis_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "vehicle_engine_department") {
            this.vehicle_engine_department = this.selectedFiles;
            this.vehicle_engine_department_color = 1;
            reader.onload = (e: any) => {
              this.vehicle_engine_department_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "undercarriage") {
            this.undercarriage = this.selectedFiles;
            this.undercarriage_color = 1;
            reader.onload = (e: any) => {
              this.undercarriage_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "front_mirror") {
            this.front_mirror = this.selectedFiles;
            this.front_mirror_color = 1;
            reader.onload = (e: any) => {
              this.front_mirror_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "inside_mirror") {
            this.inside_mirror = this.selectedFiles;
            this.inside_mirror_color = 1;
            reader.onload = (e: any) => {
              this.inside_mirror_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "vehicle_meter") {
            this.vehicle_meter = this.selectedFiles;
            this.vehicle_meter_color = 1;
            reader.onload = (e: any) => {
              this.vehicle_meter_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }

          if (Type == "myself_and_car") {
            this.myself_and_car = this.selectedFiles;
            this.myself_and_car_color = 1;
            reader.onload = (e: any) => {
              this.myself_and_car_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "One_minute_car_video") {
            this.One_minute_car_video = this.selectedFiles;
            this.One_minute_car_video_color = 1;
            reader.onload = (e: any) => {
              this.One_minute_car_video_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "last_meter") {
            this.last_meter = this.selectedFiles;
            this.last_meter_color = 1;
            reader.onload = (e: any) => {
              this.last_meter_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "Back_left") {
            this.Back_left = this.selectedFiles;
            this.Back_left_color = 1;
            reader.onload = (e: any) => {
              this.Back_left_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "Back_Right") {
            this.Back_Right = this.selectedFiles;
            this.Back_Right_color = 1;
            reader.onload = (e: any) => {
              this.Back_Right_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "Cabin") {
            this.Cabin = this.selectedFiles;
            this.Cabin_color = 1;
            reader.onload = (e: any) => {
              this.Cabin_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "Open_dicky") {
            this.Open_dicky = this.selectedFiles;
            this.Open_dicky_color = 1;
            reader.onload = (e: any) => {
              this.Open_dicky_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "Right") {
            this.Right = this.selectedFiles;
            this.Right_color = 1;
            reader.onload = (e: any) => {
              this.Right_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "Left") {
            this.Left = this.selectedFiles;
            this.Left_color = 1;
            reader.onload = (e: any) => {
              this.Left_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
          if (Type == "RC_photo") {
            this.RC_photo = this.selectedFiles;
            this.RC_photo_color = 1;
            reader.onload = (e: any) => {
              this.RC_photo_ImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.selectedFiles);
          }
        }
      } else {
        if (Type === "One_minute_car_video") {
          const allowedVideoFormats = ["mp4", "avi", "mov"];
          const selectedFile = Array.isArray(this.selectedFiles)
            ? this.selectedFiles[0]
            : this.selectedFiles;

          const fileExtension = selectedFile.name
            .split(".")
            .pop()
            .toLowerCase();

          if (allowedVideoFormats.includes(fileExtension)) {
            this.One_minute_car_video = selectedFile;
            this.One_minute_car_video_color = 1;
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.One_minute_car_video_ImageUrl = e.target.result;
            };
            // alert('hi');
            reader.readAsDataURL(selectedFile);
          } else {
            // Handle invalid file format
            console.error(
              "Invalid video format. Please select a valid video file."
            );
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
  }

  Imagedateview(type: any, all_image_surey: any) {
    this.mymeenimage_url = all_image_surey;
    // if (this.One_minute_car_video_ImageUrl == all_image_surey) {
    if (type == 1) {
      this.Chack_video_photo = 1;
    } else {
      this.Chack_video_photo = 0;
    }
  }
  submitFormImage() {
    const formData = new FormData();
    formData.append("quoteId", this.quoteId);
    formData.append("endorsementId", this.endorsementId);
    formData.append("front_car_image", this.front_car_image);
    formData.append("car_left_image", this.car_left_image);
    formData.append("car_right_image", this.car_right_image);
    formData.append("car_back_image", this.car_back_image);
    formData.append("vehicle_chassis", this.vehicle_chassis);
    formData.append(
      "vehicle_engine_department",
      this.vehicle_engine_department
    );
    formData.append("undercarriage", this.undercarriage);
    formData.append("front_mirror", this.front_mirror);
    formData.append("inside_mirror", this.inside_mirror);
    formData.append("vehicle_meter", this.vehicle_meter);
    formData.append("myself_and_car", this.myself_and_car);
    formData.append("One_minute_car_video", this.One_minute_car_video);
    formData.append("last_meter", this.last_meter);
    formData.append("Back_left", this.Back_left);
    formData.append("Back_Right", this.Back_Right);
    formData.append("Cabin", this.Cabin);
    formData.append("Open_dicky", this.Open_dicky);
    formData.append("Right", this.Right);
    formData.append("Left", this.Left);
    formData.append("RC_photo", this.RC_photo);
    //   //   //   console.log(formData);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Survey/createSurvey_image", formData).then(
      (result: any) => {
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

  // Yuvraj
  EmailGet() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    var fields = this.createSurveyForm.value;

    formData.append("login_role_type", fields["login_role_type"][0]["Id"]);
    formData.append("login_role_ids", JSON.stringify(fields["login_role_id"]));
    formData.append("login_role_id", fields["login_role_id"][0]["Id"]);

    this.MappingPerson = [];
    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/Mappingemail", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result.status == 1) {
          let email = result.Data[0]["Email"];
          this.createSurveyForm.get("customerEmail").setValue(email);
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
} //END CODE
