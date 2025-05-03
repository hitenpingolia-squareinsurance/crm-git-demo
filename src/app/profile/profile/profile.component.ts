import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  AbstractControl,
} from "@angular/forms";

import { trim } from "jquery";
import { UpperCasePipe } from "@angular/common";

import { PosCertificateComponent } from "../pos-certificate/pos-certificate.component";

import { empty } from "rxjs";
import { jsPDF } from "jspdf";

import domtoimage from "dom-to-image";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Console } from "console";
declare var require: any;
declare var $: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { UploadProfileComponent } from "../upload-profile/upload-profile.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  [x: string]: any;
  Profiledata: any = [];
  ProfileForm: FormGroup;
  selectedFiles: any;
  enteredOTP: any;

  AadhaarCardBack_Image: any;
  Graduation_Image: any;
  Profile_Image: any;
  Cheque_Image: any;
  Signature_Image: any;
  otherimage: any;
  Pancard_Image: any;
  AadhaarCardFront_Image: any;
  gstimage: any;
  gstimage_agreement: any;
  isSubmitted = false;
  buttonDisable = false;

  AccountTypeVal: any;
  StateVal: any;
  CityVal: any;
  GenderVal: any;
  BankVal: any;
  GSTVal: any;
  UserLoginType: any;
  LabelForFormType: string = "Resign";
  GSTSelectVal: boolean;
  Is_enabled = false;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  timerId: any;

  row: any;
  Bank: any;
  State: any;
  Citys: any;
  AccountType: any;
  Gender: any;
  ProfileImage: any;
  ReportingManagerData: any;
  GstData: any[];
  verifyOtpVal = "0";
  //Resign Form
  ResignForm: FormGroup;
  AadharOtp: FormGroup;

  isInputEnabled: { [key: string]: boolean } = {};

  EmailVal: any;
  titleVal: any;
  MobileVal: any;
  Address_1Val: any;
  Address_2Val: any;
  Address_3Val: any;
  PincodeVal: any;
  Branch_NameVal: any;
  Account_NoVal: any;
  Ifsc_codeVal: any;
  gstnoVal: any;
  GstAddress: any;
  StateDisable = true;
  CityDisable = true;
  GenderDisable = true;
  BankDisable = true;
  AccountTypeDisable = true;
  Emitra_AadharNo_Val: any;

  GSTDisabled = true;
  GST_VALUE: any;
  Aadhar_Verify = false;
  Partner: any;
  currentUrl: any;
  enabledFieldCount: any;

  isEditDetailsActive: boolean = false;
  isProfileStatusActive: boolean = false;
  isDivVisibleActive: boolean = true;
  isDivVisible: boolean = true;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.UserLoginType = this.api.GetUserData("Type");
    this.ProfileForm = this.fb.group({
      Name: [""],
      title: ["", [Validators.required]],
      Email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
      ],
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Address_1: ["", [Validators.required]],
      Address_2: ["", [Validators.required]],
      Address_3: ["", [Validators.required]],
      Pincode: ["", [Validators.required]],
      State: ["", [Validators.required]],
      City: ["", [Validators.required]],
      Gender: ["", [Validators.required]],
      Bank_Name: ["", [Validators.required]],
      Branch_Name: ["", [Validators.required]],
      Account_Type: ["", [Validators.required]],
      Account_No: ["", [Validators.required]],
      Ifsc_code: ["", [Validators.required]],
      ChequeImage: ["", [Validators.required]],
      PancardImage: ["", [Validators.required]],
      AadhaarCardFrontImage: ["", [Validators.required]],
      AadhaarCardBackImage: ["", [Validators.required]],
      ProfileImage: ["", [Validators.required]],
      SignatureImage: ["", [Validators.required]],
      GraduationImage: ["", [Validators.required]],
      GSTStatus: ["", [Validators.required]],
      gstno: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
          ),
        ],
      ],
      GstAddress: ["", [Validators.required]],
      GST_Certificate: ["", [Validators.required]],
      gstAgreement: ["", [Validators.required]],
      Emitra_AadharNo: [
        "",
        [Validators.required, Validators.pattern("[0-9]{12}")],
      ],
    });

    this.ProfileForm.disable();

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.FetchColume();
    this.AgentReportingManeger();

    this.ResignForm = this.fb.group({
      Remark: ["", Validators.required],
    });

    this.AadharOtp = this.fb.group({
      OTP: ["", [Validators.required]],
    });

    this.GstData = [
      { Id: "Yes", Name: "Yes" },
      { Id: "No", Name: "No" },
    ];

    // this.ProfileForm.get('Bank_Name').valueChanges.subscribe((value) => {

    //   if(Array.isArray(value) &&  value.length > 0){

    //     if (
    //       trim(this.Profiledata.Bank_Name) != "" &&
    //       this.Profiledata.Bank_Name ? this.Profiledata.Bank_Name[0].Name == value[0].Name : ''
    //     ) {

    //     this.disableInputFieldValue('ChequeImage');
    //       this.ProfileForm.get("Bank_Name").setErrors({ CustomValidator: true });

    //       return false;
    //     }else{
    //     this.enableInputFieldsValue('ChequeImage');
    //     }

    //   }

    // });
  }

  ngOnInit() {
    this.GetData();
    // this.GetPrimeStatus();
    this.showProfile();
    this.checkType = this.api.GetUserType();
    this.Partner = this.api.GetUserData("Partner");
    this.currentUrl = this.router.url.split("/")["2"];
  }

  profilestatus(requestId: string = "") {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Profile/ProfileStatus?User_Id=" +
          this.api.GetUserData("Id") +
          "&url=" +
          this.currentUrl +
          "&User_Type=" +
          this.api.GetUserType() +
          "&requestId=" +
          requestId
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.dataArr = result["data"];
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

  ViewDocument_2(url) {
    var fullurl =
      "https://squarebweb-documents.s3.ap-south-1.amazonaws.com/crm/AgentDocs/" +
      url;
    window.open(fullurl, "", "left=100,top=50,width=800%,height=600");
  }

  AgentReportingManeger() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("AgentId", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api.HttpPostType("Profile/CheckUpdateAgent", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.ReportingManagerData = result["Data"];

          // console.log(this.ReportingManagerData);
          // // console.log(this.Profiledata);
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

  showProfile() {
    this.api
      .HttpGetType(
        "Profile/GetProfile?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.DataArr = result["Data"];

            this.ProfileImage = this.DataArr.profile;
            //   //   //   console.log(this.ProfileImage);
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

  checkemail() {
    const oldemail = this.Profiledata.Email;
    const newemail = this.ProfileForm.get("Email");

    if (oldemail === newemail) {
      // this.ProfileForm.get('Email').setValidators(Validators.email);
      // Validators.required;
    } else {
      return this.ProfileForm.get("Email");
    }
  }

  get FC() {
    return this.ProfileForm.controls;
  }

  get FormC() {
    return this.ResignForm.controls;
  }
  get Form_C() {
    return this.AadharOtp.controls;
  }

  Resign_Form() {
    this.isSubmitted = true;
    const formdata = new FormData();
    const Fields = this.ResignForm.value;
    formdata.append("remark", Fields["Remark"]);
    formdata.append("type", "1");
    formdata.append("id", this.api.GetUserData("Id"));

    this.api
      .HttpPostType("Employeeresign/CreateResignationRequest", formdata)
      .then(
        (result: any) => {
          this.api.HideLoading;
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            const Closebutton = document.getElementById("CloseModel");
            Closebutton.click();
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading;
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          const Closebutton = document.getElementById("CloseModel");
          Closebutton.click();
        }
      );
  }

  Revoke_Form() {
    this.isSubmitted = true;
    const formdata = new FormData();
    const Fields = this.ResignForm.value;
    formdata.append("remark", Fields["Remark"]);
    formdata.append("type", "1");
    formdata.append("id", this.RevokedRequestId);

    this.api.HttpPostType("Employeeresign/CreateRevokeRequest", formdata).then(
      (result: any) => {
        this.api.HideLoading;
        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
          const Closebutton = document.getElementById("CloseModel");
          Closebutton.click();
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading;
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
        const Closebutton = document.getElementById("CloseModel");
        Closebutton.click();
      }
    );
  }

  LabelForForm(type, RevokeRequestId) {
    this.LabelForFormType = type;
    this.RevokedRequestId = RevokeRequestId;
  }

  onItemSelect(e) {
    // this.GSTSelectVal = e.Id;
    if (e.Id == "Yes") {
      this.GSTSelectVal = true;
      this.enableInputFieldsValue("GST_Certificate");
      this.enableInputFieldsValue("gstAgreement");
      this.enableInputFieldsValue("GstAddress");
      this.enableInputFieldsValue("gstno");
    } else {
      this.GSTSelectVal = false;
      this.disableInputFieldValue("GST_Certificate");
      this.disableInputFieldValue("gstAgreement");
      this.disableInputFieldValue("GstAddress");
      this.disableInputFieldValue("gstno");
    }
  }

  GetData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Profile/SingleUserProfile?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == 1) {
            this.Profiledata = result["Data"];

            this.ProfileForm.patchValue(this.Profiledata);
            if (this.Profiledata.GSTStatus) {
              this.GST_VALUE = this.Profiledata.GSTStatus[0].Id;
              if (this.GST_VALUE == "Yes") {
                this.GSTSelectVal = true;
                this.gstnoVal = this.Profiledata.gstno;
                this.GstAddressVal = this.Profiledata.GstAddress;
              } else {
                this.GSTSelectVal = false;
                // this.Aadhar_Verify = false;
              }
            }
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

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
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

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 2048) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 1 mb");

          if (Type == "PancardImage") {
            this.ProfileForm.get("PancardImage").setValue("");
          }
          if (Type == "AadhaarCardFrontImage") {
            this.ProfileForm.get("AadhaarCardFrontImage").setValue("");
          }
          if (Type == "AadhaarCardBackImage") {
            this.ProfileForm.get("AadhaarCardBackImage").setValue("");
          }
          if (Type == "GraduationImage") {
            this.ProfileForm.get("GraduationImage").setValue("");
          }
          if (Type == "ProfileImage") {
            this.ProfileForm.get("ProfileImage").setValue("");
          }
          if (Type == "ChequeImage") {
            this.ProfileForm.get("ChequeImage").setValue("");
          }
          if (Type == "SignatureImage") {
            this.ProfileForm.get("SignatureImage").setValue("");
          }
          if (Type == "otherimage") {
            this.ProfileForm.get("otherimage").setValue("");
          }
          if (Type == "GST_Certificate") {
            this.ProfileForm.get("GST_Certificate").setValue("");
          }
          if (Type == "gstAgreement") {
            this.ProfileForm.get("gstAgreement").setValue("");
          }
        } else {
          if (Type == "PancardImage") {
            this.Pancard_Image = this.selectedFiles;
          }
          if (Type == "AadhaarCardFrontImage") {
            this.AadhaarCardFront_Image = this.selectedFiles;
          }
          if (Type == "AadhaarCardBackImage") {
            this.AadhaarCardBack_Image = this.selectedFiles;
          }
          if (Type == "GraduationImage") {
            this.Graduation_Image = this.selectedFiles;
          }
          if (Type == "ProfileImage") {
            this.Profile_Image = this.selectedFiles;
          }
          if (Type == "ChequeImage") {
            this.Cheque_Image = this.selectedFiles;
          }
          if (Type == "SignatureImage") {
            this.Signature_Image = this.selectedFiles;
          }
          if (Type == "otherimage") {
            this.otherimage = this.selectedFiles;
          }
          if (Type == "GST_Certificate") {
            this.gstimage = this.selectedFiles;
          }
          if (Type == "gstAgreement") {
            this.gstimage_agreement = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  toggleEditDetails() {
    this.isEditDetailsActive = true;
    this.isProfileStatusActive = false;
    this.isDivVisibleActive = false;
    this.isDivVisible = false;
  }

  toggleProfileStatus() {
    this.isEditDetailsActive = false;
    this.isProfileStatusActive = true;
    this.isDivVisibleActive = false;
    this.isDivVisible = false;
  }

  ShowDivtabs() {
    this.isDivVisible = true;
    this.isEditDetailsActive = false;
    this.isProfileStatusActive = false;
  }

  // //===== SET FIELD VALUES =====//
  enableInputFieldsValue(fieldName: any) {
    this.enabledFieldCount = 0;
    this.Is_enabled = true;
    this.isInputEnabled[fieldName] = true;
    this.ProfileForm.controls[fieldName].enable();

    this.enabledFieldCount++;

    if (fieldName == "Emitra_AadharNo") {
      this.enableInputFieldsValue("AadhaarCardFrontImage");
      this.enableInputFieldsValue("AadhaarCardBackImage");
    }

    if (fieldName == "State") {
      this.StateVal = this.Profiledata.State;
      this.StateDisable = false;
    }
    if (fieldName == "City") {
      this.CityVal = this.Profiledata.City;
      this.CityDisable = false;
    }
    if (fieldName == "Bank_Name") {
      this.ProfileForm.get("Bank_Name").valueChanges.subscribe((value) => {
        if (Array.isArray(value) && value.length > 0) {
          if (
            trim(this.Profiledata.Bank_Name) != "" && this.Profiledata.Bank_Name
              ? this.Profiledata.Bank_Name[0].Name == value[0].Name
              : ""
          ) {
            this.disableInputFieldValue("ChequeImage");
            return false;
          } else {
            this.enableInputFieldsValue("ChequeImage");
          }
        }
      });

      this.BankVal = this.Profiledata.Bank_Name;
      this.BankDisable = false;
    }
    if (fieldName == "Account_Type") {
      this.AccountTypeVal = this.Profiledata.Account_Type;
      this.AccountTypeDisable = false;
    }

    if (fieldName == "Gender") {
      this.GenderVal = this.Profiledata.Gender;
      this.GenderDisable = false;
    }
    if (fieldName == "GSTStatus") {
      this.GSTVal = this.Profiledata.GSTStatus;
      this.GSTDisabled = true;

      if (this.Profiledata.GSTStatus[0].Id == "Yes") {
        this.GSTSelectVal = true;
      } else {
        this.GSTSelectVal = false;
      }
      this.GSTDisabled = false;
    }
    // this.ProfileForm.controls[fieldName].setValue("");
  }

  //===== CLER FIELD VALUES =====//
  disableInputFieldValue(fieldName: any) {
    this.isInputEnabled[fieldName] = false;
    this.ProfileForm.controls[fieldName].disable();
    // this.GetData();
    this.enabledFieldCount--;

    if (fieldName === "Email") {
      setTimeout(() => {
        this.EmailVal = this.Profiledata.Email;
      });
    }

    if (fieldName === "title") {
      setTimeout(() => {
        this.titleVal = this.Profiledata.title;
      });
    }

    if (fieldName === "Mobile") {
      setTimeout(() => {
        this.MobileVal = this.Profiledata.Mobile;
      });
    }
    if (fieldName === "Address_1") {
      setTimeout(() => {
        this.Address_1Val = this.Profiledata.Address_1;
      });
    }
    if (fieldName === "Address_2") {
      setTimeout(() => {
        this.Address_2Val = this.Profiledata.Address_2;
      });
    }
    if (fieldName === "Address_3") {
      setTimeout(() => {
        this.Address_3Val = this.Profiledata.Address_3;
      });
    }
    if (fieldName === "Pincode") {
      setTimeout(() => {
        this.PincodeVal = this.Profiledata.Pincode;
      });
    }
    if (fieldName === "Branch_Name") {
      setTimeout(() => {
        this.Branch_NameVal = this.Profiledata.Branch_Name;
      });
    }
    if (fieldName === "Account_No") {
      setTimeout(() => {
        this.Account_NoVal = this.Profiledata.Account_No;
      });
    }
    if (fieldName === "Ifsc_code") {
      setTimeout(() => {
        this.Ifsc_codeVal = this.Profiledata.Ifsc_code;
      });
    }
    if (fieldName === "gstno") {
      setTimeout(() => {
        this.gstnoVal = this.Profiledata.gstno;
      });
    }
    if (fieldName === "GstAddress") {
      setTimeout(() => {
        this.GstAddressVal = this.Profiledata.GstAddress;
      });
    }

    if (fieldName == "State") {
      setTimeout(() => {
        this.StateVal = this.Profiledata.State;
        this.StateDisable = true;
      });
    }
    if (fieldName == "City") {
      setTimeout(() => {
        this.CityVal = this.Profiledata.City;
        this.CityDisable = true;
      });
    }
    if (fieldName == "Gender") {
      setTimeout(() => {
        this.GenderVal = this.Profiledata.Gender;
        this.GenderDisable = true;
      });
    }
    if (fieldName == "Bank_Name") {
      setTimeout(() => {
        this.BankVal = this.Profiledata.Bank_Name;
        this.BankDisable = true;
      });
    }
    if (fieldName == "Account_Type") {
      setTimeout(() => {
        this.AccountTypeVal = this.Profiledata.Account_Type;
        this.AccountTypeDisable = true;
      });
    }

    if (fieldName == "GSTStatus") {
      setTimeout(() => {
        this.GSTVal = this.Profiledata.GSTStatus;
        this.GSTDisabled = true;
        if (this.Profiledata.GSTStatus[0].Id == "Yes") {
          this.GSTSelectVal = true;
        } else {
          this.GSTSelectVal = false;
        }
      });
    }

    if (fieldName == "Emitra_AadharNo") {
      setTimeout(() => {
        this.disableInputFieldValue("AadhaarCardFrontImage");
        this.disableInputFieldValue("AadhaarCardBackImage");
        this.Emitra_AadharNo_Val = this.Profiledata.AadhaarCard_Number;
      });
    }

    if (fieldName == "gstAgreement") {
      this.gstimage_agreement = undefined;
    }
    if (fieldName == "GST_Certificate") {
      this.gstimage = undefined;
    }
    if (fieldName == "SignatureImage") {
      this.Signature_Image = undefined;
    }
    if (fieldName == "ChequeImage") {
      this.Cheque_Image = undefined;
    }
    if (fieldName == "GraduationImage") {
      this.Graduation_Image = undefined;
    }
    if (fieldName == "ProfileImage") {
      this.Profile_Image = undefined;
    }

    if (fieldName == "AadhaarCardBackImage") {
      this.AadhaarCardBack_Image = undefined;
    }
    if (fieldName == "AadhaarCardFrontImage") {
      this.AadhaarCardFront_Image = undefined;
    }
    if (fieldName == "PancardImage") {
      this.Pancard_Image = undefined;
    }
    this.ProfileForm.controls[fieldName].setValue("");
  }

  UpdateProfile() {
    this.isSubmitted = true;
    var fields = this.ProfileForm.value;

    // console.log(fields);
    // console.log(this.enabledFieldCount);
    //   //   //   console.log(Object.keys(this.isInputEnabled).length);

    if (Object.keys(this.isInputEnabled).length === 0) {
      this.api.Toast("Warning", "Please select Minimum one field....");
      return;
    } else {
      if (this.isInputEnabled["Email"]) {
        if (
          trim(this.Profiledata.Email) != "" &&
          this.Profiledata.Email == trim(fields["Email"])
        ) {
          this.ProfileForm.get("Email").setErrors({ CustomValidator: true });
          return false;
        }
      }

      if (this.isInputEnabled["title"]) {
        if (
          trim(this.Profiledata.title) != "" &&
          this.Profiledata.title == trim(fields["title"])
        ) {
          this.ProfileForm.get("title").setErrors({ CustomValidator: true });
          return false;
        }
      }

      if (this.isInputEnabled["Mobile"]) {
        if (
          trim(this.Profiledata.Mobile) != "" &&
          this.Profiledata.Mobile == trim(fields["Mobile"])
        ) {
          this.ProfileForm.get("Mobile").setErrors({ CustomValidator: true });
          return false;
        }
      }

      if (this.isInputEnabled["Address_1"]) {
        if (
          trim(this.Profiledata.Address_1) != "" &&
          this.Profiledata.Address_1 == trim(fields["Address_1"])
        ) {
          this.ProfileForm.get("Address_1").setErrors({
            CustomValidator: true,
          });
          return false;
        }
      }

      if (this.isInputEnabled["Address_2"]) {
        if (
          trim(this.Profiledata.Address_2) != "" &&
          this.Profiledata.Address_2 == trim(fields["Address_2"])
        ) {
          // alert();
          this.ProfileForm.get("Address_2").setErrors({
            CustomValidator: true,
          });
          return false;
        }
      }

      if (this.isInputEnabled["Address_3"]) {
        if (
          trim(this.Profiledata.Address_3) != "" &&
          this.Profiledata.Address_3 == trim(fields["Address_3"])
        ) {
          this.ProfileForm.get("Address_3").setErrors({
            CustomValidator: true,
          });
          return false;
        }
      }
      if (this.isInputEnabled["Pincode"]) {
        if (
          trim(this.Profiledata.Pincode) != "" &&
          this.Profiledata.Pincode == trim(fields["Pincode"])
        ) {
          this.ProfileForm.get("Pincode").setErrors({ CustomValidator: true });

          return false;
        }
      }

      if (this.isInputEnabled["Branch_Name"]) {
        if (
          trim(this.Profiledata.Branch_Name) != "" &&
          this.Profiledata.Branch_Name == trim(fields["Branch_Name"])
        ) {
          this.ProfileForm.get("Branch_Name").setErrors({
            CustomValidator: true,
          });

          return false;
        }
      }
      if (this.isInputEnabled["Account_No"]) {
        if (
          trim(this.Profiledata.Account_No) != "" &&
          this.Profiledata.Account_No == trim(fields["Account_No"])
        ) {
          this.ProfileForm.get("Account_No").setErrors({
            CustomValidator: true,
          });

          return false;
        }
      }

      if (this.isInputEnabled["Ifsc_code"]) {
        if (
          trim(this.Profiledata.Ifsc_code) != "" &&
          this.Profiledata.Ifsc_code == trim(fields["Ifsc_code"])
        ) {
          this.ProfileForm.get("Ifsc_code").setErrors({
            CustomValidator: true,
          });

          return false;
        }
      }

      // if (this.isInputEnabled['Emitra_AadharNo']) {
      //   if (
      //     trim(this.Profiledata.AadhaarCard_Number) != "" &&
      //     this.Profiledata.AadhaarCard_Number == trim(fields["Emitra_AadharNo"])
      //   ) {
      //     this.ProfileForm.get("Emitra_AadharNo").setErrors({ CustomValidator: true });
      //     // this.disableInputFieldValue('AadhaarCardFrontImage');
      //     // this.disableInputFieldValue('AadhaarCardBackImage');
      //     return false;
      //   }
      //   // else{
      //   //   this.enableInputFieldsValue('AadhaarCardFrontImage');
      //   //   this.enableInputFieldsValue('AadhaarCardBackImage');

      //   // }
      // }

      var Bank_Name1 = fields["Bank_Name"];
      var State1 = fields["State"];
      var City1 = fields["City"];
      var Account_Type1 = fields["Account_Type"];
      var Gender = fields["Gender"];
      var GstStatus = fields["GSTStatus"];

      if (Bank_Name1 != "" && Bank_Name1 != null) {
        Bank_Name1 = fields["Bank_Name"][0]["Name"];
      }
      if (State1 != "" && State1 != null) {
        State1 = fields["State"][0]["Name"];
      }
      if (City1 != "" && City1 != null) {
        City1 = fields["City"][0]["Name"];
      }
      if (Account_Type1 != "" && Account_Type1 != null) {
        Account_Type1 = fields["Account_Type"][0]["Name"];
      }
      if (Gender != "" && Gender != null) {
        Gender = fields["Gender"][0]["Name"];
      }

      if (GstStatus != "" && GstStatus != null) {
        GstStatus = GstStatus[0]["Name"];
      }

      if (this.isInputEnabled["Bank_Name"]) {
        if (
          trim(this.Profiledata.Bank_Name) != "" && this.Profiledata.Bank_Name
            ? this.Profiledata.Bank_Name[0].Name == Bank_Name1
            : ""
        ) {
          this.disableInputFieldValue("ChequeImage");
          this.ProfileForm.get("Bank_Name").setErrors({
            CustomValidator: true,
          });
          return false;
        } else {
          this.enableInputFieldsValue("ChequeImage");
        }
      }

      if (this.isInputEnabled["Emitra_AadharNo"]) {
        // if (trim(this.Profiledata.AadhaarCard_Number) != ""){
        //   this.disableInputFieldValue('AadhaarCardFrontImage');
        //   this.disableInputFieldValue('AadhaarCardBackImage');
        //   return false;
        // }
        // else{
        this.enableInputFieldsValue("AadhaarCardFrontImage");
        this.enableInputFieldsValue("AadhaarCardBackImage");
        // }
      }

      if (this.isInputEnabled["Account_Type"]) {
        if (
          trim(this.Profiledata.Account_Type) != "" &&
          this.Profiledata.Account_Type
            ? this.Profiledata.Account_Type[0].Name == Account_Type1
            : ""
        ) {
          this.ProfileForm.get("Account_Type").setErrors({
            CustomValidator: true,
          });

          return false;
        }
      }

      if (this.isInputEnabled["Gender"]) {
        if (
          trim(this.Profiledata.Gender) != "" && this.Profiledata.Gender
            ? this.Profiledata.Gender[0].Name == Gender
            : ""
        ) {
          this.ProfileForm.get("Gender").setErrors({ CustomValidator: true });

          return false;
        }
      }

      if (this.isInputEnabled["City"]) {
        if (
          trim(this.Profiledata.City) != "" && this.Profiledata.City
            ? this.Profiledata.City[0].Name == City1
            : ""
        ) {
          this.ProfileForm.get("City").setErrors({ CustomValidator: true });

          return false;
        }
      }

      if (this.isInputEnabled["State"]) {
        if (
          trim(this.Profiledata.State) != "" && this.Profiledata.State
            ? this.Profiledata.State[0].Name == State1
            : ""
        ) {
          this.ProfileForm.get("State").setErrors({ CustomValidator: true });

          return false;
        }
      }

      // console.log(this.Profiledata.GSTStatus[0].Name == GstStatus);
      // if (this.isInputEnabled['GstStatus']) {
      //   alert(121);
      if (
        this.Profiledata.GSTStatus
          ? this.Profiledata.GSTStatus[0].Name == GstStatus
          : ""
      ) {
        this.ProfileForm.get("GSTStatus").setErrors({ CustomValidator: true });
        return false;
      }

      // }

      if (fields["GSTStatus"] ? fields["GSTStatus"][0]["Name"] == "No" : "No") {
        this.Aadhar_Verify = false;
        fields["GstAddress"] = "";
        fields["gstno"] = "";
      } else if (
        fields["GSTStatus"] ? fields["GSTStatus"][0]["Name"] == "Yes" : "Yes"
      ) {
        this.enableInputFieldsValue("GST_Certificate");
        this.enableInputFieldsValue("gstAgreement");
        this.enableInputFieldsValue("GstAddress");
        this.enableInputFieldsValue("gstno");
      } else {
        this.disableInputFieldValue("GST_Certificate");
        this.disableInputFieldValue("gstAgreement");
        this.disableInputFieldValue("GstAddress");
        this.disableInputFieldValue("gstno");
      }

      if (this.ProfileForm.invalid) {
        //   //   //   console.log(this.ProfileForm.invalid);
        //   //   //   console.log(this.ProfileForm);

        return false;
      } else if (
        fields["GSTStatus"] != "" &&
        fields["GSTStatus"] != undefined &&
        fields["gstno"] == ""
          ? fields["GSTStatus"][0]["Name"] != "No" &&
            fields["GSTStatus"][0]["Name"] != undefined &&
            this.AadharOtp.invalid
          : ""
      ) {
        //   //   //   console.log(fields["GSTStatus"]);
        this.api.Toast(
          "Warning",
          "Please first Verify Your aadhar verification !"
        );
        return false;
      } else {
        if (this.isInputEnabled["gstno"]) {
          if (
            trim(this.Profiledata.gstno) != "" &&
            this.Profiledata.gstno == trim(fields["gstno"])
          ) {
            this.ProfileForm.get("gstno").setErrors({ CustomValidator: true });
            return false;
          } else if (
            fields["GSTStatus"] ? fields["GSTStatus"][0]["Name"] == "No" : ""
          ) {
          }
        }

        if (this.isInputEnabled["GstAddress"]) {
          if (
            trim(this.Profiledata.GstAddress) != "" &&
            this.Profiledata.GstAddress == trim(fields["GstAddress"])
          ) {
            this.ProfileForm.get("GstAddress").setErrors({
              CustomValidator: true,
            });
            return false;
          } else if (
            fields["GSTStatus"] ? fields["GSTStatus"][0]["Name"] == "No" : ""
          ) {
          }
        }

        if (this.isInputEnabled["GST_Certificate"]) {
          if (
            trim(this.Profiledata.GST_Certificate) != "" &&
            this.Profiledata.GST_Certificate == trim(fields["GST_Certificate"])
          ) {
            this.ProfileForm.get("GST_Certificate").setErrors({
              CustomValidator: true,
            });
            return false;
          } else if (
            fields["GSTStatus"] ? fields["GSTStatus"][0]["Name"] == "No" : ""
          ) {
          }
        }

        if (this.isInputEnabled["gstAgreement"]) {
          if (
            trim(this.Profiledata.gstAgreement) != "" &&
            this.Profiledata.gstAgreement == trim(fields["gstAgreement"])
          ) {
            this.ProfileForm.get("gstAgreement").setErrors({
              CustomValidator: true,
            });
            return false;
          } else if (
            fields["GSTStatus"] ? fields["GSTStatus"][0]["Name"] == "No" : ""
          ) {
          }
        }

        // this.buttonDisable = true;

        var fields = this.ProfileForm.value;
        const formData = new FormData();

        var Bank_Name1 = fields["Bank_Name"];
        var State1 = fields["State"];
        var City1 = fields["City"];
        var Account_Type1 = fields["Account_Type"];

        var Gender1 = fields["Gender"];

        if (Bank_Name1 != "" && Bank_Name1 != null) {
          Bank_Name1 = fields["Bank_Name"][0]["Name"];
        }
        if (State1 != "" && State1 != null) {
          State1 = fields["State"][0]["Name"];
        }
        if (City1 != "" && City1 != null) {
          City1 = fields["City"][0]["Name"];
        }
        if (Account_Type1 != "" && Account_Type1 != null) {
          Account_Type1 = JSON.stringify(fields["Account_Type"][0]["Name"]);
        }

        if (Gender1 != "" && Gender1 != null) {
          Gender1 = JSON.stringify(fields["Gender"][0]["Name"]);
        }

        formData.append("gender", Gender1);

        formData.append("mobile", fields["Mobile"]);
        formData.append("email", fields["Email"]);
        formData.append("title", fields["title"]);

        formData.append("address1", fields["Address_1"]);
        formData.append("address2", fields["Address_2"]);
        formData.append("address3", fields["Address_3"]);
        formData.append("state", State1);
        formData.append("city", City1);
        formData.append("pincode", fields["Pincode"]);

        formData.append("bank_name", Bank_Name1);
        formData.append("account_no", fields["Account_No"]);
        formData.append("ifsc", fields["Ifsc_code"]);

        formData.append("branch_name", fields["Branch_Name"]);
        formData.append("account_type", Account_Type1);

        formData.append("account_no", fields["Account_No"]);
        formData.append("ifsc", fields["Ifsc_code"]);
        formData.append("gst_address", fields["GstAddress"]);
        formData.append("gst_no", fields["gstno"]);
        formData.append(
          "gst_status",
          fields["GSTStatus"] != "" && fields["GSTStatus"] != undefined
            ? fields["GSTStatus"][0]["Name"]
            : ""
        );
        formData.append("pancard_image", this.Pancard_Image);
        formData.append("aadharcard_image", this.AadhaarCardFront_Image);
        formData.append("aadharcard_image_back", this.AadhaarCardBack_Image);
        formData.append("qualification_image", this.Graduation_Image);
        formData.append("cheque_image", this.Cheque_Image);
        formData.append("image", this.Profile_Image);
        formData.append("signature_image", this.Signature_Image);
        formData.append("gst_certificate", this.gstimage);
        formData.append("gst_agreement", this.gstimage_agreement);
        formData.append("verifyOtpVal", this.verifyOtpVal);
        formData.append("aadharcard_no", fields["Emitra_AadharNo"]);

        this.api
          .HttpPostType(
            "Profile/UpdateRequest?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&User_Code=" +
              this.api.GetUserData("Code"),
            formData
          )
          .then(
            (result: any) => {
              this.api.HideLoading();

              if (result["Status"] == true) {
                this.isInputEnabled = {};
                this.enabledFieldCount = 0;

                // Reset image-related fields
                this.gstimage_agreement = undefined;
                this.gstimage = undefined;
                this.Signature_Image = undefined;
                this.Cheque_Image = undefined;
                this.Graduation_Image = undefined;
                this.Profile_Image = undefined;
                this.AadhaarCardBack_Image = undefined;
                this.AadhaarCardFront_Image = undefined;
                this.Pancard_Image = undefined;
                this.buttonDisable = false;

                this.api.Toast("Success", result["Message"]);
                // window.location.reload();
                this.GetData();
              } else {
                this.buttonDisable = false;
                this.api.Toast("Warning", result["Message"]);
                if (result["Message"] == "Please verify your Aadhaar!") {
                  this.Aadhar_Verify = true;
                } else {
                  this.Aadhar_Verify = false;
                }
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
  }
  FetchColume() {
    //this.api.IsLoading();
    this.api
      .HttpGetType("Profile/FetchColume?User_Id=" + this.api.GetUserData("Id"))
      .then(
        (result: any) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.Bank = result["Data"]["Bank"];
            this.State = result["Data"]["State"];
            this.Citys = result["Data"]["Citys"];
            this.AccountType = result["Data"]["AccountType"];
            this.Gender = [
              { Id: "Male", Name: "Male" },
              { Id: "Female", Name: "Female" },
            ];
          } else {
            //alert(result['message']);
            //this.api.Toast('Warning',result['msg']);
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

  ProfilePhotoRequest() {
    const dialogRef = this.dialog.open(UploadProfileComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      // data: { type: type, id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
      this.ResetDT();
    });
  }

  WithdrawRmRequest(AgentId: any, LOB: any, RmId: any, LogId: any) {
    if (confirm("Are you sure !") == true) {
      this.isSubmitted = true;

      var fields = this.ProfileForm.value;
      const formData = new FormData();
      formData.append("AgentId", AgentId);
      formData.append("LOB", LOB);
      formData.append("RmId", RmId);
      formData.append("LogId", LogId);
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("User_Code", this.api.GetUserData("Code"));

      // this.api.IsLoading();
      this.api
        .HttpPostType("PospReporting/WithdrawAgentRmRequest", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();

            // console.log(result);
            if (result["status"] == 1) {
              this.AgentReportingManeger();
              this.api.Toast("Success", result["Message"]);
            } else {
              this.buttonDisable = false;
              const msg = "Message";
              this.api.Toast("Warning", result["Message"]);
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

  ViewCertificate(Profiledata: any) {
    const dialogRef = this.dialog.open(PosCertificateComponent, {
      width: "auto",
      height: "auto",
      disableClose: true,
      data: { Profiledata: Profiledata },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }

  // downloadAsPDF() {
  //   this.DownloadPdf = "0%-100%";

  //   this.pdfTable = document.getElementById("contentToConvertCertificate");
  //   var img: any;
  //   var filename;
  //   var newImage: any;
  //   domtoimage
  //     .toPng(this.pdfTable, { bgcolor: "#fff" })
  //     .then(function (dataUrl) {
  //       img = new Image();
  //       img.src = dataUrl;
  //       newImage = img.src;
  //       img.onload = function () {
  //         var pdfWidth = 1000;
  //         var pdfHeight = 1000;
  //      //   //   //   console.log(dataUrl);
  //         var doc: jsPDF;
  //         if (pdfWidth > pdfHeight) {
  //           doc = new jsPDF("l", "px", [pdfWidth, pdfHeight]);
  //         } else {
  //           doc = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
  //         }
  //         var width = doc.internal.pageSize.getWidth();
  //         var height = doc.internal.pageSize.getHeight();
  //      //   //   //   console.log(width);
  //      //   //   //   console.log(height);
  //         doc.addImage(newImage, "PNG", 10, 10, width, height);
  //         filename = Date() + ".pdf";
  //         doc.save(filename);
  //         this.DownloadPdf = "Completed Download";
  //       };
  //     })
  //     .catch(function (error) {
  //       // Error Handling
  //       this.DownloadPdf = "Convert PDF";
  //     });
  //   this.DownloadPdf = "Convert PDF";
  // }

  initiateDownload(OTP_mass: any) {
    // const Openbutton = document.getElementById("OpenOtpModel");
    //         Openbutton.click();
    var timeSec = 60;
    const formData = new FormData();
    formData.append("Mobile", this.Profiledata.Mobile);
    formData.append("Name", this.Profiledata.Name);
    formData.append("Email", this.Profiledata.Email);
    formData.append("OTP_mass", OTP_mass);
    this.api.IsLoading();
    this.url = "Profile/otpSend";
    this.api.HttpPostType(this.url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
          if (OTP_mass == "send") {
            const Openbutton = document.getElementById("OpenOtpModel");
            Openbutton.click();
          }
          clearInterval(this.timerId);
          this.timerId = setInterval(() => {
            timeSec--;
            document.getElementById("ResendOtpButton").innerHTML = "" + timeSec;
            // timeSec;
            // document.getElementById('ResendOtpButton').disabled='true';
            // $("#ResendOtpButton").prop('disabled', true);
            this.ResendOtpButton = true;
            if (timeSec == 1) {
              timeSec = 60;
              document.getElementById("ResendOtpButton").innerHTML = "Resend";
              clearInterval(this.timerId);
              $("#ResendOtpButton").prop("disabled", false);
              this.ResendOtpButton = false;
            }
          }, 1000);
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

  verifyOTP() {
    const formData = new FormData();
    formData.append("Mobile", this.Profiledata.Mobile);
    formData.append("Name", this.Profiledata.Name);
    formData.append("Email", this.Profiledata.Email);
    formData.append("otp", this.enteredOTP);
    this.api.IsLoading();
    this.url = "MyPos/DonwloadCertificate";
    this.api.HttpPostType(this.url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          // this.api.Toast("Success", result["msg"]);
          this.ViewDocument(result["Certificate"]);
          const Closebutton = document.getElementById("ClodeOtpModel");
          Closebutton.click();
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

  //GST VERIFICATION

  SendOtp() {
    var fields = this.Profiledata["AadhaarCard_Number"];
    if (
      this.api.GetUserType() == "agent" &&
      this.Profiledata.PartnerData == "emitra" &&
      fields == ""
    ) {
      var fields = this.ProfileForm.get("Emitra_AadharNo").value;
    } else {
      var fields = this.Profiledata["AadhaarCard_Number"];
    }

    //   //   //   console.log(fields);

    if (fields == "") {
      this.api.Toast("Warning", "Please Enter Aadhar No.");
    } else {
      const formdata = new FormData();
      formdata.append("aadharno", fields);

      this.api.HttpPostType("MyPos/verify_AadharOTP", formdata).then(
        (result: any) => {
          if (result["message_code"] == "success") {
            this.api.Toast("Success", "OTP Sent Successfully");
            $("#Otp_modal").modal("show");
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
      // this.api.IsLoading();
      this.api.HttpPostType("MyPos/OtpVerify", formData).then(
        (result: any) => {
          // this.api.HideLoading();
          if (result["status"] == 2) {
            this.api.Toast("Success", "OTP Verified");
            this.verifyOtpVal = "1";
            // const Closebutton = document.getElementById("CloseModel");
            // Closebutton.click();
            $("#Otp_modal").modal("hide");
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

  downloadProfileAsPDF() {
    this.DownloadPdf = "0%-100%";

    this.pdfTable = document.getElementById("contentToConvert");

    var img: any;
    var filename;
    var newImage: any;

    domtoimage
      .toPng(this.pdfTable, { bgcolor: "#fff" })

      .then(function (dataUrl) {
        img = new Image();
        img.src = dataUrl;
        newImage = img.src;

        img.onload = function () {
          // var pdfWidth = img.width;
          // var pdfHeight = img.height;
          var pdfWidth = 500;
          var pdfHeight = 270;

          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

          var doc;

          if (pdfWidth > pdfHeight) {
            doc = new jsPDF("l", "px", [pdfWidth, pdfHeight]);
          } else {
            doc = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
          }

          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();

          doc.addImage(newImage, "PNG", 10, 10, width, height);
          filename = "Profile" + Date() + ".pdf";
          doc.save(filename);

          this.DownloadPdf = "Completed Download";
        };
      })
      .catch(function (error) {
        // Error Handling
        this.DownloadPdf = "Convert PDF";
      });
    this.DownloadPdf = "Convert PDF";
  }
} //end
