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
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { trim } from "jquery";

export interface Post {
  User_Code: any;
  User_Type: any;
  Portal: any;
  tab_name: any;
  financial_year: any[];
  date_from: any[];
  date_to: any[];
  business_line: any[];
  vertical: any[];
  zone: any[];
  branch: any[];
  service_location: any[];
  regional_office: any[];
  employee_status: any[];
  emp_id: any[];
  report_type: any[];
  agent_type: any[];
  agent_id: any[];

  interaction_purpose: any[];
  interaction_type: any[];
  lob_type: any[];
  agent_status: any[];
  lead_status: any[];
  followup_time: any[];
  search_value: any;
}

@Component({
  selector: "app-common-filter",
  templateUrl: "./common-filter.component.html",
  styleUrls: ["./common-filter.component.css"],
})
export class CommonFilterComponent implements OnInit {
  post: Post;
  @Output() postCreated = new EventEmitter<Post>();
  ButtonDisableTrue: boolean = false;
  SearchForm: FormGroup;
  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  isSubmitted: boolean = false;
  currentUrl: any;
  urlSegment: string;
  urlSegmentRoot: any;
  urlSegmentId: any;
  mainOption: any;
  subOption: any;
  rightType: any = "Self";
  ActionType: string;
  urlSegmentSub: any;
  EmployeeType: any = "";

  Loginid: any;
  LoginType: any;

  menu_name: any = "";
  tab_name: any = "";

  maxDate = new Date();
  minDate = new Date();

  Session_Year_Ar: any = [];

  Disable_Report_Type: boolean = false;

  LoginProfileName: any = "";
  session_year_ar: any = [];
  sel_session_year_ar: any = [];
  business_line_ar: any = [];
  vertical_ar: any = [];
  zone_ar: any = [];
  branch_ar: any = [];
  service_location_ar: any = [];
  regional_office_ar: any = [];

  employee_status_ar: any = [];
  employee_ar: any = [];
  report_type_ar: any = [];
  agent_lob_ar: any = [];
  agent_type_ar: any = [];
  agent_ar: any = [];

  //== DSR ==//
  dsr_active_tab: any = "";
  FunctionName: any = "GetRMReportData";
  reportTypeDisable = false;

  AgentFieldDisable = false;
  ActivityFieldDisable = false;

  interaction_purpose_ar: any = [];
  club_lob_ar: any = [];
  club_status_ar: any = [];
  interaction_type_ar: any = [];
  lead_status_ar: any = [];
  followup_time_ar: any = [];

  ShowAdvanceFilters: any = "No";
  right_type: any = "Self";
  mapped_emp_string: any = "";
  utmSourceAr: any = "";
  //==== LMS RELATED SECTION START ====//

