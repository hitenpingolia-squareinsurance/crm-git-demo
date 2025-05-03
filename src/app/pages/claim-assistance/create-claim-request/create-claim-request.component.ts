import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-create-claim-request",
  templateUrl: "./create-claim-request.component.html",
  styleUrls: ["./create-claim-request.component.css"],
})
export class CreateClaimRequestComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;

  Quotation_Id: any = 0;
  Company_Name: any = "";
  buttonDisable = false;
  buttonPincode = true;

  State_Ar: any = [];
  District_Ar: any = [];
  City_Ar: any = [];
  Pincode_Ar: any = [];

  PincodData_Ar: any = [];
  SelectedState: any = [];
  SelectedDistrict: any = [];
  SelectedCity: any = [];

  dropdownSettings: any = {};
  dropdownSettings2: any = {};

  selectedFiles: File;
  Surveyor_Report: File;
  Other_Doc: File;
  MaxDate: Date;
  MaxDateLoss = new Date();
  MinDateSurvey = new Date();
  currentUrl: string;
  Divshow: any;
  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.currentUrl = this.router.url;
    this.Divshow = 0;

    this.AddForm = this.formBuilder.group({
      // <!-- Intimator’s Details -->
      Intimated_To_Insurer: ["", [Validators.required]],
      Claim_Intimated_By: ["", [Validators.required]],
      Intimator_Name: ["", [Validators.required]],
      Intimator_Contact_No: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Alternate_No: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          ,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      WhatsApp_No: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Mail_Id: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
      ],
      Claim_Intimation_No: [""],
      Intimation_Date: [""],
      Intimation_Time: [""],
      Fir_Status: ["", [Validators.required]],
      Fir_Remarks: [""],
      Reason_Delay_Intimation: [""],

      // <!-- Accident Details -->

      LossType: ["", [Validators.required]],
      CauseOfLossType: ["", [Validators.required]],
      Date_Lose: ["", [Validators.required]],
      Time_Lose: ["", [Validators.required]],
      Estimated_Amount: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(15),
        ],
      ],
      Accident_Garage_Name: [""],
      Accident_Garage_Near_LandMark: [""],
      Garage_Pincode: [""],
      Garage_State_Id: [{ value: "", disabled: true }],
      Garage_District_Id: [{ value: "", disabled: true }],
      Garage_City_Id: [{ value: "", disabled: true }],
      Tp_loss_Remarks: [""],
      Tp_loss_Status: [""],

      customeremail: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],
      customermobileno: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Registration_State_Code: [
        "",
        [Validators.pattern("[a-zA-Z ]*$"), Validators.required],
      ],
      Registration_District_Code: [
        "",
        [Validators.pattern("^[0-9]*$"), Validators.required],
      ],
      Registration_City_Code: [
        "",
        [Validators.pattern("[a-zA-Z ]*$"), Validators.required],
      ],
      Registration_Code: [
        "",
        [Validators.pattern("^[0-9]*$"), Validators.required],
      ],

      // <!-- Driver Details -->
      Driver_Name: [""],
      Driver_Contact_No: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Driver_DL_No: [""],

      // <!-- Spot Surveyor Details -->
      Spot_Survey_Status: ["No", [Validators.required]],
      Spot_Survey_Date: [""],
      Spot_Survey_Time: [""],
      Spot_Surveyor_Name: [""],
      Spot_Surveyor_Mobile: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Spot_Surveyor_location: [""],
      Spot_Pincode: [""],
      Spot_State_Id: [{ value: "", disabled: true }],
      Spot_District_Id: [{ value: "", disabled: true }],
      Spot_City_Id: [{ value: "", disabled: true }],

      // <!-- Surveyor Details -->

      Survey_Status: ["No", [Validators.required]],
      Survey_Date: [""],
      Survey_Time: [""],
      Surveyor_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      Surveyor_Mobile: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Survey_Type: [""],
      Survey_Mail_Id: [
        "",
        [Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
      Remark: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      Other_Doc: [""],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.dropdownSettings2 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      allowRemoteDataSearch: true,
    };

    this.Quotation_Id =
      this.activatedRoute.snapshot.paramMap.get("Quotation_Id");
    this.Company_Name =
      this.activatedRoute.snapshot.paramMap.get("Company_Name");
    // console.log(this.Quotation_Id);
    // console.log(this.Company_Name);
    this.SearchPincodes("", 0);

    this.MaxDate = new Date();
  }

  ngOnInit() {
    this.GetStates();
    this.CheckRights();
    this.GetSrDetails();
  }

  get FC() {
    return this.AddForm.controls;
  }

  // onChangeIntimated_To_Insurer(e) {
  //   var Type = e.target.value;
  //   const Intimation_Date_Time = this.AddForm.get("Intimation_Date_Time");
  //   const Claim_Intimation_No = this.AddForm.get("Claim_Intimation_No");
  //   if (Type == "No") {
  //     Intimation_Date_Time.disable();
  //     Claim_Intimation_No.disable();
  //   } else {
  //     Intimation_Date_Time.enable();
  //     Claim_Intimation_No.enable();
  //   }
  // }

  onChangeSurvey_Status(e, Value: any) {
    var Type = e.target.value;
    // surveyer details
    const Survey_Date = this.AddForm.get("Survey_Date");
    const Survey_Time = this.AddForm.get("Survey_Time");
    const Surveyor_Name = this.AddForm.get("Surveyor_Name");
    const Surveyor_Mobile = this.AddForm.get("Surveyor_Mobile");
    const Survey_Type = this.AddForm.get("Survey_Type");
    const Survey_Mail_Id = this.AddForm.get("Survey_Mail_Id");

    //Spot Survey Details
    const Spot_Survey_Date = this.AddForm.get("Spot_Survey_Date");
    const Spot_Survey_Time = this.AddForm.get("Spot_Survey_Time");
    const Spot_Surveyor_Name = this.AddForm.get("Spot_Surveyor_Name");
    const Spot_Surveyor_Mobile = this.AddForm.get("Spot_Surveyor_Mobile");
    const Spot_Pincode = this.AddForm.get("Spot_Pincode");
    const Spot_State_Id = this.AddForm.get("Spot_State_Id");
    const Spot_District_Id = this.AddForm.get("Spot_District_Id");
    const Spot_City_Id = this.AddForm.get("Spot_City_Id");
    const Spot_Surveyor_location = this.AddForm.get("Spot_Surveyor_location");
  }

  SearchPincodes(e, Type) {
    var pincode = "";
    if (Type == 1) {
      pincode = e.target.value;
    }
    // console.log(pincode);
    //this.api.IsLoading();
    this.api
      .HttpGetType("Geographically/RoleGetPincodeData?Pincode=" + pincode)
      .then(
        (result) => {
          //this.api.HideLoading();

          if (result["status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.Pincode_Ar = result["data"];
            //// console.log(result['data']);
          } else {
            //alert(result['message']);
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

            if (type == "Spot_Survey") {
              this.AddForm.get("Spot_State_Id").setValue(row.State_Name);
              this.AddForm.get("Spot_District_Id").setValue(row.District_Name);
              this.AddForm.get("Spot_City_Id").setValue(
                row.City_or_Village_Name
              );
            }
            if (type == "Garage") {
              this.AddForm.get("Garage_State_Id").setValue(row.State_Name);
              this.AddForm.get("Garage_District_Id").setValue(
                row.District_Name
              );
              this.AddForm.get("Garage_City_Id").setValue(
                row.City_or_Village_Name
              );
            }
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

  GetStates() {
    this.api.IsLoading();
    this.api.HttpGetType("Geographically/RoleSetStateData").then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          //this.api.Toast('Success',result['msg']);
          this.State_Ar = result["data"];
        } else {
          //alert(result['message']);
          this.api.Toast("Warning", result["msg"]);
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

  onItemSelect(item: any, Type) {
    if (Type == "Intimation_Date") {
      // alert();
      // console.log(item);
    }
  }

  DateValueblank(type) {
    if (type == "loss") {
      this.AddForm.get("Date_Lose").setValue("");
    }

    if (type == "Survey") {
      this.AddForm.get("Spot_Survey_Date").setValue("");
      this.AddForm.get("Survey_Date").setValue("");
    }
  }

  IntimationDate(Value) {
    var fields = this.AddForm.value;
    const formData = new FormData();

    var datess = this.api.StandrdToDDMMYYY(Value);
    formData.append("Intimation_Date", this.api.StandrdToDDMMYYY(Value));

    // console.log(datess);

    this.api.IsLoading();
    this.api.HttpPostType("Claim/GetLossDate", formData).then(
      (result) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["Status"] == true) {
          this.MaxDateLoss = new Date(result["Data"]);

          this.MinDateSurvey = new Date(result["Data"]);
          // console.log(result["Data"]);
          // console.log(this.MaxDate);
        } else {
          //alert(result['message']);
          this.buttonDisable = false;

          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.buttonDisable = false;

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

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 3 mb");

          if (Type == "Surveyor_Report") {
            this.AddForm.get("Surveyor_Report").setValue("");
          }
          if (Type == "Other_Doc") {
            this.AddForm.get("Other_Doc").setValue("");
          }
        } else {
          if (Type == "Surveyor_Report") {
            this.Surveyor_Report = this.selectedFiles;
          }
          if (Type == "Other_Doc") {
            this.Other_Doc = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "Surveyor_Report") {
          this.AddForm.get("Surveyor_Report").setValue("");
        }
        if (Type == "Other_Doc") {
          this.AddForm.get("Other_Doc").setValue("");
        }
      }
    }
  }

  CreateClaim() {
    // console.log(this.AddForm.value);
    // console.log(this.AddForm.invalid);
    var fields = this.AddForm.value;

    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      const formData = new FormData();
      // console.log(this.AddForm.value);

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Quotation_Id", this.Quotation_Id);
      formData.append("Company_Name", this.Company_Name);

      //Intimated Details
      formData.append("Intimated_To_Insurer", fields["Intimated_To_Insurer"]);
      formData.append("Claim_Intimated_By", fields["Claim_Intimated_By"]);
      formData.append("Intimation_Time", fields["Intimation_Time"]);
      formData.append(
        "Intimation_Date",
        this.api.StandrdToDDMMYYY(fields["Intimation_Date"])
      );
      formData.append("Claim_Intimation_No", fields["Claim_Intimation_No"]);
      formData.append("Intimator_Name", fields["Intimator_Name"]);
      formData.append("Intimator_Contact_No", fields["Intimator_Contact_No"]);
      formData.append("Alternate_No", fields["Alternate_No"]);
      formData.append("WhatsApp_No", fields["WhatsApp_No"]);
      formData.append("Mail_Id", fields["Mail_Id"]);
      formData.append(
        "Reason_Delay_Intimation",
        fields["Reason_Delay_Intimation"]
      );

      //Accidental Details
      formData.append("LossType", fields["LossType"]);
      formData.append("CauseOfLossType", fields["CauseOfLossType"]);
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

      formData.append("customermobileno", fields["customermobileno"]);
      formData.append("customeremail", fields["customeremail"]);

      formData.append(
        "Date_Lose",
        this.api.StandrdToDDMMYYY(fields["Date_Lose"])
      );
      formData.append("Time_Lose", fields["Time_Lose"]);

      formData.append("Estimated_Amount", fields["Estimated_Amount"]);
      formData.append("Accident_Garage_Name", fields["Accident_Garage_Name"]);
      formData.append(
        "Accident_Garage_Near_LandMark",
        fields["Accident_Garage_Near_LandMark"]
      );
      formData.append(
        "Garage_Pincode",
        JSON.stringify(fields["Garage_Pincode"])
      );

      formData.append("Fir_Status", fields["Fir_Status"]);
      formData.append("Fir_Remarks", fields["Fir_Remarks"]);
      formData.append("Tp_loss_Status", fields["Tp_loss_Status"]);
      formData.append("Tp_loss_Remarks", fields["Tp_loss_Remarks"]);

      //Driver Details
      formData.append("Driver_Name", fields["Driver_Name"]);
      formData.append("Driver_Contact_No", fields["Driver_Contact_No"]);
      formData.append("Driver_DL_No", fields["Driver_DL_No"]);

      //Spot Survey
      formData.append("Spot_Survey_Status", fields["Spot_Survey_Status"]);

      formData.append(
        "Spot_Survey_Date",
        this.api.StandrdToDDMMYYY(fields["Spot_Survey_Date"])
      );
      formData.append("Spot_Survey_Time", fields["Spot_Survey_Time"]);

      formData.append("Spot_Surveyor_Name", fields["Spot_Surveyor_Name"]);
      formData.append("Spot_Surveyor_Mobile", fields["Spot_Surveyor_Mobile"]);
      formData.append(
        "Spot_Surveyor_location",
        fields["Spot_Surveyor_location"]
      );
      formData.append("Spot_Pincode", JSON.stringify(fields["Spot_Pincode"]));

      //Survey
      formData.append("Survey_Status", fields["Survey_Status"]);

      formData.append(
        "Survey_Date",
        this.api.StandrdToDDMMYYY(fields["Survey_Date"])
      );
      formData.append("Survey_Time", fields["Survey_Time"]);

      formData.append("Surveyor_Name", fields["Surveyor_Name"]);
      formData.append("Surveyor_Mobile", fields["Surveyor_Mobile"]);
      formData.append("Survey_Mail_Id", fields["Survey_Mail_Id"]);
      formData.append("Survey_Type", fields["Survey_Type"]);
      formData.append("Source", "Web");

      this.api.IsLoading();
      this.api.HttpPostType("Claim/AddClaim", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["Status"] == true) {
            this.buttonDisable = false;
            var fields = this.AddForm.reset();

            this.api.Toast("Success", result["Message"]);
            this.router.navigate(["claim-assistance/all-requests"]);
          } else if (result["Status"] == 2) {
            this.buttonDisable = false;

            this.AddForm.get("Reason_Delay_Intimation").setValidators([
              Validators.required,
            ]);
            this.AddForm.get(
              "Reason_Delay_Intimation"
            ).updateValueAndValidity();

            this.api.Toast("Required", result["Message"]);
          } else {
            //alert(result['message']);
            this.buttonDisable = false;

            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.buttonDisable = false;

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

  CheckRights() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Url", "claim");

    // // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("Offlinequote/CheckRights", formData).then(
      (result) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["status"] == 1) {
          this.Divshow = 1;

          const Intimated_To_Insurer = this.AddForm.get("Intimated_To_Insurer");
          Intimated_To_Insurer.setValidators(null);
          Intimated_To_Insurer.updateValueAndValidity();

          const Claim_Intimated_By = this.AddForm.get("Claim_Intimated_By");
          Claim_Intimated_By.setValidators(null);
          Claim_Intimated_By.updateValueAndValidity();

          const Intimator_Name = this.AddForm.get("Intimator_Name");
          Intimator_Name.setValidators(null);
          Intimator_Name.updateValueAndValidity();

          const Intimator_Contact_No = this.AddForm.get("Intimator_Contact_No");
          Intimator_Contact_No.setValidators(null);
          Intimator_Contact_No.updateValueAndValidity();

          const WhatsApp_No = this.AddForm.get("WhatsApp_No");
          WhatsApp_No.setValidators(null);
          WhatsApp_No.updateValueAndValidity();

          const Mail_Id = this.AddForm.get("Mail_Id");
          Mail_Id.setValidators(null);
          Mail_Id.updateValueAndValidity();

          const Fir_Status = this.AddForm.get("Fir_Status");
          Fir_Status.setValidators(null);
          Fir_Status.updateValueAndValidity();

          const LossType = this.AddForm.get("LossType");
          LossType.setValidators(null);
          LossType.updateValueAndValidity();

          const CauseOfLossType = this.AddForm.get("CauseOfLossType");
          CauseOfLossType.setValidators(null);
          CauseOfLossType.updateValueAndValidity();

          const Date_Lose = this.AddForm.get("Date_Lose");
          Date_Lose.setValidators(null);
          Date_Lose.updateValueAndValidity();

          const Estimated_Amount = this.AddForm.get("Estimated_Amount");
          Estimated_Amount.setValidators(null);
          Estimated_Amount.updateValueAndValidity();

          const Time_Lose = this.AddForm.get("Time_Lose");
          Time_Lose.setValidators(null);
          Time_Lose.updateValueAndValidity();

          const Registration_State_Code = this.AddForm.get(
            "Registration_State_Code"
          );
          Registration_State_Code.setValidators(null);
          Registration_State_Code.updateValueAndValidity();

          const Registration_District_Code = this.AddForm.get(
            "Registration_District_Code"
          );
          Registration_District_Code.setValidators(null);
          Registration_District_Code.updateValueAndValidity();

          const Registration_City_Code = this.AddForm.get(
            "Registration_City_Code"
          );
          Registration_City_Code.setValidators(null);
          Registration_City_Code.updateValueAndValidity();

          const Registration_Code = this.AddForm.get("Registration_Code");
          Registration_Code.setValidators(null);
          Registration_Code.updateValueAndValidity();

          const Survey_Status = this.AddForm.get("Survey_Status");
          Survey_Status.setValidators(null);
          Survey_Status.updateValueAndValidity();

          const Spot_Survey_Status = this.AddForm.get("Spot_Survey_Status");
          Spot_Survey_Status.setValidators(null);
          Spot_Survey_Status.updateValueAndValidity();
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

  GetSrDetails() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Quotation_Id", this.Quotation_Id);
    formData.append("Company_Name", this.Company_Name);

    this.api.IsLoading();
    this.api.HttpPostType("Claim/GetSrDetails", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          // $response['Customer_Mobile'] = $SrMaster->Customer_Mobile;
          // $response['Customer_Name'] = $SrMaster->Customer_Name;

          this.AddForm.get("Registration_State_Code").setValue(result["RN_1"]);
          this.AddForm.get("Registration_District_Code").setValue(
            result["RN_2"]
          );
          this.AddForm.get("Registration_City_Code").setValue(result["RN_3"]);
          this.AddForm.get("Registration_Code").setValue(result["RN_4"]);

          this.AddForm.get("customeremail").setValue(result["Customer_Email"]);
          this.AddForm.get("customermobileno").setValue(
            result["Customer_Mobile"]
          );

          // this.api.Toast("Success", result["Message"]);
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.buttonDisable = false;

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
