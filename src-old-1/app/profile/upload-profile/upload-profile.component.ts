import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-upload-profile",
  templateUrl: "./upload-profile.component.html",
  styleUrls: ["./upload-profile.component.css"],
})
export class UploadProfileComponent implements OnInit {
  UploadProfile: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  UploadProfilephoto: File;

  Category: { Id: string; Name: string }[];
  type: any;
  id: any;
  dataArr: any;
  minDisableDate: any;
  categoryName: any;
  url: string;
  Docs_Type: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<UploadProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.UploadProfile = this.formBuilder.group({
      uploadProfilephoto: ["", Validators.required],
    });
  }

  ngOnInit() {}

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.UploadProfile.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.UploadProfile.invalid) {
      return;
    } else {
      var fields = this.UploadProfile.value;
      const formData = new FormData();

      formData.append("image", this.UploadProfilephoto);
      formData.append("docs_type", this.Docs_Type);

      this.api.IsLoading();

      this.api.HttpPostType("Profile/UploadProfile", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["/Assets/Products"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
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

  UploadDocs(event, Type) {
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "uploadProfilephoto") {
            this.UploadProfile.get("uploadProfilephoto").setValue("");
          }
        } else {
          if (Type == "uploadProfilephoto") {
            this.UploadProfilephoto = this.SelectedFiles;
            this.Docs_Type = "Profile";
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
}
