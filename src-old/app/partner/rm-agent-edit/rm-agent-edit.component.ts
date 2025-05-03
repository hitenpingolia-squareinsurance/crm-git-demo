import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// import { ConfirmedValidator } from '../../../providers/confirmed.validator';
import { ApiService } from "src/app/providers/api.service";

@Component({
  selector: "app-rm-agent-edit",
  templateUrl: "./rm-agent-edit.component.html",
  styleUrls: ["./rm-agent-edit.component.css"],
})
export class RmAgentEditComponent implements OnInit {
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

  Agent_Id: any = 0;
  AgentRow: any;
  AgentDocuments: any;
  POSListAr: any = [];

  AadharCardFrontAr: any = [];
  AadharCardBackAr: any = [];
  PanCardAr: any = [];
  QualificationAr: any = [];
  ChequeAr: any = [];
  PhotoAr: any = [];
  SignatureAr: any = [];
  OtherAr: any = [];

  Base_Url: any;

  DropdownSettings: any = {};

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Agent_Type: [""],
      Merge_Status: ["No"],
      PosCode: [{ value: "", disabled: true }],
      Franchisee_Id: [""],
      Agent_Category: ["", [Validators.required]],
      Salutation_Type: [""],
      Agent_Name: [
        { value: "", disabled: true },
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Gender: [""],
      Father_Name: [""],
      DOB: [""],
      Qualification: ["", [Validators.required]],

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
  }

  ngOnInit() {
    this.Agent_Id = this.activatedRoute.snapshot.paramMap.get("Id");
    //   //   console.log(this.Agent_Id);

    this.States();
    this.Banks();
    this.Get_Rms();
    this.Get_Franchisee_By_RM_Id();
    this.onChangeDOB();

    this.Step_1();
    this.GetComponents();
  }

  MergeStatus(e) {
    var Merge_Status = e.target.value;
    //   //   //   console.log(Merge_Status);

    const PosCode_Control = this.AddForm.get("PosCode");

    if (Merge_Status == "Yes") {
      PosCode_Control.setValidators([Validators.required]);
      PosCode_Control.enable();
    } else {
      PosCode_Control.setValidators(null);
      PosCode_Control.disable();
    }

    PosCode_Control.updateValueAndValidity();
  }

  GetComponents() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "sr/RMAgentReport/EditAgentComponents?Agent_Id=" +
          this.Agent_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.AgentRow = result["AgentRow"];
            this.POSListAr = result["POSList"];
            this.Base_Url = result["Base_Url"] + this.Agent_Id + "/";

            //this.AgentDocuments =  result['AgentDocuments'];

            this.AadharCardFrontAr = result["AadharCardFront"];
            this.AadharCardBackAr = result["AadharCardBack"];
            this.PanCardAr = result["PanCard"];
            this.QualificationAr = result["Qualification"];
            this.ChequeAr = result["Cheque"];
            this.PhotoAr = result["Photo"];
            this.SignatureAr = result["Signature"];
            this.OtherAr = result["Other"];

            this.District_Ar = result["District_Ar"];
            this.Citites_Ar = result["City_Ar"];
            this.Pincode_Ar = result["PinCode_Ar"];

            this.B_District_Ar = result["B_District_Ar"];
            this.B_Citites_Ar = result["B_Citites_Ar"];
            this.B_Pincode_Ar = result["B_Pincode_Ar"];

            const Aadhar_Card_Front_Control =
              this.StepFinalForm.get("Aadhar_Card_Front");
            const Aadhar_Card_Back_Control =
              this.StepFinalForm.get("Aadhar_Card_Back");
            const Pan_Card_Control = this.StepFinalForm.get("Pan_Card");

            const Qualification_Doc_Control =
              this.StepFinalForm.get("Qualification_Doc");
            const Cheque_Control = this.StepFinalForm.get("Cheque");

            const Photo_Control = this.StepFinalForm.get("Photo");
            const Signature_Control = this.StepFinalForm.get("Signature");
            const Other_Doc_Control = this.StepFinalForm.get("Other");

