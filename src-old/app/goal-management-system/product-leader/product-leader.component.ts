import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { TargetDetailsComponent } from "../../modals/goal-management/target-details/target-details.component";

class ColumnsObj {
  Id: string;
  Name: string;
  Mobile: string;
  Profile_Type: string;
  DOJ: string;
  Status: string;
  ResignStatus: string;
  Revenue: string;
  Business: string;
  Total_Target: string;
  AchivementPercent: string;
  TotalActiveDays: string;
  MonthNamCon: string;
  MonthConSr: string;
  MonthConDsr: string;
  SalaryRemarks: string;
  IsEdit: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-product-leader",
  templateUrl: "./product-leader.component.html",
  styleUrls: ["./product-leader.component.css"],
})
export class ProductLeaderComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};
  mytime: Date = new Date();

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;

  UserRights: any = [];

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  ReportTypeData: Array<any>;

  ItemEmployeeSelection: any = [];
  LobData: any = [];
  MonthArray: any = [];
  SelectedMonth: any = "";
  CurrentMonth: any = "";
  Name: any = "";
  SelectedCurrentMonth: any = [];
  SelectedMonthNo: any = "";

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  Is_Export: any = 0;

  MessageBody: string = "";
  ActionType: any = "";

  checklist: any = [];
  checkedList: any = [];
  currentUrl: string;
  urlSegment: any;

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};
  ProfileTarget: any;
  ProfileAchivement: any;
  AllocatedTarget: any;
  AllocatedAcivement: any;
  AchivementData: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Request_Type: [""],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      AgentType: [""],
      Agents_Id: [""],
      RM_Search_Type: [""],
      Month_Name: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit(): void {
    // this.StyleWork();
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    this.SearchComponentsData();
    // this.GetUserRights();
    this.Get();

    this.MonthArray = [
      { Id: "04", Name: "April" },
      { Id: "05", Name: "May" },
      { Id: "06", Name: "June" },
      { Id: "07", Name: "July" },
      { Id: "08", Name: "August" },
      { Id: "09", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
      { Id: "01", Name: "January" },
      { Id: "02", Name: "Feburary" },
      { Id: "03", Name: "March" },
    ];

    //Month Related Filter Values
    const d = new Date();
    this.CurrentMonth = d.getMonth();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    //Month String Value
    this.Name = month[d.getMonth()];

    //Month Numeric Value
    this.CurrentMonth = +this.CurrentMonth + +1;
    if (this.CurrentMonth < 11) {
      this.CurrentMonth = "0" + this.CurrentMonth;
    }

    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/SearchComponentsData?User_Id=" +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Tracker-RM-Reports"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //alert(err.message);
        }
      );
  }

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    //this.Agents_Ar=[];

    this.SearchForm.get("Emp_Id").setValue(null);
    //this.SearchForm.get('Agent_Id').setValue(null);

    this.ReportTypeDisable = true;
    this.SearchForm.get("RM_Search_Type").setValue("");
    this.reportTypeVal = "";

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Tracker-RM-Reports");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Vertical_Id",
      JSON.stringify(this.SearchForm.value["Vertical_Id"])
    );
    formData.append(
      "Region_Id",
      JSON.stringify(this.SearchForm.value["Region_Id"])
    );
    formData.append(
      "Sub_Region_Id",
      JSON.stringify(this.SearchForm.value["Sub_Region_Id"])
    );

    this.api
      .HttpPostTypeBms(
        "/daily-tracking-circle/AllClubReport/GetEmployees",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Emps_Ar = result["Data"];
            this.Employee_Placeholder =
              "Select Employee (" + this.Emps_Ar.length + ")";
            this.Agents_Placeholder = "Select Agent";
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.SearchForm.get("Emp_Id").setValue("");
            this.Emps_Ar = [];
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

  //===== GET BRANCHES DATA =====//
  GetSubBranches() {
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.Sub_Branch_Ar = [];

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Daily-Tracker");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Branch_Id",
      JSON.stringify(this.SearchForm.value["Region_Id"])
    );

    this.api
      .HttpPostTypeBms(
        "daily-tracking-circle/AllClubReport/GetSubBranchesData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Sub_Branch_Ar = result["Data"];
            this.GetEmployees();
          } else {
            this.Sub_Branch_Ar = [];
            this.GetEmployees();
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      if (this.SearchForm.get("Month_Name").value.length == 1) {
        this.SelectedMonth = fields["Month_Name"][0]["Name"];
        this.SelectedMonthNo = fields["Month_Name"][0]["Id"];
      } else {
        this.SelectedMonth = this.Name;
        this.SelectedMonthNo = this.CurrentMonth;
      }

      var RM_Id_value, Franchisee_Id_value, ToDate, FromDate;
      var DateOrDateRange = fields["DateOrDateRange"];

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],
        Emp_Id: fields["Emp_Id"],
        RM_Search_Type: fields["RM_Search_Type"],
        Agents_Id: fields["Agents_Id"],
        Interaction_Purpose: fields["InteractionPurpose"],
        Lob_Type: fields["LobType"],
        Agent_Status: fields["AgentStatus"],
        Lead_Status: fields["Lead_Status"],
        Interaction_Type: fields["Interaction_Type"],
        Month_Name: fields["Month_Name"],
        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
        SearchValue: fields["SearchValue"],
      };

      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      });
    }
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.SearchForm.get("Request_Type").setValue("Raised Request");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("");
    this.SearchForm.get("RM_Search_Type").setValue("");
    this.SearchForm.get("LobType").setValue("");
    this.SearchForm.get("AgentStatus").setValue("");
    this.SearchForm.get("Lead_Status").setValue("");
    this.SearchForm.get("Interaction_Type").setValue("");

    this.Agents_Placeholder = "Select Agent";
    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
    //this.ResetDT();
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      //searching: false,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http;
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/goal-management-system/GridData/GetProductLeaderData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&urlSegment=" +
                this.urlSegment +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.SQL_Where;
            that.GetYTDChanks();
            //this.GetHeaderData();

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    for (let i = 0; i < this.dataAr.length; i++) {
      var Employee_Id = this.dataAr[i]["Id"];
      var MonthNamCon = this.dataAr[i]["MonthNamCon"];
      var MonthConSr = this.dataAr[i]["MonthConSr"];
      var MonthConDsr = this.dataAr[i]["MonthConDsr"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", Employee_Id);
      formData.append("MonthNamCon", MonthNamCon);
      formData.append("MonthConSr", MonthConSr);
      formData.append("MonthConDsr", MonthConDsr);
      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/GridData/GetExtraData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //// console.log(data.Agent_Id);
          this.dataAr[i]["Total_Target"] = data.TotalTarget;
          this.dataAr[i]["AchivementPercent"] = data.AchivementPercent;
          this.dataAr[i]["Revenue"] = data.Revenue;
          this.dataAr[i]["Business"] = data.Business;
          this.dataAr[i]["TotalActiveDays"] = data.TotalActiveDays;
        });
    }
  }

  //===== GET EMPLOYEES DATA =====//
  GetHeaderData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("MonthName", this.SelectedMonth);

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/GridData/GetHeaderData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.ProfileTarget = result["ProfileTarget"];
            this.ProfileAchivement = result["ProfileAchivement"];
            this.AllocatedTarget = result["AllocatedTarget"];
            this.AllocatedAcivement = result["AllocatedAcivement"];
            this.AchivementData = result["AchivementData"];
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.SearchForm.get("Emp_Id").setValue("");
            this.Emps_Ar = [];
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

  //===== INDIVIDUAL TARGET DETAILS =====//
  TargetDetails(row_Id: any, Profile_Name: any): void {
    const dialogRef = this.dialog.open(TargetDetailsComponent, {
      width: "90%",
      height: "90%",
      disableClose: false,
      data: {
        Id: row_Id,
        Profile_Name: Profile_Name,
        UrlSegment: "ProductLeader",
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }
}
