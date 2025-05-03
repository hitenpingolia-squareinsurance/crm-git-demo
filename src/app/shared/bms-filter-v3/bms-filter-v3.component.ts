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
  LOB: [""];
  File_Type: [""];
  Product_Ids: [""];
  Segment_Ids: [""];
  Plan_Type: [""];
  SubProduct_Ids: [""];
  Class_Ids: [""];
  Sub_Class_Ids: [""];
  Posting_Status_Web: any[];
  Tab_Type: any[];
  RenewalStatus: any[];
  To_Date: any[];
  From_Date: any[];
  SearchValue: any;
}

@Component({
  selector: "app-bms-filter-v3",
  templateUrl: "./bms-filter-v3.component.html",
  styleUrls: ["./bms-filter-v3.component.css"],
})
export class BmsFilterV3Component implements OnInit {
  post: Post;
  @Output() postCreated = new EventEmitter<Post>();
  ButtonDisableTrue: boolean = false;
  SearchForm: FormGroup;
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
  SrSrLoginTYpe: { Id: string; Name: string }[];
  SrSr_PolicyType: { Id: string; Name: string }[];
  SrSr_PolicyStatus: { Id: string; Name: string }[];
  Agent_TypeDisplay: string;
  Mobile_Ar: { Id: string; Name: string }[];
  Loginid: any;
  LoginType: string | null;
  BusniessGraphData: { Id: string; Name: string }[];
  BusmiessGraphVal: { Id: string; Name: string }[];
  Products_Ar: { Id: string; Name: string }[];
  Plan_Type_Ar: { Id: string; Name: string }[];
  Segment_Ar: { Id: string; Name: string }[];
  SubProducts_Ar: { Id: string; Name: string }[];
  Classes_Ar: { Id: string; Name: string }[];
  Sub_Classes_Ar: { Id: string; Name: string }[];
  Make_Ar: { Id: string; Name: string }[];
  Model_Ar: { Id: string; Name: string }[];
  RTO_Ar: { Id: string; Name: string }[];
  Ins_Companies_Ar: { Id: string; Name: string }[];
  File_Type_Ar: { Id: string; Name: string }[];
  Brokers_Ar: any;
  SearchButtonDisabled: boolean = false;

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
      Vertical_Id: [""],
      Region_Id: [""],
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
    });
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    // alert(splitted[3]);
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }
    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }
    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }
    // alert(this.urlSegment);
    //REQUEST TYPE (VIEW OR MANAGER)
    //this.SearchForm.get('FinancialYear').setValue( [{Id:'2021-22',Name:'2021-22'}]);
    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
    this.post = {} as Post;
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
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
      { Id: "Alls", Name: "Complete FY." },
      { Id: "frist", Name: "Apr-Jun" },
      { Id: "second", Name: "Jul-Sep" },
      { Id: "third", Name: "Oct-Dec" },
      { Id: "fourth", Name: "Jan-Mar" },
    ];
    this.ClubCategory = [
      { Id: "Club", Name: "Club" },
      { Id: "Non Club", Name: "Non-Club" },
    ];
    this.ClubCategory = [
      { Id: "Club", Name: "Club" },
      { Id: "Non Club", Name: "Non-Club" },
    ];
    this.SrSrLoginTYpe = [
      { Id: "POSP Login", Name: "POSP Login" },
      { Id: "Direct SIBPL", Name: "Direct SIBPL" },
      { Id: "Direct Login", Name: "Direct Login" },
    ];
    this.SrSr_PolicyStatus = [
      { Id: "2", Name: "Referred" },
      { Id: "0','1','3", Name: "Non-Referred" },
    ];
    this.ClubCategoryVal = [{ Id: "Club", Name: "Club" }];
    this.EligibleNonEligibleData = [
      { Id: "Eligible", Name: "Eligible" },
      { Id: "Non Eligible", Name: "Non-Eligible" },
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
  }

  ngOnInit() {
    this.GetRightsByUrl();
    // this.Send_Renewal_mailCondition ="Display:block";
    this.SelectStatus = [
      { Id: "1", Name: "Active" },
      { Id: "2", Name: "Inactive" },
    ];
    this.LOB();
    this.SelectStatusValue = [{ Id: "1", Name: "Active" }];
    $("#Send_Renewal_mail").hide();
    this.Loginid = this.api.GetUserId();
    this.LoginType = this.api.GetUserType();
    if (this.api.GetUserType() == "employee") {
      // console.log(this.api.GetUserData("EmployeeType"));
      if (
        this.api.GetUserData("department") == 19 ||
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
    this.getUrlRouteId();
    if (this.urlSegment == "cases") {
      this.PageType = "";
    }
    if (this.urlSegmentSub == "renewals") {
      this.PageType = "Reports";
    }
    this.SrSr_Status = [
      { Id: "'Pending','Complete'", Name: "Logged" },
      { Id: "'Complete'", Name: "Booked" },
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
      this.urlSegmentSub == "renewals" ||
      this.urlSegment == "renewal-custom-report"
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
          this.SearchData();
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
    if (
      this.urlSegmentRoot == "custom-reports" &&
      this.urlSegment == "custom-active-inactive-pos"
    ) {
      this.maxDate = new Date();
      //    this.BusniessGraphData = [
      //   { Id: "Department_Id", Name: "Department" },
      // ];
    }
    //Recovery
    if (this.loginType == "agent") {
      // alert();
      this.SelectMobilePosp();
    }
  }

  //===== GET URL ROUTE ID ====//
  GetRightsByUrl() {
    const formData = new FormData();
    formData.append("segment", this.currentUrl);
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("RightType", this.api.DataRightsGetNavigation());

    this.api.IsLoading();
    this.api.HttpPostType("V2/Rights/GetRightsByUrl", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.urlSegmentId = result["UrlId"];
          this.CommanFieldsFilterData(this.urlSegmentId);

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
          if (
            this.rightType == "All" ||
            this.PageType == "Reports" ||
            this.PageType == "ManageRequests"
          ) {
            this.searchEmployee("", 0);

            if (this.rightType == "All" || this.PageType == "ManageRequests") {
              this.searchAgents("", 0);
            }
          } else if (this.loginType == "employee") {
            this.searchAgents("", 0);
          }
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

  gemsPoupup(Types: number, $event) {
    var gemsvalue = this.SearchForm.get("GemsQuater").value;
    var Values = $event.Id;
    if (Types == 1) {
      if (Values == "Alls") {
        this.SearchForm.get("GemsQuater").setValue([
          { Id: "Alls", Name: "Complete FY" },
          { Id: "frist", Name: "Apr-Jun" },
          { Id: "second", Name: "Jul-Sep" },
          { Id: "third", Name: "Oct-Dec" },
          { Id: "fourth", Name: "Jan-Mar" },
        ]);
      }
    } else {
      if (Values == "Alls") {
        this.SearchForm.get("GemsQuater").setValue([]);
      }
    }
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SEARCH EVERY TIME DATA ARRAY =====//
  searchEveryTime() {
    this.empStatusValue = [{ Id: 3, Name: "All" }];
    this.employeeStatusData = [
      { Id: 3, Name: "All" },
      { Id: 1, Name: "Active" },
      { Id: "0", Name: "Inactive" },
      { Id: "2", Name: "Resigned" },
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
    ];
    if (
      this.urlSegment == "gems-reports" ||
      this.urlSegmentRoot == "Tele-Rm-Reports"
    ) {
      this.agentTypeVal = [{ Id: "POS", Name: "POS" }];
      this.Agent_TypeDisplay = "none";
    } else {
      this.Agent_TypeDisplay = "Block";
      this.agentTypeVal = [{ Id: "All", Name: "All" }];
    }
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

  //===== DATATABLE FILTER DATA ARRAY =====//
  CommanFieldsFilterData(urlSegmentId: any) {
    // alert(this.urlSegmentId);
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "V2/Filter/CommanFieldsFilterData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&portal=Bms&empType=" +
          this.EmployeeType +
          "&EmpId=" +
          this.api.GetUserData("Code") +
          "&Right=" +
          this.api.DataRightsGetNavigation() +
          "&urlSegmentId=" +
          urlSegmentId
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.verticalData = result["Data"]["verticalData"];
            this.zoneData = result["Data"]["zoneData"];
            this.regionData = result["Data"]["regionData"];
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];
            this.EarningStatusData = result["Data"]["EarningStatusData"];
            this.LoginScopeData = result["Data"]["LoginScope"];
            this.GlobelLOB = result["Data"]["LobData"];
            this.subRegionData = result["Data"]["ServiceLocation"];
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

  //=====SEND FILTER FORM DATA =====//
  SearchData() {
    var fields = this.SearchForm.value;
    this.isSubmitted = true;
    if (this.urlSegment == "active-inactive-pos") {
      this.onkeypress();
    }
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
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
        this.SearchForm.get("FinancialYear").setValidators([
          Validators.required,
        ]);
        //this.SearchForm.get("GemsStatus").setValidators([Validators.required]);
        //this.SearchForm.get("GemsQuater").setValidators([Validators.required]);
      } else {
        this.SearchForm.get("FinancialYear").setValidators(null);
        //this.SearchForm.get("GemsStatus").setValidators(null);
        //this.SearchForm.get("GemsQuater").setValidators(null);
      }
      this.SearchForm.get("FinancialYear").updateValueAndValidity();
      // this.SearchForm.get("GemsStatus").updateValueAndValidity();
      //this.SearchForm.get("GemsQuater").updateValueAndValidity();
      //gems Reports

      this.SearchButtonDisabled = true;

      // Enable the button after 3 seconds
      setTimeout(() => {
        this.SearchButtonDisabled = false;
      }, 3000);

      const post = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        Portal: "Bms",
        BusniessGraph: fields["BusniessGraph"],
        Vertical_Id: fields["Vertical_Id"],
        Zone_Id: fields["Zone_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],
        EmployeeStatus: fields["EmployeeStatus"],
        Emp_Id: fields["Emp_Id"],
        Report_Type: fields["Report_Type"],
        Agent_Type: fields["Agent_Type"],
        Agent_Id: fields["Agent_Id"],
        FinancialYear: fields["FinancialYear"],
        Source: fields["Source"],
        Company: fields["Company"],
        LOB: fields["LOB"],
        File_Type: fields["File_Type"],
        Ins_Compaines_Ids: fields["Ins_Compaines_Ids"],
        Product_Ids: fields["Product_Ids"],
        Segment_Ids: fields["Segment_Ids"],
        Plan_Type: fields["Plan_Type"],
        SubProduct_Ids: fields["SubProduct_Ids"],
        Class_Ids: fields["Class_Ids"],
        Sub_Class_Ids: fields["Sub_Class_Ids"],
        Posting_Status_Web: fields["Earning_Filter_User"],
        //RENEWAL REPORT
        Tab_Type: fields["Tab_Type"],
        RenewalStatus: fields["RenewalStatus"],
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
        From_Netpremium: fields["From_Netpremium"],
        To_Netpremium: fields["To_Netpremium"],
        Mobile: fields["MobilePOSP"],
        DateToToDate: DateToToDate,
        DateToFromDate: DateToFromDate,
        DateFromToDate: DateFromToDate,
        DateFromFromDate: DateFromFromDate,
      };
      this.postCreated.emit(post);
    }
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
      this.PolicyType();
    } else if (Type == "PlanType") {
      this.PlanType();
    } else if (Type == "SubProduct") {
      this.SubProduct();
    } else if (Type == "Class") {
      this.Classes();
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "Vertical") {
      this.SearchForm.get("Region_Id").setValue("");
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");
      if (this.SearchForm.get("Vertical_Id").value.length > 0) {
        this.searchRegion();
      } else {
        this.CommanFieldsFilterData(this.urlSegmentId);
        this.searchEmployee("", 0);
      }
      if (this.PageType == "Reports") {
        this.agentData = [];
      }
      this.subRegionData = [];
    }
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
    //Sub Region
    // if (Type == "Sub Region") {
    //   this.SearchForm.get("Emp_Id").setValue("");
    //   this.SearchForm.get("Report_Type").setValue("");
    //   this.SearchForm.get("Agent_Id").setValue("");
    //   if (this.SearchForm.get("Sub_Region_Id").value.length > 0) {
    //     this.searchEmployee("", 0);
    //   } else {
    //     this.searchSubRegion();
    //   }
    //   if (this.PageType == "Reports") {
    //     this.agentData = [];
    //   }
    // }
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
      this.PolicyType();
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
      this.PolicyType();
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
      this.PolicyType();
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
    this.api
      .HttpPostType("../../Fillter/Fillter/GetBusniessFilter", formData)
      .then(
        (result) => {
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
    this.api
      .HttpPostType("../../Fillter/Fillter/GetProductsCrm", formData)
      .then(
        (result) => {
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
    this.api
      .HttpPostType("../../Fillter/Fillter/GetPolicyTypeCrm", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Segment_Ar = result["Data"]["PolicyType"];
            this.PolicyType();
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

  PolicyType() {
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
    this.api
      .HttpPostType("../../Fillter/Fillter/GetPlanTypeCrm", formData)
      .then(
        (result) => {
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
    this.api
      .HttpPostType("../../Fillter/Fillter/GetSubProductsCrm", formData)
      .then(
        (result) => {
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
    this.api.HttpPostType("../../Fillter/Fillter/GetClassesCrm", formData).then(
      (result) => {
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
    this.api
      .HttpPostType("../../Fillter/Fillter/GetSubClassesCrm", formData)
      .then(
        (result) => {
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
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";
    var fields = this.SearchForm.value;

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("portal", "Bms");
    formData.append("pageType", this.PageType);
    formData.append("EmployeeType", this.EmployeeType);
    formData.append("Right", this.api.DataRightsGetNavigation());
    formData.append("urlSegmentId", this.urlSegmentId);

    this.api
      .HttpPostType("b-crm/Filter/searchZoneData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.zoneData = result["zoneArray"];
          this.employeeData = result["employeeArray"];
          this.regionData = result["Servicelocation"];
        }
      });
  }

  //===== SEARCH REGION DATA =====//
  searchRegion() {
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";
    var fields = this.SearchForm.value;

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("portal", "Bms");
    formData.append("pageType", this.PageType);
    formData.append("EmployeeType", this.EmployeeType);
    formData.append("Right", this.api.DataRightsGetNavigation());
    formData.append("urlSegmentId", this.urlSegmentId);

    this.api
      .HttpPostType("b-crm/Filter/searchRegionData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.regionData = result["regionArray"];
          this.employeeData = result["employeeArray"];
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

    var fields = this.SearchForm.value;

    // console.log(fields);

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("searchTerm", searchTerm);
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("region", JSON.stringify(fields["Region_Id"]));
    formData.append("subRegion", JSON.stringify(fields["Sub_Region_Id"]));
    formData.append("employeeStatus", JSON.stringify(fields["EmployeeStatus"]));
    formData.append("portal", "Bms");
    formData.append("pageType", this.PageType);
    formData.append("Right", this.api.DataRightsGetNavigation());
    formData.append("urlSegmentId", this.urlSegmentId);

    this.api
      .HttpPostType("V2/Filter/commonSearchEmployee", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.employeeData = result["data"];
          if (this.PageType == "Reports") {
            this.agentData = [];
          }
        }
      });
  }

  //=====SEARCH AGENTS DATA=====//
  searchAgents(searchText: any, type: any) {
    var searchTerm = "";
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";
    if (
      this.rightType == "All" ||
      this.rightType == "Hierarchy" ||
      this.PageType == "Reports" ||
      this.PageType == "ManageRequests"
    ) {
      if (this.SearchForm.get("Emp_Id").value.length > 1) {
        this.reportTypeDisable = true;
        //  this.reportTypeVal = [];
        // this.SearchForm.get("Report_Type").setValue('');
      } else {
        this.reportTypeDisable = false;
        if (
          (this.rightType == "All" || this.PageType == "ManageRequests") &&
          this.SearchForm.get("Emp_Id").value.length == 0
        ) {
          //this.reportTypeVal = [];
          // alert(this.SearchForm.get('Emp_Id').value.length);
          // this.SearchForm.get("Report_Type").setValue([{Id:'Team',Name:'Team'}]);
        }
        //this.reportTypeVal
      }
    }

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
    formData.append("employee", JSON.stringify(fields["Emp_Id"]));
    formData.append("reportType", JSON.stringify(fields["Report_Type"]));
    formData.append("agentType", JSON.stringify(fields["Agent_Type"]));
    formData.append("portal", "Bms");
    formData.append("pageType", this.PageType);
    formData.append("Right", this.api.DataRightsGetNavigation());
    formData.append("urlSegmentId", this.urlSegmentId);

    this.api
      .HttpPostType("V2/Filter/commonSearchAgents", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.agentData = result["data"];
        } else {
          // this.api.Toast('Warning',result['msg']);
        }
      });
  }

  //===== GET URL ROUTE ID ====//
  getUrlRouteId() {
    this.api.IsLoading();
    this.api
      .HttpGetType("b-crm/Universal/getUrlRouteId?segment=" + this.currentUrl)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.urlSegmentId = result["data"];
            this.getLoginUserRights(this.urlSegmentId);
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

  //===== GET LOGIN USER'S RIGHTS ======//
  getLoginUserRights(urlSegmentId: number) {
    //If Admin Login
    if (this.api.GetUserType() == "admin") {
      this.api.GetUserType();
      this.searchEmployee("", 0);
      //If Others Login
    } else {
      this.mainOption = urlSegmentId;
      this.subOption = "Is_View";
      const formData = new FormData();
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("mainOption", this.mainOption);
      formData.append("subOption", this.subOption);
      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Universal/getLoginUserRights", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.rightType = result["data"];
              if (
                (this.rightType == "All" ||
                  this.PageType == "ManageRequests") &&
                this.urlSegment != "custom-active-inactive-pos"
              ) {
                this.BusniessGraphData = [
                  { Id: "LOB_Id", Name: "LOB" },
                  { Id: "Department_Id", Name: "Department" },
                  { Id: "Source", Name: "Source" },
                  { Id: "Insurer", Name: "Insurer" },
                  { Id: "Rm Wise", Name: "Rm Wise" },
                ];
                this.BusmiessGraphVal = [{ Id: "LOB_Id", Name: "LOB" }];
                this.reportTypeVal = [];
              } else if (
                (this.rightType == "All" ||
                  this.PageType == "ManageRequests") &&
                this.urlSegment == "custom-active-inactive-pos"
              ) {
                this.reportTypeVal = [{ Id: "Team", Name: "Team" }];
                this.BusniessGraphData = [
                  // { Id: "LOB_Id", Name: "LOB" },
                  { Id: "Department_Id", Name: "Department" },
                  // { Id: "Source", Name: "Source" },
                  // { Id: "Insurer", Name: "Insurer" },
                  // { Id: "Rm Wise", Name: "Rm Wise" },
                ];
                this.BusmiessGraphVal = [
                  { Id: "Department_Id", Name: "Department" },
                ];
              } else {
                this.reportTypeVal = [{ Id: "Team", Name: "Team" }];
                this.BusniessGraphData = [
                  { Id: "LOB_Id", Name: "LOB" },
                  // { Id: "Department_Id", Name: "Department" },
                  { Id: "Source", Name: "Source" },
                  { Id: "Insurer", Name: "Insurer" },
                  // { Id: "Rm Wise", Name: "Rm Wise" },
                ];
                this.BusmiessGraphVal = [{ Id: "LOB_Id", Name: "LOB" }];
              }
              //If Login Type Is Employee
              if (
                this.rightType == "All" ||
                this.PageType == "Reports" ||
                this.PageType == "ManageRequests"
              ) {
                this.searchEmployee("", 0);
                if (
                  this.rightType == "All" ||
                  this.PageType == "ManageRequests"
                ) {
                  this.searchAgents("", 0);
                }
              } else if (this.loginType == "employee") {
                this.searchAgents("", 0);
              }
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
  }

  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  SentMailDataRange() {
    var fields = this.SearchForm.value;
    var DateOrDateRange = fields["DateOrDateRange"];
    this.RangeButton = false;
    if (DateOrDateRange == "") {
      this.RangeButton = true;
      this.RangeButton2 = false;
      $("#RenewalButonRequired").show();
      return false;
    } else {
      this.RangeButton2 = false;
      this.RangeButton = false;
      $("#RenewalButonRequired").hide();
    }
    var DateOrDateRange = fields["DateOrDateRange"];
    var ToDate, FromDate;
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }
    var date1 = new Date(ToDate);
    var date2 = new Date(FromDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    // console.log(Difference_In_Days);
    if (Difference_In_Days > 31) {
      this.RangeButton2 = true;
      this.RangeButton = false;
      $("#RenewalButonDateShow").show();
      $("#Send_Renewal_mail").show();
      return false;
    } else {
      this.RangeButton2 = false;
      this.RangeButton = false;
      $("#RenewalButonDateShow").hide();
      $("#Send_Renewal_mail").hide();
    }
    const dialogRef = this.dialog.open(EmployeerenewalpopupComponent, {
      width: "70%",
      height: "50%",
      disableClose: true,
      data: { DateOrDateRange: DateOrDateRange, Types: this.urlSegmentSub },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  UploadRenewalNoticeBulkZip() {
    const dialogRef = this.dialog.open(BulkrenewalnoticeComponent, {
      width: "50%",
      height: "50%",
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  OnchangeLoginScope() {
    var fields = this.SearchForm.value;
    // alert(fields["LoginScope_Id"]);
    if (fields["LoginScope_Id"] == "") {
      // alert('shorya');
      this.SearchForm.get("LoginScope_Id").setValue([
        { Id: "Others", Name: "Others" },
      ]);
    }
    var LoginScope_Id = fields["LoginScope_Id"][0]["Id"];
    if (LoginScope_Id == "Others") {
      this.ButtonDisableTrue = false;
    } else {
      this.ButtonDisableTrue = true;
    }
  }

  SelectMobilePosp() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/Universal/SelectMobilePosp?segment=" + this.currentUrl
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Mobile_Ar = result["data"];
          } else {
            // this.api.Toast("Warning", result["msg"]);
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
} //END
