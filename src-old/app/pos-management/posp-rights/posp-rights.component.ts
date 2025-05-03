import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
// import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-posp-rights",
  templateUrl: "./posp-rights.component.html",
  styleUrls: ["./posp-rights.component.css"],
})
export class PospRightsComponent implements OnInit {
  UrlRedirectionForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

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
  SelectGeneralValue: any;
  SelectlifeValue: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PospRightsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agentCode = this.data.agentCode;

    this.UrlRedirectionForm = this.formBuilder.group({
      agreementYear: [""],
    });
  }

  ngOnInit() {
    this.getValueEdit();
  }
  updateSelectGeneralValue(event: any) {
    this.SelectGeneralValue = event.target.checked ? 1 : 0;
  }
  updateSelectLifeValue(event: any) {
    this.SelectlifeValue = event.target.checked ? 1 : 0;
  }

  getValueEdit() {
    const formData = new FormData();

    formData.append("agentCode", this.agentCode);

    this.api.IsLoading();
    this.api.HttpPostType("Url_Redirection/GetStatus", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.dataArr = result["data"];
          if (this.dataArr.general == 1) {
            this.SelectGeneralValue = this.dataArr.general;
          } else {
            this.SelectGeneralValue = "0";
          }
          if (this.dataArr.life == 1) {
            this.SelectlifeValue = this.dataArr.life;
          } else {
            this.SelectlifeValue = "0";
          }
          // console.log(this.dataArr);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  get formControls() {
    return this.UrlRedirectionForm.controls;
  }

  submit() {
    const formData = new FormData();

    formData.append("SelectGeneralValue", this.SelectGeneralValue);
    formData.append("SelectlifeValue", this.SelectlifeValue);
    formData.append("agentCode", this.agentCode);

    this.url = "/Url_Redirection/GetStatusupdate";

    this.api.IsLoading();
    this.api.HttpPostType(this.url, formData).then(
      (result) => {
        this.api.HideLoading();
        //console.log(result);
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          this.CloseModel11();
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  CloseModel11(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
