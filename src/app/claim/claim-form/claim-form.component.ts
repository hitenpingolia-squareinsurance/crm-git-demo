import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConstantPool } from "@angular/compiler";
@Component({
  selector: "app-claim-form",
  templateUrl: "./claim-form.component.html",
  styleUrls: ["./claim-form.component.css"],
})
export class ClaimFormComponent implements OnInit {
  ClaimForm: FormGroup;
  isSubmitted = false;
  LOB: { Id: string; Name: string }[];
  Type_of_loss: { Id: string; Name: string }[];
  Claim_Type: { Id: string; Name: string }[];
  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  Lob_company: any;
  customeremail_Div: any;
  Policy_Holder_Div: any;
  loactionValue_Div: any;
  customerName_Div: any;
  NumberValue_Div: any;
  TypeValue_Div: any;
  Type_of_loss_Div: any;
  DateValue_Div: any;
  DescriptionValue_Div: any;
  effectiveDatePolicy_Div: any;
  effectiveDateMember_Div: any;
  Mamber_name_insure_in_Div: any;
  Claim_Type_Div: any;

  customeremail_lable: any;
  Policy_Holder_lable: any;
  loactionValue_lable: any;
  customerName_lable: any;
  NumberValue_lable: any;
  TypeValue_lable: any;
  Type_of_loss_lable: any;
  DateValue_lable: any;
  DescriptionValue_lable: any;
  effectiveDatePolicy_lable: any;
  effectiveDateMember_lable: any;
  Policy_no_lable: any;
  Form_Data: any;
  Lob_type: any;
  LOBName: [{ Id: string; Name: string }];
  Company_Name_value: [{ Id: string; Name: string }];
  LOBName_value: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public dialogRef: MatDialogRef<ClaimFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Form_Data = [this.data.type];
    // console.log(this.Form_Data);
    this.ClaimForm = this.formBuilder.group({
      Policy_no: ["", [Validators.required]],
      LOB: ["", [Validators.required]],
      Company_Name: ["", [Validators.required]],
      Mobile_no: ["", [Validators.required]],
      customeremail: [""],
      Policy_Holder: [""],
      loactionValue: [""],
      customerName: [""],
      NumberValue: [""],
      TypeValue: [""],
      Type_of_loss: [""],
      DateValue: [""],
      DescriptionValue: [""],
      effectiveDatePolicy: [""],
      effectiveDateMember: [""],
      Mamber_name_insure_in: [""],
      Claim_Type: [""],

      // customeremail: ["", Validators.required],
      // Policy_Holder: ["", Validators.required],
      // loactionValue: ["", Validators.required],
      // customerName: ["", Validators.required],
      // NumberValue: ["", Validators.required],
      // TypeValue: ["", Validators.required],
      // Type_of_loss: ["", Validators.required],
      // DateValue: ["", Validators.required],
      // DescriptionValue: ["", Validators.required],
      // effectiveDatePolicy: ["", Validators.required],
      // effectiveDateMember: ["", Validators.required],
    });

    this.LOB = [
      { Id: "Health", Name: "Health" },
      { Id: "LI", Name: "LI" },
      { Id: "Motor", Name: "Motor" },
      { Id: "Non_Motor", Name: "Non_Motor" },
      { Id: "PA", Name: "PA" },
      { Id: "Travel", Name: "Travel" },
    ];

    this.Claim_Type = [
      { Id: "Claim Intimation", Name: "Claim Intimation" },
      { Id: "Spot Survey", Name: "Spot Survey" },
      { Id: "Final Survey", Name: "Final Survey" },
      { Id: "Work Approval", Name: "Work Approval" },
      { Id: "Parts Assessment Issue", Name: "Parts Assessment Issue" },
      { Id: "DO Pending", Name: "DO Pending" },
      { Id: "Cashless Issue", Name: "Cashless Issue" },
      { Id: "Cashless Garage List", Name: "Cashless Garage List" },
      { Id: "Documents Pendency", Name: "Documents Pendency" },
      { Id: "Current Claim Status", Name: "Current Claim Status" },
      { Id: "Claim Amount Confirmation", Name: "Claim Amount Confirmation" },
      { Id: "Re-open Process", Name: "Re-open Process" },
      { Id: "Others", Name: "Others" },
    ];

