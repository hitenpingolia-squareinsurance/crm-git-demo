import { HostListener, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../../app/providers/api.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import { DownloadingViewComponent } from "../../../app/modals/downloading-view/downloading-view.component";
import { AgentDetailsViewComponent } from "../../../app/modals/agent-details-view/agent-details-view.component";
import { MergeCodeComponent } from "../../../app/modals/merge-code/merge-code.component";
import { AgentStatusActionComponent } from "../../../app/modals/agent-status-action/agent-status-action.component";
import { FranchiseRightsComponent } from "../../../app/modals/franchise-rights/franchise-rights.component";
import { AgentOrcComponent } from "../../../app/modals/agent-orc/agent-orc.component";
import { GemsDetailsViewComponent } from "../../../app/modals/gems-details-view/gems-details-view.component";
import { AddprimerequestpopupComponent } from "../../../app/modals/addprimerequestpopup/addprimerequestpopup.component";
import { PoPriorityLogsComponent } from "../../../app/modals/po-priority-logs/po-priority-logs.component";
import { AgreementActiveInactiveComponent } from "../../../app/modals/agreement-active-inactive/agreement-active-inactive.component";

class ColumnsObj {
  Id: string;
  Emp_Id: string;
  Password: string;
  Type: string;
  Name: string;
  Email: string;
  Mobile: string;
  RM_Name: string;
  Status: string;
  Update_Stamp: string;

  POP_Status: any;
  isSelected: any;
  ShowLogs: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  PosCountCondition: any;
}

@Component({
  selector: "app-agent-report",
  templateUrl: "./agent-report.component.html",
  styleUrls: ["./agent-report.component.css"],
})
export class AgentReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dropdownSettings: any = {};

  SearchForm: FormGroup;
  SearchForm1: FormGroup;
  SearchForm2: FormGroup;

  isSubmitted = false;
  isSubmitted1 = false;
  isSubmitted2 = false;

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;

  Employee_Placeholder: any = "Select Employee";

  SQL_Where_STR: any;
  Is_Export: any = 0;

  messagebody: any;

  Priroity_1: number = 0;
  Priroity_2: number = 0;
  Priroity_3: number = 0;

  checkAll: number = 0;
  checkedList: any = [];
  masterSelected: boolean;

  AgentStatus_Ar: Array<any>;
  SelectedAgentType_Ar: Array<any>;
  Priority_Ar: Array<any>;
  ActionType_Ar: Array<any>;

  dropdownSettingsSingleselect: any = {};
  dropdownSettingsSingleselect1: any = {};

  PosCountCondition: any = "";

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],

      AgentType: ["0"],
      RM_Search_Type: ["0"],
      AgentStatus: ["0"],
      DateOrDateRange: [""],
      AgentPoStatus: [""],
    });

    this.SearchForm1 = this.fb.group({
      GlobalSearch: ["", [Validators.required]],
    });

    this.SearchForm2 = this.fb.group({
      ActionType: ["", Validators.required],
      priroity: [""],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsSingleselect = {
      singleSelection: true,
      idField: "id",
      textField: "text",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsSingleselect1 = {
      singleSelection: true,
      idField: "id",
      textField: "text",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  @HostListener("contextmenu", ["$event"]) blockcontextmenu(e: KeyboardEvent) {
    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");
    if (IsCutCopyPaste == "0") {
      e.preventDefault();
    }
  }

  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    ////   //   console.log(event);
    ////   //   console.log(event.keyCode);

    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");

    if (IsCutCopyPaste == "0") {
      // Prevent F12 -
      if (event.keyCode == 123) {
        return false;
      }
      // Prevent Ctrl+a = disable select all
      // Prevent Ctrl+u = disable view page source
      // Prevent Ctrl+s = disable save
      // Prevent Ctrl+c = disable copy
      // Prevent Ctrl+v = disable paste
      else if (
        event.ctrlKey &&
        (event.keyCode === 85 ||
          event.keyCode === 83 ||
          event.keyCode === 65 ||
          event.keyCode === 44 ||
          event.keyCode === 80 ||
          event.keyCode === 67 ||
          event.keyCode === 86)
      ) {
        return false;
      }
      // Prevent Ctrl+Shift+I = disabled debugger console using keys open
      else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        return false;
      } else {
        //event.preventDefault();
      }
    }
  }

  get FC1() {
    return this.SearchForm1.controls;
  }
  get formControls2() {
    return this.SearchForm2.controls;
  }

  ngOnInit(): void {
    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");
    if (IsCutCopyPaste == "0") {
      this.Is_CutCopyPasteCls = "Is_CutCopyPasteCls";
    }

    this.SearchComponentsData();
    this.GetUserRights();
    this.Get();
    this.GetPorirityData();
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "reports/AgentReport/SearchComponentsData?User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.AgentStatus_Ar = result["Data"]["AgentStatusArray"];
            this.Priority_Ar = result["Data"]["PriorityArray"];
            this.ActionType_Ar = result["Data"]["ActionTypeArray"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            //this.Companies_Ar = result['Data']['Ins_Compaines'];
            //this.Products_Ar = result['Data']['Products_Ar'];
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

  AgreementGenerate(
    row_Id: any,
    row_rm_Id: any,
    AgreementId: any,
    type: any
  ): void {
    if (type == "Upload") {
      const dialogRef = this.dialog.open(AgreementActiveInactiveComponent, {
        width: "30%",
        height: "40%",
        disableClose: true,
        data: {
          Id: row_Id,
          RMID: row_rm_Id,
          message: "",
          Agreement_Id: AgreementId,
          popupType: type,
          Is_Accounts: this.UserRights.Is_Accounts,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        //   //   console.log(result);
        this.Reload();
      });
    } else {
      this.api.IsLoading();
      this.api.CallBms("../v2/reports/Agreement/MailBody?Id=" + row_Id).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.messagebody = result["data"];

            const dialogConfig = new MatDialogConfig();
            //   //   console.log(dialogConfig);

            dialogConfig.disableClose = true;
            //dialogConfig.autoFocus = false;
            dialogConfig.maxWidth = "94vw";
            dialogConfig.width = "94%";
            dialogConfig.height = "90%";

            dialogConfig.position = {
              top: "3%",
              left: "3%",
            };

            dialogConfig.data = {
              Id: row_Id,
              RMID: row_rm_Id,
              message: this.messagebody,
              Agreement_Id: AgreementId,
              popupType: type,
              Is_Accounts: this.UserRights.Is_Accounts,
            };

            this.Is_Export = 0;

            const dialogRef = this.dialog.open(
              AgreementActiveInactiveComponent,
              dialogConfig
            );

            dialogRef.afterClosed().subscribe((result) => {
              //   //   console.log(result);
              this.Reload();
            });

            // console.log(this.messagebody);
          } else {
            //this.api.ErrorMsg(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          //this.api.ErrorMsg(err.message);
        }
      );
    }
  }

  DownloadAgreement(url: any) {
    window.open(url, "", "fullscreen=yes");
  }

  GetEmployees() {
    this.Emps_Ar = [];
    //this.Agents_Ar=[];

    this.SearchForm.get("Emp_Id").setValue(null);
    //this.SearchForm.get('Agent_Id').setValue(null);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);

    this.api.HttpPostTypeBms("reports/AgentReport/GetEmployees", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
          this.Employee_Placeholder =
            "Select Employee (" + this.Emps_Ar.length + ")";
          //this.Agents_Placeholder = 'Select Agent';
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  GetSubBranches(e) {
    this.GetEmployees();

    this.SearchForm.get("Sub_Region_Id").setValue("0");

    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .CallBms(
        "reports/AdminSrReport/GetSubBranches?Branch_Id=" +
          Branch_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Sub_Branch_Ar = result["Data"];
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

  SearchBtn(FilterType: any) {
    var RM_Id_value, Franchisee_Id_value, ToDate, FromDate, DateOrDateRange;

    var GlobalSearch = "";
    var AgentPoStatus = "";

    var fields = this.SearchForm.value;
    var fields1 = this.SearchForm1.value;

    if (FilterType == "1") {
      this.isSubmitted1 = true;
      if (this.SearchForm1.invalid) {
        return;
      }
    } else {
      this.isSubmitted = true;
      if (this.SearchForm.invalid) {
        return;
      }
    }

    GlobalSearch = fields1["GlobalSearch"];
    DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    //   //   console.log(RM_Id_value);
    //   //   console.log(Franchisee_Id_value);

    if (fields["AgentPoStatus"].length == 1) {
      AgentPoStatus = fields["AgentPoStatus"][0]["id"];
    }

    var query = {
      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],
      Emp_Id: fields["Emp_Id"],

      AgentType: fields["AgentType"],
      RM_Search_Type: fields["RM_Search_Type"],
      AgentStatus: fields["AgentStatus"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),

      Is_Agent_Report: this.UserRights["Is_Agent_Report"],
      Is_Agent_Report_View: this.UserRights["Is_Agent_Report_View"],
      Is_Agent_Report_Excel_Export:
        this.UserRights["Is_Agent_Report_Excel_Export"],
      GlobalSearch: GlobalSearch,
      AgentPoStatus: AgentPoStatus,
    };

    //   //   console.log(query);

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ClearSearch() {
    this.isSubmitted = false;
    this.isSubmitted1 = false;
    this.SearchForm.reset();
    this.SearchForm1.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("AgentType").setValue("0");
    this.SearchForm.get("RM_Search_Type").setValue("0");
    this.SearchForm.get("AgentStatus").setValue("0");

    this.Employee_Placeholder = "Select Employee";

    this.dataAr = [];
    this.Emps_Ar = [];
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  GetUserRights() {
    this.api.IsLoading();
    this.api.CallBms("User/GetUserRights?User_Id=" + this.api.GetUserId()).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.UserRights = result["User_Rights"];
        } else {
          //this.api.ErrorMsg(result['Message']);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        ////   //   console.log(err.message);
        //this.api.ErrorMsg(err.message);
      }
    );
  }

  ExportExcel(): void {
    ////   //   console.log(this.SQL_Where_STR);

    const dialogConfig = new MatDialogConfig();
    //   //   console.log(dialogConfig);

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    //dialogConfig.position = 'absolute';
    dialogConfig.hasBackdrop = false;
    //dialogConfig.closeOnNavigation = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "AgentReport",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/AgentReport/GridData?User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.dataAr = resp.data;
            this.SQL_Where_STR = resp.SQL_Where;
            this.PosCountCondition = resp.PosCountCondition;
            if (this.dataAr.length > 0) {
              this.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columns: [
        { data: "Id" },
        { data: "Emp_Id" },
        { data: "Password" },
        { data: "Type" },
        { data: "Name" },
        { data: "Email" },
        { data: "Mobile" },
        { data: "RM_Name" },
        { data: "Status" },
        { data: "Update_Stamp" },
      ],

      columnDefs: [
        {
          targets: [0], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  ViewDetails(row_Id): void {
    const dialogRef = this.dialog.open(AgentDetailsViewComponent, {
      width: "95%",
      height: "90%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  MergeCode(row_Id): void {
    const dialogRef = this.dialog.open(MergeCodeComponent, {
      width: "40%",
      height: "60%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  AgentStatusActions(row_Id): void {
    const dialogRef = this.dialog.open(AgentStatusActionComponent, {
      width: "40%",
      height: "60%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  FranchiseRightsActions(row_Id): void {
    const dialogRef = this.dialog.open(FranchiseRightsComponent, {
      width: "25%",
      height: "50%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  ORCModal(row_Id): void {
    const dialogConfig = new MatDialogConfig();
    //   //   console.log(dialogConfig);

    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = "94vw";
    dialogConfig.width = "94%";
    dialogConfig.height = "90%";

    dialogConfig.position = {
      top: "3%",
      left: "3%",
    };

    dialogConfig.data = {
      Id: row_Id,
    };

    const dialogRef = this.dialog.open(AgentOrcComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  ViewGemsDetails(Id) {
    const dialogRef = this.dialog.open(GemsDetailsViewComponent, {
      width: "40%",
      height: "55%",
      data: { Id: Id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  PrimeRequests(Id) {
    const dialogRef = this.dialog.open(AddprimerequestpopupComponent, {
      width: "50%",
      height: "55%",
      data: { Id: Id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  //====== PRIORITY LEVEL RELATED DATA =======//

  //===== CHECK UNCHECK ALL =====//
  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //===== CHECK SELECTED =====//
  isAllSelected() {
    this.masterSelected = this.dataAr.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  //===== GET CHECKED ITEM =====//
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if (
        this.dataAr[i].isSelected &&
        this.api.GetUserData("User_Id_Dec") == this.dataAr[i]["POS_RM_Id"]
      ) {
        this.checkedList.push({ Id: this.dataAr[i].Id });
      }
    }

    this.checkedList = this.checkedList;
  }

  //===== GET DATA IN ALL PRIORITIES =====//
  GetPorirityData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "../v2/reports/Po_Priority/GetPorirityData?User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Priroity_1 = result["Priroities"]["Priroity_1"];
            this.Priroity_2 = result["Priroities"]["Priroity_2"];
            this.Priroity_3 = result["Priroities"]["Priroity_3"];
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== UPDATE VALIDATION =====//
  UpdateValidation() {
    var fields = this.SearchForm2.value;
    if (
      fields["ActionType"].length > 0 &&
      fields["ActionType"][0]["id"] == "Remove"
    ) {
      this.SearchForm2.get("priroity").setValidators(null);
    } else {
      this.SearchForm2.get("priroity").setValidators(Validators.required);
    }

    this.SearchForm2.get("priroity").updateValueAndValidity();
  }

  //===== UPDATE PRIORITY DATA =====//
  submit() {
    this.isSubmitted2 = true;
    if (this.SearchForm2.invalid) {
      return;
    } else {
      var fields = this.SearchForm2.value;
      const formData = new FormData();

      var ActionType = "";
      var Priority = "";

      if (fields["ActionType"].length > 0) {
        ActionType = fields["ActionType"][0]["id"];
      } else {
        alert("Please choose Action Type");
        return;
      }

      if (fields["priroity"].length > 0) {
        Priority = fields["priroity"][0]["id"];
      }

      formData.append("User_Id", this.api.GetUserId());
      formData.append("ActionType", ActionType);
      formData.append("checklist", JSON.stringify(this.checkedList));
      formData.append("Priority", Priority);
      formData.append("PosCountCondition", this.PosCountCondition);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/reports/Po_Priority/SetpriroityQC", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == 1) {
              this.api.Toast(
                "Success",
                result["msg"] + "\r\n" + result["msg1"]
              );
              this.checkedList = [];
              this.masterSelected = false;

              this.isSubmitted2 = false;
              this.SearchForm2.get("ActionType").setValue("");
              this.SearchForm2.get("priroity").setValue("");

              this.Priroity_1 = result["Priroities"]["Priroity_1"];
              this.Priroity_2 = result["Priroities"]["Priroity_2"];
              this.Priroity_3 = result["Priroities"]["Priroity_3"];

              this.Reload();
            } else {
              const msg = "msg";
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  //===== FOLLOWUP DETAILS MODAL =====//
  PriorityLogs(AgentId: any): void {
    const dialogRef = this.dialog.open(PoPriorityLogsComponent, {
      width: "40%",
      height: "70%",
      disableClose: true,
      data: { AgentId: AgentId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
