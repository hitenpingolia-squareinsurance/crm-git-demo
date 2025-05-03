import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";

@Component({
  selector: "app-sr-edit-by-right",
  templateUrl: "./sr-edit-by-right.component.html",
  styleUrls: ["./sr-edit-by-right.component.css"],
})
export class SrEditByRightComponent implements OnInit {
  SRForm: FormGroup;
  isSubmitted = false;

  SR_Id: any;
  row: any = [];
  Base_Url: any = "";
  Documents: any = [];

  User_Rights: any = [];
  Broker_Id: any = 0;
  RM_Id: any = 0;
  Franchise_Id: any = 0;
  Agent_Id: any = 0;
  Fleet_Id: any = 0;

  Remarks: string;

  SalesSupportEmp_Ar: any;
  OperationsEmp_Ar: any;
  AccountsEmp_Ar: any;

  Operations_User_Id: any = 0;
  Is_UW_Self_OPS: any = 0;
  Accounts_User_Id: any = 0;

  File_Type_Ar: any = [];

  Brokers_Ar: any;
  Franchisee_Ar: any;
  RM_Ar: any;
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

  SR_Payout_Details: any;

  Registration_State_Code_: any;
  Registration_District_Code_: any;
  Registration_City_Code_: any;
  Registration_Code_: any;

  File_Type_Str: any = "";

  selectedFiles: File;
  RC_Motor_Registraion: File;
  Previous_Policy_Copy: File;
  Cheque_Payment_Recipt: File;
  Mandate_Letter: File;
  Invoice: File;
  Renewal_Notice: File;
  Other: File;
  PolicyPDF: File;

  Vehicle_Type: string = "GCV"; //GCV,Other  PCV,Two Wheeler,Private Car

  Estimated_Gross_Premium_Total: any;

  Other_TP_Error_Msg: any;
  Net_Premium_Error_Msg: any;

  TP_Premium: any = 0;
  Per_Passenger_Cost: any = 0;
  IsSeatingCapcityEdit: string = "0";

  Is_Policy_OD: any = 0;
  global_OD_Days: Number = 0;
  global_TP_Days: Number = 364;
  OD_Change: string = "Yes";

  RegistrationType: string = "Normal";
  StateSearchErrorMsg: string = "";
  RTOSearchErrorMsg: string = "";

  Emp_Id: any;
  Emp_Pass: any;
  Is_Remember: any = false;

  constructor(
    public dialogRef: MatDialogRef<SrEditByRightComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.SR_Id = this.data.Id;
    // console.log(this.SR_Id);

    if (this.api.GetUserData("UserType_Name") == "Agent") {
      this.Agent_Id = this.api.GetUserData("User_Id_Dec");
    }

    if (this.api.GetIs_Remember("Is_Remember") == 1) {
      this.Is_Remember = true;
      this.Emp_Id = this.api.GetIs_Remember("Emp_Id");
      this.Emp_Pass = this.api.GetIs_Remember("Emp_Pass");
    }

    this.GetAll_RM(); //OPS,UW Only
  }