    this.Type_of_loss = [
      {
        Id: "Accidental death and Dismemerment",
        Name: "Accidental death and Dismemerment",
      },
      {
        Id: "Accident & Sickness Medical Expenses",
        Name: "Accident & Sickness Medical Expenses",
      },
      { Id: "Burglary", Name: "Burglary" },
      { Id: "Trip Cancellation", Name: "Trip Cancellation" },
      {
        Id: "Missed Connection / MissedDeparture",
        Name: "Missed Connection / MissedDeparture",
      },
      {
        Id: "Bounced Bookings of Hotel and Airline",
        Name: "Bounced Bookings of Hotel and Airline",
      },
      { Id: "Flight Delay", Name: "Flight Delay" },
      { Id: "Baggage Delay", Name: "Baggage Delay" },
    ];

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    if (this.Form_Data.length > 0) {
      if (this.Form_Data[0].LOB == "Personal Accident") {
        this.LOBName = [{ Id: "PA", Name: "PA" }];
        this.LOBName_value = "PA";
      } else {
        this.LOBName = [
          { Id: this.Form_Data[0].LOB, Name: this.Form_Data[0].LOB },
        ];
        this.LOBName_value = this.Form_Data[0].LOB;
      }
      this.Company_Name_value = [
        { Id: this.Form_Data[0].CompanyId, Name: this.Form_Data[0].Company },
      ];
      this.onSelectionChange(this.LOBName_value, "1");
    }
    this.Policy_no_lable = "Policy No";
  }

  get formControls() {
    return this.ClaimForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    //   //   //   console.log(this.ClaimForm);
    if (this.ClaimForm.invalid) {
      return;
    } else {
      var fields = this.ClaimForm.value;
      if (fields["LOB"][0]["Name"] == "Health") {
        var Policy_Holder = fields["Mamber_name_insure_in"];
      } else {
        var Policy_Holder = fields["Policy_Holder"];
      }

      const formData = new FormData();
      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Policy_no", fields["Policy_no"]);
      formData.append("LOB", fields["LOB"][0]["Name"]);
      formData.append("Company_Name", fields["Company_Name"][0]["Id"]);
      formData.append("loactionValue", fields["loactionValue"]);
      formData.append("Mobile_no", fields["Mobile_no"]);
      formData.append("customeremail", fields["customeremail"]);
      formData.append("DescriptionValue", fields["DescriptionValue"]);
      formData.append("Policy_Holder", Policy_Holder);

      formData.append("customerName", fields["customerName"]);
      formData.append("NumberValue", fields["NumberValue"]);
      formData.append("TypeValue", fields["TypeValue"]);
      formData.append("Type_of_loss", fields["Type_of_loss"]);
      formData.append("DateValue", fields["DateValue"]);
      formData.append("effectiveDatePolicy", fields["effectiveDatePolicy"]);
      formData.append("effectiveDateMember", fields["effectiveDateMember"]);
      formData.append("Mamber_name_insure_in", fields["Mamber_name_insure_in"]);
      if (
        fields["Claim_Type"] &&
        fields["Claim_Type"][0] &&
        fields["Claim_Type"][0]["Name"] &&
        fields["Claim_Type"][0]["Name"].length > 0
      ) {
        formData.append("Claim_Type", fields["Claim_Type"][0]["Name"]);
      } else {
        formData.append("Claim_Type", "");
      }

      this.api.IsLoading();

      this.api.HttpPostType("ClaimView/AddClaim", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", "Claim created Successfully");
            this.CloseModel();
            this.router.navigateByUrl("/claim/viewrequest");
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
  }

  onSelectionChange(Lob_type_val: any, Value_num: any) {
    if (Value_num == "0") {
      this.Lob_type = Lob_type_val.Name;
    } else {
      this.Lob_type = Lob_type_val;
    }

    this.customeremail_Div = 0;
    this.Policy_Holder_Div = 0;
    this.loactionValue_Div = 0;
    this.customerName_Div = 0;
    this.NumberValue_Div = 0;
    this.TypeValue_Div = 0;
    this.Type_of_loss_Div = 0;
    this.DateValue_Div = 0;
    this.DescriptionValue_Div = 0;
    this.effectiveDatePolicy_Div = 0;
    this.effectiveDateMember_Div = 0;
    this.Mamber_name_insure_in_Div = 0;
    this.Claim_Type_Div = 0;
    this.Policy_no_lable = "Policy No";

    // "Motor"
    if (this.Form_Data[0].LOB == "Motor") {
      // this.ClaimForm.get('Policy_no').setValue(this.Form_Data[0].Vehicle_No);
      this.ClaimForm.get("Policy_no").setValue(this.Form_Data[0].PolicyNo);
    } else {
      this.ClaimForm.get("Policy_no").setValue(this.Form_Data[0].PolicyNo);
    }
    // this.ClaimForm.get('Mobile_no').setValue(this.Form_Data[0].CustomerMobile);

    if (this.Lob_type == "Health") {
      this.ClaimForm.get("customeremail").setValidators(Validators.required);
      this.ClaimForm.get("loactionValue").setValidators(Validators.required);
      this.ClaimForm.get("customerName").setValidators(Validators.required);
      this.ClaimForm.get("NumberValue").setValidators(Validators.required);
      this.ClaimForm.get("DateValue").setValidators(Validators.required);
      this.ClaimForm.get("TypeValue").setValidators(Validators.required);
      this.ClaimForm.get("Mamber_name_insure_in").setValidators(
        Validators.required
      );

      this.customeremail_Div = 1;
      this.loactionValue_Div = 1;
      this.customerName_Div = 1;
      this.NumberValue_Div = 1;
      this.DateValue_Div = 1;
      this.TypeValue_Div = 1;
      this.Mamber_name_insure_in_Div = 1;
      this.customeremail_lable = "Customer Email Address:";
      this.loactionValue_lable = "Hospital Name & Address:";
      this.customerName_lable = "Patient Name:";
      this.NumberValue_lable = "Room No:";
      this.TypeValue_lable = "Disease:";
      this.DateValue_lable = "Date of Admission:";
      //Enter Insurer Name: = according to policy in this select
      this.ClaimForm.get("customerName").setValue(
        this.Form_Data[0].CustomerName
      );
    } else if (this.Lob_type == "Life") {
      this.ClaimForm.get("customerName").setValidators(Validators.required);
      this.ClaimForm.get("TypeValue").setValidators(Validators.required);
      this.ClaimForm.get("DateValue").setValidators(Validators.required);
      this.ClaimForm.get("DescriptionValue").setValidators(Validators.required);
      this.ClaimForm.get("effectiveDatePolicy").setValidators(
        Validators.required
      );
      this.ClaimForm.get("effectiveDateMember").setValidators(
        Validators.required
      );

      this.customerName_Div = 1;
      this.TypeValue_Div = 1;
      this.DateValue_Div = 1;
      this.DescriptionValue_Div = 1;
      this.effectiveDatePolicy_Div = 1;
      this.effectiveDateMember_Div = 1;
      this.customerName_lable = "Insured Name:";
      this.TypeValue_lable = "Cause of Death:";
      this.DateValue_lable = "Date of Death:";
      this.DescriptionValue_lable = "Date of Information:";
      this.effectiveDatePolicy_lable = "Effective date of the Policy:";
      this.effectiveDateMember_lable = "Effective date of member:";
      this.ClaimForm.get("customerName").setValue(
        this.Form_Data[0].CustomerName
      );
    } else if (this.Lob_type == "Motor") {
      this.ClaimForm.get("customeremail").setValidators(null);
      this.ClaimForm.get("customerName").setValidators(null);

      this.ClaimForm.get("DateValue").setValidators(null);
      this.ClaimForm.get("Mamber_name_insure_in").setValidators(null);

      this.ClaimForm.get("Policy_Holder").setValidators(null);

      this.ClaimForm.get("TypeValue").setValidators(null);

      this.ClaimForm.get("Claim_Type").setValidators(Validators.required);
      this.ClaimForm.get("customerName").setValue(
        this.Form_Data[0].CustomerName
      );

      this.customeremail_Div = 1;
      this.customerName_Div = 1;
      this.DescriptionValue_Div = 1;
      this.NumberValue_Div = 0;
      this.loactionValue_Div = 1;
      this.Policy_Holder_Div = 1;
      this.TypeValue_Div = 0;
      this.Claim_Type_Div = 1;
      this.Policy_no_lable = "Registrartion No";
      this.customeremail_lable = "Customer Email Address:";
      this.customerName_lable = "Driver/Customer Name:";
      // this.NumberValue_lable = 'Driver Licences No.:';
      this.DescriptionValue_lable = "Accidentical Short Dec.:";
      this.loactionValue_lable = "Work Shop Address:";
      this.Policy_Holder_lable = "Surveyor Name:";
      // this.TypeValue_lable = 'Surveyor Email:';
    } else if (this.Lob_type == "Non_Motor") {
      this.ClaimForm.get("customeremail").setValidators(Validators.required);
      this.ClaimForm.get("Policy_Holder").setValidators(Validators.required);
      this.ClaimForm.get("loactionValue").setValidators(Validators.required);
      this.ClaimForm.get("customerName").setValidators(Validators.required);
      this.ClaimForm.get("NumberValue").setValidators(Validators.required);
      this.ClaimForm.get("TypeValue").setValidators(Validators.required);
      this.ClaimForm.get("DateValue").setValidators(Validators.required);

      this.customeremail_Div = 1;
      this.Policy_Holder_Div = 1;
      this.loactionValue_Div = 1;
      this.customerName_Div = 1;
      this.NumberValue_Div = 1;
      this.TypeValue_Div = 1;
      this.DateValue_Div = 1;
      this.customeremail_lable = "Contact Person Mail id:";
      this.Policy_Holder_lable = "Policy Holder Name:";
      this.loactionValue_lable = "Location of Loss:";
      this.customerName_lable = "Contact Person name:";
      this.NumberValue_lable = "Estimate of Loss:";
      this.TypeValue_lable = "Reason of Loss:";
      this.DateValue_lable = "Date of Loss:";
      this.ClaimForm.get("customerName").setValue(
        this.Form_Data[0].CustomerName
      );
    } else if (this.Lob_type == "PA") {
      this.ClaimForm.get("customeremail").setValidators(Validators.required);
      this.ClaimForm.get("loactionValue").setValidators(Validators.required);
      this.ClaimForm.get("customerName").setValidators(Validators.required);
      this.ClaimForm.get("NumberValue").setValidators(Validators.required);
      this.ClaimForm.get("TypeValue").setValidators(Validators.required);
      this.ClaimForm.get("DateValue").setValidators(Validators.required);
      this.ClaimForm.get("DescriptionValue").setValidators(Validators.required);

      this.customeremail_Div = 1;
      this.loactionValue_Div = 1;
      this.customerName_Div = 1;
      this.NumberValue_Div = 1;
      this.TypeValue_Div = 1;
      this.DateValue_Div = 1;
      this.DescriptionValue_Div = 1;
      this.customeremail_lable = "Mail Id:";
      this.loactionValue_lable = "Place of Incidence:";
      this.customerName_lable = "Claimant Name:";
      this.NumberValue_lable = "FIR No:";
      this.TypeValue_lable = "Cause of Incidence:";
      this.DateValue_lable = "Date of Incidence:";
      this.DescriptionValue_lable = "Information Authority:";
      this.ClaimForm.get("customerName").setValue(
        this.Form_Data[0].CustomerName
      );
    } else if (this.Lob_type == "Travel") {
      this.ClaimForm.get("customeremail").setValidators(Validators.required);
      this.ClaimForm.get("loactionValue").setValidators(Validators.required);
      this.ClaimForm.get("customerName").setValidators(Validators.required);
      this.ClaimForm.get("NumberValue").setValidators(Validators.required);
      this.ClaimForm.get("DateValue").setValidators(Validators.required);
      this.ClaimForm.get("DescriptionValue").setValidators(Validators.required);

      this.customeremail_Div = 1;
      this.loactionValue_Div = 1;
      this.customerName_Div = 1;
      this.NumberValue_Div = 1;
      this.DateValue_Div = 1;
      this.DescriptionValue_Div = 1;
      this.customeremail_lable = "Mail Id:";
      this.loactionValue_lable = "Travel Destination:";
      this.customerName_lable = "Claimant Name:";
      this.NumberValue_lable = "Passport No:";
      this.DescriptionValue_lable = "Date of Loss:";
      this.ClaimForm.get("customerName").setValue(
        this.Form_Data[0].CustomerName
      );
      // Select Type Loss
    }

    if (this.Lob_type != "") {
      // alert('Selected value: ' + this.Lob_type);

      const formData = new FormData();
      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Lob_type", this.Lob_type);

      this.api.IsLoading();
      this.api.HttpPostType("ClaimManagement/LobCompanyChack", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Lob_company = result["Data"];
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
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
