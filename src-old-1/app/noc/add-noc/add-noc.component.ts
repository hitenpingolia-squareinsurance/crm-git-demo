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
  selector: "app-add-noc",
  templateUrl: "./add-noc.component.html",
  styleUrls: ["./add-noc.component.css"],
})
export class AddNocComponent implements OnInit {
  nocForm: FormGroup;

  isSubmitted = false;
  editrequestletter: any;
  loadAPI: Promise<any>;
  id: any;
  type: any;
  dataArr: any;
  mainBlogForm: any;
  category_Name: any[];
  status: any;
  url: string;
  Dataresult: any;
  status_check: string;
  selectedFiles: File;
  nocletter: File;
  isShow: boolean;
  isShown: any;
  editrequestletter2: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddNocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    this.type = this.data.type;
    this.status = this.data.status;
    this.status_check = "";
    this.url = this.data.url;

    // console.log(this.id);
    // console.log(this.type);
    // console.log(this.status_check);
    // console.log(this.url);

    this.editrequestletter = 0;
    this.editrequestletter2 = 1;

    // if (this.type == 'Noc') {
    //   this.nocForm = this.formBuilder.group({
    //     nocletter: ['', Validators.required],
    //     reason: ['', Validators.required],
    //   });
    // }

    if (this.type == "Noc") {
      this.nocForm = this.formBuilder.group({
        nocletter: [""],
        reason: ["", Validators.required],
      });
    }

    if (this.type == "Details") {
      this.nocForm = this.formBuilder.group({
        nocletter: [""],
        reason: [""],
        approvedenyremark: ["", Validators.required],
        // approved: [''],
        // deny: [''],
      });
    }
  }

  ngOnInit() {
    if (this.type == "Details") {
      this.getValueEdit();
      this.GetAllRequests();
    }
  }

  HodLevel(TYPE) {
    if (TYPE == "edit") {
      this.editrequestletter = 1;
      this.editrequestletter2 = 0;
    } else {
      this.editrequestletter = 0;
      this.editrequestletter2 = 1;
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  // approval(val: string) {
  //   var value = val;
  //   // console.log(value);
  // }

  // deny(val: string) {
  //   var valu = val;
  //   // console.log(valu);
  // }

  getValueEdit() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("Noc/EditNoc", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];
          // console.log(this.dataArr.status_check);
          this.nocForm.patchValue(this.dataArr);

          // console.log(this.dataArr);

          // this.addtoolForm.patchValue(this.dataArr);

          // this.api.Toast("Success", result["msg"]);
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

  GetAllRequests() {
    // console.log(this.id);
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();

    this.api.HttpGetType("Noc/GetAllRequests?id=" + this.id).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);
        if (result["status"] == true) {
          this.Dataresult = result["Data"];

          // console.log(this.Dataresult.status);
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

  get formcontrols() {
    return this.nocForm.controls;
  }

  nocData(submittype) {
    this.isSubmitted = true;

    if (this.nocForm.invalid) {
      return;
    } else {
      var fields = this.nocForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("type", this.type);
      formData.append("status", this.status);

      if (this.type == "Noc") {
        formData.append("nocletter", this.nocletter);
        formData.append("reason", fields["reason"]);
        formData.append("Agentid", this.id);
      }

      if (this.type == "Details") {
        if (this.status == "2") {
          formData.append("nocletter", this.nocletter);
        }
        formData.append("nocletter", fields["nocletter"]);
        formData.append("reason", fields["reason"]);
        formData.append("approvedenyremark", fields["approvedenyremark"]);
        formData.append("app", submittype);
        formData.append("id", this.id);
      }

      // console.log(fields);

      if (this.type == "Noc") {
        this.url = "Noc/NocData";
      } else if (this.type == "Details") {
        this.url = "Noc/Request";
      }

      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
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

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 3 mb");

          if (Type == "image") {
            this.nocForm.get("nocletter").setValue("");
          }
        } else {
          if (Type == "image") {
            this.nocletter = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "image") {
          this.nocForm.get("nocletter").setValue("");
        }
      }
    }
  }

  //===== CHECK IMAGE TYPE =====//
  // checkFileType(event: any, Type: any) {

  //   this.SelectedFiles = event.target.files[0];

  //   // console.log(this.SelectedFiles);
  //   if (event.target.files && event.target.files[0]) {

  //     var str = this.SelectedFiles.name;
  //     var ar = str.split(".");
  //     // console.log(ar);
  //     var ext;
  //     for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
  //     // console.log(ext);

  //     if (ext == 'png' || ext == 'jpeg' || ext == 'jpg' || ext == 'pdf') {
  //       // console.log('Extenstion is vaild !');
  //       var file_size = event.target.files[0]['size'];
  //       const Total_Size = Math.round((file_size / 1024));

  //       // console.log(Total_Size + ' kb');

  //       if (Total_Size >= 10024) { // allow only 1 mb
  //         this.api.Toast('Warning', 'File size is greater than 1 mb');

  //         if (Type == "og_image") {
  //           this.loginform.get("og_image").setValue("");
  //         }

  //         if (Type == "twitter_image") {
  //           this.loginform.get("twitter_image").setValue("");
  //         }

  //       } else {

  //         if (Type == "og_image") {
  //           this.og_image = this.SelectedFiles;

  //         } else if (Type == "twitter_image") {
  //           this.TwitterImage = this.SelectedFiles;
  //         }

  //       }
  //     } else {
  //       this.api.Toast('Warning', 'Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF');
  //     }
  //   }
  // }
}
