import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: 'app-pre-inspection-editpoup',
  templateUrl: './pre-inspection-editpoup.component.html',
  styleUrls: ['./pre-inspection-editpoup.component.css']
})
export class PreInspectionEditpoupComponent implements OnInit {
  preForm: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PPt: File;
  Video: File;

  type: any;
  id: any;
  dataArr: any;
  minDisableDate: any;
  categoryName: any;
  url: string;
  errorMsg: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<PreInspectionEditpoupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;


    this.preForm = this.formBuilder.group({
      company_name: ["", Validators.required],
      // url: ["", Validators.required],
      url: [""],
      PPt: [""],
      Video: [""],
    });


  }

  ngOnInit() {
    if (this.type == "Edit") {
      this.getValueEdit();
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getValueEdit() {

    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("PreInspection/GetEditValue", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);
        if (result["status"] == true) {
          this.dataArr = result["data"];
          // this.preForm.patchValue(this.dataArr);
          this.preForm.get('company_name').setValue(this.dataArr['company_name']);
          this.preForm.get('url').setValue(this.dataArr['url']);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  get formControls() {
    return this.preForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.preForm.invalid) {
      return;
    } else {
      var fields = this.preForm.value;
      const formData = new FormData();
      formData.append("company_name", fields["company_name"]);
      formData.append("url", fields["url"]);
      formData.append("image", this.PPt);
      formData.append("Video", this.Video);
      this.api.IsLoading();
      if (this.type == "Edit") {
        formData.append("Id", this.id);
        this.url = "PreInspection/Edit";
      }

      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          console.log(result)
          this.api.HideLoading();
          if (result['status'] == '1') {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            // this.CloseModel();
            if (result["msg"] == 'One field is required') {
              this.errorMsg = result["msg"]
            }
            this.api.Toast("Warning", result["msg"]);
          }
        },
        // this.api.HttpPostType(this.url, formData).then(
        //   (result: any) => {
        //     console.log(result);
        //     this.api.HideLoading();
        //     if (result['status'] == '1') {
        //       this.api.Toast("Success", result["msg"]);
        //       this.CloseModel();
        //     } else {
        //       const msg = "msg";
        //       this.CloseModel();
        //       this.api.Toast("Warning", result["msg"]);
        //     }
        //   },
        //   (err) => {
        //     // this.api.HideLoading();
        //     const newLocal = "Warning";

        //   }
      );
    }
  }

  // UploadDocs(event, Type) {
  //   this.SelectedFiles = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     var str = this.SelectedFiles.name;
  //     var ar = str.split(".");
  //     var ext;
  //     for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
  //     if (ext == "pdf" || ext == "jpg" || ext == "jpeg" || ext == "png") {
  //       var file_size = event.target.files[0]["size"];
  //       const Total_Size = Math.round(file_size / 1024);
  //       if (Total_Size >= 10240) {
  //         this.api.Toast("Error", "File size is greater than 10 mb");
  //         if (Type == "PPt") {
  //           this.preForm.get("PPt").setValue("");
  //         }
  //       } else {
  //         if (Type == "PPt") {
  //           this.PPt = this.SelectedFiles;
  //         }
  //       }
  //     } else {
  //       this.api.Toast(
  //         "Error",
  //         "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
  //       );
  //     }
  //   }
  // }
  UploadDocs(event, Type) {
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      if (ext == "pdf" || ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "mp4" || ext == "mov") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        if (Total_Size >= 10240) {
          this.api.Toast("Error", "File size is greater than 10 mb");
          if (Type == "PPt") {
            this.preForm.get("PPt").setValue("");
          }
          if (Type == "Video") {
            this.preForm.get("Video").setValue("");
          }
        } else {
          if (Type == "PPt") {
            this.PPt = this.SelectedFiles;
          }
          if (Type == "Video") {
            this.Video = this.SelectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose a valid file! Example: PNG, JPEG, JPG, PDF, MP4, MOV"
        );
      }
    }
  }

}
