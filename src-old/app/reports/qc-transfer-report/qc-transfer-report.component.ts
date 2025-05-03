import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  Id: string;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  Agent_Name: string;
  RM_Name: string;
  UW_Name: string;
  Operation_Name: string;
  Account_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
  SR_Current_Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-qc-transfer-report",
  templateUrl: "./qc-transfer-report.component.html",
  styleUrls: ["./qc-transfer-report.component.css"],
})
export class QcTransferReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

  Departments_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  Is_Export: any = 0;

  Broker_Ar: any = [];
  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SRType_Ar: any = [];
  SR_Payout_Mode_Ar: any = [];
  SR_Posting_Status_Ar: any = [];
  UserRights: any = [];
  OpsUsers: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};
  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  SR_StatusDropdownSettings: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  Status: any = "";
  Assign_User: any = "";
  Remark: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  SR_User_Rights: any = [];

  SQL_Where_STR: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      DateOrDateRange: ["", [Validators.required]],
      GlobalSearch: [""],
    });
  }

  ngOnInit(): void {
    this.Get();
  }

  get FC() {
    return this.SearchForm.controls;
  }

  SearchBtn() {
    var fields = this.SearchForm.value;

    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    }

    var query = {
      Role: this.api.GetUserData("UserType_Name"),
      DateOrDateRange: fields["DateOrDateRange"],
      GlobalSearch: fields["GlobalSearch"],
    };

    this.Is_Export = 0;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ExportExcel() {
    var fields = this.SearchForm.value;

    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    }

    var fields = this.SearchForm.value;

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Role", this.api.GetUserData("User_Role"));

    formData.append("DateOrDateRange", fields["DateOrDateRange"]);
    formData.append("GlobalSearch", fields["GlobalSearch"]);

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "./../v2/sr/QC_Transfer_Report/QC_Transfer_ExportExcel",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Sucess", result["Message"]);
            window.open(result["DownloadUrl"]);
          } else {
            //alert(result['Message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          //   //   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Agents_Ar = [];
    this.ResetDT();
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
              environment.apiUrlBms +
                "/../../v2/sr/QC_Transfer_Report/Grid?User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBms)
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
        { data: "SR_No" },
        { data: "LOB_Name" },
        { data: "File_Type" },
        { data: "Customer_Name" },
        { data: "Agent_Name" },
      ],
      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }
}
