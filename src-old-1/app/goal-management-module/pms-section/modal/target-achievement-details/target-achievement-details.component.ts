import { Component, OnInit, Inject ,EventEmitter, Output} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-target-achievement-details",
  templateUrl: "./target-achievement-details.component.html",
  styleUrls: ["./target-achievement-details.component.css"],
})
export class TargetAchievementDetailsComponent implements OnInit {

  SearchForm: FormGroup;
  SalaryRemarkForm: FormGroup;
  IncentiveForm: FormGroup;

  isSubmitted = false;
  isSubmitted1 = false;
  isSubmitted2 = false;


  currentIndex: number;
  PmsTargetDataAr: any[] = [];
  TargetAchievementNextAndPreview: Function;
  // dialogRef: MatDialogRef<TargetAchievementDetailsComponent>;


  SubmitButtonDisabled: boolean = false;
  dataAr: any = [];
  row: any;
  Sequence: any = 0;
  ShowDaysField: any = "No";
  Is_Refresh: any = "No";
  ShowDayField: any = "No";
  ShowSalaryField: any = "No";

  Employee_Id: any = "";
  Vertical_Data: any = "";
  MonthNamCon: any = "";
  MonthConSr: any = "";
  MonthConDsr: any = "";
  IsSales: any = "";
  Department_Id: any = "";
  financial_year: any = "";
  LoginProfileName: any = "";
  Profile_Type: any = "";
  Coreline: any = '';
  ShowSelfData: any = "";
  ShowTeamData: any = "";
  IsEdit: any = "";
  IsEditFinal: any = "";
  LastSalarySequence: any = "";
  Broker_Id: any = "";
  Modal_Type: any = '';

  EmployeeName:any = '';
  ReportingManager:any = '';
  ServiceLocation:any = '';
  EmployeeProfile:any='';
  SystemAge:any='';
  ResignDate:any='';
  ResignStatus:any='';

  AllocatedTeamTarget: any = "0";
  AllocatedTeamBusiness: any = "0";
  AllocatedTeamAchievement: any = "0.00";

  AllocatedSelfTarget: any = "0";
  AllocatedSelfBusiness: any = "0";
  AllocatedSelfAchievement: any = "0.00";

  AllocatedTeamTargetStr: any = "0.00";
  AllocatedTeamBusinessStr: any = "0.00";
  AllocatedSelfTargetStr: any = "0.00";
  AllocatedSelfBusinessStr: any = "0.00";

  TotalRevenue: any = "0";
  TeamRevenue: any = "0";
  SelfRevenue: any = "0";

  TotalRevenueStr: any = "0.00";
  TeamRevenueStr: any = "0.00";
  SelfRevenueStr: any = "0.00";

  TotalActiveDays: any;
  TotalBusinessVirtual: any;
  TotalBusinessVisit: any;
  LmsCallCount: any;
  TeleRmCallCount: any;
  RenewalCallCount: any;

  TotalTotalCost: any = "0";
  TeamTotalCost: any = "0";
  SelfTotalCost: any = "0";
  ActualTotalCost: any = "0";
  TeamActualCost: any = "0";
  SelfActualCost: any = "0";
  AllTotalCost: any = "0";
  AllActualCost: any = "0";
  TotalTotalCostStr: any = "0.00";
  TeamTotalCostStr: any = "0.00";
  SelfTotalCostStr: any = "0.00";
  ActualTotalCostStr: any = "0.00";
  TeamActualCostStr: any = "0.00";
  SelfActualCostStr: any = "0.00";

  ShowSelfActualCost: any = "No";
  ShowTeamActualCost: any = "No";
  ShowSelfTotalCost: any = "No";
  ShowTeamTotalCost: any = "No";
  ShowTotalTotalCost: any = "No";
  ShowTotalActualCost: any = "No";

  SalaryRemarksArray: { Id: string; Name: string }[];
  PartialTypeArray: { Id: string; Name: string }[];
  dropdownSettingsingleselect1: any = {};

