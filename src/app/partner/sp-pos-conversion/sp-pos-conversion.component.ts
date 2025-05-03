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

import { AgentDetailsViewComponent } from "src/app/modals/agent-details-view/agent-details-view.component";

class ColumnsObj {
  Id: string;
  Emp_Id: string;
  Type: string;
  Name: string;
  Email: string;
  Mobile: string;
  RM_Name: string;
  Status: string;
  MergeCode1: string;
  MergeCode2: string;
  MergeCode3: string;
  MergeDate1: string;
  MergeDate2: string;
  MergeDate3: string;
  Update_Stamp: string;

  Insert_Date: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: "app-sp-pos-conversion",
  templateUrl: "./sp-pos-conversion.component.html",
  styleUrls: ["./sp-pos-conversion.component.css"],
})
export class SpPosConversionComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};
  mytime: Date = new Date();

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  ReportTypeData: Array<any>;

  ItemEmployeeSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  Is_Export: any = 0;

  MessageBody: string = "";
  ActionType: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      AgentType: [""],
      Agents_Id: [""],
      RM_Search_Type: [""],
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
    this.SearchComponentsData();
    this.GetUserRights();
    this.Get();
    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];
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
          this.api.GetUserId() +
          "&Portal=BMS&PageName=SpPosConversion"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    //this.Agents_Ar=[];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.ReportTypeDisable = true;
    this.SearchForm.get("RM_Search_Type").setValue("");
    this.reportTypeVal = "";

    const formData = new FormData();
    formData.append("Portal", "BMS");
    formData.append("PageName", "SpPosConversion");
    formData.append("User_Id", this.api.GetUserId());
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

  //SET REPORT TYPE
  SetReportType() {
    this.reportTypeVal = "";
    this.GetAgents("0");
  }

  //===== GET AGENTS DATA =====//
  GetAgents(e) {
    this.Agents_Placeholder = "Select Agents";
    this.Agents_Ar = [];

    const formData = new FormData();

    if (this.SearchForm.get("Emp_Id").value.length == 1) {
      this.ReportTypeDisable = false;
      if (e == 1) {
        this.reportTypeVal = [{ Id: "Self", Name: "Self" }];
      }
    } else {
      this.ReportTypeDisable = true;
      this.SearchForm.get("RM_Search_Type").setValue("");
      this.reportTypeVal = "";
    }

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Portal", "BMS");
    formData.append("Agent_Type", "");
    formData.append(
      "Report_Type",
      JSON.stringify(this.SearchForm.value["RM_Search_Type"])
    );
    formData.append("RM_Ids", JSON.stringify(this.SearchForm.value["Emp_Id"]));

    this.api
      .HttpPostTypeBms("reports/SpPosConversionReport/GetAgents", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Agents_Ar = result["Data"];
            this.Agents_Placeholder =
              "Select Agents (" + this.Agents_Ar.length + ")";
          } else {
            this.Agents_Ar = [];
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

  //===== GET BRANCHES DATA =====//
  GetSubBranches() {
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.Sub_Branch_Ar = [];

    const formData = new FormData();
    formData.append("Portal", "BMS");
    formData.append("PageName", "Daily-Tracker");
    formData.append("User_Id", this.api.GetUserId());
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
  SearchBtn(Type: any) {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
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
        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
        SearchValue: fields["SearchValue"],
        FollowUpTabValue: fields["FollowupLeads"],
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
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("");
    this.SearchForm.get("RM_Search_Type").setValue("");

    this.Agents_Placeholder = "Select Agent";
    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
    this.ResetDT();
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
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        this.http;
        this.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/SpPosConversionReport/GridData?User_Id=" +
                this.api.GetUserId() +
                "&Portal=BMS"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            this.dataAr = resp.data;
            this.SQL_Where_STR = resp.SQL_Where;

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

  //===== GET USER RIGHTS =====//
  GetUserRights() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/GetUserRights?User_Id=" +
          this.api.GetUserId() +
          "&Portal=BMS"
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.UserRights = result["User_Rights"];
            if (this.UserRights.Is_Daily_Tracker_View == "Self") {
              this.GetAgents("0");
            }
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== AGENT DETAILS MODAL =====//
  ViewDetails(row_Id): void {
    const dialogRef = this.dialog.open(AgentDetailsViewComponent, {
      width: "95%",
      height: "90%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   //   console.log(result);
    });
  }
}
