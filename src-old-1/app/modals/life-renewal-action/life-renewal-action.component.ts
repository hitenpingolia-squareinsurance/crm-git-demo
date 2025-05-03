import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-life-renewal-action",
  templateUrl: "./life-renewal-action.component.html",
  styleUrls: ["./life-renewal-action.component.css"],
})
export class LifeRenewalActionComponent implements OnInit {
  ActionForm: FormGroup;
  isSubmitted = false;
  Id: any;
  Track_Id: any;
  Lob_Name: any;
  row: any;
  User_Rights: any = [];
  StepData: any = [];
  Payment_Mode_Ar: any = [];

  Payment_Reciept: File;
  selectedFiles: File;
  Step_Id: any;
  BookingDate: string;
  Other_image: any = 0;
  dropdownSettingsingleselect: {};

  constructor(
    public dialogRef: MatDialogRef<LifeRenewalActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ActionForm = this.formBuilder.group({
      Payment_Reference_No: [""],
      Payment_Reciept: [""],
      Payment_Date: [""],
      Payment_Mode: [""],
      Remark: [""],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.Track_Id = this.data.Track_Id;
    this.GetSR();
    this.Payment_Mode_Ar = [
      { Id: "Cheque", Name: "Cheque" },
      { Id: "UPI", Name: "UPI" },
      { Id: "Online Payment Link", Name: "Online Payment Link" },
      { Id: "CDCI", Name: "CDCI" },
      { Id: "NEFT", Name: "NEFT" },
    ];
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
    formData.append("Lob_Name", "LI");
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

    formData.append("SR_Id", this.Id);
    formData.append("Step_Id", this.Step_Id);
    formData.append("Track_Id", this.Track_Id);
    formData.append("LOB_Id", "LI");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    formData.append("Reference_No", fields["Payment_Reference_No"]);
    formData.append("Payment_Date", fields["Payment_Date"]);
    formData.append("Payment_Mode", JSON.stringify(fields["Payment_Mode"]));
    formData.append("Input_Payment_Reciept", fields["Payment_Reciept"]);
    formData.append("Payment_Reciept", this.Payment_Reciept);
    formData.append("Remark", fields["Remark"]);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Renewal/UpdateRenewalDetails", formData).then(
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
    this.Other_image = 0;
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
          if (Type == "Payment_Reciept") {
            this.ActionForm.get("Payment_Reciept").setValue("");
          }
        } else {
          if (Type == "Payment_Reciept") {
            this.Payment_Reciept = this.selectedFiles;
            this.Other_image = 1;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        if (Type == "Payment_Reciept") {
          this.ActionForm.get("Payment_Reciept").setValue("");
        }
      }
    }
  }
}
