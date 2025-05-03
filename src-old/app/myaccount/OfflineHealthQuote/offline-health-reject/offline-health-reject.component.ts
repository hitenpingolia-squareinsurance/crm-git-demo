import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-offline-health-reject",
  templateUrl: "./offline-health-reject.component.html",
  styleUrls: ["./offline-health-reject.component.css"],
})
export class OfflineHealthRejectComponent implements OnInit {
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
    private dialogRef: MatDialogRef<OfflineHealthRejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
    //   //   //   console.log(this.data);

    this.modalForm = this.formBuilder.group({
      remarks: ["", Validators.required],
      statusdocument: [null],
    });
  }

  ngOnInit() {
    this.GetRow();
  }

  //FORM CONTROLS
  get formControls() {
    return this.modalForm.controls;
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
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Quotation", this.Id);
      formData.append("remarks", fields["remarks"]);

      this.api.IsLoading();
      this.api.HttpPostType("Offlinehealthquote/RejectedQuote", formData).then(
        (result) => {
          this.api.HideLoading();

          //   //   //   console.log(result);

          if (result["status"] == 1) {
            this.buttonDisable = false;

            this.api.Toast("Success", result["msg"]);
            this.dialogRef.close();
            this.GetRow();
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
