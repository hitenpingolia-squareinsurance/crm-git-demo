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
  selector: "app-edit-highlight",
  templateUrl: "./edit-highlight.component.html",
  styleUrls: ["./edit-highlight.component.css"],
})
export class EditHighlightComponent implements OnInit {
  Updateform: FormGroup;
  lob: { Id: string; Name: string }[];
  company: { Id: string; Name: string; Code: string }[];
  plan: { Id: string; Name: string }[];
  subplan: { Id: string; name: string }[];

  label_type: { Id: string; Name: string }[] = [
    { Id: "0", Name: "normal label" },
    { Id: "1", Name: "highlighted label" },
    { Id: "2", Name: "other benifits" },
  ];

  dropdownSettingsType = {
    singleSelection: true,
    idField: "Id",
    textField: "Name",
    itemsShowLimit: 1,
    enableCheckAll: false,
    allowSearchFilter: true,
  };
  dataAr: any[];
  Id: any;
  helperKey: any;

  lob_name: any[];
  company_name: any[];
  plan_name: any[];
  subplan_name: any[];
  label_name_dropDown: any[];
  insurer_code: any;
  currentUrl: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditHighlightComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUrl = this.router.url;
    this.Id = this.data.Id;
    this.helperKey = this.data.helperColumn;

    this.Updateform = this.fb.group({
      id: [""],
      insurer: [null, Validators.required],
      lob: [null, Validators.required],
      product_type: [null, Validators.required],
      label_type: [""],
      icon_color: [""],
      plan_type: [null, Validators.required],
      label_name: [""],
      font_color: [""],
      icon_name: [""],
      is_deleted: [""],
      plan_benifit: [""],
      plan_benifit_desc: [""],
      features: [""],
    });
  }

  ngOnInit() {
    this.getValueEdit();
    this.FetchHealthCompany();
  }

  getValueEdit() {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", this.Id);

    if (this.helperKey == 1) {
      formData.append("tableName", "product_labels");
    } else {
      formData.append("tableName", "int_insurance_features");
    }

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/getEditData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == "success") {
          //   //   //   console.log("Data is :-", result["data"]);
          this.Updateform.patchValue(result["data"]);

          this.lob_name = result["data"]["lob"]
            ? [result["data"]["lob"]]
            : [result["data"]["lob"]];
          this.company_name = result["data"]["insurer"]
            ? [result["data"]["insurer"]]
            : [result["data"]["company"]];
          this.plan_name = result["data"]["product_type"]
            ? [result["data"]["product_type"]]
            : [result["data"]["plan"]];
          this.subplan_name = result["data"]["plan_type"]
            ? [result["data"]["plan_type"]]
            : [result["data"]["sub_plan"]];

          if (this.helperKey == 1 && result["data"]["label_type"] == 1) {
            this.label_name_dropDown = ["highlighted label"];
          } else if (this.helperKey == 1 && result["data"]["label_type"] == 0) {
            this.label_name_dropDown = ["normal label"];
          } else if (this.helperKey == 0) {
            this.label_name_dropDown = [result["data"]["type"]];
          }

          if (this.helperKey == 0) {
            if (result["data"]["type"] == "label") {
              this.Updateform.patchValue({
                label_name: result["data"]["feature"],
              });
            } else {
              this.Updateform.patchValue({
                label_name: result["data"]["description"],
              });
            }
          }
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
            this.lob = result["lob"].map((item, index) => ({
              Id: index + 1,
              Name: item.Name,
            }));
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
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("LOB", e.Name);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchInsurerLobwise", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.company = result["lob"].map((item, index) => ({
              Id: item.Id,
              Name: item.Name,
              Code: item.Code,
            }));
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
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);
    const selected = this.company.find((item) => item.Id === e.Id);
    this.insurer_code = selected["Code"];
    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/Fetchplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.plan = result["Plans"].map((item, index) => ({
            Id: item.Id,
            Name: item.Name,
          }));
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
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);
    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchSubplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.subplan = result["SubPlans"].map((item, index) => ({
            Id: item.Id,
            Name: item.Name,
          }));
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

  update() {
    if (this.Updateform.valid) {
      const fields = this.Updateform.value;

      //   //   //   console.log(fields, "The fields is");

      const formData = new FormData();
      formData.append("id", this.Id);
      formData.append("helperColumn", this.helperKey);

      var templabel_type = fields["label_type"][0]["Name"]
        ? fields["label_type"][0]["Name"]
        : fields["label_type"][0];

      if (this.helperKey == 1) {
        formData.append("tableName", "product_labels");

        // var templabel_type = fields['label_type'][0]["Name"] ? fields['label_type'][0]["Name"] : fields['label_type'][0];

        if (templabel_type == "normal label") {
          formData.append("label_type", "0");
        } else if (templabel_type == "highlighted label") {
          formData.append("label_type", "1");
        }

        formData.append("icon_color", fields["icon_color"]);
        formData.append("icon_name", fields["icon_name"]);
        formData.append("font_color", fields["font_color"]);
      } else {
        formData.append("tableName", "int_insurance_features");

        formData.append("label_type", templabel_type);
      }
      formData.append(
        "lob",
        fields["lob"][0]["Name"] ? fields["lob"][0]["Name"] : fields["lob"][0]
      );

      formData.append(
        "insurer",
        fields["insurer"][0]["Name"] ? this.insurer_code : fields["insurer"][0]
      );
      formData.append(
        "product_type",
        fields["product_type"][0]["Name"]
          ? fields["product_type"][0]["Name"]
          : fields["product_type"][0]
      );
      formData.append(
        "plan_type",
        fields["plan_type"][0]["Name"]
          ? fields["plan_type"][0]["Name"]
          : fields["plan_type"][0]
      );

      formData.append("label_name", fields["label_name"]);

      this.api
        .HttpPostType("WebsiteHealthSection/updatePlanLabel", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.CloseModel();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error: " + err.name + " (" + err.statusText + ")"
            );
          }
        );
    } else {
      this.Updateform.markAllAsTouched();
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
