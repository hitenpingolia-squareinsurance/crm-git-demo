import $ from "jquery";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: "app-view-dashboard-poupup",
  templateUrl: "./view-dashboard-poupup.component.html",
  styleUrls: ["./view-dashboard-poupup.component.css"],
})
export class ViewDashboardPoupupComponent implements OnInit {
  slideIndex: number = 0;
  thats: this;
  LoginType: string;
  PosStatus: any;
  Life_Training_Status: any;
  DashboardStatus: any;
  ContinueBtnAgent: any = "Continue";

  constructor(
    public api: ApiService,

    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ViewDashboardPoupupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //  this.slideIndex=0;
    this.DashboardStatus = 0;

    this.LoginType = this.api.GetUserType();

    if (this.LoginType == "agent") {
      this.PosStatus = this.api.GetUserData("pos_status");
      this.Life_Training_Status = this.api.GetUserData("Life_Training_Status");

      if (this.PosStatus == "2" && this.Life_Training_Status == 0) {
        this.CheckStatusLife();
      }
    }

    this.showSlides();
    if (this.LoginType != "agent") {
      this.StyleWork();
    }
  }
  CheckStatusLife() {
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    this.api.IsLoading();
    this.api
      .HttpGetType("TrainingExam/CheckLifeTrainingStatus/" + btoa(Ids))
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            // console.log(result);
            if (result["Training_Stage"] == "Exam") {
              this.DashboardStatus = 0;
            } else {
              this.DashboardStatus = 1;
            }

            this.StyleWork();
          } else {
            this.api.Toast("Warning", result["Msg"]);
            this.StyleWork();
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

  ngOnInit() {}

  Clicks2(TrainingType: any) {
    this.CloseModel();
    this.route.navigate(["Agent/Training/" + btoa(TrainingType)]);
  }

  showSlides() {
    var i;

    var slides = document.getElementsByClassName("image-sliderfade");
    // console.log(slides);

    var dots = document.getElementsByClassName("dot");

    for (i = 0; i < slides.length; i++) {
      $(".image-sliderfade" + [i]).css("display", "none");
    }

    this.slideIndex++;

    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }

    for (i = 0; i < dots.length; i++) {
      $(".dots" + [i]).removeClass("active");
    }

    $(".image-sliderfade" + [this.slideIndex - 1]).css("display", "block");

    $(".dots" + dots[this.slideIndex - 1]).addClass("active");

    // setTimeout(	function() { this.thats.showSlides(); } , 2000);

    setTimeout(() => {
      this.showSlides();
    }, 1500);
  }

  CloseModel() {
    this.dialogRef.close();
  }

  StyleWork() {
    // alert(this.DashboardStatus);

    if (this.DashboardStatus == 1) {
      $(".mat-dialog-container").css("background", "#ffff");
      $(".mat-dialog-container").css("background-repeat", "no-repeat");
      $(".mat-dialog-container").css("height", "350px");
      $(".mat-dialog-container").css(
        "background-image",
        'url("/assets/dist/img/life-training-bg.png")'
      );
    } else {
      $(".mat-dialog-container").css("background", "#fff0");
    }

    $(".cdk-overlay-dark-backdrop").css("background", "rgb(0 0 0 / 85%)");

    $(".cdk-overlay-pane").css("margin-top", "50px");
    $("#cdk-overlay-0").css("margin-top", "50px");
  }
}
