import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, Inject, OnInit } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { UrlRedirectionComponent } from "../url-redirection/url-redirection.component";

@Component({
  selector: "app-mail-logs",
  templateUrl: "./mail-logs.component.html",
  styleUrls: ["./mail-logs.component.css"],
})
export class MailLogsComponent implements OnInit {
  nocForm: FormGroup;

  isSubmitted = false;
  editrequestletter: any;
  loadAPI: Promise<any>;
  id: any;
  type: any;
  dataArr: any;
  mainBlogForm: any;
  category_Name: any[];
  status: any;
  url: string;
  Dataresult: any;
  status_check: string;
  selectedFiles: File;
  nocletter: File;
  isShow: boolean;
  isShown: any;
  editrequestletter2: number;
  agentCode: any;
  agreementStatus: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MailLogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    this.agentCode = this.data.agentCode;
    this.agreementStatus = this.data.agreementStatus;

    const id = this.id;
    const agentCode = this.agentCode;
  }

  ngOnInit() {
    this.GetAllRequests();
  }

  CloseModel22(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetAllRequests() {
    // console.log(this.id);
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();

    this.api.HttpGetType("Url_Redirection/GetLogsofMail?id=" + this.id).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);
        if (result["status"] == true) {
          this.Dataresult = result["Data"];

          // console.log(this.Dataresult.status);
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

  UrlRedirection(id: any, agentCode: any) {
    const dialogRef = this.dialog.open(UrlRedirectionComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      data: { id: id, agentCode: agentCode },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  SendAgreementMail(id, agentCode) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("AgentId", id);
    formData.append("AgentCode", agentCode);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("Url_Redirection/SendMail", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel22();
          } else {
            const msg = "msg";
            // this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
    }
  }
}
