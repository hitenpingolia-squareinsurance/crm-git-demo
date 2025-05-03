import { HostListener, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UpdateProjectionTargetComponent } from "../../modals/projection-target/update-projection-target/update-projection-target.component";
import { ProjectionTargetLogComponent } from "../../modals/projection-target/projection-target-log/projection-target-log.component";
import { DownloadProjectionReportsComponent } from "../../modals/projection-target/download-projection-reports/download-projection-reports.component";
import { DownloadingViewComponent } from "../../modals/downloading-view/downloading-view.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Name: string;
  Mobile: string;
  ProfileName: string;
  ActualProfile: string;
  ResignStatus: string;
  Status: string;
  IsSales: string;
  SelfTarget: string;
  TeamTarget: string;
  SelfBusiness: string;
  TeamBusiness: string;
  SelfAchivementPercent: string;
  TeamAchivementPercent: string;
  ShowTeamData: string;
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
  selector: "app-projection-target-list",
  templateUrl: "./projection-target-list.component.html",
  styleUrls: ["./projection-target-list.component.css"],
})
export class ProjectionTargetListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};

  SearchForm: FormGroup;
  isSubmitted = false;

  UserRights: any = [];

  BusinessLine_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  ReportTypeData: Array<any>;
  SelectedReportType: { Id: string; Name: string }[];

  StatusData: Array<any>;
  Selected_StatusData: { Id: string; Name: string }[];

  Employee_Placeholder: any = "Select Employee";
  LoginProfileName: any = "";

  SQL_Where_STR: any;
  IsUpdate: any = "No";
  urlSegment: any = "projection-targets";

  dropdownSettingsmultiselect: {};
  dropdownSettingsmultiselect1: {};
  dropdownSettingsingleselect: {};
  dropdownSettingsingleselect1: {};
  SelfTarget: any = 0;
  TeamTarget: any = 0;
  SelfBusiness: any = 0;
  TeamBusiness: any = 0;
  SelfAchivementPercent: any = 0;
  TeamAchivementPercent: any = 0;
  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Business_Line_Id: [""],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      Status: [""],
      Report_Type: [""],
      SearchValue: [""],
    });

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
      allowSearchFilter: false,
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
      allowSearchFilter: false,
    };
  }

  ngOnInit(): void {
    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];

    this.StatusData = [
      { Id: "Active", Name: "Active" },
      { Id: "In-Active", Name: "In-Active" },
      { Id: "Resigned", Name: "Resigned" },
    ];
    this.Selected_StatusData = [{ Id: "Active", Name: "Active" }];

    this.SearchComponentsData();
    this.GetEmployees();
    this.CheckUpdateAvailability();
    this.GetLoginEmployeeData();
    this.Get();
    this.GetDashboardData();
  }

  //===== GET VALIDATION FROM CONTROLS =====//
  get formControls() {
    return this.SearchForm.controls;
  }

  //===== CHECK TARGET UPDATE AVAILABILITY =====//
  CheckUpdateAvailability() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api
      .HttpPostTypeBms(
        "projection-target/ProjectionTarget/CheckUpdateAvailability",
        formData
      )
      .then(
        (result:any) => {
          if (result["Status"] == true) {
            this.IsUpdate = result["IsUpdate"];
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

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/SearchComponentsData",
        formData
      )
      .then(
        (result:any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.BusinessLine_Ar = result["Data"]["Business_Line_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET VERTICAL DATA =====//
  GetVerticalData() {
    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.SearchForm.get("Emp_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Business_Line_Id",
      JSON.stringify(this.SearchForm.value["Business_Line_Id"])
    );

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetVerticalData",
        formData
      )
      .then(
        (result:any) => {
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.SearchForm.get("Vertical_Id").setValue("");
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

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    this.SearchForm.get("Emp_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
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
        "/goal-management-system/CrudFunctions/GetEmployees",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Emps_Ar = result["Data"];
            this.Employee_Placeholder =
              "Select Employee (" + this.Emps_Ar.length + ")";
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
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
        Business_Line: fields["Business_Line_Id"],
        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Emp_Id: fields["Emp_Id"],
        Report_Type: fields["Report_Type"],
        SearchValue: fields["SearchValue"],
        Status: fields["Status"],
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
    this.SearchForm.get("Business_Line_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue(null);

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
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/projection-target/ProjectionTarget/GridData?User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            console.log(resp);
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.SQL_Where;
            that.GetDataInChanks();

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      // columnDefs: [
      //   {
      //     targets: [0, 1, 2, 3, 4, 5, 6], // column index (start from 0)
      //     orderable: false, // set orderable false for selected columns
      //   },
      // ],
    };
  }

  //===== GET DATA IN CHUNKS =====//
  async GetDataInChanks() {
    for (let i = 0; i < this.dataAr.length; i++) {
      var Employee_Id = this.dataAr[i]["Id"];

      const formData = new FormData();
      formData.append("Employee_Id", Employee_Id);
      formData.append("Portal", "CRM");
      formData.append("Type", "TableData");
      formData.append("InsertDate", "");

      var url =
        environment.apiUrlBmsBase +
        "/projection-target/ProjectionTarget/GetDataInChanks";

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
          this.dataAr[i]["SelfTarget"] = data.SelfTarget;
          this.dataAr[i]["TeamTarget"] = data.TeamTarget;
          this.dataAr[i]["SelfBusiness"] = data.SelfBusiness;
          this.dataAr[i]["TeamBusiness"] = data.TeamBusiness;
          this.dataAr[i]["SelfAchivementPercent"] = data.SelfAchivementPercent;
          this.dataAr[i]["TeamAchivementPercent"] = data.TeamAchivementPercent;
        });
    }
  }
  //===== GET DASHBOARD DATA =====//
  GetDashboardData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("Employee_Id", this.api.GetUserData("Code"));
    formData.append("Type", "DashboardData");

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "/projection-target/ProjectionTarget/GetDataInChanks",
        formData
      )
      .then(
        (result:any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.SelfTarget = result["SelfTarget"];
            this.TeamTarget = result["TeamTarget"];
            this.SelfBusiness = result["SelfBusiness"];
            this.TeamBusiness = result["TeamBusiness"];
            this.SelfAchivementPercent = result["SelfAchivementPercent"];
            this.TeamAchivementPercent = result["TeamAchivementPercent"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET LOGIN EMPLOYEE DATA =====//
  GetLoginEmployeeData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("IdType", "Code");
    formData.append("UrlSegment", "Employee-Targets");

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetLoginEmployeeData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.LoginProfileName = result["ProfileName"];
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

  //===== SHARE DOCS UPLAOD LINK MODAL =====//
  UpdateProjectionTarget(): void {
    const dialogRef = this.dialog.open(UpdateProjectionTargetComponent, {
      width: "30%",
      height: "48%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.Is_Refresh == "Yes") {
        this.CheckUpdateAvailability();
        this.Reload();
        this.GetDashboardData();
      }
    });
  }

  //===== SHARE DOCS UPLAOD LINK MODAL =====//
  ViewTargetTrack(Employee_Id: any, ProfileName: any): void {
    const dialogRef = this.dialog.open(ProjectionTargetLogComponent, {
      width: "60%",
      height: "90%",
      disableClose: true,
      data: { Employee_Id: Employee_Id, ProfileName: ProfileName },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  //===== DOWNLOAD REPORT MODAL =====//
  DownloadReport(): void {
    const dialogRef = this.dialog.open(DownloadProjectionReportsComponent, {
      width: "35%",
      height: "30%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
