//import { Component, OnInit  } from '@angular/core';
import {
  OnInit,
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  HostListener,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";
//import { SocketioService } from '../../../providers/socketio.service';
import { PusherService } from "../../providers/pusher.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-motor-quote-details",
  templateUrl: "./motor-quote-details.component.html",
  styleUrls: ["./motor-quote-details.component.css"],
})
export class MotorQuoteDetailsComponent implements OnInit {
  Quote_Id: string;
  row: any;
  QuotationData: any;
  ProposalData: any;
  PolicyDetails: any;
  DownloadUrl: any;

  constructor(
    public api: ApiService,
    //public socketService : SocketioService,
    private pusherService: PusherService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.Quote_Id = this.activatedRoute.snapshot.paramMap.get("Quote_Id");
    // console.log(this.Quote_Id);
  }

  ngOnInit() {
    this.GetRow();
  }

  GetRow() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Quotation_Id", this.Quote_Id);

    this.api.IsLoading();

    this.api.HttpPostType("Helpdesk/SingleQuoteDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.QuotationData = result["QuotationData"];
          this.ProposalData = result["ProposalData"];
          this.PolicyDetails = result["PolicyDetails"];
          this.DownloadUrl = result["DownloadUrl"];
        } else {
          //alert(result['message']);
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        // Error log
        //// console.log(err);
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
