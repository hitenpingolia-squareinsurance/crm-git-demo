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
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-add-highlight",
  templateUrl: "./add-highlight.component.html",
  styleUrls: ["./add-highlight.component.css"],
})
export class AddHighlightComponent implements OnInit {
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

  currentUrl: string;

  insurer_code: any;

  Lob_Dropdown: { Id: string; Name: string }[];
  Companys: { Id: string; Name: string; Code: string }[];
  Plans: { Id: string; Name: string }[];
  SubPlans: { Id: string; Name: string }[];
  // lobs: { Id: string, Name: string }[];
  lobs: any;
  tempValue: any;

  label_type: { Id: string; Name: string }[] = [
    { Id: "0", Name: "Normal label" },
    { Id: "1", Name: "Highlighted label" },
    { Id: "2", Name: "Other Plan benefit" },
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddHighlightComponent>,
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
      Plan: [""],
      SubPlan: [""],
      uniquelabel: ["", Validators.required],
      iconName: [""],
      label_type: [""],
      icon_color: [""],
      font_color: [""],
    });

    this.Addposter.get("LOB").valueChanges.subscribe((value) => {
      if (value && value.length > 0) {
        this.tempValue = value[0].Name;
      }
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
            // this.lobs = result["lob"].map((item, index) => ({
            //   Id: item.Id,
            //   Name: item.Name
            // }));

            this.lobs = result["lob"];
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
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);

    const selected = this.Companys.find((item) => item.Id === e.Id);

    this.insurer_code = selected["Code"];

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
    // formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchSubplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.SubPlans = result["SubPlans"];
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  submit() {
    var fields = this.Addposter.value;
    //   //   //   console.log("The feilds is :- ", fields)
    this.isSubmitted = true;
    if (this.Addposter.invalid) {
      return;
    } else {
      var fields = this.Addposter.value;
      const formData = new FormData();

      //   //   //   console.log(fields, "All fields");

      formData.append("Company", this.insurer_code);

      if (fields["Plan"] && fields["Plan"].length > 0) {
        formData.append("Plan", fields["Plan"][0].Name);
      }

      if (fields["SubPlan"] && fields["SubPlan"].length > 0) {
        formData.append("SubPlan", fields["SubPlan"][0].Name);
      }

      // formData.append("HealthPlanBenifit", this.PosterImage);
      formData.append("uniquelabel", fields["uniquelabel"]);
      formData.append("type", "label");
      formData.append("LOB", fields["LOB"][0].Name);

      if (fields["label_type"] && fields["label_type"].length > 0) {
        formData.append("label_type", fields["label_type"][0].Id);
      }

      formData.append("icon_color", fields["icon_color"]);
      formData.append("font_color", fields["font_color"]);
      formData.append("iconName", fields["iconName"]);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/AddHighlightedLabel", formData)
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
}
