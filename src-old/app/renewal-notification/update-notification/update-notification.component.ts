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

@Component({
  selector: "app-update-notification",
  templateUrl: "./update-notification.component.html",
  styleUrls: ["./update-notification.component.css"],
})
export class UpdateNotificationComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  updateNotify: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

  selectedFiles: File;
  ActionType: any = "";

  showTable: any = 1;

  id: any;

  dataArr: any;
  url: string;

  file: File;
  bestdeatlselect: any;
  buttonvalue: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;

    // console.log(this.id);

    this.updateNotify = this.formBuilder.group({
      type: ["", Validators.required],
      bestDeal: ["", Validators.required],
      title: ["", Validators.required],
      message: ["", Validators.required],
      file: [""],
    });
  }

  ngOnInit() {
    this.getValueEdit();
  }

  onSave(value) {
    this.buttonvalue = value;
    // // console.log(value);
  }

  getValueEdit() {
    // console.log(this.id);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);

    this.api.IsLoading();
    this.api
      .HttpPostType("BackendNotification/GetValueNotification", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.dataArr = result["data"];

            // console.log(this.dataArr);

            this.updateNotify.patchValue(this.dataArr);
            // this.DocswalletForm.patchValue(this.dataArr);

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

  get formControls() {
    return this.updateNotify.controls;
  }

  submit() {
    // console.log(this.id);
    // console.log(this.buttonvalue);

    this.isSubmitted = true;
    if (this.updateNotify.invalid) {
      return;
    } else {
      var fields = this.updateNotify.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("id", this.id);
      formData.append("buttonvalue", this.buttonvalue);

      formData.append("type", fields["type"]);
      formData.append("notification_attachment", this.file);
      formData.append("notification_title", fields["title"]);
      formData.append("Notification_body", fields["message"]);
      formData.append("Best_Deal", fields["bestDeal"]);

      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api
        .HttpPostType("BackendNotification/updateNotification", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.CloseModel();

              // this.router.navigate(["Mypos/View-Docs"]);
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

        if (Total_Size >= 1024 * 10) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 10 mb");

          if (Type == "file") {
            this.updateNotify.get("file").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "file") {
          this.updateNotify.get("file").setValue("");
        }
      }
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
