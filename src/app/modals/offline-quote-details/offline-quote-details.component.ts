import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-offline-quote-details",
  templateUrl: "./offline-quote-details.component.html",
  styleUrls: ["./offline-quote-details.component.css"],
})
export class OfflineQuoteDetailsComponent implements OnInit {
  Id: any;
  OfflineData: any;
  row: any;
  dataArr: unknown;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<OfflineQuoteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
  }

  ngOnInit() {
    this.GetOfflineSingleData();
    this.getdata();
  }

  GetOfflineSingleData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "offlinequote/SingleData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Quotation=" +
          this.Id +
          "&types=offline-quote-details"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == true) {
            this.row = result["data"];

            // console.log(this.row);
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

  getdata() {
    this.api.IsLoading();
    this.api
      .HttpGetType("offlinequote/OfflineQuoteslog?QuoteId=" + this.Id)
      .then(
        (result) => {
          this.api.HideLoading();
          this.dataArr = result;
        },
        (err) => {
          this.api.HideLoading();
          this.dataArr = err["error"]["text"];
          // console.log( this.dataArr);
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
