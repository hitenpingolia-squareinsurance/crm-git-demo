import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";

// import { youtubeUrlValidator } from './youtube-url.validator';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-add-youtube",
  templateUrl: "./add-youtube.component.html",
  styleUrls: ["./add-youtube.component.css"],
})
export class AddYoutubeComponent implements OnInit {
  Addposter: FormGroup;

  dropdownSettingsmultiselect = {};

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PosterImage: File;
  Suminusred: any;
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  Companys: any[];
  Plans: any[];
  SubPlans: any[];
  currentUrl: string;

  Lob_Dropdown: { Id: string; Name: string }[];
  Company: { Id: string; Name: string }[];
  Plan: { Id: string; Name: string }[];
  SubPlan: { Id: string; Name: string }[];
  lobs: any;
  insurer_code: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddYoutubeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUrl = this.router.url;

    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: false,
    };

    this.Addposter = this.fb.group({
      LOB: ["", Validators.required],
      Company: ["", Validators.required],
      Plan: ["", Validators.required],
      SubPlan: ["", Validators.required],
      // File: ['', Validators.required],
      // uniquelabel: ['', Validators.required],
      Videourl: ["", Validators.required],
      // Videourl: ['', [Validators.required, youtubeUrlValidator()]]
    });
  }

  ngOnInit() {
    this.FetchHealthCompany();
  }

  get formControls() {
    return this.Addposter.controls;
  }

  FetchHealthCompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthCompany?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Url=" +
          this.currentUrl
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.lobs = result["lob"];
            //   //   //   console.log(this.lobs, "Lobs");
          } else {
            this.api.Toast("Warning", result["msg"]);
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
  FetchCompany(e) {
    //   //   //   console.log(e);

    this.Addposter.get("Plan").setValue("");
    this.Addposter.get("SubPlan").setValue("");

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("LOB", e.Name);
    formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchInsurerLobwise", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Companys = result["lob"];
          } else {
            this.api.Toast("Warning", result["msg"]);
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
  FetchPlans(e) {
    //   //   //   console.log(e.Id);

    const selected = this.Companys.find((item) => item.Id === e.Id);

    this.insurer_code = selected["Code"];

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);
    // formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/Fetchplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.Plans = result["Plans"];
          // this.SubPlans = result["SubPlans"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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
  FetchSubplans(e) {
    //   //   //   console.log(e.Id);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchSubplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.SubPlans = result["SubPlans"];
          // this.SubPlans = result["SubPlans"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  submit() {
    this.isSubmitted = true;
    if (this.Addposter.invalid) {
      return;
    } else {
      var fields = this.Addposter.value;
      const formData = new FormData();

      formData.append("Company", this.insurer_code);
      formData.append("Plan", fields["Plan"][0].Name);
      formData.append("LOB", fields["LOB"][0].Name);

      formData.append("SubPlan", fields["SubPlan"][0].Name);

      formData.append("Videourl", fields["Videourl"]);
      formData.append("type", "youtubeVedio");

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/AddYoutubeVedio", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.CloseModel();
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
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
