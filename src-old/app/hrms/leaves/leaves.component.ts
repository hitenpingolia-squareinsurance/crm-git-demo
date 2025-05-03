import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ApplyLeaveComponent } from "./apply-leave/apply-leave.component";

class ColumnsObj {
  Sno: string;
  EmployeeName: string;
  RequestedDate: string;
  StartDate:string;
  EndDate:string;
  Days:string;
  Status:string;
  Approver:string;
  Notes:string;
  Action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  summary: any;
}

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) datatableElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
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

  LeaveSummary:any;
  Select_Multi_Month: any = 'No';
  IdType: string;
  EmpId: any;
  MonthArray: any = []
  Year_Ar: Array<any>;
  SelectedYear: any = [];
  Name: any = '';
  CurrentMonth: any = '';
  ReportTypeData: Array<any>;
  SelectedReportType: { Id: string; Name: string; }[];
  ShowDashboardLoader: string = 'No';
  fy_selected: any = '';
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
      Financial_Year: [''],
      Report_Type: [''],
      Month_Name: [''],
      SearchValue: [''],
    });
    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true
    };
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
 
    this.EmpId = this.api.GetUserData('Code');
    this.IdType = 'Code';
    this.SearchComponentsData();

    this.SelectedReportType = [{ Id: "Self", Name: "Self" }];

    //Month Related Filter Values
    const d = new Date();
    this.CurrentMonth = d.getMonth();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //Month String Value
    this.Name = month[d.getMonth()];

    //Month Numeric Value
    this.CurrentMonth = +this.CurrentMonth + +1;
    if (this.CurrentMonth < 10) {
      this.CurrentMonth = '0' + this.CurrentMonth;
    }

    this.Get();

  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('PageName', this.urlSegment);
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.IsLoading();
    this.api.HttpPostType('hrms/AttendanceManagement/SearchComponentsData', formData).then((result) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.Year_Ar = result['Data']['YearsArray'];
        this.SelectedYear = result['Data']['CurrentYear'];
        this.MonthArray = result['Data']['MonthArray'];
        this.SelectedCurrentMonth = result['Data']['SelectedCurrentMonth'];
        this.ReportTypeData = result['Data']['ReportTypeArray'];
      }

    }, (err) => {
      this.api.HideLoading();
    });

  }
 
  //===== FETCH ALL SURVEY REQUEST DATA =====//
  Get() {
    this.api.IsLoading();
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
            this.api.additionParmsEnc(environment.apiUrl +
            "/hrms/AttendanceManagement/list_leave_requests?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code") +
            "&url=" +
            this.currentUrl +
            "&Action=" +
            this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.LeaveSummary = resp.summary;
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



  //===== FILTER DATA =====//
  SearchBtn() {
    var fields = this.SearchForm.value;

    //Search Financial Year
    if (this.SearchForm.get("Financial_Year").value.length > 0) {
      this.fy_selected = fields['Financial_Year'][0]['Id'];
    } else {
      this.fy_selected = '';
    }

    //Report Type
    if (this.SearchForm.get("Report_Type").value.length == 1) {
      this.FilterReportType = fields['Report_Type'][0]['Id'];
    } else {
      this.FilterReportType = '';
    }

    var query = {
      urlSegment: this.urlSegment,
      Financial_Year: fields['Financial_Year'],
      Report_Type: fields['Report_Type'],
      Month_Name: fields['Month_Name'],
      SearchValue: fields['SearchValue'],
    }

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
    });

  }
  

  //===== CLEAR FILTER =====//
  ClearSearch() {

    this.SearchForm.reset();
    this.FilterReportType = "";
    this.SelectedReportType = [{ Id: "Self", Name: "Self" }];
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];
    this.dataAr = [];

    this.SearchForm.get("SearchValue").setValue("");
    this.SearchComponentsData();
    this.dataAr = [];
    this.Get();

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search('').draw();
    });

  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ApplyLeave(type:string,Id:string) {
    const dialogRef = this.dialog.open(ApplyLeaveComponent, {
      width: "60%",
      height: "80%",
      disableClose: true,
      data: { type:type,id: Id},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }


  // leaveRequestChangeStatus(LeaveRequestId, Status, LeaveRequestUserId) {
  //   const formData = new FormData();
  //   formData.append("Leave_Request_User_Id", LeaveRequestUserId);
  //   formData.append("Status", Status);
  //   formData.append("Id", LeaveRequestId);

  //   let confirmationMessage;

  //   // Set confirmation message based on the Status
  //   if (Status === "Approved") {
  //       confirmationMessage = "Are you sure you want to approve this leave request?";
  //   } else if (Status === "Rejected") {
  //       confirmationMessage = "Are you sure you want to reject this leave request?";
  //   } else {
  //       // You can add more status conditions here if needed
  //       confirmationMessage = "Are you sure you want to proceed with this request?";
  //   }

  //   let Confirms = confirm(confirmationMessage);
  //   if (Confirms === true) {
  //       this.api.IsLoading();
  //       this.api.HttpPostType("hrms/AttendanceManagement/leave_request_approved", formData).then(
  //           (result) => {
  //               this.api.HideLoading();
  //               if (result["status"] == 'success') {
  //                 this.Reload();
  //                   this.api.Toast("Success", result["message"]);
  //               } else {
  //                   this.api.Toast("Warning", result["message"]);
  //               }

  //           },
  //           (err) => {
  //               this.api.HideLoading();
  //               this.api.Toast(
  //                   "Warning",
  //                   "Network Error: " + err.name + " (" + err.statusText + ")"
  //               );
  //           }
  //       );
  //   }
  // }

  leaveRequestChangeStatus(LeaveRequestId: number, Status: string, LeaveRequestUserId: number) {
    let statusText = Status.toLowerCase(); // Store lowercase status
    let confirmationMessage = `Are you sure you want to ${statusText} this leave request?`;

    // Show confirmation box
    if (confirm(confirmationMessage)) {
        let actionReason = ""; // Initialize reason

        // If status is NOT "Cancelled", ask for a reason
        if (Status !== "Cancelled") {
            let userInput = prompt(`Please enter the reason for ${statusText} the leave request:`);
            actionReason = userInput ? userInput.trim() : "";

            // If the reason is empty, stop execution
            if (!actionReason) {
                alert("Action reason is required!");
                return;
            }
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("Leave_Request_User_Id", LeaveRequestUserId.toString());
        formData.append("Status", Status);
        formData.append("Id", LeaveRequestId.toString());

        // Only append reason if it's not Cancelled
        if (Status !== "Cancelled") {
            formData.append("Action_Reason", actionReason);
        }

        // Call API
        this.api.IsLoading();
        this.api.HttpPostType("hrms/AttendanceManagement/leave_request_approved", formData).then(
            (result) => {
                this.api.HideLoading();
                if (result["status"] === 'success') {
                    this.Reload();
                    this.api.Toast("Success", result["message"]);
                } else {
                    this.api.Toast("Warning", result["message"]);
                }
            },
            (err) => {
                this.api.HideLoading();
                this.api.Toast(
                    "Warning",
                    "Network Error: " + err.name + " (" + err.statusText + ")"
                );
            }
        );
    }
  }




}
