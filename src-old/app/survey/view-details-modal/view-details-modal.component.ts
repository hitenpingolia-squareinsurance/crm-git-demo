import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-view-details-modal",
  templateUrl: "./view-details-modal.component.html",
  styleUrls: ["./view-details-modal.component.css"],
})
export class ViewDetailsModalComponent implements OnInit {
  SID: any = "";
  surveyDetails: any = [];
  rcFrontUrl: any = "";
  rcBackUrl: any = "";
  quotationDocUrl: any = "";
  addedBy: any = "";
  mappedTo: any = "";
  curStatus: any;
  currentRemark: any;
  inspectionReportDoc: any;
  CompanyName: any;
  ManegerDetails: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ViewDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSend: any
  ) {}

  ngOnInit() {
    this.SID = this.dataSend.sid;
    this.getSurveyDetails();
  }

  //===== GET SINGLE SURVEY DETAILS ======//
  getSurveyDetails() {
    const formData = new FormData();
    formData.append("id", this.SID);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Survey/getSingleSurveyDetails", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.surveyDetails = result["data"];
          this.CompanyName = result["CompanyName"];

          this.rcFrontUrl = result["rcFront"];
          this.rcBackUrl = result["rcBack"];
          this.quotationDocUrl = result["quotationDoc"];
          this.addedBy = result["addedBy"];
          this.mappedTo = result["mappedTo"];
          this.curStatus = result["curStatus"];
          this.currentRemark = result["currentRemark"];
          this.inspectionReportDoc = result["inspectionReportDoc"];
          this.ManegerDetails = result["ManegerDetails"];

          // console.log(result);
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
    this.api.HideLoading();
  }

  //===== CLOSE MODAL =====//
  CloseModel() {
    this.dialogRef.close();
  }

  ViewDocument(name) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
