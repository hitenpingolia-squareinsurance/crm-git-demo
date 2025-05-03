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
  selector: "app-add-bourcher-health",
  templateUrl: "./add-bourcher-health.component.html",
  styleUrls: ["./add-bourcher-health.component.css"],
})
export class AddBourcherHealthComponent implements OnInit {
  AddBourcherHealthForm: FormGroup;

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
  PolicyWordingImage: File;
  PurposalImage: File;
  BrochureImage: File;
  ClaimFormImage: File;
  Companys: any[];
  Plans: any[];

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddBourcherHealthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddBourcherHealthForm = this.formBuilder.group({
      Company: ["", Validators.required],
      product: ["", Validators.required],
      PolicyWording: [""],
      Purposal: [""],
      ClaimForm: [""],
      Brochure: [""],
    });
  }

  ngOnInit() {
    this.FetchHealthCompany();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.AddBourcherHealthForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddBourcherHealthForm.invalid) {
      return;
    } else {
      var fields = this.AddBourcherHealthForm.value;
      const formData = new FormData();

      formData.append("company", fields["Company"]);
      formData.append("lob", "health");
      formData.append("Source", "health-online");
      // formData.append('product', fields['Plan']);
      formData.append("product", fields["product"]);

      formData.append("policywording", this.PolicyWordingImage);
      formData.append("proposal", this.PurposalImage);
      formData.append("claim", this.ClaimFormImage);
      formData.append("brochure", this.BrochureImage);

      this.api.IsLoading();
      this.api.HttpPostType("WebsiteSection/addToolData", formData).then(
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

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "PolicyWordingForm") {
            this.AddBourcherHealthForm.get("PolicyWording").setValue("");
          }
          if (Type == "PurposalImageForm") {
            this.AddBourcherHealthForm.get("Purposal").setValue("");
          }
          if (Type == "ClaimForm") {
            this.AddBourcherHealthForm.get("ClaimForm").setValue("");
          }
          if (Type == "BrochureForm") {
            this.AddBourcherHealthForm.get("Brochure").setValue("");
          }
        } else {
          if (Type == "PolicyWordingForm") {
            this.PolicyWordingImage = this.SelectedFiles;
          }
          if (Type == "PurposalImageForm") {
            this.PurposalImage = this.SelectedFiles;
          }
          if (Type == "ClaimForm") {
            this.ClaimFormImage = this.SelectedFiles;
          }
          if (Type == "BrochureForm") {
            this.BrochureImage = this.SelectedFiles;
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

  FetchHealthCompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthCompany?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
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
    this.AddBourcherHealthForm.get("product").setValue("");

    var companyvalue = this.AddBourcherHealthForm.get("Company").value;

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthPlanSubPlan?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Company=" +
          companyvalue
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Plans = result["Plans"];
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
}
