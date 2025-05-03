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

@Component({
  selector: "app-agent-converted",
  templateUrl: "./agent-converted.component.html",
  styleUrls: ["./agent-converted.component.css"],
})
export class AgentConvertedComponent implements OnInit {
  LeadSrData: any;
  SearchForm: FormGroup;
  CurrentYear: number;
  MonthsYear_Ar: number[];
  DownloadPdf: string;
  pdfTable: HTMLElement | null;
  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    var d = new Date();
    this.CurrentYear = d.getFullYear();

    this.SearchForm = this.formBuilder.group({
      Year: [this.CurrentYear],
    });

    this.MonthsYear_Ar = [2023, 2022, 2021];
  }

  ngOnInit() {
    // this.FilterData();
  }

  FilterData() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    var fields = this.SearchForm.value;
    formData.append("Year", fields["Year"]);

    if (fields["Year"] != "") {
      this.api.IsLoading();
      this.api.HttpPostType("Managementreports/ConvertedRatio", formData).then(
        (result: any) => {
          this.api.HideLoading();

          //   //   //   console.log(result);

          if (result["status"] == true) {
            this.LeadSrData = result["ProfileData"];
          } else {
            const msg = "msg";
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
    } else {
      this.api.Toast("Warning", "Please Select Year First");
    }

    // formData.append("login_type", this.api.GetUserType());
  }

  downloadAsPDF() {
    this.DownloadPdf = "0%-100%";

    var pdfhtml: any = document.getElementById("contentToConvert");
    //   //   //   console.log(pdfhtml);

    var img: any;
    var filename;
    var newImage: any;

    domtoimage
      .toPng(pdfhtml, { bgcolor: "#fff" })

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
          filename = "Lead Report" + Date() + ".pdf";
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
