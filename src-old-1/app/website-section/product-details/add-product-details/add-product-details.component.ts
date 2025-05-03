import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-add-product-details",
  templateUrl: "./add-product-details.component.html",
  styleUrls: ["./add-product-details.component.css"],
})
export class AddProductDetailsComponent implements OnInit {
  Addposter: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PosterImage: File;
  loginform: any;
  og_image: File;
  TwitterImage: File;
  ActionType: any;
  FormId: any;
  DataResult: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ActionType = this.data.ActionType;
    this.FormId = this.data.FormId;

    this.loginform = this.formBuilder.group({
      Title: "",
      metakeyword: "",
      metadescription: "",
      meta_robots: "",
      meta_viewports: "",
      meta_detection: "",
      og_type: "",
      og_image: "",
      og_locale: "",
      og_site_name: "",
      og_url: ["", Validators.required],
      og_title: "",
      og_description: "",
      twitter_url: "",
      twitter_description: "",
      twitter_title: "",
      twitter_card: "",
      twitter_creator: "",
      canonical_link: "",
      slug: "",
      twitter_image: "",
      // ckeditorContent: ('')
    });

    if (this.ActionType == "Edit") {
      this.getEditForm(this.FormId);
    }
  }
  ngOnInit() { }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getEditForm(Id: any) {
    const formData = new FormData();
    formData.append("Id", Id);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteSection/GetSingleProductDetails", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.DataResult = result["Data"];

            this.loginform.get("Title").setValue(result["Data"].Title);
            this.loginform
              .get("metakeyword")
              .setValue(result["Data"].metakeyword);
            this.loginform
              .get("metadescription")
              .setValue(result["Data"].metadescription);
            this.loginform
              .get("meta_robots")
              .setValue(result["Data"].meta_robots);
            this.loginform
              .get("meta_viewports")
              .setValue(result["Data"].meta_viewports);
            this.loginform
              .get("meta_detection")
              .setValue(result["Data"].meta_detection);
            this.loginform.get("og_type").setValue(result["Data"].og_type);
            this.loginform.get("og_locale").setValue(result["Data"].og_locale);
            this.loginform
              .get("og_site_name")
              .setValue(result["Data"].og_site_name);
            this.loginform.get("og_url").setValue(result["Data"].og_url);
            this.loginform.get("og_title").setValue(result["Data"].og_title);
            this.loginform
              .get("og_description")
              .setValue(result["Data"].og_description);
            this.loginform
              .get("twitter_url")
              .setValue(result["Data"].twitter_url);
            this.loginform
              .get("twitter_description")
              .setValue(result["Data"].twitter_description);
            this.loginform
              .get("twitter_title")
              .setValue(result["Data"].twitter_title);
            this.loginform
              .get("twitter_card")
              .setValue(result["Data"].twitter_card);
            this.loginform
              .get("twitter_creator")
              .setValue(result["Data"].twitter_creator);
            this.loginform
              .get("canonical_link")
              .setValue(result["Data"].canonical_link);
           
          
            this.loginform.get("slug").setValue(result["Data"].slug);
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

  get FC() {
    return this.loginform.controls;
  }

  collectData() {
    this.isSubmitted = true;
    if (this.loginform.invalid) {
      return;
    } else {
      var fields = this.loginform.value;
      const formData = new FormData();
      formData.append("Id", this.FormId);
      formData.append("ActionType", this.ActionType);

      formData.append("title", fields["Title"]);
      formData.append("metakeyword", fields["metakeyword"]);
      formData.append("metadescription", fields["metadescription"]);
      formData.append("meta_robots", fields["meta_robots"]);
      formData.append("meta_viewports", fields["meta_viewports"]);
      formData.append("meta_detection", fields["meta_detection"]);
      formData.append("og_type", fields["og_type"]);
      formData.append("og_locale", fields["og_locale"]);
      formData.append("og_site_name", fields["og_site_name"]);
      formData.append("og_url", fields["og_url"]);
      formData.append("og_title", fields["og_title"]);
      formData.append("og_description", fields["og_description"]);
      formData.append("twitter_url", fields["twitter_url"]);
      formData.append("twitter_description", fields["twitter_description"]);
      formData.append("twitter_title", fields["twitter_title"]);
      formData.append("canonical_link", fields["canonical_link"]);
      formData.append("slug", fields["slug"]);
      formData.append("twitter_card", fields["twitter_card"]);
      formData.append("twitter_creator", fields["twitter_creator"]);
      // formData.append("ckeditorContent", fields["ckeditorContent"]);
      formData.append("og_image", this.og_image);
      formData.append("twitter_image", this.TwitterImage);


      this.api.IsLoading();
      this.api.HttpPostType("WebsiteSection/AddProductDetails", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
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

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.SelectedFiles = event.target.files[0];

    // console.log(this.SelectedFiles);
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf" || ext == "webp") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 10024) {
          // allow only 1 mb
          this.api.Toast("Warning", "File size is greater than 1 mb");

          if (Type == "og_image") {
            this.loginform.get("og_image").setValue("");
          }

          if (Type == "twitter_image") {
            this.loginform.get("twitter_image").setValue("");
          }
        } else {
          if (Type == "og_image") {
            this.og_image = this.SelectedFiles;
          } else if (Type == "twitter_image") {
            this.TwitterImage = this.SelectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
}
