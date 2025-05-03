import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-qcpdf-details",
  templateUrl: "./qcpdf-details.component.html",
  styleUrls: ["./qcpdf-details.component.css"],
})
export class QcpdfDetailsComponent implements OnInit {
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
    private dialogRef: MatDialogRef<QcpdfDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.id;

    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();

    // console.log(this.Id);
  }

  ngOnInit() {
    this.Id = this.data.id;
    this.GetSinglePosDetails();
  }

  GetSinglePosDetails() {
    const formData = new FormData();
    formData.append("id", this.Id);

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "SrDetails/SinglePolicyDetails?Id=" +
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

          if (result["Status"] == true) {
            this.row = result["Data"];

            //   //   //   console.log( this.row);
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
  // ViewDocument(name: any) {
  //   let url;
  //   url = name;
  //   // console.log(url);
  //   window.open(url, "", "left=100,top=50,width=800%,height=600");
  // }
}
