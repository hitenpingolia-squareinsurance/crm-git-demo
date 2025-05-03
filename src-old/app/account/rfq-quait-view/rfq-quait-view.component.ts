import { ApiService } from "../../providers/api.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-rfq-quait-view",
  templateUrl: "./rfq-quait-view.component.html",
  styleUrls: ["./rfq-quait-view.component.css"],
})
export class RfqQuaitViewComponent implements OnInit {
  ids: any;
  total_primium: any;
  total_gst: any;
  discount: any;
  primium_without_Tax: any;
  suminsured: any;
  period: any;
  placesOcode: any;
  state: any;
  district: any;
  zone: any;
  pincode: any;

  CurrentUrl: string;
  FireForms: FormGroup;
  ViewForm: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  apiUrl: any;
  id: any;
  splitted2: string;
  post: any[] = [];
  UrlShare: string;
  dataArr: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    public api: ApiService
  ) {
    // this.CurrentUrl = window.location.pathname;

    this.CurrentUrl = this.router.url;

    var Ids = this.activatedRoute.snapshot.paramMap.get("id");

    //   //   //   console.log("CurrentUrl:", this.CurrentUrl);
    var splitted = this.CurrentUrl.split("/");

    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.UrlShare = splitted[3];
      //   //   //   console.log("UrlShare id:", this.UrlShare);
    }
  }

  ngOnInit() {
    this.Get();
  }

  Get() {
    // alert();
    const formData = new FormData();
    // formData.append('Id', this.Id);
    formData.append("ShareUrlId", this.UrlShare);

    this.api
      .HttpPostType(
        "Rfq/Rfq_Share_View?Url=" +
          this.CurrentUrl +
          "&User_Id=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.dataArr = result["data"];
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
  }
}
