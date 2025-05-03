import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
  Inject,
} from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import * as $ from "jquery";
import { MatSelect } from "@angular/material/select";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-sr-creation",
  templateUrl: "./sr-creation.component.html",
  styleUrls: ["./sr-creation.component.css"],
})
export class SrCreationComponent implements OnInit {
  Source: any = 0;
  User_Id: any = 0;
  UrlSource: any = 0;
  SR_Id: any = 0;

  Step_Id: any = 0;
  StepData: any = [];
  SR_Data: any = [];

  Form_1: any = 1;
  Form_2: any = 0;
  Form_3: any = 0;
  Form_4: any = 0;
  Form_5: any = 0;
  Form_6: any = 0;
  showDetails_Form1: any = 0;
  showDetails_Form2: any = 0;

  SRForm_1: FormGroup;
  isSubmitted = false;

  SRForm_2: FormGroup;
  isSubmitted_2 = false;

  SRForm_3: FormGroup;
  isSubmitted_3 = false;

  SRForm_4: FormGroup;
  isSubmitted_4 = false;

  SRForm_5: FormGroup;
  isSubmitted_5 = false;

  SRForm_6: FormGroup;
  isSubmitted_6 = false;

  User_Rights: any;
  User_Data: any;

  SR_Source: any;

  SR_Type_Ar: any;
  Payout_Mode_Ar: any;
  Brokers_Ar: any;
  Franchisee_Ar: any;
  RM_Ar: any = [];
  Agents_Ar: any;
  Fleets_Ar: any;
  LOB_Ar: any;
  Segment_Ar: any;
  Plan_Type_Ar: any;
  Classes_Ar: any;
  Sub_Classes_Ar: any;
  Products_Ar: any;
  SubProducts_Ar: any;
  Ins_Companies_Ar: any;
  Ins_Branch_Companies_Ar: any;
  States_Ar: any;
  RTO_Ar: any;
  Make_Ar: any;
  Models_Ar: any;
  Variants_Ar: any;

  File_Type_Str: any = "";
  File_Type_Ar: any = [];
  Renewal_Data: any = [];

  Policy_Tenure: any = 0;
  IsSeatingCapcityEdit: string = "0";

  dropdownSettingsType: any = {};
  disabled = false;

  Net_Premium_Error_Msg: string = "";
  Other_TP_Error_Msg: string = "";

  selectedFiles: File;

  RC_Motor_Registraion_Front: File;
  RC_Motor_Registraion_Back: File;

  Previous_Policy_Copy: File;
  Cheque_Payment_Recipt: File;
  Mandate_Letter: File;
  Invoice: File;
  Renewal_Notice: File;
  Endorsement_Copy: File;
  Other: File;
  PolicyPDF: File;
  KYC_Document: File;

  AadharCardFront: File;
  AadharCardBack: File;
  PanCard: File;
  Photo: File;
  CancelCheque: File;
  IncomeProof: File;
  ITR: File;
  PaymentReceipt: File;
  GstDoc: File;
  BI_Document: File;

  dateFlag: any = 1;

  maxDate = new Date();
  minDate = new Date();

  LI_Product_Types: any;
  LI_Product_Plan_Array: any;
  Terms: any = [];
  Termss: any = [];
  Proposer_Type_Ar: any = [];

  Remained: any;
  CustomerDob: any;
  ReadonlyPancard = false;

  appointAgeFlag: boolean = false;
  ShowAppointDetailsFlag: any = "No";

  showDetails_0: any = 1;
  showDetails_1: any = 0;
  showDetails_2: any = 0;
  showDetails_3: any = 0;
  showDetails_4: any = 0;
  showDetails_5: any = 0;
  showDetails_6: any = 0;

  selectedValue: any;
  searchTxt: string = "";

  viewPolicyType: any = 0;
  viewPlanType: any = 0;
  viewSubProduct: any = 0;
  viewClass: any = 0;

  Basic_TP: any = 0;
  PA_Owner_Premium: any = 0;

  OD_Days: any = 0;
  TP_Days: any = 0;
  Is_Policy_OD: any = 0;
  OldSR_No_Policy_No: any;

  KisanSuvidhaBimaPolicy: any = 0;
  SR_Flag: string = "Insert";
  LobWiseUrl: any = "";

  RSDEnable: boolean = true;
  Step1Url: string;
  Step2Url: string;
  Step3Url: string;
  Step4Url: string;
  Step5Url: string;
  Step6Url: string;
  UrlSegment: string;

  RenewalPolicy_Vehicle_No: any = "";
  AutoRenewal: any = "";
  PYP_URL: any = "";

  Endorsement_Type_Ar: any = [];
  Nil_Endorsment_Type_Ar: any = [];
  Non_Nil_Endorsment_Type_Ar: any = [];
  FireOccupancy_Ar: any = [];
  KYC_DOB_MinDate: any;
  KYC_DOB_MaxDate: any;
  TP_Premium: any = 0;
  Per_Passenger_Cost: any = 0;
  Seating_Capcity: any;

  Renewal_RED: any;
  LOB_Id: any;
  PAOwner: any;
  chequenofiledShow: boolean = false;
  KYC_Method: any = "";
  File_Type: any;


  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // // console.log(JSON.parse(localStorage.getItem("UserData")));