            if (this.AadharCardFrontAr.Document_File_Name != "") {
              Aadhar_Card_Front_Control.setValidators(null);
            }
            if (this.AadharCardBackAr.Document_File_Name != "") {
              Aadhar_Card_Back_Control.setValidators(null);
            }

            if (this.QualificationAr.Document_File_Name != "") {
              Qualification_Doc_Control.setValidators(null);
            }
            if (this.PanCardAr.Document_File_Name != "") {
              Pan_Card_Control.setValidators(null);
            }

            if (this.ChequeAr.Document_File_Name != "") {
              Cheque_Control.setValidators(null);
            }
            if (this.PhotoAr.Document_File_Name != "") {
              Photo_Control.setValidators(null);
            }
            if (this.SignatureAr.Document_File_Name != "") {
              Signature_Control.setValidators(null);
            }
            if (this.OtherAr.Document_File_Name != "") {
              Other_Doc_Control.setValidators(null);
            }

            Pan_Card_Control.updateValueAndValidity();
            Aadhar_Card_Front_Control.updateValueAndValidity();
            Aadhar_Card_Back_Control.updateValueAndValidity();
            Qualification_Doc_Control.updateValueAndValidity();
            Cheque_Control.updateValueAndValidity();
            Photo_Control.updateValueAndValidity();
            Signature_Control.updateValueAndValidity();
            Other_Doc_Control.updateValueAndValidity();

            this.AddForm.get("Agent_Type").setValue(this.AgentRow["Type"]);
            this.AddForm.get("Agent_Type").disable();

            this.AddForm.get("Franchisee_Id").setValue(
              this.AgentRow["Franchisee_Id"]
            );
            this.AddForm.get("Agent_Category").setValue(
              this.AgentRow["Agent_Category"]
            );
            this.AddForm.get("Salutation_Type").setValue(
              this.AgentRow["Salutation_Type"]
            );
            this.AddForm.get("Agent_Name").setValue(this.AgentRow["Name"]);
            this.AddForm.get("Gender").setValue(this.AgentRow["Gender"]);
            this.AddForm.get("Father_Name").setValue(
              this.AgentRow["Father_Name"]
            );
            this.AddForm.get("DOB").setValue(this.AgentRow["DOB"]);

            this.AddForm.get("Qualification").setValue(
              this.AgentRow["Qualification"]
            );

            if (this.AgentRow["Type"] == "SP") {
              //&& this.AgentRow['Agent_Category']=='Institution'

              this.onChangeAgentType(
                this.AgentRow["Type"],
                this.AgentRow["Agent_Category"]
              );

              this.AddForm.get("ContactPerson_Name").setValue(
                this.AgentRow["ContactPerson_Name"]
              );
              this.AddForm.get("ContactPerson_Email").setValue(
                this.AgentRow["ContactPerson_Email"]
              );
              this.AddForm.get("ContactPerson_Mobile").setValue(
                this.AgentRow["ContactPerson_Mobile"]
              );
            }

            this.onChangeAgentCategory(this.AgentRow["Agent_Category"], 1);

            this.AddForm.get("Password").setValue(this.AgentRow["Pass"]);
            this.AddForm.get("ConfirmPassword").setValue(this.AgentRow["Pass"]);

            //////////////

            this.StepIIForm.get("Addres_Line_1").setValue(
              this.AgentRow["Addres_Line_1"]
            );
            this.StepIIForm.get("Addres_Line_2").setValue(
              this.AgentRow["Addres_Line_2"]
            );
            this.StepIIForm.get("State_Id").setValue(this.AgentRow["State_Id"]);
            this.StepIIForm.get("District_Id").setValue(
              this.AgentRow["District_Id"]
            );
            this.StepIIForm.get("City_Id").setValue(this.AgentRow["City_Id"]);
            this.StepIIForm.get("Pincode").setValue(
              this.AgentRow["Pincode_Id"]
            );
            this.StepIIForm.get("Mobile").setValue(this.AgentRow["Mobile"]);
            this.StepIIForm.get("Email").setValue(this.AgentRow["Email"]);

