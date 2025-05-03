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
  selector: "app-pushnotification",
  templateUrl: "./pushnotification.component.html",
  styleUrls: ["./pushnotification.component.css"],
})
export class PushnotificationComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  sendNotificationForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

  selectedFiles: File;
  image: File;

  ActionType: any = "";

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };

  SubProducts: { Id: number; Name: string }[];
  Category: any;
  dataArr: any;
  actiontype: any;
  url: string;
  category_name: any[];
  categoryname: any;
  category: any;
  category_Name: any[];
  Type: { Id: string; Name: string }[];
  attachement: File;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.sendNotificationForm = this.formBuilder.group({
      type: ["", Validators.required],
      title: ["", Validators.required],
      attachement: ["", Validators.required],
      message: ["", Validators.required],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.Type = [
      { Id: "All", Name: "ALL" },
      { Id: "employee", Name: "Employee" },
      { Id: "sp", Name: "Service Provider" },
      { Id: "agent", Name: "Agent" },
      { Id: "user", Name: "User Agent" },
    ];
  }

  ngOnInit() {}

  ResetDT() {
    this.sendNotificationForm.value.reset();
  }

  get formControls() {
    return this.sendNotificationForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.sendNotificationForm.invalid) {
      return;
    } else {
      var fields = this.sendNotificationForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("type", fields["type"][0]["Id"]);
      formData.append("notification_title", fields["title"]);
      formData.append("notification_attachment", this.attachement);
      formData.append("notification_body", fields["message"]);

      // console.log(fields);

      // // console.log('formData');
      this.api.IsLoading();
      this.api
        .HttpPostType("SendNotification/push_notification_messege", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
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

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "attachement") {
            this.sendNotificationForm.get("attachement").setValue("");
          }
        } else {
          if (Type == "attachement") {
            this.attachement = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "attachement") {
          this.sendNotificationForm.get("attachement").setValue("");
        }
      }
    }
  }
}
