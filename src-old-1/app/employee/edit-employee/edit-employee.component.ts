import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-employee",
  templateUrl: "./edit-employee.component.html",
  styleUrls: ["./edit-employee.component.css"],
})
export class EditEmployeeComponent implements OnInit {
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
  loginType: string;
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
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
          ),
        ],
      ],
      officialEmail: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
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
      secondaryVertical: [""],
      grade: [""],
      organisation: [""],
      reportingManager: [""],
      zone: ["", [Validators.required]],
      branch: ["", [Validators.required]],
      branchAddress: [""],
      Servicelocation: ["", [Validators.required]],
      CurrentCTC: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        ],
      ],
      Is_Sales: ["", [Validators.required]],
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
    this.currentUrl = this.router.url;
    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();

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

    this.getProfileDetailsData();

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[3] != "undefined" && splitted[3] != "") {
      this.idUsed = splitted[3];
      this.fetchEmployeeDetails();
      this.EmployeeIdreadonly = false;
    }
  }

  CheckEmployeeType() {
    var fields = this.addEmployeeForm.value;

    var EmployeeType = fields["EmployeeType"][0]["Name"];

    if (EmployeeType == "Consultant") {
      this.currentCtcLabelValue = "Consultancy Fees";
    } else {
      this.currentCtcLabelValue = "Current CTC";
      // this.addEmployeeForm.get("CurrentCTC").setValidators([Validators.pattern("^[1-9]*$")]);
    }
  }

  //===== GET SURVEY DETAILS=====//
  fetchEmployeeDetails() {
    const formData = new FormData();
    formData.append("id", this.idUsed);

    this.api
      .HttpPostType("b-crm/Employee/getSingleEmployeeDetails", formData)
      .then(
        (result) => {
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
            this.selectedBranch = result["branch"];
            this.selectedOpsBranch = result["reportingBranch"];

            // alert(result["profileType"][0]['Id']);
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
            this.selectedProfile = result["profileType"];

            this.selectedOpsBranch = result["reportingBranch"];

            if (result["data"]["isSolicitor"] == "Yes") {
              this.addEmployeeForm
                .get("saibaId")
                .setValidators([
                  Validators.required,
                  Validators.pattern("^[a-zA-Z0-9]*$"),
                ]);
              this.addEmployeeForm.get("bqcNo").setValidators(null);
              this.addEmployeeForm.get("bqcImage").setValidators(null);
              this.addEmployeeForm.get("bqcValidityFrom").setValidators(null);
              this.addEmployeeForm.get("bqcValidityTo").setValidators(null);
            } else {
              this.addEmployeeForm.get("saibaId").setValidators(null);
              this.addEmployeeForm.get("bqcNo").setValidators(null);
              this.addEmployeeForm.get("bqcImage").setValidators(null);
              this.addEmployeeForm.get("bqcValidityFrom").setValidators(null);
              this.addEmployeeForm.get("bqcValidityTo").setValidators(null);
            }

            this.addEmployeeForm.get("saibaId").updateValueAndValidity();
            this.addEmployeeForm.get("bqcNo").updateValueAndValidity();
            this.addEmployeeForm.get("bqcImage").updateValueAndValidity();
            this.addEmployeeForm
              .get("bqcValidityFrom")
              .updateValueAndValidity();
            this.addEmployeeForm.get("bqcValidityTo").updateValueAndValidity();

            this.BranchData = result["BranchData"];
            this.ServiceLocationData = result["ServiceLocationData"];
            this.ReportingManagerData = result["ReportingManagersData"];
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
  EditEmployee() {
    alert(121);
    this.isSubmitted = true;

    console.log(this.addEmployeeForm.invalid);
    if (this.addEmployeeForm.invalid) {
      alert("error");
      return;
    } else {
      // alert();
      var fields = this.addEmployeeForm.value;
      var RM = "";

      if (fields["reportingManager"] != undefined) {
        RM = fields["reportingManager"][0]["Id"];
      }

      //Solicitor Details
      var saibaId = "";
      var bqcNo = "";
      var bqcValidityFrom = "";
      var bqcValidityTo = "";

      const formData = new FormData();

      if (fields["profile"][0]["Id"] == "108") {
        var Vartical = JSON.stringify(fields["vertical"]);
      } else {
        Vartical = fields["vertical"][0]["Id"];
      }

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("OldEmployeeID", this.oldemployeeId);
      formData.append("EmployeeType", fields["EmployeeType"][0]["Name"]);
      formData.append("employeeId", fields["employeeId"]);
      formData.append("fullName", fields["fullName"]);
      formData.append("officialEmail", fields["officialEmail"]);
      formData.append("personalEmail", fields["personalEmail"]);
      formData.append("personalMobile", fields["personalMobile"]);
      formData.append("officialMobile", fields["officialMobile"]);
      formData.append("fatherName", fields["fatherName"]);
      formData.append("communicationAddress", fields["communicationAddress"]);
      formData.append("dateOfJoining", fields["dateOfJoining"]);
      formData.append("dateOfBirth", fields["dateOfBirth"]);
      formData.append("isSolicitor", fields["isSolicitor"][0]["Name"]);
      formData.append("saibaId", fields["saibaId"]);
      formData.append("bqcImage", this.bqcImage);
      formData.append("bqcNo", fields["bqcNo"]);
      formData.append("bqcValidityFrom", fields["bqcValidityFrom"]);
      formData.append("bqcValidityTo", fields["bqcValidityTo"]);
      formData.append("coreLine", JSON.stringify(fields["coreLine"]));
      formData.append("designation", fields["designation"][0]["Id"]);
      formData.append("vertical", Vartical);
      formData.append("profile", fields["profile"][0]["Id"]);
      formData.append("organisation", "Square Insurance");
      formData.append("reportingManager", RM);
      formData.append("zone", fields["zone"][0]["Id"]);
      formData.append("branch", fields["branch"][0]["Id"]);
      formData.append("branchAddress", fields["branchAddress"]);
      formData.append("Servicelocation", fields["Servicelocation"][0]["Id"]);
      formData.append("CurrentCTC", fields["CurrentCTC"]);
      formData.append("Is_Sales", fields["Is_Sales"][0]["Id"]);

      this.api.HttpPostType("b-crm/Employee/EditEmployee", formData).then(
        (result:any) => {
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["employee/view-employee"]);
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

  //===== GET PROFILE DETAILS DATA =====//
  getProfileDetailsData() {
    this.api.IsLoading();
    this.api.HttpGetType("b-crm/Employee/getProfileDetailsData").then(
      (result:any) => {
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

  //===== SHOW ADDITIONAL VERTICAL INPUT=====//
  showAdditionalVerticalInput() {
    //Profile Conditions
    var profileName = "";
    var profile = this.addEmployeeForm.get("profile");
    if (profile.value != "") {
      profileName = profile.value[0].Name;
    }

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
    } else {
      this.getProfileDetailsData();
    }
    this.addEmployeeForm.get("reportingManager").setValue("");
    this.addEmployeeForm.get("vertical").setValue("");
  }

  GetVerticalList() {
    this.api.IsLoading();
    this.api.HttpGetType("b-crm/Employee/getVerticalDataUsingProfile").then(
      (result:any) => {
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

  //===== GET PROFILE DETAILS DATA =====//
  getReportingManagers(type) {
    // alert();
    if (type == "add") {
      this.addEmployeeForm.get("reportingManager").setValue("");
    }

    var verticalId = 0;
    var fields = this.addEmployeeForm.value;

    var vertical = this.addEmployeeForm.get("vertical");
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
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("vertical", fields["vertical"][0]["Id"]);
    formData.append("ProfileId", fields["profile"][0]["Id"]);
    formData.append("EmployeeType", fields["EmployeeType"][0]["Name"]);
    // console.log(formData);
    // this.api.IsLoading();
    this.api
      .HttpPostType("b-crm/Employee/getReportingManagers", formData)
      .then((result:any) => {
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
    this.api.IsLoading();

    this.api
      .HttpPostType("b-crm/Employee/getBranchData", formData)
      .then((result:any) => {
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

  //===== GET BRANCH ADDRESS DATA =====//
  getBranchAddress() {
    this.addEmployeeForm.get("branchAddress").setValue("");

    var branch = this.addEmployeeForm.get("branch");
    var branchId = branch.value[0].Id;

    this.api.IsLoading();
    this.api.HttpGetType("b-crm/Employee/getBranchAddress").then((result:any) => {
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
    }

    if (type === "Zone") {
      this.addEmployeeForm.get("branch").setValue("");
      this.BranchData = [];
    }

    if (type === "Branch") {
      this.addEmployeeForm.get("branchAddress").setValue("");
      this.addEmployeeForm.get("Servicelocation").setValue("");
    }

    if (type === "EmployeeType") {
      this.addEmployeeForm.get("CurrentCTC").setValue("0");
      this.currentCtcLabelValue = "Current CTC";
    }
  }
} //END CODE
