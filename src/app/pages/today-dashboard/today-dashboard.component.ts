import {
  ViewChild,
  QueryList,
  ViewChildren,
  Component,
  OnInit,
  ElementRef,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { empty } from "rxjs";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";
import domtoimage from "dom-to-image";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

class ColumnsObj {
  SrNo: string;
  Id: string;
  Status: any;
  Name: any;
  AgentId: any;
  Email: string;
  Mobile_No: string;
  Employee: any;
  Busniess: string;
  Totalpolicy: string;
  LastLogin: string;
  LastModifiedDate: string;
  CreateDate: string;
  NetPremium: string;
  TotalPolicy: string;
  LastPolicyDate: string;
}

@Component({
  selector: "app-today-dashboard",
  templateUrl: "./today-dashboard.component.html",
  styleUrls: ["./today-dashboard.component.css"],
})
export class TodayDashboardComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  SearchForm: FormGroup;
  isSubmitted = false;

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";
  Class: any = "6";

  QidSr: any;

  //selected
  currentUrl: string;
  PageType: string;
  urlSegment: string;
  Total: number;
  TotalPos: any;
  StatusActiveInactive: any = "";
  ShowDIv: number = 0;
  percetage: any;
  urlSegmentRoot: string;
  dataArToDate: string;
  dataArFromDate: string;
  ToDate: any;
  FromDate: any;
  TotalPolicyGraph: any;
  PolicyChartLabels: any;
  PolicyChartFromDate: any;
  PolicyChartToDate: any;
  TotalPolicyGraphToDate: any;
  TotalPolicyGraphFromDate: any;
  FromDateValue: any;
  ToDateValue: any;
  GraphVal: any;
  busniessPolicyChartFromDate: [];
  TotalPolicybusniessGraphFromDate: any;
  busniessPolicyChartToDate: { data: []; label: string }[];
  TotalPolicybusniessGraphToDate: any;
  TotalNopGraphFromDate: any;
  TotalNopGraphToDate: any;

  ToDateChartValue: any[];

  TotalNetPremium: [];
  TotalNetPremiumFromDate: [];
  TotalNopFromDate: [];
  TotalRevenueFromDate: any;
  TotalNetPremiumToDate: [];
  TotalNopToDate: [];
  TotalRevenueToDate: [];
  FromDateNetPremium: any[];
  FromDateNop: any;
  FromDateRevenue: any;
  FromDateChartValue: any[];
  ToDateBusinessChart: { data: never[]; label: string }[];
  ToDateNopChart: { data: never[]; label: string }[];
  ToDateRevenueChart: { data: never[]; label: string }[];
  ToDateNetPremium: any[];
  ToDateNop: any;
  ToDateRevenue: any;
  dataArValuee: any;
  TotalToPremium: any;
  TotalFromPremium: any;
  TotalToNop: any;
  TotalFromNop: any;
  TotalToRevenue: any;
  TotalFromRevenue: any;
  pdfTable: any;

  GrowthCheckTotalNet: any;
  GrowthTotalNet: any;
  GrowthTotalNop: any;
  GrowthCheckTotalNop: any;
  GrowthCheckTotalRevenue: any;
  GrowthTotalRevenue: any;

  DownloadPdf: string;
  GraphType: any;
  FromPospActivation: any;
  ToPospActivation: any;
  GrowthTotalPospActivation: any;
  GrowthCheckTotalPospActivation: any;
  TotalToPospActivation: any;
  TotalFromPospActivation: any;
  Ops_Data_Dashboard: any;
  DataDashboard: never[];
  Life_Training_Status: number;
  LoginType: string | null;
  LoginId: any;
  OpsRmData: any;
  dropdownSettingsingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  StatusDataAr: { Id: number; Name: string }[];
  StatusDataArValue: { Id: number; Name: string }[];
  MinDate: Date;
  MaxDate: Date;
  SelectedDate: Date;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.StatusDataAr = [
      { Id: 0, Name: "Yesterday" },
      { Id: 1, Name: "Today" },
    ];

    this.StatusDataArValue = [{ Id: 0, Name: "Yesterday" }];

    this.DownloadPdf = "Download Operation Report";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.SelectedDate = yesterday;

    // console.log(this.SelectedDate);

    this.MinDate = new Date("11-01-2023");
    this.MaxDate = new Date();

    this.SearchForm = this.fb.group({
      Date: [""],
      OpsEmpId: [""],
    });
  }

  ClearSearch() {}

  ngOnInit(): void {
    this.LoginType = this.api.GetUserType();
    this.LoginId = this.api.GetUserData("Id");

    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (this.urlSegment == "active-inactive-pos-reports") {
      this.PageType = "Reports";
    } else {
      this.PageType = "";
    }
    // this.GetDashBoardEmployeeWise(2);

    this.GetOperationEmployees();

    this.pdfTable != ElementRef;

    this.SearchBtn();
  }

  // GetDashBoardEmployeeWise(Id: any) {
  //   this.api
  //     .HttpGetType(
  //       "TodayDashboard/GetDashBoardEmployeeWise?Id=" +
  //         Id +
  //         "&User_Id=" +
  //         this.api.GetUserData("Id") +
  //         "&User_Type=" +
  //         this.api.GetUserType() +
  //         "&User_Code=" +
  //         this.api.GetUserData("Code") +
  //         "&Type=Claim"
  //     )
  //     .then(
  //       (result: any) => {
  //         //this.api.HideLoading();
  //         if (result["status"] == true) {
  //           if (result["Data"] != "") {
  //             this.DataDashboard = this.DataDashboard.concat(result["Data"]);

  //             // this.DataDashboard = this.DataDashboard.concat();

  //             // this.DataDashboard.push(result["Data"]);
  //           }
  //           //this.api.Toast('Success',result['msg']);
  //           // this.DataDashboard = this.DataDashboard.concat();

  //           // this.DataDashboard.push(result["Data"]);
  //         } else {
  //           //alert(result['message']);
  //           //this.api.Toast('Warning',result['msg']);
  //         }
  //       },
  //       (err) => {
  //         // Error log
  //         //// console.log(err);
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //         //this.api.ErrorMsg('Network Error :- ' + err.message);
  //       }
  //     );
  // }

  OPSDashboard(Id: any) {
    this.api
      .HttpGetType(
        "TodayDashboard/OPSDashboard?Id=" +
          Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Type=Claim"
      )
      .then(
        (result: any) => {
          //this.api.HideLoading();
          if (result["status"] == 1) {
            this.Ops_Data_Dashboard = result["Data"];
          } else {
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      // if (TablesNumber == "Table1") {
      dtInstance.column(0).search(JSON.stringify(event)).draw();
      // }
    });
  }

  downloadAsPDF() {
    this.DownloadPdf = "0%-100%";

    this.pdfTable = document.getElementById("opsTable");

    var img: any;
    var filename;
    var newImage: any;

    domtoimage
      .toPng(this.pdfTable, { bgcolor: "#fff" })

      .then(function (dataUrl) {
        // alert(dataUrl);
        img = new Image();
        img.src = dataUrl;
        newImage = img.src;

        img.onload = function () {
          var pdfWidth = img.width;
          var pdfHeight = img.height;

          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

          var doc;

          if (pdfWidth > pdfHeight) {
            doc = new jsPDF("l", "px", [pdfWidth, pdfHeight]);
          } else {
            doc = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
          }

          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();

          doc.addImage(newImage, "PNG", 10, 10, width, height);
          filename = "OPS Daily Report " + Date() + ".pdf";
          doc.save(filename);

          this.DownloadPdf = "Completed Download";
        };
      })
      .catch(function (error) {
        // Error Handling
        this.DownloadPdf = "Convert PDF";
      });
    this.DownloadPdf = "Convert PDF";
  }

  GetOperationEmployees() {
    const formData = new FormData();

    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);
    this.api.IsLoading();
    this.api
      .HttpPostType("TodayDashboard/GetOperationEmployees", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.OpsRmData = result["Data"];
            // this.TeleRmData = result["TeleRmData"];
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  SearchBtn() {
    const formData = new FormData();
    var fields = this.SearchForm.value;

    this.Ops_Data_Dashboard = "";
    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);

    formData.append("OpsEmpId", JSON.stringify(fields["OpsEmpId"]));
    formData.append("Date", fields["Date"]);

    this.api.IsLoading();
    this.api
      .HttpPostType("TodayDashboard/GetOperationRightsEmployee", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.Ops_Data_Dashboard = result["Data"];

            // this.OpsRmData = result["OpsRmData"];
            // this.TeleRmData = result["TeleRmData"];
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }
}
