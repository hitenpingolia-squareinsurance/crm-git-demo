import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";

import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { EmployeerenewalpopupComponent } from "./../../myaccount/employeerenewalpopup/employeerenewalpopup.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { BulkrenewalnoticeComponent } from "./../../modals/bulkrenewalnotice/bulkrenewalnotice.component";
import { trim } from "jquery";

export interface Post {
  Vertical_Id: any[];
  Region_Id: any[];
  Sub_Region_Id: any[];
  EmployeeStatus: any[];
  Emp_Id: any[];
  Report_Type: any[];
  Agent_Id: any[];
  FinancialYear: [];

  Source: [""];
  // Lob: any[];
  Company: any[];
  PolicyType: any[];
  ProductType: any[];
  PolicyFileType: any[];

  Posting_Status_Web: any[];

  Tab_Type: any[];
  RenewalStatus: any[];

  To_Date: any[];
  From_Date: any[];
  SearchValue: any;
}
@Component({
  selector: "app-business-filter",
  templateUrl: "./business-filter.component.html",
  styleUrls: ["./business-filter.component.css"],
})
export class BusinessFilterComponent implements OnInit {
  post: Post;
  @Output() postCreated = new EventEmitter<Post>();
  ButtonDisableTrue: boolean = false;

  SearchForm: FormGroup;
  SearchFormGlobelForm: FormGroup;
  reportTypeDisable: boolean = false;
  GlobelLOB: any[];
  Ins_Compaines: any[];
  SR_Session_Year: any[];
  ItemLOBSelection: any = [];

  verticalData: any[];
  zoneData: any[];
  regionData: any[];
  subRegionData: any[];
  employeeData: any[];
  reportTypeData: any[];
  agentTypeData: any[];
  agentData: any[];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  DisabledButonDateRangepicker: boolean = false;

  SRSource_Ar: { Id: string; Name: string }[];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  isSubmitted: boolean = false;
  isSubmitted1: boolean = false;
  currentUrl: any;
  urlSegment: string;
  urlSegmentRoot: any;
  urlSegmentId: any;
  mainOption: any;
  subOption: any;
  rightType: any = "Self";
  loginType: string;

  QuotesStatus: any[];
  ActionType: string;
  RequestTypesFilter: boolean;
  financialYearVal: { Id: string; Name: string }[];
  BrokerSelectedVal: { Id: string; Name: string }[];
  productData: any;
  employeeStatusData: any = [];
  assignedEmployeeData: any = [];
  pageName: any;
  empStatusValue: { Id: number; Name: string }[];

  maxDate = new Date();
  minDate = new Date();
  Company_Ar: any;
  PolicyType_Ar: any;
  LossType_Ar: any;
  EarningStatusData: any;
  RenewalStatusData: any;
  TabTypeData: any;
  urlSegmentSub: any;
  PageType: string = "Reports";
  RangeButton: boolean;
  RangeButton2: boolean;
  SrSr_Status: { Id: string; Name: string }[];
  SrSr_Type: { Id: string; Name: string }[];
  agentTypeVal: { Id: string; Name: string }[];
  reportTypeVal: any[];
  reportTypeDataValue: { Id: string; Name: string }[];
  LoginScopeData: any;
  EmployeeType: any = "";
  Send_Renewal_mailCondition = "0";
  GemsStatusData: { Id: string; Name: string }[];
  statusData: { Id: string; Name: string }[];
  GemsQuaterData: { Id: string; Name: string }[];
  ClubCategory: { Id: string; Name: string }[];
  ClubCategortVal: { Id: string; Name: string }[];
  ClubCategoryVal: { Id: string; Name: string }[];
  EligibleNonEligibleData: { Id: string; Name: string }[];
  EligibleNonEligibleVal: { Id: string; Name: string }[];
  SrSr_StatusValue: { Id: string; Name: string }[];
  SelectStatus: { Id: string; Name: string }[];
  SelectStatusValue: { Id: string; Name: string }[];
  SrSr_LoginStatus: { Id: string; Name: string }[];
  SrSrLoginTYpe: { Id: string; Name: string }[];
  SrSr_PolicyType: { Id: string; Name: string }[];
  SrSr_PolicyStatus: { Id: string; Name: string }[];
  LobVal: any;
  OnlyLi: { Id: string; Name: string }[];
  agentType: any;
  File_Type_Ar: { Id: string; Name: string }[];
  Products_Ar: { Id: string; Name: string }[];
  Plan_Type_Ar: { Id: string; Name: string }[];
  Segment_Ar: { Id: string; Name: string }[];
  SubProducts_Ar: { Id: string; Name: string }[];
  Classes_Ar: { Id: string; Name: string }[];
  Sub_Classes_Ar: { Id: string; Name: string }[];
  RTO_Ar: { Id: string; Name: string }[];
  Ins_Companies_Ar: { Id: string; Name: string }[];
  Make_Ar: { Id: string; Name: string }[];
  Model_Ar: { Id: string; Name: string }[];
  PersidentData: any;
  BranchData: any;
  RoData: any;
  ReportsSection: string = "other";
  BusmiessGraphVal: { Id: string; Name: string }[];
  BusniessGraphData: { Id: string; Name: string }[];
  DataStoreFunction: any[];
  SearchButtonDisabled: boolean = false;
  BrokerData: any;
  TierData: any;
  PrimeData: { Id: string; Name: string }[];
  PrimeTypeVal: { Id: string; Name: string }[];
  StateData: any;
  RTOData: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.SearchForm = this.fb.group({
      BusniessGraph: [""],
      MisReportType: [""],
      Zone_Id: [""],
      Persident_Id: [""],
      Ro_Id: [""],
      Broker_Id: [""],

      Vertical_Id: [""],
      Region_Id: [""],
      Tier_Id: [""],

      Sub_Region_Id: [""],
      EmployeeStatus: [""],
      Emp_Id: [""],
      Report_Type: [""],
      Agent_Type: [""],
      Agent_Id: [""],
      FinancialYear: [""],
      Source: [""],
      LOB: [""],
      File_Type: [""],
      Company: [""],
      Product_Ids: [""],
      Segment_Ids: [""],
      Plan_Type: [""],
      SubProduct_Ids: [""],
      Class_Ids: [""],
      Sub_Class_Ids: [""],
      Ins_Compaines_Ids: [""],
      Earning_Filter_User: [""],
      Tab_Type: [""],
      RenewalStatus: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
      Sr_Status: [""],
      Sr_Type: [""],
      LoginScope_Id: [""],
      GemsQuater: [""],
      GemsStatus: [""],
      ClubCategory: [""],
      EligibleNonEligible: [""],
      PosBusniessstatus: [""],
      SrLoginStatus: [""],
      SrPolicyStatus: [""],
      From_Netpremium: [""],
      To_Netpremium: [""],
      DateTo: [""],
      DateFrom: [""],
      MobilePOSP: [""],
      prime_id: [""],
      State_Id: [""],
      RTO_Id: [""],
    });

