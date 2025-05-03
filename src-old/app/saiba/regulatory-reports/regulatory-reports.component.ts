import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "src/app/providers/bmsapi.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { DownloadingViewBmsComponent } from "src/app/modals/brokerage/downloading-view-bms/downloading-view-bms.component";
import { BrokrageRequestLoaderComponent } from "../../modals/brokerage/brokrage-request-loader/brokrage-request-loader.component";

class ColumnsObj {
  Id: string;
  SR_No: string;
  User: string;
  LOB_Name: string;
  File_Type: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalSRandBussinessCount: any[];
  totalPremium: any[];
  SQL_Where: any;
  DateRangeValue: any;
}

@Component({
  selector: "app-regulatory-reports",
  templateUrl: "./regulatory-reports.component.html",
  styleUrls: ["./regulatory-reports.component.css"],
})
export class RegulatoryReportsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;

  dropdownSettings: any = {};

  Is_Export: any = 0;
  dropdownSingleSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    //selectAllText: 'Select All',
    //unSelectAllText: 'UnSelect All',
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  ActivePage: string;
  AgentData: any;

  SR_StatusDropdownSettings: any = {};
  Companies_Ar: any = [];
  UserRights: any = [];
  SRStatus_Ar: any = [];
  AgentDropdownSettings: {
    singleSelection: boolean;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    idField: string;
    textField: string;
  };

  constructor(
    public api: BmsapiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((value) => {
      //// console.log(value);
      //// console.log('current route: ', router.url.toString());

      if (router.url.toString() == "/regulatory-report/insurer-wise") {
        this.ActivePage = "Insurer Wise Business Report";
      } else if (router.url.toString() == "/regulatory-report/top-customers") {
        this.ActivePage = "Top Customer's Business Report";
      } else if (router.url.toString() == "/regulatory-report/top-insurer") {
        this.ActivePage = "Top Insurer's Business Report";
      } else if (
        router.url.toString() == "/regulatory-report/department-business"
      ) {
        this.ActivePage = "Department Business Data Report";
      } else if (
        router.url.toString() == "/regulatory-report/business-report"
      ) {
        this.ActivePage = "Business Report";
        // this.FetchAgentData();
      } else if (router.url.toString() == "/regulatory-report/posp-wise") {
        this.ActivePage = "Posp Report";
      } else {
        this.ActivePage = "N/A";
      }
    });

    this.SearchForm = this.fb.group({
      ReportTypeStatus: [""],
      Report_Type: [""],
      AgentId: [""],
      Company_Id: ["", [Validators.required]],
      SRStatus: ["", [Validators.required]],
      DateOrDateRange: ["", [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownSingleSelect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SR_StatusDropdownSettings = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.AgentDropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      allowSearchFilter: true,
      idField: "Id",
      textField: "Name",
    };

    this.SRStatus_Ar = [
      { Id: "Logged", Name: "Logged" },
      { Id: "Complete", Name: "Booked" },
    ];

    if (router.url.toString() == "/regulatory-report/business-report") {
      this.FetchAgentData();
    }
  }
  FetchAgentData() {
    // alert();/
    this.api.IsLoading();
    this.api
      .Call("sr/Agent/FetchAgentData?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.AgentData = result["Data"]["Agent_Data"];
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

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
  }
  get FC() {
    return this.SearchForm.controls;
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call("sr/Agent/SearchComponentsData?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            //this.Vertical_Ar = result['Data']['Vertical'];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            //this.Region_Ar = result['Data']['Region_Ar'];
            this.UserRights = result["Data"]["SR_User_Rights"];
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

  GetCompanies(e: any) {
    this.SearchForm.get("Company_Id").setValue(null);
    this.SearchForm.get("Company_Id").updateValueAndValidity();

    this.api.IsLoading();
    this.api.Call("sr/Agent/GetCompanies?type=" + e.target.value).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Companies_Ar = result["Data"];
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

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      //// console.log(this.SearchForm.value);

      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Report_Type: fields["Report_Type"],
        ReportTypeStatus: fields["ReportTypeStatus"],
        SRStatus: fields["SRStatus"],
        Company_Id: fields["Company_Id"],
        AgentId: fields["AgentId"],
        SAIBA_Report_Type: this.ActivePage,

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
      };

      //   //   //   console.log(this.ActivePage);
      if (
        this.ActivePage == "Department Business Data Report" ||
        this.ActivePage == "Top Insurer's Business Report"
      ) {
        // if (this.ActivePage == "Department Business Data Report" || ) {
        const formData = new FormData();
        formData.append("User_Id", this.api.GetUserId());
        formData.append("SQL_Where", JSON.stringify(query));
        formData.append("DateRangeValue", "");

        this.api.IsLoading();
        this.api
          .HttpPostType("../v2/reports/SAIBA_Report/PrepareLimit", formData)
          .then(
            (result) => {
              this.api.HideLoading();
              if (result["Status"] == true) {
                this.Reload();
                this.api.ToastMessage(result["Message"]);
                window.open(result["DownloadUrl"]);
              } else {
                this.api.ErrorMsg(result["Message"]);
              }
            },
            (err) => {
              this.api.HideLoading();
              this.api.ErrorMsg(
                "Network Error, Please try again ! " + err.message
              );
            }
          );
      } else if (this.ActivePage == "Business Report") {
        const dialogConfig = new MatDialogConfig();
        // console.log(dialogConfig);

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

        var d = JSON.stringify({
          reportType: "exists_download",
          reportName: "694",
          columns: "",
          Where: query,
          componentName: "regulatory-business-report",
        });

        dialogConfig.data = {
          ReportType: "SAIBA_Export",
          SQL_Where: JSON.stringify(query),
          DateRangeValue: "",
        };

        //this.Is_Export = 0;

        const dialogRef = this.dialog.open(
          DownloadingViewBmsComponent,
          dialogConfig
        );

        dialogRef.afterClosed().subscribe((result: any) => {
          this.Reload();
          // console.log(result);
        });
      } else {
        const dialogConfig = new MatDialogConfig();
        // console.log(dialogConfig);

        //dialogConfig.disableClose = true;
        //dialogConfig.autoFocus = false;
        dialogConfig.width = "25%";
        dialogConfig.height = "14%";
        //dialogConfig.position = 'absolute';
        dialogConfig.hasBackdrop = false;
        //dialogConfig.closeOnNavigation = false;

        // alert(1123);

        dialogConfig.position = {
          top: "40%",
          left: "1%",
        };

        dialogConfig.data = {
          ReportType: "SAIBA_Export",
          SQL_Where: JSON.stringify(query),
          DateRangeValue: "",
        };

        this.Is_Export = 0;

        const dialogRef = this.dialog.open(
          DownloadingViewBmsComponent,
          dialogConfig
        );

        dialogRef.afterClosed().subscribe((result: any) => {
          this.Reload();
          // console.log(result);
        });
      }
    }
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
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
              environment.apiUrlBmsBase +
                "/../v2/reports/SAIBA_Report/GridData?Report_Type=Saiba_download_history&User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            //alert(resp.SQL_Where);
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "SR_No" },
        { data: "User" },
        { data: "Report_Type" },
        { data: "Download_Link" },
        { data: "Download_Date_Time" },
      ],
      columnDefs: [
        {
          targets: [0, 1, 2, 3], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }
}
