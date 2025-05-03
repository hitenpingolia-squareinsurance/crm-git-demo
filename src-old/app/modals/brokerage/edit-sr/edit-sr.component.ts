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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { BmsapiService } from "../../../providers/bmsapi.service";
import * as $ from "jquery";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "app-edit-sr",
  templateUrl: "./edit-sr.component.html",
  styleUrls: ["./edit-sr.component.css"],
})
export class EditSrComponent implements OnInit {
  SR_Id: any = 0;
  Step_Id: any = 0;
  StepData: any = [];

  Form_1: any = 1;
  Form_2: any = 0;
  Form_3: any = 0;
  Form_4: any = 0;
  Form_5: any = 0;
  Form_6: any = 0;

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

  Brokers_Ar: any;
  Franchisee_Ar: any;
  RM_Ar: any = [];
  Agents_Ar: any;
  Fleets_Ar: any;
  LOB_Ar: any;
  Segment_Ar: any;
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

  IsSeatingCapcityEdit: string = "0";

  dropdownSettings: any = {};
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
  Other: File;
  PolicyPDF: File;

  AadharCardFront: File;
  AadharCardBack: File;
  PanCard: File;
  Photo: File;
  CancelCheque: File;
  IncomeProof: File;
  ITR: File;

  dateFlag: any = 0;

  maxDate = new Date();
  minDate = new Date();

  LI_Product_Types: any;
  Terms: any = [];

  showDetails_0: any = 1;
  showDetails_1: any = 0;
  showDetails_2: any = 0;
  showDetails_3: any = 0;
  showDetails_4: any = 0;
  showDetails_5: any = 0;
  showDetails_6: any = 0;

  selectedValue: any;
  searchTxt: string = "";

  constructor(
    public dialogRef: MatDialogRef<EditSrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: BmsapiService,
    private router: Router,

    private activatedRoute: ActivatedRoute
  ) {
    this.SRForm_1 = this.formBuilder.group({
      Broker_Id: ["1"],
      RM_Id: [""],
      Franchise_Id: [""],
      Agent_Id: ["", [Validators.required]],
      Fleet_Id: [""],

      LOB_Id: ["", [Validators.required]],
      File_Type: [""],
      Insurer_Renewal: [""],
      PA_Owner: [""],
      PA_Owner_Tenure: [""],
      Mandate_Status: [""],

      Class_Id: [""],
      Sub_Class_Id: [""],
      Segment_Id: [""],
      Product_Id: [""],
      SubProduct_Id: [""],

      Make_Id: [""],
      Model_Id: [""],
      Variant_Id: [""],

      Body_Type: [""],
      Fuel_Type: [""],

      Seating_Capcity: [""],
      GVW_CC: [""],

      Vehicle_Type: [""],

      Registration_State_Code: [
        "",
        [
          Validators.pattern("[a-zA-Z ]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      Registration_District_Code: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      Registration_City_Code: [
        "",
        [Validators.pattern("^$|^[A-Za-z0-9]+"), Validators.maxLength(3)],
      ],
      Registration_Code: [
        "",
        [
          Validators.pattern("^^[0-9]*$"),
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],

      Engine_No: [
        "",
        [
          Validators.pattern("^[a-zA-Z0-9]+$"),
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      Chasis_No: [
        "",
        [
          Validators.pattern("^[a-zA-Z0-9]+$"),
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],

      Purchase_Date: [""],
      Manufacture_Year: ["", [Validators.pattern("^[0-9]*$")]],

      LI_Proposer_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      LI_Life_Assured_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      LI_Mother_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      LI_Father_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      LI_DOB: [""],
      LI_Gender: [""],
      LI_Marital_Status: [""],
      LI_Health_Status: [""],
      LI_Diseases_Remark: [""],

      LI_PlaceOf_Birth: [""],
      LI_Permanent_Address: [""],
      LI_Communication_Address: [""],
      LI_Contact_No: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      LI_Email_Id: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],
      LI_Aadhar_No: [
        "",
        [Validators.pattern("^[0-9]*$"), Validators.minLength(12)],
      ],
      LI_PAN_No: [
        "",
        [
          Validators.pattern(
            "^([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([0-9]([0-9]([0-9]([0-9]([a-zA-Z])?)?)?)?)?)?)?)?)?)?$"
          ),
          Validators.minLength(10),
        ],
      ],
      LI_Occupation: [""],
      LI_Company_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      LI_Industry_Type: [""],
      LI_CTC: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      LI_Qualification: [""],
      LI_Height: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(3),
        ],
      ],
      LI_Weight: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(3),
        ],
      ],
      LI_Visible_Marks: [""],
      LI_Nominee_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      LI_Nominee_DOB: [""],
      LI_Relationship_With_LA: [""],
      LI_Appointee_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],

      LI_Father_Age: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      LI_Father_Health_Status: [""],
      LI_Father_Health_Remark: [""],

      LI_Mother_Age: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      LI_Mother_Health_Status: [""],
      LI_Mother_Health_Remark: [""],

      LI_Spouse_Age: [
        "",
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      LI_Spouse_Health_Status: [""],
      LI_Spouse_Health_Remark: [""],

      LI_Family_Health_Status_Borthers: this.formBuilder.array([]),
      LI_Family_Health_Status_Sisters: this.formBuilder.array([]),
      LI_Family_Health_Status_Sons: this.formBuilder.array([]),
      LI_Family_Health_Status_Daughters: this.formBuilder.array([]),

      LI_Answer_1: [""],
      LI_Answer_2: [""],
      LI_Answer_3: [""],
      LI_Answer_4: [""],
      LI_Answer_5: [""],
      LI_Answer_6: [""],
      LI_Answer_7: [""],
      LI_Answer_8: [""],
    });

    this.SRForm_2 = this.formBuilder.group({
      State_Id: [""],
      RTO_Id: [""],
      Insurance_Company_Id: ["", [Validators.required]],
      Insurance_Company_Branch_Id: ["", [Validators.required]],
      Company_Branch_Address: [""],

      Insured_Type: ["Individual"],
      Salutation_Type: [""],

      Customer_Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      Customer_Mobile: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Customer_Alternate_Mobile: ["", [Validators.pattern("^[0-9]*$")]],
      Customer_Email: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],

      Policy_Tenure: [""],
      Policy_Start_Date_OD: [""],
      Policy_End_Date_OD: [""],
      Policy_Start_Date_TP: [""],
      Policy_End_Date_TP: [""],
      Policy_Status: [""],
      Policy_No: [""],
      Policy_Booking_Date: [""],

      LI_Product_Type: [""],
      LI_Product_Id: [""],
    });

    this.SRForm_3 = this.formBuilder.group({
      DontKnowStatus: ["No"],
      Pre_Insurer_Name: [""],
      Pre_Policy_No: [""],
      Pre_Expiry_Date: [""],

      LI_Existing_Sum_Assured: [""],
      LI_Previous_Companies: this.formBuilder.array([]),

      //LI_Pre_Insurance_Company_Id: [''],
      //LI_Pre_Net_Premium: [''],
      //LI_Sum_Assured_Premium: [''],
    });

    this.SRForm_4 = this.formBuilder.group({
      Payment_Towards: [""],
      Mode_Of_Payment: [""],
      Payment_Cheque_Ref_No: [""],
      Payout_Mode: [""],

      TPPD: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],

      Basic_OD: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Basic_TP: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Other_TP: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      PA_Owner_Premium: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Net_Premium: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Estimated_Gross_Premium: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],

      IDV: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      NCB: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Discount: [
        "",
        [Validators.pattern("^[0-9]*.?[0-9]*$"), Validators.maxLength(2)],
      ],

      Terrorism_Premium: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Sum_Insured: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],