            ////////////////

            ////////////////

            this.StepIIIForm.get("GST_Status").setValue(
              this.AgentRow["GST_Status"]
            );
            this.StepIIIForm.get("GST_No").setValue(this.AgentRow["GST_No"]);
            this.StepIIIForm.get("AadharCard_No").setValue(
              this.AgentRow["AadharCard_No"]
            );
            this.StepIIIForm.get("PanCard_No").setValue(
              this.AgentRow["PanCard_No"]
            );

            ///////////

            /////////////////////////
            this.StepIVForm.get("Account_No").setValue(
              this.AgentRow["Account_No"]
            );
            this.StepIVForm.get("IFSC_Code").setValue(
              this.AgentRow["IFSC_Code"]
            );
            this.StepIVForm.get("Bank_Name").setValue(
              this.AgentRow["Bank_Name"]
            );
            this.StepIVForm.get("Branch_Address").setValue(
              this.AgentRow["Branch_Address"]
            );
            this.StepIVForm.get("State_Id").setValue(
              this.AgentRow["Branch_State_Id"]
            );
            this.StepIVForm.get("District_Id").setValue(
              this.AgentRow["Branch_District_Id"]
            );
            this.StepIVForm.get("City_Id").setValue(
              this.AgentRow["Branch_City_Id"]
            );
            this.StepIVForm.get("Pincode").setValue(
              this.AgentRow["Branch_Pincode_Id"]
            );

            /////////////////////////
            this.api.HideLoading();
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

  EmailLowerCase(e, Type) {
    var input = e.target.value;
    var lcaseValue = input.toLowerCase();
    if (Type == "Email") {
      this.StepIIForm.get("Email").setValue(lcaseValue);
    } else {
      this.AddForm.get("ContactPerson_Email").setValue(lcaseValue);
    }
  }

