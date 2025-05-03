import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sr-cancel-action",
  templateUrl: "./sr-cancel-action.component.html",
  styleUrls: ["./sr-cancel-action.component.css"],
})
export class SrCancelActionComponent implements OnInit {
  ActionForm: FormGroup;
  isSubmitted = false;
  Id: any;
  row: any;
  User_Rights: any = [];
  StepData: any = [];

  BI_Document!: File;
  Proposal_Form!: File;
  selectedFiles!: File;
  Step_Id: any;
  BookingDate: string;

  constructor(
    public dialogRef: MatDialogRef<SrCancelActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ActionForm = this.formBuilder.group({
      SR_Status: [""],
      SR_Cancel_Status: [""],
      Remark: [""],
    });
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.GetSR();
    this.addPrevious_CC();
  }

  get FC_6() {
    return this.ActionForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== GET SR DETAILS =====//
  GetSR() {
    const formData = new FormData();

    formData.append("Id", this.Id);

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/GetSrStatusDetails", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.StepData = result["Data"];
          this.Step_Id = this.StepData["Id"];

          //If Cancel Due To Underwriter is Already Updated
          if (this.StepData["SR_Status"] == 10) {
            this.ActionForm.get("SR_Status").setValue("10");
          }

          this.User_Rights = result["SR_User_Rights"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  //===== SUBMIT STEP 6 DATA =====//
  SubmitStep_VI() {
    var fields = this.ActionForm.value;

    const formData = new FormData();

    formData.append("SR_Id", this.Id);
    formData.append("Step_Id", this.Step_Id);
    formData.append("LOB_Id", "LI");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SR_Status", fields["SR_Status"]);
    formData.append("SR_Cancel_Status", fields["SR_Cancel_Status"]);

    formData.append("Remark", fields["Remark"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/UpdateCancelSrStatus", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.api.Toast("Success", result["Message"]);
          this.CloseModel();
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }

  //===== UPLOAD DOCS ======//
  UploadDocs(event, Type) {
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

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
          if (Type == "BI_Document") {
            this.ActionForm.get("BI_Document").setValue("");
          }
          if (Type == "Proposal_Form") {
            this.ActionForm.get("Proposal_Form").setValue("");
          }
        } else {
          if (Type == "BI_Document") {
            this.BI_Document = this.selectedFiles;
          }
          if (Type == "Proposal_Form") {
            this.Proposal_Form = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        if (Type == "BI_Document") {
          this.ActionForm.get("BI_Document").setValue("");
        }
        if (Type == "Proposal_Form") {
          this.ActionForm.get("Proposal_Form").setValue("");
        }
      }
    }
  }

  /*LI Previous_Companies*/
  Insurer_CC_Array_FN(): FormArray {
    return this.ActionForm.get("Insurer_CC_Array") as FormArray;
  }

  newPrevious_CC(): FormGroup {
    return this.formBuilder.group({
      Insurer_CC_Email: "",
    });
  }

  addPrevious_CC() {
    this.Insurer_CC_Array_FN().push(this.newPrevious_CC());
  }

  removePrevious_CC(i: number) {
    this.Insurer_CC_Array_FN().removeAt(i);
  }
  /*LI Previous_Companies*/

  //===== ON DATES CHANGES =====//
  GetBookingDate(e: any, type) {
    if (e != null && type == "Policy_Iss_Date") {
      var selectedDate = new Date(e);
      // console.log(selectedDate);
      selectedDate.setDate(selectedDate.getDate() + 20);
      // console.log(selectedDate);

      var d = new Date(selectedDate);
      var newDate =
        d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
      this.BookingDate = newDate;

      this.ActionForm.get("Booking_Date").setValue(newDate);
    }
  }

  ShowSubOption(e: any) {}
}