  TotalTarget: any = '0.00';
  TotalTargetStr: any = '0.00';
  TeamTarget: any = '0.00';
  TeamTargetStr: any = '0.00';
  SelfTarget: any = '0.00';
  SelfTargetStr: any = '0.00';
  TotalActualBusiness: any = '0.00';
  TotalActualBusinessStr: any = '0.00';
  TeamActualBusiness: any = '0.00';
  TeamActualBusinessStr: any = '0.00';
  SelfActualBusiness: any = '0.00';
  SelfActualBusinessStr: any = '0.00';
  TotalActualAchPercent: any = '0.00';
  TeamActualAchPercent: any = '0.00';
  SelfActualAchPercent: any = '0.00';
  TotalWeightageBusiness: any = '0.00';
  TotalWeightageBusinessStr: any = '0.00';
  TeamWeightageBusiness: any = '0.00';
  TeamWeightageBusinessStr: any = '0.00';
  SelfWeightageBusiness: any = '0.00';
  SelfWeightageBusinessStr: any = '0.00';
  TotalWeightageAchPercent: any = '0.00';
  TeamWeightageAchPercent: any = '0.00';
  SelfWeightageAchPercent: any = '0.00';

  IncentiveTotalTarget: any = '0.00';
  IncentiveTotalTargetStr: any = '0.00';
  IncentiveWeightageBusiness: any = '0.00';
  IncentiveWeightageBusinessStr: any = '0.00';
  IncentiveRewardPercent: any = '0.00';
  IncentiveAmount: any = '0.00';
  IncentiveAmountStr: any = '0.00';
  salary_amount: any = '0.00';
  salary_amount_auto: any = '0.00';
  salary_Paid_Status:any=0;
  salary_days: any = '';
  current_salary_remark_arr: any = [];
  PartialTypeSelArray: any = [];
  salary_comment: any = '';
  salary_comment_auto: any = '';

  Business_Details_Fetched: any = '0';
  Cost_Details_Fetched: any = '0';
  TotalSr: any = 'Calculating...';
  TotalOnlineSr: any = 'Calculating...';
  OnlineSrPercent: any = 'Calculating...';
  Eligibility: any = 'Calculating...';
  NewSPC: any = 'Calculating...';
  TotalAgents: string = 'Calculating...';
  ActiveAgents: string = 'Calculating...';
  ActiveAgentsPercent: string = 'Calculating...';
  NewPosTarget: string = 'Calculating...';
  NewPosAdded: string = 'Calculating...';
  PosAcquisition: string = 'Calculating...';
  salary_remark_type: any = 'Changed';
  auto_salary_type: any = '';
  RewardCriteriaAr: any = [];
  Incom_Pos_Acq: any = [];
  ProfileTarget: any = [];
  ActualTarget: any = [];
  AmountReleased: any = '0.00';
  AmountReleasedStr: any = '';
  PaymentStatus: any = 'Pending';
  IncentiveRemarks: any = '';
  New_Profile: any;
  loginId: any;
  getBasicDetailsLoader : boolean = false; 
  PreviewButtonShow:boolean =false;
  NextButtonShow:boolean =false;

  isLoadingExportPms :boolean =false;
  loadingButtonPmsExportText:any='';
  
  constructor(public dialogRef: MatDialogRef<TargetAchievementDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public dialog: MatDialog, private router: Router,
    private formBuilder: FormBuilder) {

    // Initialize the data passed from the parent
    this.currentIndex = this.data.currentIndex;
    this.PmsTargetDataAr = this.data.PmsTargetDataAr;
    this.TargetAchievementNextAndPreview = this.data.TargetAchievementNextAndPreview;
    this.PreviewButtonShow =  this.data.PreviewButtonShow;
    this.NextButtonShow = this.data.NextButtonShow;

    this.SalaryRemarkForm = this.formBuilder.group({
      SalaryType: [""],
      PartialType: [""],
      Remarks: ["", Validators.required],
      TotalDays: [""],
      TotalSalary: [""],
    });
    

    this.IncentiveForm = this.formBuilder.group({
      Incentive_Amt: [""],
      Remarks: [""],
    });

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

  }

