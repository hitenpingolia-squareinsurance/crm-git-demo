import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { KraListComponent } from "../../../modals/goal-management/kra-list/kra-list.component";
import { RatingsUpdateLogsComponent } from "../../../modals/goal-management/ratings-update-logs/ratings-update-logs.component";
import { RatingsCriteriaMasterComponent } from "../../../modals/goal-management/ratings-criteria-master/ratings-criteria-master.component";

class ColumnsObj {
  Id: string;
  Name: string;
  Mobile: string;
  Profile_Type: string;
  NewProfile: string;
  DOJ: string;
  Status: string;
  ServiceLocation: string;
  AchievementPercent: string;
  CurrentRM: string;
  CurrentRMId: string;
  Ratings: string;
  Is_Sales: string;
  EmployeeType: string;
  Coreline: string;
  ResignStatus: string;
  RmType: string;
  AppraisalAllowed: string;
  AppraisalViewStatus: string;
  PdfUrl: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  profile_level: any;
}

@Component({
  selector: "app-ratings",
  templateUrl: "./ratings.component.html",
  styleUrls: ["./ratings.component.css"],
})
export class RatingsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  activePage: any = 0;

  total: any = 0;
  flag: any = 0;
  flagArray: any = [];
  pageStart: any = [];

  mytime: Date = new Date();

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;

  UserRights: any = [];
  ShowLoader12: string = "No";

  Year_Ar: Array<any>;
  SelectedYear: any = [];

  BusinessLine_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  ReportTypeData: Array<any>;
  ItemEmployeeSelection: any = [];
  LobData: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";
  reportTypeVal: any = [];

  SQL_Where_STR: any;
  Is_Export: any = 0;

  currentUrl: string;
  urlSegment: any;

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  FilterEmpId: any;
  FilterReportType: any;
  SelectedReportType: { Id: string; Name: string }[];
  FilterVerticalId: any = "";
  fy_selected: any = "";

  ProfileName: any;
  IsSales: any;
  IdType: string;
  EmpId: any;
  LoginProfileName: any;
  PType: any;
  LoginIsSales: any;
  Sequence: any = 0;
  PTypeD: any;

  current_fy: any;
  month_selected: string = "";
  profile_level: any = "";
  tab_sequence: any = 0;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Financial_Year: [""],
      Business_Line_Id: [""],
      Vertical_Id: [""],
      Region_Id: [""],
      Sub_Region_Id: [""],
      Emp_Id: [""],
      Report_Type: [""],
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
      allowSearchFilter: false,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit(): void {
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    this.EmpId = this.api.GetUserData("Code");
    this.IdType = "Code";

    this.SearchComponentsData();
    this.GetEmployeeExtraData();
    this.GetLoginEmployeeData();
    this.GetEmployees();

    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/CrudFunctions/SearchComponentsData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];
            this.BusinessLine_Ar = result["Data"]["Business_Line_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.current_fy = result["Data"]["current_fy"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== SET HIERARCHY TYPE =====//
  SetHierarchyType(sequence: any) {
    this.tab_sequence = sequence;
    this.displayActivePage(1, "search");
  }

  //===== GET VERTICAL DATA =====//
  GetVerticalData() {
    this.Emps_Ar = [];
    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";
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
        (result) => {
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

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.flagArray = [];
    this.total = 0;
    var fields = this.SearchForm.reset();

    this.FilterReportType = "";
    this.FilterEmpId = "";
    this.FilterVerticalId = "";
    this.EmpId = this.api.GetUserData("Code");
    this.IdType = "Code";
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];

    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("");
    this.SearchForm.get("Sub_Region_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("SearchValue").setValue("");

    this.Agents_Placeholder = "Select Agent";
    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
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
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== DISPLAY ACTIVE PAGE =====//
  displayActivePage(activePageNumber: number, btnType: any): void {
    if (btnType == "search") {
      this.flagArray = [];
    }
    this.activePage = activePageNumber;
    this.GetData();
  }

  //===== GET DATA =====//
  GetData() {
    if (typeof this.flagArray[this.activePage] === "undefined") {
      var fields = this.SearchForm.value;

      //Search Financial Year
      if (this.SearchForm.get("Financial_Year").value.length > 0) {
        this.fy_selected = fields["Financial_Year"][0]["Id"];
      } else {
        this.fy_selected = "";
      }

      //Search Vertical ID
      if (this.SearchForm.get("Vertical_Id").value.length > 0) {
        this.FilterVerticalId = fields["Vertical_Id"];
      } else {
        this.FilterVerticalId = "";
      }

      //Search Employee ID
      if (this.SearchForm.get("Emp_Id").value.length == 1) {
        this.FilterEmpId = fields["Emp_Id"][0]["Id"];
        this.EmpId = this.SearchForm.value["Emp_Id"][0]["Id"];
        this.IdType = "Id";
      } else {
        this.FilterEmpId = "";
        this.EmpId = this.api.GetUserData("Code");
        this.IdType = "Code";
      }

      //Report Type
      if (this.SearchForm.get("Report_Type").value.length == 1) {
        this.FilterReportType = fields["Report_Type"][0]["Id"];
      } else {
        this.FilterReportType = "";
      }

      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("urlSegment", this.urlSegment);
      formData.append("Portal", "CRM");
      formData.append("Page", this.activePage);
      formData.append(
        "Financial_Year",
        JSON.stringify(fields["Financial_Year"])
      );
      formData.append("Vertical_Id", JSON.stringify(fields["Vertical_Id"]));
      formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
      formData.append("Emp_Id", JSON.stringify(fields["Emp_Id"]));
      formData.append("Report_Type", JSON.stringify(fields["Report_Type"]));
      formData.append("SearchValue", fields["SearchValue"]);
      formData.append("TabSequence", this.tab_sequence);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/appraisals/Ratings/GetEmployeeData",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            // this.SQL_Where_STR = result['SQL_Where'];

            if (result["Status"] == true) {
              this.profile_level = result["profile_level"];
              this.fy_selected = result["financial_year"];

              if (this.activePage == 1) {
                this.total = result["recordsTotal"];
              }

              this.dataAr = result["data"];
              this.pageStart[this.activePage] = result["pageStart"];
              this.flagArray[this.activePage] = result["data"];

              this.GetEmployeeExtraData();
              this.GetCurrentRm();
              this.GetFinalRating();
            } else {
              this.Sub_Branch_Ar = [];
              this.GetEmployees();
            }
          },
          (err) => {}
        );
    }
  }

  //===== GET KRA ACHIEVEMENT RATING IN CHUNKS =====//
  async GetCurrentRm() {
    for (let i = 0; i < this.dataAr.length; i++) {
      var emp_id = this.dataAr[i]["Id"];

      const formData = new FormData();
      formData.append("user_code", this.api.GetUserData("Code"));
      formData.append("emp_id", emp_id);
      formData.append("financial_year", this.fy_selected);

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/appraisals/Ratings/GetCurrentRm";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.dataAr[i]["CurrentRM"] = data.CurrentRM;
          this.dataAr[i]["CurrentRMId"] = data.CurrentRMId;
        });
    }
  }

  //===== GET KRA ACHIEVEMENT RATING IN CHUNKS =====//
  async GetFinalRating() {
    for (let i = 0; i < this.dataAr.length; i++) {
      var emp_id = this.dataAr[i]["Id"];
      var employee_type = this.dataAr[i]["EmployeeType"];

      const formData = new FormData();
      formData.append("user_code", this.api.GetUserData("Code"));
      formData.append("emp_id", emp_id);
      formData.append("financial_year", this.fy_selected);
      formData.append("employee_type", employee_type);
      formData.append("url_segment", this.urlSegment);

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/appraisals/Ratings/GetFinalRating";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));
          this.dataAr[i]["Ratings"] = data.FinalRating;
          this.dataAr[i]["PdfUrl"] = data.PdfUrl;
        });
    }
  }

  //===== GET EMPLOYEES EXTRA DATA =====//
  GetEmployeeExtraData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Employee_Id", this.EmpId);
    formData.append("IdType", this.IdType);

    this.api
      .HttpPostTypeBms(
        "/goal-management-system/CrudFunctions/GetEmployeeExtraData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.ProfileName = result["ProfileName"];
            this.IsSales = result["IsSales"];
            this.PTypeD = result["PType"];
          } else {
            this.ProfileName = "";
            this.IsSales = 0;
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

  //===== GET LOGIN EMPLOYEE DATA =====//
  GetLoginEmployeeData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("IdType", "Code");
    formData.append("UrlSegment", "Employee-Targets");

    this.api
      .HttpPostTypeBms(
        "goal-management-system/appraisals/Ratings/GetLoginEmployeeData",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            //   //   //   console.log(result);
            this.LoginProfileName = result["ProfileName"];
            this.LoginIsSales = result["IsSales"];
            this.Sequence = result["Sequence"];
            this.PType = result["PType"];
          } else {
            this.ProfileName = "";
            this.IsSales = 0;
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

  //===== KRA RATING DETAILS =====//
  KraRatingList(
    emp_id: any,
    profile: any,
    is_sales: any,
    employee_type: any,
    coreline: any,
    rm_type: any,
    index: any,
    current_rm: any
  ): void {
    const dialogRef = this.dialog.open(KraListComponent, {
      width: "80%",
      height: "75%",
      disableClose: true,
      data: {
        emp_id: emp_id,
        profile: profile,
        is_sales: is_sales,
        employee_type: employee_type,
        coreline: coreline,
        financial_year: this.fy_selected,
        profile_level: this.profile_level,
        rm_type: rm_type,
        current_rm: current_rm,
        url_segment: this.urlSegment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.GetSingleCurrentRm(index);
      this.GetSingleFinalRating(index);
    });
  }

  //===== GET KRA ACHIEVEMENT RATING IN CHUNKS =====//
  async GetSingleCurrentRm(i: any) {
    var emp_id = this.dataAr[i]["Id"];

    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("emp_id", emp_id);
    formData.append("financial_year", this.fy_selected);

    var url =
      environment.apiUrlBmsBase +
      "/goal-management-system/appraisals/Ratings/GetCurrentRm";

    await this.http
      .post<any>(
        this.api.additionParmsEnc(url),
        this.api.enc_FormData(formData),
        this.api.getHeader(environment.apiUrlBmsBase)
      )
      .toPromise()
      .then((res: any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        this.dataAr[i]["CurrentRM"] = data.CurrentRM;
        this.dataAr[i]["CurrentRMId"] = data.CurrentRMId;
      });
  }

  //===== GET KRA ACHIEVEMENT RATING IN CHUNKS =====//
  async GetSingleFinalRating(i: any) {
    var emp_id = this.dataAr[i]["Id"];
    var employee_type = this.dataAr[i]["EmployeeType"];

    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));
    formData.append("emp_id", emp_id);
    formData.append("financial_year", this.fy_selected);
    formData.append("employee_type", employee_type);

    var url =
      environment.apiUrlBmsBase +
      "/goal-management-system/appraisals/Ratings/GetFinalRating";

    await this.http
      .post<any>(
        this.api.additionParmsEnc(url),
        this.api.enc_FormData(formData),
        this.api.getHeader(environment.apiUrlBmsBase)
      )
      .toPromise()
      .then((res: any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        this.dataAr[i]["Ratings"] = data.FinalRating;
      });
  }

  //===== KRA RATING UPDATE TRACK DETAILS =====//
  RatingUpdateLog(emp_id: any, is_sales: any, employee_type: any): void {
    const dialogRef = this.dialog.open(RatingsUpdateLogsComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
      data: {
        emp_id: emp_id,
        is_sales: is_sales,
        financial_year: this.fy_selected,
        url_segment: this.urlSegment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== RATING CRITERIA MASTER DETAILS =====//
  RatingCriteriaMaster(): void {
    const dialogRef = this.dialog.open(RatingsCriteriaMasterComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { financial_year: this.fy_selected },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== DOWNLOAD APPRAISAL LETTER =====//
  ViewAppraisalLetter(url: any) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
