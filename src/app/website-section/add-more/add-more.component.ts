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
import { CKEditorComponent } from "ckeditor4-angular";

@Component({
  selector: "app-add-more",
  templateUrl: "./add-more.component.html",
  styleUrls: ["./add-more.component.css"],
})
export class AddMoreComponent implements OnInit {
  AddMoreData: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  image: File;
  currentUrl: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddMoreData = this.formBuilder.group({
      heading: [""],
      image: ["", Validators.required],
      title: [""],
      description: [""],
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);

    const heading = this.AddMoreData.get("heading");
    const title = this.AddMoreData.get("title");
    const description = this.AddMoreData.get("description");

    if (this.currentUrl == "/WebsiteSection/gallery") {
      heading.setValidators([Validators.required]);
    }

    if (this.currentUrl == "/WebsiteSection/testimonials") {
      title.setValidators([Validators.required]);
      description.setValidators([Validators.required]);
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.AddMoreData.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddMoreData.invalid) {
      return;
    } else {
      var fields = this.AddMoreData.value;
      const formData = new FormData();
      formData.append("login_type", this.api.GetUserType());

      formData.append("login_id", this.api.GetUserData("Id"));

      formData.append("CurrentUrl", this.currentUrl);

      formData.append("heading", fields["heading"]);
      formData.append("image", this.image);
      formData.append("title", fields["title"]);
      formData.append("description", fields["description"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("WebsiteSection/AddMoreData", formData).then(
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

          if (Type == "image") {
            this.AddMoreData.get("image").setValue("");
          }
        } else {
          if (Type == "image") {
            this.image = this.SelectedFiles;
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
