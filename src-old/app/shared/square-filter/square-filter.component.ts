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
import { trim } from "jquery";

export interface Post {
  Vertical_Id: any[];
  Region_Id: any[];
  Sub_Region_Id: any[];
  Emp_Id: any[];
  Report_Type: any[];
  Agent_Id: any[];

  Lob: any[];
  Company: any[];
  PolicyType: any[];
  ProductType: any[];
  FinancialYear: any[];
  PolicyFileType: any[];
  Source: any[];

  Product_Type: any[];
  BusniessType: any[];
  QuotesStatus: any[];
  QuoteType: any[];

  PosBusniessstatus: any[];
  GemsStatus: any[];

  To_Date: any[];
  From_Date: any[];
  SearchValue: any;
}

@Component({
  selector: "app-square-filter",
  templateUrl: "./square-filter.component.html",
  styleUrls: ["./square-filter.component.css"],
})
export class SquareFilterComponent implements OnInit {
  post: Post;
  @Output() postCreated = new EventEmitter<Post>();

  SearchForm: FormGroup;

  isSubmitted: boolean = false;
  showStatusDiv: string = "show";
  reportTypeDisable: boolean = false;
  currentUrl: any;
  urlSegment: string;
  urlSegmentRoot: any;
  urlSegmentId: any;
  mainOption: any;
  subOption: any;
  rightType: any = "Self";
  loginType: string;
  PageType: string;
  maxDate = new Date();
  minDate = new Date();

  ActionType: string;
  financialYearVal: { Id: string; Name: string }[];
  employeeStatusValue: { Id: number; Name: string }[];
  QuoteTypes: { Id: string; Name: string }[];

  verticalData: any[];
  zoneData: any[];
  regionData: any[];
  subRegionData: any[];
  employeeStatusData: any = [];
  employeeData: any[];
  reportTypeData: any[];
  agentTypeData: any[];
  agentData: any[];
  SR_Session_Year: any[];
  ItemLOBSelection: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  GlobelLOB: any[];
  Ins_Compaines: any[];
  SRSource_Ar: any[];
  Company_Ar: any[];
  PolicyType_Ar: any[];
  LossType_Ar: any[];
  surveyTypeData: any[];
  productData: any;
  TicketStatus_Ar: any[];
  TicketType_Ar: any = [];
  statusData: any[];
  assignedEmployeeData: any[];
  SearchButtonDisabled: boolean = false;

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
  QuoteTypeVal: { Id: string; Name: string }[];
  urlSegmentSub: any;
  SelectStatus: { Id: string; Name: string }[];
  GemsStatusData: { Id: string; Name: string }[];
  SelectStatusValue: { Id: string; Name: string }[];
  agentTypeVal: { Id: string; Name: string }[];
  reportTypeVal: { Id: string; Name: string }[];
  EmployeeType: any = "";
  AddRequestButton: number;
  AddRequestButtonRouterLink: string;
  GemsQuaterData: { Id: string; Name: string }[];
  QuotationDATA: any;
  StateData: any;
  CityData: any;
  TransferStatusData: { Id: string; Name: string }[];
  leadStatusData: { Id: string; Name: string }[];
  leadQuoteStatus: { Id: string; Name: string }[];
  leadLobData: any;
  leadSourceData: any;
  quotationStatus: boolean = false;
  removestatus: string;
  nocStatusdata: { Id: string; Name: string }[];
  ShowNocStatus: boolean = false;
  partnerDataCode: { Id: string; Name: string }[];
  partnertypeData: { Id: string; Name: string }[];
  ProductTypeData: { Id: number; Name: string }[];
  LoginDepartmentId: any;
  LSPData: any;
  loginId: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.LoginDepartmentId = this.api.GetUserData("department");
    this.loginId = this.api.GetUserData("Id");

    this.SearchForm = this.fb.group({
      Vertical_Id: [""],
      Zone_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      EmployeeStatus: [""],
      Emp_Id: [""],
      Report_Type: [""],
      Agent_Type: [""],
      Agent_Id: [""],

      Lead_Lob: [""],
      Transafer_Status: [""],
      lead_status: [""],
      Quote_Status: [""],
      Lead_Source: [""],

      PolicyType: [""],

      Lob: [""],
      Company: [""],
      FinancialYearr: ["", [Validators.required]],
      PolicyFileType: [""],
      Source: [""],
      ProductType: [""],

      Type: [""],
      QuoteType: [""],
      BusniessType: [""],
      Product_Type: [""],
      QuotesStatus: [""],

      Ticket_Status: [""],
      Ticket_Type: [""],
      RequestType: [""],

      product: [""],
      surveyType: [""],

      Company_Id: [""],
      LossType: [""],

      PosBusniessstatus: [""],
      GemsStatus: [""],

      AssignedEmployee: [""],
      status: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
      GemsQuater: [""],
      Quotations: [""],
      partnerProduct: [""],
      State: [""],
      City: [""],
      pincode: [""],
      nocStatus: [""],
      PartnerCode: [""],
      Partnertype: [""],
      lsp: [""],
    });

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

    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    var currentDate = new Date();
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