    this.SRForm_1 = this.formBuilder.group({
      RM_Id: [""],
      Agent_Id: [""],
      LOB_Id: ["", [Validators.required]],
      File_Type: [""],
      Insurer_Renewal: [""],
      Insurance_Company_Id: [""],
      PA_Owner: [""],
      PA_Owner_Tenure: [""],
      Mandate_Status: [""],

      CustomerName: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      emailId: [""],
      InsurerName: [""],
      personalMobile: [""],
      policyStartDate: ["", [Validators.required]],
      IssueDate: [""],
      PolicyNumber: [""],
      PaymentMode: [""],
      GrossPremium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],

      ChequeNumber: [""],

      PaymentFavour: [[{ Id: "Insurance Company", Name: "Insurance Company" }]],
      Payout_Mode: [[{ Id: "Monthly", Name: "Monthly" }]],

      KYC_Method: [""],
      KYC_No: [""],
      KYC_DOB: [""],

      Sum_Insured: [""], //, [Validators.required,Validators.pattern("^[0-9]*\.?[0-9]*$")]

      Product_Id: [""],
      Risk_Category: [""],
      Risk_Occupancy: [""],
      Segment_Id: [""],
      Plan_Type: [""],
      SubProduct_Id: [""],
      Class_Id: [""],
      Sub_Class_Id: [""],
      Vehicle_Type: [""],
      // Registration_State_Code: ["" , [Validators.required,Validators.pattern("[a-zA-Z ]*$"),Validators.minLength(2), Validators.maxLength(2)]],
      // Registration_District_Code: ["" , [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(2), Validators.maxLength(2)]],
      // Registration_City_Code: ["" , [Validators.required,Validators.pattern("^$|^[A-Za-z0-9]+"), Validators.maxLength(3)]],
      // Registration_Code: ["", [Validators.required,Validators.pattern("^^[0-9]*$"),Validators.minLength(4), Validators.maxLength(4)]],

      Registration_State_Code : [''],
			Registration_District_Code : [''],
			Registration_City_Code : [''],
			Registration_Code : [''],

      RC_Motor_Registraion_Front: [""],
      RC_Motor_Registraion_Back: [""],
      Previous_Policy_Copy: [""],
      Cheque_Payment_Recipt: [""],

      Invoice: [""],
      Renewal_Notice: [""],

      Other: [""],
      PolicyPDF: [""],
      KYC_Document: [""],
      Policy_Document: [""],
    });

    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var currentDate = [day, month, year].join("-");
    //alert(currentDate);

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.minDate.setDate(this.minDate.getDate() - 30);
    this.maxDate.setDate(this.maxDate.getDate());

    this.LOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Personal Accident", Name: "Personal Accident" },
    ];
  }

  PAOwnerOptions = [
    { Id: "Yes", Name: "Yes" },
    { Id: "No", Name: "No" },
  ];

  mandateStatusOptions = [
    { Id: "Yes", Name: "Yes" },
    { Id: "No", Name: "No" },
    { Id: "NA", Name: "NA" },
  ];
  paymentModeData = [
    { Id: "Card", Name: "Card" },
    { Id: "Cheque", Name: "Cheque" },
  ];

  paOwnerTenureOptions = [
    { Id: "1", Name: "1" },
    { Id: "2", Name: "2" },
    { Id: "3", Name: "3" },
    { Id: "4", Name: "4" },
    { Id: "5", Name: "5" },
  ];
  paymentFavours = [
    { Id: "Insurance Company", Name: "Insurance Company" },
    //{ Id: 'Accounts', Name: 'Accounts' },
  ];

  kycMethods = [
    { Id: "PAN DOB", Name: "PAN + DOB" },
    { Id: "AADHAAR DOB", Name: "AADHAAR + DOB" },
    { Id: "CKYC Number", Name: "CKYC Number" },
    { Id: "Driving License", Name: "Driving License" },
    { Id: "Voter ID", Name: "Voter ID" },
    { Id: "Passport", Name: "Passport" },
  ];

  modeOfPayments = [];

  ngOnInit() {
    this.User_Id = JSON.parse(localStorage.getItem("UserData")).User_Id;

    if (this.Source == "crm") {
      this.SRForm_1.get("Broker_Id").setValue("1");
      this.SRForm_1.get("Broker_Id").updateValueAndValidity();
    }

    // console.log(this.SR_Id);
    if (this.SR_Id === null || typeof this.SR_Id === "undefined") {
      this.SR_Id = 0;
    }

    this.modeOfPayments = [
      { Id: "Cheque", Name: "Cheque" },
      { Id: "Float", Name: "Float" },
      { Id: "Cash", Name: "Cash" },
      { Id: "RTGS", Name: "RTGS" },
      { Id: "NEFT", Name: "NEFT" },
      { Id: "IMPS", Name: "IMPS" },
      { Id: "UPI", Name: "UPI" },
      { Id: "Card", Name: "Card" },
      { Id: "Online", Name: "Online" },
    ];

    if (this.api.GetUserData("Type") == "agent") {
      this.modeOfPayments = [
        { Id: "Cheque", Name: "Cheque" },
        { Id: "Float", Name: "Float" },
        { Id: "Online", Name: "Online" },
      ];

      this.SRForm_1.get("RM_Id").setValidators(null);
      this.SRForm_1.get("Agent_Id").setValidators(null);

      this.SRForm_1.get("PaymentMode").setValidators(null);

      this.SRForm_1.get("PolicyNumber").setValidators([Validators.required]);
    } else {
      this.SRForm_1.get("RM_Id").setValidators([Validators.required]);
      this.SRForm_1.get("Agent_Id").setValidators([Validators.required]);

      this.SRForm_1.get("PaymentMode").setValidators([Validators.required]);

      this.SRForm_1.get("PolicyNumber").setValidators(null);
    }

    this.SRForm_1.get("RM_Id").updateValueAndValidity();
    this.SRForm_1.get("Agent_Id").updateValueAndValidity();
    this.SRForm_1.get("PolicyNumber").updateValueAndValidity();
    this.SRForm_1.get("PaymentMode").updateValueAndValidity();

    this.GetComponents("Form_1");
  }

  // GetRegistrionNo(e, Type) {
  //   //// console.log(e.target.value);
  //   if (Type == 1) {
  //     var code1 = this.SRForm_1.get("Registration_State_Code").value;
  //     if (code1.length == 2) {
  //       document.getElementById("Registration_District_Code").focus();
  //     }
  //   }
  //   if (Type == 2) {
  //     var code2 = this.SRForm_1.get("Registration_District_Code").value;
  //     if (code2.length == 2) {
  //       document.getElementById("Registration_City_Code").focus();
  //     }
  //   }
  //   if (Type == 3) {
  //     var code3 = this.SRForm_1.get("Registration_City_Code").value;
  //     if (code3.length == 3) {
  //       document.getElementById("Registration_Code").focus();
  //     }
  //   }
  // }

  GetRegistrionNo(e, Type) {
    if (Type == 1) {  // For State Code
        var code1 = this.SRForm_1.get('Registration_State_Code').value;
        
        if (code1.length == 2) {
            document.getElementById("Registration_District_Code").focus();
        }
    }
    if (Type == 2) {  // For District Code
        var code2 = this.SRForm_1.get('Registration_District_Code').value;  
        if (code2.length == 2) {
            document.getElementById("Registration_City_Code").focus();
        }
    }
    if (Type == 3) {  // For City Code
        var code3 = this.SRForm_1.get('Registration_City_Code').value;  
        if (code3.length == 3) {
            document.getElementById("Registration_Code").focus();
        }
    }
}





  GetInsCompanies() {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("../v2/sr/SR_Form/GetInsCompanies", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Ins_Companies_Ar = result["Data"];
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  get FC_1() {
    return this.SRForm_1.controls;
  }

  counter(i: number) {
    if (i == 0) {
      return;
    } else {
      return new Array(i);
    }
  }

  GetComponents(type) {
    this.api.IsLoading();
    this.api
      .HttpForSR(
        "get",
        "../../v2/sr/SR_Form/FormComponents?Source=" +
          this.Source +
          "&Type=" +
          type +
          "&User_Id=" +
          this.User_Id +
          "&SR_Id=" +
          this.SR_Id,
        ""
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == 1) {
            //this.api.Toast('Success',result['Message']);

            this.SR_Type_Ar = result["Data"]["SR_Types"];
            this.Payout_Mode_Ar = result["Data"]["SRPayout_Mode_Ar"];

            //this.SRForm_1.get('PaymentFavour').setValue([ { Id: 'Insurance Company', Name: 'Insurance Company' }]);
            //this.SRForm_1.get('Payout_Mode').setValue([{ Id: 'Monthly', Name: 'Monthly' }]);

            this.Brokers_Ar = result["Data"]["Brokers"];
            //this.LOB_Ar = result['Data']['LOB'];
            this.RM_Ar = result["Data"]["RM"];

            this.FireOccupancy_Ar = result["Data"]["FireOccupancy"];

            this.User_Rights = result["Data"]["SR_User_Rights"];
            this.User_Data = result["Data"]["User_Data"];

            if (
              this.User_Rights.Is_Operation == 0 &&
              this.User_Rights.Underwriter_Motor == 0 &&
              this.User_Rights.Underwriter_Non_Motor == 0 &&
              this.User_Rights.Underwriter_Health == 0 &&
              this.User_Rights.Is_Sales_Support == 0
            ) {
              //this.disabled = true;
              this.Get_Agents(this.RM_Ar[0]["Id"]);
            }

            this.StepData = result["Data"]["StepData"];

            this.KYC_DOB_MinDate = result["Data"]["DatePickerDates"]["min"];
            this.KYC_DOB_MaxDate = result["Data"]["DatePickerDates"]["max"];

            if (this.SR_Id != 0) {
              this.SR_Flag = "Edit";

              var row = result["Data"]["Forms_Ar"];

              this.SR_Source = row["row"]["Source"];

              this.SRForm_1.get("LOB_Id").setValue(row["Form_1"]["LOB_Id"]);
              //alert(row['Form_1']['LOB_Id']);
              this.LOB();

              if (row["row"]["SR_Type"] == "Endorsement") {
                this.Non_Nil_Endorsment_Type_Ar =
                  result["Data"]["Non_Nil_Endorsment_Type_Ar"];
                this.Nil_Endorsment_Type_Ar =
                  result["Data"]["Nil_Endorsment_Type_Ar"];
              }

              if (row["Form_1"]["LOB_Id"] == "Life") {
                // this.SRForm_1.get('LI_Proposer_Type').setValue(row['Form_1']['LI_Proposer_Type']);
                // this.SRForm_1.get('Is_Assured_Different').setValue(row['Form_1']['Is_Assured_Different']);
                this.Products_Ar = row["Form_Components"]["ProductsArray"];
                this.Ins_Companies_Ar = row["Form_Components"]["Ins_Compaines"];

                //Policy Term
                if (row["Form_4"]["LI_Policy_Term"] != "") {
                  this.Terms = [];
                  for (var i = 3; i <= row["Form_4"]["LI_Policy_Term"]; i++) {
                    this.Terms.push(i);
                  }
                }
              } else {
                // General Insurance LOB's

                var p = row["Form_1"]["Product_Id"];
                //alert(p);

                if (row["Form_1"]["Plan_Type"] == "Kisan Suvidha Bima Policy") {
                  this.KisanSuvidhaBimaPolicy = 1;
                }

                this.Products_Ar = row["Form_Components"]["Products_Ar"];

                if (p == "TW" || p == "PC") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.Plan_Type_Ar = row["Form_Components"]["Plan_Type_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "PCV") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "GCV") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Classes_Ar = row["Form_Components"]["Classes_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "Misc D") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else {
                  //health,non-motor,life,travel,personal accident
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.Plan_Type_Ar = row["Form_Components"]["Plan_Type_Ar"];
                }

                if (
                  row["Form_1"]["LOB_Id"] == "Motor" ||
                  this.KisanSuvidhaBimaPolicy == 1
                ) {
                  this.Make_Ar = row["Form_Components"]["Make_Ar"];
                  this.Models_Ar = row["Form_Components"]["Models_Ar"];
                  this.Variants_Ar = row["Form_Components"]["Variants_Ar"];
                }
              }

              this.Get_Agents(row["Form_1"]["RM_Id"]);
              this.GetFleetsBy_AgentId(row["Form_1"]["Agent_Id"]);
              this.Ins_Companies_Branch({
                value: row["Form_2"]["Insurance_Company_Id"],
              });

              this.SR_Data["Sr_Docs"] = row["Form_Components"]["Sr_Docs"];

              this.SRForm_1.patchValue(row["Form_1"]);

              //// console.log(row['Form_4']);

              //this.dateFlag=1;

              this.columnShowHide();
            } else {
              //this.dateFlag=0;
            }
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["Message"]);
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
        }
      );
  }

  // Payment_Towards(e) {
  //   var PaymentTowards = e.target.value;
  //   //alert(PaymentTowards);
  //   // if (PaymentTowards == 'Accounts') {
  //   //   this.SRForm_4.get('Mode_Of_Payment').setValue('Cash');
  //   //   this.SRForm_4.get('Mode_Of_Payment').updateValueAndValidity();
  //   // }
  // }

  onChangeFranchise(e) {
    var Franchise_Id = e.value;
    //alert(Franchise_Id);

    if (Franchise_Id != 0) {
      this.api.IsLoading();
      this.api
        .HttpForSR(
          "get",
          "SR/Get_AgentsBy_Franchise_Id?Franchise_Id=" + Franchise_Id,
          ""
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Agents_Ar = result["Data"];
            } else {
              this.Agents_Ar = [];
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    } else {
      this.Get_Agents(this.SRForm_1.value["RM_Id"]);
    }
  }

  onItemSelect(item: any, Type) {
    ////   //   console.log(Type);
    //   //   //   console.log(item.Id);

    var Id = item.Id;
    if (Type == "RM") {
      this.Get_Agents(Id);
    }
    if (Type == "Agent") {
      this.GetFleetsBy_AgentId(Id);
    }
    if (Type == "Product") {
      //this.SubProducts(Id);
    }
    if (Type == "SubProduct") {
      //this.Segments(Id);
    }
  }

  SR_Type() {
    var SR_Type = this.SRForm_1.value["SR_Type"];
    //alert(SR_Type);
    if (SR_Type != "Normal") {
      let q = prompt("Please enter SR_No/Policy/Vehicle No.", "");
      // console.log(q);
      if (q == null || q == "") {
        return false;
      } else {
        this.api.IsLoading();
        this.api
          .HttpForSR(
            "get",
            "../../v2/sr/SR_Form/FetchEndrosementAndShort?q=" +
              q +
              "&SR_Type=" +
              SR_Type,
            ""
          )
          .then(
            (result) => {
              this.api.HideLoading();

              if (result["Status"] == true) {
                this.OldSR_No_Policy_No = q;

                this.StepData = result["Data"]["StepData"];

                var row = result["Data"]["Forms_Ar"];

                this.SR_Source = row["row"]["Source"];

                this.SRForm_1.get("LOB_Id").setValue(row["Form_1"]["LOB_Id"]);
                //alert(row['Form_1']['LOB_Id']);
                this.LOB();

                if (SR_Type == "Endorsement") {
                  //this.Endorsement_Type_Ar
                  this.Nil_Endorsment_Type_Ar =
                    result["Data"]["Nil_Endorsment_Type_Ar"];
                  this.Non_Nil_Endorsment_Type_Ar =
                    result["Data"]["Non_Nil_Endorsment_Type_Ar"];

                  this.SRForm_1.get("Endorsement_Type").setValidators([
                    Validators.required,
                  ]);
                  this.SRForm_1.get(
                    "Endorsement_Type"
                  ).updateValueAndValidity();
                  this.SRForm_1.get("Endorsement_Type_Value").setValidators([
                    Validators.required,
                  ]);
                  this.SRForm_1.get(
                    "Endorsement_Type_Value"
                  ).updateValueAndValidity();
                }

                var p = row["Form_1"]["Product_Id"];
                //alert(p);

                if (row["Form_1"]["Plan_Type"] == "Kisan Suvidha Bima Policy") {
                  this.KisanSuvidhaBimaPolicy = 1;
                }

                this.Products_Ar = row["Form_Components"]["Products_Ar"];

                if (p == "TW" || p == "PC") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.Plan_Type_Ar = row["Form_Components"]["Plan_Type_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "PCV") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "GCV") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Classes_Ar = row["Form_Components"]["Classes_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "Misc D") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else {
                  //health,non-motor,life,travel,personal accident
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.Plan_Type_Ar = row["Form_Components"]["Plan_Type_Ar"];
                }

                if (
                  row["Form_1"]["LOB_Id"] == "Motor" ||
                  this.KisanSuvidhaBimaPolicy == 1
                ) {
                  this.Make_Ar = row["Form_Components"]["Make_Ar"];
                  this.Models_Ar = row["Form_Components"]["Models_Ar"];
                  this.Variants_Ar = row["Form_Components"]["Variants_Ar"];
                }

                this.Get_Agents(row["Form_1"]["RM_Id"]);
                this.GetFleetsBy_AgentId(row["Form_1"]["Agent_Id"]);
                this.Ins_Companies_Branch({
                  value: row["Form_2"]["Insurance_Company_Id"],
                });

                this.SR_Data["Sr_Docs"] = row["Form_Components"]["Sr_Docs"];

                this.SRForm_1.patchValue(row["Form_1"]);

                //this.dateFlag=1;

                this.columnShowHide();
              } else {
                this.api.Toast("Warning", result["Message"]);
              }
            },
            (err) => {
              // Error log
              this.api.HideLoading();
              //// console.log(err.message);
              this.api.Toast("Warning", err.message);
            }
          );
      }
    } else {
      this.SRForm_1.get("Endorsement_Type").updateValueAndValidity();
      this.SRForm_1.get("Endorsement_Type").updateValueAndValidity();
      this.SRForm_1.get("Endorsement_Type_Value").updateValueAndValidity();
      this.SRForm_1.get("Endorsement_Type_Value").updateValueAndValidity();
    }
  }

  Get_Agents(RM_Id) {
    this.api.IsLoading();
    this.api.HttpForSR("get", "SR/Get_Agents?RM_Id=" + RM_Id, "").then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Franchisee_Ar = result["Franchise_Ar"];
        } else {
          this.Agents_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
  }

  GetFleetsBy_AgentId(Agent_Id) {
    if (Agent_Id != 0) {
      this.api.IsLoading();
      this.api
        .HttpForSR("get", "SR/Get_FleetsBy_Agent_Id?Agent_Id=" + Agent_Id, "")
        .then(
          (result) => {
            this.api.HideLoading();

            if (
              result["Is_Check_Agent"]["Status"] == true &&
              this.SR_Source != "Web"
            ) {
              //this.api.ErrorMsg(result['Is_Check_Agent']['Message']);
              this.SRForm_1.get("Agent_Id").setValue(null);
              this.api.Toast("Warning", result["Is_Check_Agent"]["Message"]);
            }

            if (result["Status"] == true) {
              this.Fleets_Ar = result["Data"];
            } else {
              //this.Fleets_Ar = [{Id:'0',Name:'None'}];
              //this.api.ErrorMsg(result['Message']);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    }
  }

  LOB() {
    this.LOB_Id = this.SRForm_1.value["LOB_Id"][0].Id;

    this.SRForm_1.get("File_Type").setValue(null);
    this.SRForm_1.get("Product_Id").setValue(null);
    this.SRForm_1.get("SubProduct_Id").setValue(null);
    this.SRForm_1.get("Segment_Id").setValue(null);
    this.SRForm_1.get("Class_Id").setValue(null);
    this.SRForm_1.get("Sub_Class_Id").setValue(null);
    this.SRForm_1.get("Vehicle_Type").setValidators(null);

    if (this.LOB_Id === "Motor") {
      this.RSDEnable = true;

      // this.SRForm_1.get("PA_Owner").setValidators([Validators.required]);
      // this.SRForm_1.get("PA_Owner_Tenure").updateValueAndValidity();

      // this.SRForm_1.get("Insurer_Renewal").updateValueAndValidity();
      // this.SRForm_1.get("Product_Id").setValidators([Validators.required]);
      // this.SRForm_1.get("Sub_Class_Id").setValidators(null);
      this.SRForm_1.get("Segment_Id").setValidators([Validators.required]);
      this.SRForm_1.get("Plan_Type").setValidators(null);
    } else if (
      this.LOB_Id === "Health" ||
      this.LOB_Id === "Personal Accident"
    ) {
      this.RSDEnable = false;

      this.SRForm_1.get("Insurance_Company_Id").setValidators([
        Validators.required,
      ]);
      //this.SRForm_1.get("File_Type").setValidators([Validators.required]);
      this.SRForm_1.get("Product_Id").setValidators([Validators.required]);
      this.SRForm_1.get("Segment_Id").setValidators([Validators.required]);
    
      this.SRForm_1.get("Registration_State_Code").updateValueAndValidity();
      this.SRForm_1.get("Registration_District_Code").updateValueAndValidity();
      this.SRForm_1.get("Registration_City_Code").updateValueAndValidity();
      this.SRForm_1.get("Registration_Code").updateValueAndValidity();
    }

    // this.SRForm_1.get("PA_Owner").updateValueAndValidity();
    // this.SRForm_1.get("PA_Owner_Tenure").updateValueAndValidity();
    // this.SRForm_1.get("Insurer_Renewal").updateValueAndValidity();
    this.SRForm_1.get("Product_Id").updateValueAndValidity();
    this.SRForm_1.get("Segment_Id").updateValueAndValidity();
    // this.SRForm_1.get("Plan_Type").updateValueAndValidity();
    // this.SRForm_1.get("Class_Id").updateValueAndValidity();
    // this.SRForm_1.get("Sub_Class_Id").updateValueAndValidity();
    // this.SRForm_1.get("Vehicle_Type").updateValueAndValidity();
    this.SRForm_1.get("Registration_State_Code").updateValueAndValidity();
    this.SRForm_1.get("Registration_District_Code").updateValueAndValidity();
    this.SRForm_1.get("Registration_City_Code").updateValueAndValidity();
    this.SRForm_1.get("Registration_Code").updateValueAndValidity();

    const formData = new FormData();

    formData.append("LOB", this.SRForm_1.value["LOB_Id"][0].Id);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetFileTypes", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.File_Type_Ar = result["Data"]["File_Type_Ar"];
            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  RenewalDialogBox() {
    let p = prompt("Please enter Renewal Policy/Vehicle No.", "");
    if (p != null) {
      return true;
    }
  }

  // VehicleType() {
  //   var Type = this.SRForm_1.value["Vehicle_Type"];
  //   var File_Type = this.SRForm_1.value["File_Type"];

  //   if (Type == "Normal") {
  //     // this.SRForm_2.get('State_Id').setValidators([Validators.required]);
  //     // this.SRForm_2.get('RTO_Id').setValidators([Validators.required]);

  //     if (File_Type == "New") {
  //       alert(4343);
  //       this.SRForm_1.get("Registration_State_Code").updateValueAndValidity();
  //       this.SRForm_1.get(
  //         "Registration_District_Code"
  //       ).updateValueAndValidity();
  //       this.SRForm_1.get("Registration_City_Code").updateValueAndValidity();
  //       this.SRForm_1.get("Registration_Code").updateValueAndValidity();
  //     } else {
  //       alert(445655);

  //       this.SRForm_1.get("Registration_State_Code").setValidators([
  //         Validators.required,
  //         Validators.pattern("[a-zA-Z ]*$"),
  //         Validators.minLength(2),
  //         Validators.maxLength(2),
  //       ]);
  //       this.SRForm_1.get("Registration_District_Code").setValidators([
  //         Validators.required,
  //         Validators.pattern("^[0-9]*$"),
  //         Validators.minLength(2),
  //         Validators.maxLength(2),
  //       ]);
  //       this.SRForm_1.get("Registration_City_Code").setValidators([
  //         Validators.required,
  //         Validators.pattern("^$|^[A-Za-z0-9]+"),
  //         Validators.maxLength(3),
  //       ]);
  //       this.SRForm_1.get("Registration_Code").setValidators([
  //         Validators.required,
  //         Validators.pattern("^^[0-9]*$"),
  //         Validators.minLength(4),
  //         Validators.maxLength(4),
  //       ]);
  //     }

  //     this.SRForm_1.get("Registration_State_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_District_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_City_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_Code").updateValueAndValidity();
  //   } else {
  //     this.SRForm_1.get("Registration_State_Code").setValue(null);
  //     this.SRForm_1.get("Registration_District_Code").setValue(null);
  //     this.SRForm_1.get("Registration_City_Code").setValue(null);
  //     this.SRForm_1.get("Registration_Code").setValue(null);

  //     this.SRForm_1.get("Registration_State_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_District_Code").updateValueAndValidity();
  //     if (Type == "Vintage") {
  //       this.SRForm_1.get("Registration_City_Code").setValidators([
  //         Validators.required,
  //         Validators.pattern("^$|^[A-Za-z0-9]+"),
  //         Validators.maxLength(8),
  //       ]);
  //     } else {
  //       this.SRForm_1.get("Registration_City_Code").setValidators([
  //         Validators.required,
  //         Validators.pattern("^$|^[A-Za-z0-9]+"),
  //         Validators.maxLength(10),
  //       ]);
  //     }
  //     this.SRForm_1.get("Registration_Code").updateValueAndValidity();

  //     this.SRForm_1.get("Registration_State_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_District_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_City_Code").updateValueAndValidity();
  //     this.SRForm_1.get("Registration_Code").updateValueAndValidity();
  //   }

  //   // this.SRForm_2.get('State_Id').updateValueAndValidity();
  //   // this.SRForm_2.get('RTO_Id').updateValueAndValidity();
  // }

  Products() {
    var LOB_Id = this.SRForm_1.value["LOB_Id"][0].Id;
    this.File_Type = this.SRForm_1.value["File_Type"];
    var Renewal_Policy_Vehicle_No = "";

    if (LOB_Id == "Motor") {
      if (this.File_Type == "New") {
        
        this.SRForm_1.get('Registration_State_Code').setValidators(null);
        this.SRForm_1.get('Registration_District_Code').setValidators(null);
        this.SRForm_1.get('Registration_City_Code').setValidators(null);
        this.SRForm_1.get('Registration_Code').setValidators(null);
        // this.SRForm_1.get("Registration_Code").updateValueAndValidity();
      } else {

        this.SRForm_1.get('Registration_State_Code').setValidators([Validators.required,Validators.pattern("[a-zA-Z ]*$"),Validators.minLength(2), Validators.maxLength(2)]);
						this.SRForm_1.get('Registration_District_Code').setValidators([Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(2), Validators.maxLength(2)]);
						this.SRForm_1.get('Registration_City_Code').setValidators([Validators.required,Validators.pattern("^$|^[A-Za-z0-9]+"), Validators.maxLength(3)]);
						this.SRForm_1.get('Registration_Code').setValidators([Validators.required,Validators.pattern("^^[0-9]*$"),Validators.minLength(4), Validators.maxLength(4)]);
        // this.SRForm_1.get("Registration_Code").setValidators([
        //   Validators.required,
        //   Validators.pattern("^$|^[A-Za-z0-9]+"),
        //   Validators.minLength(4),
        //   Validators.maxLength(11),
        // ]);
      }

      this.SRForm_1.get('Registration_State_Code').updateValueAndValidity();
      this.SRForm_1.get('Registration_District_Code').updateValueAndValidity();
      this.SRForm_1.get('Registration_City_Code').updateValueAndValidity();
      this.SRForm_1.get('Registration_Code').updateValueAndValidity();
      this.SRForm_1.get("Registration_Code").updateValueAndValidity();
    }

    if (this.File_Type == "Renewal" || this.File_Type == "Rollover") {
      //this.SRForm_1.get("Insurer_Renewal").setValidators([Validators.required]);
    } else {
      //this.SRForm_1.get("Insurer_Renewal").updateValueAndValidity();
    }
    // this.SRForm_1.get("Insurer_Renewal").updateValueAndValidity();

    if (this.File_Type == "Renewal" && this.AutoRenewal == "") {
      // let p = prompt("Please enter Renewal Policy/Vehicle No.", "");
      // if (p == null || p == "") {
      //   this.SRForm_1.get("File_Type").setValue(null);
      //   this.SRForm_1.get("File_Type").updateValueAndValidity();
      //   return false;
      // } else {
      //   Renewal_Policy_Vehicle_No = p;
      //   this.RenewalPolicy_Vehicle_No = Renewal_Policy_Vehicle_No;
      // }
    } else if (this.File_Type == "Renewal" && this.AutoRenewal == "1") {
      Renewal_Policy_Vehicle_No = this.RenewalPolicy_Vehicle_No;
    }

    this.SRForm_1.get("Product_Id").setValue(null);
    this.SRForm_1.get("SubProduct_Id").setValue(null);
    this.SRForm_1.get("Segment_Id").setValue(null);
    this.SRForm_1.get("Plan_Type").setValue(null);
    this.SRForm_1.get("Class_Id").setValue(null);
    this.SRForm_1.get("Sub_Class_Id").setValue(null);

    const formData = new FormData();
    formData.append("LOB", LOB_Id);
    formData.append("File_Type", this.File_Type);
    formData.append("Renewal_Policy_Vehicle_No", Renewal_Policy_Vehicle_No);
    formData.append(
      "Ins_Compaines_Ids",
      JSON.stringify(this.SRForm_1.value["Insurance_Company_Id"])
    );

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/pay-in/Fillter/GetProducts", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Products_Ar = [];
            this.SubProducts_Ar = [];
            this.Segment_Ar = [];
            this.Classes_Ar = [];
            this.Sub_Classes_Ar = [];

            this.Make_Ar = [];
            this.Models_Ar = [];
            this.Variants_Ar = [];

            this.Products_Ar = result["Data"]["Product"];

            if (this.File_Type == "Renewal") {
              if (result["Data"]["Renewal_Forms"] > 0) {
                /*
                this.Renewal_Data = result['Data']['Renewal_Data']; 
                
                this.Get_Agents(this.Renewal_Data['Form_1']['RM_Id']);
                this.GetFleetsBy_AgentId(this.Renewal_Data['Form_1']['Agent_Id']);
                
                this.SRForm_1.patchValue(this.Renewal_Data['Form_1']);
                this.SRForm_2.patchValue(this.Renewal_Data['Form_2']);
                this.SRForm_3.patchValue(this.Renewal_Data['Form_3']);
                this.SRForm_4.patchValue(this.Renewal_Data['Form_4']);
                */

                var row = result["Data"]["Renewal_Data"];

                var p = row["Form_1"]["Product_Id"];

                this.PYP_URL = row["row"]["PYP_URL"];

                //alert(row['Form_2']['Policy_End_Date_OD']);
                this.Renewal_RED = row["Form_2"]["Policy_End_Date_OD"];

                //alert(p);
                //alert(row['Form_1']['LOB_Id']);
                this.Products_Ar = row["Form_Components"]["Products_Ar"];

                if (p == "TW" || p == "PC") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.Plan_Type_Ar = row["Form_Components"]["Plan_Type_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "PCV") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "GCV") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Classes_Ar = row["Form_Components"]["Classes_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else if (p == "Misc D") {
                  this.Segment_Ar = row["Form_Components"]["PolicyTypeAr"];
                  this.SubProducts_Ar =
                    row["Form_Components"]["SubProducts_Ar"];
                  this.Sub_Classes_Ar =
                    row["Form_Components"]["Sub_Classes_Ar"];
                } else {
                }

                if (this.SRForm_1.value["LOB_Id"] == "Motor") {
                  this.Make_Ar = row["Form_Components"]["Make_Ar"];
                  this.Models_Ar = row["Form_Components"]["Models_Ar"];
                  this.Variants_Ar = row["Form_Components"]["Variants_Ar"];
                }

                this.Get_Agents(row["Form_1"]["RM_Id"]);
                this.GetFleetsBy_AgentId(row["Form_1"]["Agent_Id"]);
                this.Ins_Companies_Branch({
                  value: row["Form_2"]["Insurance_Company_Id"],
                });

                //this.SR_Data['Sr_Docs'] = row['Form_Components']['Sr_Docs'];

                this.SRForm_1.patchValue(row["Form_1"]);

                this.columnShowHide();
              } else {
                // this.SRForm_1.get("File_Type").setValue(null);
                // this.SRForm_1.get("File_Type").updateValueAndValidity();
                // this.RenewalPolicy_Vehicle_No = "";
                // alert("No Renewal Data Found !");
              }
            }
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  PA_Owner() {
    this.PAOwner = this.SRForm_1.value["PA_Owner"];

    if (this.PAOwner == "Yes") {
      this.SRForm_1.get("PA_Owner_Tenure").setValidators([Validators.required]);
    } else {
      this.SRForm_1.get("PA_Owner_Tenure").updateValueAndValidity();
    }
    this.SRForm_1.get("PA_Owner_Tenure").updateValueAndValidity();
  }

  GetPolicyNo(e: any) {
    //// console.log(e.target.value);
    if (e.target.value.length > 0) {
      //// console.log(e.target.value.length);
      this.SRForm_1.get("Policy_Document").setValidators([Validators.required]);
    } else {
      this.SRForm_1.get("Policy_Document").setValidators(null);
    }

    this.SRForm_1.get("Policy_Document").updateValueAndValidity();
  }

  HealthInsuranceCompanies() {
    this.SRForm_1.get("File_Type").setValue(null);
    this.SRForm_1.get("Product_Id").setValue(null);
    this.SRForm_1.get("Segment_Id").setValue(null);
    this.SRForm_1.get("Plan_Type").setValue(null);

    this.SRForm_1.get("File_Type").updateValueAndValidity();
    this.SRForm_1.get("Product_Id").updateValueAndValidity();
    this.SRForm_1.get("Segment_Id").updateValueAndValidity();
    this.SRForm_1.get("Plan_Type").updateValueAndValidity();
  }

  columnShowHide() {
    var p = this.SRForm_1.value["Product_Id"][0].Id;

    if (this.SRForm_1.value["LOB_Id"][0].Id == "Motor") {
      if (p == "TW" || p == "PC") {
        this.viewPolicyType = 1;
        this.viewPlanType = 1;
        this.viewSubProduct = 0;
        this.viewClass = 0;

        this.IsSeatingCapcityEdit = "1";
      } else if (p == "PCV") {
        this.viewPolicyType = 1;
        this.viewPlanType = 0;
        this.viewSubProduct = 1;
        this.viewClass = 0;

        this.IsSeatingCapcityEdit = "1";
      } else if (p == "GCV") {
        this.viewPolicyType = 1;
        this.viewPlanType = 0;
        this.viewSubProduct = 1;
        this.viewClass = 1;

        this.IsSeatingCapcityEdit = "0";
      } else if (p == "Misc D") {
        this.viewPolicyType = 1;
        this.viewPlanType = 0;
        this.viewSubProduct = 1;
        this.viewClass = 0;

        this.IsSeatingCapcityEdit = "0";
      } else if (p == "MTRR" || p == "CVEWP" || p == "MEWP") {
        this.viewPolicyType = 1;
        this.viewPlanType = 1;
        this.viewSubProduct = 1;
        this.viewClass = 0;

        this.IsSeatingCapcityEdit = "0";
      }
    } else {
      this.viewPolicyType = 1;
      this.viewPlanType = 1;
      this.viewSubProduct = 0;
      this.viewClass = 0;

      this.IsSeatingCapcityEdit = "0";
    }
  }

  Policy_Type() {
    this.columnShowHide();

    this.KisanSuvidhaBimaPolicy = 0;
    if (
      this.SRForm_1.value["Product_Id"][0].Id == "AGRICULTURE - Tractor" ||
      this.SRForm_1.value["Product_Id"][0].Id == "AGRICULTURE - Tractor+Trolly"
    ) {
      this.KisanSuvidhaBimaPolicy = 1;
      //Kisan Suvidha Bima Policy
    }
    //alert(this.KisanSuvidhaBimaPolicy);

    var lob = this.SRForm_1.value["LOB_Id"][0].Id;

    var insurance_c = "";
    if (lob == "Motor" || lob == "Personal Accident") {
      insurance_c = "";
    } else {
      insurance_c = this.SRForm_1.value["Insurance_Company_Id"][0].Id;
    }
    // console.log(insurance_c);

    this.SRForm_1.get("SubProduct_Id").setValue(null);
    this.SRForm_1.get("Segment_Id").setValue(null);
    this.SRForm_1.get("Plan_Type").setValue(null);
    this.SRForm_1.get("Class_Id").setValue(null);
    this.SRForm_1.get("Sub_Class_Id").setValue(null);
    const formData = new FormData();
    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);
    formData.append("LOB", this.SRForm_1.value["LOB_Id"][0].Id);
    formData.append("File_Type", this.SRForm_1.value["File_Type"]);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"][0].Id);
    formData.append("Insurance_Company_Id", insurance_c);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetPolicy_Type", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            if (this.SRForm_1.value["File_Type"] == "New") {
              if (
                this.SRForm_1.value["Product_Id"][0].Id == "TW" ||
                this.SRForm_1.value["Product_Id"][0].Id == "PC"
              ) {
                this.SRForm_1.get("Segment_Id").setValue([
                  { Id: "CP", Name: "Comprehensive" },
                ]);
                this.SRForm_1.get("Segment_Id").updateValueAndValidity();

                this.Plan_Type();
              }
            }

            this.SubProducts_Ar = [];
            //this.Segment_Ar =[];
            this.Classes_Ar = [];
            this.Sub_Classes_Ar = [];

            this.Make_Ar = [];
            this.Models_Ar = [];
            this.Variants_Ar = [];

            this.Segment_Ar = result["Data"]["PolicyType"];
            this.FireOccupancy_Ar = result["Data"]["FireOccupancy"];
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  Plan_Type() {
    // this.SRForm_1.get('SubProduct_Id').setValue(null);
    // this.SRForm_1.get('Segment_Id').setValue(null);
    // this.SRForm_1.get('Class_Id').setValue(null);
    // this.SRForm_1.get('Sub_Class_Id').setValue(null);

    //  let data = this.SRForm_1.value['Insurance_Company_Id'][0].Id;
    //  // console.log(data);
    let lob = this.SRForm_1.value["LOB_Id"][0].Id;

    let insurance_c = "";
    if (lob == "Motor" || lob == "Personal Accident") {
      insurance_c = "";
    } else {
      insurance_c = this.SRForm_1.value["Insurance_Company_Id"][0].Id;
    }
  

    const formData = new FormData();
    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);
    formData.append("LOB", this.SRForm_1.value["LOB_Id"][0].Id);
    formData.append("File_Type", this.SRForm_1.value["File_Type"]);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"][0].Id);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"][0].Id);
    formData.append("KisanSuvidhaBimaPolicy", this.KisanSuvidhaBimaPolicy);
    formData.append("Insurance_Company_Id", insurance_c);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetPlan_Type", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.SubProducts_Ar = [];
            this.Sub_Classes_Ar = [];

            this.Make_Ar = [];
            this.Models_Ar = [];
            this.Variants_Ar = [];

            var p = this.SRForm_1.value["Product_Id"][0].Id;
            if (p == "PCV" || p == "GCV") {
              this.SubProducts_Ar = result["Data"];
            } else if (p == "Misc D") {
              this.SubProducts_Ar = result["Data"];
            } else {
              this.Plan_Type_Ar = result["Data"];
            }

            if (this.SRForm_1.value["File_Type"] == "New") {
              if (p == "TW") {
                this.SRForm_1.get("Plan_Type").setValue([
                  { Id: "1 Yr OD + 5 Yr TP", Name: "1 Yr OD + 5 Yr TP" },
                ]);
                this.SRForm_1.get("Plan_Type").updateValueAndValidity();
                this.SubProduct();
              }

              if (p == "PC") {
                this.SRForm_1.get("Plan_Type").setValue([
                  { Id: "1 Yr OD + 3 Yr TP", Name: "1 Yr OD + 3 Yr TP" },
                ]);
                this.SRForm_1.get("Plan_Type").updateValueAndValidity();
                this.SubProduct();
              }
            }
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  SubProduct() {
    const formData = new FormData();

    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);

    formData.append("LOB", this.SRForm_1.value["LOB_Id"][0].Id);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"][0].Id);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"][0].Id);
    formData.append("Plan_Type", this.SRForm_1.value["Plan_Type"][0].Id);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetSubProduct", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          this.SubProducts_Ar = [];
          //this.Segment_Ar =[];
          this.Classes_Ar = [];
          this.Sub_Classes_Ar = [];

          this.Make_Ar = [];
          this.Models_Ar = [];
          this.Variants_Ar = [];

          if (result["Status"] == true) {
            var p = this.SRForm_1.value["Product_Id"][0].Id;
            if (p == "TW" || p == "PC") {
              this.Sub_Classes_Ar = result["Data"];
            } else if (p == "MTRR" || p == "CVEWP" || p == "MEWP") {
              this.SubProducts_Ar = result["Data"];
            } else {
              this.SubProducts_Ar = result["Data"];
            }
            if (this.KisanSuvidhaBimaPolicy == 1) {
              this.Make_Ar = result["Data"];
            }

            this.SRForm_1.get("SubProduct_Id").setValue(null);
            this.SRForm_1.get("Class_Id").setValue(null);
            this.SRForm_1.get("Sub_Class_Id").setValue(null);
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again !");
        }
      );
  }

  Classes() {
    var p = this.SRForm_1.value["Product_Id"][0].Id;
    if (p == "Misc D") {
      if (this.SRForm_1.value["SubProduct_Id"][0].Id == "Agriculture Tractor") {
        this.viewClass = 1;
      } else {
        this.viewClass = 0;
      }
    }

    // if (this.SRForm_1.value['LOB_Id'][0].Id == 'Motor') {
    // }

    const formData = new FormData();

    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);

    formData.append("LOB", this.SRForm_1.value["LOB_Id"][0].Id);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"][0].Id);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"][0].Id);
    formData.append("Plan_Type", null);
    formData.append(
      "SubProduct_Id",
      this.SRForm_1.value["SubProduct_Id"][0].Id
    );

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/GetClasses", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Classes_Ar = [];
        this.Sub_Classes_Ar = [];

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        //this.SRForm_1.get('Segment_Id').setValue(null);
        this.SRForm_1.get("Class_Id").setValue(null);
        this.SRForm_1.get("Sub_Class_Id").setValue(null);

        if (result["Status"] == true) {
          if (p == "PCV") {
            this.Sub_Classes_Ar = result["Data"];
          } else if (p == "GCV") {
            this.Classes_Ar = result["Data"];
          } else if (p == "Misc D") {
            if (
              this.SRForm_1.value["SubProduct_Id"][0].Id ==
              "Agriculture Tractor"
            ) {
              this.Classes_Ar = result["Data"];
            } else {
              this.Sub_Classes_Ar = result["Data"];
            }
          } else if (p == "MTRR" || p == "CVEWP" || p == "MEWP") {
            this.Sub_Classes_Ar = result["Data"];
          } else {
          }
        } else {
          this.api.Toast("Success", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Sub_Classes() {
    /*	   
         const Class_Id = this.SRForm_1.value['Class_Id'];
          
         if(Class_Id == 'Public Carrier' || Class_Id == 'Private Carrier'){
          //this.Vehicle_Type = 'GCV';
         }else{
            //this.Vehicle_Type = 'Other';
         }
         
        if(Class_Id == 'Passenger Carrying Vehicles' || Class_Id == 'Two Wheeler' || Class_Id == 'Private Cars'){
          this.IsSeatingCapcityEdit='1';
        }else{
          this.IsSeatingCapcityEdit='0';
        }
      */

    const formData = new FormData();

    formData.append("viewPolicyType", this.viewPolicyType);
    formData.append("viewPlanType", this.viewPlanType);
    formData.append("viewSubProduct", this.viewSubProduct);
    formData.append("viewClass", this.viewClass);

    formData.append("LOB", this.SRForm_1.value["LOB_Id"][0].Id);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"][0].Id);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"][0].Id);
    formData.append("Plan_Type", this.SRForm_1.value["Plan_Type"]);
    formData.append(
      "SubProduct_Id",
      this.SRForm_1.value["SubProduct_Id"][0].Id
    );
    formData.append("Class_Id", this.SRForm_1.value["Class_Id"][0].Id);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetSubClasses", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          this.Make_Ar = [];
          this.Models_Ar = [];
          this.Variants_Ar = [];

          this.SRForm_1.get("Sub_Class_Id").setValue(null);

          /*
      this.SRForm_1.get('Make_Id').setValue(null);
      this.SRForm_1.get('Model_Id').setValue(null);
      this.SRForm_1.get('Variant_Id').setValue(null);
      this.SRForm_1.get('Body_Type').setValue(null);
      this.SRForm_1.get('Fuel_Type').setValue(null);
      this.SRForm_1.get('Seating_Capcity').setValue(null);
      */
          if (result["Status"] == true) {
            this.Sub_Classes_Ar = result["Data"];
            //this.Make_Ar = result['Make'];
          } else {
            this.api.Toast("Success", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
  }

  Make() {
    const formData = new FormData();

    formData.append("Product_Id", this.SRForm_1.value["Product_Id"][0].Id);
    formData.append("Sub_Class_Id", this.SRForm_1.value["Sub_Class_Id"][0].Id);
    formData.append("KisanSuvidhaBimaPolicy", this.KisanSuvidhaBimaPolicy);

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/Make", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Models_Ar = [];
        this.Variants_Ar = [];

        if (result["Status"] == true) {
          //if(type==0){
          this.Make_Ar = result["Data"];
          //}
          //this.Get_TP_Premium();
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Model() {
    const formData = new FormData();

    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);
    formData.append("Sub_Class_Id", this.SRForm_1.value["Sub_Class_Id"]);
    formData.append("Make_Id", this.SRForm_1.value["Make_Id"]);
    formData.append("KisanSuvidhaBimaPolicy", this.KisanSuvidhaBimaPolicy);

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/Models", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SRForm_1.get("Model_Id").setValue("");
        this.SRForm_1.get("Variant_Id").setValue("");
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue("");

        this.Models_Ar = [];
        this.Variants_Ar = [];

        if (result["Status"] == true) {
          this.Models_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Variant() {
    const formData = new FormData();
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);
    formData.append("Class_Id", this.SRForm_1.value["Class_Id"]);
    formData.append("Sub_Class_Id", this.SRForm_1.value["Sub_Class_Id"]);
    formData.append("Make_Id", this.SRForm_1.value["Make_Id"]);
    formData.append("Model_Id", this.SRForm_1.value["Model_Id"]);
    formData.append("KisanSuvidhaBimaPolicy", this.KisanSuvidhaBimaPolicy);

    this.api.IsLoading();
    this.api.HttpForSR("post", "../../v2/sr/SR_Form/Variants", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SRForm_1.get("Variant_Id").setValue("");
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue("");
        this.SRForm_1.get("GVW_CC").setValue("");

        if (result["Status"] == true) {
          this.Variants_Ar = result["Data"];
        } else {
          this.Variants_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }
  GetBody_Fuel_Type() {
    const formData = new FormData();

    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);
    formData.append("Sub_Class_Id", this.SRForm_1.value["Sub_Class_Id"]);
    formData.append("Make_Id", this.SRForm_1.value["Make_Id"]);
    formData.append("Model_Id", this.SRForm_1.value["Model_Id"]);
    formData.append("Variant_Id", this.SRForm_1.value["Variant_Id"]);
    formData.append("KisanSuvidhaBimaPolicy", this.KisanSuvidhaBimaPolicy);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "../../v2/sr/SR_Form/GetBody_Fuel_Type", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.SRForm_1.get("Body_Type").setValue(
              result["Data"]["Body_Type"]
            );
            this.SRForm_1.get("Fuel_Type").setValue(
              result["Data"]["Fuel_Type"]
            );

            var Seating_Capcity = result["Data"]["Seating_Capcity"];
            this.Seating_Capcity = Seating_Capcity;

            if (this.SRForm_1.value["SubProduct_Id"] == "Two Wheeler Taxi") {
              //Update by Jayanti Ji[07-06-2022]
              Seating_Capcity = 1;
            }

            this.SRForm_1.get("Seating_Capcity").setValue(Seating_Capcity);
            this.SRForm_1.get("GVW_CC").setValue(result["Data"]["GVW_CC"]);
          } else {
            this.SRForm_1.get("Body_Type").setValue(null);
            this.SRForm_1.get("Fuel_Type").setValue(null);
            this.SRForm_1.get("Seating_Capcity").setValue(null);
            this.SRForm_1.get("GVW_CC").setValue(null);

            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
  }

  onChangeRTO(item: any) {
    // console.log(item);
    this.RTO({ Id: item.value });
  }

  RTO(item: any) {
    const State_Id = item.Id;

    this.api.IsLoading();
    this.api.HttpForSR("get", "SR/RTO?State_Id=" + State_Id, "").then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.RTO_Ar = result["Data"];
        } else {
          this.RTO_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Ins_Companies_Branch(item: any) {
    const formData = new FormData();

    formData.append("Step_Id", this.Step_Id);
    formData.append("LOB_Id", this.StepData["LOB_Id"]);
    formData.append("Insurance_Company_Id", item.value);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Ins_Companies_Branch_New", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Ins_Branch_Companies_Ar = result["Data"];
          this.LI_Product_Types = result["LI_Product_Types"];
          this.LI_Product_Plan_Array = result["LI_Product_Plan"];
        } else {
          this.Ins_Branch_Companies_Ar = [];
          this.LI_Product_Types = result["LI_Product_Types"];
          //this.api.Toast('Warning',result['Message']);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  LI_Products(e: any) {
    const formData = new FormData();

    formData.append("Step_Id", this.Step_Id);
    formData.append("LOB_Id", this.StepData["LOB_Id"]);
    formData.append(
      "Insurance_Company_Id",
      this.SRForm_2.get("Insurance_Company_Id").value
    );
    formData.append("Product_Type", e.target.value);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/LI_Products", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.Products_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
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
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 3 mb");

          if (Type == "RC_Motor_Registraion_Front") {
            this.SRForm_5.get("RC_Motor_Registraion_Front").setValue("");
          }
          if (Type == "RC_Motor_Registraion_Back") {
            this.SRForm_5.get("RC_Motor_Registraion_Back").setValue("");
          }

          if (Type == "Previous_Policy_Copy") {
            this.SRForm_5.get("Previous_Policy_Copy").setValue("");
          }
          if (Type == "Cheque_Payment_Recipt") {
            this.SRForm_5.get("Cheque_Payment_Recipt").setValue("");
          }

          if (Type == "Invoice") {
            this.SRForm_5.get("Invoice").setValue("");
          }
          if (Type == "Renewal_Notice") {
            this.SRForm_5.get("Renewal_Notice").setValue("");
          }
          if (Type == "Endorsement_Copy") {
            this.SRForm_5.get("Endorsement_Copy").setValue("");
          }
          if (Type == "Other") {
            this.SRForm_5.get("Other").setValue("");
          }
          if (Type == "Policy_Document") {
            this.SRForm_5.get("Policy_Document").setValue("");
          }

          // if (Type == 'KYC_Document') { this.SRForm_5.get('KYC_Document').setValue(''); }
        } else {
          if (Type == "RC_Motor_Registraion_Front") {
            this.RC_Motor_Registraion_Front = this.selectedFiles;
          }
          if (Type == "RC_Motor_Registraion_Back") {
            this.RC_Motor_Registraion_Back = this.selectedFiles;
          }

          if (Type == "Previous_Policy_Copy") {
            this.Previous_Policy_Copy = this.selectedFiles;
          }
          if (Type == "Cheque_Payment_Recipt") {
            this.Cheque_Payment_Recipt = this.selectedFiles;
          }
          if (Type == "Mandate_Letter") {
            this.Mandate_Letter = this.selectedFiles;
          }
          if (Type == "Invoice") {
            this.Invoice = this.selectedFiles;
          }
          if (Type == "Renewal_Notice") {
            this.Renewal_Notice = this.selectedFiles;
          }
          if (Type == "Endorsement_Copy") {
            this.Endorsement_Copy = this.selectedFiles;
          }
          if (Type == "Other") {
            this.Other = this.selectedFiles;
          }
          if (Type == "Policy_Document") {
            this.PolicyPDF = this.selectedFiles;
          }
          if (Type == "KYC_Document") {
            this.KYC_Document = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "RC_Motor_Registraion_Front") {
          this.SRForm_1.get("RC_Motor_Registraion_Front").setValue("");
        }
        if (Type == "RC_Motor_Registraion_Back") {
          this.SRForm_1.get("RC_Motor_Registraion_Back").setValue("");
        }

        if (Type == "Previous_Policy_Copy") {
          this.SRForm_1.get("Previous_Policy_Copy").setValue("");
        }
        if (Type == "Cheque_Payment_Recipt") {
          this.SRForm_1.get("Cheque_Payment_Recipt").setValue("");
        }
        if (Type == "Mandate_Letter") {
          this.SRForm_1.get("Mandate_Letter").setValue("");
        }
        if (Type == "Invoice") {
          this.SRForm_1.get("Invoice").setValue("");
        }
        if (Type == "Renewal_Notice") {
          this.SRForm_1.get("Renewal_Notice").setValue("");
        }
        if (Type == "Endorsement_Copy") {
          this.SRForm_1.get("Endorsement_Copy").setValue("");
        }
        if (Type == "Other") {
          this.SRForm_1.get("Other").setValue("");
        }
        if (Type == "PolicyPDF") {
          this.SRForm_1.get("PolicyPDF").setValue("");
        }
        if (Type == "KYC_Document") {
          this.SRForm_1.get("KYC_Document").setValue("");
        }
      }
    }
  }

  UploadDocsAndSave(event, Type) {
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
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
        } else {
          //upload and save

          const formData = new FormData();

          formData.append("Source", this.Source);
          formData.append("User_Id", this.User_Id);
          formData.append("SR_Id", this.SR_Id);
          formData.append("SR_Type", this.SRForm_1.value["SR_Type"]);
          formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
          formData.append("Plan_Type", this.SRForm_1.value["Plan_Type"]);
          formData.append("SR_Source", this.SR_Data["Source"]);

          formData.append(Type, this.selectedFiles);

          this.api.IsLoading();
          this.api
            .HttpPostType("../v2/sr/Validation/Re_Upload_Docs", formData)
            .then(
              (result) => {
                this.api.HideLoading();

                if (result["Status"] == true) {
                  this.SR_Data["Sr_Docs"] = result["Docs"];

                  this.api.Toast("Success", result["Message"]);
                } else {
                  this.api.Toast("Error", result["Message"]);
                }
              },
              (err) => {
                // Error log
                //// console.log(err.message);
                this.api.Toast("Warning", "Network Error, Please try again ! ");
              }
            );
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  SubmitForm() {
    //this.dateFlag=1;
      console.log(this.SRForm_1.controls);

    this.isSubmitted = true;
    if (this.SRForm_1.invalid) {
      // console.log(321);
      return;
    } else {
      // console.log(123);

      // console.log(this.SRForm_1.value);

      var fields = this.SRForm_1.value;

      var Product_Id = fields["Product_Id"][0].Id;
      var File_Type = fields["File_Type"];

      var LOB = fields["LOB_Id"][0].Id;
      const formData = new FormData();

      // formData.append('User_Id', this.User_Id);
      // formData.append('SR_Id', this.SR_Id);
      // formData.append('SR_Type', this.SRForm_1.value['SR_Type']);

      if (LOB == "Motor") {
        formData.append("PA_Owner", this.SRForm_1.value["PA_Owner"]);
        formData.append(
          "PA_Owner_Tenure",
          this.SRForm_1.value["PA_Owner_Tenure"]
        );
        formData.append("Vehicle_Type", this.SRForm_1.value["Vehicle_Type"]);

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

        // files code

        formData.append(
          "RC_Motor_Registraion_Front",
          this.RC_Motor_Registraion_Front
        );
        formData.append(
          "RC_Motor_Registraion_Back",
          this.RC_Motor_Registraion_Back
        );
      }

      formData.append("Previous_Policy_Copy", this.Previous_Policy_Copy);
      formData.append("Cheque_Payment_Recipt", this.Cheque_Payment_Recipt);
      formData.append("Invoice", this.Invoice);
      formData.append("Renewal_Notice", this.Renewal_Notice);
      formData.append("KYC_Document", this.KYC_Document);
      formData.append("PolicyPDF", this.PolicyPDF);

      formData.append("Segment_Id", fields["Segment_Id"][0].Id);
      formData.append("User_Id", this.User_Id);
      formData.append("SR_Id", this.SR_Id);
      formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"][0].Id);
      formData.append("Product_Id", Product_Id);
      formData.append("File_Type", File_Type);
      formData.append("Insurer_Renewal", fields["Insurer_Renewal"]);
      formData.append("Plan_Type", JSON.stringify(fields["Plan_Type"]));

      formData.append("Class_Id", JSON.stringify(fields["Class_Id"]));

      formData.append("SubProduct_Id", JSON.stringify(fields["SubProduct_Id"]));

      formData.append("Sub_Class_Id", JSON.stringify(fields["Sub_Class_Id"]));

      formData.append("Customer_Name", fields["CustomerName"]);
      formData.append("Customer_Email", fields["emailId"]);
      formData.append("Insurer_Name", fields["InsurerName"]);
      formData.append("personal_Mobile", fields["personalMobile"]);
      formData.append("PolicyStartDate", fields["policyStartDate"]);
      formData.append("Issue_Date", fields["IssueDate"]);
      formData.append("Policy_Number", fields["PolicyNumber"]);
      formData.append("Payment_Towards", ""); //fields["PaymentFavour"][0].Id

      if (this.api.GetUserData("Type") == "agent") {
        formData.append("Mode_Of_Payment", "");

        formData.append("RM_Id", "");
        formData.append("Agent_Id", "");
      } else {
        if (fields["PaymentMode"][0].Id == "Cash") {
          formData.append("Payment_Towards", "Accounts");
        } else {
          formData.append("Payment_Towards", "Insurance Company");
        }
        formData.append("Mode_Of_Payment", fields["PaymentMode"][0].Id);

        formData.append("RM_Id", fields["RM_Id"][0].Id);
        formData.append("Agent_Id", fields["Agent_Id"][0].Id);
      }

      formData.append("Cheque_Number", fields["ChequeNumber"]);
      formData.append("Payout_Mode", ""); //fields["Payout_Mode"][0].Id
      formData.append("Gross_Premium", fields["GrossPremium"]);
      formData.append("KYC_Method", fields["KYC_Method"]);
      formData.append("KYC_No", fields["KYC_No"]);
      formData.append("KYC_DOB", fields["KYC_DOB"]);

      formData.append("Sum_Insured", fields["Sum_Insured"]);
      formData.append(
        "Insurance_Company_Id",
        this.SRForm_1.value["Insurance_Company_Id"][0].Id
      );

      this.api.IsLoading();
      this.api.HttpPostTypeBms("../v3/sr/Offline_Booking", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);

            this.router.navigate(["offline-booking/report"]);

            this.StepData = result["StepData"];

            this.States_Ar = result["Data"]["States_Ar"];
            this.Ins_Companies_Ar = result["Data"]["Companies_Ar"];

            if (LOB == "Health") {
              this.Ins_Companies_Branch({
                value: this.SRForm_1.value["Insurance_Company_Id"],
              });
              this.SRForm_2.get("Insurance_Company_Id").setValue(
                this.SRForm_1.value["Insurance_Company_Id"]
              );
              this.SRForm_2.get(
                "Insurance_Company_Id"
              ).updateValueAndValidity();
            }

            if (LOB == "Motor" || this.KisanSuvidhaBimaPolicy == 1) {
              if (this.StepData["State_Id"] != 0) {
                this.RTO({ Id: this.StepData["State_Id"] });
              }

              this.TP_Premium = this.StepData["TP_Premium"];
              this.Per_Passenger_Cost = this.StepData["Per_Passenger_Cost"];

              var Basic_OD_Control = this.SRForm_4.get("Basic_OD");
              var Basic_TP_Control = this.SRForm_4.get("Basic_TP");

              this.Basic_TP = this.StepData["Basic_TP"];
              Basic_TP_Control.setValue(this.Basic_TP);
              Basic_TP_Control.enable();

              //alert(this.StepData['Basic_TP']+'|'+this.Basic_TP);

              if (this.SRForm_1.value["Segment_Id"] == "CP") {
                Basic_OD_Control.enable();
              } else if (this.SRForm_1.value["Segment_Id"] == "TP") {
                Basic_OD_Control.setValue(0);
                Basic_OD_Control.disable();
              } else if (this.SRForm_1.value["Segment_Id"] == "OD") {
                Basic_TP_Control.disable();
              }

              Basic_OD_Control.updateValueAndValidity();
              Basic_TP_Control.updateValueAndValidity();

              if (
                (Product_Id == "GCV" ||
                  Product_Id == "Misc D" ||
                  Product_Id == "PCV") &&
                (File_Type == "Used" ||
                  File_Type == "Renewal" ||
                  File_Type == "Rollover")
              ) {
                this.Policy_Tenure = this.StepData["Policy_Tenure"];
              }
            }

            this.OD_Days = this.StepData["OD_Days"];
            this.TP_Days = this.StepData["TP_Days"];
            this.Is_Policy_OD = this.StepData["Is_Policy_OD"];

            //this.dateFlag = 0;
          } else {
            this.api.Toast("Error", result["Message"]);
            //$("input[name='"+result['InputName']+"']").focus();
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
    }
  }

  onChangeKYC_Method(e: any) {
    var KYC_Method = this.SRForm_1.value["KYC_Method"];

    this.SRForm_1.get("KYC_No").setValue("");
    //this.SRForm_1.get('KYC_DOB').setValue(null);

    if (KYC_Method == "N/A" || KYC_Method == "") {
      this.SRForm_1.get("KYC_No").setValidators(null);
      this.SRForm_1.get("KYC_DOB").setValidators(null);
    } else {
      this.SRForm_1.get("KYC_No").setValidators([Validators.required]);

      if (KYC_Method == "pan_dob" || KYC_Method == "aadhaar_dob") {
        if (KYC_Method == "aadhaar_dob") {
          this.SRForm_1.get("KYC_No").setValidators([
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(12),
            Validators.maxLength(12),
          ]);
        }
        if (KYC_Method == "pan_dob") {
          this.SRForm_1.get("KYC_No").setValidators([
            Validators.required,
            Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}"),
          ]);
        }

        this.SRForm_1.get("KYC_DOB").setValidators([Validators.required]);
      } else {
        this.SRForm_1.get("KYC_DOB").setValidators(null);
      }
    }

    this.SRForm_1.get("KYC_No").updateValueAndValidity();
    this.SRForm_1.get("KYC_DOB").updateValueAndValidity();
  }

  Payment_Towards() {
    var PaymentTowards = this.SRForm_1.value["PaymentFavour"][0].Id;

    // console.log(PaymentTowards);

    if (PaymentTowards == "Accounts") {
      this.modeOfPayments = [{ Id: "Cash", Name: "Cash" }];
    } else {
      this.modeOfPayments = [
        { Id: "Cheque", Name: "Cheque" },
        { Id: "Cash", Name: "Cash" },
        { Id: "RTGS", Name: "RTGS" },
        { Id: "NEFT", Name: "NEFT" },
        { Id: "IMPS", Name: "IMPS" },
        { Id: "UPI", Name: "UPI" },
        { Id: "Card", Name: "Card" },
        { Id: "Online", Name: "Online" },
      ];
    }

    // this.SRForm_1.get('Mode_Of_Payment').updateValueAndValidity();
  }

  SelectPaymentMode() {
    var paymentMode = this.SRForm_1.value["PaymentMode"][0].Id;

    if (paymentMode == "Cheque") {
      this.SRForm_1.get("Cheque_Payment_Recipt").setValidators([
        Validators.required,
      ]);
      this.SRForm_1.get("ChequeNumber").setValidators([Validators.required]);

      this.chequenofiledShow = true;
    } else {
      this.SRForm_1.get("ChequeNumber").setValidators(null);
      this.SRForm_1.get("Cheque_Payment_Recipt").setValidators(null);
      this.chequenofiledShow = false;
    }

    this.SRForm_1.get("ChequeNumber").updateValueAndValidity();
    this.SRForm_1.get("Cheque_Payment_Recipt").updateValueAndValidity();
  }

  soon() {
    alert("Coming Soon");
  }

  
}
