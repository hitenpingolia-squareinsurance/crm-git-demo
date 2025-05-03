import { HostListener, Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
//import { AgentDocumentsViewComponent } from '../../../modals/agent-documents-view/agent-documents-view.component';
import { AgentDetailsViewComponent } from "../../modals/agent-details-view/agent-details-view.component";

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
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-spc-qc-report",
  templateUrl: "./spc-qc-report.component.html",
  styleUrls: ["./spc-qc-report.component.css"],
})
export class SpcQcReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

  Is_CutCopyPasteCls: string = "";

  UserRights: any = [];

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      AgentType: [""],
      AgentStatus: [""],
      DateOrDateRange: [""],
    });
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

  ngOnInit(): void {
    const IsCutCopyPaste = localStorage.getItem("IsCutCopyPaste");
    if (IsCutCopyPaste == "0") {
      this.Is_CutCopyPasteCls = "Is_CutCopyPasteCls";
    }

    this.GetUserRights();
    this.Get();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
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

  SearchBtn() {
    ////   //   console.log(this.SearchForm.value);

    var fields = this.SearchForm.value;

    var RM_Id_value, Franchisee_Id_value, ToDate, FromDate;

    var DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    //   //   //   console.log(RM_Id_value);
    //   //   //   console.log(Franchisee_Id_value);

    var query = {
      AgentType: fields["AgentType"],
      AgentStatus: fields["AgentStatus"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),

      Is_Agent_Report: this.UserRights["Is_Agent_Report"],
      Is_Agent_Report_View: this.UserRights["Is_Agent_Report_View"],
      Is_Agent_Report_Excel_Export:
        this.UserRights["Is_Agent_Report_Excel_Export"],
    };

    //   //   //   console.log(query);

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.dataAr = [];
    this.ResetDT();
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
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/AgentReport/GridData_SPC_QC?User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            this.dataAr = resp.data;

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
      //   //   //   console.log(result);
    });
  }
}
