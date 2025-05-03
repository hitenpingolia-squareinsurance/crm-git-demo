import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sr-status-action",
  templateUrl: "./sr-status-action.component.html",
  styleUrls: ["./sr-status-action.component.css"],
})
export class SrStatusActionComponent implements OnInit {
  ActionForm: FormGroup;
  isSubmitted = false;
  Id: any;
  Lob_Name: any;
  row: any;
  User_Rights: any = [];
  StepData: any = [];

  BI_Document!: File;
  Proposal_Form!: File;
  Policy_PDF!: File;
  selectedFiles!: File;
  Policy_Pdf!: File;
  Step_Id: any;
  BookingDate: string;

  constructor(
    public dialogRef: MatDialogRef<SrStatusActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ActionForm = this.formBuilder.group({
      SR_Status: [""],
      Remark: [""],
      BI_Document: [""],
      Insurer_To_Email: [""],
      Insurer_CC_Array: this.formBuilder.array([]),
      Proposal_Form: [""],
      Login_Date: [""],
      Policy_Issuance_Date: [""],
      Renewal_Date: [""],
      Booking_Date: [""],
      Policy_No: [""],
      Policy_Pdf: [""],
    });
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.Lob_Name = this.data.Lob_Name;
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

  Reject() {}

  //===== GET SR DETAILS =====//
  GetSR() {
    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("Lob_Name", this.Lob_Name);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/GetSrStatusDetails", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.StepData = result["Data"];
          this.Step_Id = this.StepData["Id"];
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
  SubmitActionForm() {
    var fields = this.ActionForm.value;

    const formData = new FormData();

    var Status = fields["SR_Status"];
    if (fields["SR_Status"] == 0) {
      Status = "";
    }

    formData.append("SR_Id", this.Id);
    formData.append("Step_Id", this.Step_Id);
    formData.append("LOB_Id", this.Lob_Name);
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SR_Status", Status);

    //===If Lob Is Life===//
    if (this.StepData["LOB_Id"] == "LI" && this.Lob_Name == "LI") {
      if (fields["SR_Status"] == 1) {
        formData.append("Input_BI_Document", fields["BI_Document"]);
      }

      if (fields["SR_Status"] == "2" || fields["SR_Status"] == 1) {
        formData.append("Insurer_To_Email", fields["Insurer_To_Email"]);
        formData.append(
          "Insurer_CC_Array",
          JSON.stringify(fields["Insurer_CC_Array"])
        );
      }

      if (fields["SR_Status"] == 3) {
        formData.append("Input_Proposal_Form", fields["Proposal_Form"]);
      }

      if (fields["SR_Status"] == 8) {
        formData.append("Input_Policy_Pdf", fields["Policy_Pdf"]);
      }

      formData.append("BI_Document", this.BI_Document);
      formData.append("Proposal_Form", this.Proposal_Form);
      formData.append("Login_Date", fields["Login_Date"]);
      formData.append("Policy_Issuance_Date", fields["Policy_Issuance_Date"]);
      formData.append("Renewal_Date", fields["Renewal_Date"]);
      formData.append("Booking_Date", this.BookingDate);
      formData.append("Policy_No", fields["Policy_No"]);
      formData.append("Policy_Pdf", this.Policy_Pdf);

      //===If Lob Is Non Motor Or Health===//
    }

    formData.append("Remark", fields["Remark"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/UpdateSrStatus", formData).then(
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
  UploadDocs(event: any, Type: any) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   //   console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   //   console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
          if (Type == "BI_Document") {
            this.ActionForm.get("BI_Document").setValue("");
          }
          if (Type == "Proposal_Form") {
            this.ActionForm.get("Proposal_Form").setValue("");
          }
          if (Type == "Policy_PDF") {
            this.ActionForm.get("Policy_PDF").setValue("");
          }
        } else {
          if (Type == "BI_Document") {
            this.BI_Document = this.selectedFiles;
          }
          if (Type == "Proposal_Form") {
            this.Proposal_Form = this.selectedFiles;
          }
          if (Type == "Policy_PDF") {
            this.Policy_PDF = this.selectedFiles;
          }
        }
      } else {
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
        if (Type == "Policy_PDF") {
          this.ActionForm.get("Policy_PDF").setValue("");
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
      //   //   //   console.log(selectedDate);
      selectedDate.setDate(selectedDate.getDate() + 30);
      //   //   //   console.log(selectedDate);

      var d = new Date(selectedDate);
      var newDate =
        d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
      this.BookingDate = newDate;

      this.ActionForm.get("Booking_Date").setValue(newDate);
    }
  }
}
