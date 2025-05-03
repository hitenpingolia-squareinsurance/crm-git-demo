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
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-plan-benefit",
  templateUrl: "./edit-plan-benefit.component.html",
  styleUrls: ["./edit-plan-benefit.component.css"],
})
export class EditPlanBenefitComponent implements OnInit {
  Updateform: FormGroup;
  lob: { Id: string; Name: string }[];
  company: { Id: string; Name: string; Code: string }[];
  plan: { Id: string; Name: string }[];
  subplan: { Id: string; name: string }[];

  label_type = [
    { Id: "0", Name: "normal label" },
    { Id: "1", Name: "highlighted label" },
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
  TableName: any;

  lob_name: any[];
  company_name: any[];
  plan_name: any[];
  subplan_name: any[];
  label_name: any[];
  insurer_code: any;
  currentUrl: string;
  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditPlanBenefitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUrl = this.router.url;
    this.Id = this.data.Id;
    this.TableName = this.data.TableName;
    // alert(this.Id);

    this.Updateform = this.fb.group({
      id: [""],
      insurer: [null, Validators.required],
      lob: [null, Validators.required],
      product_type: [null, Validators.required],

      plan_type: [null, Validators.required],

      is_deleted: [""],
      benifit: [""],
      description: [""],
      feature: [""],
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

    formData.append("tableName", this.TableName);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/getEditData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == "success") {
          //   //   //   console.log("Data is :-", result["data"]);
          this.Updateform.patchValue(result["data"]);

          this.lob_name = result["data"]["lob"] ? [result["data"]["lob"]] : [];
          this.company_name = [result["data"]["company"]];
          this.plan_name = [result["data"]["plan"]];
          this.subplan_name = [result["data"]["sub_plan"]];
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

      formData.append("tableName", this.TableName);

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

      formData.append("benifit", fields["benifit"]);
      formData.append("description", fields["description"]);
      formData.append("feature", fields["feature"]);

      this.api
        .HttpPostType("WebsiteHealthSection/updatePlanBenefit", formData)
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
