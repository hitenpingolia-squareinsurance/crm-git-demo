import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { exit } from "process";

@Component({
  selector: "app-add-request-modal",
  templateUrl: "./add-request-modal.component.html",
  styleUrls: ["./add-request-modal.component.css"],
})
export class AddRequestModalComponent implements OnInit {
  modalForm: FormGroup;
  isSubmitted = false;

  buttonDisable = false;
  selectedFiles: File;
  alternatePolicy!: File;
  customerLetter!: File;
  cancelCheque: File;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.formBuilder.group({
      alternatePolicy: ["", Validators.required],
      customerLetter: ["", Validators.required],
      cancelCheque: [""],
      remarks: [null],
    });
  }

  ngOnInit() {}

  //FORM CONTROLS
  get formControls() {
    return this.modalForm.controls;
  }

  //===== CHECK IMAGE TYPE =====//
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
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
        } else {
          if (Type == "Alternate_policy") {
            this.alternatePolicy = this.selectedFiles;
          }
          if (Type == "Customer_letter") {
            this.customerLetter = this.selectedFiles;
          }
          if (Type == "Cancel_Cheque") {
            this.cancelCheque = this.selectedFiles;
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
  submitCancellationRequest() {
    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      var fields = this.modalForm.value;
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      formData.append("SrId", this.data.SrId);
      formData.append("SrNo", this.data.SrNo);
      formData.append("alternatePolicy", this.alternatePolicy);
      formData.append("customerLetter", this.customerLetter);
      formData.append("cancelCheque", this.cancelCheque);
      formData.append("remarks", fields["remarks"]);

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/cancellation/submitCancellationRequest", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == 1) {
              this.buttonDisable = false;

              this.api.Toast("Success", result["msg"]);
              this.dialogRef.close();
              this.route.navigate(["cancellation/view-requests"]);
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

  //===== CLOSE MODAL =====//
  close() {
    this.dialogRef.close();
  }
}
