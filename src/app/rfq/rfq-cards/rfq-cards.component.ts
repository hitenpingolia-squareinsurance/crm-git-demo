import { ApiService } from "../../providers/api.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-rfq-cards",
  templateUrl: "./rfq-cards.component.html",
  styleUrls: ["./rfq-cards.component.css"],
})
export class RfqCardsComponent implements OnInit {
  CurrentUrl: string;
  UrlShare: string;
  id: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public api: ApiService
  ) {
    // this.CurrentUrl = window.location.pathname;
    this.CurrentUrl = this.router.url;
    //   //   //   console.log('CurrentUrl:', this.CurrentUrl);
    var splitted = this.CurrentUrl.split("/");
    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.UrlShare = splitted[1];
      this.id = splitted[3];
      //   //   //   console.log('UrlShare id:', this.UrlShare);
    }
  }

  ngOnInit() {}

  Open_New_Form(e: any) {
    if (e == "Marine") {
      alert("Marine form is not available..");
    }
    if (e == "EAR") {
      alert("EAR form is not available..");
    }
    if (e == "CAR") {
      alert("CAR form is not available..");
    }
  }
}
