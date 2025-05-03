import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-bulk-upload-excel-health",
  templateUrl: "./bulk-upload-excel-health.component.html",
  styleUrls: ["./bulk-upload-excel-health.component.css"],
})
export class BulkUploadExcelHealthComponent implements OnInit {
  ActionForm: FormGroup;
  isSubmitted = false;
  SR_Id: any = 0;
  NetPremium: any = 0;
  row: any;
  User_Rights: any = [];
  ActionTypeArray: any = [];
  PreNeedToArray: any = [];
  ExcelFile!: File;
  selectedFiles!: File;
  Other_image: any = 0;
  butDisabled: any = false;

  dropdownSettingsingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialogRef: MatDialogRef<BulkUploadExcelHealthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ActionForm = this.formBuilder.group({
      Action_Type: ["", [Validators.required]],
      ExcelFile: [""],
      PremiumNeedTo: [""],
      Previous_Premium: [""],
      Extra_Premium: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.SR_Id = this.data.SR_Id;
    this.NetPremium = this.data.NetPremium;
    this.ActionForm.get("Previous_Premium").setValue(this.NetPremium);

    this.ActionTypeArray = [
      { Id: "Bulk_Add", Name: "Add" },
      { Id: "Bulk_Edit", Name: "Edit" },
      { Id: "Bulk_Delete", Name: "Delete" },
    ];
    this.PreNeedToArray = [
      { Id: "Add", Name: "Add" },
      { Id: "Remove", Name: "Remove" },
      { Id: "NA", Name: "NA" },
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
    this.butDisabled = false;
    this.ActionForm.get("PremiumNeedTo").setValue("");
    this.ActionForm.get("Extra_Premium").setValidators([
      Validators.required,
      Validators.pattern("^[0-9]*$"),
    ]);
    this.ActionForm.get("Extra_Premium").updateValueAndValidity();
  }

  //===== ENABLE/DISABLE VALIDATOR =====//
  EnableDisableValidation1(e: any) {
    this.butDisabled = false;
    if (e == "enable") {
      this.ActionForm.get("Extra_Premium").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]);
      this.ActionForm.get("Extra_Premium").updateValueAndValidity();
    } else {
      if (e.Id == "NA") {
        this.butDisabled = true;
        this.ActionForm.get("Extra_Premium").setValidators(null);
        this.ActionForm.get("Extra_Premium").updateValueAndValidity();
      } else {
        this.ActionForm.get("Extra_Premium").setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]);
        this.ActionForm.get("Extra_Premium").updateValueAndValidity();
      }
    }
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

      if (ext == "xlsx") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
          if (Type == "ExcelFile") {
            this.ActionForm.get("ExcelFile").setValue("");
          }
        } else {
          if (Type == "ExcelFile") {
            this.ExcelFile = this.selectedFiles;
            this.Other_image = 1;
          }
        }
      } else {
        this.api.Toast("Error", "Please choose vaild file ! Example :- xlsx");
        if (Type == "ExcelFile") {
          this.ActionForm.get("ExcelFile").setValue("");
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
      var fields = this.ActionForm.value;
      const formData = new FormData();

      formData.append("SR_Id", this.SR_Id);
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Action_Type", JSON.stringify(fields["Action_Type"]));
      formData.append("InputExcelFile", fields["ExcelFile"]);
      formData.append("ExcelFile", this.ExcelFile);
      formData.append("PremiumNeedTo", JSON.stringify(fields["PremiumNeedTo"]));
      formData.append("Extra_Premium", fields["Extra_Premium"]);

      this.api.IsLoading();
      this.api.HttpForSR("post", "HealthGroup/ImportAction", formData).then(
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
}
