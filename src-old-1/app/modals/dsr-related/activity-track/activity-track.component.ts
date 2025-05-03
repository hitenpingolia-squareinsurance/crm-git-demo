import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  NgZone,
  Inject,
} from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { timer } from "rxjs";
import $ from "jquery";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

class ColumnsObj {
  SNo: string;
  Id: string;
  Action_Type: any;
  FollowUp_Type: any;
  VisitDate_Time: any;
  FollowUp_Date: string;
  Camera_Image: string;
  FollowUp_Remark: any;
  Remarks: string;
  Add_Stamp: string;
  Meeting_Date: string;
  Meeting_Start_Time: string;
  Meeting_End_Time: string;
  Meeting_Venue: string;
  FollowUpBy: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  visit_count: any;
  virtual_count: any;
}

@Component({
  selector: "app-activity-track",
  templateUrl: "./activity-track.component.html",
  styleUrls: ["./activity-track.component.css"],
})
export class ActivityTrackComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

  totalRecordsfiltered: number;
  TotalRow: number;
  filterData: string;
  AgentName: any;
  dataArNested: any;
  NestedPagesList: any;
  loading = false;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  visit_count: any = 0;
  virtual_count: any = 0;

  Circle_Type: any = "";
  Agent_Id: any;
  Agent_Name: any;
  Row_Id: any;
  CircleAr: any = [];
  activeTab: any = "";
  showTab: any = "No";
  Action_User_Type: any;
  Is_Export: any = 0;

  dropdownSettingsingleselect: {};
  interaction_type_ar: any = [];
  followup_remarks_ar: any = [];
  followup_req_ar: any;
  agent_ar: any;
  prospect_type_ar: any;
  call_type_ar: any;
  interaction_pur: any = "";
  int_placeholder: any = "Interaction Type";

  constructor(
    public dialogRef: MatDialogRef<ActivityTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private http: HttpClient,
    public formBuilder: FormBuilder,
    private ngZone: NgZone
  ) {
    this.SearchForm = this.formBuilder.group({
      interaction_type: [""],
      follow_up_remark: [""],
      date_range: [""],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
    };

    this.Row_Id = this.data.Row_Id;
    this.Circle_Type = this.data.Circle_Type;
    this.interaction_pur = this.data.Circle_Type;
    this.Agent_Id = this.data.Agent_Id;
    this.Agent_Name = this.data.Agent_Name;
    this.Action_User_Type = this.Action_User_Type;

    if (this.data.showTab != "No") {
      this.showTab = "Yes";
    }
  }

  ngOnInit() {
    if (this.Circle_Type == "Business Call") {
      this.GetAgentCircle(this.Agent_Id);
      this.int_placeholder = "Interaction Type";
    } else if (this.Circle_Type == "Employee Call") {
      this.GetAgentCircle(this.Agent_Id);
      this.int_placeholder = "MOM Type";
    } else {
      this.CircleAr.push(this.Circle_Type);
      this.activeTab = this.Circle_Type;
      this.Get();
    }

    this.pageNo = 1;
    this.SearchComponentsData();
  }

  ngAfterViewInit(): void {
    this.pageNo = 1;

    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset("bottom")),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(900)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.Get();
        });
      });
  }

  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();

    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("user_id", "");
    formData.append("circle_type", this.Circle_Type);
    formData.append("portal", "crm");
    formData.append("page_name", "activity-track");

    this.api.IsLoading();

    this.api
      .HttpPostTypeBms("dsr/DsrCommon/SearchComponentsData", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.interaction_type_ar = result["data"]["interaction_type_ar"];
            this.followup_remarks_ar = result["data"]["followup_remarks_ar"];
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
        }
      );
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const formData = new FormData();
    formData.append("datas", this.filterData);

    this.api
      .HttpPostTypeBms(
        "dsr/DsrReports/GetActivityTrack?&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Circle_Type=" +
          this.Circle_Type +
          "&Agent_Id=" +
          this.Agent_Id +
          "&Portal=CRM&Page=" +
          this.pageNo,
        formData
      )
      .then(
        (result: any) => {
          if (result["Status"] == true) {
            this.dataAr = result["data"];
            if (this.pageNo <= 1) {
              this.totalRecordsfiltered = result["recordsFiltered"];
              this.TotalRow = result["recordsFiltered"];
            }

            this.responseData = result["data"];
            this.post = this.post.concat(this.responseData);
            this.pageNo++;
            var keyss = 0;

            this.post = this.post.map((item) => {
              keyss++;
              item.SrNo = keyss;
              return item;
            });
          } else {
            this.post = [];
            this.pageNo = 1;
          }

          this.visit_count = result["visit_count"];
          this.virtual_count = result["virtual_count"];
        },

        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    var fields = this.SearchForm.value;
    var ToDate, FromDate;
    var DateOrDateRange = fields["date_range"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var query = {
      interaction_type: fields["interaction_type"],
      follow_up_remark: fields["follow_up_remark"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    this.filterData = JSON.stringify(query);
    this.post = [];
    this.pageNo = 1;

    this.Get();
    this.dataAr = [];
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.post = [];
    this.pageNo = 1;

    var fields = this.SearchForm.reset();
    this.SearchForm.get("interaction_type").setValue("");
    this.SearchForm.get("follow_up_remark").setValue("");
    this.dataAr = [];
    this.SearchBtn();
  }

  //===== GET AGENT CIRCLE LIST =====//
  GetAgentCircle(Agent_Id: any) {
    const formData = new FormData();
    formData.append("Agent_Id", Agent_Id);
    formData.append("Portal", "CRM");
    formData.append("interaction_pur", this.interaction_pur);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("dsr/DsrCommon/GetAgentCircle", formData)
      .then((result: any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.CircleAr = result["Data"];
          this.Circle_Type = this.CircleAr[0];
          this.activeTab = this.CircleAr[0];

          this.Get();
        }
      });
  }

  //==== GET DATATABLE DATA ON TAB CHANGE =====//
  GetData(CType: any, type: any) {
    this.post = [];
    this.pageNo = 1;

    if (type == "1") {
      this.Circle_Type = CType;
      this.activeTab = CType;
    }

    this.Get();
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(name: any) {
    var url = name;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
