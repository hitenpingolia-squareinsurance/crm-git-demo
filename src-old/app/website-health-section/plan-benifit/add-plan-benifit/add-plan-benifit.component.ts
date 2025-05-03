import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-add-plan-benifit",
  templateUrl: "./add-plan-benifit.component.html",
  styleUrls: ["./add-plan-benifit.component.css"],
})
export class AddPlanBenifitComponent implements OnInit {
  Addposter: FormGroup;

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

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddPlanBenifitComponent>,
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

    this.Addposter = this.formBuilder.group({
      Company: ["", Validators.required],
      Plan: ["", Validators.required],
      SubPlan: ["", Validators.required],
      FromSuminsured: ["", Validators.required],
      ToSuminsured: ["", Validators.required],
      File: ["", Validators.required],
      uniquelabel: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.GetSuminsured();
    this.FetchHealthCompany();
  }

  GetSuminsured() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/GetSuminsured?User_Id=" +
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
            this.Suminusred = result["Suminsured"];
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
            this.Companys = result["Companys"];
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

  FetchHealthPlanSubPlan(e) {
    this.Addposter.get("Plan").setValue("");
    this.Addposter.get("SubPlan").setValue("");

    var companyvalue = this.Addposter.get("Company").value;

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthPlanSubPlan?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Company=" +
          companyvalue +
          "&Url=" +
          this.currentUrl
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Plans = result["Plans"];
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

  get formControls() {
    return this.Addposter.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.Addposter.invalid) {
      return;
    } else {
      var fields = this.Addposter.value;
      const formData = new FormData();

      formData.append("Company", fields["Company"]);
      formData.append("Plan", fields["Plan"]);
      formData.append("SubPlan", fields["SubPlan"]);
      formData.append("FromSuminsured", fields["FromSuminsured"][0]["Id"]);
      formData.append("ToSuminsured", fields["ToSuminsured"][0]["Id"]);
      formData.append("HealthPlanBenifit", this.PosterImage);
      formData.append("uniquelabel", fields["uniquelabel"]);
      formData.append("Url", this.currentUrl);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/AddPlanBenifitHealth", formData)
        .then(
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
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "csv") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "PosterImage") {
            this.Addposter.get("File").setValue("");
          }
        } else {
          if (Type == "PosterImage") {
            this.PosterImage = this.SelectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
}