  ngOnInit() {
    this.buildForm();

    this.ComponentsData();

    this.Get_Operation_Employee();
    this.Get_Accounts_Employee();

    if (this.api.GetUserData("UserType_Name") == "RM") {
      //this.Get_Agents_By_RM();
      //const Agent_Id_Control = this.SRForm.get('Agent_Id');
      //Agent_Id_Control.setValidators([Validators.required]);
      //Agent_Id_Control.updateValueAndValidity();
    }

    //this.AddSR(); //add 30-07-2020 auto validation error show first time
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  Get_Agents_By_RM() {
    this.api.IsLoading();
    this.api
      .Call("sr/RM/Get_Agents_By_RM?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Agents_Ar = result["Data"];
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
  }

  GetAll_RM() {
    this.api.IsLoading();
    this.api.Call("sr/Sales/GetAll_RM").then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.RM_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  Get_Agents(e, Type) {
    var RM_Id = e;
    if (Type == 0) {
      RM_Id = e.target.value;
    }

    this.api.IsLoading();
    this.api.Call("sr/Sales/Get_Agents?RM_Id=" + RM_Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Franchisee_Ar = result["Franchise_Ar"];
        } else {
          this.Agents_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  onChangeFranchise(e, Type) {
    //alert(Type);

    if (Type == 0) {
      var Franchise_Id = e.target.value;
    } else {
      var Franchise_Id = e;
    }

    this.api.IsLoading();
    this.api
      .Call("sr/Sales/Get_AgentsBy_Franchise_Id?Franchise_Id=" + Franchise_Id)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Agents_Ar = result["Data"];
          } else {
            this.Agents_Ar = [];
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
  }

  ViewDocument(name) {
    let url;
    if (this.row.Source == "Web") {
      url = name;
    } else {
      url = this.Base_Url + this.SR_Id + "/" + name;
    }
    // console.log(this.row.Source);
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  onChangeAgent(e, type) {
    if (type == 1) {
      var agentid = e.target.value;
    } else {
      var agentid = e;
    }

    if (agentid != 0) {
      this.api.IsLoading();
      this.api.Call("sr/Sales/Get_FleetsBy_Agent_Id?Agent_Id=" + agentid).then(
        (result) => {
          this.api.HideLoading();

          if (result["Is_Check_Agent"]["Status"] == true) {
            //this.SRForm.reset();
            this.Agent_Id = 0;
            this.api.ErrorMsg(result["Is_Check_Agent"]["Message"]);
          }

          if (result["Status"] == true) {
            this.Fleets_Ar = result["Data"];
          } else {
            this.Fleets_Ar = [];
            //this.api.ErrorMsg(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
    }
  }

  ComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "sr/SRActions/ComponentsData?SR_Id=" +
          this.SR_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Brokers_Ar = result["Data"]["Brokers"];
            this.Franchisee_Ar = result["Data"]["Franchisee"];
            this.SalesSupportEmp_Ar = result["Data"]["SalesSupport_Employee"];

            this.LOB_Ar = result["Data"]["LOB"];
            this.Classes_Ar = result["Data"]["Classes_Ar"];
            this.Sub_Classes_Ar = result["Data"]["Sub_Classes_Ar"];
            this.Segment_Ar = result["Data"]["Segment_Ar"];
            this.Products_Ar = result["Data"]["Products_Ar"];
            this.SubProducts_Ar = result["Data"]["SubProducts_Ar"];

            this.Make_Ar = result["Data"]["Make_Ar"];
            this.Models_Ar = result["Data"]["Models_Ar"];
            this.Variants_Ar = result["Data"]["Variants_Ar"];

            this.Ins_Companies_Ar = result["Data"]["Ins_Compaines"];
            this.Ins_Branch_Companies_Ar =
              result["Data"]["Ins_Branch_Companies_Ar"];
            this.States_Ar = result["Data"]["States"];
            this.RTO_Ar = result["Data"]["RTO_Ar"];

            this.SR_Payout_Details = result["Data"]["SR_Payout_Details"];

            //SR Form components
            this.row = result["Data"]["Row"];
            this.Base_Url = result["Data"]["Base_Url"];
            this.Documents = result["Data"]["Documents"];
            this.User_Rights = result["Data"]["SR_User_Rights"];

            //alert(this.User_Rights.Is_Accounts);

            let row = this.row;

            var LOB_Id = row["LOB_Id"];

            if (LOB_Id == "Motor") {
              this.File_Type_Ar = ["New", "Used", "Rollover", "Renewal"];

              if (
                row["Class_Id"] == "Public Carrier" ||
                row["Class_Id"] == "Private Carrier"
              ) {
                this.Vehicle_Type = "GCV";
              } else {
                this.Vehicle_Type = "Other";
              }
            } else {
              if (LOB_Id == "Health") {
                this.File_Type_Ar = ["Fresh", "Renewal", "Port"];
              } else if (LOB_Id == "Non Motor") {
                this.File_Type_Ar = ["Fresh", "Renewal", "Rollover"];
              }
            }

            this.Broker_Id = row["Broker_Id"];
            this.RM_Id = row["RM_Id"];
            this.Franchise_Id = row["Franchise_Id"];

            this.Agent_Id = row["Agent_Id"];
            this.Get_Agents(this.RM_Id, 1);

            if (row["Franchise_Id"] != 0) {
              this.onChangeFranchise(row["Franchise_Id"], 1);
            }

            this.Fleet_Id = row["Fleet_Id"];
            this.onChangeAgent(this.Agent_Id, 0);

            this.Is_Policy_OD = row["Is_Policy_OD"];
            this.global_OD_Days = row["OD_Days"];
            this.global_TP_Days = row["TP_Days"];

            //alert(row['Policy_Status']);

            this.SRForm = this.formBuilder.group({
              LOB_Id: [row["LOB_Id"], [Validators.required]],
              File_Type: [row["File_Type"]],
              Insurer_Renewal: [row["Insurer_Renewal"]],
              PA_Owner: [row["PA_Owner"]],
              PA_Owner_Tenure: [row["PA_Owner_Tenure"]],

              Class_Id: [row["Class_Id"], [Validators.required]],
              Sub_Class_Id: [row["Sub_Class_Id"], [Validators.required]],
              Segment_Id: [row["Segment_Id"], [Validators.required]],
              Product_Id: [row["Product_Id"], [Validators.required]],
              SubProduct_Id: [row["SubProduct_Id"]], //[Validators.required]

              Make_Id: [row["Make_Id"], [Validators.required]],
              Model_Id: [row["Model_Id"], [Validators.required]],
              Variant_Id: [row["Variant_Id"], [Validators.required]],
              Seating_Capcity: [row["Seating_Capcity"]],
              GVW_CC: [row["GVW_CC"]],

              Registration_State_Code: [
                row["RN_1"],
                [
                  Validators.pattern("[a-zA-Z ]*$"),
                  Validators.minLength(2),
                  Validators.maxLength(2),
                ],
              ],
              Registration_District_Code: [
                row["RN_2"],
                [
                  Validators.pattern("^[0-9]*$"),
                  Validators.minLength(2),
                  Validators.maxLength(2),
                ],
              ],
              Registration_City_Code: [
                row["RN_3"],
                [
                  Validators.pattern("^$|^[A-Za-z0-9]+"),
                  Validators.maxLength(3),
                ],
              ],
              Registration_Code: [
                row["RN_4"],
                [
                  Validators.pattern("^^[0-9]*$"),
                  Validators.minLength(4),
                  Validators.maxLength(4),
                ],
              ],

              Purchase_Date: [row["Purchase_Date"], [Validators.required]],
              Manufacture_Year: [
                row["Manufacture_Year"],
                [Validators.required, Validators.pattern("^[0-9]*$")],
              ],
              Engine_No: [
                row["Engine_No"],
                [
                  Validators.pattern("^[a-zA-Z0-9]+$"),
                  Validators.minLength(5),
                  Validators.maxLength(25),
                ],
              ],
              Chasis_No: [
                row["Chasis_No"],
                [
                  Validators.pattern("^[a-zA-Z0-9]+$"),
                  Validators.minLength(5),
                  Validators.maxLength(25),
                ],
              ],

              Insurance_Company_Id: [
                row["Insurance_Company_Id"],
                [Validators.required],
              ],
              Insurance_Company_Branch_Id: [
                row["Insurance_Company_Branch_Id"],
                [Validators.required],
              ],
              State_Id: [row["State_Id"], [Validators.required]],
              RTO_Id: [row["RTO_Id"], [Validators.required]],

              Insured_Type: [row["Insured_Type"]],
              Salutation_Type: [row["Salutation_Type"]],

              Customer_Name: [
                row["Customer_Name"],
                [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
              ],
              Customer_Mobile: [
                row["Customer_Mobile"],
                [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
              ],
              Customer_Alternate_Mobile: [
                row["Customer_Alternate_Mobile"],
                [Validators.pattern("^[0-9]*$")],
              ],

              Policy_Start_Date_OD: [row["Policy_Start_Date_OD"]],
              Policy_End_Date_OD: [row["Policy_End_Date_OD"]],
              Policy_Start_Date_TP: [
                row["Policy_Start_Date_TP"],
                [Validators.required],
              ],
              Policy_End_Date_TP: [
                row["Policy_End_Date_TP"],
                [Validators.required],
              ],
              Policy_Status: [row["Policy_Status"], [Validators.required]],
              Policy_No: [
                {
                  value: row["Policy_No"],
                  disabled: row["Policy_Status"] == "Not-Issued" ? true : false,
                },
              ],

              Previous_Policy_Status: [
                row["Previous_Policy_Status"],
                [Validators.required],
              ],
              Pre_Insurer_Name: [row["Pre_Insurer_Name"]],
              Pre_Policy_No: [row["Pre_Policy_No"]],
              Pre_Expiry_Date: [row["Pre_Expiry_Date"]],

              Payment_Towards: [row["Payment_Towards"], [Validators.required]],
              Mode_Of_Payment: [row["Mode_Of_Payment"], [Validators.required]],
              Payment_Cheque_Ref_No: [
                row["Payment_Cheque_Ref_No"],
                [Validators.required],
              ],

              Payout_MOD: [this.SR_Payout_Details["Payout_MOD"]],
              Payout_Remark: [this.SR_Payout_Details["Payout_Remark"]],

              Payout_OD: [this.SR_Payout_Details["Payout_OD"]],
              Payout_TP: [this.SR_Payout_Details["Payout_TP"]],
              Payout_Net: [this.SR_Payout_Details["Payout_Net"]],
              Payout_Reward: [this.SR_Payout_Details["Payout_Reward"]],
              Payout_Scheme: [this.SR_Payout_Details["Payout_Scheme"]],

              Payout_OD_Amount: [this.SR_Payout_Details["Payout_OD_Amount"]],
              Payout_TP_Amount: [this.SR_Payout_Details["Payout_TP_Amount"]],
              Payout_Net_Amount: [this.SR_Payout_Details["Payout_Net_Amount"]],
              Payout_Reward_Amount: [
                this.SR_Payout_Details["Payout_Reward_Amount"],
              ],
              Payout_Scheme_Amount: [
                this.SR_Payout_Details["Payout_Scheme_Amount"],
              ],

              Payout_Total_Amount: [
                this.SR_Payout_Details["Payout_Total_Amount"],
              ],

              TPPD: [row["TPPD"], [Validators.pattern("^[0-9]*.?[0-9]*$")]],
              Basic_OD: [
                row["Basic_OD"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              Basic_TP: [
                row["Basic_TP"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              Other_TP: [
                row["Other_TP"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              PA_Owner_Premium: [
                row["PA_Owner_Premium"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              Net_Premium: [
                row["Net_Premium"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              Estimated_Gross_Premium: [
                row["Estimated_Gross_Premium"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],

              IDV: [
                row["IDV"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              NCB: [
                row["NCB"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],
              Discount: [
                row["Discount"],
                [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
              ],

              Terrorism_Premium: [
                row["Terrorism_Premium"],
                [Validators.pattern("^[0-9]*$")],
              ],
              Sum_Insured: [
                row["Sum_Insured"],
                [Validators.pattern("^[0-9]*$")],
              ],

              Underwriter_Emp_Id: [row["Underwriter_Emp_Id"]],
              Accounts_Id: [row["Accounts_Id"]],
              Operation_Id: [row["Operation_Id"]],

              AssignType: [],
              AssignUserId: ["", [Validators.required]],
              AssignRemark: [row["SR_Current_Remark"], [Validators.required]],
              AssignActionType: [],

              RC_Motor_Registraion: [""],
              Previous_Policy_Copy: [""],
              Cheque_Payment_Recipt: [""],
              Mandate_Status: ["Yes"],
              Mandate_Letter: [""],
              Invoice: [""],
              Renewal_Notice: [""],
              Other: [""],
              PolicyPDF: [],

              Employee_Code: [this.Emp_Id],
              Employee_Password: [this.Emp_Pass],
            });

            this.FileType_Status();
            this.onChangePA_Owner();
            this.onChangePA_Owner_Tenure();
            this.onChangeSegment();
            this.Policy_Status();
            this.PreviousPolicyStatus();
            this.onChangePolicyStartDate_OD();
            this.onChangePolicyStartDate();
            this.onChangePurchaseDate();
            this.onChangePre_Expiry_Date();
            this.onChange_State();
            this.onChange_RTO();

            this.MakeCustomCall();

            if (LOB_Id == "Motor") {
              //this.Get_PCV_TP_Premium_Per_Passenger();
            }
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
  }

  onChangePolicyStatus(e) {
    var PolicyStatus = e.target.value;
    // console.log(PolicyStatus);
    this.row["Policy_Status"] = PolicyStatus;
    // console.log(this.row);
    this.Is_UW_Self_OPS = 0;
  }
  onChangePaymentTowards(e) {
    var Payment_Towards = e.target.value;
    // console.log(Payment_Towards);
    this.row["Payment_Towards"] = Payment_Towards;
    // console.log(this.row);

    this.Is_UW_Self_OPS = 0;
  }

  Get_Operation_Employee() {
    this.api
      .Call("sr/Sales/Get_Operation_Employee?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.OperationsEmp_Ar = result["Data"];
            //this.api.ToastMessage(result['Message']);
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
  }
  Get_Accounts_Employee() {
    this.api.Call("sr/Sales/Get_Accounts_Employee").then(
      (result) => {
        if (result["Status"] == true) {
          this.AccountsEmp_Ar = result["Data"];
          //this.api.ToastMessage(result['Message']);
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  File_Types() {
    const LOB_Id = this.SRForm.value["LOB_Id"];

    this.SRForm.get("File_Type").setValue(null);
    this.SRForm.get("Product_Id").setValue(null);
    this.SRForm.get("SubProduct_Id").setValue(null);
    this.SRForm.get("Segment_Id").setValue(null);
    this.SRForm.get("Class_Id").setValue(null);
    this.SRForm.get("Sub_Class_Id").setValue(null);
    this.SRForm.get("Make_Id").setValue(null);
    this.SRForm.get("Model_Id").setValue(null);
    this.SRForm.get("Variant_Id").setValue(null);
    this.SRForm.get("Seating_Capcity").setValue(null);
    this.SRForm.get("GVW_CC").setValue(null);

    if (LOB_Id == "Motor") {
      this.File_Type_Ar = ["New", "Used", "Rollover", "Renewal"];
      //this.Broker_Id = 0;
    } else if (LOB_Id == "Health") {
      this.File_Type_Ar = ["Fresh", "Renewal", "Port"];
      this.Broker_Id = 1;
    } else if (LOB_Id == "Non Motor") {
      this.File_Type_Ar = ["Fresh", "Renewal", "Rollover"];
      this.Broker_Id = 1;
    }
  }

  Products() {
    this.SRForm.get("Product_Id").setValue(null);
    this.SRForm.get("SubProduct_Id").setValue(null);
    this.SRForm.get("Segment_Id").setValue(null);
    this.SRForm.get("Class_Id").setValue(null);
    this.SRForm.get("Sub_Class_Id").setValue(null);
    this.SRForm.get("Make_Id").setValue(null);
    this.SRForm.get("Model_Id").setValue(null);
    this.SRForm.get("Variant_Id").setValue(null);
    this.SRForm.get("Seating_Capcity").setValue(null);
    this.SRForm.get("GVW_CC").setValue(null);

    const LOB_Id = this.SRForm.value["LOB_Id"];
    const File_Type = this.SRForm.value["File_Type"];

    this.api.IsLoading();
    this.api
      .Call("sr/MainSR/Products?LOB_Id=" + LOB_Id + "&File_Type=" + File_Type)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            const Sub_Class_Id_Control = this.SRForm.get("Sub_Class_Id");
            const Customer_Mobile_Control = this.SRForm.get("Customer_Mobile");

            const Make_Id_Control = this.SRForm.get("Make_Id");
            const Model_Id_Control = this.SRForm.get("Model_Id");
            const Variant_Id_Control = this.SRForm.get("Variant_Id");

            const Registration_State_Code_Control = this.SRForm.get(
              "Registration_State_Code"
            );
            const Registration_District_Code_Control = this.SRForm.get(
              "Registration_District_Code"
            );
            const Registration_City_Code_Control = this.SRForm.get(
              "Registration_City_Code"
            );
            const Registration_Code_Control =
              this.SRForm.get("Registration_Code");

            const Purchase_Date_Control = this.SRForm.get("Purchase_Date");
            const Manufacture_Year_Control =
              this.SRForm.get("Manufacture_Year");
            const Engine_No_Control = this.SRForm.get("Engine_No");
            const Chasis_No_Control = this.SRForm.get("Chasis_No");

            const State_Id_Control = this.SRForm.get("State_Id");
            const RTO_Id_Control = this.SRForm.get("RTO_Id");

            const Basic_OD_Control = this.SRForm.get("Basic_OD");
            const Basic_TP_Control = this.SRForm.get("Basic_TP");
            const Other_TP_Control = this.SRForm.get("Other_TP");
            const PA_Owner_Premium_Control =
              this.SRForm.get("PA_Owner_Premium");
            const Sum_Insured_Control = this.SRForm.get("Sum_Insured");

            const IDV_Control = this.SRForm.get("IDV");
            const NCB_Control = this.SRForm.get("NCB");
            const Discount_Control = this.SRForm.get("Discount");

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

              Sub_Class_Id_Control.setValidators([Validators.required]);
              Customer_Mobile_Control.setValidators([
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
              ]);

              Make_Id_Control.setValidators([Validators.required]);
              Model_Id_Control.setValidators([Validators.required]);
              Variant_Id_Control.setValidators([Validators.required]);

              //Registration_State_Code_Control.setValidators([Validators.required,Validators.pattern("[a-zA-Z ]*$"),Validators.minLength(2), Validators.maxLength(2)]);
              //Registration_District_Code_Control.setValidators([Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(2), Validators.maxLength(2)]);
              //Registration_City_Code_Control.setValidators([Validators.required,Validators.pattern("^$|^[A-Za-z0-9]+"),Validators.minLength(2), Validators.maxLength(3)]);
              //Registration_Code_Control.setValidators([Validators.required,Validators.pattern("^^[0-9]*$"),Validators.minLength(4), Validators.maxLength(4)]);

              Purchase_Date_Control.setValidators([Validators.required]);
              Manufacture_Year_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*$"),
              ]);
              Engine_No_Control.setValidators([
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9]+$"),
                Validators.minLength(5),
                Validators.maxLength(25),
              ]);
              Chasis_No_Control.setValidators([
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9]+$"),
                Validators.minLength(5),
                Validators.maxLength(25),
              ]);

              State_Id_Control.setValidators([Validators.required]);
              RTO_Id_Control.setValidators([Validators.required]);

              Basic_OD_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);
              Basic_TP_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);
              Other_TP_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);
              PA_Owner_Premium_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);

              IDV_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);
              NCB_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);
              Discount_Control.setValidators([
                Validators.required,
                Validators.pattern("^[0-9]*.?[0-9]*$"),
              ]);
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

              Sub_Class_Id_Control.setValidators(null);
              Customer_Mobile_Control.setValidators([
                Validators.required,
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
              ]);

              Make_Id_Control.setValidators(null);
              Model_Id_Control.setValidators(null);
              Variant_Id_Control.setValidators(null);

              Registration_State_Code_Control.setValidators(null);
              Registration_District_Code_Control.setValidators(null);
              Registration_City_Code_Control.setValidators(null);
              Registration_Code_Control.setValidators(null);

              Purchase_Date_Control.setValidators(null);
              Manufacture_Year_Control.setValidators(null);
              Engine_No_Control.setValidators(null);
              Chasis_No_Control.setValidators(null);

              State_Id_Control.setValidators(null);
              RTO_Id_Control.setValidators(null);

              Basic_OD_Control.setValidators(null);
              Basic_TP_Control.setValidators(null);
              Other_TP_Control.setValidators(null);
              PA_Owner_Premium_Control.setValidators(null);

              IDV_Control.setValidators(null);
              NCB_Control.setValidators(null);
              Discount_Control.setValidators(null);
            }

            Sub_Class_Id_Control.updateValueAndValidity();
            Customer_Mobile_Control.updateValueAndValidity();

            Make_Id_Control.updateValueAndValidity();
            Model_Id_Control.updateValueAndValidity();
            Variant_Id_Control.updateValueAndValidity();

            Registration_State_Code_Control.updateValueAndValidity();
            Registration_District_Code_Control.updateValueAndValidity();
            Registration_City_Code_Control.updateValueAndValidity();
            Registration_Code_Control.updateValueAndValidity();

            Purchase_Date_Control.updateValueAndValidity();
            Manufacture_Year_Control.updateValueAndValidity();
            Engine_No_Control.updateValueAndValidity();
            Chasis_No_Control.updateValueAndValidity();

            State_Id_Control.updateValueAndValidity();
            RTO_Id_Control.updateValueAndValidity();

            Basic_OD_Control.updateValueAndValidity();
            Basic_TP_Control.updateValueAndValidity();
            Other_TP_Control.updateValueAndValidity();
            PA_Owner_Premium_Control.updateValueAndValidity();

            IDV_Control.updateValueAndValidity();
            NCB_Control.updateValueAndValidity();
            Discount_Control.updateValueAndValidity();
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
  }
  SubProducts(e) {
    const LOB_Id = this.SRForm.value["LOB_Id"];
    const Product_Id = this.SRForm.value["Product_Id"];

    this.api.IsLoading();
    this.api
      .Call(
        "sr/MainSR/SubProducts?LOB_Id=" + LOB_Id + "&Product_Id=" + Product_Id
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

            this.SRForm.get("SubProduct_Id").setValue(null);
            this.SRForm.get("Segment_Id").setValue(null);
            this.SRForm.get("Class_Id").setValue(null);
            this.SRForm.get("Sub_Class_Id").setValue(null);
            this.SRForm.get("Make_Id").setValue(null);
            this.SRForm.get("Model_Id").setValue(null);
            this.SRForm.get("Variant_Id").setValue(null);
            this.SRForm.get("Seating_Capcity").setValue(null);
            this.SRForm.get("GVW_CC").setValue(null);
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
  }

  Segments(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Segments", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Classes_Ar = [];
        this.Sub_Classes_Ar = [];

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        this.SRForm.get("Segment_Id").setValue(null);
        this.SRForm.get("Class_Id").setValue(null);
        this.SRForm.get("Sub_Class_Id").setValue(null);
        this.SRForm.get("Make_Id").setValue(null);
        this.SRForm.get("Model_Id").setValue(null);
        this.SRForm.get("Variant_Id").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue(null);
        this.SRForm.get("GVW_CC").setValue(null);

        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Classes(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Classes", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Sub_Classes_Ar = [];

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        this.SRForm.get("Class_Id").setValue(null);
        this.SRForm.get("Sub_Class_Id").setValue(null);
        this.SRForm.get("Make_Id").setValue(null);
        this.SRForm.get("Model_Id").setValue(null);
        this.SRForm.get("Variant_Id").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue(null);
        this.SRForm.get("GVW_CC").setValue(null);

        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Sub_Classes(e) {
    const Class_Id = this.SRForm.value["Class_Id"];

    if (Class_Id == "Public Carrier" || Class_Id == "Private Carrier") {
      this.Vehicle_Type = "GCV";
    } else {
      this.Vehicle_Type = "Other";
    }

    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Class_Id", Class_Id);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Sub_Classes", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Make_Ar = [];
        this.Models_Ar = [];
        this.Variants_Ar = [];

        this.SRForm.get("Sub_Class_Id").setValue(null);
        this.SRForm.get("Make_Id").setValue(null);
        this.SRForm.get("Model_Id").setValue(null);
        this.SRForm.get("Variant_Id").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue(null);
        this.SRForm.get("GVW_CC").setValue(null);

        if (result["Status"] == true) {
          this.Sub_Classes_Ar = result["Data"];
          this.Make_Ar = result["Make"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Make(e) {
    const formData = new FormData();

    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Make", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SRForm.get("Make_Id").setValue(null);
        this.SRForm.get("Model_Id").setValue(null);
        this.SRForm.get("Variant_Id").setValue(null);
        this.SRForm.get("Seating_Capcity").setValue(null);
        this.SRForm.get("GVW_CC").setValue(null);

        this.Models_Ar = [];
        this.Variants_Ar = [];

        if (result["Status"] == true) {
          this.Make_Ar = result["Data"];
          this.Get_TP_Premium();
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  MakeCustomCall() {
    //alert('MakeCustomCall');
    const formData = new FormData();

    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Make", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          //this.Make_Ar = result['Data'];
          this.Get_TP_Premium_Auto();
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Get_TP_Premium_Auto() {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Class_Id", this.SRForm.value["Class_Id"]);
    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/TP_Premium", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.TP_Premium = result["Data"]["TP_Premium"];
          this.Per_Passenger_Cost = result["Data"]["Per_Passenger_Cost"];

          //alert('Per_Passenger_Cost'+ this.Per_Passenger_Cost);

          //alert(result['Data']['TP_Premium']);
          const Basic_TP_Control = this.SRForm.get("Basic_TP");
          Basic_TP_Control.setValue(result["Data"]["TP_Premium"]);

          //Auto Fill OD and TP Date
          const Policy_Start_Date_OD_Control = this.SRForm.get(
            "Policy_Start_Date_OD"
          );
          const Policy_End_Date_OD_Control =
            this.SRForm.get("Policy_End_Date_OD");

          const Policy_Start_Date_TP_Control = this.SRForm.get(
            "Policy_Start_Date_TP"
          );
          const Policy_End_Date_TP_Control =
            this.SRForm.get("Policy_End_Date_TP");

          var OD_Days = result["Data"]["OD_Days"];
          var TP_Days = result["Data"]["TP_Days"];

          //alert(this.CheckLeapYear());

          if (OD_Days == TP_Days) {
            this.Is_Policy_OD = 0;
            //Auto fill TP Start date and end date
            //alert(TP_Days);

            //if( this.CheckLeapYear() == 'IsLeapYear'){
            //TP_Days = (Number(TP_Days)-1);
            //}

            this.global_TP_Days = TP_Days;

            Policy_Start_Date_TP_Control.setValue(this.CurrentDate());
            Policy_End_Date_TP_Control.setValue(
              this.AddDaysInCurrentDate(TP_Days)
            );

            Policy_Start_Date_OD_Control.setValidators(null);
            Policy_End_Date_OD_Control.setValidators(null);

            Policy_Start_Date_OD_Control.updateValueAndValidity();
            Policy_End_Date_OD_Control.updateValueAndValidity();
          } else if (OD_Days != TP_Days) {
            this.Is_Policy_OD = 1;
            //Auto Fill OD & TP start date and end date
            if (this.CheckLeapYear() == "IsLeapYear") {
              TP_Days = Number(TP_Days) - 1;
            }

            this.global_OD_Days = OD_Days;
            this.global_TP_Days = TP_Days;

            Policy_Start_Date_OD_Control.setValue(this.CurrentDate());
            Policy_End_Date_OD_Control.setValue(
              this.AddDaysInCurrentDate(OD_Days)
            );

            // console.log(this.CurrentDate());
            // console.log(this.AddDaysInCurrentDate(OD_Days));

            Policy_Start_Date_TP_Control.setValue(this.CurrentDate());
            Policy_End_Date_TP_Control.setValue(
              this.AddDaysInCurrentDate(TP_Days)
            );

            Policy_Start_Date_OD_Control.setValidators([Validators.required]);
            Policy_End_Date_OD_Control.setValidators([Validators.required]);

            //Policy_Start_Date_OD_Control.updateValueAndValidity();
            //Policy_End_Date_OD_Control.updateValueAndValidity();

            //alert(TP_Days);
          }

          //Auto Fill OD and TP Date

          this.Get_PCV_TP_Premium_Per_Passenger();
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  Get_TP_Premium() {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Class_Id", this.SRForm.value["Class_Id"]);
    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/TP_Premium", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.TP_Premium = result["Data"]["TP_Premium"];
          this.Per_Passenger_Cost = result["Data"]["Per_Passenger_Cost"];

          //alert('Per_Passenger_Cost'+ this.Per_Passenger_Cost);

          //alert(result['Data']['TP_Premium']);
          const Basic_TP_Control = this.SRForm.get("Basic_TP");
          Basic_TP_Control.setValue(result["Data"]["TP_Premium"]);

          //Auto Fill OD and TP Date
          const Policy_Start_Date_OD_Control = this.SRForm.get(
            "Policy_Start_Date_OD"
          );
          const Policy_End_Date_OD_Control =
            this.SRForm.get("Policy_End_Date_OD");

          const Policy_Start_Date_TP_Control = this.SRForm.get(
            "Policy_Start_Date_TP"
          );
          const Policy_End_Date_TP_Control =
            this.SRForm.get("Policy_End_Date_TP");

          var OD_Days = result["Data"]["OD_Days"];
          var TP_Days = result["Data"]["TP_Days"];

          //alert(this.CheckLeapYear());

          if (OD_Days == TP_Days) {
            this.Is_Policy_OD = 0;
            //Auto fill TP Start date and end date
            //alert(TP_Days);

            //if( this.CheckLeapYear() == 'IsLeapYear'){
            //TP_Days = (Number(TP_Days)-1);
            //}

            this.global_TP_Days = TP_Days;

            Policy_Start_Date_TP_Control.setValue(this.CurrentDate());
            Policy_End_Date_TP_Control.setValue(
              this.AddDaysInCurrentDate(TP_Days)
            );

            Policy_Start_Date_OD_Control.setValidators(null);
            Policy_End_Date_OD_Control.setValidators(null);

            Policy_Start_Date_OD_Control.updateValueAndValidity();
            Policy_End_Date_OD_Control.updateValueAndValidity();
          } else if (OD_Days != TP_Days) {
            this.Is_Policy_OD = 1;
            //Auto Fill OD & TP start date and end date
            if (this.CheckLeapYear() == "IsLeapYear") {
              TP_Days = Number(TP_Days) - 1;
            }

            this.global_OD_Days = OD_Days;
            this.global_TP_Days = TP_Days;

            Policy_Start_Date_OD_Control.setValue(this.CurrentDate());
            Policy_End_Date_OD_Control.setValue(
              this.AddDaysInCurrentDate(OD_Days)
            );

            // console.log(this.CurrentDate());
            // console.log(this.AddDaysInCurrentDate(OD_Days));

            Policy_Start_Date_TP_Control.setValue(this.CurrentDate());
            Policy_End_Date_TP_Control.setValue(
              this.AddDaysInCurrentDate(TP_Days)
            );

            Policy_Start_Date_OD_Control.setValidators([Validators.required]);
            Policy_End_Date_OD_Control.setValidators([Validators.required]);

            //Policy_Start_Date_OD_Control.updateValueAndValidity();
            //Policy_End_Date_OD_Control.updateValueAndValidity();

            //alert(TP_Days);
          }

          //Auto Fill OD and TP Date
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  CurrentDate() {
    var d = new Date();
    d.setDate(d.getDate());
    var Current_Date_v =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    return Current_Date_v;
  }
  AddDaysInCurrentDate(Days) {
    var d = new Date();
    d.setDate(d.getDate() + Number(Days));
    var AddDays_Date =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    return AddDays_Date;
  }
  CheckLeapYear() {
    //define variables
    var year;
    var d = new Date();
    year = d.getFullYear();
    //three conditions to find out the leap year
    if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
      // console.log(year+" is a leap year");
      return "IsLeapYear";
    } else {
      // console.log(year+" is not a leap year");
      return "IsNoLeapYear";
    }
  }

  onChangePolicyStartDate_OD() {
    //if(this.OD_Change == 'No'){
    const Policy_End_Date_OD_Control = this.SRForm.get("Policy_End_Date_OD");

    this.SRForm.get("Policy_Start_Date_OD").valueChanges.subscribe((v) => {
      // console.log('OD Onchange');
      // console.log(v);
      // console.log(this.global_OD_Days);
      var d = new Date(v);
      d.setDate(d.getDate() + Number(this.global_OD_Days));

      var Policy_End_Date_OD =
        d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
      //alert(Policy_End_Date_OD);
      Policy_End_Date_OD_Control.setValue(Policy_End_Date_OD);
    });
    //}
  }

  onChangePolicyStartDate() {
    const Policy_End_Date_TP_Control = this.SRForm.get("Policy_End_Date_TP");
    this.SRForm.get("Policy_Start_Date_TP").valueChanges.subscribe((v) => {
      //alert(v);
      var d = new Date(v);
      d.setDate(d.getDate() + Number(this.global_TP_Days));

      var Policy_End_Date_TP =
        d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
      //alert(Policy_End_Date_TP);
      Policy_End_Date_TP_Control.setValue(Policy_End_Date_TP);
    });
  }

  onChangePurchaseDate() {
    const Manufacture_Year_Control = this.SRForm.get("Manufacture_Year");
    this.SRForm.get("Purchase_Date").valueChanges.subscribe((v) => {
      //alert(v);
      if (v != "" && v != null) {
        var d = new Date(v);
        var Manufacture_Year = d.getFullYear();
        //alert(Manufacture_Year);
        Manufacture_Year_Control.setValue(Manufacture_Year);
      } else {
        Manufacture_Year_Control.setValue("");
      }
    });
  }

  onChangePre_Expiry_Date() {
    const Pre_Expiry_Date_Control = this.SRForm.get("Pre_Expiry_Date");

    this.SRForm.get("Pre_Expiry_Date").valueChanges.subscribe((v) => {
      //alert(v);
      if (v != "" && v != null) {
        var Policy_Start_Date_TP = this.SRForm.value["Policy_Start_Date_TP"];

        // console.log(Policy_Start_Date_TP);

        if (Policy_Start_Date_TP == "") {
          alert("Please choose Policy Start Date !");
          Pre_Expiry_Date_Control.setValue("");
        } else {
          var Policy_Start_Date = new Date(Policy_Start_Date_TP);
          var Expiry_Date = new Date(v);

          //// console.log(Policy_Start_Date);
          //// console.log(Expiry_Date);

          if (Policy_Start_Date.getTime() < Expiry_Date.getTime()) {
            // console.log("Previous Policy Expiry Date is lesser than Policy Start Date !");
            alert(
              "Previous Policy Expiry Date is lesser than Policy Start Date !"
            );
            Pre_Expiry_Date_Control.setValue("");
          } else {
          }
        }
      } else {
        //Pre_Expiry_Date_Control.setValue('');
      }
    });
  }

  Get_PCV_TP_Premium_Per_Passenger() {
    const formData = new FormData();

    formData.append("Make_Id", this.SRForm.value["Make_Id"]);
    formData.append("Model_Id", this.SRForm.value["Model_Id"]);
    formData.append("Variant_Id", this.SRForm.value["Variant_Id"]);

    this.api.IsLoading();
    this.api
      .HttpPostType("sr/MainSR/PCV_TP_Premium_Per_Passenger", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            //alert('hello');
            //alert(this.TP_Premium);

            var Seating_Capcity = result["Data"]["Seating_Capcity"];
            var GVW_CC = result["Data"]["GVW_CC"];

            const Seating_Capcity_Control = this.SRForm.get("Seating_Capcity");
            const GVW_CC_Control = this.SRForm.get("GVW_CC");

            // console.log('TP_Premium : ' + this.TP_Premium);
            // console.log('Per_Passenger_Cost : ' + this.Per_Passenger_Cost);
            // console.log('Seating_Capcity : ' + Seating_Capcity);

            Seating_Capcity_Control.setValue(Seating_Capcity);
            GVW_CC_Control.setValue(GVW_CC);

            if (
              this.SRForm.value["Class_Id"] == "Passenger Carrying Vehicles" ||
              this.SRForm.value["Class_Id"] == "Two Wheeler" ||
              this.SRForm.value["Class_Id"] == "Private Cars"
            ) {
              this.IsSeatingCapcityEdit = "1";

              var Final_PCV_TP =
                parseInt(this.TP_Premium) +
                parseInt(this.Per_Passenger_Cost) * parseInt(Seating_Capcity);
              //alert(Final_PCV_TP);
              // console.log('Final_PCV_TP If : -' + Final_PCV_TP);
            } else {
              var Final_PCV_TP = parseInt(this.TP_Premium);
              // console.log('Final_PCV_TP Else : -' + Final_PCV_TP);

              this.IsSeatingCapcityEdit = "0";
            }

            //alert(result['Data']['TP_Premium']);
            const Basic_TP_Control = this.SRForm.get("Basic_TP");
            Basic_TP_Control.setValue(Final_PCV_TP);
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
  }

  CustomSeatingCUpdate(e) {
    var Seating_Capcity = e.target.value;

    // console.log('TP_Premium Custom : ' + this.TP_Premium);
    // console.log('Per_Passenger_Cost Custom : ' + this.Per_Passenger_Cost);
    // console.log('Seating Capcity Custom : ' + Seating_Capcity);

    var Final_PCV_TP =
      parseInt(this.TP_Premium) +
      parseInt(this.Per_Passenger_Cost) * parseInt(Seating_Capcity);

    // console.log('Final_PCV_TP Custom : ' + Final_PCV_TP);

    const Basic_TP_Control = this.SRForm.get("Basic_TP");
    Basic_TP_Control.setValue(Final_PCV_TP);
    this.NetPremium();
  }

  Model(e) {
    const formData = new FormData();

    formData.append("Sub_Class_Id", this.SRForm.value["Sub_Class_Id"]);
    formData.append("Make_Id", this.SRForm.value["Make_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Models", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SRForm.get("Model_Id").setValue("");
        this.SRForm.get("Variant_Id").setValue("");
        this.SRForm.get("Seating_Capcity").setValue("");

        this.Models_Ar = [];
        this.Variants_Ar = [];

        if (result["Status"] == true) {
          this.Models_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }
  Variant(e) {
    const formData = new FormData();

    formData.append("Make_Id", this.SRForm.value["Make_Id"]);
    formData.append("Model_Id", this.SRForm.value["Model_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Variants", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SRForm.get("Variant_Id").setValue("");
        this.SRForm.get("Seating_Capcity").setValue("");

        if (result["Status"] == true) {
          this.Variants_Ar = result["Data"];
        } else {
          this.Variants_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  // Non Motor Functions Start

  NM_Classess(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/NM_Classess", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Classes_Ar = [];
        this.Products_Ar = [];
        this.SubProducts_Ar = [];

        this.SRForm.get("Class_Id").setValue("");
        this.SRForm.get("Product_Id").setValue("");
        this.SRForm.get("SubProduct_Id").setValue("");

        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }
  NM_Products(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Class_Id", this.SRForm.value["Class_Id"]);

    const SubProduct_Id_Control = this.SRForm.get("SubProduct_Id");

    if (this.SRForm.value["LOB_Id"] == "Health") {
      SubProduct_Id_Control.setValidators(null);
    } else {
      SubProduct_Id_Control.setValidators([Validators.required]);
    }
    SubProduct_Id_Control.updateValueAndValidity();

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/NM_Products", formData).then(
      (result) => {
        this.api.HideLoading();

        this.Products_Ar = [];
        this.SubProducts_Ar = [];

        this.SRForm.get("Product_Id").setValue("");
        this.SRForm.get("SubProduct_Id").setValue("");

        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }
  NM_SubProducts(e) {
    const formData = new FormData();

    formData.append("LOB_Id", this.SRForm.value["LOB_Id"]);
    formData.append("Segment_Id", this.SRForm.value["Segment_Id"]);
    formData.append("Class_Id", this.SRForm.value["Class_Id"]);
    formData.append("Product_Id", this.SRForm.value["Product_Id"]);

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/NM_SubProducts", formData).then(
      (result) => {
        this.api.HideLoading();

        this.SubProducts_Ar = [];

        this.SRForm.get("SubProduct_Id").setValue("");

        if (result["Status"] == true) {
          this.SubProducts_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }
  // Non Motor Functions End

  onChangePA_Owner() {
    this.SRForm.get("PA_Owner").valueChanges.subscribe((Status) => {
      const Insurance_Company_Id_Control = this.SRForm.get(
        "Insurance_Company_Id"
      );
      const PA_Owner_Tenure_Control = this.SRForm.get("PA_Owner_Tenure");
      Insurance_Company_Id_Control.setValue("");

      if (Status == "No") {
        //alert(Status);
        const PA_Owner_Premium_Control = this.SRForm.get("PA_Owner_Premium");
        PA_Owner_Premium_Control.setValue(0);

        PA_Owner_Tenure_Control.setValue(null);
        PA_Owner_Tenure_Control.disable();
        PA_Owner_Tenure_Control.setValidators(null);
      } else {
        PA_Owner_Tenure_Control.enable();
        PA_Owner_Tenure_Control.setValidators([Validators.required]);
      }
    });
  }

  onChangePA_Owner_Tenure() {
    this.SRForm.get("PA_Owner_Tenure").valueChanges.subscribe((Status) => {
      const Insurance_Company_Id_Control = this.SRForm.get(
        "Insurance_Company_Id"
      );
      Insurance_Company_Id_Control.setValue("");
      const PA_Owner_Premium_Control = this.SRForm.get("PA_Owner_Premium");
      PA_Owner_Premium_Control.setValue(0);
    });
  }

  Ins_Companies_Branch(e) {
    const formData = new FormData();

    formData.append("PA_Owner_Tenure", this.SRForm.value["PA_Owner_Tenure"]);
    formData.append("SubProduct_Id", this.SRForm.value["SubProduct_Id"]);
    formData.append(
      "Insurance_Company_Id",
      this.SRForm.value["Insurance_Company_Id"]
    );

    this.api.IsLoading();
    this.api.HttpPostType("sr/MainSR/Ins_Companies_Branch_New", formData).then(
      (result) => {
        //this.api.Call('sr/MainSR/Ins_Companies_Branch?Insurance_Company_Id='+Insurance_Company_Id).then((result:any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Ins_Branch_Companies_Ar = result["Data"];

          const Class_Id = this.SRForm.value["Class_Id"];

          var PW_Owner = 0;

          if (Class_Id == "Misc D") {
            // MISD
            PW_Owner = result["CompanyData"]["MISD"];
          }
          if (Class_Id == "Passenger Carrying Vehicles") {
            //PCV
            PW_Owner = result["CompanyData"]["PCV"];
          }
          if (Class_Id == "Private Carrier" || Class_Id == "Public Carrier") {
            //GCV
            PW_Owner = result["CompanyData"]["GCV"];
          }
          if (Class_Id == "Two Wheeler") {
            // TW
            PW_Owner = result["CompanyData"]["TW"];
          }
          if (Class_Id == "Private Cars") {
            // PVT
            PW_Owner = result["CompanyData"]["PVT"];
          }

          //alert(PW_Owner);
          const PA_Owner_Premium_Control = this.SRForm.get("PA_Owner_Premium");
          const PA_Owner_Tenure = this.SRForm.value["PA_Owner_Tenure"]
            ? this.SRForm.value["PA_Owner_Tenure"]
            : 0;

          if (this.SRForm.value["PA_Owner"] == "Yes") {
            //alert(PA_Owner_Tenure);
            //alert(PW_Owner);

            PA_Owner_Premium_Control.setValue(
              Math.round(PW_Owner * PA_Owner_Tenure)
            );
          } else {
            PA_Owner_Premium_Control.setValue(0);
          }
        } else {
          this.Ins_Branch_Companies_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }
  RTO() {
    const State_Id = this.SRForm.value["State_Id"];

    this.api.IsLoading();
    this.api.Call("sr/MainSR/RTO?State_Id=" + State_Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.RTO_Ar = result["Data"];
        } else {
          this.RTO_Ar = [];
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  buildForm() {
    this.SRForm = this.formBuilder.group({
      LOB_Id: ["", [Validators.required]],
      File_Type: [""],
      Insurer_Renewal: [{ value: "", disabled: true }],
      PA_Owner: [""],
      PA_Owner_Tenure: [""],

      Class_Id: ["", [Validators.required]],
      Sub_Class_Id: ["", [Validators.required]],
      Segment_Id: ["", [Validators.required]],
      Product_Id: ["", [Validators.required]],
      SubProduct_Id: ["", [Validators.required]],

      Make_Id: ["", [Validators.required]],
      Model_Id: ["", [Validators.required]],
      Variant_Id: ["", [Validators.required]],

      Seating_Capcity: [""],
      Registration_State_Code: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      Registration_District_Code: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      Registration_City_Code: [
        "",
        [
          Validators.required,
          Validators.pattern("^$|^[A-Za-z0-9]+"),
          Validators.minLength(3),
          Validators.maxLength(3),
        ],
      ],
      Registration_Code: [
        "",
        [
          Validators.required,
          Validators.pattern("^^[0-9]*$"),
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],

      Purchase_Date: ["", [Validators.required]],
      Manufacture_Year: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      Engine_No: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]+$"),
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      Chasis_No: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]+$"),
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],

      Insurance_Company_Id: ["", [Validators.required]],
      Insurance_Company_Branch_Id: ["", [Validators.required]],
      State_Id: ["", [Validators.required]],
      RTO_Id: ["", [Validators.required]],

      Insured_Type: ["", [Validators.required]],
      Salutation_Type: ["", [Validators.required]],

      Customer_Name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Customer_Mobile: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Customer_Alternate_Mobile: ["", [Validators.pattern("^[0-9]*$")]],

      Policy_Start_Date_OD: [""],
      Policy_End_Date_OD: [""],
      Policy_Start_Date_TP: ["", [Validators.required]],
      Policy_End_Date_TP: ["", [Validators.required]],
      Policy_Status: ["", [Validators.required]],
      Policy_No: ["", [Validators.required]],

      Previous_Policy_Status: ["Yes", [Validators.required]],
      Pre_Insurer_Name: ["", [Validators.required]],
      Pre_Policy_No: ["", [Validators.required]],
      Pre_Expiry_Date: ["", [Validators.required]],

      Payment_Towards: ["", [Validators.required]],
      Mode_Of_Payment: ["", [Validators.required]],
      Payment_Cheque_Ref_No: ["", [Validators.required]],

      Payout_MOD: [""],
      Payout_Remark: [""],

      Payout_OD: [""],
      Payout_TP: [""],
      Payout_Net: [""],
      Payout_Reward: [""],
      Payout_Scheme: [""],

      Payout_OD_Amount: [""],
      Payout_TP_Amount: [""],
      Payout_Net_Amount: [""],
      Payout_Reward_Amount: [""],
      Payout_Scheme_Amount: [""],

      Payout_Total_Amount: [""],

      TPPD: ["", [Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Basic_OD: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Basic_TP: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Other_TP: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      PA_Owner_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Net_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      Estimated_Gross_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],

      IDV: ["", [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")]],
      NCB: ["", [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")]],
      Discount: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],

      Terrorism_Premium: ["", [Validators.pattern("^[0-9]*$")]],
      Sum_Insured: ["", [Validators.pattern("^[0-9]*$")]],

      Underwriter_Emp_Id: [],
      Operation_Id: [],
      Accounts_Id: [],

      AssignType: [],
      AssignUserId: ["", [Validators.required]],
      AssignRemark: ["", [Validators.required]],
      AssignActionType: [],

      RC_Motor_Registraion: [""],
      Previous_Policy_Copy: [""],
      Cheque_Payment_Recipt: [""],
      Mandate_Status: ["Yes"],
      Mandate_Letter: [""],
      Invoice: [""],
      Renewal_Notice: [""],
      Other: [""],
      PolicyPDF: [],
      //Mandate_Status: [],

      Employee_Code: [],
      Employee_Password: [],
    });
  }

  get FC() {
    return this.SRForm.controls;
  }

  onChangeFileType_Status(e) {
    this.File_Type_Str = e.target.value;
    // console.log(this.File_Type_Str);
  }

  RegType(e) {
    this.RegistrationType = e.target.value;

    if (this.RegistrationType == "Normal") {
      this.SRForm.get("State_Id").setValidators([Validators.required]);
      this.SRForm.get("RTO_Id").setValidators([Validators.required]);
    } else {
      // console.log(this.SRForm.get['File_Type']);
      //if(this.SRForm.value['File_Type'] == 'New'){

      this.SRForm.get("Registration_State_Code").setValidators(null);
      this.SRForm.get("Registration_District_Code").setValidators(null);
      this.SRForm.get("Registration_City_Code").setValidators(null);
      this.SRForm.get("Registration_Code").setValidators(null);

      this.SRForm.get("State_Id").setValidators(null);
      this.SRForm.get("RTO_Id").setValidators(null);
      //}

      this.StateSearchErrorMsg = "";
      this.RTOSearchErrorMsg = "";
    }
    this.SRForm.get("Registration_State_Code").updateValueAndValidity();
    this.SRForm.get("Registration_District_Code").updateValueAndValidity();
    this.SRForm.get("Registration_City_Code").updateValueAndValidity();
    this.SRForm.get("Registration_Code").updateValueAndValidity();

    this.SRForm.get("State_Id").updateValueAndValidity();
    this.SRForm.get("RTO_Id").updateValueAndValidity();
    // console.log(this.RegistrationType);
  }

  onChange_State() {
    this.SRForm.get("Registration_State_Code").valueChanges.subscribe((v) => {
      const District_Code = this.SRForm.value["Registration_District_Code"];
      const State_Id_Control = this.SRForm.get("State_Id");
      if (this.RegistrationType == "Normal") {
        if (this.SRForm.value["LOB_Id"] == "Motor" && v != "") {
          this.api
            .Call(
              "sr/MainSR/Search_RTO_And_State?Type=State&State_Code_City_Code=" +
                v +
                "-" +
                District_Code
            )
            .then(
              (result) => {
                if (result["Status"] == true) {
                  const RTO_Id_Control = this.SRForm.get("RTO_Id");

                  State_Id_Control.setValue(result["Data"]["State_ID_FK"]);
                  this.RTO();
                  RTO_Id_Control.setValue(result["Data"]["RTO_Id"]);
                  this.StateSearchErrorMsg = "";
                } else {
                  if (v.length == 2) {
                    //this.api.ErrorMsg(result['Message']);
                    State_Id_Control.setValue("");
                    this.StateSearchErrorMsg = result["Message"];
                  }
                }
              },
              (err) => {
                this.api.ErrorMsg(
                  "Network Error, Please try again ! " + err.message
                );
              }
            );
        }
      }
    });
  }
  onChange_RTO() {
    this.SRForm.get("Registration_District_Code").valueChanges.subscribe(
      (v) => {
        const State_Code = this.SRForm.value["Registration_State_Code"];
        const RTO_Id_Control = this.SRForm.get("RTO_Id");
        if (this.RegistrationType == "Normal") {
          if (this.SRForm.value["LOB_Id"] == "Motor" && v != "") {
            this.api
              .Call(
                "sr/MainSR/Search_RTO_And_State?Type=RTO&State_Code_City_Code=" +
                  State_Code +
                  "-" +
                  v
              )
              .then(
                (result) => {
                  if (result["Status"] == true) {
                    const State_Id_Control = this.SRForm.get("State_Id");

                    State_Id_Control.setValue(result["Data"]["State_ID_FK"]);
                    this.RTO();
                    RTO_Id_Control.setValue(result["Data"]["RTO_Id"]);

                    this.RTOSearchErrorMsg = "";
                  } else {
                    if (v.length == 2) {
                      //this.api.ErrorMsg(result['Message']);
                      RTO_Id_Control.setValue("");
                      this.RTOSearchErrorMsg = result["Message"];
                    }
                  }
                },
                (err) => {
                  this.api.ErrorMsg(
                    "Network Error, Please try again ! " + err.message
                  );
                }
              );
          }
        }
      }
    );
  }

  FileType_Status() {
    const Insurer_Renewal_Control = this.SRForm.get("Insurer_Renewal");

    const Terrorism_Premium_Control = this.SRForm.get("Terrorism_Premium");

    const Previous_Policy_Status_Control = this.SRForm.get(
      "Previous_Policy_Status"
    );
    const Pre_Insurer_NameControl = this.SRForm.get("Pre_Insurer_Name");
    const Pre_Policy_NoControl = this.SRForm.get("Pre_Policy_No");
    const Pre_Expiry_DateControl = this.SRForm.get("Pre_Expiry_Date");

    const Registration_State_Code_Control = this.SRForm.get(
      "Registration_State_Code"
    );
    const Registration_District_Code_Control = this.SRForm.get(
      "Registration_District_Code"
    );
    const Registration_City_Code_Control = this.SRForm.get(
      "Registration_City_Code"
    );
    const Registration_Code_Control = this.SRForm.get("Registration_Code");

    this.SRForm.get("File_Type").valueChanges.subscribe((Type) => {
      Terrorism_Premium_Control.setValidators(null);

      if (this.SRForm.value["LOB_Id"] == "Motor") {
        Registration_State_Code_Control.setValidators([
          Validators.required,
          Validators.pattern("[a-zA-Z ]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ]);
        Registration_District_Code_Control.setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
          Validators.maxLength(2),
        ]);
        Registration_City_Code_Control.setValidators([
          Validators.required,
          Validators.pattern("^$|^[A-Za-z0-9]+"),
          Validators.minLength(2),
          Validators.maxLength(3),
        ]);
        Registration_Code_Control.setValidators([
          Validators.required,
          Validators.pattern("^^[0-9]*$"),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]);

        if (Type == "New") {
          Insurer_Renewal_Control.setValidators(null);

          Insurer_Renewal_Control.disable();

          //disable previous policy status new

          Previous_Policy_Status_Control.setValidators(null);
          Pre_Insurer_NameControl.setValidators(null);
          Pre_Policy_NoControl.setValidators(null);
          Pre_Expiry_DateControl.setValidators(null);

          Previous_Policy_Status_Control.disable();
          Pre_Insurer_NameControl.disable();
          Pre_Policy_NoControl.disable();
          Pre_Expiry_DateControl.disable();

          //disable previous policy status new

          Registration_State_Code_Control.setValidators([
            Validators.pattern("[a-zA-Z ]*$"),
            Validators.minLength(2),
            Validators.maxLength(2),
          ]);
          Registration_District_Code_Control.setValidators([
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(2),
            Validators.maxLength(2),
          ]);
          Registration_City_Code_Control.setValidators([
            Validators.pattern("^$|^[A-Za-z0-9]+"),
            Validators.minLength(2),
            Validators.maxLength(3),
          ]);
          Registration_Code_Control.setValidators([
            Validators.pattern("^^[0-9]*$"),
            Validators.minLength(4),
            Validators.maxLength(4),
          ]);
        }

        if (Type == "Used") {
        }

        if (Type == "Rollover" || Type == "Renewal") {
          Insurer_Renewal_Control.setValidators([Validators.required]);

          Insurer_Renewal_Control.enable();

          //disable previous policy status new
          Pre_Insurer_NameControl.setValidators([Validators.required]);
          Pre_Policy_NoControl.setValidators([Validators.required]);
          Pre_Expiry_DateControl.setValidators([Validators.required]);

          Pre_Insurer_NameControl.enable();
          Pre_Policy_NoControl.enable();
          Pre_Expiry_DateControl.enable();
          //disable previous policy status new

          Previous_Policy_Status_Control.enable();
        }

        Insurer_Renewal_Control.reset();

        Insurer_Renewal_Control.updateValueAndValidity();

        //disable previous policy status new
        Pre_Insurer_NameControl.updateValueAndValidity();
        Pre_Policy_NoControl.updateValueAndValidity();
        Pre_Expiry_DateControl.updateValueAndValidity();
        //disable previous policy status new

        Registration_State_Code_Control.updateValueAndValidity();
        Registration_District_Code_Control.updateValueAndValidity();
        Registration_City_Code_Control.updateValueAndValidity();
        Registration_Code_Control.updateValueAndValidity();
      } // end of Motor

      if (this.SRForm.value["LOB_Id"] == "Health") {
        if (Type == "Fresh") {
          Insurer_Renewal_Control.setValidators(null);
          Insurer_Renewal_Control.disable();
        } else if (Type == "Port") {
          Insurer_Renewal_Control.setValidators(null);
          Insurer_Renewal_Control.disable();
        } else if (Type == "Renewal") {
          Insurer_Renewal_Control.setValidators([Validators.required]);
          Insurer_Renewal_Control.enable();
        }
        Insurer_Renewal_Control.reset();
        Insurer_Renewal_Control.updateValueAndValidity();
      }

      if (this.SRForm.value["LOB_Id"] == "Non Motor") {
        if (Type == "Fresh") {
          Insurer_Renewal_Control.setValidators(null);
          Insurer_Renewal_Control.disable();
        } else if (Type == "Renewal") {
          Insurer_Renewal_Control.setValidators(null);
          Insurer_Renewal_Control.disable();
        } else if (Type == "Rollover") {
          Insurer_Renewal_Control.setValidators([Validators.required]);
          Insurer_Renewal_Control.enable();

          Terrorism_Premium_Control.setValidators([
            Validators.required,
            Validators.pattern("^[0-9]*$"),
          ]);
        }
        Insurer_Renewal_Control.reset();
        Insurer_Renewal_Control.updateValueAndValidity();
      }

      Terrorism_Premium_Control.updateValueAndValidity();
    });
  }

  MandateLetterStatus(type) {
    const Mandate_Letter_Control = this.SRForm.get("Mandate_Letter");
    if (type == "Yes") {
      Mandate_Letter_Control.setValidators([Validators.required]);
    } else {
      Mandate_Letter_Control.setValidators(null);
    }
    Mandate_Letter_Control.updateValueAndValidity();
  }

  Policy_Status() {
    const Policy_NoControl = this.SRForm.get("Policy_No");

    this.SRForm.get("Policy_Status").valueChanges.subscribe((Status) => {
      if (Status == "Not-Issued") {
        Policy_NoControl.setValidators(null);
        Policy_NoControl.disable();
      }
      if (Status == "Issued") {
        Policy_NoControl.setValidators([Validators.required]);
        Policy_NoControl.enable();
      }
      Policy_NoControl.updateValueAndValidity();
    });
  }

  PreviousPolicyStatus() {
    const Pre_Insurer_NameControl = this.SRForm.get("Pre_Insurer_Name");
    const Pre_Policy_NoControl = this.SRForm.get("Pre_Policy_No");
    const Pre_Expiry_DateControl = this.SRForm.get("Pre_Expiry_Date");

    this.SRForm.get("Previous_Policy_Status").valueChanges.subscribe(
      (Status) => {
        if (Status == "No") {
          Pre_Insurer_NameControl.setValidators(null);
          Pre_Policy_NoControl.setValidators(null);
          Pre_Expiry_DateControl.setValidators(null);

          Pre_Insurer_NameControl.disable();
          Pre_Policy_NoControl.disable();
          Pre_Expiry_DateControl.disable();
        }
        if (Status == "Yes") {
          Pre_Insurer_NameControl.setValidators([Validators.required]);
          Pre_Policy_NoControl.setValidators([Validators.required]);
          Pre_Expiry_DateControl.setValidators([Validators.required]);

          Pre_Insurer_NameControl.enable();
          Pre_Policy_NoControl.enable();
          Pre_Expiry_DateControl.enable();
        }

        Pre_Insurer_NameControl.updateValueAndValidity();
        Pre_Policy_NoControl.updateValueAndValidity();
        Pre_Expiry_DateControl.updateValueAndValidity();
      }
    );
  }

  onChangeSegment() {
    const Basic_OD_Control = this.SRForm.get("Basic_OD");
    const Basic_TP_Control = this.SRForm.get("Basic_TP");
    const Other_TP_Control = this.SRForm.get("Other_TP");
    var PA_Owner_Premium_Control = this.SRForm.get("PA_Owner_Premium");
    var Net_Premium_Control = this.SRForm.get("Net_Premium");
    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );

    this.SRForm.get("Segment_Id").valueChanges.subscribe((Type) => {
      Basic_OD_Control.setValue(0);
      Other_TP_Control.setValue(0);
      Net_Premium_Control.setValue(0);
      Estimated_Gross_Premium_Control.setValue(0);
      //alert('reset');

      if (Type == "Comprehensive") {
        Basic_TP_Control.setValue(0);
        PA_Owner_Premium_Control.setValue(0);

        Basic_OD_Control.setValidators([Validators.required]);
        Basic_OD_Control.enable();

        Basic_TP_Control.setValidators([Validators.required]);
        Basic_TP_Control.enable();
      } else if (Type == "Standalone Third Party") {
        Basic_TP_Control.setValue(0);
        PA_Owner_Premium_Control.setValue(0);

        Basic_OD_Control.setValidators(null);
        Basic_OD_Control.disable();

        Basic_TP_Control.setValidators([Validators.required]);
        Basic_TP_Control.enable();
      } else if (Type == "Standalone Own Damage") {
        Basic_TP_Control.setValue(0);
        PA_Owner_Premium_Control.setValue(0);

        Basic_OD_Control.setValidators([Validators.required]);
        Basic_OD_Control.enable();

        Basic_TP_Control.setValidators(null);
        Basic_TP_Control.disable();
      }

      Basic_OD_Control.updateValueAndValidity();
      Basic_TP_Control.updateValueAndValidity();
    });
  }

  TPPD() {
    var TPPD = this.SRForm.value["TPPD"] ? this.SRForm.value["TPPD"] : 0;
    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;

    var Basic_TP_Control = this.SRForm.get("Basic_TP");

    var TPPDValue = parseInt(Basic_TP) - parseInt(TPPD);

    Basic_TP_Control.setValue(Math.round(TPPDValue));
  }

  Basic_OD() {
    var Net_Premium_Control = this.SRForm.get("Net_Premium");

    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );

    var Basic_OD = this.SRForm.value["Basic_OD"]
      ? this.SRForm.value["Basic_OD"]
      : 0;
    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;
    var Other_TP = this.SRForm.value["Other_TP"]
      ? this.SRForm.value["Other_TP"]
      : 0;
    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    // console.log(this.Vehicle_Type);

    var Segment_Type = this.SRForm.value["Segment_Id"];

    if (Segment_Type == "Comprehensive") {
      // Segment Type Comprehensive

      var Net_Premium =
        parseInt(Basic_OD) +
        parseInt(Basic_TP) +
        parseInt(Other_TP) +
        parseInt(PA_Owner_Premium);
      var Net_Premium_V =
        parseInt(Basic_OD) +
        parseInt(Basic_TP) +
        parseInt(Other_TP) +
        parseInt(PA_Owner_Premium);

      Net_Premium_Control.setValue(Net_Premium);

      var GST_AMT = (Net_Premium_V * 18) / 100;
      var Gross_Premium = Net_Premium_V + GST_AMT;

      if (this.Vehicle_Type == "GCV") {
        var six_ = (parseInt(Basic_TP) * 6) / 100;
        Estimated_Gross_Premium_Control.setValue(
          Math.round(Gross_Premium) - six_
        );
      } else {
        Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
      }
    } else if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');
    } else if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');

      var Net_Premium =
        parseInt(Basic_OD) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);
      var Net_Premium_V =
        parseInt(Basic_OD) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      Net_Premium_Control.setValue(Net_Premium);

      var GST_AMT = (Net_Premium_V * 18) / 100;
      var Gross_Premium = Net_Premium_V + GST_AMT;

      Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
    }
  }

  Other_TP() {
    var Basic_OD_Control = this.SRForm.get("Basic_OD");
    var Other_TP_Control = this.SRForm.get("Other_TP");

    var Net_Premium_Control = this.SRForm.get("Net_Premium");
    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );

    var Basic_OD = this.SRForm.value["Basic_OD"]
      ? this.SRForm.value["Basic_OD"]
      : 0;

    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;
    var Other_TP = this.SRForm.value["Other_TP"]
      ? this.SRForm.value["Other_TP"]
      : 0;
    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    var Net_Premium = this.SRForm.value["Net_Premium"]
      ? this.SRForm.value["Net_Premium"]
      : 0;

    var Segment_Type = this.SRForm.value["Segment_Id"];

    if (Segment_Type == "Comprehensive") {
      // Segment Type Comprehensive

      var Total =
        parseInt(Basic_TP) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      if (Basic_OD <= Other_TP) {
        //// console.log('asdff');
        Other_TP_Control.setValue(0);
        this.Other_TP_Error_Msg =
          "Other TP Can't Grater than Or Equal Final OD !";
        return;
      } else {
        //// console.log('test');
        this.Other_TP_Error_Msg = "";
        Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
      }
    } else if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');
      var Total_Net_Premium =
        parseInt(Basic_TP) + parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      Net_Premium_Control.setValue(Total_Net_Premium);

      var GST_AMT = (Total_Net_Premium * 18) / 100;
      var Gross_Premium = Total_Net_Premium + GST_AMT;

      if (this.Vehicle_Type == "GCV") {
        var six_ = (Basic_TP * 6) / 100;
        Estimated_Gross_Premium_Control.setValue(
          Math.round(Gross_Premium) - six_
        );
      } else {
        Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
      }
    } // end of segment Type Standalone Third Party
    else if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');
      var Total = parseInt(Other_TP) + parseInt(PA_Owner_Premium);

      if (Basic_OD <= Other_TP) {
        //// console.log('asdff');
        Other_TP_Control.setValue(0);
        this.Other_TP_Error_Msg =
          "Other TP Can't Grater than Or Equal Final OD !";
        return;
      } else {
        //// console.log('test');
        this.Other_TP_Error_Msg = "";
        Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
      }
    } // end of segment Type Standalone wn Damage
  }

  NetPremium() {
    var Basic_OD_Control = this.SRForm.get("Basic_OD");
    var Other_TP_Control = this.SRForm.get("Other_TP");

    var Estimated_Gross_Premium_Control = this.SRForm.get(
      "Estimated_Gross_Premium"
    );
    var Net_Premium = this.SRForm.value["Net_Premium"]
      ? this.SRForm.value["Net_Premium"]
      : 0;
    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;

    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    var Segment_Type = this.SRForm.value["Segment_Id"];

    if (Segment_Type == "Comprehensive") {
      // Segment Type Comprehensive

      var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

      if (Net >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg =
          "Can't less than Or Basic TP + P A Owner !";
        Basic_OD_Control.setValue(0);
        Estimated_Gross_Premium_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        Basic_OD_Control.setValue(Net_Premium - Net);

        var GST_AMT = (parseInt(Net_Premium) * 18) / 100;
        var Gross_Premium = parseInt(Net_Premium) + GST_AMT;

        if (this.Vehicle_Type == "GCV") {
          var six_ = (parseInt(Basic_TP) * 6) / 100;
          Estimated_Gross_Premium_Control.setValue(
            Math.round(Gross_Premium) - six_
          );
        } else {
          Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
        }
      }
    } // end of segment Type Comprehensive
    else if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');

      var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

      if (Net >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg =
          "Can't less than Or Basic TP + P A Owner !";
        Other_TP_Control.setValue(0);
        Estimated_Gross_Premium_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        Other_TP_Control.setValue(Net_Premium - Net);

        var GST_AMT = (parseInt(Net_Premium) * 18) / 100;
        var Gross_Premium = parseInt(Net_Premium) + GST_AMT;

        if (this.Vehicle_Type == "GCV") {
          var six_ = (parseInt(Basic_TP) * 6) / 100;
          Estimated_Gross_Premium_Control.setValue(
            Math.round(Gross_Premium) - six_
          );
        } else {
          Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
        }
      }
    } // end of segment Type Standalone Third Party
    else if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');

      var Net = parseInt(PA_Owner_Premium);

      if (Net >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg =
          "Can't less than Or Basic TP + P A Owner !";

        Estimated_Gross_Premium_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        var Other_TP = this.SRForm.value["Basic_TP"]
          ? this.SRForm.value["Other_TP"]
          : 0;

        var Net = parseInt(Other_TP) + parseInt(PA_Owner_Premium);

        Basic_OD_Control.setValue(Net_Premium - Net);

        var GST_AMT = (parseInt(Net_Premium) * 18) / 100;
        var Gross_Premium = parseInt(Net_Premium) + GST_AMT;

        Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium));
      }
    } // end of segment Type Standalone wn Damage
  }

  EstimatedGrossPremium() {
    var Net_Premium_Control = this.SRForm.get("Net_Premium");
    var Estimated_Gross_Premium = this.SRForm.value["Estimated_Gross_Premium"]
      ? this.SRForm.value["Estimated_Gross_Premium"]
      : 0;

    var Basic_OD_Control = this.SRForm.get("Basic_OD");
    var Other_TP_Control = this.SRForm.get("Other_TP");

    //var Estimated_Gross_Premium_Control = this.SRForm.get('Estimated_Gross_Premium');

    var Segment_Type = this.SRForm.value["Segment_Id"]
      ? this.SRForm.value["Segment_Id"]
      : 0;

    var Basic_OD = this.SRForm.value["Basic_OD"]
      ? this.SRForm.value["Basic_OD"]
      : 0;

    var Basic_TP = this.SRForm.value["Basic_TP"]
      ? this.SRForm.value["Basic_TP"]
      : 0;
    var Other_TP = this.SRForm.value["Other_TP"]
      ? this.SRForm.value["Other_TP"]
      : 0;
    var PA_Owner_Premium = this.SRForm.value["PA_Owner_Premium"]
      ? this.SRForm.value["PA_Owner_Premium"]
      : 0;

    var Net_Premium = this.SRForm.value["Net_Premium"]
      ? this.SRForm.value["Net_Premium"]
      : 0;

    // console.log('Tex Type :- ',this.Vehicle_Type );

    if (Segment_Type == "Comprehensive") {
      if (this.Vehicle_Type == "GCV") {
        //var six_ = parseInt(Basic_TP)*6/100;
        //Estimated_Gross_Premium_Control.setValue(Math.round(Gross_Premium)-six_);
        var _18 = (parseFloat(Basic_TP) * 12) / 100;

        //// console.log(_18);

        var final_Gross_Revs =
          parseFloat(Estimated_Gross_Premium) - (parseFloat(Basic_TP) + _18);

        //// console.log(final_Gross_Revs);

        var gross_after_basic_TP = (final_Gross_Revs * 100) / 118;

        //// console.log(gross_after_basic_TP);

        var add_basic_TP_Amt = parseFloat(Basic_TP) + gross_after_basic_TP;

        //// console.log(add_basic_TP_Amt);
        var New_Net_Premium = add_basic_TP_Amt;

        Net_Premium_Control.setValue(Math.round(New_Net_Premium));

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";

          var Net_Premium = this.SRForm.value["Net_Premium"]
            ? this.SRForm.value["Net_Premium"]
            : 0;
          var Total =
            parseInt(Basic_TP) +
            parseInt(Other_TP) +
            parseInt(PA_Owner_Premium);

          Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
        }
      } else {
        var Net = (parseInt(Estimated_Gross_Premium) * 100) / 118;
        Net_Premium_Control.setValue(Math.round(Net));

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";

          var Net_Premium = this.SRForm.value["Net_Premium"]
            ? this.SRForm.value["Net_Premium"]
            : 0;
          var Total =
            parseInt(Basic_TP) +
            parseInt(Other_TP) +
            parseInt(PA_Owner_Premium);

          Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
        }
      }
    } // end of Comprehensive

    if (Segment_Type == "Standalone Third Party") {
      //alert('SA TP');

      if (this.Vehicle_Type == "GCV") {
        var _18 = (parseFloat(Basic_TP) * 12) / 100;

        //// console.log(_18);

        var final_Gross_Revs =
          parseFloat(Estimated_Gross_Premium) - (parseFloat(Basic_TP) + _18);

        //// console.log(final_Gross_Revs);

        var gross_after_basic_TP = (final_Gross_Revs * 100) / 118;

        //// console.log(gross_after_basic_TP);

        var add_basic_TP_Amt = parseFloat(Basic_TP) + gross_after_basic_TP;

        //// console.log(add_basic_TP_Amt);
        var New_Net_Premium = add_basic_TP_Amt;

        Net_Premium_Control.setValue(Math.round(New_Net_Premium));

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";
        }

        var Total = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        Other_TP_Control.setValue(parseInt(Net_Premium) - Total);
      } else {
        // Other

        var Net = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Net_P = (parseInt(Estimated_Gross_Premium) * 100) / 118;

        Net_Premium_Control.setValue(Math.round(Net_P));
        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        // console.log(Net_Premium);

        if (Net >= parseInt(Net_Premium)) {
          this.Net_Premium_Error_Msg =
            "Can't less than Or Equal to Basic TP + P A Owner !";
          //Other_TP_Control.setValue(0);

          return;
        } else {
          this.Net_Premium_Error_Msg = "";

          // console.log(Net_Premium);

          var Total = parseInt(Basic_TP) + parseInt(PA_Owner_Premium);

          Other_TP_Control.setValue(parseInt(Net_Premium) - Total);
        }
      }
    }
    if (Segment_Type == "Standalone Own Damage") {
      //alert('SA OD');

      var Net = (parseInt(Estimated_Gross_Premium) * 100) / 118;
      Net_Premium_Control.setValue(Math.round(Net));

      var Net_Premium = this.SRForm.value["Net_Premium"]
        ? this.SRForm.value["Net_Premium"]
        : 0;
      // console.log(Net_Premium);

      if (parseInt(PA_Owner_Premium) >= parseInt(Net_Premium)) {
        this.Net_Premium_Error_Msg = "Can't less than Or Equal to P A Owner !";
        Basic_OD_Control.setValue(0);
        return;
      } else {
        this.Net_Premium_Error_Msg = "";

        var Net_Premium = this.SRForm.value["Net_Premium"]
          ? this.SRForm.value["Net_Premium"]
          : 0;
        var Total = parseInt(Other_TP) + parseInt(PA_Owner_Premium);

        Basic_OD_Control.setValue(parseInt(Net_Premium) - Total);
      }
    }
  }

  NM_NetPremium(e) {
    var NetPremium = e.target.value;
    // console.log(NetPremium);
    var GST_AMT = (parseInt(NetPremium) / 100) * 18;
    var Gross_Premium = parseInt(NetPremium) + GST_AMT;
    this.SRForm.get("Estimated_Gross_Premium").setValue(
      Math.round(Gross_Premium)
    );
  }
  NM_EstimatedGrossPremium(e) {
    var GrossPremium = e.target.value;
    // console.log(GrossPremium);

    var NetPremium = (parseInt(GrossPremium) * 100) / 118;
    this.SRForm.get("Net_Premium").setValue(Math.round(NetPremium));
  }

  GetRegistrionNo(e, Type) {
    // console.log(e.target.value);

    if (Type == 1) {
      this.Registration_State_Code_ = e.target.value;
    }
    if (Type == 2) {
      this.Registration_District_Code_ = e.target.value;
    }
    if (Type == 3) {
      this.Registration_City_Code_ = e.target.value;
    }
    if (Type == 4) {
      this.Registration_Code_ = e.target.value;
    }
  }

  onChangeAssignType(e, Type) {
    //alert(Type);
    var selectedUser_Id = e.target.value;
    // console.log(selectedUser_Id +'||'+ this.api.GetUserData('User_Id_Dec') );

    var PolicyPDF_Control = this.SRForm.get("PolicyPDF");

    if (this.api.GetUserData("User_Id_Dec") == selectedUser_Id) {
      this.Is_UW_Self_OPS = 1;
      Type = "Is_UW_Self_OPS";
      PolicyPDF_Control.setValidators([Validators.required]);
    } else {
      this.Is_UW_Self_OPS = 0;
      PolicyPDF_Control.setValidators(null);
    }
    //alert(Type);
    var AssignType_Control = this.SRForm.get("AssignType");
    AssignType_Control.setValue(Type);

    PolicyPDF_Control.updateValueAndValidity();
  }

  SubmitActions(Action) {
    //submit actions
    //alert(Action);
    var AssignUserId_Control = this.SRForm.get("AssignUserId");
    var AssignActionType_Control = this.SRForm.get("AssignActionType");
    var PolicyPDF_Control = this.SRForm.get("PolicyPDF");
    var Policy_No_Control = this.SRForm.get("Policy_No");

    AssignActionType_Control.setValue(Action);

    PolicyPDF_Control.setValidators(null);
    Policy_No_Control.setValidators(null);

    if (Action == "UpdateAndSaveByUW" || Action == "ApproveBy_Self_OPS_UW") {
      AssignUserId_Control.setValidators([Validators.required]);
      //alert('one');
    } else if (Action == "ApproveByOPS") {
      PolicyPDF_Control.setValidators([Validators.required]);
      Policy_No_Control.setValidators([Validators.required]);

      if (this.SRForm.value["Policy_Status"] == "Not-Issued") {
        this.api.ErrorMsg("Kindly Check Policy Status and Premium Details ! ");
      }

      AssignUserId_Control.setValidators(null);
    } else {
      //UpdateAndSaveByUW
      AssignUserId_Control.setValidators(null);
    }

    AssignUserId_Control.updateValueAndValidity();
    PolicyPDF_Control.updateValueAndValidity();
    Policy_No_Control.updateValueAndValidity();
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

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 3 mb
          this.api.ErrorMsg("File size is greater than 3 mb");

          if (Type == "RC_Motor_Registraion") {
            this.SRForm.get("RC_Motor_Registraion").setValue("");
          }
          if (Type == "Previous_Policy_Copy") {
            this.SRForm.get("Previous_Policy_Copy").setValue("");
          }
          if (Type == "Cheque_Payment_Recipt") {
            this.SRForm.get("Cheque_Payment_Recipt").setValue("");
          }
          if (Type == "Mandate_Letter") {
            this.SRForm.get("Mandate_Letter").setValue("");
          }
          if (Type == "Invoice") {
            this.SRForm.get("Invoice").setValue("");
          }
          if (Type == "Renewal_Notice") {
            this.SRForm.get("Renewal_Notice").setValue("");
          }
          if (Type == "Other") {
            this.SRForm.get("Other").setValue("");
          }

          if (Type == "PolicyPDF") {
            this.SRForm.get("PolicyPDF").setValue("");
          }
        } else {
          if (Type == "RC_Motor_Registraion") {
            this.RC_Motor_Registraion = this.selectedFiles;
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
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.ErrorMsg(
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "RC_Motor_Registraion") {
          this.SRForm.get("RC_Motor_Registraion").setValue("");
        }
        if (Type == "Previous_Policy_Copy") {
          this.SRForm.get("Previous_Policy_Copy").setValue("");
        }
        if (Type == "Cheque_Payment_Recipt") {
          this.SRForm.get("Cheque_Payment_Recipt").setValue("");
        }
        if (Type == "Mandate_Letter") {
          this.SRForm.get("Mandate_Letter").setValue("");
        }
        if (Type == "Invoice") {
          this.SRForm.get("Invoice").setValue("");
        }
        if (Type == "Renewal_Notice") {
          this.SRForm.get("Renewal_Notice").setValue("");
        }
        if (Type == "Other") {
          this.SRForm.get("Other").setValue("");
        }

        if (Type == "PolicyPDF") {
          this.SRForm.get("PolicyPDF").setValue("");
        }
      }
    }
  }

  AddSR() {
    /*
	if(this.row.Source == 'Web' || this.row.Source == 'Excel' ){
		
		var fields = this.SRForm.value; 
		const formData = new FormData();
		
		// console.log(this.SRForm.value);
	
		formData.append('SR_Id',this.SR_Id);
		formData.append('SR_No',this.row.SR_No);
		
		formData.append('User_Type',this.api.GetUserData('UserType_Name'));
		formData.append('User_Id',this.api.GetUserId());
		
		formData.append('Broker_Id',this.Broker_Id);
		formData.append('RM_Id',this.RM_Id);
		formData.append('Franchise_Id',this.Franchise_Id);
		formData.append('Agent_Id',this.Agent_Id);
		
		formData.append('Employee_Code',fields['Employee_Code']); 
		formData.append('Employee_Password',fields['Employee_Password']); 
		formData.append('Is_Remember',this.Is_Remember); 
		
		this.api.IsLoading();
		this.api.HttpPostType('sr/EditSR/Manual_Update_SR_Mapping',formData).then((result:any) => {
		this.api.HideLoading();
			
			 
			if(result['Status'] == true){
				this.api.ToastMessage(result['Message']);
				
				if(this.api.GetUserData('User_Id_Dec')==1){
					if(result['Is_Remember'] ==1){
						localStorage.setItem('Is_Remember_Data',JSON.stringify(result['Is_Remember_Data']));
					}else{
						localStorage.removeItem('Is_Remember_Data'); 
					}
				}
				
				 this.CloseModel();
				
			}else{
				this.api.ErrorMsg(result['Message']);
			}
			
		}, (err) => { 
		  // Error log
		  this.api.HideLoading();
		  //// console.log(err.message);
		  this.api.ErrorMsg('Network Error, Please try again ! '+ err.message);
	    });
		
	}else{	
    // console.log(this.SRForm.value);
	
*/

    this.isSubmitted = true;
    if (this.SRForm.invalid) {
      return;
    } else {
      var fields = this.SRForm.value;
      const formData = new FormData();

      //// console.log(fields['AssignType']);

      formData.append("SR_Id", this.SR_Id);
      formData.append("User_Type", this.api.GetUserData("UserType_Name"));
      formData.append("User_Id", this.api.GetUserId());

      formData.append("Broker_Id", this.Broker_Id);
      formData.append("RM_Id", this.RM_Id);
      formData.append("Franchise_Id", this.Franchise_Id);
      formData.append("Agent_Id", this.Agent_Id);
      formData.append("Fleet_Id", this.Fleet_Id);

      formData.append("LOB_Id", fields["LOB_Id"]);
      formData.append("File_Type", fields["File_Type"]);
      formData.append("Insurer_Renewal", fields["Insurer_Renewal"]);
      formData.append("PA_Owner", fields["PA_Owner"]);
      formData.append("PA_Owner_Tenure", fields["PA_Owner_Tenure"]);

      formData.append("Segment_Id", fields["Segment_Id"]);
      formData.append("Class_Id", fields["Class_Id"]);
      formData.append("Sub_Class_Id", fields["Sub_Class_Id"]);
      formData.append("Product_Id", fields["Product_Id"]);
      formData.append("SubProduct_Id", fields["SubProduct_Id"]);

      formData.append("Make_Id", fields["Make_Id"]);
      formData.append("Model_Id", fields["Model_Id"]);
      formData.append("Variant_Id", fields["Variant_Id"]);
      formData.append("Seating_Capcity", fields["Seating_Capcity"]);
      formData.append("GVW_CC", fields["GVW_CC"]);

      formData.append("RegistrationType", this.RegistrationType);
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

      formData.append(
        "Purchase_Date",
        this.api.StandrdToDDMMYYY(fields["Purchase_Date"])
      );
      formData.append("Manufacture_Year", fields["Manufacture_Year"]);
      formData.append("Engine_No", fields["Engine_No"]);
      formData.append("Chasis_No", fields["Chasis_No"]);

      formData.append("Insurance_Company_Id", fields["Insurance_Company_Id"]);
      formData.append(
        "Insurance_Company_Branch_Id",
        fields["Insurance_Company_Branch_Id"]
      );
      formData.append("State_Id", fields["State_Id"]);
      formData.append("RTO_Id", fields["RTO_Id"]);

      formData.append("Insured_Type", fields["Insured_Type"]);
      formData.append("Salutation_Type", fields["Salutation_Type"]);
      formData.append("Customer_Name", fields["Customer_Name"]);
      formData.append("Customer_Mobile", fields["Customer_Mobile"]);
      formData.append(
        "Customer_Alternate_Mobile",
        fields["Customer_Alternate_Mobile"]
      );

      formData.append("Is_Policy_OD", this.Is_Policy_OD);
      formData.append("OD_Days", this.global_OD_Days.toString());
      formData.append("TP_Days", this.global_TP_Days.toString());

      formData.append(
        "Policy_Start_Date_TP",
        this.api.StandrdToDDMMYYY(fields["Policy_Start_Date_TP"])
      );
      formData.append(
        "Policy_End_Date_TP",
        this.api.StandrdToDDMMYYY(fields["Policy_End_Date_TP"])
      );

      formData.append(
        "Policy_Start_Date_OD",
        this.api.StandrdToDDMMYYY(fields["Policy_Start_Date_OD"])
      );
      formData.append(
        "Policy_End_Date_OD",
        this.api.StandrdToDDMMYYY(fields["Policy_End_Date_OD"])
      );

      formData.append("Policy_Status", fields["Policy_Status"]);
      formData.append("Policy_No", fields["Policy_No"]);

      formData.append("Payment_Towards", fields["Payment_Towards"]);
      formData.append("Mode_Of_Payment", fields["Mode_Of_Payment"]);
      formData.append("Payment_Cheque_Ref_No", fields["Payment_Cheque_Ref_No"]);

      formData.append("Payout_MOD", fields["Payout_MOD"]); // add 21-09-2020
      formData.append("Payout_Remark", fields["Payout_Remark"]); // add 21-09-2020

      formData.append("Payout_OD", fields["Payout_OD"]);
      formData.append("Payout_TP", fields["Payout_TP"]);
      formData.append("Payout_Net", fields["Payout_Net"]);
      formData.append("Payout_Reward", fields["Payout_Reward"]);
      formData.append("Payout_Scheme", fields["Payout_Scheme"]);

      formData.append("Payout_OD_Amount", fields["Payout_OD_Amount"]);
      formData.append("Payout_TP_Amount", fields["Payout_TP_Amount"]);
      formData.append("Payout_Net_Amount", fields["Payout_Net_Amount"]);
      formData.append("Payout_Reward_Amount", fields["Payout_Reward_Amount"]);
      formData.append("Payout_Scheme_Amount", fields["Payout_Scheme_Amount"]);

      formData.append("Payout_Total_Amount", fields["Payout_Total_Amount"]);

      formData.append("TPPD", fields["TPPD"]);
      formData.append("Basic_OD", fields["Basic_OD"]);
      formData.append("Basic_TP", fields["Basic_TP"]);
      formData.append("Other_TP", fields["Other_TP"]);
      formData.append("PA_Owner_Premium", fields["PA_Owner_Premium"]);
      formData.append("IDV", fields["IDV"]);
      formData.append("NCB", fields["NCB"]);
      formData.append("Discount", fields["Discount"]);
      formData.append("Net_Premium", fields["Net_Premium"]);
      formData.append(
        "Estimated_Gross_Premium",
        fields["Estimated_Gross_Premium"]
      );

      formData.append("Terrorism_Premium", fields["Terrorism_Premium"]);
      formData.append("Sum_Insured", fields["Sum_Insured"]);

      formData.append(
        "Previous_Policy_Status",
        fields["Previous_Policy_Status"]
      );
      formData.append("Pre_Insurer_Name", fields["Pre_Insurer_Name"]);
      formData.append("Pre_Policy_No", fields["Pre_Policy_No"]);
      formData.append(
        "Pre_Expiry_Date",
        this.api.StandrdToDDMMYYY(fields["Pre_Expiry_Date"])
      );

      formData.append("AssignType", fields["AssignType"]);
      formData.append("AssignUserId", fields["AssignUserId"]);
      formData.append("AssignRemark", fields["AssignRemark"]);
      formData.append("AssignActionType", fields["AssignActionType"]);

      formData.append("Underwriter_Emp_Id", fields["Underwriter_Emp_Id"]);
      formData.append("Accounts_Id", fields["Accounts_Id"]);
      formData.append("Operation_Id", fields["Operation_Id"]);

      formData.append("RC_Motor_Registraion", this.RC_Motor_Registraion);
      formData.append("Previous_Policy_Copy", this.Previous_Policy_Copy);
      formData.append("Cheque_Payment_Recipt", this.Cheque_Payment_Recipt);
      formData.append("Mandate_Letter", this.Mandate_Letter);
      formData.append("Invoice", this.Invoice);
      formData.append("Renewal_Notice", this.Renewal_Notice);
      formData.append("Other", this.Other);

      formData.append("PolicyPDF", this.PolicyPDF);

      formData.append("Employee_Code", fields["Employee_Code"]);
      formData.append("Employee_Password", fields["Employee_Password"]);
      formData.append("Is_Remember", this.Is_Remember);

      this.api.IsLoading();
      this.api.HttpPostType("sr/EditSR/Manual_Update_SR", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.ToastMessage(result["Message"]);

            if (this.api.GetUserData("User_Id_Dec") == 1) {
              if (result["Is_Remember"] == 1) {
                localStorage.setItem(
                  "Is_Remember_Data",
                  JSON.stringify(result["Is_Remember_Data"])
                );
              } else {
                localStorage.removeItem("Is_Remember_Data");
              }
            }

            this.CloseModel();
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
    }

    /*
	}
    */
  }
}