    this.ProductTypeData = [
      { Id: 0, Name: "General POSP" },
      { Id: 1, Name: "Life POSP" },
    ];
  }

  ngOnInit() {
    this.getSource();

    this.SelectStatusValue = [{ Id: "1", Name: "Active" }];

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

    this.post = {} as Post;

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

    if (this.urlSegment == "manager-view-visiting") {
      this.PageType = "ManageRequests";
      this.showStatusDiv = "hide";

      this.statusData = [
        { Id: 1, Name: "Pending For RM" },
        // { Id: 2, Name: "Certified POS" },
        { Id: 3, Name: "Pending For Manager" },
        { Id: 4, Name: "Pending For Requester" },
        { Id: 5, Name: "Request Completed" },
      ];
    }

    if (
      this.urlSegment == "manager_request" ||
      this.urlSegment == "view_docs_manager"
    ) {
      this.PageType = "ManageRequests";
    }

    if (
      this.urlSegmentRoot == "assest-manegment" &&
      this.urlSegment == "inventory-maneger"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "assest-manegment" &&
      this.urlSegment == "inventory-account"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "Wallet" &&
      this.urlSegment == "Maneger-wallet"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }
    if (
      this.urlSegmentRoot == "Wallet" &&
      this.urlSegment == "Gems-Banking-wallet"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "assest-manegment" &&
      this.urlSegment == "assest-maneger"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "assest-manegment" &&
      this.urlSegment == "assest-hod"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "assest-manegment" &&
      this.urlSegment == "assest-distributor"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "offline-quote" &&
      this.urlSegment == "view-punching-team"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }
    if (
      this.urlSegmentRoot == "offline-quote" &&
      this.urlSegment == "view-Account-team"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "profile" &&
      this.urlSegment == "profile-manager"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
      this.removestatus = "RemoveStatus";
    }

    if (
      this.urlSegmentRoot == "profile" &&
      this.urlSegment == "profile-banking"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
      this.removestatus = "RemoveStatus";
    }
    if (
      this.urlSegmentRoot == "profile" &&
      this.urlSegment == "profile-account"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
      this.removestatus = "RemoveStatus";
    }

    if (this.urlSegmentRoot == "noc") {
      this.ShowNocStatus = true;

      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
      this.removestatus = "RemoveStatus";
    }

    // Health Offline
    if (
      this.urlSegmentRoot == "offline-quote" &&
      this.urlSegment == "view-health-punching-team"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }
    if (
      this.urlSegmentRoot == "offline-quote" &&
      this.urlSegment == "view-health-Account-team"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "offline-quote" &&
      this.urlSegment == "view-health-manage-requests"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    // rfq
    if (
      this.urlSegmentRoot == "rfq" &&
      this.urlSegment == "view-punching-team"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }
    if (
      this.urlSegmentRoot == "rfq" &&
      this.urlSegment == "view-Account-team"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      this.urlSegmentRoot == "rfq" &&
      this.urlSegment == "offline-manage-requests"
    ) {
      this.urlSegmentRoot = "manage-requests";
      this.urlSegment = "offline-quote";
    }

    if (
      (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "pos") ||
      this.urlSegmentSub == "Verified-Posp"
    ) {
      this.UserAgent_Filter();
      this.GetLspData();
    }

    this.getUrlRouteId();
    this.searchEveryTime();
    this.commonfilterFieldsData();

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.QuoteTypeVal = [{ Id: "Raise Request", Name: "Raise Request" }];

    this.loginType = this.api.GetUserType();

    if (this.urlSegmentSub == "inspections") {
      this.inspectionFilterDataArray();
      this.businessFilterDataArray();
    }

    //QUOTATIONS
    if (this.urlSegmentSub == "quotations") {
      this.showStatusDiv = "hide";
      this.quotationFilterDataArray();
    }

    if (
      this.urlSegmentRoot == "lead-management" &&
      this.urlSegment == "manage-requests"
    ) {
      this.PageType = "ManageRequests";
      this.showStatusDiv = "hide";
    }

    //ENDOSMENT , CANCELLATION
    if (
      (this.urlSegmentRoot == "cancellation" &&
        this.urlSegment == "view-requests") ||
      (this.urlSegmentRoot == "endosment" &&
        this.urlSegment == "view-requests") ||
      (this.urlSegmentRoot == "mis-reports" &&
        this.urlSegment == "cancellation") ||
      (this.urlSegmentRoot == "mis-report" &&
        this.urlSegment == "endorsement") ||
      (this.urlSegmentRoot == "mis-report" &&
        this.urlSegment == "endorsement-pan-india") ||
      ((this.urlSegmentRoot == "endosment" ||
        this.urlSegmentRoot == "cancellation") &&
        this.urlSegment == "manage-requests")
    ) {
      this.businessFilterDataArray();

      this.statusData = [
        { Id: 0, Name: "Pending" },
        { Id: 1, Name: "In Process" },
        { Id: 2, Name: "Complete" },
        { Id: 3, Name: "Rejected" },
      ];

      if (
        (this.urlSegmentRoot == "endosment" ||
          this.urlSegmentRoot == "cancellation") &&
        this.urlSegment == "manage-requests"
      ) {
        this.PageType = "ManageRequests";
        this.showStatusDiv = "hide";
      }
      if (
        this.urlSegmentRoot == "assest-maneger" ||
        this.urlSegmentRoot == "assest-distributor"
      ) {
        this.PageType = "ManageRequests";
        this.showStatusDiv = "hide";
      }

      if (
        (this.urlSegmentRoot == "mis-report" &&
          this.urlSegment == "endorsement") ||
        (this.urlSegmentRoot == "mis-reports" &&
          this.urlSegment == "cancellation")
      ) {
        this.PageType = "Reports";
      }
    }

    //OFFLINE QUOTE
    if (
      (this.urlSegmentRoot == "offline-quote" &&
        this.urlSegment == "view-requests") ||
      (this.urlSegmentRoot == "mis-reports" &&
        this.urlSegment == "offline-quote") ||
      (this.urlSegmentRoot == "manage-requests" &&
        this.urlSegment == "offline-quote") ||
      (this.urlSegmentRoot == "mis-reports" &&
        this.urlSegment == "offline-quote-pan-india") ||
      (this.urlSegmentRoot == "rfq" && this.urlSegment == "view-requests") ||
      (this.urlSegmentRoot == "manage-requests" &&
        this.urlSegment == "view-health-manage-requests")
    ) {
      this.offlineQuoteFilterDataArray();
      this.businessFilterDataArray();

      if (
        this.urlSegmentRoot == "manage-requests" &&
        this.urlSegment == "offline-quote"
      ) {
        this.PageType = "ManageRequests";
        this.showStatusDiv = "hide";
      }

      if (
        this.urlSegmentRoot == "mis-reports" &&
        (this.urlSegment == "offline-quote" ||
          this.urlSegment == "offline-quote-pan-india")
      ) {
        this.PageType = "Reports";
      }
    }

    if (
      this.urlSegmentRoot == "payment-track" ||
      this.urlSegmentRoot == "landing" ||
      this.urlSegmentRoot == "Leads" ||
      this.urlSegmentRoot == "exams" ||
      this.urlSegmentRoot == "employee-directory" ||
      this.urlSegmentRoot == "partner-directory" ||
      this.urlSegmentRoot == "pos-directory" ||
      this.urlSegmentRoot == "WebsiteSection" ||
      this.urlSegmentRoot == "contact" ||
      this.urlSegmentRoot == "Posp-managment" ||
      this.urlSegmentSub == "quotations"
    ) {
      this.SearchForm.get("FinancialYearr").setValidators(null);
      this.SearchForm.get("FinancialYearr").updateValueAndValidity();

      if (this.urlSegmentSub == "quotations") {
        this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
        var Values1 = this.financialYearVal[0].Id.split("-");
        var Year1 = parseInt(Values1[0]);
        var Year2 = Year1 + 1;
        const current = new Date();

        const prior = new Date().setDate(current.getDate() - 30);
        this.maxDate = new Date();
        this.minDate = new Date(prior);
      }
    }

    //SURVEY
    if (
      (this.urlSegmentRoot == "survey" && this.urlSegment == "view-requests") ||
      (this.urlSegmentRoot == "mis-reports" &&
        this.urlSegment == "inspection") ||
      (this.urlSegmentRoot == "mis-reports" &&
        this.urlSegment == "inspection-pan-india") ||
      (this.urlSegmentRoot == "survey" && this.urlSegment == "manage-requests")
    ) {
      this.surveyFilterDataArray();

      if (
        this.urlSegmentRoot == "survey" &&
        this.urlSegment == "manage-requests"
      ) {
        this.PageType = "ManageRequests";
        this.showStatusDiv = "hide";
      }

      if (
        (this.urlSegmentRoot == "mis-reports" &&
          this.urlSegment == "inspection") ||
        (this.urlSegmentRoot == "mis-reports" &&
          this.urlSegment == "inspection-pan-india")
      ) {
        this.PageType = "Reports";
      }
    }

    //CLAIM ASSISTANCE
    if (
      (this.urlSegmentRoot == "claim-assistance" &&
        this.urlSegment == "all-requests") ||
      (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "claim") ||
      (this.urlSegmentRoot == "manage-requests" &&
        this.urlSegment == "claims") ||
      (this.urlSegmentRoot == "claim" && this.urlSegment == "manage-requests")
    ) {
      this.claimAssistanceDataArray();

      if (
        (this.urlSegmentRoot == "manage-requests" &&
          this.urlSegment == "claims") ||
        (this.urlSegmentRoot == "claim" && this.urlSegment == "manage-requests")
      ) {
        this.PageType = "ManageRequests";
        this.showStatusDiv = "hide";
      }

      if (
        this.urlSegmentRoot == "mis-reports" &&
        this.urlSegment == "claim" &&
        this.urlSegmentRoot == "Tele-Rm"
      ) {
        this.PageType = "Reports";
      }
    }

    //TICKETS MNAGER SECTION
    if (
      (this.urlSegmentRoot == "ticket" &&
        (this.urlSegment == "all-tickets-user" ||
          this.urlSegment == "all-tickets-assign")) ||
      (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "ticket")
    ) {
      this.ticketDataArray();

      if (
        this.urlSegmentRoot == "ticket" &&
        this.urlSegment == "all-tickets-assign"
      ) {
        this.PageType = "ManageRequests";
        this.showStatusDiv = "hide";
      }

      if (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "ticket") {
        this.PageType = "Reports";
      }
    }

    //POS REPORTS
    if (this.urlSegment == "Posp-reports") {
      this.posFilterDataArray();
    }

    //POS MIS REPORTS
    if (
      this.urlSegment == "pos" ||
      this.urlSegment == "View-Tele-Rm" ||
      this.urlSegment == "View-Tele-Rm-Reports"
    ) {
      this.posFilterDataArray();
      this.PageType = "Reports";
    }

    //ACTIVE INACTIVE POS MIS REPORTS
    if (this.urlSegment == "active-inactive-pos") {
      this.posFilterDataArray();
      this.PageType = "Reports";
      this.showStatusDiv = "hide";
    }

    //ACTIVE INACTIVE POS SELF REPORTS
    if (this.urlSegment == "pos-active-inactive") {
      this.posFilterDataArray();
      this.PageType = "";
      this.showStatusDiv = "hide";
    }

    if (
      this.PageType != "ManageRequests" &&
      this.urlSegmentSub != "quotations" &&
      this.urlSegmentSub != "inspections" &&
      this.urlSegment != "pos" &&
      this.urlSegment != "View-Tele-Rm" &&
      this.urlSegment != "pos-active-inactive" &&
      this.urlSegment != "active-inactive-pos"
    ) {
      this.searchAssignedEmployee(this.currentUrl);
    }

    this.AddRequestButton = 0;
    //PUSPENDER-WORK-LIVE-DALNA-H
    if (
      this.urlSegmentRoot == "claim-assistance" &&
      this.urlSegment == "all-requests"
    ) {
      this.AddRequestButton = 1;
      this.AddRequestButtonRouterLink = "/claim-assistance/policy-list";
    } else if (
      this.urlSegmentRoot == "offline-quote" &&
      this.urlSegment == "view-requests"
    ) {
      this.AddRequestButton = 1;
      this.AddRequestButtonRouterLink = "/offline-quote/create-requests";
    } else if (
      this.urlSegmentRoot == "endosment" &&
      this.urlSegment == "view-requests"
    ) {
      this.AddRequestButton = 1;
      this.AddRequestButtonRouterLink = "/endosment/create-requests";
    } else if (
      this.urlSegmentRoot == "survey" &&
      this.urlSegment == "view-requests"
    ) {
      this.AddRequestButton = 1;
      this.AddRequestButtonRouterLink = "/survey/create-requests";
    } else if (
      this.urlSegmentRoot == "cancellation" &&
      this.urlSegment == "view-requests"
    ) {
      this.AddRequestButton = 1;
      this.AddRequestButtonRouterLink = "/cancellation/create-requests";
    } else if (
      this.urlSegmentRoot == "ticket" &&
      this.urlSegment == "all-tickets-user"
    ) {
      this.AddRequestButton = 1;
      this.AddRequestButtonRouterLink = "/ticket/raise-ticket";
    }

    if (this.urlSegmentRoot == "payment-track") {
      this.statusData = [
        { Id: "All", Name: "All" },
        { Id: 1, Name: "Not Return" },
      ];

      this.GetPaymentTrackQuotations("", 0);
    }

    this.nocStatusdata = [
      { Id: "2", Name: "Pending For HOD" },
      { Id: "3", Name: "Pending For Accounts" },
      { Id: "4", Name: "Pending For Principal" },
      { Id: "5", Name: "Pending For Pos team" },
      { Id: "6", Name: "NOC Released" },
      { Id: "0", Name: "Rejected" },
    ];

    this.partnerDataCode = [
      { Id: "emitra", Name: "emitra" },
      { Id: "other", Name: "other" },
    ];

    this.partnertypeData = [
      { Id: "2", Name: "BA" },
      { Id: "1", Name: "BP" },
    ];
  }

  GetLspData() {
    this.api.HttpGetType("/PospManegment/GetLspData").then(
      (result: any) => {
        if (result["status"] == true) {
          this.LSPData = result["Data"];
        }
      },
      (err) => {
        // this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  getSource() {
    const formData = new FormData();

    this.api.IsLoading();
    this.api.HttpPostType("LeadManagment/GetSource", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          // // console.log(result['data']);
          this.leadSourceData = result["data"];
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

  //===== CLAIM-ASSISTANCE FILTER DATA ARRAY =====//
  GetPaymentTrackQuotations(searchTerm: any, type: any) {
    // this.api.HttpPostType("Globel/GetProductBms", formData).then(
    const formData = new FormData();
    // var searchTerm = "";
    if (type == 1) {
      searchTerm = searchTerm.target.value;
    }

    // formData.append("Searchvalue", );
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("searchTerm", searchTerm);

    //  this.api.IsLoading();
    this.api
      .HttpPostType("PaymentTrack/QuotationLog", formData)

      // this.api
      //   .HttpGetType(
      //     "PaymentTrack/QuotationLog?Page=Claim&User_Id=" +
      //     this.api.GetUserData("Id") +
      //     "&User_Type=" +
      //     this.api.GetUserType()
      //   )
      .then((result: any) => {
        // this.api.HideLoading();
        if (result["Status"] == true) {
          this.QuotationDATA = result["data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      });
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  handleDropdownChange(event: any[]) {
    this.quotationStatus = false;
    for (const selectedItem of event) {
      if (selectedItem.Id === "Motor Quotation") {
        this.quotationStatus = true;
        break; // Exit the loop once the condition is satisfied
      }
    }
  }

  //===== SEARCH EVERY TIME DATA ARRAY =====//
  searchEveryTime() {
    this.employeeStatusValue = [{ Id: 3, Name: "All" }];
    this.SelectStatusValue = [{ Id: "1", Name: "Active" }];
    this.employeeStatusData = [
      { Id: 3, Name: "All" },
      { Id: 1, Name: "Active" },
      { Id: "0", Name: "Inactive" },
      { Id: "2", Name: "Resigned" },
    ];
    this.reportTypeData = [
      { Id: "Team", Name: "Team" },
      { Id: "Self", Name: "Self" },
    ];

    this.agentTypeData = [
      { Id: "All", Name: "All" },
      { Id: "POS", Name: "POS" },
      { Id: "SP", Name: "SP" },
    ];
    this.agentTypeVal = [{ Id: "All", Name: "All" }];

    if (this.urlSegment == "pos" || this.urlSegment == "View-Tele-Rm") {
      this.SearchForm.get("FinancialYearr").setValidators(null);
      this.SearchForm.get("FinancialYearr").updateValueAndValidity();
    }

    this.TransferStatusData = [
      { Id: "0", Name: "Direct" },
      { Id: "1", Name: "Tranferred" },
    ];
    this.leadStatusData = [
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "Follow Up" },
      { Id: "3", Name: "Converted" },
      { Id: "4", Name: "Lost" },
      { Id: "5", Name: "Transfer" },
    ];
    this.leadQuoteStatus = [
      { Id: "1", Name: "Quotation" },
      { Id: "2", Name: "Proposal" },
      { Id: "3", Name: "Payment Page" },
      { Id: "4", Name: "Converted" },
    ];
  }

  soucreDropdownChange(data: any[]) {
    // // console.log(data);
    let source = "";
    for (const item of data) {
      source = item.Name;
    }

    const formData = new FormData();
    formData.append("Source", source);

    this.api.IsLoading();
    this.api.HttpPostType("LeadManagment/GetFiltterLob", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          // // console.log(result['data']);
          this.leadLobData = result["data"];
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

  //=====POS REPORT DATA ARRAY =====//
  posFilterDataArray() {
    this.SelectStatus = [
      { Id: "1", Name: "Active" },
      { Id: "2", Name: "Inactive" },
    ];

    this.GemsQuaterData = [
      { Id: "frist", Name: "Apr-Jun" },
      { Id: "second", Name: "Jul-Sep" },
      { Id: "third", Name: "Oct-Dec" },
      { Id: "fourth", Name: "Jan-Mar" },
    ];

    this.GemsStatusData = [
      { Id: "3", Name: "Prime" },
      { Id: "silver", Name: "Silver" },
      { Id: "gold", Name: "Gold" },
      { Id: "diamond", Name: "Diamond" },
      { Id: "platinum", Name: "Platinum" },
      { Id: "titanium", Name: "Titanium" },
    ];

    this.statusData = [
      { Id: "0", Name: "Pending" },
      { Id: "1", Name: "Verified" },
      { Id: "2", Name: "Certified POS" },
      { Id: "3", Name: "Incomplete" },
      { Id: "4", Name: "Under Taining" },
      { Id: "6", Name: "Rejected" },
      { Id: "7", Name: "NOC Released" },
    ];
  }

  //===== SEARCH EVERY TIME DATA ARRAY =====//
  ticketDataArray() {
    this.statusData = [
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "In Process" },
      { Id: "3", Name: "Complete" },
    ];
    this.TicketType_Ar = [
      { Id: "1", Name: "Payment done policy not received" },
      { Id: "2", Name: "Make model update" },
      { Id: "3", Name: "Hypothecation Update" },
      { Id: "4", Name: "Quote not reflecting" },
      { Id: "5", Name: "Error during policy issuance" },
      { Id: "6", Name: "Other" },
      { Id: "7", Name: "Claim" },
      { Id: "8", Name: "Survey" },
      { Id: "9", Name: "Offline-Quote" },
      { Id: "10", Name: "Cancellation" },
      { Id: "11", Name: "Endorsement" },
      { Id: "12", Name: "POS-Related-Query" },
      { Id: "13", Name: "Payout/Commision Related-Query" },
    ];
  }

  //===== DATATABLE FILTER DATA ARRAY =====//
  commonfilterFieldsData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/Filter/commonfilterFieldsData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&portal=Square&empType=" +
          this.EmployeeType +
          "&EmpId=" +
          this.api.GetUserData("Code") +
          "&Url=" +
          this.currentUrl
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            // console.log(result);
            this.verticalData = result["Data"]["verticalData"];
            this.zoneData = result["Data"]["zoneData"];
            this.regionData = result["Data"]["regionData"];
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];
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

  //===== BUSINESS, CANCELLATION, ENDORSEMENT FILTER DATA ARRAY =====//
  businessFilterDataArray() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/PolicyFilterType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.GlobelLOB = result["Data"]["GlobelLOB"];
            this.Ins_Compaines = result["Data"]["Ins_Compaines"];
            this.SRSource_Ar = [
              { Id: "BMS", Name: "Offline" },
              { Id: "Web", Name: "Online" },
              { Id: "Excel", Name: "Excel" },
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

  //===== QUOTATIONS FILTER DATA ARRAY =====//
  quotationFilterDataArray() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/FilterDataWeb?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.GlobelLOB = result["Data"]["GlobelLOB"];
            this.Ins_Compaines = result["Data"]["Company"];
            this.PolicyFileType = result["Data"]["PolicyFileType"];
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

  //===== OFFLINE QUOTE FILTER DATA ARRAY =====//
  offlineQuoteFilterDataArray() {
    // alert();
    this.ProductType = [
      { Id: "1", Name: "Bike" },
      { Id: "2", Name: "Private Car" },
      { Id: "3", Name: "Pcv" },
      { Id: "4", Name: "Gcv" },
      { Id: "5", Name: "MISC-D" },
    ];
    this.PolicyType = [
      { Id: "1", Name: "Comprehensive" },
      { Id: "2", Name: "Third Party" },
      { Id: "3", Name: "Saod" },
    ];
    this.PolicyFileType = [
      { Id: "New", Name: "New" },
      { Id: "Rollover", Name: "Rollover" },
    ];
    this.statusData = [
      { Id: 1, Name: "Quote Requested" },
      { Id: 2, Name: "Quotes Released" },
      { Id: 3, Name: "Quotes Accepted" },
      {
        Id: 4,
        Name: "Payment URL Shared / Payment For Cheque / Payment For Cash",
      },
      { Id: 5, Name: "Pending For Approval" },
      { Id: 6, Name: "Complete" },
      { Id: 8, Name: "Pending For Accounts" },
      { Id: 0, Name: "Rejected" },
    ];
  }

  //=====INSPECTION(CASES) FILTER DATA ARRAY =====//
  inspectionFilterDataArray() {
    this.ProductType = [
      { Id: "1", Name: "Bike" },
      { Id: "2", Name: "Private Car" },
      { Id: "3", Name: "Pcv" },
      { Id: "4", Name: "Gcv" },
      { Id: "5", Name: "MISC-D" },
    ];
    this.PolicyType = [
      { Id: "1", Name: "Comprehensive" },
      { Id: "2", Name: "Third Party" },
      { Id: "3", Name: "Saod" },
    ];
    this.statusData = [
      { Id: "approved", Name: "Approved" },
      { Id: "pending", Name: "Pending" },
      { Id: "closed", Name: "Closed" },
      { Id: "underwriter", Name: "UnderWriter" },
      { Id: "Rejected", Name: "Rejected" },
    ];
  }

  //===== CLAIM-ASSISTANCE FILTER DATA ARRAY =====//
  claimAssistanceDataArray() {
    // alert();
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Claim/FilterData?Page=Claim&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then((result: any) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Company_Ar = result["Company_Ar"];
          this.PolicyType_Ar = result["PolicyType_Ar"];
          this.LossType_Ar = result["LossType_Ar"];
          this.statusData = result["ClaimStatus_Ar"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      });
  }

  //===== SURVEY FILTER DATA ARRAY =====//
  surveyFilterDataArray() {
    this.api.IsLoading();
    this.api.HttpGetType("b-crm/Universal/searchProducts").then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.productData = result["data"];
          this.surveyTypeData = [
            { Id: 1, Name: "Endorsement" },
            { Id: 2, Name: "Policy Issuance" },
          ];

          if (this.urlSegmentRoot == "survey") {
            this.statusData = [
              { Id: 0, Name: "Pending" },
              { Id: 1, Name: "In Process" },
              { Id: 2, Name: "Recommended" },
              { Id: 3, Name: "Rejected" },
              { Id: 4, Name: "Non-Recommended" },
              { Id: 5, Name: "Refer To Insurer" },
            ];
          } else {
            this.statusData = [
              { Id: 0, Name: "Pending" },
              { Id: 1, Name: "In Process" },
              { Id: 2, Name: "Recommended" },
              { Id: 3, Name: "Rejected" },
            ];
          }
        } else {
          //this.api.Toast('Warning',result['msg']);
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
    this.isSubmitted = true;
    // console.log(this.SearchForm);

    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      this.SearchButtonDisabled = true;

      // Enable the button after 3 seconds
      setTimeout(() => {
        this.SearchButtonDisabled = false;
      }, 3000);

      const post = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        Vertical_Id: fields["Vertical_Id"],
        Zone_Id: fields["Zone_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],
        EmployeeStatus: fields["EmployeeStatus"],
        Emp_Id: fields["Emp_Id"],
        Report_Type: fields["Report_Type"],
        Agent_Type: fields["Agent_Type"],
        Agent_Id: fields["Agent_Id"],
        RequestType: fields["RequestType"],
        FinancialYear: fields["FinancialYearr"],

        Lead_Lob: fields["Lead_Lob"],
        Transafer_Status: fields["Transafer_Status"],
        lead_status: fields["lead_status"],
        Quote_Status: fields["Quote_Status"],
        Lead_Source: fields["Lead_Source"],

        //Used In Many
        PolicyType: fields["PolicyType"],

        //BUSINESS REPORT
        Lob: fields["Lob"],
        Company: fields["Company"],
        ProductType: fields["ProductType"],
        PolicyFileType: fields["PolicyFileType"],
        Source: fields["Source"],

        //OFFLINE QUOTE
        Product_Type: fields["Product_Type"],
        BusniessType: fields["BusniessType"],
        QuotesStatus: fields["QuotesStatus"],

        //TICKET REQUEST
        Ticket_Type: fields["Ticket_Type"],
        Ticket_Status: fields["Ticket_Status"],

        // //SURVEY
        product: fields["product"],
        surveyType: fields["surveyType"],

        //CLAIM ASSISTANCE
        Company_Id: fields["Company_Id"],
        LossType: fields["LossType"],

        //MANAGE REQUESTS
        QuoteType: fields["QuoteType"],

        //VIEW REPORTS
        AssignedEmployee: fields["AssignedEmployee"],

        //POS REPORTS
        PosBusniessstatus: fields["PosBusniessstatus"],
        GemsStatus: fields["GemsStatus"],

        //COMMON EXTRA
        status: fields["status"],
        To_Date: ToDate,
        From_Date: FromDate,
        SearchValue: trim(fields["SearchValue"]),
        GemsQuater: fields["GemsQuater"],

        Quotations: fields["Quotations"],

        state: fields["State"],
        city: fields["City"],
        pincodeValue: fields["pincode"],
        nocStatus: fields["nocStatus"],
        PartnerCode: fields["PartnerCode"],
        partnerProduct: fields["partnerProduct"],
        lsp: fields["lsp"],
        Partnertype: fields["Partnertype"],
      };

      this.postCreated.emit(post);
    }
  }

  //===== ON OPTION SELECT =====//
  showStatusHtml() {
    var ReqType = this.SearchForm.get("QuoteType");
    var ReqTypes = ReqType.value[0].Id;
    if (ReqTypes == "Raise Request") {
      this.showStatusDiv = "hide";
    } else {
      this.showStatusDiv = "show";
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

      this.maxDate = new Date("03-31-" + Year2);

      this.SearchForm.get("DateOrDateRange").setValue("");
    }

    //Lob
    if (Type == "GlobelLOB") {
      this.ItemLOBSelection.push(item.Id);
      this.GetProducts("OneByOneSelect");
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "Vertical") {
      this.SearchForm.get("Region_Id").setValue("");
      this.SearchForm.get("Sub_Region_Id").setValue("");
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");

      if (this.SearchForm.get("Vertical_Id").value.length > 0) {
        this.searchRegion();
      } else {
        this.commonfilterFieldsData();
        this.searchEmployee("", 0);
      }

      if (this.PageType == "Reports") {
        this.agentData = [];
      }
      this.subRegionData = [];
    }

    //Region
    if (Type == "Region") {
      this.SearchForm.get("Sub_Region_Id").setValue("");
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");

      if (this.SearchForm.get("Region_Id").value.length > 0) {
        this.searchSubRegion();
      } else {
        this.searchRegion();
        this.subRegionData = [];
      }

      if (this.PageType == "Reports") {
        this.agentData = [];
      }
    }

    //Sub Region
    if (Type == "Sub Region") {
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");

      if (this.SearchForm.get("Sub_Region_Id").value.length > 0) {
        this.searchEmployee("", 0);
      } else {
        this.searchSubRegion();
      }

      if (this.PageType == "Reports") {
        this.agentData = [];
      }
    }

    //Employee Status
    if (Type == "EmployeeStatus") {
      this.SearchForm.get("Emp_Id").setValue("");
      this.SearchForm.get("Agent_Id").setValue("");
      this.SearchForm.get("Report_Type").setValue("");

      this.searchEmployee("", 0);
      this.employeeData = [];
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
      this.GetProducts("OneByOneDeSelect");
    }
  }

  //===== GET FILTER ARRAY DATA ON SELECT DESELECT =====//
  GetProducts(Type: any) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", this.ItemLOBSelection.join());

    this.api.IsLoading();
    this.api.HttpPostType("Globel/GetProductBms", formData).then(
      (result) => {
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
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";
    var fields = this.SearchForm.value;

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("portal", "Square");
    formData.append("pageType", this.PageType);
    formData.append("EmployeeType", this.EmployeeType);

    this.api
      .HttpPostType("b-crm/Filter/searchZoneData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.zoneData = result["zoneArray"];
          this.employeeData = result["employeeArray"];
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
    formData.append("zone", JSON.stringify(fields["Zone_Id"]));
    formData.append("vertical", JSON.stringify(fields["Vertical_Id"]));
    formData.append("portal", "Square");
    formData.append("pageType", this.PageType);
    formData.append("EmployeeType", this.EmployeeType);

    this.api
      .HttpPostType("b-crm/Filter/searchRegionData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.regionData = result["regionArray"];
          this.employeeData = result["employeeArray"];
        }
      });
  }

  //===== SEARCH REGION DATA =====//
  searchSubRegion() {
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
    formData.append("region", JSON.stringify(fields["Region_Id"]));
    formData.append("portal", "Square");
    formData.append("pageType", this.PageType);
    formData.append("EmployeeType", this.EmployeeType);

    this.api
      .HttpPostType("b-crm/Filter/searchSubRegionData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.subRegionData = result["subRegionData"];
          this.employeeData = result["employeeData"];
        }
      });
  }

  //=====SEARCH EMPLOYEE DATA=====//
  searchEmployee(searchText: any, type: any) {
    var searchTerm = "";
    this.mainOption = this.urlSegmentId;
    this.subOption = "Is_View";

    if (type == 1) {
      searchTerm = searchText.target.value;
    }

    var fields = this.SearchForm.value;

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
    formData.append("portal", "Square");
    formData.append("pageType", this.PageType);

    this.api
      .HttpPostType("b-crm/Filter/commonSearchEmployee", formData)
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
        this.reportTypeVal = [];
      } else {
        this.reportTypeDisable = false;
        if (this.rightType == "All" || this.PageType == "ManageRequests") {
          this.reportTypeVal = [];
        } else {
          this.reportTypeVal = [{ Id: "Team", Name: "Team" }];
        }
      }
    }

    if (type == 1) {
      searchTerm = searchText.target.value;
    }

    var fields = this.SearchForm.value;

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("searchTerm", searchTerm);
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    formData.append("employee", JSON.stringify(fields["Emp_Id"]));
    formData.append("reportType", JSON.stringify(fields["Report_Type"]));
    formData.append("agentType", JSON.stringify(fields["Agent_Type"]));
    formData.append("portal", "Square");
    formData.append("pageType", this.PageType);

    this.api
      .HttpPostType("b-crm/Filter/commonSearchAgents", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.agentData = result["data"];
        } else {
          // this.api.Toast('Warning',result['msg']);
        }
      });
  }

  //=====SEARCH ASSIGNED EMPLOYEE DATA =====//
  searchAssignedEmployee(currentUrl: any) {
    this.subOption = "Is_View";
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    formData.append("currentUrl", currentUrl);
    formData.append("PageType", this.PageType);
    // console.log(this.PageType);

    this.api
      .HttpPostType("b-crm/Filter/searchAssignedEmployee", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.assignedEmployeeData = result["data"];
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
            // this.api.Toast('Warning',result['msg']);
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
                this.rightType == "All" ||
                this.PageType == "ManageRequests"
              ) {
                this.reportTypeVal = [];
              } else {
                this.reportTypeVal = [{ Id: "Team", Name: "Team" }];
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

  onItemSelect1(item: any, Type: any) {
    //Lob
    if (Type == "GlobelLOB") {
      this.SearchForm.get("PolicyFileType").setValue("");
      this.SearchForm.get("ProductType").setValue("");
      this.SearchForm.get("PolicyType").setValue("");
      this.ItemLOBSelection.push(item.Id);
      this.GetProducts1(this.ItemLOBSelection);
    }

    if (Type == "PolicyFileType") {
      this.GetProductsByFileTypes(item.Id);
    }
    if (Type == "State") {
      this.ItemLOBSelection = item.Id;
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneSelect");
    }
  }

  onItemDeSelect1(item: any, Type) {
    //LOB
    if (Type == "GlobelLOB") {
      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      this.SearchForm.get("PolicyFileType").setValue("");
      this.SearchForm.get("ProductType").setValue("");
      this.SearchForm.get("PolicyType").setValue("");

      this.GetProducts1(this.ItemLOBSelection);
    }

    if (Type == "PolicyFileType") {
      // if (item.Id == "new_gadi") {
      //   Type = item.Id;
      //   Type = "Motor";
      //   this.GetProducts1(Type);
      // }
      this.GetProductsByFileTypes(item.Id);
    }

    if (Type == "State") {
      var index = (this.ItemLOBSelection = item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      // console.log(this.ItemLOBSelection);
      this.GetCItyFilter("OneByOneDeSelect");
    }
  }

  GetProducts1(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", Type);

    this.api.IsLoading();
    this.api.HttpPostType("Globel/GetProductWeb", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.PolicyFileType = result["Data"]["PolicyFileType"];
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

  GetProductsByFileTypes(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("file_types", Type);

    this.api.IsLoading();
    this.api.HttpPostType("Globel/GetProductByFileTypes", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
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

  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  UserAgent_Filter() {
    this.api.HttpGetType("MyPos/GetAllFilter").then(
      (result) => {
        //this.api.HideLoading();

        if (result["Status"] == true) {
          this.StateData = result["Data"]["State"];
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
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }

  GetCItyFilter(e) {
    var fields = this.ItemLOBSelection;

    const formData = new FormData();

    formData.append("StateId", this.ItemLOBSelection);
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("MyPos/CityFilter", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.CityData = result["Data"]["City"];
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

  addleads() {
    // const dialogRef = this.dialog.open(AddLeadsComponent, {
    //   width: "60%",
    //   height: "80%",
    //   disableClose: true,
    // });
    // dialogRef.afterClosed().subscribe((result:any) => {
    //   // // console.log(result);
    //   // this.SearchBtn();
    // });
  }
} //END
