import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-pos-details",
  templateUrl: "./pos-details.component.html",
  styleUrls: ["./pos-details.component.css"],
})
export class PosDetailsComponent implements OnInit {
  Id: any;
  row: any;
  Documents: any;
  Type: any;
  loginId: string;
  loginType: string;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<PosDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
    this.Type = this.data.type;

    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();

    // console.log(this.Id);
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.GetSinglePosDetails();
  }

  DownloadCertified() {
    const formData = new FormData();
    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("MyPos/GenerateCertified", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          // this.sss = result["Data"];
          //   //   //   console.log(result["Data"]);
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  GetSinglePosDetails() {
    const formData = new FormData();
    formData.append("id", this.Id);
    formData.append("type", this.Type);

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "MyPos/SingleFetchDetails?Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          //   //   //   console.log(result);
          if (result["Status"] == true) {
            this.row = result["Data"];

            // console.log( this.row);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  CloseModel() {
    this.dialogRef.close();
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(name: any) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
