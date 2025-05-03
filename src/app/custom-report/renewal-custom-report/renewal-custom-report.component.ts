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
  selector: "app-renewal-custom-report",
  templateUrl: "./renewal-custom-report.component.html",
  styleUrls: ["./renewal-custom-report.component.css"],
})
export class RenewalCustomReportComponent implements OnInit {
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
  chartOptionsNop: {
    series: { name: any; data: any }[];
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
      formatter: (val: any) => string;
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
      labels: { show: boolean; formatter: (val: any) => string };
    };
    title: {
      text: string;
      floating: number;
      offsetY: number;
      align: string;
      style: { color: string };
    };
  };
  chartOptionsNetPremium: {
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
      formatter: (val: any) => string;
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
      labels: { show: boolean; formatter: (val: any) => string };
    };
    title: {
      text: string;
      floating: number;
      offsetY: number;
      align: string;
      style: { color: string };
    };
  };
  chartOptionsRevenue: {
    series: { name: any; data: any }[];
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
      formatter: (val: any) => string;
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
      labels: { show: boolean; formatter: (val: any) => string };
    };
    title: {
      text: string;
      floating: number;
      offsetY: number;
      align: string;
      style: { color: string };
    };
  };
  GrowthCheckTotalNet: any;
  GrowthTotalNet: any;
  GrowthTotalNop: any;
  GrowthCheckTotalNop: any;
  GrowthCheckTotalRevenue: any;
  GrowthTotalRevenue: any;

  DownloadPdf: string;
  TotalToBusiness: any;
  TotalFromBusiness: any;
  ToRenewedNop: any;
  ToRenewedBusiness: any;
  FromRenewedNop: any;
  FromRenewedBusiness: any;
  GrowthTotalBusiness: any;
  GrowthRenewedNop: any;
  GrowthRenewedBusiness: any;
  GrowthCheckTotalBusiness: any;
  GrowthCheckRenewedNop: any;
  GrowthCheckRenewedBusiness: any;

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
                "/b-crm/customreports/RenewalCustomReport?User_Id=" +
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
              this.FromDate = resp["FromDate"].FromDate;
              this.FromDateValue = resp["FromDate"].DateRange;
              this.ToDate = resp["ToDate"].ToDate;
              this.ToDateValue = resp["ToDate"].DateRange;
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

            this.GetFromDate(
              resp["ToDate"].ToDate,
              resp["FromDate"].FromDate,
              resp["ToDate"].Graph,
              resp
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

  GetFromDate(ToDate, FromDate, GraphVal, val) {
    const formData = new FormData();
    formData.append("WhereToDate", ToDate);
    formData.append("WhereFromDate", FromDate);
    formData.append("Graph", GraphVal);
    formData.append("Conditions", JSON.stringify(val));
    this.ShowDIv = 0;
    // console.log(formData);

    this.PolicyChartFromDate = "";
    this.api.IsLoading();
    this.api
      .HttpPostType(
        "b-crm/customreports/RenewalDataFetchCustomReports",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
            // var FromNop = result["FromNop"];
            // var Netfrom = result["FromNet"];
            // var NetTo = result["ToNet"];
            // var ToNop = result["ToNop"];
            // var ToRevenue = result["ToRevenue"];
            // var FromRevenue = result["FromRevenue"];

            // var DataVALEUE = result["DataValue"];

            // var ChartValueFromDate = DataVALEUE.split("/");
            // this.FromDateChartValue = ChartValueFromDate;

            // this.FromDateNetPremium = Netfrom.split("/");
            // this.ToDateNetPremium = NetTo.split("/");

            // this.TotalToPremium = result["TotalToNet"];
            // this.TotalFromPremium = result["TotalFromNet"];

            // this.FromDateNop = FromNop.split("/");
            // this.ToDateNop = ToNop.split("/");

            // this.TotalToNop = result["TotalToNop"];
            // this.TotalFromNop = result["TotalFromNop"];

            // this.FromDateRevenue = FromRevenue.split("/");
            // this.ToDateRevenue = ToRevenue.split("/");

            this.TotalToNop = result["TotalToNop"];
            this.TotalToBusiness = result["TotalToBusiness"];
            this.TotalFromNop = result["TotalFromNop"];
            this.TotalFromBusiness = result["TotalFromBusiness"];
            this.ToRenewedNop = result["ToRenewedNop"];
            this.ToRenewedBusiness = result["ToRenewedBusiness"];
            this.FromRenewedNop = result["FromRenewedNop"];
            this.FromRenewedBusiness = result["FromRenewedBusiness"];

            this.dataArValuee = result["TableValue"];

            this.GrowthTotalBusiness = result["GrowthTotalBusiness"];
            this.GrowthTotalNop = result["GrowthTotalNop"];
            this.GrowthRenewedNop = result["GrowthRenewedNop"];
            this.GrowthRenewedBusiness = result["GrowthRenewedBusiness"];

            this.GrowthCheckTotalNop = result["GrowthCheckTotalNop"];
            this.GrowthCheckTotalBusiness = result["GrowthCheckTotalBusiness"];
            this.GrowthCheckRenewedNop = result["GrowthCheckRenewedNop"];
            this.GrowthCheckRenewedBusiness =
              result["GrowthCheckRenewedBusiness"];

            // this.GrowthCheckTotalRevenue = result["GrowthCheckTotalRevenue"];
            // this.GrowthTotalRevenue = result["GrowthTotalRevenue"];

            // this.chartOptionsNetPremium = {
            //   series: [
            //     {
            //       name: this.ToDateValue,
            //       data: this.ToDateNetPremium,
            //     },
            //     {
            //       name: this.FromDateValue,
            //       data: this.FromDateNetPremium,
            //     },
            //   ],
            //   chart: {
            //     height: 350,
            //     type: "bar"
            //   },
            //   plotOptions: {
            //     bar: {
            //       dataLabels: {
            //         position: "top" // top, center, bottom
            //       }
            //     }
            //   },
            //   dataLabels: {
            //     enabled: true,
            //     formatter: function (val) {
            //       return val;
            //     },
            //     offsetY: -20,
            //     style: {
            //       fontSize: "10px",
            //       colors: ["#304758"]
            //     }
            //   },

            //   xaxis: {
            //     categories: this.FromDateChartValue,
            //   },
            //   fill: {
            //     type: "gradient",
            //     gradient: {
            //       shade: "light",
            //       type: "vertical",
            //       shadeIntensity: 0.25,
            //       gradientToColors: undefined,
            //       inverseColors: true,
            //       opacityFrom: 1,
            //       opacityTo: 1,
            //       stops: [50, 0, 100, 100]
            //     }
            //   },
            //   yaxis: {
            //     axisBorder: {
            //       show: true
            //     },
            //     axisTicks: {
            //       show: true
            //     },
            //     labels: {
            //       show: true,
            //       formatter: function (val) {
            //         return val;
            //       }
            //     }
            //   },
            //   title: {
            //     text: "Revenue Reports",
            //     floating: 0,
            //     offsetY: 320,
            //     align: "center",
            //     style: {
            //       color: "#444"
            //     }
            //   }
            // };

            // this.chartOptionsNop = {
            //   series: [
            //     {
            //       name: this.ToDateValue,
            //       data: this.ToDateNop,
            //     },
            //     {
            //       name: this.FromDateValue,
            //       data: this.FromDateNop,
            //     },
            //   ],
            //   chart: {
            //     height: 350,
            //     type: "bar"
            //   },
            //   plotOptions: {
            //     bar: {
            //       dataLabels: {
            //         position: "top" // top, center, bottom
            //       }
            //     }
            //   },
            //   dataLabels: {
            //     enabled: true,
            //     formatter: function (val) {
            //       return val;
            //     },
            //     offsetY: -20,
            //     style: {
            //       fontSize: "10px",
            //       colors: ["#304758"]
            //     }
            //   },

            //   xaxis: {
            //     categories: this.FromDateChartValue,
            //   },
            //   fill: {
            //     type: "gradient",
            //     gradient: {
            //       shade: "light",
            //       type: "vertical",
            //       shadeIntensity: 0.25,
            //       gradientToColors: undefined,
            //       inverseColors: true,
            //       opacityFrom: 1,
            //       opacityTo: 1,
            //       stops: [50, 0, 100, 100]
            //     }
            //   },
            //   yaxis: {
            //     axisBorder: {
            //       show: true
            //     },
            //     axisTicks: {
            //       show: true
            //     },
            //     labels: {
            //       show: true,
            //       formatter: function (val) {
            //         return val;
            //       }
            //     }
            //   },
            //   title: {
            //     text: "Revenue Reports",
            //     floating: 0,
            //     offsetY: 320,
            //     align: "center",
            //     style: {
            //       color: "#444"
            //     }
            //   }
            // };

            // this.chartOptionsRevenue = {
            //   series: [
            //     {
            //       name: this.ToDateValue,
            //       data: this.ToDateRevenue,
            //     },
            //     {
            //       name: this.FromDateValue,
            //       data: this.FromDateRevenue,
            //     },
            //   ],
            //   chart: {
            //     height: 1000,
            //     type: "bar"
            //   },
            //   plotOptions: {
            //     bar: {
            //       dataLabels: {
            //         position: "top" // top, center, bottom
            //       }
            //     }
            //   },
            //   dataLabels: {
            //     enabled: true,
            //     formatter: function (val) {
            //       return val;
            //     },
            //     offsetY: -20,
            //     style: {
            //       fontSize: "10px",
            //       colors: ["#304758"]
            //     }
            //   },

            //   xaxis: {
            //     categories: this.FromDateChartValue,
            //   },
            //   fill: {
            //     type: "gradient",
            //     gradient: {
            //       shade: "light",
            //       type: "vertical",
            //       shadeIntensity: 0.25,
            //       gradientToColors: undefined,
            //       inverseColors: true,
            //       opacityFrom: 1,
            //       opacityTo: 1,
            //       stops: [50, 0, 100, 100]
            //     }
            //   },
            //   yaxis: {
            //     axisBorder: {
            //       show: true
            //     },
            //     axisTicks: {
            //       show: true
            //     },
            //     labels: {
            //       show: true,
            //       formatter: function (val) {
            //         return val;
            //       }
            //     }
            //   },
            //   title: {
            //     text: "Revenue Reports",
            //     floating: 0,
            //     offsetY: 320,
            //     align: "center",
            //     style: {
            //       color: "#444"
            //     }
            //   }
            // };

            // // console.log(this.chartOptions);

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
  chartOptions(chartOptions: any) {
    throw new Error("Method not implemented.");
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