  ngOnInit() {

    if (!this.dataAr) {
      this.dataAr = []; // Initialize to avoid errors
    }
    if (!this.PmsTargetDataAr) {
      this.PmsTargetDataAr = []; // Initialize to avoid errors
    }
    // this.showRecord(this.currentIndex); // Ini

    this.Employee_Id = this.data.Employee_Id;
    this.Vertical_Data = this.data.Vertical_Data;
    this.MonthNamCon = this.data.MonthNamCon;
    this.MonthConSr = this.data.MonthConSr;
    this.MonthConDsr = this.data.MonthConDsr;
    this.IsSales = this.data.IsSales;
    this.Department_Id = this.data.Department_Id;
    this.financial_year = this.data.financial_year;
    this.LoginProfileName = this.data.LoginProfileName;
    this.Profile_Type = this.data.Profile_Type;
    this.Coreline = this.data.Coreline;
    this.SelfTotalCost = this.data.SelfTotalCost;
    this.SelfActualCost = this.data.SelfActualCost;
    this.ShowSelfData = this.data.ShowSelfData;
    this.Sequence = this.data.Sequence;
    this.ShowTeamData = this.data.ShowTeamData;
    this.IsEdit = this.data.IsEdit;
    this.IsEditFinal = this.data.IsEditFinal;
    this.LastSalarySequence = this.data.LastSalarySequence;
    this.Broker_Id = this.data.Broker_Id;
    this.Modal_Type = this.data.Modal_Type;
    this.New_Profile = this.data.NewProfileName;
    this.EmployeeName = this.data.EmployeeName;
    this.ReportingManager = this.data.ReportingManager;
    this.ServiceLocation = this.data.ServiceLocation;
    this.EmployeeProfile = this.data.EmployeeProfile;
    this.SystemAge = this.data.SystemAge;
    this.ResignDate = this.data.ResignDate;
    this.ResignStatus = this.data.ResignStatus;

    this.GetBasicDetails();
    this.GetCostDetails();
    this.GetIncentiveTermCondition();

    if (this.IsSales == 1 && (this.Profile_Type == 'President' || this.Profile_Type == 'HOD' || this.Profile_Type == 'NH' || this.Profile_Type == 'ZH' || this.Profile_Type == 'RH' || this.Profile_Type == 'CH' || this.Profile_Type == 'BCH')) {
      this.GetProfileWiseMappingData();
    }

    this.SalaryRemarksArray = [
      { Id: "Full", Name: "Full" },
      { Id: "Partial", Name: "Partial" },
      { Id: "Hold", Name: "Hold" },
      { Id: "None", Name: "Nil" },
    ];

    this.PartialTypeArray = [
      { Id: "Salary", Name: "CTC" },
      { Id: "Days", Name: "Days" },
    ];

   this.loginId = this.api.GetUserData('Id');

  }

  get FC_6() {
    return this.SalaryRemarkForm.controls;
  }

  get IncentiveFormControl() {
    return this.IncentiveForm.controls;
  }

