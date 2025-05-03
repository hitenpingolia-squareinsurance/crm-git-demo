import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";

import { AgentOrcBanksDetailsComponent } from "../agent-orc-banks-details/agent-orc-banks-details.component";

@Component({
  selector: "app-agent-orc",
  templateUrl: "./agent-orc.component.html",
  styleUrls: ["./agent-orc.component.css"],
})
export class AgentOrcComponent implements OnInit {
  Id: any;
  Agent_Id: any;
  Base_Url: any;
  row: any = [];
  RM_Users: any = [];
  RM_Id: any = [];
  Documents = [];

  IsDisabled: any = true;

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

  Type: any;
  RM_Data: any;
  Franchisee_Ar: any;
  ORC_Ar: any = [];

  ORC_Row_Ar: any = [];

  IsApply: any = "0";
  Is_Edit: any = "0";
  Is_Add_ORC: any = 0;

  constructor(
    public dialogRef: MatDialogRef<AgentOrcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.AddForm = this.formBuilder.group({
      Agent_Category: ["", [Validators.required]],
      Salutation_Type: ["", [Validators.required]],
      Agent_Name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Gender: ["", [Validators.required]],
      Father_Name: ["", [Validators.required]],
      DOB: ["", [Validators.required]],
      Qualification: ["", [Validators.required]],
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
      Email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
    });

    this.StepIIIForm = this.formBuilder.group({
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
      Aadhar_Card_Front: [""],
      Aadhar_Card_Back: [""],
      Qualification_Doc: [""],
      Cheque: ["", [Validators.required]],
      Photo: [""],
      Signature: [""],
    });
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.GetORCData();

    this.States();
    this.Banks();
    this.Get_Rms();
    this.Get_Franchisee_By_RM_Id();
    this.onChangeDOB();

    this.Step_1();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  ApplyToORC() {
    this.IsApply = "1";
  }
  Cancel() {
    this.IsApply = "0";

    this.StepI = "1";
    this.StepII = "0";
    this.StepIII = "0";
    this.StepIV = "0";
    this.StepFinal = "0";

    this.AddForm.reset();
    this.StepIIForm.reset();
    this.StepIIIForm.reset();
    this.StepIVForm.reset();
    this.StepFinalForm.reset();
  }

  EditToORC(ORC_Id) {
    this.api.IsLoading();
    this.api
      .CallBms(
        "sr/ORC/ViewDetailsById?Id=" +
          ORC_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.IsApply = "1";
            this.Is_Edit = "1";

            this.ORC_Row_Ar = result["Data"];

            this.AddForm.get("Agent_Category").setValue(
              this.ORC_Row_Ar.Agent_Category
            );
            this.AddForm.get("Salutation_Type").setValue(
              this.ORC_Row_Ar.Salutation_Type
            );
            this.AddForm.get("Agent_Name").setValue(this.ORC_Row_Ar.ORC_Name);
            this.AddForm.get("Gender").setValue(this.ORC_Row_Ar.Gender);
            this.AddForm.get("Father_Name").setValue(
              this.ORC_Row_Ar.Father_Name
            );
            this.AddForm.get("DOB").setValue(this.ORC_Row_Ar.DOB);
            this.AddForm.get("Qualification").setValue(
              this.ORC_Row_Ar.Qualification
            );

            this.StepIIForm.get("Addres_Line_1").setValue(
              this.ORC_Row_Ar.Addres_Line_1
            );
            this.StepIIForm.get("Addres_Line_2").setValue(
              this.ORC_Row_Ar.Addres_Line_2
            );
            this.StepIIForm.get("State_Id").setValue(this.ORC_Row_Ar.State_Id);
            this.StepIIForm.get("District_Id").setValue(
              this.ORC_Row_Ar.District_Id
            );
            this.StepIIForm.get("City_Id").setValue(this.ORC_Row_Ar.City_Id);
            this.StepIIForm.get("Pincode").setValue(this.ORC_Row_Ar.Pincode);
            this.StepIIForm.get("Mobile").setValue(this.ORC_Row_Ar.Mobile);
            this.StepIIForm.get("Email").setValue(this.ORC_Row_Ar.Email);

            this.StepIIIForm.get("GST_No").setValue(this.ORC_Row_Ar.GST_No);
            this.StepIIIForm.get("AadharCard_No").setValue(
              this.ORC_Row_Ar.AadharCard_No
            );
            this.StepIIIForm.get("PanCard_No").setValue(
              this.ORC_Row_Ar.PanCard_No
            );

            this.StepIVForm.get("Account_No").setValue(
              this.ORC_Row_Ar.Account_No
            );
            this.StepIVForm.get("IFSC_Code").setValue(
              this.ORC_Row_Ar.IFSC_Code
            );
            this.StepIVForm.get("Bank_Name").setValue(this.ORC_Row_Ar.Bank_Id);
            this.StepIVForm.get("Branch_Address").setValue(
              this.ORC_Row_Ar.Branch_Address
            );
            this.StepIVForm.get("State_Id").setValue(
              this.ORC_Row_Ar.Branch_State_Id
            );
            this.StepIVForm.get("District_Id").setValue(
              this.ORC_Row_Ar.Branch_District_Id
            );
            this.StepIVForm.get("City_Id").setValue(
              this.ORC_Row_Ar.Branch_City_Id
            );
            this.StepIVForm.get("Pincode").setValue(
              this.ORC_Row_Ar.Branch_Pincode_Id
            );
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  GetORCData() {
    //this.api.IsLoading();
    this.api
      .CallBms(
        "sr/ORC/GetORClistByPOS_Id?Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          //this.api.HideLoading();

          if (result["Status"] == true) {
            //this.CloseModel();

            this.row = result["row"];
            this.ORC_Ar = result["Data"];
            this.Is_Add_ORC = result["Is_Add_ORC"];

            //   //   console.log(this.ORC_Ar.length);
            this.Base_Url = result["Base_Url"];

            //this.api.ToastMessage(result['Message']);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  ViewBanks(ORC_Id) {
    //alert(ORC_Id);

    const dialogRef = this.dialog.open(AgentOrcBanksDetailsComponent, {
      width: "35%",
      height: "80%",
      disableClose: true,
      data: { Id: ORC_Id, POS_Id: this.Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  ViewDocument(orc_id, name) {
    let url = name;
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

  onChangeAgentCategory(e) {
    var Type = e.target.value;
    //   //   console.log(Type);

    const Salutation_Type_Control = this.AddForm.get("Salutation_Type");
    const Gender_Control = this.AddForm.get("Gender");
    const Father_Name_Control = this.AddForm.get("Father_Name");
    const DOB_Control = this.AddForm.get("DOB");
    const Qualification_Control = this.AddForm.get("Qualification");

    const AadharCard_No_Control = this.StepIIIForm.get("AadharCard_No");
    const GST_No_Control = this.StepIIIForm.get("GST_No");

    const Aadhar_Card_Front_Control =
      this.StepFinalForm.get("Aadhar_Card_Front");
    const Aadhar_Card_Back_Front_Control =
      this.StepFinalForm.get("Aadhar_Card_Back");

    if (Type == "Individual") {
      Salutation_Type_Control.setValidators([Validators.required]);
      Gender_Control.setValidators([Validators.required]);
      Father_Name_Control.setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z ]*$"),
      ]);
      DOB_Control.setValidators([Validators.required]);
      Qualification_Control.setValidators([Validators.required]);

      AadharCard_No_Control.setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(12),
        Validators.maxLength(12),
      ]);
      GST_No_Control.setValidators(null);

      //Aadhar_Card_Front_Control.setValidators([Validators.required]);
      //Aadhar_Card_Back_Front_Control.setValidators([Validators.required]);
    } else {
      Salutation_Type_Control.setValidators(null);
      Gender_Control.setValidators(null);
      Father_Name_Control.setValidators(null);
      DOB_Control.setValidators(null);
      Qualification_Control.setValidators(null);

      AadharCard_No_Control.setValidators(null);
      GST_No_Control.setValidators(null);

      //Aadhar_Card_Front_Control.setValidators(null);
      //Aadhar_Card_Back_Front_Control.setValidators(null);
    }

    Salutation_Type_Control.updateValueAndValidity();
    Gender_Control.updateValueAndValidity();
    Father_Name_Control.updateValueAndValidity();
    DOB_Control.updateValueAndValidity();
    Qualification_Control.updateValueAndValidity();

    AadharCard_No_Control.updateValueAndValidity();
    GST_No_Control.updateValueAndValidity();
    //Aadhar_Card_Front_Control.updateValueAndValidity();
    //Aadhar_Card_Back_Front_Control.updateValueAndValidity();
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
      this.StepIII = "1";

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
      //   //   console.log(this.AddForm.value);
      //   //   console.log(this.StepIIForm.value);
      //   //   console.log(this.StepIIIForm.value);

      const formData = new FormData();

      formData.append("Is_Edit", this.Is_Edit);
      formData.append("ORC_Id", this.ORC_Row_Ar.Id);
      formData.append("Is_Default", this.ORC_Row_Ar.Is_Default);

      formData.append("POS_Id", this.Id);
      formData.append("POS_Code", this.row.Emp_Id);
      formData.append("User_Id", this.api.GetUserId());

      formData.append("AddressInfo", JSON.stringify(this.StepIIForm.value));
      formData.append("KYCDetails", JSON.stringify(this.StepIIIForm.value));

      this.api.IsLoading();
      this.api.HttpPostTypeBms("sr/ORC/Check_Aadhar_PanCard_No", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.StepI = "0";
            this.StepII = "0";
            this.StepIII = "0";
            this.StepIV = "1";
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

      this.StepIV = "0";
      this.StepFinal = "1";

      this.StepFinalisSubmitted = false;
    }
  }
  Step_Final() {
    this.StepFinalisSubmitted = true;
    if (this.StepFinalForm.invalid) {
      return;
    } else {
      //   //   console.log(this.AddForm.value);
      //   //   console.log(this.StepIIForm.value);
      //   //   console.log(this.StepIIIForm.value);
      //   //   console.log(this.StepIVForm.value);
      //   //   console.log(this.StepFinalForm.value);

      const formData = new FormData();

      formData.append("Is_Edit", this.Is_Edit);
      formData.append("ORC_Id", this.ORC_Row_Ar.Id);
      formData.append("Is_Default", this.ORC_Row_Ar.Is_Default);

      formData.append("POS_Id", this.Id);
      formData.append("POS_Code", this.row.Emp_Id);
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

      this.api.IsLoading();
      this.api.HttpPostType("sr/ORC/Add_ORC", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Is_Edit = "0";
            this.api.Toast("Success", result["Message"]);
            this.Cancel();
            this.GetORCData();
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

  District(e) {
    this.api.IsLoading();
    this.api
      .CallBms("admin/Geographical/District?State_Id=" + e.target.value)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.District_Ar = result["Data"];

            this.Citites_Ar = [];
            this.Pincode_Ar = [];

            //this.fc_StepIIForm.get('City_Id').setValue(null);
            //this.fc_StepIIForm.get('Pincode').setValue(null);
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
  City(e) {
    this.api.IsLoading();
    this.api
      .CallBms("admin/Geographical/City?District_Id=" + e.target.value)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Citites_Ar = result["Data"];

            this.Pincode_Ar = [];

            //this.fc_StepIIForm.get('Pincode').setValue(null);
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
  Pincode(e) {
    this.api.IsLoading();
    this.api
      .CallBms("admin/Geographical/Pincode?City_Id=" + e.target.value)
      .then(
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

  B_District(e) {
    this.api.IsLoading();
    this.api
      .CallBms("admin/Geographical/District?State_Id=" + e.target.value)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.B_District_Ar = result["Data"];

            this.B_Citites_Ar = [];
            this.B_Pincode_Ar = [];

            //this.fc_StepIVForm.get('City_Id').setValue(null);
            //this.fc_StepIVForm.get('Pincode').setValue(null);
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
  B_City(e) {
    this.api.IsLoading();
    this.api
      .CallBms("admin/Geographical/City?District_Id=" + e.target.value)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.B_Citites_Ar = result["Data"];

            this.B_Pincode_Ar = [];

            //this.fc_StepIVForm.get('Pincode').setValue(null);
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
  B_Pincode(e) {
    this.api.IsLoading();
    this.api
      .CallBms("admin/Geographical/Pincode?City_Id=" + e.target.value)
      .then(
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
