import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api.service";

@Component({
  selector: "app-add-data",
  templateUrl: "./add-data.component.html",
  styleUrls: ["./add-data.component.css"],
})
export class AddDataComponent implements OnInit {
  AddFieldForm: FormGroup;

  isSubmitted = false;
  showlobfield = false;

  type: any[];
  LobData: any[];
  dropdownSettingsingleselect: any;
  selectedFiles: any;

  file: File;

  constructor(
    public dialogRef: MatDialogRef<AddDataComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      fileuplode: ["", Validators.required],
      type: ["", Validators.required],
      lob: [""],
    });

    this.type = [
      { Id: "POS", Name: "POS" },
      { Id: "BUSINESS", Name: "BUSINESS" },
    ];
  }

  ngOnInit() {}

  get formControls() {
    return this.AddFieldForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  Submit() {
    this.isSubmitted = true;
    if (this.AddFieldForm.invalid) {
      // console.log(321)
      return;
    } else {
      // console.log(123)
      var fields = this.AddFieldForm.value;
      const formData = new FormData();

      formData.append("login_id", this.api.GetUserData("Code"));

      formData.append("fileuplode", fields["fileuplode"]);
      formData.append("type", JSON.stringify(fields["type"]));
      formData.append("lob", JSON.stringify(fields["lob"]));
      formData.append("file", this.file);

      this.api.IsLoading();
      this.api.HttpPostType("DataDirectory/read_csv", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
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

  UpdateTypeValue(Value: any) {
    const selectedValue = Value["Id"];

    // console.log(selectedValue)

    if (selectedValue === "BUSINESS") {
      this.showlobfield = true;

      this.LobData = [
        { Id: "MOTOR", Name: "MOTOR" },
        { Id: "HEALTH", Name: "HEALTH" },
      ];

      this.AddFieldForm.get("lob").setValidators(Validators.required);
    } else {
      this.showlobfield = false;
    }
  }

  UploadDocs(event, Type) {
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

      if (ext == "csv") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 8) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.AddFieldForm.get("fileuplode").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast("Warning", "Please choose vaild file ! Example :- csv");

        if (Type == "file") {
          this.AddFieldForm.get("fileuplode").setValue("");
        }
      }
    }
  }
}
