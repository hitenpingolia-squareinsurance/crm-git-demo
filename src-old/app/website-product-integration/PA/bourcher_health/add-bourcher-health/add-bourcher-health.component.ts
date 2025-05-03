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
  selector: "app-add-bourcher-health",
  templateUrl: "./add-bourcher-health.component.html",
  styleUrls: ["./add-bourcher-health.component.css"],
})
export class AddBourcherHealthComponent implements OnInit {
  AddBourcherHealthForm: FormGroup;
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
  PolicyWordingImage: File;
  PurposalImage: File;
  BrochureImage: File;
  ClaimFormImage: File;
  insurer_code: any;
  // Companys: any[];
  // Plans: any[];

  // Lob_Dropdown: { Id: string; Name: string }[];
  currentUrl: string;

  docType: { Id: string; Name: string }[] = [
    { Id: "policyWording", Name: "Policy Wording" },
    { Id: "proposal form", Name: "Purposal" },
    { Id: "brochure", Name: "Brochure" },
    { Id: "claim form", Name: "Claim Form" },
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddBourcherHealthComponent>,
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

    this.AddBourcherHealthForm = this.formBuilder.group({
      Company: ["", Validators.required],
      product: [""],
      LOB: ["", Validators.required],

      Plan: ["", Validators.required],
      docType: ["", Validators.required],
      Purposal: [""],
    });
  }

  ngOnInit() {
    this.FetchHealthCompany();
  }

  Plans: { Id: string; Name: string }[];
  Companys: { Id: string; Name: string; Code: string }[];
  lobs: { Id: string; Name: string }[];

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.AddBourcherHealthForm.controls;
  }

  submit() {
    ////   //   console.log("HELLO world ");
    this.isSubmitted = true;
    var fields = this.AddBourcherHealthForm.value;

    if (this.AddBourcherHealthForm.invalid) {
      return;
    } else {
      var fields = this.AddBourcherHealthForm.value;
      // console.log(fields);
      const formData = new FormData();

      //   //   //   console.log(fields);

      formData.append("company", this.insurer_code);
      formData.append("lob", fields["LOB"][0].Name);
      formData.append("plan", fields["Plan"][0].Name);
      formData.append("Source", "crm");
      // formData.append('product', fields['Plan']);
      formData.append("product", fields["product"]);
      formData.append("docType", fields["docType"][0].Id);

      formData.append("proposal", this.PurposalImage);

      //   //   //   console.log("The formadata is :-", formData);

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
            //this.Companys = result["Companys"];
            this.lobs = result["lob"];
            // console.log("The company is :-", this.Companys)
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

    // this.Addposter.get("Plan").setValue("");
    // this.Addposter.get("SubPlan").setValue("");

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

    // this.Addposter.get("Plan").setValue("");
    // this.Addposter.get("SubPlan").setValue("");

    // let companyvalue = this.Addposter.get("Company").value;
    // let companyVal = '';

    // if (companyvalue != '') {
    //   companyVal = this.Addposter.get("Company").value[0]['Id'];
    ////   //   //   console.log(companyVal);
    // }

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);
    // formData.append("Url", this.currentUrl);

    const selected = this.Companys.find((item) => item.Id === e.Id);
    // console.log('Selected Full Object:', selected["Code"]);
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
  //FetchHealthPlanSubPlan
  FetchHealthPlanSubPlan(e) {
    this.AddBourcherHealthForm.get("product").setValue("");

    var companyvalue = this.AddBourcherHealthForm.get("Company").value;
    ////   //   console.log("The comany vlaue is :- ",companyvalue)

    companyvalue = companyvalue[0].Name;
    //   //   //   console.log("The Company Vlaue is :-", companyvalue);

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthPlanSubPlan1?User_Id=" +
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
            //   //   //   console.log('Plans :-', this.Plans)
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