    this.FetchStateData();

    this.SearchFormGlobelForm = this.fb.group({
      GlobalSearch: ["", [Validators.required]],
    });

    this.SRSource_Ar = [
      { Id: "BMS','CRM','Offline','Online','Partner-Login", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];

    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

    // this.urlSegment = "business-reports";

    // alert(this.urlSegment);

    //REQUEST TYPE (VIEW OR MANAGER)

    //this.SearchForm.get('FinancialYear').setValue( [{Id:'2021-22',Name:'2021-22'}]);
    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.GemsQuaterData = [
      { Id: "frist", Name: "Apr-Jun" },
      { Id: "second", Name: "Jul-Sep" },
      { Id: "third", Name: "Oct-Dec" },
      { Id: "fourth", Name: "Jan-Mar" },
    ];

    this.ClubCategory = [
      { Id: "Club", Name: "Club" },
      { Id: "Non Club", Name: "Non-Club" },
    ];

    this.ClubCategoryVal = [{ Id: "Club", Name: "Club" }];

    this.EligibleNonEligibleData = [
      { Id: "Eligible", Name: "Eligible" },
      { Id: "Non Eligible", Name: "Non-Eligible" },
    ];

    this.OnlyLi = [
      { Id: "Fresh", Name: "Fresh" },
      { Id: "Renewal", Name: "Renewal" },
    ];

    // this.BusniessGraphData = [
    //   { Id: "LOB_Id", Name: "LOB" },
    //   { Id: "Department_Id", Name: "Department" },
    //   { Id: "Source", Name: "Source" },
    //   { Id: "Insurer", Name: "Insurer" },
    //   { Id: "Rm Wise", Name: "Rm Wise" },
    // ];

    this.BusniessGraphData = [
      { Id: "LOB_Id", Name: "LOB" },
      { Id: "Department_Id", Name: "Department" },
      { Id: "Source", Name: "Source" },
      { Id: "Insurer", Name: "Insurer" },
      { Id: "Rm Wise", Name: "Rm Wise" },
      { Id: "State Wise Motor", Name: "State Wise Motor" },
    ];

    this.BusmiessGraphVal = [{ Id: "Rm Wise", Name: "Rm Wise" }];

    // this.SrSrLoginTYpe = [

    //   { Id: "Direct", Name: "Direct" },
    //   { Id: "Direct Login", Name: "Direct Login" }

    // ];

    // this.SrSr_PolicyType = [

    //   { Id: "2", Name: "Referred" },
    //   { Id: "", Name: "Non-Referred" }

    // ];

    this.SrSrLoginTYpe = [
      { Id: "Direct", Name: "Direct" },
      { Id: "Direct Login", Name: "Direct Login" },
    ];

    this.SrSr_PolicyStatus = [
      { Id: "2", Name: "Referred" },
      { Id: "0','1','3", Name: "Non-Referred" },
    ];

    this.EligibleNonEligibleVal = [{ Id: "Eligible", Name: "Eligible" }];

    this.GemsStatusData = [
      { Id: "Prime", Name: "Prime" },
      { Id: "silver", Name: "Silver" },
      { Id: "gold", Name: "Gold" },
      { Id: "diamond", Name: "Diamond" },
      { Id: "platinum", Name: "Platinum" },
      { Id: "titanium", Name: "Titanium" },
    ];

    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    var currentDate = new Date();
    //var CurrentYears=(new Date()).getFullYear();
    var currentDateString =
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear();
    var OneMonthBefore =
      currentDate.getDate() +
      "/" +
      currentDate.getMonth() +
      "/" +
      currentDate.getFullYear();
    var currentDateString = OneMonthBefore + " - " + currentDateString;

    // this.SearchForm.get("DateOrDateRange").setValue(
    //   new Date("Dec 01 2021 15:05:31 GMT+0530 ,Dec 08 2021 15:05:31 GMT+0530")
    // );

    if (this.urlSegment == "business-reports") {
      this.ReportsSection = "Business";
    }
  }

