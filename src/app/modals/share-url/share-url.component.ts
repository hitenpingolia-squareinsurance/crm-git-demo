import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-share-url",
  templateUrl: "./share-url.component.html",
  styleUrls: ["./share-url.component.css"],
})
export class ShareUrlComponent implements OnInit {
  Dataarrr: any;

  constructor(
    public dialogRef: MatDialogRef<ShareUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.ShareUrl();
  }

  ShareUrl() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("UserCode", this.api.GetUserData("Code"));
    formData.append("UserType", this.api.GetUserType());

    this.api.IsLoading();
    this.api.HttpPostType("Auth/ShareUrl", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          //this.CloseModel();
          // console.log(result['Data']);

          this.Dataarrr = result["Data"];
          //this.PostingData = result['PostingData'];

          //this.api.Toast('Success',result['Message']);
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }

  CloseModel() {
    this.dialogRef.close();
  }
}
