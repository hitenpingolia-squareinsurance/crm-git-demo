import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-mandate-letter-form",
  templateUrl: "./mandate-letter-form.component.html",
  styleUrls: ["./mandate-letter-form.component.css"],
})
export class MandateLetterFormComponent implements OnInit {
  modalForm: FormGroup;
  isSubmitted = false;

  buttonDisable = false;
  selectedFiles: File;
  mandateLetter!: File;
  RejectionDetails: any = [];
  Other_image: any = 0;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<MandateLetterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.formBuilder.group({
      mandateLetter: ["", Validators.required],
      remarks: [null],
    });
  }

  ngOnInit() {
    if (this.data.CurrentStatus == "Rejected") {
      this.GetRejectionDetails();
    }
  }

  //FORM CONTROLS
  get formControls() {
    return this.modalForm.controls;
  }

  //===== GET REJECTION DETAILS =====//
  GetRejectionDetails() {
    const formData = new FormData();
    formData.append("SrId", this.data.Id);
    formData.append("SrNo", this.data.SR_No);

    this.api
      .HttpPostTypeBms(
        "reports/MandateLetterReport/GetRejectionDetails",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.RejectionDetails = result["Data"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.Other_image = 0;
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
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

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 1 mb");
        } else {
          if (Type == "Mandate_Letter") {
            this.mandateLetter = this.selectedFiles;
          }
          this.Other_image = 1;
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  //===== SUBMIT MANDATE LETTER =====//
  submitMandateLetter() {
    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      var fields = this.modalForm.value;
      const formData = new FormData();

      formData.append("Portal", "CRM");
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("SrId", this.data.Id);
      formData.append("SrNo", this.data.SR_No);
      formData.append("mandateLetter", this.mandateLetter);
      formData.append("remarks", fields["remarks"]);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "reports/MandateLetterReport/submitMandateLetter",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.buttonDisable = false;

              this.api.Toast("Success", result["Message"]);
              this.dialogRef.close();
            } else {
              this.buttonDisable = false;

              const msg = "msg";
              this.api.Toast("Warning", result["Message"]);
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

  //===== CLOSE MODAL =====//
  CloseModel() {
    this.dialogRef.close();
  }
}
