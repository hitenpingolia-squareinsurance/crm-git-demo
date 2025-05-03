import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { empty } from "rxjs";

@Component({
  selector: "app-mail-template",
  templateUrl: "./mail-template.component.html",
  styleUrls: ["./mail-template.component.css"],
})
export class MailTemplateComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  AddMailTemplates: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

  selectedFiles: File;
  image: File;

  ActionType: any = "";

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  attachment: File;
  urlSegment: any;
  CurrentUrl: string;
  urlSegment1: string;
  urlSegment2: string;
  dataAr: any;
  id: any;
  url: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddMailTemplates = this.formBuilder.group({
      templatename: ["", Validators.required],
      source: ["", Validators.required],
      frommail: ["", Validators.required],
      tomail: [""],
      ccmail: [""],
      subject: ["", Validators.required],
      attachment: [""],
      mailbody: ["", Validators.required],
      actiontype: ["", Validators.required],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.CurrentUrl = window.location.pathname;

    var splitted = this.router.url.split("/");
    this.urlSegment1 = splitted[2];
    this.urlSegment2 = splitted[3];

    // console.log(this.urlSegment1);
    // console.log(this.urlSegment2);

    if (this.urlSegment1 == "edit_template") {
      this.getSingleTemplate();
    }

    // this.onSelect();
    // this.currentUrl = this.router.url;
    // // console.log(this.currentUrl);

    // if (this.currentUrl == "/bulk-mail/My-Team") {
    // } else {
    // }
  }

  // ResetDT() {
  //   this.sendbulkmailForm.value.reset();
  // }

  ckconfig = {
    height: 360,
    allowedContent: true,
  };

  getSingleTemplate() {
    if (this.urlSegment1 == "edit_template") {
      this.id = this.urlSegment2;

      //  var fields = this.loginform.value;

      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("id", this.id);

      this.api.IsLoading();
      this.api.HttpPostType("MailTemplates/getTemplatevalue", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.dataAr = result["data"];

            // console.log(this.dataAr);

            this.AddMailTemplates.patchValue(this.dataAr);
            // this.DocswalletForm.patchValue(this.dataArr);

            // this.api.Toast("Success", result["msg"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
  get formControls() {
    return this.AddMailTemplates.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.AddMailTemplates.invalid) {
      return;
    } else {
      var fields = this.AddMailTemplates.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("templatename", fields["templatename"]);
      formData.append("source", fields["source"]);
      formData.append("frommail", fields["frommail"]);
      formData.append("tomail", fields["tomail"]);
      formData.append("ccmail", fields["ccmail"]);
      formData.append("subject", fields["subject"]);
      formData.append("mailbody", fields["mailbody"]);
      formData.append("actiontype", fields["actiontype"]);
      formData.append("attachment", fields["attachment"]);

      // console.log(fields);
      // // console.log('formData');

      if (this.urlSegment1 == "add_templates") {
        this.url = "MailTemplates/AddTemplte";
      } else if (this.urlSegment1 == "edit_template") {
        formData.append("id", this.id);
        this.url = "MailTemplates/UpdateTemplate";
      }

      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.AddMailTemplates.reset();
            this.api.Toast("Success", result["msg"]);
            this.router.navigateByUrl("/mail/view_templates");
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
}
