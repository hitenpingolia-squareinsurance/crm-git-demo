import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-claim",
  templateUrl: "./edit-claim.component.html",
  styleUrls: ["./edit-claim.component.css"],
})
export class EditClaimComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;

  Quotation_Id: any = 0;
  Company_Name: string = "";
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
  Id: any;
  StepData: any = [];
  model = new Date();
  Garage_Pincodevalue: { Id: number; Name: string }[];
  Spot_Pincodevalue: any[];
  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditClaimComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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
      Intimation_Date: ["", [Validators.required]],
      Intimation_Time: ["", [Validators.required]],
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

    this.SearchPincodes("", 0);

    this.MaxDate = new Date();

    this.Id = data.Id;

    // alert(this.Id);
  }

  ngOnInit() {
    this.GetStates();

    this.FetchClaimData(this.Id);
  }

  FetchClaimData(Id: any) {
    this.api.HttpGetType("Claim/FetchClaimData?claim_id=" + Id).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);
        if (result["Status"] == true) {
          this.LossDate(result["Data"]["Date_Lose"]);

          this.MinDateSurvey = new Date(result["Data"]["Date_Lose"]);

          this.AddForm.patchValue(result["Data"]);
          this.MaxDateLoss = new Date(result["Data"]["Intimation_Date"]);

          this.AddForm.get("Intimation_Date").setValue(
            new Date(result["Data"]["Intimation_Date"])
          );
          this.AddForm.get("Date_Lose").setValue(
            new Date(result["Data"]["Date_Lose"])
          );
          this.AddForm.get("Spot_Survey_Date").setValue(
            new Date(result["Data"]["Spot_Survey_Date"])
          );
          this.AddForm.get("Survey_Date").setValue(
            new Date(result["Data"]["Survey_Date"])
          );
          // this.AddForm.get("Garage_Pincode").setValue([
          //   result["Data"]["Garage_Pincode"],
          // ]);

          this.Garage_Pincodevalue = [result["Data"]["Garage_Pincode"]];
          this.Spot_Pincodevalue = [result["Data"]["Spot_Pincode"]];

          //   //   //   console.log(
          //   this.AddForm.get("Garage_Pincode").setValue([
          //     result["Data"]["Garage_Pincode"],
          //   ])
          // );

          this.IntimationDate(result["Data"]["Intimation_Date"]);

          // console.log("Garage Pincode", result["Data"]["Garage_Pincode"]);
          // console.log("IntimationDate", result["Data"]["Intimation_Date"]);
          // console.log("Date_Lose", result["Data"]["Date_Lose"]);
          // console.log("Spot_Survey_Date", result["Data"]["Spot_Survey_Date"]);
          // console.log("Survey_Date", result["Data"]["Survey_Date"]);
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

  LossDate(Value) {
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
    // console.log(this.AddForm.invalid);

    var fields = this.AddForm.value;

    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      const formData = new FormData();
      // console.log(this.AddForm.value);

      formData.append("Id", this.Id);
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
      this.api.HttpPostType("Claim/EditClaim", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["Status"] == true) {
            this.buttonDisable = false;
            // var fields = this.AddForm.reset();
            this.CloseModel();
            this.api.Toast("Success", result["Message"]);

            // this.router.navigate(["claim-assistance/all-requests"]);
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