  ngOnInit() {
    this.GetRightsByUrl();

    // this.Send_Renewal_mailCondition ="Display:block";
    this.SelectStatus = [
      { Id: "1", Name: "Active" },
      { Id: "2", Name: "Inactive" },
    ];

    this.SelectStatusValue = [{ Id: "1", Name: "Active" }];

    $("#Send_Renewal_mail").hide();

    if (this.api.GetUserType() == "employee") {
      // console.log(this.api.GetUserData("EmployeeType"));
      if (
        this.api.GetUserData("profileType") == 22 ||
        this.api.GetUserData("profileType") == 108 ||
        this.api.GetUserData("Profile_Type") == 22 ||
        this.api.GetUserData("Profile_Type") == 108
      ) {
        this.EmployeeType = "HOD";
      }
    }

    this.SearchForm.get("LoginScope_Id").setValue([
      { Id: "Others", Name: "Others" },
    ]);

    if (this.urlSegment == "cases") {
      this.PageType = "";
    }
    if (this.urlSegmentSub == "renewals") {
      this.PageType = "Reports";
    }

    this.SrSr_Status = [
      { Id: "'Pending','Complete'", Name: "Logged" },
      { Id: "'Complete'", Name: "Booked" },
      { Id: "'Issued'", Name: "Issued" },
      { Id: "'Rejected'", Name: "Rejected" },
      { Id: "'Pending'", Name: "UnBooked" },
      { Id: "'Cancellation'", Name: "Cancelled" },
    ];

    this.SrSr_Type = [
      { Id: "Normal", Name: "Normal" },
      { Id: "Endorsement", Name: "Endorsement" },
      { Id: "Short", Name: "Short  SR" },
      { Id: "Recovery", Name: "Recovery" },
      { Id: "Extra-Payout", Name: "Extra Reward" },
    ];

    this.SrSr_StatusValue = [{ Id: "'Pending','Complete'", Name: "Logged" }];

    //Renewal
    if (
      (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "renewal") ||
      (this.urlSegmentRoot == "account" && this.urlSegment == "renewal") ||
      this.urlSegmentSub == "renewals"
    ) {
      this.TabTypeData = [
        { Id: "45_Days", Name: "45 Days" },
        { Id: "Today", Name: "Today" },
        { Id: "2_Days", Name: "2 Days" },
        { Id: "7_Days", Name: "7 Days" },
        { Id: "15_Days", Name: "15 Days" },
        { Id: "30_Days", Name: "30 Days" },
      ];

      this.RenewalStatusData = [
        { Id: "0 , 13", Name: "Pending" },
        { Id: "1", Name: "Follow Up" },
        { Id: "2", Name: "Renewed" },
        { Id: "4", Name: "Missed" },
        { Id: "3", Name: "Lost" },

        // { Id: "5", Name: "Lost OC" },
      ];

      this.SearchForm.get("Tab_Type").setValue([
        { Id: "45_Days", Name: "45 Days" },
      ]);

      if (this.urlSegmentRoot == "account" && this.urlSegment == "renewal") {
        this.PageType = "ManageRequests";
      }

      this.api.RenwalfilterTabType.subscribe(
        (message) => {
          // console.log("Calling From Login/Service Page ");
          // console.log(message);
          this.SearchForm.get("Tab_Type").setValue(message);
          this.SearchData("0");
        },
        (err) => {}
      );
    }

    //Recovery
    if (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "recovery") {
    }

    //
    this.searchEveryTime();
    this.loginType = this.api.GetUserType();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== GET URL ROUTE ID ====//
  GetRightsByUrl() {
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("RightType", this.api.DataRightsGetNavigation());
    formData.append("ReportsSection", this.ReportsSection);

    this.api.IsLoading();
    this.api.HttpPostType("V2/Rights/getUrlRouteId", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.urlSegmentId = result["data"];

          this.SearchVerticalData();
          this.businessFilterDataArray();

          this.rightType = result["RightType"];

          if (this.rightType == "All" || this.PageType == "ManageRequests") {
            this.reportTypeVal = [];
          } else {
            this.reportTypeVal = [{ Id: "Team", Name: "Team" }];
          }
          if (this.rightType == "All") {
            this.EmployeeType = "HOD";
          }
          //If Login Type Is Employee
          // if (
          //   this.rightType == "All" ||
          //   this.PageType == "Reports" ||
          //   this.PageType == "ManageRequests"
          // ) {
          //   this.searchEmployee("", 0);

          //   if (this.rightType == "All" || this.PageType == "ManageRequests") {
          //     this.searchAgents("", 0);
          //   }
          // } else if (this.loginType == "employee") {
          //   this.searchAgents("", 0);
          // }
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  //===== DATATABLE FILTER DATA ARRAY =====//
  CommanFieldsFilterData(Type: any) {
    // const formData = new FormData();
    // // var Fields = this.SearchForm.value;
    // var fields = this.SearchForm.value;
    // formData.append("segment", this.currentUrl);
    // formData.append("User_Id", this.api.GetUserData("Id"));
    // formData.append("User_Type", this.api.GetUserType());
    // formData.append("User_Code", this.api.GetUserData("Code"));
    // formData.append("portal", "Bms");
    // formData.append("urlSegmentId", this.urlSegmentId);
    // formData.append("ReportsSection", this.ReportsSection);
    // formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    // this.api.IsLoading();
    // this.api
    //   .HttpPostType("V2/Filter/FetchEmployeeHirerchyDetails", formData)
    //   .then(
    //     (result: any) => {
    //       this.api.HideLoading();
    //       if (result["Status"] == true) {
    //         this.DataStoreFunction = result["Data"];
    //         // this.verticalData = result["Data"]["verticalData"];
    //         // this.PersidentData = result["Data"]["PersidentData"];
    //         // this.zoneData = result["Data"]["zoneData"];
    //         // this.regionData = result["Data"]["regionData"];
    //         // this.SR_Session_Year = result["Data"]["SR_Session_Year"];
    //         // this.GlobelLOB = result["Data"]["LobData"];
    //         // this.subRegionData = result["Data"]["ServiceLocation"];
    //         // this.SearchVerticalData();
    //       } else {
    //         this.api.Toast("Warning", result["Message"]);
    //       }
    //     },
    //     (err) => {
    //       this.api.HideLoading();
    //       this.api.Toast(
    //         "Warning",
    //         "Network Error : " + err.name + "(" + err.statusText + ")"
    //       );
    //     }
    //   );
  }

  SearchVerticalData() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );
    this.api
      .HttpPostType(
        "V2/Filter/FetchEmployeeHirerchySearchVerticalData",
        formData
      )
      .then((result: any) => {
        if (result["Status"] == true) {
          this.BrokerData = result["Data"]["BrokerData"];
          this.verticalData = result["Data"]["verticalData"];
          this.SR_Session_Year = result["Data"]["SR_Session_Year"];
          this.BrokerSelectedVal = [{ Id: "1", Name: "SIBPL" }];

          this.searchZone();
          // this.GlobelLOB = result["Data"]["LobData"];
          // this.subRegionData = result["Data"]["ServiceLocation"];
          // this.employeeData = result["Data"]["employeeData"];
        }
      });
  }

  //===== SEARCH EVERY TIME DATA ARRAY =====//
  searchEveryTime() {
    this.empStatusValue = [{ Id: 3, Name: "All" }];

    this.employeeStatusData = [
      { Id: 3, Name: "All" },
      { Id: 1, Name: "Active" },
      { Id: 0, Name: "Inactive" },
      { Id: 2, Name: "Resigned" },
    ];

    this.reportTypeDataValue = [
      { Id: "Team", Name: "Team" },
      { Id: "Self", Name: "Self" },
    ];

    // this.reportTypeDataValue = [{Id:'All',Name:'All'},{Id:'POS',Name:'POS'},{Id:'SP',Name:'SP'}];
    this.agentTypeData = [
      { Id: "All", Name: "All" },
      { Id: "POS", Name: "POS" },
      { Id: "SP", Name: "SP" },
      { Id: "SPC", Name: "SPC" },
    ];

    this.PrimeData = [
      { Id: "All", Name: "All" },
      { Id: "Prime", Name: "Prime" },
      { Id: "Non-Prime", Name: "Non-Prime" },
    ];
    this.PrimeTypeVal = [{ Id: "All", Name: "All" }];

    if (this.urlSegment == "gems-reports")
      this.agentTypeVal = [{ Id: "POS", Name: "POS" }];
    else this.agentTypeVal = [{ Id: "All", Name: "All" }];
  }

  //===== BUSINESS, CANCELLATION, ENDORSEMENT FILTER DATA ARRAY =====//
  businessFilterDataArray() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/PolicyFilterType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&url=" +
          this.currentUrl
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Ins_Compaines = result["Data"]["Ins_Compaines"];
            this.SRSource_Ar = [
              {
                Id: "BMS','CRM','Offline','Online','Partner-Login",
                Name: "Offline",
              },
              { Id: "Web", Name: "Online" },
              { Id: "Excel", Name: "Excel" },

              // { Id: "BMS','CRM", Name: "Offline" },

              // { Id: "Web", Name: "Online" },
              // { Id: "Excel", Name: "Excel" },
            ];
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
        }
      );
  }

  onkeypress() {
    // alert();
    var fields = this.SearchForm.value;

    // const From_Netpremium1 = this.SearchForm.get("From_Netpremium").value();
    // const To_Netpremium1 = this.SearchForm.get("To_Netpremium").value();

    var From_Netpremium1 = fields["From_Netpremium"];
    var To_Netpremium1 = fields["To_Netpremium"];

    if (From_Netpremium1 > To_Netpremium1) {
      // alert();
      // console.log(From_Netpremium1);

      const To_Netpremium2 = this.SearchForm.get("To_Netpremium");

      To_Netpremium2.setValidators([
        Validators.pattern("[0-9]*"),
        Validators.min(From_Netpremium1),
      ]);
      To_Netpremium2.updateValueAndValidity();
    }
    if (From_Netpremium1 < To_Netpremium1) {
      // alert();
      // console.log(From_Netpremium1);

      const To_Netpremium2 = this.SearchForm.get("To_Netpremium");

      To_Netpremium2.setValidators([
        Validators.pattern("[0-9]*"),
        Validators.min(From_Netpremium1),
      ]);
      To_Netpremium2.updateValueAndValidity();
    }
  }

  get FC1() {
    return this.SearchFormGlobelForm.controls;
  }

  //=====SEND FILTER FORM DATA =====//
  SearchData(FilterType: any) {
    var flag = 0;
    var GlobalSearch = "";
    var fields = this.SearchForm.value;
    var fields1 = this.SearchFormGlobelForm.value;

    if (FilterType == "1") {
      this.isSubmitted1 = true;
      if (this.SearchFormGlobelForm.invalid) {
        return;
      } else {
        flag = 1;
      }

      GlobalSearch = fields1["GlobalSearch"];
    } else {
      this.isSubmitted = true;
      if (this.SearchForm.invalid) {
        return;
      } else {
        flag = 1;
      }
    }

    // this.isSubmitted = true;
    // if (this.SearchForm.invalid) {
    //   return;
    // } else {
    if (
      this.urlSegment == "active-inactive-pos" ||
      this.urlSegment == "active-inactive-pos-reports"
    ) {
      this.onkeypress();
    }
    var fields = this.SearchForm.value;
    var DateOrDateRange = fields["DateOrDateRange"];

    var DateOrDateRange = fields["DateOrDateRange"];

    var DateTo = fields["DateTo"];
    var DateFrom = fields["DateFrom"];
    var DateToToDate, DateToFromDate;

    if (DateTo) {
      DateToToDate = DateTo[0];
      DateToFromDate = DateTo[1];
    }
    var DateFromToDate, DateFromFromDate;

    if (DateFrom) {
      DateFromToDate = DateFrom[0];
      DateFromFromDate = DateFrom[1];
    }

    var ToDate, FromDate;
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    //gems Reports
    if (this.urlSegment == "gems-reports") {
      this.SearchForm.get("FinancialYear").setValidators([Validators.required]);
    } else {
      this.SearchForm.get("FinancialYear").setValidators(null);
    }
    this.SearchForm.get("FinancialYear").updateValueAndValidity();

    this.SearchButtonDisabled = true;

    if (this.urlSegment == "business-reports-new") {
      // Enable the button after 3 seconds

      this.api.HideLoading();
      this.SearchButtonDisabled = false;
    } else {
      // Enable the button after 3 seconds
      setTimeout(() => {
        this.SearchButtonDisabled = false;
      }, 3000);
    }

    const postval = {
      User_Id: this.api.GetUserData("Id"),
      User_Type: this.api.GetUserType(),
      Portal: "Bms",
      BusniessGraph: fields["BusniessGraph"],
      Broker_Id: fields["Broker_Id"],
      Vertical_Id: fields["Vertical_Id"],
      Zone_Id: fields["Zone_Id"],
      Tier_Id: fields["Tier_Id"],

      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],
      Ro_Id: fields["Ro_Id"],

      EmployeeStatus: fields["EmployeeStatus"],
      Emp_Id: fields["Emp_Id"],
      Report_Type: fields["Report_Type"],
      Agent_Type: fields["Agent_Type"],
      Agent_Id: fields["Agent_Id"],
      FinancialYear: fields["FinancialYear"],

      Source: fields["Source"],
      LOB: fields["LOB"],
      File_Type: fields["File_Type"],
      Product_Ids: fields["Product_Ids"],
      Segment_Ids: fields["Segment_Ids"],
      Plan_Type: fields["Plan_Type"],
      SubProduct_Ids: fields["SubProduct_Ids"],
      Class_Ids: fields["Class_Ids"],
      Sub_Class_Ids: fields["Sub_Class_Ids"],

      Fresh_Renewal: fields["Fresh_Renewal"],

      PolicyFileType: fields["PolicyFileType"],
      PolicyType: fields["PolicyType"],
      ProductType: fields["ProductType"],
      Company: fields["Company"],

      Posting_Status_Web: fields["Earning_Filter_User"],

      //RENEWAL REPORT
      Tab_Type: fields["Tab_Type"],
      RenewalStatus: fields["RenewalStatus"],
      prime_id: fields["prime_id"],

      To_Date: ToDate,
      From_Date: FromDate,
      SearchValue: trim(fields["SearchValue"]),
      Sr_Type: fields["Sr_Type"],
      Sr_Status: fields["Sr_Status"],
      Gems_Quater: fields["GemsQuater"],
      Gems_Status: fields["GemsStatus"],
      Club_Category: fields["ClubCategory"],
      EligibleNon_Eligible: fields["EligibleNonEligible"],
      PosBusniessstatus: fields["PosBusniessstatus"],

      SrLoginTYpe: fields["SrLoginStatus"],
      SrPolicyStatus: fields["SrPolicyStatus"],

      DateToToDate: DateToToDate,
      DateToFromDate: DateToFromDate,
      DateFromToDate: DateFromToDate,
      DateFromFromDate: DateFromFromDate,
      GlobalSearch: GlobalSearch,
      State_Id: fields["State_Id"],
      RTO_Id: fields["RTO_Id"],
    };

    this.postCreated.emit(postval);
    // }
  }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Financial Year
    if (Type == "FinancialYear") {
      var Years = item.Id;
      var Explods = Years.split("-");
      var Year1 = parseInt(Explods[0]);
      var Year2 = Year1 + 1;
      this.minDate = new Date("04-01-" + Year1);

      // this.CommanFieldsFilterData("");
      if (
        this.urlSegmentRoot == "custom-reports" &&
        this.urlSegment == "custom-active-inactive-pos"
      ) {
        this.maxDate = new Date();
      } else {
        this.maxDate = new Date("03-31-" + Year2);
      }
      this.SearchForm.get("DateOrDateRange").setValue("");
    }
    //Lob
    if (Type == "LOB") {
      this.LOB();
      this.searchAgents("", 0);
    }
    if (Type == "File_Type") {
      this.Plan_Type_Ar = [];
      this.Segment_Ar = [];
      this.SubProducts_Ar = [];
      this.Classes_Ar = [];
      this.Sub_Classes_Ar = [];
      this.Make_Ar = [];
      this.Model_Ar = [];
      this.SearchForm.get("Product_Ids").setValue(null);
      this.SearchForm.get("Plan_Type").setValue(null);
      this.SearchForm.get("SubProduct_Ids").setValue(null);
      this.SearchForm.get("Segment_Ids").setValue(null);
      this.SearchForm.get("Class_Ids").setValue(null);
      this.SearchForm.get("Sub_Class_Ids").setValue(null);
      this.File_Type();
    } else if (Type == "InsuranceCompany") {
      this.File_Type();
    } else if (Type == "Product") {
      this.Product();
    } else if (Type == "PolicyType") {
      this.PolicyTypenew();
    } else if (Type == "PlanType") {
      this.PlanType();
    } else if (Type == "SubProduct") {
      this.SubProduct();
    } else if (Type == "Class") {
      this.Classes();
    }
  }

  FetchStateData() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("V2/Filter/FetchStateData", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.StateData = result["Data"];

          this.FetchRTOData();
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
      }
    );
  }

  FetchRTOData() {
    const formData = new FormData();
    var fields = this.SearchForm.value;

    formData.append("State_Id", JSON.stringify(fields["State_Id"]));

    this.api.IsLoading();
    this.api.HttpPostType("V2/Filter/FetchRTOData", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.RTOData = result["Data"];
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
      }
    );
  }
  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical

    if (Type == "Persident_Id") {
      this.SearchForm.get("Vertical_Id").setValue("");
      this.SearchForm.get("Ro_Id").setValue("");
      this.SearchForm.get("Sub_Region_Id").setValue("");
      this.SearchForm.get("Tier_Id").setValue("");

      this.SearchForm.get("Region_Id").setValue("");
      this.SearchForm.get("Zone_Id").setValue("");
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");
      if (this.SearchForm.get("Vertical_Id").value.length > 0) {
        // this.CommanFieldsFilterData(this.urlSegmentId);
      } else {
        // this.CommanFieldsFilterData(this.urlSegmentId);
        this.searchEmployee("", 0);
      }
      if (this.PageType == "Reports") {
        this.agentData = [];
      }
      this.subRegionData = [];
    }

    if (Type == "Vertical") {
      this.SearchForm.get("Ro_Id").setValue("");
      this.SearchForm.get("Sub_Region_Id").setValue("");
      this.SearchForm.get("Region_Id").setValue("");
      this.SearchForm.get("Tier_Id").setValue("");
      this.SearchForm.get("Zone_Id").setValue("");
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");
      if (this.SearchForm.get("Vertical_Id").value.length > 0) {
        this.searchZone();
      } else {
        // this.CommanFieldsFilterData(this.urlSegmentId);
        this.searchZone();
      }
      if (this.PageType == "Reports") {
        this.agentData = [];
      }
      this.subRegionData = [];
    }

    //Region
    //  if (Type == "Region") {
    //   this.SearchForm.get("Emp_Id").setValue("");
    //   this.SearchForm.get("Report_Type").setValue("");
    //   this.SearchForm.get("Agent_Id").setValue("");
    //   if (this.SearchForm.get("Region_Id").value.length > 0) {
    //     this.searchEmployee("", 0);
    //   } else {
    //     this.searchRegion();
    //     this.subRegionData = [];
    //   }
    //   if (this.PageType == "Reports") {
    //     this.agentData = [];
    //   }
    // }

    //Region
    if (Type == "Region") {
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");
      if (this.SearchForm.get("Region_Id").value.length > 0) {
        this.searchEmployee("", 0);
      } else {
        this.searchRegion();
        this.subRegionData = [];
      }
      if (this.PageType == "Reports") {
        this.agentData = [];
      }
    }
    //Employee
    if (Type == "employee") {
      this.SearchForm.get("Agent_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      if (this.SearchForm.get("Emp_Id").value.length > 0) {
        this.searchAgents("", 0);
      } else {
        this.searchEmployee("", 0);
        if (this.PageType == "Reports") {
          this.agentData = [];
        }
      }
    }
    //LOB
    if (Type == "GlobelLOB") {
      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      // console.log(this.ItemLOBSelection);
      // this.GetProducts("OneByOneDeSelect");
    }
    //Lob
    if (Type == "LOB") {
      this.LOB();
    }
    if (Type == "File_Type") {
      this.File_Type();
    } else if (Type == "InsuranceCompany") {
      this.File_Type();
    } else if (Type == "Product") {
      this.Product();
    } else if (Type == "PolicyType") {
      this.PolicyTypenew();
    } else if (Type == "PlanType") {
      this.PlanType();
    } else if (Type == "SubProduct") {
      this.SubProduct();
    } else if (Type == "Class") {
      this.Classes();
    }
  }

  onSelectAll(items: any, Type: any) {
    if (Type == "File_Type") {
      this.File_Type();
    } else if (Type == "Product") {
      this.Product();
    } else if (Type == "PolicyType") {
      this.PolicyTypenew();
    } else if (Type == "PlanType") {
      this.PlanType();
    } else if (Type == "SubProduct") {
      this.SubProduct();
    } else if (Type == "Class") {
      this.Classes();
    }
    //Lob
    if (Type == "LOB") {
      this.LOB();
    }
  }

  onDeSelectAll(items: any, Type: any) {
    if (Type == "File_Type") {
      this.File_Type();
    } else if (Type == "Product") {
      this.Product();
    } else if (Type == "PolicyType") {
      this.PolicyTypenew();
    } else if (Type == "PlanType") {
      this.PlanType();
    } else if (Type == "SubProduct") {
      this.SubProduct();
    } else if (Type == "Class") {
      this.Classes();
    }
    //Lob
    if (Type == "LOB") {
      this.LOB();
    }
  }

  //===== GET FILTER ARRAY DATA ON SELECT DESELECT =====//
  GetProducts(Type: any) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", this.ItemLOBSelection.join());
    formData.append("ReportsSection", this.ReportsSection);

    this.api.IsLoading();
    this.api.HttpPostType("Globel/GetProductBms", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.PolicyFileType = this.removeDuplicates(
            result["Data"]["PolicyFileType"],
            "Id"
          );
          this.ProductType = result["Data"]["ProductType"];
          this.PolicyType = result["Data"]["PolicyType"];
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
      }
    );
  }

  //===== REMOVE FORM DUPLICATE VALUES =====//
  removeDuplicates(originalArray, Id) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][Id]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  //===== SEARCH ZONE DATA =====//
  searchZone() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchZoneData", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.zoneData = result["Data"]["zoneData"];
          this.searchRo();
          // this.GlobelLOB = result["Data"]["LobData"];
          // this.subRegionData = result["Data"]["ServiceLocation"];
          // this.employeeData = result["Data"]["employeeData"];
        }
      });
  }

  searchRo() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchROData", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.RoData = result["Data"]["ROdATA"];
          this.searchRegion();
          // this.GlobelLOB = result["Data"]["LobData"];
          // this.subRegionData = result["Data"]["ServiceLocation"];
          // this.employeeData = result["Data"]["employeeData"];
        }
      });
  }

  //===== SEARCH REGION DATA =====//
  searchRegion() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("Ro_Id", JSON.stringify(fields["Ro_Id"]));
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchBranchData", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          // this.GlobelLOB = result["Data"]["LobData"];
          this.BranchData = result["Data"]["BranchData"];
          this.searchTier();

          // this.employeeData = result["Data"]["employeeData"];
          // this.searchEmployee("", 0);

          // // console.log(result:any);
        }
      });
  }

  searchTier() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("Ro_Id", JSON.stringify(fields["Ro_Id"]));
    formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchTierData", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          // this.GlobelLOB = result["Data"]["LobData"];
          this.TierData = result["Data"]["Tier"];
          // this.employeeData = result["Data"]["employeeData"];

          this.searchSubRegion();

          // // console.log(result:any);
        }
      });
  }

  //===== SEARCH REGION DATA =====//
  searchSubRegion() {
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("Ro_Id", JSON.stringify(fields["Ro_Id"]));
    formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
    formData.append("Tier_Id", JSON.stringify(fields["Tier_Id"]));
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchRegionData", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          // this.GlobelLOB = result["Data"]["LobData"];
          this.subRegionData = result["Data"]["ServiceLocation"];
          // this.employeeData = result["Data"]["employeeData"];

          this.searchEmployee("", 0);

          // // console.log(result:any);
        }
      });
  }

  //=====SEARCH EMPLOYEE DATA=====//
  searchEmployee(searchText: any, type: any) {
    // alert();
    var searchTerm = "";
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";

    if (type == 1) {
      searchTerm = searchText.target.value;
    }
    if (searchTerm == "") {
      this.employeeData = [];
    }
    var fields = this.SearchForm.value;

    // if(JSON.stringify(fields["Vertical_Id"]) == '""' && JSON.stringify(fields["Zone_Id"]) =='""' && JSON.stringify(fields["Sub_Region_Id"]) =='""' ){
    //   alert();
    //   this.employeeData = [];

    // }else{

    // console.log(fields);

    var fields = this.SearchForm.value;

    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("portal", "Bms");
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));

    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("subRegion", JSON.stringify(fields["Sub_Region_Id"]));
    formData.append("Ro_Id", JSON.stringify(fields["Ro_Id"]));
    formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
    formData.append("Tier_Id", JSON.stringify(fields["Tier_Id"]));

    formData.append("employeeStatus", JSON.stringify(fields["EmployeeStatus"]));
    formData.append("searchTerm", searchTerm);
    formData.append("ReportsSection", this.ReportsSection);
    formData.append("FinancialYear", JSON.stringify(fields["FinancialYear"]));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "DataStoreFunction",
      JSON.stringify(this.DataStoreFunction)
    );

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchEmployee", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          // this.agentType = result["Data"]["agentType"];
          this.employeeData = result["Data"]["employeeData"];
          this.GlobelLOB = result["Data"]["LobData"];
        }
      });
    // }

    // const formData = new FormData();
    // formData.append("loginId", this.api.GetUserData("Id"));
    // formData.append("loginType", this.api.GetUserType());
    // formData.append("searchTerm", searchTerm);
    // formData.append("mainOption", this.mainOption);
    // formData.append("subOption", this.subOption);
    // formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    // formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    // formData.append("region", JSON.stringify(fields["Region_Id"]));
    // formData.append("subRegion", JSON.stringify(fields["Sub_Region_Id"]));
    // formData.append("employeeStatus", JSON.stringify(fields["EmployeeStatus"]));
    // formData.append("portal", "Bms");
    // formData.append("pageType", this.PageType);
    // formData.append("Right", this.api.DataRightsGetNavigation());
    // formData.append("urlSegmentId", this.urlSegmentId);

    // this.api
    //   .HttpPostType("V2/Filter/commonSearchEmployee", formData)
    //   .then((result:any) => {
    //     if (result["status"] == true) {
    //       this.employeeData = result["data"];
    //       if (this.PageType == "Reports") {
    //         this.agentData = [];
    //       }
    //     }
    //   });
  }

  //=====SEARCH AGENTS DATA=====//
  searchAgents(searchText: any, type: any) {
    var searchTerm = "";
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";

    if (type == 1) {
      searchTerm = searchText.target.value;
    }
    if (searchTerm == "") {
      this.agentData = [];
    }

    var fields = this.SearchForm.value;
    // alert  (JSON.stringify(fields['Report_Type']));
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("searchTerm", searchTerm);
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);

    formData.append("Persident", JSON.stringify(fields["Persident_Id"]));
    formData.append("prime_id", JSON.stringify(fields["prime_id"]));

    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("subRegion", JSON.stringify(fields["Sub_Region_Id"]));

    formData.append("Ro_Id", JSON.stringify(fields["Ro_Id"]));
    formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
    formData.append("Tier_Id", JSON.stringify(fields["Tier_Id"]));

    formData.append("employeeStatus", JSON.stringify(fields["EmployeeStatus"]));
    formData.append("empId", JSON.stringify(fields["Emp_Id"]));
    formData.append("reportType", JSON.stringify(fields["Report_Type"]));
    formData.append("agentType", JSON.stringify(fields["Agent_Type"]));
    formData.append("lob", JSON.stringify(fields["LOB"]));

    formData.append("portal", "Bms");
    formData.append("pageType", this.PageType);
    formData.append("Right", this.api.DataRightsGetNavigation());
    formData.append("urlSegmentId", this.urlSegmentId);
    formData.append("ReportsSection", this.ReportsSection);

    this.api
      .HttpPostType("V2/Filter/FetchEmployeeHirerchySearchAgents", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          // this.agentType = result["Data"]["agentType"];
          this.agentData = result["Data"]["AgentData"];
          // this.GlobelLOB = result["Data"]["LobData"];
        } else {
          // this.api.Toast('Warning',result['msg']);
        }
      });
  }

  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);

    // this.SearchForm.reset();
  }

  LOB() {
    this.File_Type_Ar = [];
    this.Products_Ar = [];
    this.Plan_Type_Ar = [];
    this.Segment_Ar = [];
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.RTO_Ar = [];
    this.SearchForm.get("File_Type").setValue(null);
    this.SearchForm.get("Product_Ids").setValue(null);
    this.SearchForm.get("Plan_Type").setValue(null);
    this.SearchForm.get("SubProduct_Ids").setValue(null);
    this.SearchForm.get("Segment_Ids").setValue(null);
    this.SearchForm.get("Class_Ids").setValue(null);
    this.SearchForm.get("Sub_Class_Ids").setValue(null);
    const formData = new FormData();
    formData.append("PO_Group", "");
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append("Ins_Compaines_Ids", "");
    formData.append("Portal", "crm");
    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetBusniessFilter", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.File_Type_Ar = result["Data"]["FileType"];
          this.File_Type();
        } else {
          this.Products_Ar = [];
          this.Ins_Companies_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }

  File_Type() {
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append(
      "File_Type",
      JSON.stringify(this.SearchForm.value["File_Type"])
    );
    formData.append(
      "Ins_Compaines_Ids",
      JSON.stringify(this.SearchForm.value["Ins_Compaines_Ids"])
    );

    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetProductsCrm", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"]["Product"];
          this.Product();
        } else {
          this.Products_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }

  Product() {
    //// console.log(this.SearchForm.value['Product_Ids']);
    this.Plan_Type_Ar = [];
    this.Segment_Ar = [];
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];
    this.SearchForm.get("Plan_Type").setValue(null);
    this.SearchForm.get("SubProduct_Ids").setValue(null);
    this.SearchForm.get("Segment_Ids").setValue(null);
    this.SearchForm.get("Class_Ids").setValue(null);
    this.SearchForm.get("Sub_Class_Ids").setValue(null);
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append(
      "File_Type",
      JSON.stringify(this.SearchForm.value["File_Type"])
    );
    formData.append("Company_Id", "");
    formData.append(
      "Product_Ids",
      JSON.stringify(this.SearchForm.value["Product_Ids"])
    );

    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetPolicyTypeCrm", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"]["PolicyType"];
          this.PolicyTypenew();
        } else {
          this.Segment_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }

  PolicyTypenew() {
    //// console.log(this.SearchForm.value['Product_Ids']);
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];
    this.SearchForm.get("SubProduct_Ids").setValue(null);
    this.SearchForm.get("Class_Ids").setValue(null);
    this.SearchForm.get("Sub_Class_Ids").setValue(null);
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append(
      "File_Type",
      JSON.stringify(this.SearchForm.value["File_Type"])
    );
    formData.append("Company_Id", "");
    formData.append(
      "Product_Ids",
      JSON.stringify(this.SearchForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.SearchForm.value["Segment_Ids"])
    );

    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetPlanTypeCrm", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.Plan_Type_Ar = result["Data"]["PlanType"];
          this.PlanType();
        } else {
          this.Plan_Type_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }

  PlanType() {
    //// console.log(this.SearchForm.value['Product_Ids']);
    this.SubProducts_Ar = [];
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];
    this.SearchForm.get("SubProduct_Ids").setValue(null);
    this.SearchForm.get("Class_Ids").setValue(null);
    this.SearchForm.get("Sub_Class_Ids").setValue(null);
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append(
      "File_Type",
      JSON.stringify(this.SearchForm.value["File_Type"])
    );
    formData.append("Company_Id", "");
    formData.append(
      "Product_Ids",
      JSON.stringify(this.SearchForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.SearchForm.value["Segment_Ids"])
    );
    formData.append(
      "Plan_Type",
      JSON.stringify(this.SearchForm.value["Plan_Type"])
    );

    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetSubProductsCrm", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.SubProducts_Ar = result["Data"]["SubProducts"];
          this.SubProduct();
        } else {
          this.SubProducts_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }

  SubProduct() {
    //// console.log(this.SearchForm.value['Product_Ids']);
    this.Classes_Ar = [];
    this.Sub_Classes_Ar = [];
    this.Make_Ar = [];
    this.Model_Ar = [];
    this.SearchForm.get("Class_Ids").setValue(null);
    this.SearchForm.get("Sub_Class_Ids").setValue(null);
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append(
      "File_Type",
      JSON.stringify(this.SearchForm.value["File_Type"])
    );
    formData.append(
      "Product_Ids",
      JSON.stringify(this.SearchForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.SearchForm.value["Segment_Ids"])
    );
    formData.append(
      "Plan_Type",
      JSON.stringify(this.SearchForm.value["Plan_Type"])
    );
    formData.append(
      "SubProduct_Ids",
      JSON.stringify(this.SearchForm.value["SubProduct_Ids"])
    );

    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetClassesCrm", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.Classes_Ar = result["Data"]["Classes"];
          this.Classes();
        } else {
          this.Classes_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }

  Classes() {
    //// console.log(this.SearchForm.value['Product_Ids']);
    this.Make_Ar = [];
    this.Model_Ar = [];
    this.SearchForm.get("Sub_Class_Ids").setValue(null);
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["LOB"]));
    formData.append(
      "Product_Ids",
      JSON.stringify(this.SearchForm.value["Product_Ids"])
    );
    formData.append(
      "Segment_Ids",
      JSON.stringify(this.SearchForm.value["Segment_Ids"])
    );
    formData.append(
      "Plan_Type",
      JSON.stringify(this.SearchForm.value["Plan_Type"])
    );
    formData.append(
      "SubProduct_Ids",
      JSON.stringify(this.SearchForm.value["SubProduct_Ids"])
    );
    formData.append(
      "Class_Ids",
      JSON.stringify(this.SearchForm.value["Class_Ids"])
    );

    formData.append("ReportsSection", this.ReportsSection);

    this.api.HttpPostType("Fillter/Fillter/GetSubClassesCrm", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.Sub_Classes_Ar = result["Data"]["SubClasses"];
        } else {
          this.Sub_Classes_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.message + " ");
      }
    );
  }
} //END
