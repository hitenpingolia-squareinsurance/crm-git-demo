import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Subscription } from "rxjs";

class ColumnsObj {
  Sno: string;
  EmployeeName: string;
  Date: string;
  InTime: string;
  OutTime: string;
  WorkingTime: string;
  BreakTime: string;
  ExtraTime: string; 
  OfficeHours: string;
  type: string;
  remark:string;
  ReportingManagerName: string;
  ReportingManagerOfManagerName: string;
  // Status: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  summary: any;
}
@Component({
  selector: "app-team-inout",
  templateUrl: "./team-inout.component.html",
  styleUrls: ["./team-inout.component.css"],
})
export class TeamInoutComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  InOutSummary: any;
  ActivePage: string = "Default";

  SearchForm: FormGroup;
  ActionType: any = "";
  isSubmitted = false;

  currentUrl: string;
  urlSegment: string;
  urlSegmentRoot: string;
  urlSegmentSub: string;

  pageNo: any = 1;
  Action: string;

  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  attendanceSubscription: Subscription;

  Select_Multi_Month: any = "No";
  IdType: string;
  EmpId: any;
  MonthArray: any = [];
  Year_Ar: Array<any>;
  SelectedYear: any = [];
  Name: any = "";
  CurrentMonth: any = "";
  ReportTypeData: Array<any>;
  SelectedReportType: { Id: string; Name: string }[];
  ShowDashboardLoader: string = "No";
  Dashboard_Data_Status: string = "No";
  fy_selected: any = "";
  FilterReportType: any;
  SelectedCurrentMonth: any = [];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.formBuilder.group({
      Financial_Year: [""],
      Report_Type: [""],
      Month_Name: [""],
      SearchValue: [""],
    });
    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true,
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

    this.api.attendanceMarked$.subscribe((status) => {
      // console.log("status----",status);
      if (status) {
        this.Reload();
      }
    });
  }

  ngOnInit() {
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

    this.EmpId = this.api.GetUserData("Code");
    this.IdType = "Code";
    this.SearchComponentsData();

    this.SelectedReportType = [{ Id: "Self", Name: "Self" }];

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
    if (this.CurrentMonth < 10) {
      this.CurrentMonth = "0" + this.CurrentMonth;
    }

    this.fetchAllEmployeeInOutData();
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.attendanceSubscription) {
      this.attendanceSubscription.unsubscribe();
    }
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", this.urlSegment);
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostType("/hrms/AttendanceManagement/SearchComponentsData", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];
            ////   //   console.log("SelectedYear",this.SelectedYear)
            this.MonthArray = result["Data"]["MonthArray"];
            this.SelectedCurrentMonth = result["Data"]["SelectedCurrentMonth"];
            this.ReportTypeData = result["Data"]["ReportTypeArray"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  fetchAllEmployeeInOutData() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/hrms/AttendanceManagement/get_attendance_list?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.InOutSummary = resp.summary;
            //   //   //   console.log("that.InOutSummary",that.InOutSummary);
            if (that.dataAr.length > 0) {
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    this.Dashboard_Data_Status = "Load";
    var fields = this.SearchForm.value;

    //Search Financial Year
    if (this.SearchForm.get("Financial_Year").value.length > 0) {
      this.fy_selected = fields["Financial_Year"][0]["Id"];
    } else {
      this.fy_selected = "";
    }

    //Report Type
    if (this.SearchForm.get("Report_Type").value.length == 1) {
      this.FilterReportType = fields["Report_Type"][0]["Id"];
    } else {
      this.FilterReportType = "";
    }

    var query = {
      urlSegment: this.urlSegment,
      Financial_Year: fields["Financial_Year"],
      Report_Type: fields["Report_Type"],
      Month_Name: fields["Month_Name"],
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

  //===== CLEAR FILTER =====//
  ClearSearch() {
    this.Dashboard_Data_Status = "No";
    var fields = this.SearchForm.reset();

    this.FilterReportType = "";
    this.SelectedReportType = [{ Id: "Self", Name: "Self" }];
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];

    this.SearchForm.get("SearchValue").setValue("");
    this.SearchComponentsData();
    this.dataAr = [];
    this.ResetDT();
    this.fetchAllEmployeeInOutData();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  formatTimeToAMPM(timeString: string): string {
    // Check for null or empty string and return blank
    if (!timeString || timeString.trim() === "") return "";

    const [hours, minutes] = timeString.split(":").map(Number);

    // Handle cases where hours or minutes are NaN
    if (isNaN(hours) || isNaN(minutes)) return "";

    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const ampm = isPM ? "PM" : "AM";

    return `${formattedHours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
  }

  formatWorkingTime(workingTime: string): string {
    // If the working time is exactly "00:00:00"
    if (workingTime === "00:00:00") {
      return "0 minutes"; // or any other message you prefer
    }

    // Split the time string into hours, minutes, and seconds
    const timeParts = workingTime.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    // Determine the formatted output
    if (hours > 0) {
      return minutes > 0
        ? `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
            minutes > 1 ? "s" : ""
          }`
        : `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return minutes > 0
        ? `${minutes} minute${minutes > 1 ? "s" : ""}`
        : "0 minutes"; // This case should not occur since we handle "00:00:00" above
    }
  }

  openLocationInGoogleMaps(latitude: number | null, longitude: number | null): void {
    if (!latitude || !longitude) {
      this.api.Toast("Warning", "Location tracking was not enabled for this entry as the time was auto system-generated");
      return;
    }
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  }

}
