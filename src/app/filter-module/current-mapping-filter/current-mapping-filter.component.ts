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
  selector: "app-current-mapping-filter",
  templateUrl: "./current-mapping-filter.component.html",
  styleUrls: ["./current-mapping-filter.component.css"],
})
export class CurrentMappingFilterComponent implements OnInit {
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
  loginType: string;
  ActionType: string;
  urlSegmentSub: any;
  EmployeeType: any = "";

  Loginid: any;
  LoginType: string | null;

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
  agent_status_ar: any = [];
  agent_type_ar: any = [];
  agent_ar: any = [];
  club_manager_ar: any = [];

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
  request_type_ar: any = [];
  sel_request_type: any = [];

  ShowAdvanceFilters: any = "No";
  right_type: any = "Self";
  mapped_emp_string: any = "";
  Lob_Ar: any = [];
  Lobs: any = "";
  state_ar: any = [];
  city_ar: any = [];
  pincode_ar: any = [];
  SelectStatus: { Id: string; Name: string }[];
  SelectStatusValue: { Id: string; Name: string }[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
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
      agent_status: [""],
      agent_id: [""],
      PosBusniessstatus: [""],
      state_id: [""],
      city_id: [""],
      pincode_id: [""],

      request_type: [""],
      interaction_purpose: [""],
      club_status: [""],
      lead_status: [""],
      lob_type: [""],
      manager_id: [""],
      interaction_type: [""],
      followup_time: [""],
      search_value: [""],
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
  }

