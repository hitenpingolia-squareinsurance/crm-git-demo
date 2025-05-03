import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  ElementRef,
} from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import { PusherService } from "../../providers/pusher.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-view-single-content",
  templateUrl: "./view-single-content.component.html",
  styleUrls: ["./view-single-content.component.css"],
})
export class ViewSingleContentComponent implements OnInit {
  dropdownSettingsType1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  isSubmitted: boolean;
  Id: string;
  row: any;
  currentUrl: string;
  Login_Type: string | null;
  videourl: any;
  getByUrl: any;
  Category: string | null;
  videourlq: SafeResourceUrl;
  CategoryVal: any;
  filevalue: any;

  constructor(
    public api: ApiService,
    private pusherService: PusherService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    this.Category = this.activatedRoute.snapshot.paramMap.get("Category");

    this.dropdownSettingsType1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
    this.GetRow(this.Id, this.Category);
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.Login_Type = this.api.GetUserType();
  }
  //===== GET SINGLE SR DETAILS ======//

  GetRow(Id, Category) {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "KnowledgeBase/SingleKnowledgeBaseDetails?Id=" +
          Id +
          "&Category=" +
          Category
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.row = result["Data"][0];
            this.filevalue = result['Filevalue'];

            this.CategoryVal = result["CategoryVal"];

            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.filevalue
            );
            // this.videourl = this.videourlq.;

            // console.log( this.videourl.changingThisBreaksApplicationSecurity );
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

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ClickMenu(Id: any, cat: any) {
    this.api.IsLoading();
    this.router.navigateByUrl(
      "/knowledge/single-knowledge-details/" + Id + "/" + cat
    );
    this.api.HideLoading();
  }
}
