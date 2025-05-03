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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

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

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalPos: number;
  StatusActiveInactive: string = "";
  percetage: string;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-posactivationreport",
  templateUrl: "./posactivationreport.component.html",
  styleUrls: ["./posactivationreport.component.css"],
})
export class PosactivationreportComponent implements OnInit {
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
  FromDateValuecheck: any;
  ToDateValueCheck: any;
  chartOptionsActivationCount: {
    series: { name: any; data: any[] }[];
    chart: { height: number; type: string };
    plotOptions: {
      bar: {
        dataLabels: {
          position: string; // top, center, bottom
        };
      };
    };
    dataLabels: {
      enabled: boolean;
      formatter: (val: any) => any;
      offsetY: number;
      style: { fontSize: string; colors: string[] };
    };
    xaxis: { categories: any[] };
    fill: {
      type: string;
      gradient: {
        shade: string;
        type: string;
        shadeIntensity: number;
        gradientToColors: undefined;
        inverseColors: boolean;
        opacityFrom: number;
        opacityTo: number;
        stops: number[];
      };
    };
    yaxis: {
      axisBorder: { show: boolean };
      axisTicks: { show: boolean };
      labels: { show: boolean; formatter: (val: any) => any };
    };
    title: {
      text: string;
      floating: number;
      offsetY: number;
      align: string;
      style: { color: string };
    };
  };
  FromDateCountActivation: any;
  ToDateCountActivation: any;
  TotalToPosCount: any;
  TotalFromPosCount: any;
  GrowthTotalPos: any;
  GrowthCheckTotalPos: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.DownloadPdf = "Convert PDF";

    this.SearchForm = this.fb.group({});
    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page);
        if (page == "Prime" || page == "Prime") {
          this.Get();
        }
      },
      (err) => {}
    );
  }

  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
  };

  public PolicyChartType = "bar";
  public RevenueChartType = "bar";

  public barChartLegend = false;

  public pieChartLabels = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  // pieChartLabels2 = ["1", "2", "3", "4", "5", "6", "7"];
  // pieChartData = [0, 0, 0, 0, 0, 0, 0];
  // pieChartType = "pie";

  ngOnInit(): void {
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
    this.Get();

    this.pdfTable != ElementRef;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      // if (TablesNumber == "Table1") {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(event)))
        .draw();
      // }
    });
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    this.ShowDIv = 0;

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/customreports/PospActivationReport?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&PageType=" +
                this.PageType +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            // console.log(resp);

            if (resp["Status"] == true) {
              var GraphVal = resp["ToDate"].Graph;

              if (GraphVal == "Department_Id" || GraphVal == "Insurer") {
                this.Class = "12";
              } else {
                this.Class = "6";
              }
            } else {
              this.api.HideLoading();

              const msg = "msg";
              this.api.Toast("Warning", resp["msg"]);
            }

            this.FromDateValuecheck = resp["FromDate"].DateRange;
            this.ToDateValueCheck = resp["ToDate"].DateRange;
            this.GetFromDate(
              resp["ToDate"].ToDate,
              resp["FromDate"].FromDate,
              resp["ToDate"].Graph
            );

            // this.GetToDate(resp["ToDate"].ToDate, GraphVal);

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
            });
          });
      },
    };
  }

  GetFromDate(ToDate, FromDate, GraphVal) {
    const formData = new FormData();
    formData.append("WhereToDate", ToDate);
    formData.append("WhereFromDate", FromDate);
    formData.append("Graph", GraphVal);
    // alert(GraphVal);
    this.ShowDIv = 0;
    // console.log(formData);

    this.PolicyChartFromDate = "";
    this.api.IsLoading();
    this.api
      .HttpPostType("b-crm/customreports/PospActivationCustomReports", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
            this.dataArValuee = result["TableValue"];

            var Posfrom = result["FromPos"];
            var PosTo = result["ToPos"];
            var DataVALEUE = result["DataValue"];
            var ChartValueFromDate = DataVALEUE.split("/");
            this.FromDateChartValue = ChartValueFromDate;
            this.FromDateCountActivation = Posfrom.split("/");
            this.ToDateCountActivation = PosTo.split("/");
            this.TotalToPosCount = result["TotalToPos"];
            this.TotalFromPosCount = result["TotalFromPos"];
            this.GrowthTotalPos = result["GrowthTotalPos"];
            this.GrowthCheckTotalPos = result["GrowthCheckTotalPos"];

            this.chartOptionsActivationCount = {
              series: [
                {
                  name: this.ToDateValueCheck,
                  data: this.ToDateCountActivation,
                },
                {
                  name: this.FromDateValuecheck,
                  data: this.FromDateCountActivation,
                },
              ],
              chart: {
                height: 350,
                type: "bar",
              },
              plotOptions: {
                bar: {
                  dataLabels: {
                    position: "top", // top, center, bottom
                  },
                },
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val;
                },
                offsetY: -20,
                style: {
                  fontSize: "10px",
                  colors: ["#304758"],
                },
              },

              xaxis: {
                categories: this.FromDateChartValue,
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: "light",
                  type: "vertical",
                  shadeIntensity: 0.25,
                  gradientToColors: undefined,
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [50, 0, 100, 100],
                },
              },
              yaxis: {
                axisBorder: {
                  show: true,
                },
                axisTicks: {
                  show: true,
                },
                labels: {
                  show: true,
                  formatter: function (val) {
                    return val;
                  },
                },
              },
              title: {
                text: "Revenue Reports",
                floating: 0,
                offsetY: 320,
                align: "center",
                style: {
                  color: "#444",
                },
              },
            };

            this.ShowDIv = 1;
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  downloadAsPDF() {
    this.DownloadPdf = "0%-100%";

    this.pdfTable = document.getElementById("contentToConvert");

    var img: any;
    var filename;
    var newImage: any;

    domtoimage
      .toPng(this.pdfTable, { bgcolor: "#fff" })

      .then(function (dataUrl) {
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
          filename = Date() + ".pdf";
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
}

// }
