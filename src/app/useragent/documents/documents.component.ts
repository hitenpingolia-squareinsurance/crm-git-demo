import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
})
export class DocumentsComponent implements OnInit {
  docsForm: FormGroup;

  selectedFiles: File;

  pancardimage: File;
  aadharfrontimage: File;
  aadharbackimage: File;
  qualificationproofimage: File;
  chequeimageproof: File;
  prfileimage: File;
  signatureimage: File;
  otherimage: File;

  isSubmitted = false;
  loadAPI: Promise<any>;
  id: any;
  dataArr: any;
  AadharCard: any;
  Pancard: any;
  AadharBack: any;
  Cheque: any;
  Other: any;
  Profile: any;
  Qualification: any;
  Signature: any;
  Pancarddate: any;
  AadharCarddate: any;
  AadharBackdate: any;
  Chequedate: any;
  Otherdate: any;
  Profiledate: any;
  Qualificationdate: any;
  Signaturedate: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    // // console.log(this.id);

    this.docsForm = this.formBuilder.group({
      pancardimage: [""],
      aadharfrontimage: [""],
      aadharbackimage: [""],
      qualificationproofimage: [""],
      chequeimageproof: [""],
      prfileimage: [""],
      signatureimage: [""],
      otherimage: [""],
    });
  }

  ngOnInit() {
    this.getdata();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.docsForm.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.id == "") {
      return;
    } else {
      var fields = this.docsForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("id", this.id);

      formData.append("pancardimage", this.pancardimage);
      formData.append("aadharfrontimage", this.aadharfrontimage);
      formData.append("aadharbackimage", this.aadharbackimage);
      formData.append("qualificationproofimage", this.qualificationproofimage);
      formData.append("chequeimageproof", this.chequeimageproof);
      formData.append("prfileimage", this.prfileimage);
      formData.append("signatureimage", this.signatureimage);
      formData.append("otherimage", this.otherimage);

      // // console.log(formData.append);

      this.api.IsLoading();
      this.api.HttpPostType("UserAgent/DocsUpdate", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            // this.CloseModel();
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

  getdata() {
    // // console.log(this.id);
    this.api.IsLoading();

    this.api.HttpGetType("UserAgent/Documents?id=" + this.id).then(
      (result) => {
        this.api.HideLoading();

        // // console.log(result);

        if (result["status"] == 1) {
          this.dataArr = result["data"];

          // images
          this.Pancard = this.dataArr["pancard"];
          this.AadharCard = this.dataArr["aadharfront"];
          this.AadharBack = this.dataArr["aadharback"];
          this.Cheque = this.dataArr["chequeimage"];
          this.Other = this.dataArr["other"];
          this.Profile = this.dataArr["profileimage"];
          this.Qualification = this.dataArr["qualificationimage"];
          this.Signature = this.dataArr["signature"];

          // date
          this.Pancarddate = this.dataArr["pancarddate"];
          this.AadharCarddate = this.dataArr["aadharfrontdate"];
          this.AadharBackdate = this.dataArr["aadharbackdate"];
          this.Chequedate = this.dataArr["chequeimagedate"];
          this.Otherdate = this.dataArr["otherimagedate"];
          this.Profiledate = this.dataArr["profileimagedate"];
          this.Qualificationdate = this.dataArr["qualificationdate"];
          this.Signaturedate = this.dataArr["signatureimagedate"];

          // console.log(this.dataArr);
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

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 10) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 10 mb");

          if (Type == "pancardimage") {
            this.docsForm.get("pancardimage").setValue("");
          }
          if (Type == "aadharfrontimage") {
            this.docsForm.get("aadharfrontimage").setValue("");
          }
          if (Type == "aadharbackimage") {
            this.docsForm.get("aadharbackimage").setValue("");
          }
          if (Type == "qualificationproofimage") {
            this.docsForm.get("qualificationproofimage").setValue("");
          }
          if (Type == "chequeimageproof") {
            this.docsForm.get("chequeimageproof").setValue("");
          }
          if (Type == "prfileimage") {
            this.docsForm.get("prfileimage").setValue("");
          }
          if (Type == "signatureimage") {
            this.docsForm.get("signatureimage").setValue("");
          }
          if (Type == "otherimage") {
            this.docsForm.get("otherimage").setValue("");
          }
        } else {
          if (Type == "pancardimage") {
            this.pancardimage = this.selectedFiles;
          }
          if (Type == "aadharfrontimage") {
            this.aadharfrontimage = this.selectedFiles;
          }
          if (Type == "aadharbackimage") {
            this.aadharbackimage = this.selectedFiles;
          }
          if (Type == "qualificationproofimage") {
            this.qualificationproofimage = this.selectedFiles;
          }
          if (Type == "chequeimageproof") {
            this.chequeimageproof = this.selectedFiles;
          }
          if (Type == "prfileimage") {
            this.prfileimage = this.selectedFiles;
          }
          if (Type == "signatureimage") {
            this.signatureimage = this.selectedFiles;
          }
          if (Type == "otherimage") {
            this.otherimage = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "pancardimage") {
          this.docsForm.get("pancardimage").setValue("");
        }
        if (Type == "aadharfrontimage") {
          this.docsForm.get("aadharfrontimage").setValue("");
        }
        if (Type == "aadharbackimage") {
          this.docsForm.get("aadharbackimage").setValue("");
        }
        if (Type == "qualificationproofimage") {
          this.docsForm.get("qualificationproofimage").setValue("");
        }
        if (Type == "chequeimageproof") {
          this.docsForm.get("chequeimageproof").setValue("");
        }
        if (Type == "prfileimage") {
          this.docsForm.get("prfileimage").setValue("");
        }
        if (Type == "signatureimage") {
          this.docsForm.get("signatureimage").setValue("");
        }
        if (Type == "otherimage") {
          this.docsForm.get("otherimage").setValue("");
        }
      }
    }
  }
}
