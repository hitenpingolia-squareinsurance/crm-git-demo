import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.css"],
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm: FormGroup;
  isSubmitted = false;
  butDisabled = false;
  designationHOD = "dropdownSettingsType1";
  currentUrl: any = "";
  solicitorData: any = [];

  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};
  dropdownSettingsType1: any = {};
  loginId: any;
  loginType: any;
  masterType: string;
  CoreLineData: any = [];
  VerticalData: any = [];
  ProfileData: any = [];
  DesignationData: any = [];
  GradeData: any = [];
  OrganisationData: any = [];
  ReportingManagerData: any = [];
  ZoneData: any = [];
  BranchData: any = [];
  showSolicitorBox: boolean = false;
  selectedFiles: File;
  bqcImage: File;
  dropdownSettingsTypevertical: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  ServiceLocationData: any = [];
  IsSeles_NonSales: { Id: number; Name: string }[];
  idUsed: any;
  employeeData: any;
  selectedSolicitorType: any;
  selectedCoreline: any;
  selectedDesignation: any;
  selectedVertical: any;
  selectedProfile: any;
  selectedAdditionlVer: any;
  selectedRM: any;
  selectedZone: any;
  selectedBranch: any;
  selectedOpsBranch: any;
  EmploymentType: { Id: string; Name: string }[];
  currentCtcLabelValue = "Current CTC";
  EmploymentTypeSetValue: any;
  selectedIs_Sales: any;
  EmployeeIdreadonly: boolean = false;
  oldemployeeId: any;
  splitted2: any = 0;
  selectedro: any;
  ROData: any;
  ExperienceTypeData: { Id: string; Name: string }[];
  ShowExperienceType: boolean = false;
  oldEmployeeExperiance: { Id: string; Name: string }[];
  DataBloodGroup: { Id: string; Name: string }[];
  PresidentShow: string;
  CoreVerticalData: void;
  GenderData: { Id: string; Name: string }[];
  selected_Gender: any;
  selectedExperienceType: any;
  selected_emp_experiance: any;
  selected_Blood_Group: any;
  selectedCoreVertical: any;
  selectedcore_department: any;
  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.addEmployeeForm = this.formBuilder.group({
      EmployeeType: ["", [Validators.required]],
      employeeId: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")],
      ],
      fullName: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z_ ]*$")],
      ],
      personalEmail: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          ),
        ],
      ],
      officialEmail: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          ),
        ],
      ],
      personalMobile: [
        "",
        [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")],
      ],
      officialMobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        ],
      ],
      fatherName: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z_ ]*$")],
      ],
      communicationAddress: ["", [Validators.required]],
      dateOfJoining: ["", [Validators.required]],
      dateOfBirth: ["", [Validators.required]],
      isSolicitor: ["", [Validators.required]],
      saibaId: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")],
      ],
      bqcNo: [""],
      bqcImage: [""],
      bqcValidityFrom: [""],
      bqcValidityTo: [""],
      coreLine: ["", [Validators.required]],
      designation: ["", [Validators.required]],
      vertical: ["", [Validators.required]],
      profile: ["", [Validators.required]],
      // secondaryVertical: [""],
      grade: [""],
      organisation: [""],
      reportingManager: [""],
      zone: ["", [Validators.required]],
      ro: ["", [Validators.required]],
      branch: [""],
      branchAddress: [""],
      Servicelocation: ["", [Validators.required]],

      FixedCost: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      VariablePay: [0, [Validators.pattern("^[0-9]*$")]],
      CurrentCTC: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],

      Is_Sales: ["", [Validators.required]],
      Gender: ["", [Validators.required]],

      pincode: ["", [Validators.required]],
      ExperienceType: ["", [Validators.required]],

      last_organization_contact_no: [
        "",
        [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")],
      ],
      organization_name: [""],
      emp_experiance: [""],
      LcValidityFrom: [""],
      LcValidityTo: [""],

      pan_number: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"),
        ],
      ],

      aadhhar_number: [
        "",
        [Validators.required, Validators.pattern("[0-9]{12}")],
      ],

      emergency_contact_no: [
        "",
        [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")],
      ],
      blood_group: ["", [Validators.required]],
      core_vertical: [""],

      extensionno: ["", [Validators.pattern("^[0-9]{3}")]],


    });

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

    this.dropdownSettingsTypevertical = {
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
  }

  //=====ngOnInit MANAGEMENT=====//
  ngOnInit() {
    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();

    this.oldEmployeeExperiance = [
      { Id: "0-1 Year", Name: "0-1 Year" },
      { Id: "1-2 Year", Name: "1-2 Year" },
      { Id: "2-3 Year", Name: "2-3 Year" },
      { Id: "3-4 Year", Name: "3-4 Year" },
      { Id: "4-5 Year", Name: "4-5 Year" },
      { Id: "5+ Year", Name: "5+ Year" },
      { Id: "7+ Year", Name: "7+ Year" },
      { Id: "9+ Year", Name: "9+ Year" },
      { Id: "10 Year", Name: "10 Year" },
      { Id: "11+ Year", Name: "11+ Year" },
      { Id: "15+ Year", Name: "15+ Year" },
      { Id: "20+ Year", Name: "20+ Year" },
    ];

    this.DataBloodGroup = [
      { Id: "A+", Name: "A+" },
      { Id: "A-", Name: "A-" },
      { Id: "B+", Name: "B+" },
      { Id: "B-", Name: "B-" },
      { Id: "O+", Name: "O+" },
      { Id: "O-", Name: "O-" },
      { Id: "AB+", Name: "AB+" },
      { Id: "AB-", Name: "AB-" },
    ];

    this.ExperienceTypeData = [
      { Id: "Experience", Name: "Experience" },
      { Id: "Fresher", Name: "Fresher" },
    ];

    this.solicitorData = [
      { Id: 1, Name: "Yes" },
      { Id: 0, Name: "No" },
    ];

    this.EmploymentType = [
      { Id: "Consultant", Name: "Consultant" },
      { Id: "On Board", Name: "On Board" },
    ];

    this.IsSeles_NonSales = [
      { Id: 1, Name: "Sales" },
      { Id: 0, Name: "Non-Sales" },
    ];

    this.GenderData = [
      { Id: "Male", Name: "Male" },
      { Id: "Female", Name: "Female" },
    ];

    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    // alert(splitted[2]);

    if (typeof splitted[3] != "undefined" && splitted[3] != "") {
      this.idUsed = splitted[3];
      this.splitted2 = splitted[2];

      this.fetchEmployeeDetails();
      this.EmployeeIdreadonly = false;
      // this.CheckEmployeeType();
      // this.solicitorDetailFields();
    }

    this.getProfileDetailsData();
    // alert(this.currentUrl);
  }

  CheckEmployeeType() {
    var fields = this.addEmployeeForm.value;
    var EmployeeType = fields["EmployeeType"][0]["Name"];

    if (EmployeeType == "Consultant") {
      this.currentCtcLabelValue = "Consultancy Fees";
      this.addEmployeeForm.get("CurrentCTC").setValue("0");
      this.addEmployeeForm.get("CurrentCTC").setValidators(null);

      this.addEmployeeForm.get("FixedCost").setValue("0");
      this.addEmployeeForm.get("FixedCost").setValidators(null);

      this.addEmployeeForm.get("VariablePay").setValue("0");
      this.addEmployeeForm.get("VariablePay").setValidators(null);

      this.addEmployeeForm.get("personalEmail").setValidators(null);
      this.addEmployeeForm
        .get("officialEmail")
        .setValidators([Validators.required,Validators.pattern(
          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        )]);

        this.addEmployeeForm
        .get("personalEmail")
        .setValidators([Validators.pattern(
          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        )]);

      this.addEmployeeForm.get("personalMobile").setValidators(null);
      this.addEmployeeForm
        .get("officialMobile")
        .setValidators([Validators.required,Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);
    } else {
      this.addEmployeeForm
        .get("personalEmail")
        .setValidators([Validators.required,Validators.pattern(
          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        )]);
      this.addEmployeeForm
        .get("officialEmail")
        .setValidators([Validators.required,Validators.pattern(
          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        )]);

      this.addEmployeeForm
        .get("personalMobile")
        .setValidators([Validators.required,Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);
      this.addEmployeeForm
        .get("officialMobile")
        .setValidators([Validators.required,Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);

      if (this.splitted2 != "edit-employee") {
        this.currentCtcLabelValue = "Current CTC";
        this.addEmployeeForm.get("CurrentCTC").setValue("");
        this.addEmployeeForm.get("CurrentCTC").setValidators([Validators.required,Validators.pattern("^[0-9]*$")]);

        this.addEmployeeForm.get("FixedCost").setValue("");
        this.addEmployeeForm.get("FixedCost").setValidators([Validators.required,Validators.pattern("^[0-9]*$")]);

        this.addEmployeeForm.get("VariablePay").setValue("0");

      } else {
        this.addEmployeeForm.get("CurrentCTC").setValidators(null);
        this.addEmployeeForm.get("FixedCost").setValidators(null);
        this.addEmployeeForm.get("VariablePay").setValidators(null);
      }
    }

    this.addEmployeeForm.get("CurrentCTC").updateValueAndValidity();
    this.addEmployeeForm.get("FixedCost").updateValueAndValidity();
    this.addEmployeeForm.get("VariablePay").updateValueAndValidity();

    this.addEmployeeForm.get("personalEmail").updateValueAndValidity();
    this.addEmployeeForm.get("officialEmail").updateValueAndValidity();

    this.addEmployeeForm.get("personalMobile").updateValueAndValidity();
    this.addEmployeeForm.get("officialMobile").updateValueAndValidity();
  }

  //===== GET SURVEY DETAILS=====//
  fetchEmployeeDetails() {
    const formData = new FormData();
    formData.append("id", this.idUsed);

    this.api
      .HttpPostType("b-crm/Employee/getSingleEmployeeDetails", formData)
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.oldemployeeId = result["data"]["employeeId"];

            this.addEmployeeForm.patchValue(result["data"]);

            this.EmploymentTypeSetValue = result["EmployeeType"];

            this.selectedSolicitorType = result["solicitor_type"];
            this.selectedIs_Sales = result["Is_Sales"];
            this.selectedCoreline = result["coreline"];
            this.selectedDesignation = result["designation"];
            this.selectedVertical = result["vertical"];

            this.selectedRM = result["reportingManager"];
            this.selectedZone = result["zone"];

            this.selected_Gender = result["Gender"];

            this.selectedExperienceType = result["ExperienceType"];
            this.selected_emp_experiance = result["emp_experiance"];
            this.selected_Blood_Group = result["blood_group"];

            this.selectedro = result["ro"];

            this.selectedBranch = result["branch"];

            this.selectedOpsBranch = result["reportingBranch"];
            this.BranchData = result["BranchData"];
            this.ServiceLocationData = result["ServiceLocationData"];
            this.ReportingManagerData = result["ReportingManagersData"];
            this.ROData = result["ROData"];
            this.ProfileData = result["ProfileData"];
            this.CoreVerticalData = this.selectedVertical;
            this.selectedCoreVertical = result["core_department"];

            if (result["profileType"][0]["Id"] == "108") {
              this.dropdownSettingsTypevertical = {
                singleSelection: false,
                idField: "Id",
                textField: "Name",
                itemsShowLimit: 1,
                enableCheckAll: false,
                allowSearchFilter: true,
              };
            } else {
              this.dropdownSettingsTypevertical = {
                singleSelection: true,
                idField: "Id",
                textField: "Name",
                itemsShowLimit: 1,
                enableCheckAll: false,
                allowSearchFilter: true,
              };
            }
            var profileName: any = result["profileType"][0]["Name"];
            this.PresidentShow = profileName;

            if (
              profileName == "President" ||
              profileName == "President" ||
              profileName == "President"
            ) {
              this.dropdownSettingsTypevertical = {
                singleSelection: false,
                idField: "Id",
                textField: "Name",
                itemsShowLimit: 1,
                enableCheckAll: false,
                allowSearchFilter: true,
              };

              // this.GetVerticalList();
              this.addEmployeeForm
                .get("core_vertical")
                .setValidators([Validators.required]);
            } else {
              // this.GetVerticalList();

              this.dropdownSettingsTypevertical = {
                singleSelection: true,
                idField: "Id",
                textField: "Name",
                itemsShowLimit: 1,
                enableCheckAll: false,
                allowSearchFilter: true,
              };

              this.addEmployeeForm.get("core_vertical").setValidators(null);
            }

            this.selectedProfile = result["profileType"];

            if (result["data"]["isSolicitor"]) {
            }
            this.addEmployeeForm.get("core_vertical").updateValueAndValidity();

            if (result["ExperienceType"][0]["Id"] == "Experience") {
              this.ShowExperienceType = true;
            } else {
              this.ShowExperienceType = false;
              this.addEmployeeForm
                .get("last_organization_contact_no")
                .setValidators(null);
            }

            this.addEmployeeForm
              .get("last_organization_contact_no")
              .updateValueAndValidity();
            this.addEmployeeForm.get("saibaId").updateValueAndValidity();
            this.addEmployeeForm.get("bqcNo").updateValueAndValidity();
            this.addEmployeeForm.get("bqcImage").updateValueAndValidity();
            this.addEmployeeForm
              .get("bqcValidityFrom")
              .updateValueAndValidity();
            this.addEmployeeForm.get("bqcValidityTo").updateValueAndValidity();

            if (result["EmployeeType"][0]["Name"] == "Consultant") {
              this.currentCtcLabelValue = "Consultancy Fees";

              this.addEmployeeForm.get("CurrentCTC").setValue("0");
              this.addEmployeeForm.get("CurrentCTC").setValidators(null);

              this.addEmployeeForm.get("FixedCost").setValue("0");
              this.addEmployeeForm.get("FixedCost").setValidators(null);
              this.addEmployeeForm.get("VariablePay").setValue("0");
              this.addEmployeeForm.get("VariablePay").setValidators(null);
          
              this.addEmployeeForm.get("personalEmail").setValidators(null);
              this.addEmployeeForm
                .get("officialEmail")
                .setValidators([Validators.required,Validators.pattern(
                  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                )]);

              this.addEmployeeForm.get("personalMobile").setValidators(null);
              this.addEmployeeForm
                .get("officialMobile")
                .setValidators([Validators.required, Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);
            } else {
              this.addEmployeeForm
                .get("personalEmail")
                .setValidators([Validators.required,Validators.pattern(
                  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                )]);
              this.addEmployeeForm
                .get("officialEmail")
                .setValidators([Validators.required,Validators.pattern(
                  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                )]);

              this.addEmployeeForm
                .get("personalMobile")
                .setValidators([Validators.required,Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);
              this.addEmployeeForm
                .get("officialMobile")
                .setValidators([Validators.required,Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]);

              if (this.splitted2 != "edit-employee") {
                this.currentCtcLabelValue = "Current CTC";

                this.addEmployeeForm.get("CurrentCTC").setValue("");
                this.addEmployeeForm.get("CurrentCTC").setValidators([Validators.required,Validators.pattern("^[0-9]*$")]);

                this.addEmployeeForm.get("FixedCost").setValue("");
                this.addEmployeeForm.get("FixedCost").setValidators([Validators.required,Validators.pattern("^[0-9]*$")]);

                this.addEmployeeForm.get("VariablePay").setValue("0");

              } else {
                this.addEmployeeForm.get("CurrentCTC").setValidators(null);
                this.addEmployeeForm.get("FixedCost").setValidators(null);
                this.addEmployeeForm.get("VariablePay").setValidators(null);
              }
            }

            this.addEmployeeForm.get("CurrentCTC").updateValueAndValidity();
            this.addEmployeeForm.get("FixedCost").updateValueAndValidity();
            this.addEmployeeForm.get("VariablePay").updateValueAndValidity();

            this.addEmployeeForm.get("personalEmail").updateValueAndValidity();
            this.addEmployeeForm.get("officialEmail").updateValueAndValidity();

            this.addEmployeeForm.get("personalMobile").updateValueAndValidity();
            this.addEmployeeForm.get("officialMobile").updateValueAndValidity();

            if (result["solicitor_type"][0]["Name"] == "Yes") {
              this.showSolicitorBox = true;
              this.addEmployeeForm
                .get("saibaId")
                .setValidators([Validators.required]);
              this.addEmployeeForm.get("saibaId").updateValueAndValidity();

              this.addEmployeeForm
                .get("bqcNo")
                .setValidators([Validators.required]);
              this.addEmployeeForm.get("bqcNo").updateValueAndValidity();

              this.addEmployeeForm
                .get("bqcImage")
                .setValidators([Validators.required]);
              this.addEmployeeForm.get("bqcImage").updateValueAndValidity();

              this.addEmployeeForm
                .get("bqcValidityFrom")
                .setValidators([Validators.required]);
              this.addEmployeeForm
                .get("bqcValidityFrom")
                .updateValueAndValidity();

              this.addEmployeeForm
                .get("bqcValidityTo")
                .setValidators([Validators.required]);
              this.addEmployeeForm
                .get("bqcValidityTo")
                .updateValueAndValidity();
            } else {
              this.showSolicitorBox = false;
              this.addEmployeeForm.get("saibaId").setValidators(null);
              this.addEmployeeForm.get("saibaId").updateValueAndValidity();

              this.addEmployeeForm.get("bqcNo").setValidators(null);
              this.addEmployeeForm.get("bqcNo").updateValueAndValidity();

              this.addEmployeeForm.get("bqcImage").setValidators(null);
              this.addEmployeeForm.get("bqcImage").updateValueAndValidity();

              this.addEmployeeForm.get("bqcValidityFrom").setValidators(null);
              this.addEmployeeForm
                .get("bqcValidityFrom")
                .updateValueAndValidity();

              this.addEmployeeForm.get("bqcValidityTo").setValidators(null);
              this.addEmployeeForm
                .get("bqcValidityTo")
                .updateValueAndValidity();
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

  //FORM CONTROLS
  get formControls() {
    return this.addEmployeeForm.controls;
  }

  //SUBMIT FORM DATA
  AddEmployee() {
    this.isSubmitted = true;
    // console.log("this.addEmployeeForm",this.addEmployeeForm);
    console.log(this.addEmployeeForm.invalid, "fdfdfdfdfdfd");
    if (this.addEmployeeForm.invalid) {
      return;
    } else {
      this.api.IsLoading();

      var fields = this.addEmployeeForm.value;

      // console.log();
      var RM = "";

      if (fields["reportingManager"] != undefined) {
        RM = fields["reportingManager"][0]["Id"];
      }
      //Solicitor Details
      var saibaId = "";
      var bqcNo = "";
      var bqcValidityFrom = "";
      var bqcValidityTo = "";
      if (fields["isSolicitor"][0]["Name"] == "Yes") {
        saibaId = fields["saibaId"];
        bqcNo = fields["bqcNo"];
        bqcValidityFrom = fields["bqcValidityFrom"];
        bqcValidityTo = fields["bqcValidityTo"];
      }

      const formData = new FormData();

      if (fields["profile"][0]["Id"] == "108") {
        var Vartical = JSON.stringify(fields["vertical"]);
      } else {
        Vartical = fields["vertical"][0]["Id"];
      }

      var splitted = this.currentUrl.split("/");
      if (typeof splitted[3] != "undefined" && splitted[3] != "") {
        this.idUsed = splitted[3];
        formData.append("OldEmployeeID", this.oldemployeeId);
        var url = "b-crm/Employee/EditEmployee";
      } else {
        var url = "b-crm/Employee/addEmployee";
      }
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("EmployeeType", fields["EmployeeType"][0]["Name"]);
      formData.append("employeeId", fields["employeeId"]);
      formData.append("fullName", fields["fullName"]);
      formData.append("officialEmail", fields["officialEmail"]);
      formData.append("gender", JSON.stringify(fields["Gender"]));

      formData.append("personalEmail", fields["personalEmail"]);
      formData.append("personalMobile", fields["personalMobile"]);
      formData.append("officialMobile", fields["officialMobile"]);
      formData.append("fatherName", fields["fatherName"]);
      formData.append("communicationAddress", fields["communicationAddress"]);
      formData.append("dateOfJoining", fields["dateOfJoining"]);
      formData.append("dateOfBirth", fields["dateOfBirth"]);
      formData.append("isSolicitor", fields["isSolicitor"][0]["Name"]);
      formData.append("saibaId", saibaId);
      formData.append("bqcImage", this.bqcImage);
      formData.append("bqcNo", bqcNo);
      formData.append("bqcValidityFrom", bqcValidityFrom);
      formData.append("bqcValidityTo", bqcValidityTo);
      formData.append("coreLine", JSON.stringify(fields["coreLine"]));
      formData.append("designation", fields["designation"][0]["Id"]);
      formData.append("vertical", Vartical);
      formData.append("profile", fields["profile"][0]["Id"]);
      formData.append("organisation", "Square Insurance");
      formData.append("reportingManager", RM);
      formData.append("zone", fields["zone"][0]["Id"]);
      formData.append("ro", fields["ro"][0]["Id"]);
      formData.append("branch", JSON.stringify(fields["branch"]));
      formData.append("branchAddress", fields["branchAddress"]);
      formData.append("Servicelocation", fields["Servicelocation"][0]["Id"]);

      formData.append("CurrentCTC", fields["CurrentCTC"]);
      formData.append("FixedCost", fields["FixedCost"]);
      formData.append("VariablePay", fields["VariablePay"]);

      formData.append("Is_Sales", fields["Is_Sales"][0]["Id"]);
      formData.append("core_vertical", JSON.stringify(fields["core_vertical"]));
      formData.append("extensionno", fields["extensionno"]);

      formData.append("pincode", fields["pincode"]);

      formData.append(
        "ExperienceType",
        JSON.stringify(fields["ExperienceType"])
      );

      formData.append("blood_group", JSON.stringify(fields["blood_group"]));
      formData.append(
        "emp_experiance",
        JSON.stringify(fields["emp_experiance"])
      );

      formData.append(
        "last_organization_contact_no",
        fields["last_organization_contact_no"]
      );

      formData.append("organization_name", fields["organization_name"]);
      formData.append("LcValidityFrom", fields["LcValidityFrom"]);
      formData.append("LcValidityTo", fields["LcValidityTo"]);
      formData.append("pan_number", fields["pan_number"]);
      formData.append("aadhhar_number", fields["aadhhar_number"]);
      formData.append("emergency_contact_no", fields["emergency_contact_no"]);

      this.api.HttpPostType(url, formData).then(
        (result: any) => {
          if (result["status"] == 1) {
            this.api.HideLoading();

            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["employee/view-employee"]);
          } else {
            this.api.HideLoading();

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

  //===== GET PROFILE DETAILS DATA =====//
  getProfileDetailsData() {
    this.api.IsLoading();
    this.api.HttpGetType("b-crm/Employee/getProfileDetailsData").then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.CoreLineData = result["CorelineData"];
          this.VerticalData = result["VerticalData"];
          this.ProfileData = result["ProfileData"];
          this.DesignationData = result["DesignationData"];
          this.OrganisationData = result["OrganisationData"];
          this.ZoneData = result["ZoneData"];
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

  getProfileDeta() {
    // alert();

    var fields = this.addEmployeeForm.value;

    const formData = new FormData();

    // alert();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Is_Sales", fields["Is_Sales"][0]["Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Employee/getProfileData", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.ProfileData = result["ProfileData"];
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

  //===== SHOW ADDITIONAL VERTICAL INPUT=====//
  showAdditionalVerticalInput() {
    //Profile Conditions
    var profileName = "";
    var profile: any = this.addEmployeeForm.get("profile");

    if (profile.value != "") {
      profileName = profile.value[0].Name;
    }

    this.PresidentShow = profileName;

    if (
      profileName == "President" ||
      profileName == "President" ||
      profileName == "President"
    ) {
      this.dropdownSettingsTypevertical = {
        singleSelection: false,
        idField: "Id",
        textField: "Name",
        itemsShowLimit: 1,
        enableCheckAll: false,
        allowSearchFilter: true,
      };

      this.GetVerticalList();
      this.addEmployeeForm
        .get("core_vertical")
        .setValidators([Validators.required]);
    } else {
      // this.GetVerticalList();

      this.dropdownSettingsTypevertical = {
        singleSelection: true,
        idField: "Id",
        textField: "Name",
        itemsShowLimit: 1,
        enableCheckAll: false,
        allowSearchFilter: true,
      };

      this.addEmployeeForm.get("core_vertical").setValidators(null);
    }

    this.addEmployeeForm.get("reportingManager").setValue("");
    this.addEmployeeForm.get("vertical").setValue("");
    this.addEmployeeForm.get("core_vertical").setValue("");
    this.addEmployeeForm.get("core_vertical").updateValueAndValidity();
  }

  GetVerticalList() {
    var fields = this.addEmployeeForm.value;

    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("ProfileId", fields["profile"][0]["Id"]);

    this.api.IsLoading();

    this.api
      .HttpPostType("b-crm/Employee/getVerticalDataUsingProfile", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.VerticalData = result["vertical"];
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

  GetCoreVerticalData() {
    this.CoreVerticalData = this.addEmployeeForm.get("vertical").value;
  }

  //===== GET PROFILE DETAILS DATA =====//
  getReportingManagers(type) {
    this.GetCoreVerticalData();
    // alert();
    if (type == "add") {
      this.addEmployeeForm.get("reportingManager").setValue("");
    }

    var verticalId = 0;
    var fields = this.addEmployeeForm.value;

    var vertical: any = this.addEmployeeForm.get("vertical");
    if (vertical.value != "") {
      verticalId = vertical.value;
    }

    if (verticalId == 26) {
      this.addEmployeeForm.get("reportingManager").setValidators(null);
      this.addEmployeeForm.get("reportingManager").updateValueAndValidity();
    } else {
      this.addEmployeeForm
        .get("reportingManager")
        .setValidators([Validators.required]);
      this.addEmployeeForm.get("reportingManager").updateValueAndValidity();
    }

    const formData = new FormData();

    // alert();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("vertical", fields["vertical"][0]["Id"]);
    formData.append("ProfileId", fields["profile"][0]["Id"]);
    formData.append("EmployeeType", fields["EmployeeType"][0]["Name"]);
    formData.append("Is_Sales", fields["Is_Sales"][0]["Id"]);

    // console.log(formData);
    // this.api.IsLoading();
    this.api
      .HttpPostType("b-crm/Employee/getReportingManagers", formData)
      .then((result: any) => {
        // alert();

        // this.api.HideLoading();

        if (result["status"] == true) {
          this.ReportingManagerData = result["ReportingManagersData"];
        } else {
          this.ReportingManagerData = [];
          // const msg = 'msg';
          // this.api.Toast('Warning', result['msg']);
        }
      });
  }

  getRoData() {
    this.addEmployeeForm.get("ro").setValue("");
    this.addEmployeeForm.get("branch").setValue("");
    this.addEmployeeForm.get("Servicelocation").setValue("");
    this.BranchData = [];
    this.ServiceLocationData = [];

    var fields = this.addEmployeeForm.value;

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Zone", fields["zone"][0]["Id"]);
    this.api.IsLoading();

    this.api
      .HttpPostType("b-crm/Employee/getRoData", formData)
      .then((result: any) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.ROData = result["ROData"];

          // this.BranchData = result["BranchData"];
          // this.ServiceLocationData = result["ServiceLocationData"];
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  //===== GET BRANCH DATA =====//
  getBranchData() {
    this.addEmployeeForm.get("branch").setValue("");
    this.addEmployeeForm.get("Servicelocation").setValue("");
    this.BranchData = [];
    this.ServiceLocationData = [];

    var fields = this.addEmployeeForm.value;

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Zone", fields["zone"][0]["Id"]);
    formData.append("Ro", fields["ro"][0]["Id"]);
    this.api.IsLoading();

    this.api
      .HttpPostType("b-crm/Employee/getBranchData", formData)
      .then((result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.BranchData = result["BranchData"];
          this.ServiceLocationData = result["ServiceLocationData"];
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  getServiceBranchData() {
    this.addEmployeeForm.get("Servicelocation").setValue("");
    this.ServiceLocationData = [];

    var fields = this.addEmployeeForm.value;

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Zone", fields["zone"][0]["Id"]);
    formData.append("Ro", fields["ro"][0]["Id"]);
    formData.append("Branch", fields["branch"][0]["Id"]);
    this.api.IsLoading();

    this.api
      .HttpPostType("b-crm/Employee/getServiceBranchData", formData)
      .then((result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.ServiceLocationData = result["ServiceLocationData"];
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  //===== GET BRANCH ADDRESS DATA =====//
  getBranchAddress() {
    this.addEmployeeForm.get("branchAddress").setValue("");

    var branch = this.addEmployeeForm.get("branch");
    var branchId = branch.value[0].Id;

    this.api.IsLoading();
    this.api
      .HttpGetType("b-crm/Employee/getBranchAddress")
      .then((result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.addEmployeeForm
            .get("branchAddress")
            .setValue(result["BranchAddress"]);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  //===== SHOW SOLICITOR DETAILS FIELD=====//
  solicitorDetailFields() {
    var solType = this.addEmployeeForm.get("isSolicitor");
    var solTypeValue = solType.value[0].Name;

    if (solTypeValue == "Yes") {
      this.showSolicitorBox = true;
      this.addEmployeeForm.get("saibaId").setValidators([Validators.required]);
      this.addEmployeeForm.get("saibaId").updateValueAndValidity();

      this.addEmployeeForm.get("bqcNo").setValidators([Validators.required]);
      this.addEmployeeForm.get("bqcNo").updateValueAndValidity();

      this.addEmployeeForm.get("bqcImage").setValidators([Validators.required]);
      this.addEmployeeForm.get("bqcImage").updateValueAndValidity();

      this.addEmployeeForm
        .get("bqcValidityFrom")
        .setValidators([Validators.required]);
      this.addEmployeeForm.get("bqcValidityFrom").updateValueAndValidity();

      this.addEmployeeForm
        .get("bqcValidityTo")
        .setValidators([Validators.required]);
      this.addEmployeeForm.get("bqcValidityTo").updateValueAndValidity();
    } else {
      this.showSolicitorBox = false;
      this.addEmployeeForm.get("saibaId").setValidators(null);
      this.addEmployeeForm.get("saibaId").updateValueAndValidity();

      this.addEmployeeForm.get("bqcNo").setValidators(null);
      this.addEmployeeForm.get("bqcNo").updateValueAndValidity();

      this.addEmployeeForm.get("bqcImage").setValidators(null);
      this.addEmployeeForm.get("bqcImage").updateValueAndValidity();

      this.addEmployeeForm.get("bqcValidityFrom").setValidators(null);
      this.addEmployeeForm.get("bqcValidityFrom").updateValueAndValidity();

      this.addEmployeeForm.get("bqcValidityTo").setValidators(null);
      this.addEmployeeForm.get("bqcValidityTo").updateValueAndValidity();
    }
  }

  ExperienceDetailFields() {
    var solType: any = this.addEmployeeForm.get("ExperienceType");
    var solTypeValue = solType.value[0].Name;

    if (solTypeValue == "Experience") {
      this.ShowExperienceType = true;
    } else {
      this.ShowExperienceType = false;
    }
  }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 3) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
        } else {
          if (Type == "BQC_Image") {
            this.bqcImage = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  //===== ON ITEM DESELECT =====//
  onItemDeSelect(type: any) {
    if (type === "Profile") {
      this.addEmployeeForm.get("reportingManager").setValue("");
      this.addEmployeeForm.get("vertical").setValue("");
    }

    if (type === "Vertical") {
      this.addEmployeeForm.get("reportingManager").setValue("");
      this.ReportingManagerData = [];
      this.GetCoreVerticalData();
    }
    if (type === "zone") {
      this.addEmployeeForm.get("ro").setValue("");
      this.addEmployeeForm.get("branch").setValue("");
      this.addEmployeeForm.get("Servicelocation").setValue("");
      this.ROData = [];
      this.BranchData = [];
      this.ServiceLocationData = [];
    }

    if (type === "ro") {
      this.addEmployeeForm.get("branch").setValue("");
      this.addEmployeeForm.get("Servicelocation").setValue("");
      this.BranchData = [];
      this.ServiceLocationData = [];
    }

    if (type === "Branch") {
      this.addEmployeeForm.get("branchAddress").setValue("");
      this.addEmployeeForm.get("Servicelocation").setValue("");
      this.ServiceLocationData = [];
      this.getBranchData();
    }

    if (type === "EmployeeType") {
      this.addEmployeeForm.get("CurrentCTC").setValue("0");
      this.currentCtcLabelValue = "Current CTC";

      this.addEmployeeForm.get("FixedCost").setValue("0");
      this.addEmployeeForm.get("VariablePay").setValue("0");
    }
  }


  //===== ON INPUT CURRENT CTC CALCULATE =====//
  updateCurrentCTC() {
    const fixedCost = this.formControls.FixedCost.value || 0; 
    const variablePay = this.formControls.VariablePay.value || 0; 
    const currentCtc = Number(fixedCost) + Number(variablePay);

    this.addEmployeeForm.get("CurrentCTC").setValue(currentCtc);
  }


} //END CODE