  leadQuoteStatus: any[];
  leadStatus: any[];
  leadLobData: any[];
  leadSourceData: any[];
  quotationStatus = false;
  dropdownSettingsmultiselectAllcheck: any = {};
  ShowLeadStatusValue: any;
  FollowUpDays: any[];
  partnerGroup: any[];
  employeeManager_arr: any = [];
  LMS_employee_arr: any = [];
  PartnerGroupDisable: boolean = false;
  empId: any;
  Emp_LMS_Id: any;
  PartnerGroupValue: any;
  SelectedPartnerGroup: any;
  agent_id_lms: any[];
  PartnerGroupAr: any;
  Verified_Status: { Id: string; Name: string; }[];
  RemarksOptions: any[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.Loginid = this.api.GetUserData("Id");
    this.LoginType = this.api.GetUserType();
    this.SearchForm = this.fb.group({
      financial_year: [""],
      date_range: [""],
      business_line: [""],
      vertical: [""],
      zone: [""],
      regional_office: [""],
      branch: [""],
      service_location: [""],
      employee_status: [""],
      emp_id: [""],
      report_type: [""],
      agent_type: [""],
      agent_lob: [""],
      agent_id: [""],

      interaction_purpose: [""],
      lob: [""],
      agent_status: [""],
      lead_status: [""],
      lob_type: [""],
      interaction_type: [""],
      followup_time: [""],
      search_value: [""],
      Lead_Source: [""],
      Lead_Lob: [""],
      Quote_Status: [""],
      LeadStatus: [""],
      FollowUpDaysStatus: [""],
      LMSManager_id: [""],
      LMS_emp_id: [""],
      utmSourceId: [""],
      partnergroup: [""],
      agent_id_lms: [""],
      verifiedStatus: [""],
      remarks: [""]
    });

    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

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
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
    };
    this.dropdownSettingsmultiselectAllcheck = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: false,
    };
    this.leadQuoteStatus = [
      { Id: "1", Name: "Quotation" },
      { Id: "2", Name: "Proposal" },
      { Id: "3", Name: "Payment Page" },
      { Id: "4", Name: "Converted" },
    ];

    this.leadStatus = [
      { Id: "Untouched", Name: "Untouched" },
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "Follow Up" },
      { Id: "3", Name: "Converted" },
      { Id: "4", Name: "Lost" },
      { Id: "6", Name: "Close" },
      { Id: "transferred", Name: "Transferred" },
    ];
    this.FollowUpDays = [
      { Id: "1", Name: "Today" },
      { Id: "2", Name: "Next Day" },
      { Id: "7", Name: "7 days" },
    ];

    this.Verified_Status = [
      { Id: "1", Name: "Verified" },
      { Id: "0", Name: "Not Verified" },
    ];

    this.RemarksOptions = [
      { Id: "Payout related issues", Name: "Payout related issues" },
      { Id: "Call not picked", Name: "Call not picked" },
      { Id: "Number Not Reachable", Name: "Number Not Reachable" },
      { Id: "Call disconnected", Name: "Call disconnected" },
      {
        Id: "Don't have documents",
        Name: "Don't have documents",
      },
      { Id: "Marked random query", Name: "Marked random query" },
      { Id: "Already POSP with Square Insurance", Name: "Already POSP with Square Insurance" },
      {
        Id: "Duplicate lead ", Name: "Duplicate lead " },

      { Id: "Testing by square team", Name: "Testing by square team" },
      { Id: "Premium is Higher", Name: "Premium is Higher" },

      { Id: "Quote Shared", Name: "Quote Shared" },
      { Id: "Waiting for documents", Name: "Waiting for documents" },
      {
        Id: "Phone switched off", Name: "Phone switched off" },

      { Id: "Getting number busy", Name: "Getting number busy" },
      { Id: "Payment URL Shared", Name: "Payment URL Shared" },
      { Id: "Proposal pending", Name: "Proposal pending" },
      { Id: "Other", Name: "Other" },
    ];


    // this.partnerGroup = [
    //   { Id: "square", Name: "square" },
    //   { Id: "emitra", Name: "emitra" },
    // ];
  }

  ngOnInit() {
    this.GetRightsByUrl();
    this.getSource();

    this.SearchComponentsData();

    if (this.urlSegmentRoot == "dsr") {
      this.SearchComponentsDataDsr();
    }

    if (
      this.urlSegmentRoot == "dsr" ||
      this.urlSegmentRoot == "lead-management"
    ) {
      this.api.data$.subscribe((data) => {
        this.menu_name = data[0]["menu_name"];
        this.tab_name = data[0]["tab_name"];
        if (this.menu_name == "dsr-rm-report") {
          this.SetTabChangeResponse("Trigger");
        }
        this.UpdatePageWiseValidation();
      });
    }

    //===== Lms  =====//

    if (
      this.currentUrl == "/lead-management/report" ||
      this.urlSegmentRoot == "lead-management"
    ) {
      if (this.urlSegment != "social_leads") {
        this.GetEmployeeLMS();
      }
      if (this.urlSegment == "report" || this.urlSegment == "social_leads") {
        this.GetManagerLMS();
      }
    } else {
      this.GetEmployeeData();
    }
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SET INTERACTION PURPOSE TAB =====//
  SetTabChangeResponse(triger: any) {
    this.api.SetTabChangeResponse(triger);
  }

  //===== UPDATE PAGEWISE VALIDATION =====//
  UpdatePageWiseValidation() {
    //==== DSR RELATED SECTION START ====//
    if (this.urlSegmentRoot == "dsr") {
      this.AgentFieldDisable = false;
      this.ActivityFieldDisable = false;

      this.SearchForm.get("agent_status").setValue("");
      if (this.tab_name == "Business Call" || this.tab_name == "Club") {
        this.FunctionName = "GetRMReportData";

        this.ActivityFieldDisable = true;
      } else if (this.tab_name == "Prospect Call") {
        this.FunctionName = "GetProspectCallReportData";

        this.AgentFieldDisable = true;
        this.ActivityFieldDisable = true;
        this.SearchForm.get("agent_id").setValue("");
        this.SearchForm.get("lead_status").setValue("");
      }
    }
    //==== DSR RELATED SECTION END ====//

    //==== LMS RELATED SECTION START ====//

    //==== LMS RELATED SECTION END ====//
    this.SearchFormData();
  }

  //===== SHOW HIDE MORE FIlTERS =====//
  ShowHideAdvanceFilters(current_value: any) {
    this.ShowAdvanceFilters = current_value == "No" ? "Yes" : "No";
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "CRM");
    formData.append("page_name", this.urlSegment);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/SearchComponentsData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.right_type = result["Data"]["right_type"];
            this.LoginProfileName = result["Data"]["profile_type"];
            this.session_year_ar = result["Data"]["session_year_ar"];
            this.sel_session_year_ar = result["Data"]["sel_session_year_ar"];

            this.vertical_ar = result["Data"]["vertical_ar"];

            this.employee_status_ar = result["Data"]["employee_status_ar"];
            this.report_type_ar = result["Data"]["report_type_ar"];
            this.agent_lob_ar = result["Data"]["agent_lob_ar"];
            this.agent_type_ar = result["Data"]["agent_type_ar"];

            this.mapped_emp_string = result["Data"]["all_rm_ids"];

            var Values1 = this.sel_session_year_ar[0].Id.split("-");
            var Year1 = parseInt(Values1[0]);
            var Year2 = Year1 + 1;
            this.minDate = new Date("04-01-" + Year1);
            this.maxDate = new Date("03-31-" + Year2);

            this.GetZoneData();
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsDataDsr() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "dsr/DsrCommon/SearchComponentsData?User_Id=" +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Tracker-RM-Reports"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.club_lob_ar = result["data"]["lob_ar"];
            this.club_status_ar = result["data"]["club_status_ar"];
            this.interaction_type_ar = result["data"]["interaction_type_ar"];
            this.lead_status_ar = result["data"]["lead_status_ar"];
            this.followup_time_ar = result["data"]["followup_time_ar"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== ON OPTION SELECT =====//
  OnSessionYearChange(item: any) {
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

  //===== GET ZONE DATA =====//
  GetZoneData() {
    this.regional_office_ar = [];
    this.branch_ar = [];
    this.service_location_ar = [];
    this.employee_ar = [];
    this.agent_ar = [];

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("mapped_emp_string", this.mapped_emp_string);
    formData.append("vertical", JSON.stringify(fields["vertical"]));

    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/GetZoneData",
        formData
      )
      .then((result: any) => {
        if (result["status"] == true) {
          this.zone_ar = result["Data"]["zone_ar"];
          this.mapped_emp_string = result["Data"]["mapped_emp_string"];

          this.GetRegionalOfficeData();
        }
      });
  }

  //===== GET REGIONAL OFFICE DATA =====//
  GetRegionalOfficeData() {
    this.branch_ar = [];
    this.service_location_ar = [];
    this.employee_ar = [];
    this.agent_ar = [];

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("mapped_emp_string", this.mapped_emp_string);
    formData.append("vertical", JSON.stringify(fields["vertical"]));
    formData.append("zone", JSON.stringify(fields["zone"]));

    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/GetRegionalOfficeData",
        formData
      )
      .then((result: any) => {
        if (result["status"] == true) {
          this.regional_office_ar = result["Data"]["regional_office_ar"];
          this.mapped_emp_string = result["Data"]["mapped_emp_string"];

          this.GetBranchData();
        }
      });
  }

  //===== GET BRANCH DATA =====//
  GetBranchData() {
    this.service_location_ar = [];
    this.employee_ar = [];

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("mapped_emp_string", this.mapped_emp_string);
    formData.append("vertical", JSON.stringify(fields["vertical"]));
    formData.append("zone", JSON.stringify(fields["zone"]));
    formData.append(
      "regional_office",
      JSON.stringify(fields["regional_office"])
    );

    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/GetBranchData",
        formData
      )
      .then((result: any) => {
        if (result["status"] == true) {
          this.branch_ar = result["Data"]["branch_ar"];
          this.mapped_emp_string = result["Data"]["mapped_emp_string"];
          this.GetServiceLocationData();
        }
      });
  }

  //===== GET SERVICE LOCATION DATA =====//
  GetServiceLocationData() {
    this.employee_ar = [];
    this.agent_ar = [];

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("mapped_emp_string", this.mapped_emp_string);
    formData.append("vertical", JSON.stringify(fields["vertical"]));
    formData.append("zone", JSON.stringify(fields["zone"]));
    formData.append(
      "regional_office",
      JSON.stringify(fields["regional_office"])
    );
    formData.append("branch", JSON.stringify(fields["branch"]));

    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/GetServiceLocationData",
        formData
      )
      .then((result: any) => {
        if (result["status"] == true) {
          this.service_location_ar = result["Data"]["service_location_ar"];
          this.mapped_emp_string = result["Data"]["mapped_emp_string"];
          this.GetEmployeeData();
        }
      });
  }

  //===== GET EMPLOYEE DATA =====//
  GetEmployeeData() {
    this.agent_ar = [];
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("mapped_emp_string", this.mapped_emp_string);
    formData.append("vertical", JSON.stringify(fields["vertical"]));
    formData.append("zone", JSON.stringify(fields["zone"]));
    formData.append(
      "regional_office",
      JSON.stringify(fields["regional_office"])
    );
    formData.append("branch", JSON.stringify(fields["branch"]));
    formData.append(
      "service_location",
      JSON.stringify(fields["service_location"])
    );

    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/GetEmployeeDatas",
        formData
      )
      .then((result: any) => {
        if (result["status"] == true) {
          this.employee_ar = result["Data"]["employee_ar"];
          this.mapped_emp_string = result["Data"]["mapped_emp_string"];
        }
      });
  }

  GetManagerLMS() {
    this.agent_ar = [];
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");

    // this.urlSegment != "social_leads";

    this.api
      .HttpPostType("/LmsReport/GetLmsManagerData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.employeeManager_arr = result["Data"]["employee_ar"];
          this.utmSourceAr = result["Data"]["utmSource"];
        }
      });
  }

  GetEmployeeLMS() {
    this.agent_ar = [];
    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    this.api
      .HttpPostType("/LmsReport/GetEmployeeData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.LMS_employee_arr = result["Data"]["employee_ar"];
          this.partnerGroup = result["Data"]["PartnerGroupAr"];

          this.GetAgentDataNew();
        }
      });
  }

  //===== GET AGENT DATA =====//
  GetAgentData() {
    if (this.SearchForm.get("emp_id").value.length > 1) {
      this.reportTypeDisable = true;
    } else {
      this.reportTypeDisable = false;
    }

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("mapped_emp_string", this.mapped_emp_string);
    formData.append("vertical", JSON.stringify(fields["vertical"]));
    formData.append("zone", JSON.stringify(fields["zone"]));
    formData.append(
      "regional_office",
      JSON.stringify(fields["regional_office"])
    );
    formData.append("branch", JSON.stringify(fields["branch"]));
    formData.append(
      "service_location",
      JSON.stringify(fields["service_location"])
    );
    formData.append("emp_id", JSON.stringify(fields["emp_id"]));
    formData.append("report_type", JSON.stringify(fields["report_type"]));
    formData.append("agent_lob", JSON.stringify(fields["agent_lob"]));

    this.api
      .HttpPostTypeBms(
        "filters-related-new/FiltersCommon/GetAgentData",
        formData
      )
      .then((result: any) => {
        if (result["status"] == true) {
          this.agent_ar = result["Data"]["agent_ar"];
        }
      });
  }

  // GetAgentDataNew() {

  //   if (this.SearchForm.get("LMS_emp_id").value != undefined || this.SearchForm.get("LMS_emp_id").value.length.length > 0) {
  //     const selectedIds = this.SearchForm.get("LMS_emp_id").value.map((item: any) => item['Id']);
  //     this.Emp_LMS_Id = selectedIds;
  //     // console.log(this.Emp_LMS_Id);
  //   }

  //   else if(this.SearchForm.get("partnergroup").value != undefined && this.SearchForm.get("partnergroup").value != ''){
  //     const PartnerCodeId = this.SearchForm.get("partnergroup").value;
  //     this.SelectedPartnerGroup = PartnerCodeId[0]['Id'];
  //   }

  //   // alert(this.Emp_LMS_Id);
  //   // alert(this.SelectedPartnerGroup);

  //   const formData = new FormData();

  //   // formData.append("user_code", this.api.GetUserData("Code"));
  //   formData.append("EmployeeIds", this.Emp_LMS_Id);
  //   formData.append("PartnerGroup", this.SelectedPartnerGroup);

  //   this.api
  //     .HttpPostType(
  //       "Fillter/Fillter/GetAgentData",
  //       formData
  //     )
  //     .then((result: any) => {
  //       if (result["status"] == true) {
  //         this.agent_id_lms = result["Data"];
  //       }
  //     });
  // }

  GetAgentDataNew() {
    // Check the first dropdown (Employee Name & Code)
    if (
      this.SearchForm.get("LMS_emp_id").value != undefined &&
      this.SearchForm.get("LMS_emp_id").value.length > 0
    ) {
      const selectedIds = this.SearchForm.get("LMS_emp_id").value.map(
        (item: any) => item["Id"]
      );
      this.Emp_LMS_Id = selectedIds;
    } else {
      this.Emp_LMS_Id = null; // Reset Emp_LMS_Id if nothing is selected
    }

    // Check the second dropdown (Partner Group)
    if (
      this.SearchForm.get("partnergroup").value != undefined &&
      this.SearchForm.get("partnergroup").value != ""
    ) {
      const PartnerCodeId = this.SearchForm.get("partnergroup").value;
      this.SelectedPartnerGroup = PartnerCodeId[0]["Id"];
    } else {
      this.SelectedPartnerGroup = null; // Reset SelectedPartnerGroup if nothing is selected
    }

    // Log for debugging
    //   //   //   console.log("Emp_LMS_Id: ", this.Emp_LMS_Id);
    //   //   //   console.log("SelectedPartnerGroup: ", this.SelectedPartnerGroup);

    // Prepare form data
    const formData = new FormData();
    formData.append("EmployeeIds", this.Emp_LMS_Id ? this.Emp_LMS_Id : "");
    formData.append(
      "PartnerGroup",
      this.SelectedPartnerGroup ? this.SelectedPartnerGroup : ""
    );

    // Make the API call
    this.api
      .HttpPostType("Fillter/Fillter/GetAgentData", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.agent_id_lms = result["Data"];
          this.partnerGroup = result["PartnerGroupAr"];
        }
      });
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
          this.rightType = result["RightType"];
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
  SearchFormData() {
    var fields = this.SearchForm.value;
    this.isSubmitted = true;

    if (this.SearchForm.invalid) {
      return;
    } else {
      if (this.tab_name == "Club" && fields["lob_type"].length < 1) {
        this.api.Toast("Warning", "Please choose Club Lob from filters!");
        return;
      }

      var DateOrDateRange = fields["date_range"];

      var FromDate, ToDate;
      if (DateOrDateRange) {
        FromDate = DateOrDateRange[0];
        ToDate = DateOrDateRange[1];
      }

      //gems Reports
      const post = {
        User_Code: this.api.GetUserData("Code"),
        User_Type: this.api.GetUserType(),
        Portal: "CRM",

        tab_name: this.tab_name,
        financial_year: fields["financial_year"],
        date_from: FromDate,
        date_to: ToDate,
        business_line: fields["business_line"],
        vertical: fields["vertical"],
        zone: fields["zone"],
        branch: fields["branch"],
        service_location: fields["service_location"],
        regional_office: fields["regional_office"],
        employee_status: fields["employee_status"],
        emp_id: fields["emp_id"],
        report_type: fields["report_type"],
        agent_type: fields["agent_type"],
        agent_id: fields["agent_id"],

        interaction_purpose: this.tab_name,
        interaction_type: fields["interaction_type"],
        lob_type: fields["lob_type"],
        agent_status: fields["agent_status"],
        lead_status: fields["lead_status"],
        followup_time: fields["followup_time"],

        Lead_Source: fields["Lead_Source"],
        Lead_Lob: fields["Lead_Lob"],
        Quote_Status: fields["Quote_Status"],
        LeadStatus: fields["LeadStatus"],
        FollowUpDaysStatus: fields["FollowUpDaysStatus"],
        LMSManager_id: fields["LMSManager_id"],
        LMS_emp_id: fields["LMS_emp_id"],
        partnergroup: fields["partnergroup"],
        agent_id_lms: fields["agent_id_lms"],
        utmSourceId: fields["utmSourceId"],
        search_value: trim(fields["search_value"]),
        verifiedStatus: fields["verifiedStatus"],
        remarks: fields["remarks"],
        function_name: this.FunctionName,
      };

      this.postCreated.emit(post);
    }
  }

  ///////======= DSR RELATED FUNCTION ===========///////

  //===== UPDATE FILTER FIELDS =====//
  UpateDsrFilterField(val: any) {
    if (val == "Lead_Status") {
      this.SearchForm.get("interaction_type").setValue("");
    } else if (val == "Interaction_Type") {
      this.SearchForm.get("lead_status").setValue("");
    }
  }

  //===== ENABLE DISABLE FIELDS =====//
  EnableDisableFields(e: any, Type: any) {
    this.AgentFieldDisable = false;
    this.ActivityFieldDisable = false;

    //== Club Condition Start ==//
    if (Type == "Club") {
      var Value = this.SearchForm.value["agent_status"];

      if (Value.length >= 1) {
        this.SearchForm.get("lob_type").setValidators([Validators.required]);
        this.SearchForm.get("lob_type").updateValueAndValidity();
      } else {
        if (this.tab_name == "Club") {
          //No chnge
        } else {
          this.SearchForm.get("lob_type").setValidators(null);
          this.SearchForm.get("lob_type").updateValueAndValidity();
        }
      }
    }
    //== Club Condition End ==//
  }

  //===== ENABLE DISABLE FIELDS =====//
  EnableDisableFields1(Type: any) {
    //== Followup Lead Start ==//
    if (Type == "FollowUp_Lead") {
      var Value = this.SearchForm.value["followup_time"];
      if (Value.length == 1) {
        this.SearchForm.get("date_range").setValue("");
      }
    }
    //== Followup Lead End ==//

    //== Date Filter Start ==//
    if (Type == "Date_Filter") {
      var Date = this.SearchForm.value["date_range"];
      if (Date != "") {
        this.SearchForm.get("followup_time").setValue("");
      }
    }
    //== Date Filter End ==//
  }

  ///////======= LMS RELATED FUNCTION ===========///////

  soucreDropdownChange(data: any[]) {
    this.SearchForm.get("Lead_Lob").reset("");
    let source = "";
    for (const item of data) {
      source = item.Id;
    }

    const formData = new FormData();
    formData.append("Source", source);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("lms/LmsCommon/GetFiltterLob", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          // console.log(result['data']);
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
  getSource() {
    const formData = new FormData();
    formData.append("page_name", this.urlSegment);
    this.api.IsLoading();
    this.api.HttpPostTypeBms("lms/LmsCommon/GetSource", formData).then(
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

  handleDropdownChange(event: any[]) {
    this.quotationStatus = false;
    for (const selectedItem of event) {
      if (selectedItem.Id === "Motor" || selectedItem.Id === "Health") {
        this.quotationStatus = true;
        break; // Exit the loop once the condition is satisfied
      }
    }
  }

  ///////======= LMS RELATED FUNCTION END ===========///////

  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  // ClearSearch() {
  //   this.SearchComponentsData;
  // }

  // new
  onSelectLeadStatus(selectedItem: any): void {
    if (selectedItem["Id"] == 2) {
      this.ShowLeadStatusValue = selectedItem["Id"];
    } else {
      this.ShowLeadStatusValue = 0;
      this.SearchForm.get("FollowUpDaysStatus").setValue("");
    }
  }

  // onEmployeeDeSelect(type:any){
  //   alert(type);
  // }
}
