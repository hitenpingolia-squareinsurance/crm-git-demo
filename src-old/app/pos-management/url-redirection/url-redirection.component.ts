import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MailLogsComponent } from "../mail-logs/mail-logs.component";

@Component({
  selector: "app-url-redirection",
  templateUrl: "./url-redirection.component.html",
  styleUrls: ["./url-redirection.component.css"],
})
export class UrlRedirectionComponent implements OnInit {
  UrlRedirectionForm: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  selectedFiles: File;
  agreement: File;
  showTable: any = 1;
  Company: any;
  Product: any;
  SubProduct: any;
  Type: any;
  Lob: any;
  id: any;
  type: any;
  dataArr: any;
  agentCode: any;
  primaryKey: any;
  url: string;
  agreementDocument: any;
  agreementStatus: any;
  apikeyvalue: any;
  agreementmail: number = 0;
  visible: number = 0;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };
  content: any;
  contentType: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UrlRedirectionComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    this.agentCode = this.data.agentCode;
    this.agreementStatus = this.data.agreementStatus;
    this.type = this.data.type;
    console.log(this.type);
    this.UrlRedirectionForm = this.formBuilder.group({
      agreementDoc: [""],
      agreementDate: ["", Validators.required],
      agreementYear: ["", Validators.required],
      type: ["", Validators.required],
      title: ["", Validators.required],
      headerVisible: ["", Validators.required],
      apikeyyesorno: [""],
      confirmMargin: [""],
      quoteApi: ["", [Validators.pattern("^https?://.+")]],
      policyDetailsApi: ["", [Validators.pattern("^https?://.+")]],
      apiKey: [""],
      source: ["", [Validators.pattern("^https?://.+")]],
      otprequired: [""],
      contenttype: [""],
    });



    console.log(this.id);
    console.log(this.type);

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.content = [
      { Id: "text/plain", Name: "text/plain" },
      { Id: "application/json", Name: "application/json" },
    ];
  }

  urlValidator(control) {
    if (!control.value) {
      return null; // No validation if the field is empty
    }

    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (urlPattern.test(control.value)) {
      return null; // Valid URL
    } else {
      return { invalidUrl: true }; // Invalid URL
    }
  }
  // addjob function in model

  ngOnInit() {
    this.getValueEdit();
  }

  ChangeStatus() {
    this.UrlRedirectionForm.get("apiKey").setValue("");
  }

  getValueEdit() {
    // console.log(this.id);
    // // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("user_type", this.api.GetUserType());

    formData.append("user_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api
      .HttpPostType("Url_Redirection/EditUrlRedirectionDetails", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.dataArr = result["data"];

            this.primaryKey = this.dataArr.id;
            this.agreementDocument = this.dataArr.agreementDocument;
            this.apikeyvalue = this.dataArr.apiKey;
            // if(this.apikeyvalue != '') {

            // }
            this.UrlRedirectionForm.patchValue(this.dataArr);
            this.contentType = result["contentType"];

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

  get formControls() {
    return this.UrlRedirectionForm.controls;
  }

  submit() {
    // console.log(this.id);
    // console.log(this.agentCode);
    // console.log(this.primaryKey);

    this.isSubmitted = true;
    if (this.UrlRedirectionForm.invalid) {
      return;
    } else {
      var fields = this.UrlRedirectionForm.value;

      const formData = new FormData();

      formData.append("primary", this.primaryKey);

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("agentid", this.id);

      formData.append("agentcode", this.agentCode);
      formData.append("agreement_doc", this.agreement);
      formData.append("agreementDate", fields["agreementDate"]);
      formData.append("confirm_margin", fields["confirmMargin"]);
      formData.append("agreementYear", fields["agreementYear"]);
      formData.append("type", fields["type"]);
      formData.append("title", fields["title"]);
      formData.append("headerVisible", fields["headerVisible"]);
      formData.append("quote_api", fields["quoteApi"]);
      formData.append("policy_details_api", fields["policyDetailsApi"]);
      formData.append("api_key", fields["apiKey"]);
      formData.append("portal_url", fields["source"]);
      formData.append("otprequired", fields["otprequired"]);
      formData.append("contenttype", fields["contenttype"][0]["Id"]);

      // // console.log(fields);

      this.url = "/Url_Redirection/updateUrlRedirection";

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel11();
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

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 10) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 10 mb");

          if (Type == "agreement") {
            this.UrlRedirectionForm.get("policywording").setValue("");
            this.agreementmail = 0;
          }
        } else {
          if (Type == "agreement") {
            this.agreementmail = 1;
            this.agreement = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "agreement") {
          this.UrlRedirectionForm.get("Mandate").setValue("");
        }
      }
    }
  }

  MailLogs() {
    const dialogRef = this.dialog.open(MailLogsComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      data: {
        id: this.id,
        agentCode: this.agentCode,
        agreementStatus: this.agreementStatus,
      },
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
            // this.CloseModel22();
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

  CloseModel11(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
