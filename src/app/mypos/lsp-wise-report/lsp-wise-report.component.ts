import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { MatDialog } from "@angular/material/dialog";

import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Mobile: string;
  Creator: string;
  Manager: string;
  Add_Stamp: string;
  Intimated_To_Insurer: string;
  Assigner_Id: any;
  Status: any;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-lsp-wise-report",
  templateUrl: "./lsp-wise-report.component.html",
  styleUrls: ["./lsp-wise-report.component.css"],
})
export class LspWiseReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};

  Company_Ar: any = [];
  PolicyType_Ar: any = [];
  TicketType_Ar: any = [];
  TicketStatus_Ar: any = [];

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";
  QuoteTypes: { Id: string; Name: string }[];
  dropdownSettings1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    //selectAllText: 'Select All',
    //unSelectAllText: 'UnSelect All',
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  LSPData: any;
  ReportTypeData: { Id: string; Name: string }[];

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];

    this.ReportTypeData = [
      { Id: "Business Booking Wise", Name: "Busienss Booking Wise" },
      { Id: "Posp Creatation Wise", Name: "Posp Creatation Wise" },
    ];

    this.SearchForm = this.fb.group({
      LspName: [""],
      ReportType: [""],
      DateOrDateRange: [""],
    });

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit(): void {
    this.Get();
    this.GetLspData();
  }

  GetLspData() {
    this.api.HttpGetType("/PospManegment/GetLspData").then(
      (result: any) => {
        if (result["status"] == true) {
          this.LSPData = result["Data"];
        }
      },
      (err) => {
        // this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;
      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        LspName: fields["LspName"],
        ReportType: fields["ReportType"],
        To_Date: ToDate,
        From_Date: FromDate,
      };

      this.Is_Export = 0;
      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
        //this.Is_Export = 1;
      });
    }
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+this.api.GetToken(),
      }),
    };

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
            this.api.additionParmsEnc(environment.apiUrl +
              "/PospManegment/FetchLspData?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Action=" +
              this.ActionType +
              "&Pos_Type=" +
              this.api.GetUserData("pos_type")),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            that.dataAr = resp.data;
          

            if (that.dataAr.length > 0) {
              //that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      //columns: [
      //		{ data: 'Id' },
      //		{ data: 'Type' }

      //]
    };
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  GenerateAgentReport(Value) {
    const formData = new FormData();
    formData.append("AgentIds", Value);
    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/ExportLspReport", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          // this.api.Toast("Success", "OTP Verified");
          window.open(result["DownloadUrl"]);

          // const Closebutton = document.getElementById("CloseModel");
          // Closebutton.click();
        } else {
          this.api.Toast("Warning", "Invalid OTP");
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
