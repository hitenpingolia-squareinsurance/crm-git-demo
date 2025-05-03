import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-view-health-offline-details",
  templateUrl: "./view-health-offline-details.component.html",
  styleUrls: ["./view-health-offline-details.component.css"],
})
export class ViewHealthOfflineDetailsComponent implements OnInit {
  Id: any;
  OfflineData: any;
  row: any;
  dataArr: unknown;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ViewHealthOfflineDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
  }

  ngOnInit() {
    this.GetOfflineSingleData();
    this.getdata();
  }
  //======= GET SINGLE DATA ======//
  GetOfflineSingleData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Offlinehealthquote/SingleData?User_Id=" +
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

  //======= REPLES NAME ======//
  ReplesName(imploded: string): string {
    let exploded = imploded.split("_");
    exploded.pop();
    let newKey = exploded.join("_");
    return newKey
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  //========= GET OfflineQuoteslog ========== //
  getdata() {
    this.api.IsLoading();
    this.api
      .HttpGetType("Offlinehealthquote/OfflineQuoteslog?QuoteId=" + this.Id)
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

  ViewDocument2(name: any) {
    name =
      "https://squarebweb-documents.s3.ap-south-1.amazonaws.com/crm/" + name;
    window.open(name, "", "left=100,top=50,width=800%,height=600");
  }
}
