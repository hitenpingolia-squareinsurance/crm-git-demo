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

@Component({
  selector: "app-agreement-active-inactive",
  templateUrl: "./agreement-active-inactive.component.html",
  styleUrls: ["./agreement-active-inactive.component.css"],
})
export class AgreementActiveInactiveComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  agreementForm: FormGroup;
  agreementUploadForm: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;
  loadAPI: Promise<any>;
  id: any;

  DownloadPdf: string;
  pdf: any;
  pdfTable: HTMLElement;
  attachement: any;
  http: any;
  rmId: any;
  MessageBody: string = "";
  popupType: string = "";
  Agreement_Id: any;

  Is_Accounts: any = 0;

  maxDate = new Date();
  minDate = new Date();

  // startdate: any;

  // dataAr2: any;

  ckconfig = {
    height: 360,
    allowedContent: true,
  };

  selectedFiles: File;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgreementActiveInactiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.rmId = this.data.RMID;
    this.MessageBody = this.data.message;
    this.popupType = this.data.popupType;
    this.Agreement_Id = this.data.Agreement_Id;

    this.Is_Accounts = this.data.Is_Accounts;

    //   //   //   console.log(this.data);

    //   //   //   console.log(this.id);

    if (this.popupType == "Upload") {
      this.agreementUploadForm = this.formBuilder.group({
        pdfFile: ["", Validators.required],
        Status: [""],
        Remark: ["", Validators.required],
      });
    } else {
      this.agreementForm = this.formBuilder.group({
        startDate: ["", Validators.required],
        endDate: ["", Validators.required],
        Message: ["", Validators.required],
      });
    }
  }

  ngOnInit() {}

  get formControls() {
    return this.agreementForm.controls;
  }
  get formControls1() {
    return this.agreementUploadForm.controls;
  }

  submit() {
    //   //   //   console.log(this.id);

    this.isSubmitted = true;
    if (this.agreementForm.invalid) {
      return;
    } else {
      var fields = this.agreementForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserId());
      formData.append("agent_id", this.id);
      formData.append("rmEmpId", this.rmId);

      formData.append("PdfContent", fields["Message"]);
      formData.append("startDate", fields["startDate"]);
      formData.append("endDate", fields["endDate"]);

      //   //   //   console.log(fields);

      this.api.IsLoading();
      this.api
        .HttpPostType("../v2/reports/Agreement/UploadAgreement", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            //   //   //   console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", "Successfully Submit..!");
              // this.generatePDF();
              this.CloseModel();
            } else {
              const msg = "msg";
              //alert(result['message']);
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            // Error log
            // console.log(err);
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

  UploadDocs(event) {
    this.selectedFiles = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      //   //   console.log(this.selectedFiles);
      //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 3) {
          // allow only 3 mb
          this.api.Toast("Warning", "File size is greater than 3 mb");
          this.agreementUploadForm.get("pdfFile").setValue("");
          this.agreementUploadForm.get("pdfFile").updateValueAndValidity();
        } else {
        }
      } else {
        //   //   console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        this.agreementUploadForm.get("pdfFile").setValue("");
        this.agreementUploadForm.get("pdfFile").updateValueAndValidity();
      }
    }
  }

  UploadAgreementPDF() {
    //   //   //   console.log(this.id);

    this.isSubmitted1 = true;
    if (this.agreementUploadForm.invalid) {
      return;
    } else {
      var fields = this.agreementUploadForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserId());
      formData.append("agent_id", this.id);
      formData.append("rmEmpId", this.rmId);
      formData.append("Agreement_Id", this.Agreement_Id);

      formData.append("PDF_File", this.selectedFiles);
      formData.append("Status", fields["Status"]);
      formData.append("Remark", fields["Remark"]);

      ////   //   console.log(fields);

      this.api.IsLoading();
      this.api
        .HttpPostType("../v2/reports/Agreement/UploadAgreementPDF", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            ////   //   console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", "Upload Successfully..!");

              this.CloseModel();
            } else {
              const msg = "msg";
              //alert(result['message']);
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            // Error log
            // console.log(err);
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

  onKeyUpEvent() {
    var startDate = this.agreementForm.get("startDate").value;
    this.minDate = startDate;
    //   //   //   console.log(this.minDate);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