      LI_Policy_Term: [""],
      LI_Payment_Type: [""],
      LI_Payment_Term: [""],
      LI_Payment_Mode: [""],
      LI_Net_Premium: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      LI_Gross_Premium: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      LI_Proposed_Sum_Assured: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
    });
    this.SRForm_5 = this.formBuilder.group({
      RC_Motor_Registraion_Front: [""],
      RC_Motor_Registraion_Back: [""],
      Previous_Policy_Copy: [""],
      Cheque_Payment_Recipt: [""],
      Mandate_Letter: [""],
      Invoice: [""],
      Renewal_Notice: [""],
      Other: [""],
      PolicyPDF: [""],

      AadharCardFront: [""],
      AadharCardBack: [""],
      PanCard: [""],
      Photo: [""],
      CancelCheque: [""],
      IncomeProof: [""],
      ITR: [""],
    });

    this.SRForm_6 = this.formBuilder.group({
      SR_Status: [""],
      Remark: [""],
      Booking_Date: [""],
      Policy_No: [""],
    });

    this.dropdownSettings = {
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
  }

  ngOnInit() {
    //this.SR_Id = this.activatedRoute.snapshot.paramMap.get('Id');

    this.SR_Id = this.data.Id;
    //// console.log(this.SR_Id);

    // console.log(this.SR_Id);
    if (this.SR_Id === null || typeof this.SR_Id === "undefined") {
      this.SR_Id = 0;
    }

    this.GetComponents("Form_1");

    this.addBrother();
    this.addSister();
    this.addSon();
    this.addDaughter();
    this.addPrevious_Company(); //LI

    this.SubmitStep_I();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetRegistrionNo(e, Type) {
    //// console.log(e.target.value);
    if (Type == 1) {
      var code1 = this.SRForm_1.get("Registration_State_Code").value;
      if (code1.length == 2) {
        document.getElementById("Registration_District_Code").focus();
      }
    }
    if (Type == 2) {
      var code2 = this.SRForm_1.get("Registration_District_Code").value;
      if (code2.length == 2) {
        document.getElementById("Registration_City_Code").focus();
      }
    }
    if (Type == 3) {
      var code3 = this.SRForm_1.get("Registration_City_Code").value;
      if (code3.length == 3) {
        document.getElementById("Registration_Code").focus();
      }
    }
  }

  /*Brother*/
  LI_Family_Health_Status_Brother(): FormArray {
    return this.SRForm_1.get("LI_Family_Health_Status_Borthers") as FormArray;
  }
  newBrother(): FormGroup {
    return this.formBuilder.group({
      Type: "Brother",
      Age: "",
      Status: "",
      Remark: "",
    });
  }
  addBrother() {
    this.LI_Family_Health_Status_Brother().push(this.newBrother());
  }

  removeBrother(i: number) {
    this.LI_Family_Health_Status_Brother().removeAt(i);
  }
  /*Brother*/

  /*Sister*/
  LI_Family_Health_Status_Sister(): FormArray {
    return this.SRForm_1.get("LI_Family_Health_Status_Sisters") as FormArray;
  }
  newSister(): FormGroup {
    return this.formBuilder.group({
      Type: "Sister",
      Age: "",
      Status: "",
      Remark: "",
    });
  }
  addSister() {
    this.LI_Family_Health_Status_Sister().push(this.newSister());
  }

  removeSister(i: number) {
    this.LI_Family_Health_Status_Sister().removeAt(i);
  }
  /*Sister*/

  /*Son*/
  LI_Family_Health_Status_Son(): FormArray {
    return this.SRForm_1.get("LI_Family_Health_Status_Sons") as FormArray;
  }
  newSon(): FormGroup {
    return this.formBuilder.group({
      Type: "Son",
      Age: "",
      Status: "",
      Remark: "",
    });
  }
  addSon() {
    this.LI_Family_Health_Status_Son().push(this.newSon());
  }

  removeSon(i: number) {
    this.LI_Family_Health_Status_Son().removeAt(i);
  }
  /*Son*/

  /*Daughter*/
  LI_Family_Health_Status_Daughter(): FormArray {
    return this.SRForm_1.get("LI_Family_Health_Status_Daughters") as FormArray;
  }
  newDaughter(): FormGroup {
    return this.formBuilder.group({
      Type: "Daughter",
      Age: "",
      Status: "",
      Remark: "",
    });
  }
  addDaughter() {
    this.LI_Family_Health_Status_Daughter().push(this.newDaughter());
  }

  removeDaughter(i: number) {
    this.LI_Family_Health_Status_Daughter().removeAt(i);
  }
  /*Daughter*/

  /*LI Previous_Companies*/
  LI_Previous_CompaniesFN(): FormArray {
    return this.SRForm_3.get("LI_Previous_Companies") as FormArray;
  }
  newPrevious_Company(): FormGroup {
    return this.formBuilder.group({
      Company_Id: "",
      Net_Premium: "",
      Sum_Assured_Premium: "",
    });
  }
  addPrevious_Company() {
    this.LI_Previous_CompaniesFN().push(this.newPrevious_Company());
  }

  removePrevious_Company(i: number) {
    this.LI_Previous_CompaniesFN().removeAt(i);
  }
  /*LI Previous_Companies*/

  ViewStep(Form_No) {
    if (Form_No == 1) {
      this.Form_1 = 1;
      this.Form_2 = 0;
      this.Form_3 = 0;
      this.Form_4 = 0;
      this.Form_5 = 0;
      this.Form_6 = 0;

      if (this.Step_Id != 0 && this.StepData["Form_Status_1"] == 1) {
        // console.log(this.StepData['Form_1']);
        this.SRForm_1.patchValue(this.StepData["Form_1"]);
      }
    }
    if (Form_No == 2) {
      this.Form_1 = 0;
      this.Form_2 = 1;
      this.Form_3 = 0;
      this.Form_4 = 0;
      this.Form_5 = 0;
      this.Form_6 = 0;

      if (this.Step_Id != 0 && this.StepData["Form_Status_2"] == 1) {
        // console.log(this.StepData['Form_2']);
        this.SRForm_2.patchValue(this.StepData["Form_2"]);
      } else {
      }

      this.dateFlag = 1;
    }
    if (Form_No == 3) {
      this.Form_1 = 0;
      this.Form_2 = 0;
      this.Form_3 = 1;
      this.Form_4 = 0;
      this.Form_5 = 0;
      this.Form_6 = 0;

      if (this.Step_Id != 0 && this.StepData["Form_Status_3"] == 1) {
        this.SRForm_3.patchValue(this.StepData["Form_3"]);
      } else {
      }
    }
    if (Form_No == 4) {
      this.Form_1 = 0;
      this.Form_2 = 0;
      this.Form_3 = 0;
      this.Form_4 = 1;
      this.Form_5 = 0;
      this.Form_6 = 0;

      if (this.Step_Id != 0 && this.StepData["Form_Status_4"] == 1) {
        this.SRForm_4.patchValue(this.StepData["Form_4"]);
      } else {
      }
    }
    if (Form_No == 5) {
      this.Form_1 = 0;
      this.Form_2 = 0;
      this.Form_3 = 0;
      this.Form_4 = 0;
      this.Form_5 = 1;
      this.Form_6 = 0;

      if (this.Step_Id != 0 && this.StepData["Form_Status_5"] == 1) {
        //this.SRForm_5.patchValue(this.StepData['Form_5']);
      } else {
      }
    }
    if (Form_No == 6) {
      this.Form_1 = 0;
      this.Form_2 = 0;
      this.Form_3 = 0;
      this.Form_4 = 0;
      this.Form_5 = 0;
      this.Form_6 = 1;

      if (this.Step_Id != 0 && this.StepData["Form_Status_5"] == 1) {
        this.SRForm_6.patchValue(this.StepData["Form_6"]);
      } else {
      }
    }
  }

  get FC_1() {
    return this.SRForm_1.controls;
  }
  get FC_2() {
    return this.SRForm_2.controls;
  }
  get FC_3() {
    return this.SRForm_3.controls;
  }
  get FC_4() {
    return this.SRForm_4.controls;
  }
  get FC_5() {
    return this.SRForm_5.controls;
  }
  get FC_6() {
    return this.SRForm_6.controls;
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
        "SR/FormComponents?Source=BMS&Type=" +
          type +
          "&User_Code=" +
          this.api.GetUserData("Emp_Id") +
          "&SR_Id=" +
          this.SR_Id,
        ""
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == 1) {
            //this.api.Toast('Success',result['Message']);

            this.Brokers_Ar = result["Data"]["Brokers"];
            this.LOB_Ar = result["Data"]["LOB"];
            this.RM_Ar = result["Data"]["RM"];

            this.User_Rights = result["Data"]["SR_User_Rights"];
            this.User_Data = result["Data"]["User_Data"];

            if (
              this.User_Rights.Is_Operation == 0 &&
              this.User_Rights.Underwriter_Motor == 0 &&
              this.User_Rights.Underwriter_Non_Motor == 0 &&
              this.User_Rights.Underwriter_Health == 0 &&
              this.User_Rights.Is_Sales_Support == 0
            ) {
              //this.SRForm_1.get('RM_Id').setValue(this.RM_Ar);
              //this.SRForm_1.get('RM_Id').disable();
              //this.SRForm_1.get('RM_Id').updateValueAndValidity();

              //this.SRForm_1.get('Broker_Id').setValue('1');
              //this.SRForm_1.get('Broker_Id').disable();
              //this.SRForm_1.get('Broker_Id').updateValueAndValidity();

              //this.SRForm_1.get('Fleet_Id').setValue([{Id:0,Name:'None'}]);
              //this.SRForm_1.get('Fleet_Id').disable();
              //this.SRForm_1.get('Fleet_Id').updateValueAndValidity();

              //this.disabled = true;
              this.Get_Agents(this.RM_Ar[0]["Id"]);
            }

            this.StepData = result["Data"]["StepData"];
            if (this.SR_Id != 0) {
              var LOB_Id = this.StepData["LOB_Id"];
              if (LOB_Id == "Motor") {
                this.File_Type_Ar = ["New", "Used", "Rollover", "Renewal"];
                //this.Broker_Id = 0;
              } else if (LOB_Id == "Health") {
                this.File_Type_Ar = ["Fresh", "Renewal", "Port"];
                //this.Broker_Id = 1;
              } else if (LOB_Id == "Non Motor") {
                this.File_Type_Ar = ["Fresh", "Renewal", "Rollover"];
                //this.Broker_Id = 1;
              } else if (LOB_Id == "LI") {
                for (var i = 3; i <= 100; i++) {
                  this.Terms.push(i);
                }
              }

              this.Step_Id = this.StepData["Id"];

              this.Ins_Companies_Ar = result["Data"]["Companies_Ar"];
              this.States_Ar = result["Data"]["States_Ar"];

              this.RTO({ Id: this.StepData["State_Id"] });

              this.Ins_Companies_Branch({
                value: this.StepData["Insurance_Company_Id"],
              });
              this.Get_Agents(this.StepData["RM_Id"]);
              this.GetFleetsBy_AgentId(this.StepData["Agent_Id"]);

              //this.Products(this.StepData['File_Type'],LOB_Id,1);
              //this.SubProducts(this.StepData['Product_Id']);

              this.Products_Ar = result["Data"]["Products_Ar"];
              this.SubProducts_Ar = result["Data"]["SubProducts_Ar"];
              this.Segment_Ar = result["Data"]["Segment_Ar"];
              this.Classes_Ar = result["Data"]["Classes_Ar"];
              this.Sub_Classes_Ar = result["Data"]["Sub_Classes_Ar"];
              this.Make_Ar = result["Data"]["Make_Ar"];
              this.Models_Ar = result["Data"]["Models_Ar"];
              this.Variants_Ar = result["Data"]["Variants_Ar"];

              this.ViewStep(1);
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
    }
  }

  onItemSelect(item: any, Type) {
    // console.log(Type);
    // console.log(item);

    var Id = item.value;
    if (Type == "RM") {
      this.Get_Agents(Id);
    }
    if (Type == "Agent") {
      this.GetFleetsBy_AgentId(Id);
    }
    if (Type == "Product") {
      this.SubProducts(Id);
    }
    if (Type == "SubProduct") {
      this.Segments(Id);
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

            if (result["Is_Check_Agent"]["Status"] == true) {
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

  File_Types(e: any) {
    const LOB_Id = e.value; // this.SRForm_1.value['LOB_Id'];

    this.SRForm_1.get("File_Type").setValue(null);
    this.SRForm_1.get("Product_Id").setValue(null);
    this.SRForm_1.get("SubProduct_Id").setValue(null);
    this.SRForm_1.get("Segment_Id").setValue(null);
    this.SRForm_1.get("Class_Id").setValue(null);
    this.SRForm_1.get("Sub_Class_Id").setValue(null);
    this.SRForm_1.get("Make_Id").setValue(null);
    this.SRForm_1.get("Model_Id").setValue(null);
    this.SRForm_1.get("Variant_Id").setValue(null);
    this.SRForm_1.get("Seating_Capcity").setValue(null);
    this.SRForm_1.get("GVW_CC").setValue(null);

    if (LOB_Id == "Motor") {
      this.File_Type_Ar = ["New", "Used", "Rollover", "Renewal"];
      //this.Broker_Id = 0;
    } else if (LOB_Id == "Health") {
      this.File_Type_Ar = ["Fresh", "Renewal", "Port"];
      //this.Broker_Id = 1;
    } else if (LOB_Id == "Non Motor") {
      this.File_Type_Ar = ["Fresh", "Renewal", "Rollover"];
      //this.Broker_Id = 1;
    } else if (LOB_Id == "LI") {
      for (var i = 3; i <= 100; i++) {
        this.Terms.push(i);
      }
    }
  }

  Products(e: any, LOB: any, type: any) {
    this.SRForm_1.get("Product_Id").setValue(null);
    this.SRForm_1.get("SubProduct_Id").setValue(null);
    this.SRForm_1.get("Segment_Id").setValue(null);
    this.SRForm_1.get("Class_Id").setValue(null);
    this.SRForm_1.get("Sub_Class_Id").setValue(null);
    this.SRForm_1.get("Make_Id").setValue(null);
    this.SRForm_1.get("Model_Id").setValue(null);
    this.SRForm_1.get("Variant_Id").setValue(null);
    this.SRForm_1.get("Seating_Capcity").setValue(null);
    this.SRForm_1.get("GVW_CC").setValue(null);

    if (type == 0) {
      var File_Type = e.value; //this.SRForm_1.value['File_Type'];
      var LOB_Id = this.SRForm_1.value["LOB_Id"];
    } else {
      var File_Type = e;
      var LOB_Id = LOB;
    }

    /*
		if(File_Type == 'Renewal' || File_Type == 'Rollover' ){
		   this.SRForm_1.get('Insurer_Renewal').disable();
		}else{
			this.SRForm_1.get('Insurer_Renewal').enable();
		}
		this.SRForm_1.get('Insurer_Renewal').updateValueAndValidity();
		*/

    this.api.IsLoading();
    this.api
      .HttpForSR(
        "get",
        "SR/Products?LOB_Id=" + LOB_Id + "&File_Type=" + File_Type,
        ""
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            if (LOB_Id == "Motor") {
              this.Products_Ar = [];
              this.SubProducts_Ar = [];
              this.Segment_Ar = [];
              this.Classes_Ar = [];
              this.Sub_Classes_Ar = [];

              this.Make_Ar = [];
              this.Models_Ar = [];
              this.Variants_Ar = [];

              this.Products_Ar = result["Data"];
            } else {
              this.Products_Ar = [];
              this.SubProducts_Ar = [];
              this.Segment_Ar = [];
              this.Classes_Ar = [];
              this.Sub_Classes_Ar = [];

              this.Make_Ar = [];
              this.Models_Ar = [];
              this.Variants_Ar = [];

              this.Segment_Ar = result["Data"];
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

  SubProducts(Product_Id) {
    const LOB_Id = this.SRForm_1.value["LOB_Id"];
    // const Product_Id = this.SRForm_1.value['Product_Id'];

    this.api.IsLoading();
    this.api
      .HttpForSR(
        "get",
        "SR/SubProducts?LOB_Id=" + LOB_Id + "&Product_Id=" + Product_Id,
        ""
      )
      .then(
        (result) => {
          this.api.HideLoading();

          this.SubProducts_Ar = [];
          this.Segment_Ar = [];
          this.Classes_Ar = [];
          this.Sub_Classes_Ar = [];

          this.Make_Ar = [];
          this.Models_Ar = [];
          this.Variants_Ar = [];

          if (result["Status"] == true) {
            this.SubProducts_Ar = result["Data"];

            this.SRForm_1.get("SubProduct_Id").setValue(null);
            this.SRForm_1.get("Segment_Id").setValue(null);
            this.SRForm_1.get("Class_Id").setValue(null);
            this.SRForm_1.get("Sub_Class_Id").setValue(null);
            this.SRForm_1.get("Make_Id").setValue(null);
            this.SRForm_1.get("Model_Id").setValue(null);
            this.SRForm_1.get("Variant_Id").setValue(null);
            this.SRForm_1.get("Body_Type").setValue(null);
            this.SRForm_1.get("Fuel_Type").setValue(null);
            this.SRForm_1.get("Seating_Capcity").setValue(null);
            this.SRForm_1.get("GVW_CC").setValue(null);
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

  Segments(item: any) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);
    formData.append("SubProduct_Id", item.value);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Segments", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Classes_Ar = [];
        this.Sub_Classes_Ar = [];

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        this.SRForm_1.get("Segment_Id").setValue(null);
        this.SRForm_1.get("Class_Id").setValue(null);
        this.SRForm_1.get("Sub_Class_Id").setValue(null);
        this.SRForm_1.get("Make_Id").setValue(null);
        this.SRForm_1.get("Model_Id").setValue(null);
        this.SRForm_1.get("Variant_Id").setValue(null);
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue(null);
        this.SRForm_1.get("GVW_CC").setValue(null);
        this.SRForm_1.get("GVW_CC").setValue(null);

        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"];
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

  Classes(item: any) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm_1.value["SubProduct_Id"]);
    formData.append("Segment_Id", item.value);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Classes", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Sub_Classes_Ar = [];

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        this.SRForm_1.get("Class_Id").setValue(null);
        this.SRForm_1.get("Sub_Class_Id").setValue(null);
        this.SRForm_1.get("Make_Id").setValue(null);
        this.SRForm_1.get("Model_Id").setValue(null);
        this.SRForm_1.get("Variant_Id").setValue(null);
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue(null);

        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"];
        } else {
          this.api.Toast("Info", result["Message"]);
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

  Sub_Classes(e: any) {
    const Class_Id = this.SRForm_1.value["Class_Id"];

    if (Class_Id == "Public Carrier" || Class_Id == "Private Carrier") {
      //this.Vehicle_Type = 'GCV';
    } else {
      //this.Vehicle_Type = 'Other';
    }

    if (
      Class_Id == "Passenger Carrying Vehicles" ||
      Class_Id == "Two Wheeler" ||
      Class_Id == "Private Cars"
    ) {
      this.IsSeatingCapcityEdit = "1";
    } else {
      this.IsSeatingCapcityEdit = "0";
    }

    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm_1.value["SubProduct_Id"]);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"]);
    formData.append("Class_Id", Class_Id);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Sub_Classes", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        this.SRForm_1.get("Sub_Class_Id").setValue(null);
        this.SRForm_1.get("Make_Id").setValue(null);
        this.SRForm_1.get("Model_Id").setValue(null);
        this.SRForm_1.get("Variant_Id").setValue(null);
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue(null);

        if (result["Status"] == true) {
          this.Sub_Classes_Ar = result["Data"];
          this.Make_Ar = result["Make"];
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

    formData.append("Sub_Class_Id", this.SRForm_1.value["Sub_Class_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Make", formData).then(
      (result) => {
        this.api.HideLoading();

        //if(type==0){
        //this.SRForm_1.get('Make_Id').setValue(null);
        this.SRForm_1.get("Model_Id").setValue(null);
        this.SRForm_1.get("Variant_Id").setValue(null);
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue(null);

        this.Models_Ar = [];
        this.Variants_Ar = [];
        //}
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

  Model(e: any) {
    const formData = new FormData();

    formData.append("Sub_Class_Id", this.SRForm_1.value["Sub_Class_Id"]);
    formData.append("Make_Id", this.SRForm_1.value["Make_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Models", formData).then(
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

  Variant(e: any) {
    const formData = new FormData();

    formData.append("Class_Id", this.SRForm_1.value["Class_Id"]);
    formData.append("Make_Id", this.SRForm_1.value["Make_Id"]);
    formData.append("Model_Id", this.SRForm_1.value["Model_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/Variants", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SRForm_1.get("Variant_Id").setValue("");
        this.SRForm_1.get("Body_Type").setValue(null);
        this.SRForm_1.get("Fuel_Type").setValue(null);
        this.SRForm_1.get("Seating_Capcity").setValue("");

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
  GetBody_Fuel_Type(e, type) {
    const formData = new FormData();

    formData.append("Make_Id", this.SRForm_1.value["Make_Id"]);
    formData.append("Model_Id", this.SRForm_1.value["Model_Id"]);
    formData.append("Variant_Id", this.SRForm_1.value["Variant_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/GetBody_Fuel_Type", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.SRForm_1.get("Body_Type").setValue(result["Data"]["Body_Type"]);
          this.SRForm_1.get("Fuel_Type").setValue(result["Data"]["Fuel_Type"]);
          this.SRForm_1.get("Seating_Capcity").setValue(
            result["Data"]["Seating_Capcity"]
          );
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
        } else {
          this.Ins_Branch_Companies_Ar = [];
          this.LI_Product_Types = result["LI_Product_Types"];
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

  // Non Motor Functions Start

  NM_Classess(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/NM_Classess", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Classes_Ar = [];
        this.Products_Ar = [];
        this.SubProducts_Ar = [];

        this.SRForm_1.get("Class_Id").setValue("");
        this.SRForm_1.get("Product_Id").setValue("");
        this.SRForm_1.get("SubProduct_Id").setValue("");

        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"];
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
  NM_Products(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"]);
    formData.append("Class_Id", this.SRForm_1.value["Class_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/NM_Products", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Products_Ar = [];
        this.SubProducts_Ar = [];

        this.SRForm_1.get("Product_Id").setValue("");
        this.SRForm_1.get("SubProduct_Id").setValue("");

        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
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
  NM_SubProducts(e, type) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm_1.value["LOB_Id"]);
    formData.append("Segment_Id", this.SRForm_1.value["Segment_Id"]);
    formData.append("Class_Id", this.SRForm_1.value["Class_Id"]);
    formData.append("Product_Id", this.SRForm_1.value["Product_Id"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "SR/NM_SubProducts", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SubProducts_Ar = [];

        this.SRForm_1.get("SubProduct_Id").setValue("");

        if (result["Status"] == true) {
          this.SubProducts_Ar = result["Data"];
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
  // Non Motor Functions End

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

        // console.log(Total_Size+ ' kb');

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
          if (Type == "Mandate_Letter") {
            this.SRForm_5.get("Mandate_Letter").setValue("");
          }
          if (Type == "Invoice") {
            this.SRForm_5.get("Invoice").setValue("");
          }
          if (Type == "Renewal_Notice") {
            this.SRForm_5.get("Renewal_Notice").setValue("");
          }
          if (Type == "Other") {
            this.SRForm_5.get("Other").setValue("");
          }
          if (Type == "PolicyPDF") {
            this.SRForm_5.get("PolicyPDF").setValue("");
          }

          if (Type == "AadharCardFront") {
            this.SRForm_5.get("AadharCardFront").setValue("");
          }
          if (Type == "AadharCardBack") {
            this.SRForm_5.get("AadharCardBack").setValue("");
          }
          if (Type == "PanCard") {
            this.SRForm_5.get("PanCard").setValue("");
          }
          if (Type == "Photo") {
            this.SRForm_5.get("Photo").setValue("");
          }
          if (Type == "CancelCheque") {
            this.SRForm_5.get("CancelCheque").setValue("");
          }
          if (Type == "IncomeProof") {
            this.SRForm_5.get("IncomeProof").setValue("");
          }
          if (Type == "ITR") {
            this.SRForm_5.get("ITR").setValue("");
          }
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
          if (Type == "Other") {
            this.Other = this.selectedFiles;
          }
          if (Type == "PolicyPDF") {
            this.PolicyPDF = this.selectedFiles;
          }

          if (Type == "AadharCardFront") {
            this.AadharCardFront = this.selectedFiles;
          }
          if (Type == "AadharCardBack") {
            this.AadharCardBack = this.selectedFiles;
          }
          if (Type == "PanCard") {
            this.PanCard = this.selectedFiles;
          }
          if (Type == "Photo") {
            this.Photo = this.selectedFiles;
          }
          if (Type == "CancelCheque") {
            this.CancelCheque = this.selectedFiles;
          }
          if (Type == "IncomeProof") {
            this.IncomeProof = this.selectedFiles;
          }
          if (Type == "ITR") {
            this.ITR = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

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
        if (Type == "Mandate_Letter") {
          this.SRForm_5.get("Mandate_Letter").setValue("");
        }
        if (Type == "Invoice") {
          this.SRForm_5.get("Invoice").setValue("");
        }
        if (Type == "Renewal_Notice") {
          this.SRForm_5.get("Renewal_Notice").setValue("");
        }
        if (Type == "Other") {
          this.SRForm_5.get("Other").setValue("");
        }
        if (Type == "PolicyPDF") {
          this.SRForm_5.get("PolicyPDF").setValue("");
        }

        if (Type == "AadharCardFront") {
          this.SRForm_5.get("AadharCardFront").setValue("");
        }
        if (Type == "AadharCardBack") {
          this.SRForm_5.get("AadharCardBack").setValue("");
        }
        if (Type == "PanCard") {
          this.SRForm_5.get("PanCard").setValue("");
        }
        if (Type == "Photo") {
          this.SRForm_5.get("Photo").setValue("");
        }
        if (Type == "CancelCheque") {
          this.SRForm_5.get("CancelCheque").setValue("");
        }
        if (Type == "IncomeProof") {
          this.SRForm_5.get("IncomeProof").setValue("");
        }
        if (Type == "ITR") {
          this.SRForm_5.get("ITR").setValue("");
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

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
        } else {
          //upload and save

          const formData = new FormData();

          formData.append("Step_Id", this.Step_Id);
          formData.append("Source", "BMS");
          formData.append("User_Id", this.api.GetUserId());
          formData.append("LOB_Id", this.StepData["LOB_Id"]);
          formData.append("User_Code", this.api.GetUserData("Emp_Id"));

          formData.append(Type, this.selectedFiles);

          this.api.IsLoading();
          this.api.HttpForSR("post", "Submit/Re_Upload_Docs", formData).then(
            (result) => {
              this.api.HideLoading();

              if (result["Status"] == true) {
                this.StepData = result["StepData"];
                //this.ViewStep(6);

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

  AddDaysInCurrentDate(selectedDate, Days) {
    var d = new Date(selectedDate);
    d.setDate(d.getDate() + Number(Days));
    var AddDays_Date =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    return AddDays_Date;
  }

  ChangeDates(e: any, Type) {
    // console.log(e);

    //const date1 = new Date('7/13/2010');
    //const date2 = new Date('12/15/2010');
    //const diffTime = Math.abs(date2 - date1);
    //const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //// console.log(diffTime + " milliseconds");
    //// console.log(diffDays + " days");

    if (Type == "Purchase_Date") {
      //alert('dd');
      const Manufacture_Year_Control = this.SRForm_1.get("Manufacture_Year");
      var d = new Date(e);
      var Manufacture_Year = d.getFullYear();
      if (Manufacture_Year != 1970) {
        Manufacture_Year_Control.setValue(Manufacture_Year);
        Manufacture_Year_Control.updateValueAndValidity();
      }
    } else if (Type == "Policy_Start_Date_OD") {
      const Policy_End_Date_OD_Control =
        this.SRForm_2.get("Policy_End_Date_OD");
      var selectedDate = new Date(e);
      var Year = selectedDate.getFullYear();
      if (Year != 1970) {
        Policy_End_Date_OD_Control.setValue(
          this.AddDaysInCurrentDate(selectedDate, this.StepData["OD_Days"])
        );
        Policy_End_Date_OD_Control.updateValueAndValidity();
      }
    } else if (Type == "Policy_Start_Date_TP") {
      const Policy_End_Date_TP_Control =
        this.SRForm_2.get("Policy_End_Date_TP");
      var selectedDate = new Date(e);
      var Year = selectedDate.getFullYear();
      if (Year != 1970) {
        var totalAddDays = -1;
        if (this.StepData["Policy_Tenure"] != 0) {
          var Tenure = this.SRForm_2.get("Policy_Tenure").value;
          for (var i = 0; i < Tenure; i++) {
            totalAddDays += this.Days(i);
          }
        } else {
          totalAddDays = this.StepData["TP_Days"];
        }
        // console.log(totalAddDays);
        //// console.log(totalAddDays-1);

        Policy_End_Date_TP_Control.setValue(
          this.AddDaysInCurrentDate(selectedDate, totalAddDays)
        );
        Policy_End_Date_TP_Control.updateValueAndValidity();
      }
    } else if (Type == "Policy_Booking_Date") {
      /*
			var selectedDate = new Date(e);
			var date2 = new Date();
			
			var Time = date2.getTime() - selectedDate.getTime(); 
			var diffDays = Time / (1000 * 3600 * 24); //Diference in Days
			// console.log(diffDays + " days");
			
			const Policy_Booking_Date_Control = this.SRForm_2.get('Policy_Booking_Date');
			
			if(selectedDate.getTime() >= date2.getTime()){

				Policy_Booking_Date_Control.setValue(null);//this.StepData['Booking_Date']
				Policy_Booking_Date_Control.updateValueAndValidity();
				this.api.Toast("Error","Booking Date Can't be greater than current date !");

			}
			if(diffDays >= 30){
				Policy_Booking_Date_Control.setValue(null);
				Policy_Booking_Date_Control.updateValueAndValidity();
				this.api.Toast("Error","Booking Date Can't be greater than 30 days !");
			}
			*/
    } else if (Type == "DOB" || Type == "Nominee_DOB") {
      var selecteddob = e; //.target.value;
      if (selecteddob != null) {
        // console.log(this.ageFromDateOfBirthday(selecteddob));
        if (this.ageFromDateOfBirthday(selecteddob) < 18) {
          if (Type == "Nominee_DOB") {
            const Nominee_DOB_Control = this.SRForm_1.get("LI_Nominee_DOB");
            Nominee_DOB_Control.setValue("");
            Nominee_DOB_Control.updateValueAndValidity();
          } else {
            const DOB_Control = this.SRForm_1.get("LI_DOB");
            DOB_Control.setValue("");
            DOB_Control.updateValueAndValidity();
          }

          this.api.Toast("Error", "Eligibility 18 years Only. !");
        } else {
        }
      }
    }
  }

  onChangePolicyTenure(e: any) {
    var Tenure = e.target.value;

    const Policy_Start_Date_TP_Control = this.SRForm_2.get(
      "Policy_Start_Date_TP"
    );
    const Policy_End_Date_TP_Control = this.SRForm_2.get("Policy_End_Date_TP");
    var selectedDate = new Date();

    var totalAddDays = -1;
    for (var i = 0; i < Tenure; i++) {
      totalAddDays += this.Days(i);
    }
    // console.log(totalAddDays);
    //// console.log(totalAddDays-1);

    Policy_Start_Date_TP_Control.setValue(
      this.AddDaysInCurrentDate(selectedDate, 0)
    );
    Policy_Start_Date_TP_Control.updateValueAndValidity();

    Policy_End_Date_TP_Control.setValue(
      this.AddDaysInCurrentDate(selectedDate, totalAddDays)
    );
    Policy_End_Date_TP_Control.updateValueAndValidity();
  }

  Days(month) {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    return new Date(year, month, 0).getDate();
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

  Previous(Form_No) {
    //alert(Form_No);
    //if(Form_No == 1){
    this.ViewStep(Form_No);

    //}
  }

  SubmitStep_I() {
    // console.log(this.SRForm_1.value);

    this.isSubmitted = true;
    if (this.SRForm_1.invalid) {
      return;
    } else {
      var fields = this.SRForm_1.value;
      const formData = new FormData();

      formData.append("Step_Id", this.Step_Id);
      formData.append("Source", "BMS");
      formData.append("SR_Id", this.SR_Id);
      formData.append("User_Id", this.api.GetUserId());
      formData.append("User_Code", this.api.GetUserData("Emp_Id"));

      formData.append("Broker_Id", fields["Broker_Id"]);
      formData.append("RM_Id", fields["RM_Id"]);
      formData.append("Franchise_Id", fields["Franchise_Id"]);
      formData.append("Agent_Id", fields["Agent_Id"]);
      formData.append("Fleet_Id", fields["Fleet_Id"]);

      formData.append("LOB_Id", fields["LOB_Id"]);
      formData.append("File_Type", fields["File_Type"]);
      formData.append("Insurer_Renewal", fields["Insurer_Renewal"]);

      formData.append("Product_Id", fields["Product_Id"]);
      formData.append("SubProduct_Id", fields["SubProduct_Id"]);

      formData.append("Segment_Id", fields["Segment_Id"]);
      formData.append("Class_Id", fields["Class_Id"]);
      formData.append("Sub_Class_Id", fields["Sub_Class_Id"]);

      if (fields["LOB_Id"] == "Motor") {
        formData.append("PA_Owner", fields["PA_Owner"]);
        formData.append("PA_Owner_Tenure", fields["PA_Owner_Tenure"]);

        formData.append("Make_Id", fields["Make_Id"]);

        formData.append("Model_Id", fields["Model_Id"]);

        formData.append("Variant_Id", fields["Variant_Id"]);

        formData.append("Body_Type", fields["Body_Type"]);
        formData.append("Fuel_Type", fields["Fuel_Type"]);

        formData.append("Seating_Capcity", fields["Seating_Capcity"]);
        formData.append("GVW_CC", fields["GVW_CC"]);

        formData.append("Vehicle_Type", fields["Vehicle_Type"]);

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

        formData.append("Engine_No", fields["Engine_No"]);
        formData.append("Chasis_No", fields["Chasis_No"]);

        formData.append("Purchase_Date", fields["Purchase_Date"]);
        formData.append("Manufacture_Year", fields["Manufacture_Year"]);
      } else if (fields["LOB_Id"] == "Non Motor") {
        formData.append("Mandate_Status", fields["Mandate_Status"]);
      } else {
        formData.append("SubProduct_Id", "");
      }

      if (fields["LOB_Id"] == "LI") {
        formData.append("LI_Proposer_Name", fields["LI_Proposer_Name"]);
        formData.append("LI_Life_Assured_Name", fields["LI_Life_Assured_Name"]);
        formData.append("LI_Mother_Name", fields["LI_Mother_Name"]);
        formData.append("LI_Father_Name", fields["LI_Father_Name"]);
        formData.append("LI_DOB", fields["LI_DOB"]);
        formData.append("LI_Gender", fields["LI_Gender"]);
        formData.append("LI_Marital_Status", fields["LI_Marital_Status"]);
        formData.append("LI_Health_Status", fields["LI_Health_Status"]);
        formData.append("LI_Diseases_Remark", fields["LI_Diseases_Remark"]);

        formData.append("LI_PlaceOf_Birth", fields["LI_PlaceOf_Birth"]);
        formData.append("LI_Permanent_Address", fields["LI_Permanent_Address"]);
        formData.append(
          "LI_Communication_Address",
          fields["LI_Communication_Address"]
        );
        formData.append("LI_Contact_No", fields["LI_Contact_No"]);
        formData.append("LI_Email_Id", fields["LI_Email_Id"]);
        formData.append("LI_Aadhar_No", fields["LI_Aadhar_No"]);
        formData.append("LI_PAN_No", fields["LI_PAN_No"]);
        formData.append("LI_Occupation", fields["LI_Occupation"]);
        formData.append("LI_Company_Name", fields["LI_Company_Name"]);
        formData.append("LI_Industry_Type", fields["LI_Industry_Type"]);
        formData.append("LI_CTC", fields["LI_CTC"]);
        formData.append("LI_Qualification", fields["LI_Qualification"]);
        formData.append("LI_Height", fields["LI_Height"]);
        formData.append("LI_Weight", fields["LI_Weight"]);
        formData.append("LI_Visible_Marks", fields["LI_Visible_Marks"]);
        formData.append("LI_Nominee_Name", fields["LI_Nominee_Name"]);
        formData.append("LI_Nominee_DOB", fields["LI_Nominee_DOB"]);
        formData.append(
          "LI_Relationship_With_LA",
          fields["LI_Relationship_With_LA"]
        );
        formData.append("LI_Appointee_Name", fields["LI_Appointee_Name"]);

        formData.append(
          "LI_Family_Health_Status_Borthers",
          JSON.stringify(fields["LI_Family_Health_Status_Borthers"])
        );
        formData.append(
          "LI_Family_Health_Status_Sisters",
          JSON.stringify(fields["LI_Family_Health_Status_Sisters"])
        );
        formData.append(
          "LI_Family_Health_Status_Sons",
          JSON.stringify(fields["LI_Family_Health_Status_Sons"])
        );
        formData.append(
          "LI_Family_Health_Status_Daughters",
          JSON.stringify(fields["LI_Family_Health_Status_Daughters"])
        );

        formData.append("LI_Father_Age", fields["LI_Father_Age"]);
        formData.append(
          "LI_Father_Health_Status",
          fields["LI_Father_Health_Status"]
        );
        formData.append(
          "LI_Father_Health_Remark",
          fields["LI_Father_Health_Remark"]
        );

        formData.append("LI_Mother_Age", fields["LI_Mother_Age"]);
        formData.append(
          "LI_Mother_Health_Status",
          fields["LI_Mother_Health_Status"]
        );
        formData.append(
          "LI_Mother_Health_Remark",
          fields["LI_Mother_Health_Remark"]
        );

        formData.append("LI_Spouse_Age", fields["LI_Spouse_Age"]);
        formData.append(
          "LI_Spouse_Health_Status",
          fields["LI_Spouse_Health_Status"]
        );
        formData.append(
          "LI_Spouse_Health_Remark",
          fields["LI_Spouse_Health_Remark"]
        );

        formData.append("LI_Answer_1", fields["LI_Answer_1"]);
        formData.append("LI_Answer_2", fields["LI_Answer_2"]);
        formData.append("LI_Answer_3", fields["LI_Answer_3"]);
        formData.append("LI_Answer_4", fields["LI_Answer_4"]);
        formData.append("LI_Answer_5", fields["LI_Answer_5"]);
        formData.append("LI_Answer_6", fields["LI_Answer_6"]);
        formData.append("LI_Answer_7", fields["LI_Answer_7"]);
        formData.append("LI_Answer_8", fields["LI_Answer_8"]);
      }

      this.api.IsLoading();
      this.api.HttpForSR("post", "Submit/Step_I", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Step_Id = result["Step_Id"];
            this.StepData = result["StepData"];
            this.ViewStep(2);

            this.States_Ar = result["Data"]["States_Ar"];
            this.Ins_Companies_Ar = result["Data"]["Companies_Ar"];

            if (this.StepData["LOB_Id"] == "Motor") {
              this.SRForm_2.get("State_Id").setValidators([
                Validators.required,
              ]);
              this.SRForm_2.get("RTO_Id").setValidators([Validators.required]);
            } else {
              this.SRForm_2.get("State_Id").setValidators(null);
              this.SRForm_2.get("RTO_Id").setValidators(null);
            }

            this.SRForm_2.get("State_Id").updateValueAndValidity();
            this.SRForm_2.get("RTO_Id").updateValueAndValidity();

            if (this.StepData["LOB_Id"] == "Motor") {
              this.RTO({ Id: this.StepData["State_Id"] });
            }

            if (this.StepData["Is_Policy_OD"] == 4) {
              //this.SRForm_2.get('Policy_Start_Date_OD').setValue(this.StepData['Policy_Start_Date_OD']);
              //this.SRForm_2.get('Policy_End_Date_OD').setValue(this.StepData['Policy_End_Date_OD']);
              //this.SRForm_2.get('Policy_Start_Date_OD').updateValueAndValidity();
              //this.SRForm_2.get('Policy_End_Date_OD').updateValueAndValidity();
            }

            //this.SRForm_2.get('Policy_Start_Date_TP').setValue(this.StepData['Policy_Start_Date_TP']);
            //this.SRForm_2.get('Policy_End_Date_TP').setValue(this.StepData['Policy_End_Date_TP']);

            //this.SRForm_2.get('Policy_Booking_Date').setValue(this.StepData['Booking_Date']);

            //this.SRForm_2.get('Policy_Start_Date_TP').updateValueAndValidity();
            //this.SRForm_2.get('Policy_End_Date_TP').updateValueAndValidity();

            //this.SRForm_2.get('Policy_Booking_Date').updateValueAndValidity();
          } else {
            this.api.Toast("Error", result["Message"]);
            $("input[name='" + result["InputName"] + "']").focus();
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

  SubmitStep_II() {
    // console.log(this.SRForm_2.value);

    this.isSubmitted_2 = true;
    if (this.SRForm_2.invalid) {
      return;
    } else {
      var fields = this.SRForm_2.value;
      const formData = new FormData();

      formData.append("Step_Id", this.Step_Id);
      formData.append("Source", "BMS");
      formData.append("LOB_Id", this.StepData["LOB_Id"]);
      formData.append("User_Id", this.api.GetUserId());
      formData.append("User_Code", this.api.GetUserData("Emp_Id"));

      formData.append("Insurance_Company_Id", fields["Insurance_Company_Id"]);
      formData.append(
        "Insurance_Company_Branch_Id",
        fields["Insurance_Company_Branch_Id"]
      );
      formData.append(
        "Insurance_Company_Branch_Address",
        fields["Company_Branch_Address"]
      );

      if (
        this.StepData["LOB_Id"] == "Motor" ||
        this.StepData["LOB_Id"] == "Non Motor" ||
        this.StepData["LOB_Id"] == "Health"
      ) {
        if (this.StepData["LOB_Id"] == "Motor") {
          formData.append("State_Id", fields["State_Id"]);
          formData.append("RTO_Id", fields["RTO_Id"]);
        } else {
          formData.append("State_Id", "0");
          formData.append("RTO_Id", "0");
        }

        formData.append("Insured_Type", fields["Insured_Type"]);
        formData.append("Salutation_Type", fields["Salutation_Type"]);
        formData.append("Customer_Name", fields["Customer_Name"]);
        formData.append("Customer_Mobile", fields["Customer_Mobile"]);
        formData.append(
          "Customer_Alternate_Mobile",
          fields["Customer_Alternate_Mobile"]
        );
        formData.append("Customer_Email", fields["Customer_Email"]);

        formData.append("Policy_Tenure", fields["Policy_Tenure"]);

        formData.append("Policy_Start_Date_OD", fields["Policy_Start_Date_OD"]);
        formData.append("Policy_End_Date_OD", fields["Policy_End_Date_OD"]);

        formData.append("Policy_Start_Date_TP", fields["Policy_Start_Date_TP"]);
        formData.append("Policy_End_Date_TP", fields["Policy_End_Date_TP"]);

        formData.append("Policy_Status", fields["Policy_Status"]);
        formData.append("Policy_No", fields["Policy_No"]);
        formData.append("Policy_Booking_Date", fields["Policy_Booking_Date"]);
      }

      if (this.StepData["LOB_Id"] == "LI") {
        formData.append("LI_Product_Type", fields["LI_Product_Type"]);
        formData.append("LI_Product_Id", fields["LI_Product_Id"]);
      }

      this.api.IsLoading();
      this.api.HttpForSR("post", "Submit/Step_II", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.StepData = result["StepData"];
            this.ViewStep(3);
            this.Ins_Companies_Ar = result["Data"]["Companies_Ar"];

            if (
              this.StepData["File_Type"] == "Rollover" ||
              this.StepData["File_Type"] == "Renewal"
            ) {
              this.SRForm_3.get("DontKnowStatus").disable();
              this.SRForm_3.get("DontKnowStatus").updateValueAndValidity();
            } else {
              this.SRForm_3.get("DontKnowStatus").enable();
              this.SRForm_3.get("DontKnowStatus").updateValueAndValidity();
            }
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
  }

  updatePYPform() {
    this.SRForm_3.get("DontKnowStatus").setValidators([Validators.required]);
    this.SRForm_3.get("Pre_Insurer_Name").setValidators([Validators.required]);
    this.SRForm_3.get("Pre_Policy_No").setValidators([Validators.required]);
    this.SRForm_3.get("Pre_Expiry_Date").setValidators([Validators.required]);

    this.SRForm_3.get("DontKnowStatus").updateValueAndValidity();
    this.SRForm_3.get("Pre_Insurer_Name").updateValueAndValidity();
    this.SRForm_3.get("Pre_Policy_No").updateValueAndValidity();
    this.SRForm_3.get("Pre_Expiry_Date").updateValueAndValidity();
  }

  SubmitStep_III() {
    // console.log(this.SRForm_3.value);

    this.isSubmitted_3 = true;
    if (this.SRForm_3.invalid) {
      return;
    } else {
      var fields = this.SRForm_3.value;
      const formData = new FormData();

      formData.append("Step_Id", this.Step_Id);
      formData.append("Source", "BMS");
      formData.append("LOB_Id", this.StepData["LOB_Id"]);
      formData.append("User_Id", this.api.GetUserId());
      formData.append("User_Code", this.api.GetUserData("Emp_Id"));

      if (
        this.StepData["LOB_Id"] == "Motor" ||
        this.StepData["LOB_Id"] == "Non Motor" ||
        this.StepData["LOB_Id"] == "Health"
      ) {
        if (
          this.StepData["File_Type"] == "Rollover" ||
          this.StepData["File_Type"] == "Renewal"
        ) {
          formData.append("DontKnowStatus", "No");
          formData.append("Pre_Insurer_Name", "");
          formData.append("Pre_Policy_No", "");
          formData.append("Pre_Expiry_Date", "");
        } else {
          //// console.log(fields['Pre_Insurer_Name'][0]['Name']);
          formData.append("DontKnowStatus", fields["DontKnowStatus"]);

          formData.append("Pre_Insurer_Name", fields["Pre_Insurer_Name"]);
          formData.append("Pre_Policy_No", fields["Pre_Policy_No"]);
          formData.append("Pre_Expiry_Date", fields["Pre_Expiry_Date"]);
        }
      } else if (this.StepData["LOB_Id"] == "LI") {
        formData.append(
          "LI_Existing_Sum_Assured",
          fields["LI_Existing_Sum_Assured"]
        );
        //formData.append('LI_Sum_Assured_Premium',fields['LI_Sum_Assured_Premium']);
        //formData.append('LI_Pre_Insurance_Company_Id',fields['LI_Pre_Insurance_Company_Id']);
        formData.append(
          "LI_Previous_Companies",
          JSON.stringify(fields["LI_Previous_Companies"])
        );
      }

      this.api.IsLoading();
      this.api.HttpForSR("post", "Submit/Step_III", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.StepData = result["StepData"];
            this.ViewStep(4);

            this.SRForm_4.get("Basic_TP").setValue(this.StepData["Basic_TP"]);
            this.SRForm_4.get("PA_Owner_Premium").setValue(
              this.StepData["PA_Owner_Premium"]
            );

            this.SRForm_4.get("Basic_TP").updateValueAndValidity();
            this.SRForm_4.get("PA_Owner_Premium").updateValueAndValidity();
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
  }

  LI_PolicyTerm(e) {
    var val = e.target.value;
    this.SRForm_4.get("LI_Payment_Term").setValue(val);
  }

  SubmitStep_IV() {
    // console.log(this.SRForm_4.value);

    this.isSubmitted_4 = true;
    if (this.SRForm_4.invalid) {
      return;
    } else {
      var fields = this.SRForm_4.value;
      const formData = new FormData();

      formData.append("Step_Id", this.Step_Id);
      formData.append("Source", "BMS");
      formData.append("LOB_Id", this.StepData["LOB_Id"]);
      formData.append("User_Id", this.api.GetUserId());
      formData.append("User_Code", this.api.GetUserData("Emp_Id"));

      if (
        this.StepData["LOB_Id"] == "Motor" ||
        this.StepData["LOB_Id"] == "Non Motor" ||
        this.StepData["LOB_Id"] == "Health"
      ) {
        formData.append("TPPD", fields["TPPD"]);
        formData.append("Basic_OD", fields["Basic_OD"]);
        formData.append("Basic_TP", fields["Basic_TP"]);
        formData.append("Other_TP", fields["Other_TP"]);
        formData.append("PA_Owner_Premium", fields["PA_Owner_Premium"]);
        formData.append("Net_Premium", fields["Net_Premium"]);
        formData.append(
          "Estimated_Gross_Premium",
          fields["Estimated_Gross_Premium"]
        );

        formData.append("Terrorism_Premium", fields["Terrorism_Premium"]);
        formData.append("Sum_Insured", fields["Sum_Insured"]);

        formData.append("Payment_Towards", fields["Payment_Towards"]);
        formData.append("Mode_Of_Payment", fields["Mode_Of_Payment"]);
        formData.append(
          "Payment_Cheque_Ref_No",
          fields["Payment_Cheque_Ref_No"]
        );
        formData.append("Payout_Mode", fields["Payout_Mode"]);

        formData.append("IDV", fields["IDV"]);
        formData.append("NCB", fields["NCB"]);
        formData.append("Discount", fields["Discount"]);
      } else if (this.StepData["LOB_Id"] == "LI") {
        formData.append("LI_Policy_Term", fields["LI_Policy_Term"]);
        formData.append("LI_Payment_Type", fields["LI_Payment_Type"]);
        formData.append("LI_Payment_Term", fields["LI_Payment_Term"]);
        formData.append("LI_Payment_Mode", fields["LI_Payment_Mode"]);

        formData.append("LI_Net_Premium", fields["LI_Net_Premium"]);
        formData.append("LI_Gross_Premium", fields["LI_Gross_Premium"]);
        formData.append(
          "LI_Proposed_Sum_Assured",
          fields["LI_Proposed_Sum_Assured"]
        );
      }

      this.api.IsLoading();
      this.api.HttpForSR("post", "Submit/Step_IV", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.StepData = result["StepData"];
            this.ViewStep(5);

            if (this.StepData["Segment_Id"] == "Comprehensive") {
            } else if (
              this.StepData["Segment_Id"] == "Standalone Third Party"
            ) {
              var Basic_OD_Control = this.SRForm_4.get("Basic_OD");
              Basic_OD_Control.disable();
              Basic_OD_Control.updateValueAndValidity();
            } else if (this.StepData["Segment_Id"] == "Standalone Own Damage") {
              var Basic_TP_Control = this.SRForm_4.get("Basic_TP");
              Basic_TP_Control.disable();
              Basic_TP_Control.updateValueAndValidity();
            }
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
  }

  Calculation(type) {
    var fields = this.SRForm_4.value;

    const formData = new FormData();

    formData.append("Step_Id", this.Step_Id);
    formData.append("Source", "BMS");
    formData.append("LOB_Id", this.StepData["LOB_Id"]);
    formData.append("User_Id", this.api.GetUserId());
    formData.append("User_Code", this.api.GetUserData("Emp_Id"));

    formData.append("CurrentInput", type);

    formData.append("TPPD", fields["TPPD"]);
    formData.append("Basic_OD", fields["Basic_OD"]);
    formData.append("Basic_TP", fields["Basic_TP"]);
    formData.append("Other_TP", fields["Other_TP"]);
    formData.append("PA_Owner_Premium", fields["PA_Owner_Premium"]);
    formData.append("Net_Premium", fields["Net_Premium"]);
    formData.append(
      "Estimated_Gross_Premium",
      fields["Estimated_Gross_Premium"]
    );

    formData.append("LI_Net_Premium", fields["LI_Net_Premium"]);
    formData.append("LI_Gross_Premium", fields["LI_Gross_Premium"]);

    formData.append("StepData", JSON.stringify(this.StepData));

    //this.api.IsLoading();
    this.api.HttpForSR("post", "Calculation/index", formData).then(
      (result) => {
        //this.api.HideLoading();

        if (result["Status"] == true) {
          var res = result["Data"];

          var TPPD_Control = this.SRForm_4.get("TPPD");
          var Basic_OD_Control = this.SRForm_4.get("Basic_OD");
          var Basic_TP_Control = this.SRForm_4.get("Basic_TP");
          var Other_TP_Control = this.SRForm_4.get("Other_TP");
          var PA_Owner_Premium_Control = this.SRForm_4.get("PA_Owner_Premium");
          var Net_Premium_Control = this.SRForm_4.get("Net_Premium");
          var Estimated_Gross_Premium_Control = this.SRForm_4.get(
            "Estimated_Gross_Premium"
          );

          var LI_Net_Premium_Control = this.SRForm_4.get("LI_Net_Premium");
          var LI_Gross_Premium_Control = this.SRForm_4.get("LI_Gross_Premium");

          if (type == "Net_Premium") {
            this.Net_Premium_Error_Msg = res["Net_Premium_Error_Msg"];

            Basic_OD_Control.setValue(res["Basic_OD"]);
            Other_TP_Control.setValue(res["Other_TP"]);
            Estimated_Gross_Premium_Control.setValue(
              res["Estimated_Gross_Premium"]
            );

            Basic_OD_Control.updateValueAndValidity();
            Other_TP_Control.updateValueAndValidity();
            Estimated_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "Estimated_Gross_Premium") {
            this.Net_Premium_Error_Msg = res["Net_Premium_Error_Msg"];

            Basic_OD_Control.setValue(res["Basic_OD"]);
            Other_TP_Control.setValue(res["Other_TP"]);
            Net_Premium_Control.setValue(res["Net_Premium"]);

            Basic_OD_Control.updateValueAndValidity();
            Other_TP_Control.updateValueAndValidity();
            Net_Premium_Control.updateValueAndValidity();
          }

          if (type == "Other_TP") {
            this.Other_TP_Error_Msg = res["Other_TP_Error_Msg"];

            Basic_OD_Control.setValue(res["Basic_OD"]);
            Net_Premium_Control.setValue(res["Net_Premium"]);
            Estimated_Gross_Premium_Control.setValue(
              res["Estimated_Gross_Premium"]
            );

            Basic_OD_Control.updateValueAndValidity();
            Net_Premium_Control.updateValueAndValidity();
            Estimated_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "TPPD") {
            Basic_OD_Control.setValue(res["Basic_OD"]);
            Basic_TP_Control.setValue(res["Basic_TP"]);
            Other_TP_Control.setValue(res["Other_TP"]);
            Net_Premium_Control.setValue(res["Net_Premium"]);
            Estimated_Gross_Premium_Control.setValue(
              res["Estimated_Gross_Premium"]
            );

            Basic_OD_Control.updateValueAndValidity();
            Basic_TP_Control.updateValueAndValidity();
            Other_TP_Control.updateValueAndValidity();
            Net_Premium_Control.updateValueAndValidity();
            Estimated_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "Estimated_Gross_Premium_NM") {
            this.Net_Premium_Error_Msg = res["Net_Premium_Error_Msg"];
            Net_Premium_Control.setValue(res["Net_Premium"]);
            Net_Premium_Control.updateValueAndValidity();
          }

          if (type == "Net_Premium_NM") {
            this.Net_Premium_Error_Msg = res["Net_Premium_Error_Msg"];
            Estimated_Gross_Premium_Control.setValue(
              res["Estimated_Gross_Premium"]
            );
            Estimated_Gross_Premium_Control.updateValueAndValidity();
          }

          if (type == "Net_Premium_LI") {
            //this.Net_Premium_Error_Msg = res['Net_Premium_Error_Msg'];
            LI_Gross_Premium_Control.setValue(res["Estimated_Gross_Premium"]);
            LI_Gross_Premium_Control.updateValueAndValidity();
          }
          if (type == "Gross_Premium_LI") {
            //this.Net_Premium_Error_Msg = res['Net_Premium_Error_Msg'];
            LI_Net_Premium_Control.setValue(res["Net_Premium"]);
            LI_Net_Premium_Control.updateValueAndValidity();
          }
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        //this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  SubmitStep_V() {
    var fields = this.SRForm_5.value;

    const formData = new FormData();

    formData.append("Step_Id", this.Step_Id);
    formData.append("Source", "BMS");
    formData.append("LOB_Id", this.StepData["LOB_Id"]);
    formData.append("User_Id", this.api.GetUserId());
    formData.append("User_Code", this.api.GetUserData("Emp_Id"));

    if (
      this.StepData["LOB_Id"] == "Motor" ||
      this.StepData["LOB_Id"] == "Non Motor" ||
      this.StepData["LOB_Id"] == "Health"
    ) {
      formData.append("Input_PolicyPDF", fields["PolicyPDF"]);
      formData.append(
        "Input_Previous_Policy_Copy",
        fields["Previous_Policy_Copy"]
      );
      formData.append(
        "Input_RC_Motor_Registraion_Front",
        fields["RC_Motor_Registraion_Front"]
      );
      formData.append(
        "Input_RC_Motor_Registraion_Back",
        fields["RC_Motor_Registraion_Back"]
      );
      formData.append("Input_Invoice", fields["Invoice"]);
      formData.append(
        "Input_Cheque_Payment_Recipt",
        fields["Cheque_Payment_Recipt"]
      );
      formData.append("Input_Mandate_Letter", fields["Mandate_Letter"]);
      formData.append("Input_Renewal_Notice", fields["Renewal_Notice"]);

      formData.append(
        "RC_Motor_Registraion_Front",
        this.RC_Motor_Registraion_Front
      );
      formData.append(
        "RC_Motor_Registraion_Back",
        this.RC_Motor_Registraion_Back
      );
      formData.append("Previous_Policy_Copy", this.Previous_Policy_Copy);
      formData.append("Cheque_Payment_Recipt", this.Cheque_Payment_Recipt);
      formData.append("Mandate_Letter", this.Mandate_Letter);
      formData.append("Invoice", this.Invoice);
      formData.append("Renewal_Notice", this.Renewal_Notice);
      formData.append("PolicyPDF", this.PolicyPDF);
    } else if (this.StepData["LOB_Id"] == "LI") {
      formData.append("Input_AadharCardFront", fields["AadharCardFront"]);
      formData.append("Input_AadharCardBack", fields["AadharCardBack"]);
      formData.append("Input_PanCard", fields["PanCard"]);
      formData.append("Input_Photo", fields["Photo"]);
      formData.append("Input_CancelCheque", fields["CancelCheque"]);
      formData.append("Input_IncomeProof", fields["IncomeProof"]);
      formData.append("Input_ITR", fields["ITR"]);

      formData.append("AadharCardFront", this.AadharCardFront);
      formData.append("AadharCardBack", this.AadharCardBack);
      formData.append("PanCard", this.PanCard);
      formData.append("Photo", this.Photo);
      formData.append("CancelCheque", this.CancelCheque);
      formData.append("IncomeProof", this.IncomeProof);
      formData.append("ITR", this.ITR);
    }
    formData.append("Input_Other", fields["Other"]);
    formData.append("Other", this.Other);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/SubmitStep_V", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.StepData = result["StepData"];
          this.ViewStep(6);
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

  ViewDocument(name) {
    var url = this.StepData["Docs_Base_Url"] + name;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  SubmitStep_VI() {
    var fields = this.SRForm_6.value;

    const formData = new FormData();

    formData.append("Step_Id", this.Step_Id);
    formData.append("Source", "BMS");
    formData.append("SR_Id", this.SR_Id);
    formData.append("LOB_Id", this.StepData["LOB_Id"]);
    formData.append("User_Id", this.api.GetUserId());
    formData.append("User_Code", this.api.GetUserData("Emp_Id"));

    if (
      this.StepData["LOB_Id"] == "Motor" ||
      this.StepData["LOB_Id"] == "Non Motor" ||
      this.StepData["LOB_Id"] == "Health"
    ) {
    } else if (this.StepData["LOB_Id"] == "LI") {
      formData.append("SR_Status", fields["SR_Status"]);
      formData.append("Booking_Date", fields["Booking_Date"]);
      formData.append("Policy_No", fields["Policy_No"]);
    }

    formData.append("Remark", fields["Remark"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/Final_Submit", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          //this.StepData = result['StepData'];
          //this.ViewStep(6); //final submission
          this.api.Toast("Success", result["Message"]);
          this.CloseModel();
          //this.router.navigate(['business-management/sr-qc-report']);
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        // Error log
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  Reject() {
    var fields = this.SRForm_6.value;

    const formData = new FormData();

    formData.append("Step_Id", this.Step_Id);
    formData.append("Source", "BMS");
    formData.append("SR_Id", this.SR_Id);
    formData.append("LOB_Id", this.StepData["LOB_Id"]);
    formData.append("User_Id", this.api.GetUserId());
    formData.append("User_Code", this.api.GetUserData("Emp_Id"));

    if (
      this.StepData["LOB_Id"] == "Motor" ||
      this.StepData["LOB_Id"] == "Non Motor" ||
      this.StepData["LOB_Id"] == "Health"
    ) {
    } else if (this.StepData["LOB_Id"] == "LI") {
    }

    formData.append("Remark", fields["Remark"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/Reject_SR", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          //this.StepData = result['StepData'];
          //this.ViewStep(6); //final submission
          this.api.Toast("Success", result["Message"]);
          this.CloseModel();
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        // Error log
        //// console.log(err.message);
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  ShowDetails(index, Status) {
    if (index == 0 && Status == 1) {
      this.showDetails_0 = 0;
    }
    if (index == 0 && Status == 0) {
      this.showDetails_0 = 1;
    }

    if (index == 1 && Status == 1) {
      this.showDetails_1 = 0;
    }
    if (index == 1 && Status == 0) {
      this.showDetails_1 = 1;
    }

    if (index == 2 && Status == 1) {
      this.showDetails_2 = 0;
    }
    if (index == 2 && Status == 0) {
      this.showDetails_2 = 1;
    }

    if (index == 3 && Status == 1) {
      this.showDetails_3 = 0;
    }
    if (index == 3 && Status == 0) {
      this.showDetails_3 = 1;
    }

    if (index == 4 && Status == 1) {
      this.showDetails_4 = 0;
    }
    if (index == 4 && Status == 0) {
      this.showDetails_4 = 1;
    }

    if (index == 5 && Status == 1) {
      this.showDetails_5 = 0;
    }
    if (index == 5 && Status == 0) {
      this.showDetails_5 = 1;
    }

    if (index == 6 && Status == 1) {
      this.showDetails_6 = 0;
    }
    if (index == 6 && Status == 0) {
      this.showDetails_6 = 1;
    }
  }
}