  //===== GET EMPLOYEES EXTRA DATA =====//
  GetBasicDetails() {

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("Department_Id", this.Department_Id);
    formData.append("MonthNamCon", this.MonthNamCon);
    formData.append("MonthConSr", this.MonthConSr);
    formData.append("MonthConDsr", this.MonthConDsr);
    formData.append("IsSales", this.IsSales);
    formData.append("Coreline", this.Coreline);
    formData.append("Portal", "CRM");
    formData.append("Vertical_Data", this.Vertical_Data);
    formData.append("financial_year", this.financial_year);
    formData.append("Broker_Id", this.Broker_Id);

    this.getBasicDetailsLoader = true;
    this.api
      .HttpPostTypeBms(
        "goal-management-system/pms/BusinessTargets/GetExtraData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {

            //== Profile Target Related ==//
            this.TotalTarget = result["TotalTarget"];
            this.TotalTargetStr = result["TotalTargetStr"];
            this.TeamTarget = result["TeamTarget"];
            this.TeamTargetStr = result["TeamTargetStr"];
            this.SelfTarget = result["SelfTarget"];
            this.SelfTargetStr = result["SelfTargetStr"];

            this.TotalActualBusiness = result["TotalActualBusiness"];
            this.TotalActualBusinessStr = result["TotalActualBusinessStr"];
            this.SelfActualBusiness = result["SelfActualBusiness"];
            this.SelfActualBusinessStr = result["SelfActualBusinessStr"];
            this.TeamActualBusiness = result["TeamActualBusiness"];
            this.TeamActualBusinessStr = result["TeamActualBusinessStr"];

            this.TotalActualAchPercent = result["TotalActualAchPercent"];
            this.SelfActualAchPercent = result["SelfActualAchPercent"];
            this.TeamActualAchPercent = result["TeamActualAchPercent"];

            this.TotalWeightageBusiness = result["TotalWeightageBusiness"];
            this.TotalWeightageBusinessStr = result["TotalWeightageBusinessStr"];
            this.TeamWeightageBusiness = result["TeamWeightageBusiness"];
            this.TeamWeightageBusinessStr = result["TeamWeightageBusinessStr"];
            this.SelfWeightageBusiness = result["SelfWeightageBusiness"];
            this.SelfWeightageBusinessStr = result["SelfWeightageBusinessStr"];

            this.TotalWeightageAchPercent = result["TotalWeightageAchPercent"];
            this.TeamWeightageAchPercent = result["TeamWeightageAchPercent"];
            this.SelfWeightageAchPercent = result["SelfWeightageAchPercent"];

            this.TeamRevenue = result["TeamRevenue"];
            this.SelfRevenue = result["SelfRevenue"];
            this.TotalRevenue = result["TotalRevenue"];

            this.TeamRevenueStr = result["TeamRevenueStr"];
            this.SelfRevenueStr = result["SelfRevenueStr"];
            this.TotalRevenueStr = result["TotalRevenueStr"];

            this.TotalActiveDays = result["TotalActiveDays"];
            this.TotalBusinessVirtual = result["TotalBusinessVirtual"];
            this.TotalBusinessVisit = result["TotalBusinessVisit"];
            this.LmsCallCount = result["LmsCallCount"];
            this.TeleRmCallCount = result["TeleRmCallCount"];
            this.RenewalCallCount = result["RenewalCallCount"];

            this.Business_Details_Fetched = '1';
            if(this.Profile_Type != 'CEO'&& this.Profile_Type != 'MD' ){ //By Paras
              this.GetIncentiveDetails();
            }
            if (this.Modal_Type == 'Salary') {
              this.GetSalaryRemarksTrack();
            }

            if(this.Profile_Type != 'CEO'&& this.Profile_Type != 'MD' ){ //By Paras
              this.GetIncentivePaymentTrack();
            }
            

          } else {
            this.api.Toast("Warning", "Some error occured!");
          }
          this.getBasicDetailsLoader = false;
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          this.getBasicDetailsLoader = false;
        }
      );
  }

  //===== GET TEAM TOTAL COST IN CHUNKS =====//
  GetCostDetails() {

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("Department_Id", this.Department_Id);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("Portal", "CRM");
    formData.append("Vertical_Data", this.Vertical_Data);
    formData.append("financial_year", this.financial_year);
    formData.append("SelfTotalCost", this.SelfTotalCost);
    formData.append("SelfActualCost", this.SelfActualCost);

    this.api.HttpPostTypeBms("goal-management-system/LazyCalculations/GetTotalTeamCost", formData).then((result) => {
      if (result["Status"] == true) {

        this.TotalTotalCost = result["TotalTotalCost"];
        this.TotalTotalCostStr = result["TotalTotalCostStr"];
        this.TeamTotalCost = result["TeamTotalCost"];
        this.TeamTotalCostStr = result["TeamTotalCostStr"];
        this.SelfTotalCostStr = result["SelfTotalCostStr"];

        this.ActualTotalCost = result["ActualTotalCost"];
        this.ActualTotalCostStr = result["ActualTotalCostStr"];
        this.TeamActualCost = result["TeamActualCost"];
        this.TeamActualCostStr = result["TeamActualCostStr"];
        this.SelfActualCostStr = result["SelfActualCostStr"];

        this.AllTotalCost = result["TotalTotalCost"];
        this.TotalTotalCostStr = result["TotalTotalCostStr"];
        this.AllActualCost = result["ActualTotalCost"];
        this.ActualTotalCostStr = result["ActualTotalCostStr"];

        this.Cost_Details_Fetched = '1';
        if(this.Profile_Type != 'CEO' ){ //By Paras
          this.GetIncentiveDetails();
        }
        if (this.Modal_Type == 'Salary') {
          this.GetSalaryRemarksTrack();
        }

        this.GetIncentivePaymentTrack();

      } else {
        this.api.Toast("Warning", "Some error occured!");
      }
    },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }


  //===== GET EMPLOYEES INCENTIVE DATA =====//
  GetIncentiveDetails() {

    if (this.Cost_Details_Fetched == '0' || this.Business_Details_Fetched == '0') {
      return;
    }

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("ProfileName", this.Profile_Type);
    formData.append("Department_Id", this.Department_Id);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("Coreline", this.Coreline);
    formData.append("IsSales", this.IsSales);
    formData.append("Portal", "CRM");
    formData.append("Vertical_Data", this.Vertical_Data);
    formData.append("financial_year", this.financial_year);
    formData.append("TotalCost", this.TotalTotalCost);
    formData.append("TotalTarget", this.TotalTarget);
    formData.append("TotalActualBusiness", this.TotalActualBusiness);
    formData.append("TotalWeightageBusiness", this.TotalWeightageBusiness);
    formData.append("Broker_Id", this.Broker_Id);

    this.api
      .HttpPostTypeBms(
        "goal-management-system/pms/BusinessCalculations/GetIncentiveDetails",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {

            this.IncentiveTotalTarget = result['IncentiveTotalTarget'];
            this.IncentiveTotalTargetStr = result['IncentiveTotalTargetStr'];
            this.IncentiveWeightageBusiness = result["IncentiveWeightageBusiness"];
            this.IncentiveWeightageBusinessStr = result["IncentiveWeightageBusinessStr"];
            this.IncentiveRewardPercent = result["IncentiveRewardPercent"];
            this.IncentiveAmount = result["IncentiveAmount"];
            this.IncentiveAmountStr = result["IncentiveAmountStr"];

            if (this.IsSales == 1 && this.Profile_Type != 'President') {
              this.CheckIncentiveEligiblity();
            } else {
              this.Eligibility = 'No';
              this.TotalSr = '0.00';
              this.TotalOnlineSr = '0.00';
              this.OnlineSrPercent = '0.00';
              this.NewSPC = '0.00';
              this.TotalAgents = '0.00';
              this.ActiveAgents = '0.00';
              this.ActiveAgentsPercent = '0.00';

              this.NewPosTarget = '0';
              this.NewPosAdded = '0';
              this.PosAcquisition = 'No';
            }

          } else {
            this.api.Toast("Warning", "Some error occured!");
          }

        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }


  //===== CHECK INCENTIVE ELIGIBLITY =====//
  CheckIncentiveEligiblity() {

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("ProfileName", this.Profile_Type);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("financial_year", this.financial_year);
    formData.append("RewardPercent", this.IncentiveRewardPercent);
    formData.append("Broker_Id", this.Broker_Id);

    this.api
      .HttpPostTypeBms(
        "goal-management-system/pms/BusinessCalculations/CheckIncentiveEligiblity",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {

            this.TotalSr = result["TotalSr"];
            this.TotalOnlineSr = result["OnlineSr"];
            this.OnlineSrPercent = result["OnlineSrPercent"];
            this.Eligibility = result["Eligibility"];
            this.NewSPC = result["NewSPC"];
            this.TotalAgents = result["TotalAgents"];
            this.ActiveAgents = result["ActiveAgents"];
            this.ActiveAgentsPercent = result["ActiveAgentsPercent"];
            this.NewPosTarget = result["NewPosTarget"];
            this.NewPosAdded = result["NewPosAdded"];
            this.PosAcquisition = result["PosAcquisition"];
            this.Incom_Pos_Acq = result['Incom_Pos_Acq'];

          } else {
            this.api.Toast("Warning", "Some error occured!");
          }

        },

        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );

  }


  //===== GET SALARY REMARK TRACK =====//
  GetSalaryRemarksTrack() {

    if (this.Cost_Details_Fetched == '0' || this.Business_Details_Fetched == '0') {
      return;
    }

    const formData = new FormData();
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("ProfileType", this.Profile_Type);
    formData.append("IsSales", this.IsSales);
    formData.append("Coreline", this.Coreline);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("IsEdit", this.IsEdit);
    formData.append("Sequence", this.Sequence);
    formData.append("LastSalarySequence", this.LastSalarySequence);
    formData.append("TotalTarget", this.TotalTarget);
    formData.append("TotalWeightageBusiness", this.TotalWeightageBusiness);
    formData.append("TotalWeightageAchPercent", this.TotalWeightageAchPercent);
    formData.append("SelfRevenue", this.SelfRevenue);
    formData.append("TotalRevenue", this.TotalRevenue);
    formData.append("TotalCost", this.TotalTotalCost);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();

    this.api
      .HttpPostTypeBms(
        "goal-management-system/pms/PmsExtraFunctions/GetSalaryRemarksTrack",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {

            this.dataAr = result["Data"];
            
            this.salary_Paid_Status = result['salary_Paid_Status'];
            this.salary_remark_type = result['salary_remark_type'];
           
            if (this.salary_remark_type == 'Auto') {

              this.salary_amount = result['salary_amount'];
              this.salary_amount_auto = result['salary_amount'];
              this.salary_days = result['salary_days'];
              this.current_salary_remark_arr = result['current_salary_remark_arr'];
              this.auto_salary_type = this.current_salary_remark_arr[0]['Id'];
              this.salary_comment = result['salary_comment'];
              this.salary_comment_auto = result['salary_comment'];

              if (this.auto_salary_type == 'Full') {
                this.SubmitButtonDisabled = true;
              }

              if (this.auto_salary_type == 'Partial') {
                this.ShowDaysField = 'Yes';

                if (this.salary_days == '') {
                  this.ShowSalaryField = 'Yes';
                  this.PartialTypeSelArray = [{ Id: "Salary", Name: "CTC" }];

                } else {
                  this.ShowDayField = 'Yes';
                  this.PartialTypeSelArray = [{ Id: "Days", Name: "Days" }];
                }

              }

            }

          } else {
            this.dataAr = result["Data"];
          }
        },
        (err) => { }
      );
  }


  //===== GET INCENTIVE PAYMENT TRACK =====//
  GetIncentivePaymentTrack() {

    if (this.Cost_Details_Fetched == '0' || this.Business_Details_Fetched == '0') {
      return;
    }

    const formData = new FormData();
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("ProfileType", this.Profile_Type);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("goal-management-system/pms/IncentiveReport/GetIncentivePaymentTrack", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.AmountReleased = result["AmountReleased"];
            this.AmountReleasedStr = result["AmountReleasedStr"];
            this.PaymentStatus = result["PaymentStatus"];
            this.IncentiveRemarks = result["IncentiveRemarks"];

          } else {
            this.dataAr = result["Data"];
          }
        },
        (err) => { }
      );
  }


  //===== GET SALARY REMARK TRACK =====//
  GetProfileWiseMappingData() {

    const formData = new FormData();
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("ProfileType", this.Profile_Type);
    formData.append("IsSales", this.IsSales);
    formData.append("Coreline", this.Coreline);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("Financial_Year", this.financial_year);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("goal-management-system/pms/PmsExtraFunctions/GetProfileWiseMappingData", formData).then((result) => {
      this.api.HideLoading();

      if (result["Status"] == true) {

        this.ProfileTarget = result["ProfileTarget"];
        this.ActualTarget = result['ActualTarget'];

      }

    }, (err) => { }
    );
  }


  //===== SUBMIT FORM =====//
  GetIncentiveTermCondition() {

    if (this.IsSales != 1) {
      return;
    }

    const formData = new FormData();
    formData.append("Employee_Id", this.Employee_Id);
    formData.append("ProfileType", this.Profile_Type);
    formData.append("MonthName", this.MonthNamCon);
    formData.append("financial_year", this.financial_year);

    this.api.HttpPostTypeBms("goal-management-system/pms/PmsExtraFunctions/GetIncentiveTermCondition", formData)
      .then((result) => {

        if (result["Status"] == true) {
          this.RewardCriteriaAr = result["RewardCriteriaAr"];
        } else {
          this.dataAr = result["Data"];
        }
      },
        (err) => { }
      );
  }


  //===== ON ITEM SELECT =====//
  onItemSelect() {

    this.ShowDayField = "No";
    this.ShowSalaryField = "No";
    this.ShowDaysField = "No";
    this.SalaryRemarkForm.get("Remarks").setValue("");
    var fields = this.SalaryRemarkForm.value;
    this.SubmitButtonDisabled = false;

    this.SalaryRemarkForm.get("TotalDays").setValue("");
    
    if (this.SalaryRemarkForm.get("SalaryType").value.length > 0 && fields["SalaryType"][0]["Id"] == 'Partial') {
      this.ShowDaysField = "Yes";

      if (this.SalaryRemarkForm.get("PartialType").value.length > 0 && fields["PartialType"][0]["Id"] == 'Salary') {
        this.ShowSalaryField = "Yes";

        this.SalaryRemarkForm.get("TotalDays").setValue("");
        this.SalaryRemarkForm.get("TotalSalary").setValidators([Validators.required]);
        this.SalaryRemarkForm.get("TotalSalary").updateValueAndValidity();
        this.SalaryRemarkForm.get("TotalDays").clearValidators();
        this.SalaryRemarkForm.get("TotalDays").updateValueAndValidity();
        
      } else if (this.SalaryRemarkForm.get("PartialType").value.length > 0 && fields["PartialType"][0]["Id"] == 'Days') {
        this.ShowDayField = "Yes";

        this.SalaryRemarkForm.get("TotalDays").setValidators([
          Validators.required,          
          Validators.pattern("^[0-9]+$")
        ]);
        
        this.SalaryRemarkForm.get("TotalDays").updateValueAndValidity();
        this.SalaryRemarkForm.get("TotalSalary").clearValidators();
        this.SalaryRemarkForm.get("TotalSalary").updateValueAndValidity();
      }

    }else{
      this.SalaryRemarkForm.get("TotalDays").clearValidators();
      this.SalaryRemarkForm.get("TotalSalary").clearValidators();
      this.SalaryRemarkForm.get("TotalDays").updateValueAndValidity();
      this.SalaryRemarkForm.get("TotalSalary").updateValueAndValidity();
    }

  }


  //===== ON ITEM SELECT =====//
  onItemSelect1(e: any) {
    this.ShowDayField = "No";
    this.ShowSalaryField = "No";

    console.log("e.Id",e.Id);
    if (e.Id == "Salary") {
      this.ShowSalaryField = "Yes";
      this.ShowDayField = "No";
      this.SalaryRemarkForm.get("TotalDays").setValue("");
      this.SalaryRemarkForm.get("TotalSalary").setValidators([Validators.required]);
      this.SalaryRemarkForm.get("TotalSalary").updateValueAndValidity();
      this.SalaryRemarkForm.get("TotalDays").clearValidators();
      this.SalaryRemarkForm.get("TotalDays").updateValueAndValidity();
    }

    if (e.Id == "Days") {
      this.ShowDayField = "Yes";
      this.ShowSalaryField = "No";
      this.SalaryRemarkForm.get("TotalDays").setValidators([
        Validators.required,          
        Validators.pattern("^[0-9]+$")
      ]);
      
      this.SalaryRemarkForm.get("TotalDays").updateValueAndValidity();
      this.SalaryRemarkForm.get("TotalSalary").clearValidators();
      this.SalaryRemarkForm.get("TotalSalary").updateValueAndValidity();

    }
    console.log("this.SalaryRemarkForm",this.SalaryRemarkForm);
  }


  //===== ENABLE DISABLE FIELDS =====//
  EnableDiableFields(e: any) {
    if (e == "TotalSalary") {
      this.SalaryRemarkForm.get("TotalDays").setValue("");
    } else {
      this.SalaryRemarkForm.get("TotalSalary").setValue("");
    }
  }


  //===== SUBMIT SALARY REMARKS DATA =====//
  SubmitSalaryRemarks() {

    this.isSubmitted1 = true;

    if (this.SalaryRemarkForm.invalid) {
      return;

    } else {

      var fields = this.SalaryRemarkForm.value;

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("EmployeeId", this.Employee_Id);
      formData.append("Sequence", this.Sequence);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", this.MonthNamCon);
      formData.append("SalaryType", JSON.stringify(fields["SalaryType"]));
      formData.append("PartialType", JSON.stringify(fields["PartialType"]));
      formData.append("TotalDays", fields["TotalDays"]);
      formData.append("TotalSalary", fields["TotalSalary"]);
      formData.append("Remarks", fields["Remarks"]);
      formData.append("Portal", "CRM");
      formData.append("SalaryRemarkType", this.salary_remark_type);

      if (this.salary_remark_type == 'Auto') {

        formData.append("AutoSalaryType", this.auto_salary_type);

        if (this.current_salary_remark_arr[0]['Id'] == 'Partial') {
          formData.append("AutoPartialType", 'Salary');
        }

        formData.append("AutoTotalSalary", this.salary_amount_auto);
        formData.append("AutoRemarks", this.salary_comment_auto);

      }

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/pms/PmsExtraFunctions/UpdateSalaryRemarks",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            this.isSubmitted1 = false;
            if (result["Status"] == true) {
              this.Is_Refresh = "Yes";
              this.api.Toast("Success", result["Message"]);
              this.CloseModel();
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            this.isSubmitted1 = false;
            this.api.HideLoading();
            this.api.Toast("Warning", "Network Error, Please try again ! ");
          }
        );
    }
  }


  //===== SUBMIT INCENTIVE DETAILS DATA =====//
  SubmitIncentiveDetails() {

    this.isSubmitted2 = true;

    if (this.IncentiveForm.invalid) {
      return;

    } else {

      var fields = this.IncentiveForm.value;

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("EmployeeId", this.Employee_Id);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", this.MonthNamCon);
      formData.append("Incentive_Amt", fields["Incentive_Amt"]);
      formData.append("Remarks", fields["Remarks"]);
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      this.api.HttpPostTypeBms("goal-management-system/pms/IncentiveReport/SubmitIncentiveDetails", formData).then((result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Is_Refresh = "Yes";
          this.api.Toast("Success", result["Message"]);
          this.CloseModel();
        } else {
          this.api.Toast("Error", result["Message"]);
        }

      },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
    }

  }


  //===== SHOW HIDE TOTAL COST =====//
  ShowHideCost(Type: any, Value: any) {

    if (Type == "SelfActual") {
      this.ShowSelfActualCost = Value;
    }

    if (Type == "TeamActual") {
      this.ShowTeamActualCost = Value;
    }

    if (Type == "SelfTotal") {
      this.ShowSelfTotalCost = Value;
    }

    if (Type == "TeamTotal") {
      this.ShowTeamTotalCost = Value;
    }

    if (Type == "TotalTotal") {
      this.ShowTotalTotalCost = Value;
    }

    if (Type == "TotalActual") {
      this.ShowTotalActualCost = Value;
    }

  }


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }


  onPrevious(): void {
    this.dialogRef.close(); // Close current popup
    const prevIndex = this.currentIndex - 1;
    this.TargetAchievementNextAndPreview(prevIndex,'preview'); 
  }

  // Next Button Logic: Navigate to next record
  onNext(): void {
    this.dialogRef.close(); // Close current popup
    const nextIndex = this.currentIndex + 1;
    this.TargetAchievementNextAndPreview(nextIndex,'next');
  }



  //=== EXPORT PMS DATA ===//
  exportPmsRecord(functionType, TeamType = 'self') {
 
    const functionName = functionType === 'weightage' ? 'GenerateWeightageBusinessExcel' : functionType === 'incentive' ? 'GenerateIncentiveBusinessExcel' : functionType == 'actual-achievement' ? 'GenerateActualAchievementBusinessExcel': functionType == 'revenue' ?'GenerateRevenueBusinessExcel': functionType == 'policy' || 'policy-web' ? 'GeneratePolicyExcel' :'';

    // Set the loading state based on which button was clicked
    this.isLoadingExportPms = true;
    this.loadingButtonPmsExportText = functionType+'-'+TeamType;

    const formData = new FormData();
    const data = {
        "User_Id": this.api.GetUserId(),
        "Employee_Id": this.Employee_Id,
        "ProfileName": this.Profile_Type,
        "Department_Id": this.Department_Id,
        "MonthName": this.MonthNamCon,
        "Coreline": this.Coreline,
        "IsSales": this.IsSales,
        "Portal": "CRM",
        "Vertical_Data": this.Vertical_Data,
        "financial_year": this.financial_year,
        "TotalCost": this.TotalTotalCost,
        "TotalTarget": this.TotalTarget,
        "TotalActualBusiness": this.TotalActualBusiness,
        "TotalWeightageBusiness": this.TotalWeightageBusiness,
        "Broker_Id": this.Broker_Id,
        "team_type": TeamType
      };
      if(functionType == 'policy-web'){
        data['Source'] ='Web';
      }
      
    this.api.Toast("Info", "Please Wait Processing your request...");
    
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    this.api.HttpPostTypeBms(`goal-management-system/pms/PmsExcelOptimize/${functionName}`, formData)
        .then(result => {
            this.isLoadingExportPms = false; // Reset loading state
            if (result['Status']) {
                let DownloadUrl = result['DownloadUrl'];
                let TotalExportSR = result['TotalExportSR'];
                this.api.HideLoading();
                this.api.Toast("Success", `Export successful! ${TotalExportSR} rows created.`);
                if (DownloadUrl) {
                  window.location.href = DownloadUrl;
                }
            } else {
              this.api.Toast("Warning", "Some error occurred!");
            }
        })
        .catch(err => {
            this.isLoadingExportPms = false; // Reset loading state
            this.api.Toast("Warning", `Network Error: ${err.name} (${err.statusText})`);
        });
  }



  
}
