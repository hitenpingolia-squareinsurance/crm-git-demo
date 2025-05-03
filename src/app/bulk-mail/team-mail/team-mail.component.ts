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
import { empty } from "rxjs";

@Component({
  selector: "app-team-mail",
  templateUrl: "./team-mail.component.html",
  styleUrls: ["./team-mail.component.css"],
})
export class TeamMailComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  sendbulkmailForm: FormGroup;

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

  SubProducts: { Id: number; Name: string }[];

  Mail: { Id: string; Name: string }[];

  attachement: File;
  PosEmployee: { Id: string; Name: string }[];
  SelectLevel: { Id: string; Name: string }[];
  Verticle: { Id: string; Name: string }[];
  currentUrl: string;
  pos: any;
  TeamType: any[];
  LevelData: any;
  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    selectAllText: string;
    unSelectAllText: string;
    allowSearchFilter: boolean;
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.sendbulkmailForm = this.formBuilder.group({
      Type: ["", Validators.required],
      selectlevel: [""],
      verticle: ["", Validators.required],
      subject: ["", Validators.required],
      attachement: [""],
      message: ["", Validators.required],
      team: [""],
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
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      allowSearchFilter: true,
    };

    this.PosEmployee = [
      { Id: "POS", Name: "POS" },
      { Id: "Employee", Name: "Employee" },
      // { Id: "SP", Name: "SP" },
    ];
    this.TeamType = [
      { Id: "Team", Name: "My Team" },
      { Id: "Self", Name: "My Team" },
      // { Id: "SP", Name: "SP" },
    ];
  }

  ngOnInit() {
    // this.onSelect();
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);

    if (this.currentUrl == "/bulk-mail/My-Team") {
    } else {
    }
  }

  ResetDT() {
    this.sendbulkmailForm.value.reset();
  }

  get formControls() {
    return this.sendbulkmailForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.sendbulkmailForm.invalid) {
      return;
    } else {
      var fields = this.sendbulkmailForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("Type", fields["Type"][0]["Id"]);
      formData.append("selectlevel", JSON.stringify(fields["selectlevel"]));
      formData.append("VerticalType", JSON.stringify(fields["verticle"]));
      formData.append("mail_subject", fields["subject"]);
      formData.append("mail_message", fields["message"]);
      formData.append("attachement", this.attachement);
      formData.append("Tomail", this.api.GetUserData("Email"));

      // console.log(fields);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("Bulk_Mail/SendMail", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.sendbulkmailForm.reset();
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
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "attachement") {
            this.sendbulkmailForm.get("attachement").setValue("");
          }
        } else {
          if (Type == "attachement") {
            this.attachement = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "attachement") {
          this.sendbulkmailForm.get("attachement").setValue("");
        }
      }
    }
  }

  ShowVertical() {
    this.Verticle = [];
    this.SelectLevel = [];

    var fields = this.sendbulkmailForm.value;
    if (!empty(fields["Type"])) {
      return;
    } else if (
      !empty(fields["Type"]) &&
      this.currentUrl == "/bulk-mail/My-Team"
    ) {
      this.SelectLevel = [];
    } else {
      const formData = new FormData();
      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("Type", fields["Type"][0]["Id"]);

      this.api.IsLoading();
      this.api.HttpPostType("Bulk_Mail/ShowBulkMailDetails", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Verticle = result["Department"];
            this.SelectLevel = result["Level"];

            if (fields["Type"][0]["Id"] == "POS") {
              this.sendbulkmailForm
                .get("RegistrationDate")
                .setValidators([Validators.required]);
            }
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var item = item.Id;
    // // console.log(item.Id);
    if (Type == "Category") {
      this.ShowVertical();
    }
    if (Type == "Vertical") {
      this.ShowLevel();
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "Category") {
      this.ShowVertical();
    }
    if (Type == "Vertical") {
      this.ShowLevel();
    }
  }

  ShowLevel() {
    this.SelectLevel = [];

    var fields = this.sendbulkmailForm.value;
    if (!empty(fields["Type"])) {
      return;
    } else if (
      !empty(fields["Type"]) &&
      this.currentUrl == "/bulk-mail/My-Team"
    ) {
      this.SelectLevel = [];
    } else {
      const formData = new FormData();
      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("Type", fields["Type"][0]["Id"]);
      formData.append("Vertical", JSON.stringify(fields["verticle"]));

      this.api.IsLoading();
      this.api.HttpPostType("Bulk_Mail/ShowLevel", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.SelectLevel = result["Level"];

            if (fields["Type"][0]["Id"] == "POS") {
              this.sendbulkmailForm
                .get("RegistrationDate")
                .setValidators([Validators.required]);
            }
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }
}