  ngOnInit() {
    this.Loginid = this.api.GetUserId();
    this.LoginType = this.api.GetUserType();
    this.loginType = this.api.GetUserType();
    this.GetRightsByUrl();

    this.SearchComponentsData();

    this.SelectStatus = [
      { Id: "1", Name: "Active" },
      { Id: "2", Name: "Inactive" },
    ];

    this.SelectStatusValue = [{ Id: "1", Name: "Active" }];

    if (this.urlSegmentRoot == "dsr") {
      this.SearchComponentsDataDsr();
    }

    if (
      this.urlSegmentRoot == "dsr" ||
      this.urlSegmentRoot == "lead-management"
    ) {
      this.api.data$.subscribe((data) => {
        //   //   //   console.log(data);
        this.menu_name = data[0]["menu_name"];
        this.tab_name = data[0]["tab_name"];

        if (this.menu_name == "dsr-manager-reports") {
          this.GetManagerEmployees();
        }

        if (
          this.menu_name == "dsr-rm-report" ||
          this.menu_name == "dsr-manager-reports" ||
          this.menu_name == "dsr-club-manager"
        ) {
          this.SetTabChangeResponse("Trigger");
        }

        this.UpdatePageWiseValidation();
      });
    }
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SET INTERACTION PURPOSE TAB =====//
  SetTabChangeResponse(trigger: any) {
    this.api.SetTabChangeResponse(trigger);
  }

  //===== UPDATE PAGEWISE VALIDATION =====//
  UpdatePageWiseValidation() {
    //==== DSR RELATED SECTION START ====//
    if (this.urlSegmentRoot == "dsr") {
      this.AgentFieldDisable = false;
      this.ActivityFieldDisable = false;

      this.SearchForm.get("agent_status").setValue("");
      if (
        this.tab_name == "Business Call" ||
        this.tab_name == "Club" ||
        this.tab_name == "Cross Sell"
      ) {
        this.FunctionName = "GetRMReportData";
        this.ActivityFieldDisable = true;
      } else if (this.tab_name == "Prospect Call") {
        this.FunctionName = "GetProspectCallReportData";

        this.AgentFieldDisable = true;
        this.ActivityFieldDisable = true;
        this.SearchForm.get("agent_id").setValue("");
        this.SearchForm.get("lead_status").setValue("");
      } else if (this.tab_name == "Employee Call") {
        this.FunctionName = "GetEmployeeCallReportData";
      }

      if (this.menu_name == "dsr-club-manager") {
        this.SearchForm.get("request_type").setValidators(Validators.required);
      }
    }
    //==== DSR RELATED SECTION END ====//

    //==== LMS RELATED SECTION START ====//

    //==== LMS RELATED SECTION END ====//

    //this.ResetFilter();
  }

  //===== CLEAR/RESET FILTER =====//
  ResetFilter() {
    this.SearchForm.get("lead_status").setValue("");
    this.SearchForm.get("lob_type").setValue("");
    this.SearchForm.get("interaction_type").setValue("");
    this.SearchForm.get("followup_time").setValue("");

    this.SearchFormData();
    this.SearchComponentsData();
  }

  //===== CHANGE CLUB TYPE =====//
  ChangeClub(e: any) {
    // var RequestType = this.SearchForm.value['Request_Type'];
    // if (RequestType.length > 0 && RequestType[0]['Id'] == 'My Request') {
    //   this.ClubStatusValue = [{ Id: "Aspirant", Name: "Aspirant/Prospects" }];
    // } else {
    //   this.ClubStatusValue = [];
    // }
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

    //this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/SearchComponentsData",
        formData
      )
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            this.right_type = result["Data"]["right_type"];
            this.LoginProfileName = result["Data"]["profile_type"];
            this.session_year_ar = result["Data"]["session_year_ar"];
            this.sel_session_year_ar = result["Data"]["sel_session_year_ar"];

            this.vertical_ar = result["Data"]["vertical_ar"];
            this.zone_ar = result["Data"]["zone_ar"];

            this.employee_status_ar = result["Data"]["employee_status_ar"];
            this.report_type_ar = result["Data"]["report_type_ar"];
            this.agent_type_ar = result["Data"]["agent_type_ar"];
            this.agent_status_ar = result["Data"]["agent_status_ar"];

            var Values1 = this.sel_session_year_ar[0].Id.split("-");
            var Year1 = parseInt(Values1[0]);
            var Year2 = Year1 + 1;
            this.minDate = new Date("04-01-" + Year1);
            this.maxDate = new Date("03-31-" + Year2);

            this.GetRegionalOfficeData();
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsDataDsr() {
    //this.api.IsLoading();
    this.api
      .CallBms(
        "dsr/DsrCommon/SearchComponentsData?User_Id=" +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Tracker-RM-Reports"
      )
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            this.club_lob_ar = result["data"]["lob_ar"];
            this.club_status_ar = result["data"]["club_status_ar"];
            this.interaction_type_ar = result["data"]["interaction_type_ar"];
            this.lead_status_ar = result["data"]["lead_status_ar"];
            this.followup_time_ar = result["data"]["followup_time_ar"];
            this.request_type_ar = result["data"]["request_type_ar"];
            this.sel_request_type = result["data"]["sel_request_type"];
            this.state_ar = result["data"]["state_ar"];
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

  //===== GET REGIONAL OFFICE DATA =====//
  GetRegionalOfficeData() {
    this.regional_office_ar = [];
    this.branch_ar = [];
    this.service_location_ar = [];
    this.employee_ar = [];
    this.agent_ar = [];

    this.SearchForm.get("regional_office").setValue("");
    this.SearchForm.get("branch").setValue("");
    this.SearchForm.get("service_location").setValue("");
    this.SearchForm.get("emp_id").setValue("");
    this.SearchForm.get("agent_id").setValue("");

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("zone", JSON.stringify(fields["zone"]));

    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/GetRegionalOfficeData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.regional_office_ar = result["Data"]["regional_office_ar"];
          this.branch_ar = result["Data"]["branch_ar"];
          this.service_location_ar = result["Data"]["service_location_ar"];
          this.GetEmployeeData();
        }
      });
  }

  //===== GET BRANCH DATA =====//
  GetBranchData() {
    this.service_location_ar = [];
    this.employee_ar = [];
    this.agent_ar = [];

    this.SearchForm.get("branch").setValue("");
    this.SearchForm.get("service_location").setValue("");
    this.SearchForm.get("emp_id").setValue("");
    this.SearchForm.get("agent_id").setValue("");

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("zone", JSON.stringify(fields["zone"]));
    formData.append(
      "regional_office",
      JSON.stringify(fields["regional_office"])
    );

    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/GetBranchData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.branch_ar = result["Data"]["branch_ar"];
          this.service_location_ar = result["Data"]["service_location_ar"];
          this.GetEmployeeData();
        }
      });
  }

  //===== GET SERVICE LOCATION DATA =====//
  GetServiceLocationData() {
    this.employee_ar = [];
    this.agent_ar = [];

    this.SearchForm.get("service_location").setValue("");
    this.SearchForm.get("emp_id").setValue("");
    this.SearchForm.get("agent_id").setValue("");

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("vertical", JSON.stringify(fields["vertical"]));
    formData.append("zone", JSON.stringify(fields["zone"]));
    formData.append(
      "regional_office",
      JSON.stringify(fields["regional_office"])
    );
    formData.append("branch", JSON.stringify(fields["branch"]));

    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/GetServiceLocationData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.service_location_ar = result["Data"]["service_location_ar"];
          this.GetEmployeeData();
        }
      });
  }

  //===== GET EMPLOYEE DATA =====//
  GetEmployeeData() {
    this.agent_ar = [];
    this.SearchForm.get("emp_id").setValue("");
    this.SearchForm.get("agent_id").setValue("");

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
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
        "filters-related/CurrentMappingFilter/GetEmployeeData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.employee_ar = result["Data"]["employee_ar"];
        }
      });
  }

  //===== GET AGENT DATA =====//
  GetAgentData() {
    if (this.SearchForm.get("emp_id").value.length > 1) {
      this.reportTypeDisable = true;
      this.SearchForm.get("report_type").setValue("");
    } else {
      this.reportTypeDisable = false;
    }

    this.SearchForm.get("agent_id").setValue("");
    this.agent_ar = [];

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
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
    formData.append("agent_type", JSON.stringify(fields["agent_type"]));
    formData.append("agent_status", JSON.stringify(fields["agent_status"]));

    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/GetAgentData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.agent_ar = result["Data"]["agent_ar"];
        }
      });
  }

  //===== GET EMPLOYEES DATA =====//
  GetManagerEmployees() {
    var Circle = "All";
    if (this.SearchForm.value["lob_type"].length > 0) {
      Circle = this.SearchForm.value["lob_type"][0]["Id"];
    }

    const formData = new FormData();
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Portal", "CRM");
    formData.append("CircleType", Circle);

    this.api
      .HttpPostTypeBms(
        "daily-tracking-circle/AllClubReport/GetManagerList",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.club_manager_ar = result["ManagerData"];
            this.Lob_Ar = result["LobData"];
            this.Lobs = this.Lob_Ar.join();
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  //===== GET CITY DATA =====//
  GetCityData() {
    this.city_ar = [];
    this.pincode_ar = [];

    this.SearchForm.get("city_id").setValue("");
    this.SearchForm.get("pincode_id").setValue("");

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("state_id", JSON.stringify(fields["state_id"]));

    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/GetCityData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.city_ar = result["Data"]["city_ar"];
        }
      });
  }

  //===== GET PINCODE DATA =====//
  GetPincodeData() {
    this.pincode_ar = [];

    this.SearchForm.get("pincode_id").setValue("");

    var fields = this.SearchForm.value;
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("portal", "crm");
    formData.append("page_name", this.menu_name);
    formData.append("right_type", this.right_type);
    formData.append("city_id", JSON.stringify(fields["city_id"]));

    this.api
      .HttpPostTypeBms(
        "filters-related/CurrentMappingFilter/GetPincodeData",
        formData
      )
      .then((result) => {
        if (result["status"] == true) {
          this.pincode_ar = result["Data"]["pincode_ar"];
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

    // this.api.IsLoading();
    this.api.HttpPostType("V2/Rights/GetRightsByUrl", formData).then(
      (result) => {
        // this.api.HideLoading();

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
        agent_status: fields["agent_status"],
        agent_type: fields["agent_type"],
        agent_id: fields["agent_id"],

        state_id: fields["state_id"],
        city_id: fields["city_id"],
        pincode_id: fields["pincode_id"],

        request_type: fields["request_type"],
        interaction_purpose: this.tab_name,
        interaction_type: fields["interaction_type"],
        lob_type: fields["lob_type"],
        club_status: fields["club_status"],
        lead_status: fields["lead_status"],
        followup_time: fields["followup_time"],

        search_value: trim(fields["search_value"]),
        PosBusniessstatus: fields["PosBusniessstatus"],

        function_name: this.FunctionName,
      };

      this.postCreated.emit(post);
    }
  }

  ///////======= DSR RELATED FUNCTION ===========///////

  //===== UPDATE FILTER FIELDS =====//
  UpdateDsrFilterField(val: any) {
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
      if (
        Value.length == 1 &&
        this.SearchForm.value["followup_time"][0]["Id"] != "All Follow Up"
      ) {
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

  ClearSearch() {
    this.SearchComponentsData();
  }
}
