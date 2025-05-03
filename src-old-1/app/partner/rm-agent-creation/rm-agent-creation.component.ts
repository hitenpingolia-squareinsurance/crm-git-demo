import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// import { ConfirmedValidator } from "../../../providers/confirmed.validator";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient } from "@angular/common/http";
import { OtpComponent } from "./otp/otp.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-rm-agent-creation",
  templateUrl: "./rm-agent-creation.component.html",
  styleUrls: ["./rm-agent-creation.component.css"],
})
export class RmAgentCreationComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  fieldTextType: boolean;

  DateOfBirthdayMsg: any = "";

  StepIIForm: FormGroup;
  StepIIisSubmitted = false;

  StepIIIForm: FormGroup;
  StepIIIisSubmitted = false;

  StepIVForm: FormGroup;
  StepIVisSubmitted = false;

  StepFinalForm: FormGroup;
  StepFinalisSubmitted = false;

  StepI: string = "1";
  StepII: string = "0";
  StepIII: string = "0";
  StepIV: string = "0";
  StepFinal: string = "0";

  States_Ar: any;
  District_Ar: any;
  Citites_Ar: any;
  Pincode_Ar: any;

  B_District_Ar: any;
  B_Citites_Ar: any;
  B_Pincode_Ar: any;

  Banks_Ar: any;

  selectedFiles: File;
  PanCard: File;
  AadharCardFront: File;
  AadharCardBack: File;
  Qualification: File;
  Cheque: File;
  Photo: File;
  Signature: File;
  Other: File;

  Type: any;
  RM_Data: any;
  Franchisee_Ar: any;

  DropdownSettings: any = {};

  //My
  otpForm: FormGroup;
  otpSent: boolean = false;
  otpError: string = "";
  showOTPInput = false;
  timerId: any;
  ResendOtpButton = true;
  val: any;
  resendButtonText: string;
  otpVerify: boolean = false;

  constructor(
    private http: HttpClient,
    public api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      RM_Id: ["", [Validators.required]],
      Agent_Type: ["", [Validators.required]],
      Franchisee_Id: [""],
      Agent_Category: ["", [Validators.required]],
      Salutation_Type: [""],
      Agent_Name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Gender: [""],
      Father_Name: [""],
      DOB: [""],
      Qualification: [""],

      ContactPerson_Name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      ContactPerson_Email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      ContactPerson_Mobile: [
        "",
        [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
      ],

      Password: [""],
      ConfirmPassword: [""],

      //Password: ['', [Validators.required,Validators.minLength(6),Validators.maxLength(14)]],
      //ConfirmPassword: ['', [Validators.required]],
      //},{
      //validator: ConfirmedValidator('Password', 'ConfirmPassword')
    });

    this.StepIIForm = this.formBuilder.group({
      Addres_Line_1: ["", [Validators.required]],
      Addres_Line_2: ["", [Validators.required]],
      State_Id: ["", [Validators.required]],
      District_Id: ["", [Validators.required]],
      City_Id: ["", [Validators.required]],
      Pincode: ["", [Validators.required]],
      Mobile: [
        "",
        [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
      ],
      Alternate_Mobile: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
    });

    this.StepIIIForm = this.formBuilder.group({
      GST_Status: [""],
      GST_No: [""],
      AadharCard_No: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ],
      PanCard_No: ["", [Validators.required]],
    });

    this.StepIVForm = this.formBuilder.group({
      Account_No: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      IFSC_Code: ["", [Validators.required]],
      Bank_Name: ["", [Validators.required]],
      Branch_Address: ["", [Validators.required]],
      State_Id: ["", [Validators.required]],
      District_Id: ["", [Validators.required]],
      City_Id: ["", [Validators.required]],
      Pincode: ["", [Validators.required]],
    });

    this.StepFinalForm = this.formBuilder.group({
      Pan_Card: ["", [Validators.required]],
      Aadhar_Card_Front: ["", [Validators.required]],
      Aadhar_Card_Back: ["", [Validators.required]],
      Qualification_Doc: [""],
      Cheque: ["", [Validators.required]],
      Photo: [""],
      Signature: [""],
      Other: [""],
    });

    this.DropdownSettings = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
      allowSearchFilter: true,
    };

    //My
    this.otpForm = new FormGroup({
      otp: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+91\d{10}$/),
      ]),
    });
    this.otpForm = this.formBuilder.group({
      otp: ["", Validators.required],
      showotp: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.States();
    this.Banks();
    this.Get_Rms();
    this.Get_Franchisee_By_RM_Id();
    this.onChangeDOB();

    this.Step_1();

    if (this.val == 1) {
      this.Step_Final();
    } else {
    }
  }

  get formControls() {
    return this.AddForm.controls;
  }
  get fc_StepIIForm() {
    return this.StepIIForm.controls;
  }
  get fc_StepIIIForm() {
    return this.StepIIIForm.controls;
  }
  get fc_StepIVForm() {
    return this.StepIVForm.controls;
  }
  get fc_StepFinalForm() {
    return this.StepFinalForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  Previous(Step) {
    //alert(Step);
    if (this.AddForm.value["Agent_Type"] == "SPC") {
      if (Step == 2) {
        this.StepI = "1";
        this.StepII = "0";
      }
      if (Step == 5) {
        this.StepI = "0";
        this.StepII = "1";
        this.StepIII = "0";
        this.StepIV = "0";
        this.StepFinal = "0";
      }
    } else {
      if (Step == 2) {
        this.StepI = "1";
        this.StepII = "0";
      }
      if (Step == 3) {
        this.StepI = "0";
        this.StepII = "1";
        this.StepIII = "0";
      }
      if (Step == 4) {
        this.StepI = "0";
        this.StepII = "0";
        this.StepIII = "1";
        this.StepIV = "0";
      }
      if (Step == 5) {
        this.StepI = "0";
        this.StepII = "0";
        this.StepIII = "0";
        this.StepIV = "1";
        this.StepFinal = "0";
      }
    }
  }

  onChangeAgentCategory(e) {
    var Type = e.target.value;
    //   //   //   console.log(Type);

    const Salutation_Type_Control = this.AddForm.get("Salutation_Type");
    const Gender_Control = this.AddForm.get("Gender");
    const Father_Name_Control = this.AddForm.get("Father_Name");
    const DOB_Control = this.AddForm.get("DOB");
    const Qualification_Control = this.AddForm.get("Qualification");

    const GST_Status_Control = this.StepIIIForm.get("GST_Status");
    const GST_No_Control = this.StepIIIForm.get("GST_No");
    const AadharCard_No_Control = this.StepIIIForm.get("AadharCard_No");

    const ContactPerson_Name_Control = this.AddForm.get("ContactPerson_Name");
    const ContactPerson_Email_Control = this.AddForm.get("ContactPerson_Email");
    const ContactPerson_Mobile_Control = this.AddForm.get(
      "ContactPerson_Mobile"
    );

    //const Pan_Card_Doc_Control = this.StepFinalForm.get('Pan_Card');
    const Aadhar_Card_Front_Doc_Control =
      this.StepFinalForm.get("Aadhar_Card_Front");
    const Aadhar_Card_Back_Doc_Control =
      this.StepFinalForm.get("Aadhar_Card_Back");
    const Qualification_Doc_Control =
      this.StepFinalForm.get("Qualification_Doc");

    //const Cheque_Doc_Control = this.StepFinalForm.get('Cheque');
    //const Photo_Doc_Control = this.StepFinalForm.get('Photo');
    //const Signature_Doc_Control = this.StepFinalForm.get('Signature');
    const Other_Doc_Control = this.StepFinalForm.get("Other");

    if (Type == "Individual") {
      Salutation_Type_Control.setValidators([Validators.required]);
      Gender_Control.setValidators([Validators.required]);
      Father_Name_Control.setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z ]*$"),
      ]);
      DOB_Control.setValidators([Validators.required]);
      Qualification_Control.setValidators([Validators.required]);

      GST_Status_Control.setValidators(null);
      GST_No_Control.setValidators(null);
      AadharCard_No_Control.setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(12),
        Validators.maxLength(12),
      ]);

      ContactPerson_Name_Control.setValidators(null);
      ContactPerson_Email_Control.setValidators(null);
      ContactPerson_Mobile_Control.setValidators(null);

      Aadhar_Card_Front_Doc_Control.setValidators([Validators.required]);
      Aadhar_Card_Back_Doc_Control.setValidators([Validators.required]);

      //Photo_Doc_Control.setValidators([Validators.required]);
      //Signature_Doc_Control.setValidators([Validators.required]);
      //Qualification_Doc_Control.setValidators([Validators.required]);
      Other_Doc_Control.setValidators(null);
    } else {
      // org
      Salutation_Type_Control.setValidators(null);
      Gender_Control.setValidators(null);
      Father_Name_Control.setValidators(null);
      DOB_Control.setValidators(null);
      Qualification_Control.setValidators(null);

      GST_Status_Control.setValidators([Validators.required]);
      GST_No_Control.setValidators([Validators.required]);

      AadharCard_No_Control.setValidators(null);

      Aadhar_Card_Front_Doc_Control.setValidators(null);
      Aadhar_Card_Back_Doc_Control.setValidators(null);

      //Photo_Doc_Control.setValidators(null);
      //Signature_Doc_Control.setValidators(null);
      //Qualification_Doc_Control.setValidators(null);
      Other_Doc_Control.setValidators([Validators.required]);

      if (this.AddForm.value["Agent_Type"] == "SP") {
        ContactPerson_Name_Control.setValidators([
          Validators.required,
          Validators.pattern("[a-zA-Z ]*$"),
        ]);
        ContactPerson_Email_Control.setValidators([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]);
        ContactPerson_Mobile_Control.setValidators([
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
        ]);
      }
    }

    Salutation_Type_Control.updateValueAndValidity();
    Gender_Control.updateValueAndValidity();
    Father_Name_Control.updateValueAndValidity();
    DOB_Control.updateValueAndValidity();
    Qualification_Control.updateValueAndValidity();

    GST_Status_Control.updateValueAndValidity();
    GST_No_Control.updateValueAndValidity();
    AadharCard_No_Control.updateValueAndValidity();

    ContactPerson_Name_Control.updateValueAndValidity();
    ContactPerson_Email_Control.updateValueAndValidity();
    ContactPerson_Mobile_Control.updateValueAndValidity();

    Aadhar_Card_Front_Doc_Control.updateValueAndValidity();
    Aadhar_Card_Back_Doc_Control.updateValueAndValidity();

    //Photo_Doc_Control.updateValueAndValidity();
    //Signature_Doc_Control.updateValueAndValidity();
    //Qualification_Doc_Control.updateValueAndValidity();
    Other_Doc_Control.updateValueAndValidity();
  }

  EmailLowerCase(e, Type) {
    var input = e.target.value;
    var lcaseValue = input.toLowerCase();
    //   //   //   console.log(lcaseValue);

    if (Type == "Email") {
      this.StepIIForm.get("Email").setValue(lcaseValue);
    } else {
      this.AddForm.get("ContactPerson_Email").setValue(lcaseValue);
    }
  }

  onChangeAgentType(e) {
    var Type = e.target.value;
    //   //   //   console.log(Type);

    const ContactPerson_Name_Control = this.AddForm.get("ContactPerson_Name");
    const ContactPerson_Email_Control = this.AddForm.get("ContactPerson_Email");
    const ContactPerson_Mobile_Control = this.AddForm.get(
      "ContactPerson_Mobile"
    );

    if (Type == "SP") {
      ContactPerson_Name_Control.setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z ]*$"),
      ]);
      ContactPerson_Email_Control.setValidators([
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]);
      ContactPerson_Mobile_Control.setValidators([
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      ]);
    } else {
      ContactPerson_Name_Control.setValidators(null);
      ContactPerson_Email_Control.setValidators(null);
      ContactPerson_Mobile_Control.setValidators(null);
    }

    ContactPerson_Name_Control.updateValueAndValidity();
    ContactPerson_Email_Control.updateValueAndValidity();
    ContactPerson_Mobile_Control.updateValueAndValidity();
  }

  onChangeGST_Status(e) {
    var Type = e.target.value;
    //   //   //   console.log(Type);

    const GST_No_Control = this.StepIIIForm.get("GST_No");

    if (Type == "Yes") {
      GST_No_Control.setValidators([Validators.required]);
    } else {
      GST_No_Control.setValidators(null);
    }
    GST_No_Control.updateValueAndValidity();
  }

  onChangeDOB() {
    const DOB_Control = this.AddForm.get("DOB");

    this.AddForm.get("DOB").valueChanges.subscribe((v) => {
      //   //   //   console.log(v);
      if (v != null) {
        //   //   //   console.log(this.ageFromDateOfBirthday(v));
        if (this.ageFromDateOfBirthday(v) < 18) {
          //   //   //   console.log("Eligibility 18 years Only. !");

          this.DateOfBirthdayMsg = "Eligibility 18 years Only. !";
          alert(this.DateOfBirthdayMsg);
          DOB_Control.setValue("");
        } else {
          this.DateOfBirthdayMsg = "";
        }
      }
    });
  }

  ageFromDateOfBirthday(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  Step_1() {
    //this.StepII = '1';
    //this.api.ToastMessage('Test');

    //   //   //   console.log(this.AddForm.value);
    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      this.StepI = "0";
      this.StepII = "1";
    }
  }

  Step_2() {
    /*
		this.StepI = '0';
		this.StepII = '0';
		this.StepIII = '1';
		*/

    this.StepIIisSubmitted = true;
    if (this.StepIIForm.invalid) {
      return;
    } else {
      var step2formvalue = this.StepIIForm.value;
      this.otpForm.patchValue({
        otp: step2formvalue["Mobile"],
      });

      this.StepI = "0";
      this.StepII = "0";

      if (this.AddForm.value["Agent_Type"] == "SPC") {
        this.StepFinal = "1";

        const Pan_Card_Doc_Control = this.StepFinalForm.get("Pan_Card");
        const Aadhar_Card_Front_Doc_Control =
          this.StepFinalForm.get("Aadhar_Card_Front");
        const Aadhar_Card_Back_Doc_Control =
          this.StepFinalForm.get("Aadhar_Card_Back");
        const Qualification_Doc_Control =
          this.StepFinalForm.get("Qualification_Doc");

        const Cheque_Doc_Control = this.StepFinalForm.get("Cheque");
        const Photo_Doc_Control = this.StepFinalForm.get("Photo");
        const Signature_Doc_Control = this.StepFinalForm.get("Signature");
        const Other_Doc_Control = this.StepFinalForm.get("Other");

        Pan_Card_Doc_Control.setValidators(null);
        Aadhar_Card_Front_Doc_Control.setValidators(null);
        Aadhar_Card_Back_Doc_Control.setValidators(null);
        Photo_Doc_Control.setValidators(null);
        Signature_Doc_Control.setValidators(null);
        Qualification_Doc_Control.setValidators(null);
        Cheque_Doc_Control.setValidators(null);
        Other_Doc_Control.setValidators(null);

        Aadhar_Card_Front_Doc_Control.updateValueAndValidity();
        Aadhar_Card_Back_Doc_Control.updateValueAndValidity();
        Pan_Card_Doc_Control.updateValueAndValidity();
        Photo_Doc_Control.updateValueAndValidity();
        Signature_Doc_Control.updateValueAndValidity();
        Cheque_Doc_Control.updateValueAndValidity();
        Qualification_Doc_Control.updateValueAndValidity();
        Other_Doc_Control.updateValueAndValidity();

        /*
				//   //   console.log(this.AddForm.value);
				//   //   console.log(this.StepIIForm.value);
				 
				const formData = new FormData(); 
				 
				formData.append('User_Id',this.api.GetUserId());
				formData.append('PersonalInfo',JSON.stringify(this.AddForm.value));
				formData.append('AddressInfo',JSON.stringify(this.StepIIForm.value));
				   
				
				this.api.IsLoading();
				this.api.HttpPostType('sr/RMAgentReport/Add_SPC',formData).then((result) => {
				this.api.HideLoading(); 
					if(result['Status'] == true){ 
						this.api.ToastMessage(result['Message']); 
						this.router.navigate(['/agent-report']);
						 
					}else{
						//alert(result['Message']);
						this.api.ErrorMsg(result['Message']); 
					}
				}, (err) => { 
				  this.api.HideLoading();
				  ////   //   console.log(err.message);
				  this.api.ErrorMsg(err.message);
				});
				*/
      } else {
        this.StepIII = "1";
      }

      //   //   //   console.log(this.AddForm.value);
      //   //   //   console.log(this.StepIIForm.value);
    }
  }

  Step_3() {
    /*
		this.StepI = '0';
		this.StepII = '0';
		this.StepIII = '0';
		this.StepIV = '1';
		*/

    this.StepIIIisSubmitted = true;
    if (this.StepIIIForm.invalid) {
      return;
    } else {
      this.StepI = "0";
      this.StepII = "0";
      this.StepIII = "0";
      this.StepIV = "1";

      //   //   //   console.log(this.AddForm.value);
      //   //   //   console.log(this.StepIIForm.value);
      //   //   //   console.log(this.StepIIIForm.value);
    }
  }

  Step_4() {
    /* 
		this.StepI = '0';
		this.StepII = '0';
		this.StepIII = '0';
		 
		*/

    this.StepIVisSubmitted = true;
    if (this.StepIVForm.invalid) {
      return;
    } else {
      this.StepI = "0";
      this.StepII = "0";
      this.StepIII = "0";
      //this.StepIV = '0';

      if (
        this.AddForm.value["Agent_Type"] == "SP" ||
        this.AddForm.value["Agent_Type"] == "Dealer"
      ) {
        this.StepIV = "0";
        this.StepFinal = "1";
      } else {
      }
    }
  }

  Step_Final() {
    this.StepFinalisSubmitted = true;
    if (this.StepFinalForm.invalid) {
      return;
    } else {
      if (this.otpVerify == true) {
        if (this.AddForm.value["Agent_Type"] == "SPC") {
          //   //   //   console.log(this.AddForm.value);
          //   //   //   console.log(this.StepIIForm.value);

          const formData = new FormData();

          formData.append("User_Id", this.api.GetUserId());
          formData.append("PersonalInfo", JSON.stringify(this.AddForm.value));
          formData.append("AddressInfo", JSON.stringify(this.StepIIForm.value));

          formData.append("PanCard", this.PanCard);
          formData.append("AadharCardFront", this.AadharCardFront);
          formData.append("AadharCardBack", this.AadharCardBack);
          formData.append("Qualification", this.Qualification);

          formData.append("Cheque", this.Cheque);
          formData.append("Photo", this.Photo);
          formData.append("Signature", this.Signature);
          formData.append("Other", this.Other);

          this.api.IsLoading();
          this.api.HttpPostTypeBms("sr/RMAgentReport/Add_SPC", formData).then(
            (result) => {
              this.api.HideLoading();
              if (result["Status"] == true) {
                this.api.Toast("Success", result["Message"]);
                this.router.navigate(["/partner/report"]);
              } else {
                //alert(result['Message']);
                this.api.Toast("Warning", result["Message"]);
              }
            },
            (err) => {
              this.api.HideLoading();
              ////   //   console.log(err.message);
              this.api.Toast("Warning", err.message);
            }
          );
        } else {
          //   //   //   console.log(this.AddForm.value);
          //   //   //   console.log(this.StepIIForm.value);
          //   //   //   console.log(this.StepIIIForm.value);
          //   //   //   console.log(this.StepIVForm.value);
          //   //   //   console.log(this.StepFinalForm.value);

          const formData = new FormData();

          formData.append("User_Id", this.api.GetUserId());

          formData.append("PersonalInfo", JSON.stringify(this.AddForm.value));
          formData.append("AddressInfo", JSON.stringify(this.StepIIForm.value));
          formData.append("KYCDetails", JSON.stringify(this.StepIIIForm.value));
          formData.append(
            "BankAccountDetails",
            JSON.stringify(this.StepIVForm.value)
          );

          formData.append("PanCard", this.PanCard);
          formData.append("AadharCardFront", this.AadharCardFront);
          formData.append("AadharCardBack", this.AadharCardBack);
          formData.append("Qualification", this.Qualification);

          formData.append("Cheque", this.Cheque);
          formData.append("Photo", this.Photo);
          formData.append("Signature", this.Signature);
          formData.append("Other", this.Other);

          this.api.IsLoading();
          this.api
            .HttpPostTypeBms("sr/RMAgentReport/Add_SP_Dealer", formData)
            .then(
              (result) => {
                this.api.HideLoading();
                if (result["Status"] == true) {
                  this.otpVerify = false;
                  this.api.Toast("Success", result["Message"]);
                  this.router.navigate(["/partner/report"]);
                } else {
                  //alert(result['Message']);
                  this.api.Toast("Warning", result["Message"]);
                }
              },
              (err) => {
                this.api.HideLoading();
                ////   //   console.log(err.message);
                this.api.Toast("Warning", err.message);
              }
            );
        }
      } else {
        this.otpVerify = false;
        this.sendOTP();
      }
    }
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

        //   //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "PanCard") {
            this.StepFinalForm.get("Pan_Card").setValue("");
          }
          if (Type == "AadharCardFront") {
            this.StepFinalForm.get("Aadhar_Card_Front").setValue("");
          }
          if (Type == "AadharCardBack") {
            this.StepFinalForm.get("Aadhar_Card_Back").setValue("");
          }
          if (Type == "Qualification") {
            this.StepFinalForm.get("Qualification_Doc").setValue("");
          }
          if (Type == "Cheque") {
            this.StepFinalForm.get("Cheque").setValue("");
          }
          if (Type == "Photo") {
            this.StepFinalForm.get("Photo").setValue("");
          }
          if (Type == "Signature") {
            this.StepFinalForm.get("Signature").setValue("");
          }
          if (Type == "Other") {
            this.StepFinalForm.get("Other").setValue("");
          }
        } else {
          if (Type == "PanCard") {
            this.PanCard = this.selectedFiles;
          }
          if (Type == "AadharCardFront") {
            this.AadharCardFront = this.selectedFiles;
          }
          if (Type == "AadharCardBack") {
            this.AadharCardBack = this.selectedFiles;
          }
          if (Type == "Qualification") {
            this.Qualification = this.selectedFiles;
          }
          if (Type == "Cheque") {
            this.Cheque = this.selectedFiles;
          }
          if (Type == "Photo") {
            this.Photo = this.selectedFiles;
          }
          if (Type == "Signature") {
            this.Signature = this.selectedFiles;
          }
          if (Type == "Other") {
            this.Other = this.selectedFiles;
          }
        }
      } else {
        //   //   //   console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "PanCard") {
          this.StepFinalForm.get("Pan_Card").setValue("");
        }
        if (Type == "AadharCardFront") {
          this.StepFinalForm.get("Aadhar_Card_Front").setValue("");
        }
        if (Type == "AadharCardBack") {
          this.StepFinalForm.get("Aadhar_Card_Back").setValue("");
        }
        if (Type == "Qualification") {
          this.StepFinalForm.get("Qualification_Doc").setValue("");
        }
        if (Type == "Cheque") {
          this.StepFinalForm.get("Cheque").setValue("");
        }
        if (Type == "Photo") {
          this.StepFinalForm.get("Photo").setValue("");
        }
        if (Type == "Signature") {
          this.StepFinalForm.get("Signature").setValue("");
        }
        if (Type == "Other") {
          this.StepFinalForm.get("Other").setValue("");
        }
      }
    }
  }

  Get_Rms() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "em/POS/Get_Rms?Role=" +
          this.api.GetUserData("User_Role") +
          "&User_Id=" +
          this.api.GetUserData("User_Id")
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Type = result["Type"];
            //if(this.Type=='AssignOtherRM'){
            this.RM_Data = result["RM_Data"];
            //}
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          alert(err.message);
        }
      );
  }

  Get_Franchisee_By_RM_Id() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "sr/RMAgentReport/Get_Franchisee_By_RM_Id?Role=" +
          this.api.GetUserData("User_Role") +
          "&User_Id=" +
          this.api.GetUserData("User_Id")
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Franchisee_Ar = result["Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          alert(err.message);
        }
      );
  }

  States() {
    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/States").then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.States_Ar = result["Data"];
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  District(e, type) {
    var id = e.Id;
    if (type == "onDeSelect") {
      id = 0;
    }
    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/District?State_Id=" + id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.StepIIForm.get("District_Id").setValue(null);
          this.StepIIForm.get("City_Id").setValue(null);
          this.StepIIForm.get("Pincode").setValue(null);

          this.District_Ar = result["Data"];
          this.Citites_Ar = [];
          this.Pincode_Ar = [];
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  City(e, type) {
    var id = e.Id;
    if (type == "onDeSelect") {
      id = 0;
    }
    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/City?District_Id=" + id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Citites_Ar = result["Data"];

          this.Pincode_Ar = [];

          this.StepIIForm.get("City_Id").setValue(null);
          this.StepIIForm.get("Pincode").setValue(null);
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  Pincode(e, type) {
    var id = e.Id;
    if (type == "onDeSelect") {
      id = 0;
    }

    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/Pincode?City_Id=" + id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Pincode_Ar = result["Data"];
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  B_District(e, type) {
    var id = e.Id;
    if (type == "onDeSelect") {
      id = 0;
    }

    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/District?State_Id=" + id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.B_District_Ar = result["Data"];

          this.B_Citites_Ar = [];
          this.B_Pincode_Ar = [];

          this.StepIVForm.get("District_Id").setValue(null);
          this.StepIVForm.get("City_Id").setValue(null);
          this.StepIVForm.get("Pincode").setValue(null);
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  B_City(e, type) {
    var id = e.Id;
    if (type == "onDeSelect") {
      id = 0;
    }

    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/City?District_Id=" + id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.B_Citites_Ar = result["Data"];

          this.B_Pincode_Ar = [];

          this.StepIVForm.get("City_Id").setValue(null);
          this.StepIVForm.get("Pincode").setValue(null);
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  B_Pincode(e, type) {
    var id = e.Id;
    if (type == "onDeSelect") {
      id = 0;
    }

    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/Pincode?City_Id=" + id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.B_Pincode_Ar = result["Data"];
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  Banks() {
    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/Banks").then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Banks_Ar = result["Data"];
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }

  //My
  sendOTP(): void {
    const formData = new FormData();
    var timeSec = 60;
    this.ResendOtpButton = true;
    formData.append("User_Id", this.api.GetUserId());
    formData.append("mobile", this.otpForm.get("otp").value);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("sr/RMAgentReport/otpSend", formData).then(
      (result) => {
        this.api.HideLoading();
        clearInterval(this.timerId);

        if (result["status"] == 1) {
          //   //   //   console.log("OTP sent:", result["otp"]);
          this.api.Toast("Success", result["msg"]);
          this.showOTPInput = true;
          this.otpSent = true;

          const dialogRef = this.dialog.open(OtpComponent, {
            width: "30%",
            height: "auto",
            disableClose: true,
            data: { number: this.otpForm.get("otp").value },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result["Status"] == true) {
              this.otpVerify = true;
              this.Step_Final();
            }
          });

          this.timerId = setInterval(() => {
            timeSec--;
            //   //   //   console.log(timeSec);
            const resendButton = document.getElementById("ResendOtpButton");
            if (resendButton) {
              resendButton.innerHTML = "Resend in " + timeSec;
            }
            this.ResendOtpButton = true;

            if (timeSec == 1) {
              timeSec = 60;
              if (resendButton) {
                resendButton.innerHTML = "Resend";
                $("#ResendOtpButton").prop("disabled", false);
                this.ResendOtpButton = false;
              }
              clearInterval(this.timerId);
            }
          }, 1000);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }
}
