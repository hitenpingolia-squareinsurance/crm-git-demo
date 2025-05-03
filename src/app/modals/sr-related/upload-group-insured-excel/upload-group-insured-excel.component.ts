import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-upload-group-insured-excel",
  templateUrl: "./upload-group-insured-excel.component.html",
  styleUrls: ["./upload-group-insured-excel.component.css"],
})
export class UploadGroupInsuredExcelComponent implements OnInit {
  ActionForm: FormGroup;
  isSubmitted = false;
  SR_Id: any = 0;
  NetPremium: any = 0;
  row: any;
  User_Rights: any = [];
  ActionTypeArray: any = [];
  PaymentModeArray: any = [];
  ExcelFile: File;
  EndorsementFile: File;
  PaymentReciept: File;

  selectedFiles: File;
  Other_image1: any = 0;
  Other_image2: any = 0;
  Other_image3: any = 0;

  url_segment: any = "";
  btndisable: boolean = false;

  dropdownSettingsingleselect: {};

  constructor(
    public dialogRef: MatDialogRef<UploadGroupInsuredExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ActionForm = this.formBuilder.group({
      Action_Type: ["", [Validators.required]],
      Payment_Mode: ["", [Validators.required]],
      BookingDate: ["", [Validators.required]],
      NetPremium: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      GrossPremium: [
        "",
        [Validators.required, Validators.pattern("^[0-9.]*$")],
      ],
      SumAssured: ["", [Validators.pattern("^[0-9]*$")]],
      ExcelFile: [""],
      EndorsementFile: [""],
      PaymentReciept: [""],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
    };
  }

  ngOnInit() {
    this.SR_Id = this.data.SR_Id;
    this.NetPremium = this.data.NetPremium;
    this.url_segment = this.data.url_segment;

    this.ActionTypeArray = [
      { Id: "Bulk_Add", Name: "Add" },
      { Id: "Bulk_Delete", Name: "Delete" },
    ];
    this.PaymentModeArray = [
      { Id: "Cheque", Name: "Cheque" },
      { Id: "RTGS", Name: "RTGS" },
      { Id: "NEFT", Name: "NEFT" },
      { Id: "IMPS", Name: "IMPS" },
      { Id: "UPI", Name: "UPI" },
      { Id: "Card", Name: "Card" },
      { Id: "Online", Name: "Online" },
    ];
  }

  get FC_1() {
    return this.ActionForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== ENABLE/DISABLE VALIDATOR =====//
  EnableDisableValidation() {
    if (
      this.ActionForm.value["Action_Type"].length > 0 &&
      this.ActionForm.value["Action_Type"][0]["Id"] == "Bulk_Delete"
    ) {
      this.ActionForm.get("SumAssured").setValidators(null);
    } else {
      this.ActionForm.get("SumAssured").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]);
    }

    this.ActionForm.get("SumAssured").updateValueAndValidity();
  }

  //===== UPLOAD DOCS ======//
  UploadDocs(event: any, Type: any) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (Type == "ExcelFile") {
        this.Other_image1 = 0;

        if (ext == "xlsx") {
          // console.log('Extenstion is vaild !');
          var file_size = event.target.files[0]["size"];
          const Total_Size = Math.round(file_size / 1024);

          // console.log(Total_Size + ' kb');

          if (Total_Size >= 1024 * 3) {
            // allow only 2 mb
            this.api.Toast("Error", "File size is greater than 3 mb");
            if (Type == "ExcelFile") {
              this.ActionForm.get("ExcelFile").setValue("");
            }
          } else {
            if (Type == "ExcelFile") {
              this.ExcelFile = this.selectedFiles;
              this.Other_image1 = 1;
            }
          }
        } else {
          this.api.Toast("Error", "Please choose vaild file ! Example :- xlsx");
          if (Type == "ExcelFile") {
            this.ActionForm.get("ExcelFile").setValue("");
          }
        }
      } else {
        if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
          // console.log('Extenstion is vaild !');
          var file_size = event.target.files[0]["size"];
          const Total_Size = Math.round(file_size / 1024);

          // console.log(Total_Size + ' kb');

          if (Total_Size >= 1024 * 3) {
            // allow only 2 mb
            this.api.Toast("Error", "File size is greater than 3 mb");
            if (Type == "EndorsementFile") {
              this.Other_image2 = 0;
              this.ActionForm.get("EndorsementFile").setValue("");
            }

            if (Type == "PaymentReciept") {
              this.Other_image3 = 0;
              this.ActionForm.get("PaymentReciept").setValue("");
            }
          } else {
            if (Type == "EndorsementFile") {
              this.EndorsementFile = this.selectedFiles;
              this.Other_image2 = 1;
            }

            if (Type == "PaymentReciept") {
              this.PaymentReciept = this.selectedFiles;
              this.Other_image3 = 1;
            }
          }
        } else {
          this.api.Toast(
            "Error",
            "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
          );
          if (Type == "EndorsementFile") {
            this.Other_image2 = 0;
            this.ActionForm.get("EndorsementFile").setValue("");
          }
          if (Type == "PaymentReciept") {
            this.Other_image3 = 0;
            this.ActionForm.get("PaymentReciept").setValue("");
          }
        }
      }
    }
  }

  //===== ADD NEW EMPLOYEE DATA =====//
  BulkUploadExcel() {
    this.isSubmitted = true;
    if (this.ActionForm.invalid) {
      return;
    } else {
      this.btndisable = true;

      var fields = this.ActionForm.value;
      const formData = new FormData();

      formData.append("SR_Id", this.SR_Id);
      formData.append("url_segment", this.url_segment);
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Action_Type", JSON.stringify(fields["Action_Type"]));
      formData.append("Payment_Mode", JSON.stringify(fields["Payment_Mode"]));
      formData.append("InputExcelFile", fields["ExcelFile"]);
      formData.append("ExcelFile", this.ExcelFile);
      formData.append("EndorsementFile", this.EndorsementFile);
      formData.append("PaymentReciept", this.PaymentReciept);
      formData.append("BookingDate", fields["BookingDate"]);
      formData.append("NetPremium", fields["NetPremium"]);
      formData.append("GrossPremium", fields["GrossPremium"]);
      formData.append("SumAssured", fields["SumAssured"]);

      this.api.IsLoading();
      this.api.HttpForSR("post", "GroupSrRelated/ImportAction", formData).then(
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
  }

  //===== PREMIUM CALUATION =====//
  LifeCalculation(Type: any) {
    var fields = this.ActionForm.value;

    const formData = new FormData();

    formData.append("CurrentInput", Type);

    formData.append("NetPremium", fields["NetPremium"]);
    formData.append("GrossPremium", fields["GrossPremium"]);

    this.api.HttpForSR("post", "LifeGroup/CalculatePremium", formData).then(
      (result) => {
        if (result["Status"] == true) {
          var res = result["Data"];

          var NetPremiumControl = this.ActionForm.get("NetPremium");
          var GrossPremiumControl = this.ActionForm.get("GrossPremium");

          if (Type == "NetPremium") {
            GrossPremiumControl.setValue(res["GrossPremium"]);
            GrossPremiumControl.updateValueAndValidity();
          }

          if (Type == "GrossPremium") {
            NetPremiumControl.setValue(res["NetPremium"]);
            NetPremiumControl.updateValueAndValidity();
          }
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error, Please try again ! ");
      }
    );
  }
}
