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
import { trim } from "jquery";

@Component({
  selector: "app-sendnotification",
  templateUrl: "./sendnotification.component.html",
  styleUrls: ["./sendnotification.component.css"],
})
export class SendnotificationComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  AddNotify: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;

  selectedFiles: File;
  policywording: File;
  proposal: File;
  claim: File;
  brochure: File;
  hospitallist: File;
  ActionType: any = "";
  showTable: any = 1;
  Company: any;
  Product: any;
  SubProduct: any;
  Type: any;
  Lob: any;

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
  productvalue: any;
  id: any;
  type: any;
  dataArr: any;
  url: string;
  company: any[];
  product: any;
  sub_product: any;
  types: any;

  file: File;
  bestdeatlselect: any;
  Users: { Id: string; Name: string }[];

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddNotify = this.formBuilder.group({
      type: ["", Validators.required],
      file: [""],
      title: ["", Validators.required],
      message: ["", Validators.required],
      bestDeal: ["", Validators.required],
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
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.Users = [
      { Id: "employee", Name: "Employee" },
      { Id: "agent", Name: "Agent" },
      { Id: "user", Name: "User" },
      { Id: "sp", Name: "SP" },
    ];
  }

  ngOnInit() {}

  get formControls() {
    return this.AddNotify.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddNotify.invalid) {
      return;
    } else {
      var fields = this.AddNotify.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("type", JSON.stringify(fields["type"]));
      formData.append("notification_attachment", this.file);
      formData.append("notification_title", fields["title"]);
      formData.append("Notification_body", fields["message"]);
      formData.append("Best_Deal", fields["bestDeal"]);

      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("SendNotification/AddNotifysNew", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.AddNotify.reset();
            this.router.navigate(["contact/view-notification"]);
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
  image(arg0: string, image: any) {
    throw new Error("Method not implemented.");
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
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 10) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 10 mb");

          if (Type == "file") {
            this.AddNotify.get("file").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "file") {
          this.AddNotify.get("file").setValue("");
        }
      }
    }
  }
}
