import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-youtube",
  templateUrl: "./edit-youtube.component.html",
  styleUrls: ["./edit-youtube.component.css"],
})
export class EditYoutubeComponent implements OnInit {
  Addposter: FormGroup;
  dataAr: any[];
  Id: any;

  isSubmitted = false;

  dropdownSettingsType = {
    singleSelection: true,
    idField: "Id",
    textField: "Name",
    itemsShowLimit: 1,
    enableCheckAll: false,
    allowSearchFilter: true,
  };

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsmultiselect: {};

  lob_name: any[];
  company_name: any[];
  plan_name: any[];
  subplan_name: any[];
  label_name: any[];
  insurer_code: any;
  currentUrl: string;
  TableName: any;

  Companys: any[];
  Plans: any[];
  SubPlans: any[];

  Lob_Dropdown: { Id: string; Name: string }[];
  Company: { Id: string; Name: string }[];
  Plan: { Id: string; Name: string }[];
  SubPlan: { Id: string; Name: string }[];
  lobs: any[];

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditYoutubeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUrl = this.router.url;
    this.Id = this.data.Id;
    this.TableName = this.data.TableName;

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
      Videourl: [""],
    });
  }

  ngOnInit() {
    this.getValueEdit();
    this.FetchHealthCompany();
  }

  get formControls() {
    return this.Addposter.controls;
  }

  FetchHealthCompany() {
    this.Addposter.get("Company").setValue("");
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

  getValueEdit() {
    const formData = new FormData();
    formData.append("id", this.Id);
    formData.append("tableName", this.TableName);
    this.api.HttpPostType("WebsiteHealthSection/getEditData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == "success") {
          this.Addposter.patchValue(result["data"]);
          this.lob_name = [result["data"]["lob"]];
          this.company_name = [result["data"]["company"]];
          this.plan_name = [result["data"]["plan"]];
          this.subplan_name = [result["data"]["sub_plan"]];
          this.Addposter.patchValue({
            Videourl: result["data"]["description"],
          });
        } else {
          this.api.Toast("Warning", result.message || "No data found!");
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

  submit() {
    this.isSubmitted = true;
    if (this.Addposter.invalid) {
      return;
    } else {
      var fields = this.Addposter.value;

      //   //   //   console.log(fields);

      const formData = new FormData();

      formData.append("id", this.Id);

      formData.append(
        "lob",
        fields["LOB"][0]["Name"] ? fields["LOB"][0]["Name"] : fields["LOB"][0]
      );

      formData.append(
        "company",
        fields["Company"][0]["Name"] ? this.insurer_code : fields["Company"][0]
      );
      formData.append(
        "plan",
        fields["Plan"][0]["Name"]
          ? fields["Plan"][0]["Name"]
          : fields["Plan"][0]
      );
      formData.append(
        "subplan",
        fields["SubPlan"][0]["Name"]
          ? fields["SubPlan"][0]["Name"]
          : fields["SubPlan"][0]
      );

      formData.append("Videourl", fields["Videourl"]);
      formData.append("tableName", this.TableName);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/updateYoutubeUrl", formData)
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
