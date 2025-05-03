import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-status-box",
  templateUrl: "./status-box.component.html",
  styleUrls: ["./status-box.component.css"],
})
export class StatusBoxComponent implements OnInit {
  modalForm: FormGroup;
  isSubmitted = false;
  selectedFiles: File;
  alternatePolicy: File;
  customerLetter: File;
  CurrentClaimStatus: any;
  row: any;
  currentSatatus: string;
  status: any;
  Id: any;
  status_document: File;
  buttonDisable = false;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<StatusBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.status = this.data.Status;
    this.Id = this.data.Id;
    this.modalForm = this.formBuilder.group({
      remarks: ["", Validators.required],
      statusdocument: [null],
    });
  }

  ngOnInit() {}

  //FORM CONTROLS
  get formControls() {
    return this.modalForm.controls;
  }

  checkFileType(event: any, Type: any) {
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
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 3) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
        } else {
          if (Type == "status_document") {
            this.status_document = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
  //===== SUBMIT CANCELLATION REQUEST =====//
  submitStatusRequest() {
    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      var fields = this.modalForm.value;
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("claimId", this.Id);
      formData.append("ClaimStatus", this.status);
      formData.append("Document", this.status_document);
      formData.append("remarks", fields["remarks"]);
      formData.append("CaseType", fields["CaseType"]);
      formData.append("AccessAmount", fields["AccessAmount"]);

      this.api.IsLoading();
      this.api.HttpPostType("Claim/UpdateStatus", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["status"] == 1) {
            this.buttonDisable = false;

            this.api.Toast("Success", result["msg"]);
            this.dialogRef.close();
          } else {
            this.buttonDisable = false;

            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.buttonDisable = false;

          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  GetRow() {
    throw new Error("Method not implemented.");
  }
}