  ViewDocument(name) {
    let url;
    if (this.AgentRow.Type == "POS") {
      url = name;
    } else {
      url = this.Base_Url + name;
    }

    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
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

  onChangeAgentCategory(e, Status) {
    //alert(e.target.value);
    if (Status == 1) {
      var Type = e;
    } else {
      var Type = e.target.value;
    }

    //   //   console.log(Type);

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

    /*
		//const Pan_Card_Doc_Control = this.StepFinalForm.get('Pan_Card');
		const Aadhar_Card_Front_Doc_Control = this.StepFinalForm.get('Aadhar_Card_Front');
		const Aadhar_Card_Back_Doc_Control = this.StepFinalForm.get('Aadhar_Card_Back');
		const Qualification_Doc_Control = this.StepFinalForm.get('Qualification_Doc');
		
		//const Cheque_Doc_Control = this.StepFinalForm.get('Cheque');
		const Photo_Doc_Control = this.StepFinalForm.get('Photo');
		const Signature_Doc_Control = this.StepFinalForm.get('Signature');
		const Other_Doc_Control = this.StepFinalForm.get('Other');	
		*/

    const Aadhar_Card_Front_Control =
      this.StepFinalForm.get("Aadhar_Card_Front");
    const Aadhar_Card_Back_Control = this.StepFinalForm.get("Aadhar_Card_Back");
    const Pan_Card_Control = this.StepFinalForm.get("Pan_Card");

    //const Qualification_Doc_Control = this.StepFinalForm.get('Qualification_Doc');
    const Cheque_Control = this.StepFinalForm.get("Cheque");

    //const Photo_Control = this.StepFinalForm.get('Photo');
    //const Signature_Control = this.StepFinalForm.get('Signature');
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

      /*
			Aadhar_Card_Front_Doc_Control.setValidators([Validators.required]); 
			Aadhar_Card_Back_Doc_Control.setValidators([Validators.required]);
			Photo_Doc_Control.setValidators([Validators.required]);
			Signature_Doc_Control.setValidators([Validators.required]);
			Qualification_Doc_Control.setValidators([Validators.required]);
			Other_Doc_Control.setValidators(null); 
			*/

      if (this.AadharCardFrontAr.Document_File_Name != "") {
        Aadhar_Card_Front_Control.setValidators(null);
      } else {
        Aadhar_Card_Front_Control.setValidators(Validators.required);
      }

      if (this.AadharCardBackAr.Document_File_Name != "") {
        Aadhar_Card_Back_Control.setValidators(null);
      } else {
        Aadhar_Card_Back_Control.setValidators(Validators.required);
      }

      if (this.QualificationAr.Document_File_Name != "") {
        //Qualification_Doc_Control.setValidators(null);
      }

      if (this.PanCardAr.Document_File_Name != "") {
        Pan_Card_Control.setValidators(null);
      } else {
        Pan_Card_Control.setValidators(Validators.required);
      }

      if (this.ChequeAr.Document_File_Name != "") {
        Cheque_Control.setValidators(null);
      } else {
        Cheque_Control.setValidators(Validators.required);
      }

      if (this.PhotoAr.Document_File_Name != "") {
        //Photo_Control.setValidators(null);
      } else {
        //Photo_Control.setValidators(Validators.required);
      }

      if (this.SignatureAr.Document_File_Name != "") {
        //Signature_Control.setValidators(null);
      } else {
        //Signature_Control.setValidators(Validators.required);
      }
      //if(this.OtherAr.Document_File_Name!=''){
      Other_Doc_Control.setValidators(null);
      //}
    } else {
      //alert();
      Salutation_Type_Control.setValidators(null);
      Gender_Control.setValidators(null);
      Father_Name_Control.setValidators(null);
      DOB_Control.setValidators(null);
      Qualification_Control.setValidators(null);

      GST_Status_Control.setValidators([Validators.required]);
      GST_No_Control.setValidators([Validators.required]);
      AadharCard_No_Control.setValidators(null);

      /*
			Aadhar_Card_Front_Doc_Control.setValidators(null);
			Aadhar_Card_Back_Doc_Control.setValidators(null);
			Photo_Doc_Control.setValidators(null);
			Signature_Doc_Control.setValidators(null);
			Qualification_Doc_Control.setValidators(null);
			Other_Doc_Control.setValidators([Validators.required]);
			*/

      //if(this.AadharCardFrontAr.Document_File_Name!=''){
      Aadhar_Card_Front_Control.setValidators(null);
      //}
      //if(this.AadharCardBackAr.Document_File_Name!=''){
      Aadhar_Card_Back_Control.setValidators(null);
      //}

      //if(this.QualificationAr.Document_File_Name!=''){
      //Qualification_Doc_Control.setValidators(null);
      //}
      if (this.PanCardAr.Document_File_Name != "") {
        Pan_Card_Control.setValidators(null);
      } else {
        Pan_Card_Control.setValidators(Validators.required);
      }

      if (this.ChequeAr.Document_File_Name != "") {
        Cheque_Control.setValidators(null);
      } else {
        Cheque_Control.setValidators(Validators.required);
      }
      //if(this.PhotoAr.Document_File_Name!=''){
      //Photo_Control.setValidators(null);
      //}
      //if(this.SignatureAr.Document_File_Name!=''){
      //Signature_Control.setValidators(null);
      //}
      if (this.OtherAr.Document_File_Name != "") {
        //alert('dfdffs');
        Other_Doc_Control.setValidators(null);
      } else {
        Other_Doc_Control.setValidators(Validators.required);
      }

      if (this.AgentRow["Type"] == "SP") {
        //alert();
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

    /*
		Aadhar_Card_Front_Doc_Control.updateValueAndValidity();
		Aadhar_Card_Back_Doc_Control.updateValueAndValidity();
		Photo_Doc_Control.updateValueAndValidity();
		Signature_Doc_Control.updateValueAndValidity();
		Qualification_Doc_Control.updateValueAndValidity();
		Other_Doc_Control.updateValueAndValidity();
		*/

    Pan_Card_Control.updateValueAndValidity();
    Aadhar_Card_Front_Control.updateValueAndValidity();
    Aadhar_Card_Back_Control.updateValueAndValidity();
    //Qualification_Doc_Control.updateValueAndValidity();
    Cheque_Control.updateValueAndValidity();
    //Photo_Control.updateValueAndValidity();
    //Signature_Control.updateValueAndValidity();
    Other_Doc_Control.updateValueAndValidity();
  }

  onChangeAgentType(Type, Agent_Category) {
    const ContactPerson_Name_Control = this.AddForm.get("ContactPerson_Name");
    const ContactPerson_Email_Control = this.AddForm.get("ContactPerson_Email");
    const ContactPerson_Mobile_Control = this.AddForm.get(
      "ContactPerson_Mobile"
    );

    if (Type == "SP" && Agent_Category == "Institution") {
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
    //   //   console.log(Type);

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
      //   //   console.log(v);
      if (v != null) {
        //   //   console.log(this.ageFromDateOfBirthday(v));
        if (this.ageFromDateOfBirthday(v) < 18) {
          //   //   console.log("Eligibility 18 years Only. !");

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
      this.StepI = "0";
      this.StepII = "0";

      if (this.AgentRow["Type"] == "SPC") {
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
				 
				formData.append('Agent_Code',this.AgentRow['Emp_Id']);
				formData.append('Agent_User_Id',this.Agent_Id);
				formData.append('User_Id',this.api.GetUserId());
				formData.append('PersonalInfo',JSON.stringify(this.AddForm.value));
				formData.append('AddressInfo',JSON.stringify(this.StepIIForm.value));
			 
				 
				this.api.IsLoading();
				this.api.HttpPostType('sr/RMAgentReport/Update_SPC',formData).then((result) => {
				this.api.HideLoading(); 
					if(result['Status'] == true){ 
						this.api.ToastMessage(result['Message']); 
						this.router.navigate(['/agent-report']);
						 
					}else{
						//alert(result['Message']);
						this.api.Toast("Warning",result['Message']); 
					}
				}, (err) => { 
				  this.api.HideLoading();
				  ////   //   console.log(err.message);
				  this.api.Toast("Warning",err.message);
				});
				*/
      } else {
        this.StepIII = "1";
      }

      //   //   console.log(this.AddForm.value);
      //   //   console.log(this.StepIIForm.value);
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

      //   //   console.log(this.AddForm.value);
      //   //   console.log(this.StepIIForm.value);
      //   //   console.log(this.StepIIIForm.value);
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

      if (this.AgentRow["Type"] == "SP" || this.AgentRow["Type"] == "Dealer") {
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
      if (this.AgentRow["Type"] == "SPC") {
        //   //   console.log(this.AddForm.value);
        //   //   console.log(this.StepIIForm.value);

        const formData = new FormData();

        formData.append("Agent_Code", this.AgentRow["Emp_Id"]);
        formData.append("Agent_User_Id", this.Agent_Id);
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
        this.api.HttpPostTypeBms("sr/RMAgentReport/Update_SPC", formData).then(
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
        //   //   console.log(this.AddForm.value);
        //   //   console.log(this.StepIIForm.value);
        //   //   console.log(this.StepIIIForm.value);
        //   //   console.log(this.StepIVForm.value);
        //   //   console.log(this.StepFinalForm.value);

        const formData = new FormData();

        formData.append("Agent_Code", this.AgentRow["Emp_Id"]);
        formData.append("Agent_User_Id", this.Agent_Id);
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
          .HttpPostType("sr/RMAgentReport/Update_SP_Dealer", formData)
          .then(
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
      }
    }
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   console.log(this.selectedFiles);
      //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size + " kb");

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
        //   //   console.log("Extenstion is not vaild !");

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
      .CallBms("em/POS/Get_Rms?User_Id=" + this.api.GetUserData("User_Id"))
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Type = result["Type"];
            if (this.Type == "AssignOtherRM") {
              this.RM_Data = result["RM_Data"];
            }
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
        "sr/RMAgentReport/Get_Franchisee_By_RM_Id?User_Id=" +
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
}
