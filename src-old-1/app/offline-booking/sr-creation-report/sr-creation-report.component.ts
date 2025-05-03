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
import { DownloadingViewBmsComponent } from "../../modals/brokerage/downloading-view-bms/downloading-view-bms.component";

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
  where: any;
  DateRangeValue: any;
}

@Component({
  selector: "app-sr-creation-report",
  templateUrl: "./sr-creation-report.component.html",
  styleUrls: ["./sr-creation-report.component.css"],
})
export class SrCreationReportComponent implements OnInit {
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

  SR_StatusDropdownSettings: any = {};
  Companies_Ar: any = [];
  UserRights: any = [];
  SRStatus_Ar: any = [];
  Lob_Ar: any;
  whereAr: any;
  LOB_Ar: { Id: string; Name: string }[];

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
      } else {
        this.ActivePage = "N/A";
      }
    });

    this.SearchForm = this.fb.group({
      Lob: [""],
      Company_Id: [""],
      SRStatus: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
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

    this.SRStatus_Ar = [
      { Id: "Logged", Name: "Logged" },
      { Id: "Complete", Name: "Booked" },
    ];

    this.LOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Personal Accident", Name: "Personal Accident" },
    ];
  }

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
  }

  SearchBtn2() {
    this.isSubmitted = true;

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
      SRStatus: fields["SRStatus"],
      Company_Id: fields["Company_Id"],
      SAIBA_Report_Type: this.ActivePage,

      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    // console.log(query);

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
      reportName: "767",
      columns: "",
      Where: this.whereAr,
      componentName: "partner-login-report",
    });

    dialogConfig.data = {
      ReportType: "partner_login_report",
      SQL_Where: d,
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

  get FC() {
    return this.SearchForm.controls;
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "sr/Agent/SearchComponentsData?User_Id=" +
          this.api.GetUserId() +
          "&request_page='partner-login'"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            //this.Vertical_Ar = result['Data']['Vertical'];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            // this.Lob_Ar = result["Data"]["SRLOB_Ar"];
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
    this.buttonDisable = true;
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
        Lob: fields["Lob"],
        SRStatus: fields["SRStatus"],
        Company_Id: fields["Company_Id"],
        SearchValue: fields["SearchValue"],
        SAIBA_Report_Type: this.ActivePage,

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
      };

      this.Is_Export = 0;
      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        //this.Is_Export = 1;
      });
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
                "/../v2/sr/Offline_Booking/GridData?User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.whereAr = resp.where;

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
