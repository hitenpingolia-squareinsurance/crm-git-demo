import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { empty } from "rxjs";
declare var $: any;

@Component({
  selector: "app-addpos",
  templateUrl: "./addpos.component.html",
  styleUrls: ["./addpos.component.css"],
})
export class AddposComponent implements OnInit {
  addPosForm: FormGroup;
  AadharOtp: FormGroup;
  isSubmitted = false;
  isSubmitted_otp = false;
  buttonDisable = false;
  selectedFiles: File;
  uploadpancard: File;
  aadharcardfront: File;
  aadharcardback: File;
  graduationfile: File;
  cheque: File;
  profile: File;
  signature: File;
  otherimage: File;
  Pincode_Ar: any = [];

  gender: any = "";
  qualification: any = "";
  accounttype: any = "";
  GstData: any = "";
  GstValue: any;
  client_id: any;

  occupationData: any[] = [];

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };
  PincodData_Ar: any;
  City_Ar: any;
  District_Ar: any;
  State_Ar: any;
  BankName_Ar: any;
  AccountType_Ar: any;
  ItemLOBSelection: any;
  ReadonlyPancard = false;
  Partnersourcevalue: { Id: string; Name: string }[];
  partner: { Id: string; Name: string }[];
  partnervv: { Id: string; Name: string }[];
  logintype: string;
  disabledpartnersource = true;
  disabledpartnersource1: string;
  currentUrl: any;
  AgentIdGet: any;
  selectedgender: any;
  selecteddob: any;
  selectedstate: any;
  selectedcity: any;
  selectedbankname: any;
  selectedaccounttype: any;
  selectedqualification: any;
  ReportingManeger: any;
  referenceData: any;
  urlSegment: any;
  urlSegmentRoot: any;
  urlSegmentSub: any;
  pincode: any;
  Pincode_data_Ar: any;
  StateName: any;
  cityName: any;
  pincodedata: any;
  leadnumber: any = "";
  additionalmobile: any;
  timerId: any;
  enteredOTP: any;
  ResendOtpButton2: boolean = false;
  otpValueCheck: number;
  verifyOtpVal: number = 0;
  gst_status: any;
  gstValEdit: any;
  gstCertificate: File;
  gstAgreement: File;
  selectedOccupation: any;
  occupationVAl: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (
        params["leadnumber"] != "undefined" &&
        params["leadnumber"] != "" &&
        params["leadnumber"] != undefined
      ) {
        this.leadnumber = params["leadnumber"];
      }
    });

    if (this.leadnumber !== "") {
      this.additionalmobile = this.leadnumber;
    }
    this.currentUrl = this.router.url;
    const segments = this.currentUrl.split("/");
    const action = segments[2];
    this.urlSegment = segments[2];
    //   //   //   console.log(this.urlSegment);
    //   //   //   console.log(this.currentUrl);

    if (action == "Edit-pos") {
      this.ReadonlyPancard = true;
    }

    this.disabledpartnersource1 = "display:none";
    this.dropdownSettingsType = {
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
      defaultOpen: false,
      limitSelection: 5,
    };

    //   this.dropdownSettingsType = {
    //   singleSelection: false,
    //   idField: 'Id',
    //   textField: 'Name',
    //   itemsShowLimit: 1,
    //   enableCheckAll: false,
    //   allowSearchFilter: true,

    // };
    this.gender = [
      { Id: "male", Name: "male" },
      { Id: "female", Name: "female" },
    ];

    // this.Partnersourcevalue = [
    //   { Id: "emitra", Name: "eMitra" },
    //   { Id: "other", Name: "Other" },
    //   // { Id: "rislemitra", Name: "RISL-eMitra" },
    //   // { Id: "nobel", Name: "Nobel" },
    // ];

    this.qualification = [
      { Id: "10 pass", Name: "10 pass" },
      { Id: "12 pass", Name: "12 pass" },
      { Id: "Graduation", Name: "Graduation" },
      { Id: "Post Graduation", Name: "Post Graduation" },
    ];
    this.accounttype = [
      { Id: "5", Name: "Saving Account" },
      { Id: "4", Name: "Current Account" },
    ];

    this.GstData = [
      { Id: "Yes", Name: "Yes" },
      { Id: "No", Name: "No" },
    ];

    this.GstData = [
      { Id: "Yes", Name: "Yes" },
      { Id: "No", Name: "No" },
    ];

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[3] != "undefined" && splitted[3] != "") {
      this.AgentIdGet = splitted[3];
      this.GetPosDetails();
    }

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

    this.addPosForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z ]*$")]],

      // firstname: ["", [Validators.required, Validators.pattern("[a-zA-Z ]*$")]],

      // middlename: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      // lastname: ["", [Validators.pattern("[a-zA-Z ]*$")]],

      secondaryname: [""],
      gender: ["", [Validators.required]],
      dob: ["", Validators.required],
      mobileno: [
        "",
        [
          Validators.required,

          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        ],
      ],

      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
        ],
      ],
      additionalmobile: [
        "",
        [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")],
      ],
      // password: ["", Validators.required],
      reference: [""],
      // confirmpassword: ["", Validators.required],

      qualification: ["", Validators.required],
      pancard: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"),
        ],
      ],
      // pancard: ['', [Validators.required, this.panCardValidator()]],
      aadharno: ["", [Validators.required,Validators.pattern("[0-9]{12}")]],
      address1: ["", Validators.required],
      address2: [""],
      address3: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      pincode: ["", [Validators.required, Validators.pattern("[0-9]{6}")]],
      bankname: ["", Validators.required],
      branchname: ["", Validators.required],
      accounttype: ["", Validators.required],
      accountnumber: ["", Validators.required],
      ifsccode: ["", Validators.required],
      uploadpancard: ["", Validators.required],
      aadharcardfront: [""],
      aadharcardback: [""],
      graduationfile: ["", Validators.required],
      cheque: ["", Validators.required],
      profile: ["", Validators.required],
      signature: ["", Validators.required],
      // Partnersource: ["", Validators.required],
      otherimage: [""],
      Gst: ["", Validators.required],
      occupation: ["", Validators.required],
      gstno: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
          ),
        ],
      ],
      gstaddress: [""],
      gstCertificate: [""],
      gstAgreement: [""],
    });

    this.AadharOtp = this.formBuilder.group({
      OTP: ["", Validators.required],
    });

    const gstno = this.addPosForm.get("gstno");
    const gstaddress = this.addPosForm.get("gstaddress");
    const gstCertificate = this.addPosForm.get("gstCertificate");
    const gstAgreement = this.addPosForm.get("gstAgreement");

    this.addPosForm.get("Gst").valueChanges.subscribe((value) => {
      if (value && value.length > 0) {
        this.GstValue = value[0].Id;

        if (this.GstValue == "Yes") {
          gstno.setValidators(Validators.required);
          gstaddress.setValidators(Validators.required);
          if (action == "Edit-pos") {
            gstCertificate.setValidators(null);
            gstAgreement.setValidators(null);
          } else {
            gstCertificate.setValidators(Validators.required);
            gstAgreement.setValidators(Validators.required);
          }
        } else {
          gstno.setValidators(null);
          gstaddress.setValidators(null);
          gstCertificate.setValidators(null);
          gstAgreement.setValidators(null);
        }
        gstno.updateValueAndValidity();
        gstaddress.updateValueAndValidity();
        gstCertificate.updateValueAndValidity();
        gstAgreement.updateValueAndValidity();
      }
    });

    this.UserAgent_Filter();
    this.logintype = this.api.GetUserType();

    // this.addPosForm.get("firstname").setValue('');
    // this.partnervv = [{ Id: "other", Name: "Other" }];
  }

  ngOnInit() {
    this.loadAgentOccupancy("", 0);
    // console.log(this.urlSegment);
    // Use 'queryParams' to get query parameters from the URL

    $("#disabledpartnersourcedisplay").css("display", "none");

    if (this.api.GetUserType() == "employee") {
      this.disabledpartnersource = false;
      $("#disabledpartnersourcedisplay").css("display", "block");
    }
  }

  // const pancard = this.addPosForm.get("pancard");
  // pancard.updateValueAndValidity();

  validatePanCard(inputValue: string): boolean {
    const alphaPart = inputValue.substring(0, 5);
    const numericPart = inputValue.substring(5, 9);
    const lastAlphaPart = inputValue.substring(9);

    const alphaRegex = /^[A-Z]+$/;
    const numericRegex = /^[0-9]+$/;

    if (
      alphaRegex.test(alphaPart) &&
      numericRegex.test(numericPart) &&
      alphaRegex.test(lastAlphaPart)
    ) {
      // console.log("Valid PAN card format:", inputValue);
      return true;
    } else {
      // console.log("Invalid PAN card format:", inputValue);
      return false;
    }
  }

  onPanCardInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toUpperCase();

    const alphaPart = inputValue.substring(0, 5);
    const numericPart = inputValue.substring(5, 9);
    const lastAlphaPart = inputValue.substring(9);

    let updatedValue = "";

    if (alphaPart !== "" && this.isValid(alphaPart, /^[A-Z]+$/)) {
      updatedValue += alphaPart;
    } else {
      updatedValue += alphaPart.slice(0, -1);
    }

    if (numericPart !== "" && this.isValid(numericPart, /^[0-9]+$/)) {
      updatedValue += numericPart;
    } else {
      updatedValue += numericPart.slice(0, -1);
    }

    if (lastAlphaPart !== "" && this.isValid(lastAlphaPart, /^[A-Z]+$/)) {
      updatedValue += lastAlphaPart;
    } else {
      updatedValue += lastAlphaPart.slice(0, -1);
    }

    this.addPosForm.get("pancard").setValue(updatedValue);
  }

  private isValid(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }

  // PincodeVerifyclose() {
  //   // document.getElementById("pancard").readOnly = false;
  //   // document.getElementById("clickcheckpoupupCheck").style.display = "block";
  //   // document.getElementById("clickcheckpoupupClose").style.display = "none";
  //   this.ReadonlyPancard = false;
  //   $("#clickcheckpincodeCheck").css("display", "block");
  //   $("#clickcheckpincodeClose").css("display", "none");

  //   this.addPosForm.get("state").setValue("");
  //   this.addPosForm.get("city").setValue("");
  //   this.addPosForm.get("pincode").setValue("");
  // }

  PancardVerifyclose() {
    // document.getElementById("pancard").readOnly = false;
    // document.getElementById("clickcheckpoupupCheck").style.display = "block";
    // document.getElementById("clickcheckpoupupClose").style.display = "none";
    this.ReadonlyPancard = false;
    $("#clickcheckpoupupCheck").css("display", "block");
    $("#clickcheckpoupupClose").css("display", "none");

    this.addPosForm.get("name").setValue("");
    // this.addPosForm.get("middlename").setValue("");
    // this.addPosForm.get("lastname").setValue("");
    this.addPosForm.get("pancard").setValue("");
  }

  PancardVerify() {
    if (this.addPosForm.get("pancard").invalid) {
      return false;
    } else {
      var fields = this.addPosForm.value;

      const formData = new FormData();

      formData.append("pancard", fields["pancard"]);
      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("MyPos/pencardverify", formData).then(
        (result:any) => {
     
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.ReadonlyPancard = true;

            $("#clickcheckpoupupClose").css("display", "block");
            $("#clickcheckpoupupCheck").css("display", "none");

            this.addPosForm.get("name").setValue(result["FristName"]  +' '+ result["MiddleName"] +' '+ result["LastName"]);
            // this.addPosForm.get("middlename").setValue(result["MiddleName"]);
            // this.addPosForm.get("lastname").setValue(result["LastName"]);
          } else {
            this.addPosForm.get("name").setValue("");
            // this.addPosForm.get("middlename").setValue("");
            // this.addPosForm.get("lastname").setValue("");

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

  loadAgentOccupancy(e, Type): void {
    let searchQuery = "";

    if (Type === 1) {
      searchQuery = e.target.value; // Get the input value when user types
    }

    let formData = new FormData();
    formData.append("val", searchQuery); // Pass search query

    this.api.IsLoading(); // Show loading indicator

    // API call to fetch vendor types based on user input
    this.api.HttpPostType("MyPos/fetchAgentOccupation", formData).then(
      (resp: any) => {
        this.api.HideLoading(); // Hide loading indicator

        if (resp && resp.data && resp.data.length > 0) {
          this.occupationData = resp.data; // Store vendor types
          //   //   //   console.log('Fetched Vendor Types:', this.vendorTypes);
        } else {
          // console.warn('No vendor types found');
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error fetching vendor types:", err);
      }
    );
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg") {
        // console.log("Extenstion is vaild !");

        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 2048) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 1 mb");

          if (Type == "uploadpancard") {
            this.addPosForm.get("uploadpancard").setValue("");
          }

          if (Type == "aadharcardfront") {
            this.addPosForm.get("aadharcardfront").setValue("");
          }

          if (Type == "aadharcardback") {
            this.addPosForm.get("aadharcardback").setValue("");
          }

          if (Type == "graduationfile") {
            this.addPosForm.get("graduationfile").setValue("");
          }

          if (Type == "cheque") {
            this.addPosForm.get("cheque").setValue("");
          }

          if (Type == "profile") {
            this.addPosForm.get("profile").setValue("");
          }
          if (Type == "signature") {
            this.addPosForm.get("signature").setValue("");
          }
          if (Type == "otherimage") {
            this.addPosForm.get("otherimage").setValue("");
          }
        } else {
          if (Type == "uploadpancard") {
            this.uploadpancard = this.selectedFiles;
          }
          if (Type == "aadharcardfront") {
            this.aadharcardfront = this.selectedFiles;
          }
          if (Type == "aadharcardback") {
            this.aadharcardback = this.selectedFiles;
          }
          if (Type == "graduationfile") {
            this.graduationfile = this.selectedFiles;
          }
          if (Type == "cheque") {
            this.cheque = this.selectedFiles;
          }
          if (Type == "profile") {
            this.profile = this.selectedFiles;
          }
          if (Type == "signature") {
            this.signature = this.selectedFiles;
          }
          if (Type == "otherimage") {
            this.otherimage = this.selectedFiles;
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

  UploadDocsGST(event, Type) {
    this.selectedFiles = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);

      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log("Extenstion is vaild !");

        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 2048) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 1 mb");

          if (Type == "gstCertificate") {
            this.addPosForm.get("gstCertificate").setValue("");
          }
          if (Type == "gstAgreement") {
            this.addPosForm.get("gstAgreement").setValue("");
          }
        } else {
          if (Type == "gstCertificate" && this.GstValue == "Yes") {
            this.gstCertificate = this.selectedFiles;
          }
          if (Type == "gstAgreement" && this.GstValue == "Yes") {
            this.gstAgreement = this.selectedFiles;
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

  get formControls() {
    return this.addPosForm.controls;
  }

  get FormC() {
    return this.AadharOtp.controls;
  }

  AddPosFormSubmit() {
    this.isSubmitted = true;
    this.isSubmitted_otp = true;
    var fields = this.addPosForm.value;

    if (this.addPosForm.invalid) {
      return;
    }
    if (this.GstValue == "Yes") {
      var Aadharfields = this.AadharOtp.value;
    }
    //   //   //   console.log(this.addPosForm);

    if (this.addPosForm.invalid && this.GstValue == "Yes") {
      // if(this.verifyOtpVal == 0){
      this.api.Toast(
        "Warning",
        "Please first Verify Your aadhar verification !"
      );
      // }

      return false;
    } else {
      this.buttonDisable = true;

      var fields = this.addPosForm.value;
      const formData = new FormData();

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      // formData.append("firstname", fields["firstname"]);
      // formData.append("middlename", fields["middlename"]);
      // formData.append("lastname", fields["lastname"]);

      formData.append("name", fields["name"]);
      formData.append("title", fields["secondaryname"]);

      formData.append("gender", fields["gender"][0]["Id"]);
      formData.append("dob", fields["dob"]);
      formData.append("mobileno", fields["mobileno"]);
      formData.append("email", fields["email"]);

      formData.append("additionalmobile", fields["additionalmobile"]);

      // formData.append("password", fields["password"]);
      // formData.append("confirmpassword", fields["confirmpassword"]);

      formData.append("qualification", fields["qualification"][0]["Id"]);
      formData.append("pancard", fields["pancard"]);
      formData.append("aadharno", fields["aadharno"]);

      formData.append("address1", fields["address1"]);
      formData.append("address2", fields["address2"]);
      formData.append("address3", fields["address3"]);
      formData.append("state", fields["state"]);
      formData.append("city", fields["city"]);
      formData.append("pincode", fields["pincode"]);

      // formData.append("Partnersource", fields["Partnersource"][0]["Id"]);
      formData.append("bankname", fields["bankname"][0]["Id"]);
      formData.append("branchname", fields["branchname"]);
      formData.append("accounttype", fields["accounttype"][0]["Id"]);
      formData.append("accountnumber", fields["accountnumber"]);
      formData.append("ifsccode", fields["ifsccode"]);

      formData.append("uploadpancard", this.uploadpancard);
      formData.append("aadharcardfront", this.aadharcardfront);
      formData.append("aadharcardback", this.aadharcardback);
      formData.append("graduationfile", this.graduationfile);
      formData.append("cheque", this.cheque);
      formData.append("profile", this.profile);
      formData.append("signature", this.signature);
      formData.append("otherimage", this.otherimage);
      formData.append("gstcertificate", this.gstCertificate);
      formData.append("gst_agreement", this.gstAgreement);

      formData.append("occupation", fields["occupation"][0]["Id"]);

      // formData.append("leadnumber", this.leadnumber);

      formData.append("Gst", this.GstValue);
      formData.append("Gstno", fields["gstno"]);
      formData.append("Gst_Address", fields["gstaddress"]);
      //   //   //   console.log(this.AadharOtp.value);

      var url = "MyPos/add_agent";
      var splitted = this.currentUrl.split("/");
      if (typeof splitted[3] != "undefined" && splitted[3] != "") {
        this.AgentIdGet = splitted[3];
        formData.append("AgentId", this.AgentIdGet);
        var url = "MyPos/Edit_agent";
        formData.append(
          "reference",
          JSON.stringify(fields["reference"][0]["Id"])
        );
      } else {
        formData.append("reference", fields["reference"]);
      }

      if (url == "MyPos/add_agent" || url == "MyClient/Add-client") {
        if (this.otpValueCheck != 1) {
          this.initiateDownload("Sent");
          return;
        }
      }

      this.api.IsLoading();

      this.api.HttpPostType(url, formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == 1) {
            this.buttonDisable = false;
            var fields = this.addPosForm.reset();

            this.api.Toast("Success", result["msg"]);
            var splitted = this.currentUrl.split("/");

            if (typeof splitted[3] != "undefined" && splitted[3] != "") {
              this.GetPosDetails();
            } else {
              // const Closebutton = document.getElementById("ClodeOtpModel");
              // Closebutton.click();
              this.router.navigate(["Mypos/View-pos"]);
            }
          } else if (result["Status"] == 2) {
            return this.addPosForm.controls;
          } else {
            this.buttonDisable = false;

            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.buttonDisable = false;

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

  UserAgent_Filter() {
    this.api.HttpGetType("MyPos/GetAllFilter").then(
      (result) => {
        //this.api.HideLoading();

        if (result["Status"] == true) {
          this.State_Ar = result["Data"]["State"];
          this.BankName_Ar = result["Data"]["BankName"];
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
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }

  onItemSelect(item: any, Type: any) {
    this.addPosForm.get("city").setValue("");
    // console.log("Type : " + Type);
    // console.log("onItemSelect", item);
    if (Type == "State") {
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneSelect");
    }
  }

  onItemDeSelect(item: any, Type) {
    this.addPosForm.get("city").setValue("");

    if (Type == "State") {
      var index = (this.ItemLOBSelection = item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneDeSelect");
    }
  }

  GetCItyFilter(e) {
    var fields = this.ItemLOBSelection;

    const formData = new FormData();

    formData.append("StateId", this.ItemLOBSelection);
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("MyPos/CityFilter", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.City_Ar = result["Data"]["City"];
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

  PincodeVerify(e) {
    if (e.length < 5) {
      $("#ShowStateName").css("display", "none");
      $("#ShowCityName").css("display", "none");
      this.addPosForm.get("state").setValue("");
      this.addPosForm.get("city").setValue("");
    }
    if (e.length > 5) {
      this.addPosForm.get("state").setValue("");
      this.addPosForm.get("city").setValue("");

      this.api.HttpGetType("Geographically/VerifyPincode?Pincode=" + e).then(
        (result: any) => {
          //this.api.HideLoading();

          if (result["status"] == true) {
            //this.api.Toast('Success',result['msg']);
            // this.Pincode_Ar = result["data"];

            $("#ShowStateName").css("display", "block");
            $("#ShowCityName").css("display", "block");

            this.Pincode_data_Ar = result["data"];
            this.StateName = this.Pincode_data_Ar[0]["state_Name"];
            this.cityName = this.Pincode_data_Ar[0]["city_Name"];

            this.addPosForm.get("state").setValue(this.StateName);
            this.addPosForm.get("city").setValue(this.cityName);

            //// console.log(result['data']);
          } else {
            this.api.Toast(
              "Warning",
              "State & City Not found on this pincode !"
            );
            // this.api.Toast('Warning',result['msg']);
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
  }

  SearchPincodes(e, Type) {
    var pincode = "";
    if (Type == 1) {
      pincode = e.target.value;
    }
    this.api
      .HttpGetType("Geographically/RoleGetPincodeData?Pincode=" + pincode)
      .then(
        (result: any) => {
          //this.api.HideLoading();

          if (result["status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.Pincode_Ar = result["data"];
            //// console.log(result['data']);
          } else {
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

  GetPincodeDetails(item: any, type: any) {
    this.api.IsLoading();
    this.api
      .HttpGetType("Geographically/RoleGetStateCityDistrictData?Id=" + item.Id)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            let row = result["data"];
            this.PincodData_Ar = row;
            this.addPosForm.get("state").setValue(row.State_Name);
            this.addPosForm.get("city").setValue(row.City_or_Village_Name);
          } else {
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

  GetPosDetails() {
    if (this.AgentIdGet != "") {
      const formData = new FormData();
      formData.append("Id", this.AgentIdGet);

      this.api.HttpPostType("PospManegment/getSinglePosDetails", formData).then(
        (result: any) => {
          if (result["status"] == true) {
            this.getEmployee();

            // this.oldemployeeId = result["data"]["employeeId"];
            this.addPosForm.patchValue(result["data"]);
            this.gstValEdit = result["data"].gstno;

            //   //   //   console.log(this.gstValEdit);
            this.selecteddob = result["data"]["dob"];
            this.selectedstate = result["state"];
            this.selectedcity = result["city"];
            this.selectedbankname = result["bankname"];
            this.selectedaccounttype = result["accounttype"];
            this.selectedgender = result["gender"];
            this.selectedqualification = result["Qualificaton"];
            this.ReportingManeger = result["ReportingManeger"];

            this.gst_status = result["gst_status"];
            this.selectedOccupation = result["agent_occupation"];
            this.occupationVAl = result["occupation"];

            // if(result["gst_status"] == '' || result["gst_status"] == null || result["gst_status"] == undefined || result["gst_status"] == 'No'){
            //   this.gst_status = [{ Id: "No", Name: "No" }];
            // }else{
            //   this.gst_status = [{ Id: "Yes", Name: "Yes" }];
            // }

            this.partnervv = this.partnervv;
            this.pincodedata = result["data"]["pincode"];

            this.PincodeVerify(this.pincodedata);

            this.PancardVerify();

            const uploadpancard = this.addPosForm.get("uploadpancard");
            const aadharcardfront = this.addPosForm.get("aadharcardfront");
            const aadharcardback = this.addPosForm.get("aadharcardback");
            const graduationfile = this.addPosForm.get("graduationfile");
            const cheque = this.addPosForm.get("cheque");
            const profile = this.addPosForm.get("profile");
            const signature = this.addPosForm.get("signature");
            const reference = this.addPosForm.get("reference");

            uploadpancard.setValidators(null);
            aadharcardfront.setValidators(null);
            aadharcardback.setValidators(null);
            graduationfile.setValidators(null);
            cheque.setValidators(null);
            profile.setValidators(null);
            signature.setValidators(null);
            reference.setValidators([Validators.required]);

            reference.updateValueAndValidity();
            uploadpancard.updateValueAndValidity();
            aadharcardfront.updateValueAndValidity();
            aadharcardback.updateValueAndValidity();
            graduationfile.updateValueAndValidity();
            cheque.updateValueAndValidity();
            profile.updateValueAndValidity();
            signature.updateValueAndValidity();
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

  getEmployee() {
    const formData = new FormData();

    this.api.HttpPostType("MyPos/GetEmployee", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.referenceData = result["Data"];
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

  // new

  initiateDownload(OTP_mass: any) {
    var fields = this.addPosForm.value;
    let Mobile = fields["mobileno"];
    var timeSec = 60;
    const formData = new FormData();

    formData.append("OTP_mass", OTP_mass);
    formData.append("Mobile", Mobile);

    this.api.IsLoading();
    this.api.HttpPostType("MyPos/otpSend", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] === 1) {
          this.api.Toast("Success", result["msg"]);
          clearInterval(this.timerId);

          if (OTP_mass === "Sent") {
            $("#OtpSendChack").modal("show");
          }

          // Disable the button and start the timer
          this.ResendOtpButton2 = true;
          this.timerId = setInterval(() => {
            timeSec--;
            const buttonElement = document.getElementById("ResendOtpButton2");

            if (buttonElement) {
              buttonElement.innerHTML = `${timeSec} Sec`;
            }

            if (timeSec === 1) {
              clearInterval(this.timerId);
              this.ResendOtpButton2 = false; // Enable the button again
              timeSec = 60;
              if (buttonElement) {
                buttonElement.innerHTML = "Resend";
              }
            }
          }, 1000);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }

  // NewSendType
  verifyOTP() {
    const formData = new FormData();
    formData.append("otp", this.enteredOTP);
    this.api.IsLoading();
    this.api.HttpPostType("MyPos/verifyOTP", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.enteredOTP = "";
          this.otpValueCheck = 1;
          $("#OtpSendChack").modal("hide");
          this.api.Toast("Success", result["msg"]);
          this.AddPosFormSubmit();
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

  SendOtp() {
    var fields = this.addPosForm.value;
    if (fields["aadharno"] == "") {
      this.api.Toast("Warning", "Please Enter Aadhar No.");
    } else {
      const formdata = new FormData();
      formdata.append("aadharno", fields["aadharno"]);

      this.api.HttpPostType("MyPos/verify_AadharOTP", formdata).then(
        (result: any) => {
          if (result["message_code"] == "success") {
            this.api.Toast("Success", "OTP Sent Successfully");
            $("#exampleModal").modal("show");
            this.client_id = result["data"].client_id;
            //   //   //   console.log(this.client_id);
          } else {
            this.api.Toast("Warning", result["message_code"]);
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

  AadharOtp_Form() {
    this.isSubmitted_otp = true;
    var Aadharfields = this.AadharOtp.value;
    if (this.AadharOtp.invalid) {
      return;
    } else {
      const formData = new FormData();
      formData.append("client_id", this.client_id);
      formData.append("otp", Aadharfields["OTP"]);
      this.api.IsLoading();
      this.api.HttpPostType("MyPos/OtpVerify", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 2) {
            this.api.Toast("Success", "OTP Verified");
            this.verifyOtpVal = 1;
            $("#exampleModal").modal("hide");

            // const Closebutton = document.getElementById("CloseModel");
            // Closebutton.click();
          } else {
            this.api.Toast("Warning", "Invalid OTP");
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
}

// ts file
