import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  NgZone,
} from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import { timer } from "rxjs";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import $ from "jquery";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ExpenseTypeMasterComponent } from "../../../modals/goal-management/expenses/expense-type-master/expense-type-master.component";
import { UploadExpenseExcelComponent } from "../../../modals/goal-management/expenses/upload-expense-excel/upload-expense-excel.component";
import { AddExtraExpensesComponent } from "../../../modals/goal-management/expenses/add-extra-expenses/add-extra-expenses.component";
import { EmployeeExpenseDetailsComponent } from "../../../modals/goal-management/expenses/employee-expense-details/employee-expense-details.component";

class ColumnsObj {
  Id: string;
  Name: string;
  Mobile: string;
  Profile_Type: string;
  NewProfile: string;
  DOJ: string;
  Status: string;
  Branch: string;
  ResignStatus: string;
  Rm_Name: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  FilterData: any[];
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  SQL_Where1: any;
  CircleValue: any;
  AllAgentId: any;
}

@Component({
  selector: "app-manage-expenses",
  templateUrl: "./manage-expenses.component.html",
  styleUrls: ["./manage-expenses.component.css"],
})
export class ManageExpensesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("scroller", { static: false }) scroller: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  UserRights: any = [];
  AddProspectCallBtn = "No";
  InteractionPurposeVal: any = "";
  FunctionName: any = "GetRMReportData";

  SQL_Where_STR: any;
  SqlWhere: any;
  Is_Export: any = 0;
  AllAgentId: any = "";

  MessageBody: string = "";
  lobList: string = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  currentUrl: string;
  urlSegment: any;

  totalRecordsfiltered: number;
  TotalRow: number;
  filterData: string;
  dataArNested: any;
  NestedPagesList: any;
  loading = false;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;

  show_spinner: any = "yes";
  re_hit: any = "yes";

  SearchForm: FormGroup;
  isSubmitted = false;
  ReportTypeDisable = true;

  ShowLoader12: string = "No";

  Year_Ar: Array<any>;
  SelectedYear: any = [];

  BusinessLine_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  ReportTypeData: Array<any>;
  ItemEmployeeSelection: any = [];
  LobData: any = [];

  Employee_Placeholder: any = "Select Employee";

  reportTypeVal: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  FilterEmpId: any;
  FilterReportType: any;
  SelectedReportType: { Id: string; Name: string }[];
  FilterVerticalId: any = "";
  fy_selected: any = "";
  current_fy: any;
  MonthArray: any;
  SelectedCurrentMonth: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {
    this.SearchForm = this.fb.group({
      Financial_Year: [""],
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
    this.SearchComponentsData();
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];

    this.GetUserRights();
    this.pageNo = 1;
    this.Get();
  }

  ngAfterViewInit(): void {
    this.post = [];
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
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];
            this.BusinessLine_Ar = result["Data"]["Business_Line_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.current_fy = result["Data"]["current_fy"];

            this.GetEmployees();
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
  SearchData() {
    this.filterData = JSON.stringify(event);
    this.post = [];
    this.pageNo = 1;

    this.Get();
    this.Is_Export = 0;
    this.dataAr = [];
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.post = [];
    this.pageNo = 1;
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    this.re_hit = "no";
    this.show_spinner = "yes";
    var fields = this.SearchForm.value;

    const formData = new FormData();
    formData.append("urlSegment", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Portal", "CRM");
    formData.append("Page", this.pageNo);

    formData.append("Financial_Year", JSON.stringify(fields["Financial_Year"]));
    formData.append("Vertical_Id", JSON.stringify(fields["Vertical_Id"]));
    formData.append("Region_Id", JSON.stringify(fields["Region_Id"]));
    formData.append("Emp_Id", JSON.stringify(fields["Emp_Id"]));
    formData.append("Report_Type", JSON.stringify(fields["Report_Type"]));
    formData.append("SearchValue", fields["SearchValue"]);

    if (this.pageNo == 1) {
      this.api.IsLoading();
    }

    this.api
      .HttpPostTypeBms(
        "goal-management-system/expenses/ExpenseManagement/GetEmployeeData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          this.re_hit = "yes";
          this.show_spinner = "no";

          if (result["Status"] == true) {
            this.SqlWhere = result["SQL_Where"];

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
          }

          if (result["Status"] == false) {
            this.show_spinner = "no";
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

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    var Value = this.SearchForm.value["Financial_Year"];
    var fy = "";
    if (Value.length == 1) {
      fy = this.SearchForm.value["Financial_Year"][0]["Id"];
    }

    for (let i = 0; i < this.dataAr.length; i++) {
      var Agent_Id = this.dataAr[i]["Id"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("agent_id", Agent_Id);
      formData.append("portal", "CRM");
      formData.append("Financial_Year", fy);

      var url =
        environment.apiUrlBmsBase +
        "/dsr/DsrBusinessCalculation/GetBusinessData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          ////   //   console.log(data.Agent_Id);
          this.dataAr[i]["FTYLFY"] = data.lfy_till_total;
          this.dataAr[i]["FTYLFY_STR"] = data.lfy_till_total_str;

          this.dataAr[i]["FTYCFY"] = data.cfy_till_total;
          this.dataAr[i]["FTYCFY_STR"] = data.cfy_till_total_str;

          this.dataAr[i]["FTY"] = data.lfy_total_sum;
          this.dataAr[i]["FTY_STR"] = data.lfy_total_sum_str;

          this.dataAr[i]["GrowthRate"] = data.overall_growth_rate;
          this.dataAr[i]["CheckNumber"] = data.overall_growth_int;
        });
    }
  }

  //===== GET USER RIGHTS =====//
  GetUserRights() {
    this.api
      .CallBms(
        "daily-tracking-circle/AllClubReport/GetUserRights?User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM"
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.UserRights = result["User_Rights"];
            if (this.UserRights.Is_RM_Tracking_Report_View == "Self") {
            }
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== ADD EXPENSE TYPE MASTER =====//
  AddExpenseType(): void {
    const dialogRef = this.dialog.open(ExpenseTypeMasterComponent, {
      width: "40%",
      height: "40%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== UPLOAD EXPENSE EXCEL =====//
  UploadExpenseExcel(): void {
    const dialogRef = this.dialog.open(UploadExpenseExcelComponent, {
      width: "40%",
      height: "40%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== ADD EXTRA EXPENSES =====//
  AddExtraExpenses(): void {
    const dialogRef = this.dialog.open(AddExtraExpensesComponent, {
      width: "55%",
      height: "70%",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  //===== GET EMPLOYEE EXPENSE DETAILS =====//
  GetExpenseDetails(emp_id: any, emp_name: any): void {
    const dialogRef = this.dialog.open(EmployeeExpenseDetailsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { emp_id: emp_id, emp_name: emp_name },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
