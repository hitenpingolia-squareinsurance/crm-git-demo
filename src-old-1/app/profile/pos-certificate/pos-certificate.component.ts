import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { empty } from "rxjs";
import { jsPDF } from "jspdf";

import domtoimage from "dom-to-image";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Console } from "console";
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-pos-certificate",
  templateUrl: "./pos-certificate.component.html",
  styleUrls: ["./pos-certificate.component.css"],
})
export class PosCertificateComponent implements OnInit {
  [x: string]: any;

  Profiledata: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<PosCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.POSCData = data.Profiledata;

    //   //   //   console.log(this.POSCData);
  }

  ngOnInit() {}

  downloadAsPDF() {
    this.DownloadPdf = "0%-100%";

    this.pdfTable = document.getElementById("contentToConvertCertificate");
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
          var pdfWidth = 1000;
          var pdfHeight = 1000;

          // FileSaver.saveAs(dataUrl, "my-pdfimage.png"); // Save as Image
          //   //   //   console.log(dataUrl);

          var doc: jsPDF;

          if (pdfWidth > pdfHeight) {
            doc = new jsPDF("l", "px", [pdfWidth, pdfHeight]);
          } else {
            doc = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
          }

          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();

          //   //   //   console.log(width);
          //   //   //   console.log(height);

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
