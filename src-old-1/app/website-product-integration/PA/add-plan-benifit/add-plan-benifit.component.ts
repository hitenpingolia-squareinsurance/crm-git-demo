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
  selectedFile: File | null = null;

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
      File: ["", Validators.required],
      // uniquelabel: ['', Validators.required],
      // Videourl: ['', Validators.required]
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

  // FetchHealthCompany() {
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "WebsiteHealthSection/FetchHealthCompany?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType() +
  //       "&Url=" +
  //       this.currentUrl
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["status"] == true) {
  //           this.lobs = result["lob"];
  //           this.Companys = result["Companys"];
  //         } else {
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

  // FetchHealthPlanSubPlan(e) {
  //   // alert(12);
  //   this.Addposter.get("Plan").setValue("");
  //   this.Addposter.get("SubPlan").setValue("");

  //   var companyvalue = this.Addposter.get("Company").value;

  //   if(companyvalue != ''){
  //     var companyVal  = this.Addposter.get("Company").value[0]['Id'];
  //  //   //   //   console.log(companyVal);
  //   }

  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "WebsiteHealthSection/FetchHealthPlanSubPlan?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType() +
  //       "&Company=" +
  //       companyVal +
  //       "&Url=" +
  //       this.currentUrl
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["status"] == true) {
  //           this.Plans = result["Plans"];
  //           this.SubPlans = result["SubPlans"];
  //         } else {
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

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

  get formControls() {
    return this.Addposter.controls;
  }

  // submit() {

  //   this.isSubmitted = true;
  //   if (this.Addposter.invalid) {
  //     return;
  //   } else {
  //     var fields = this.Addposter.value;
  //     const formData = new FormData();

  //     formData.append("Company", fields["Company"]);
  //     formData.append("Plan", fields["Plan"]);
  //     formData.append("SubPlan", fields["SubPlan"]);
  //     // formData.append("FromSuminsured", fields["FromSuminsured"][0]["Id"]);
  //     // formData.append("ToSuminsured", fields["ToSuminsured"][0]["Id"]);
  //     formData.append("HealthPlanBenifit", this.PosterImage);
  //     // formData.append("uniquelabel", fields["uniquelabel"]);
  //     formData.append("File", this.currentUrl);
  //     // formData.append("Videourl", fields["Videourl"]);

  //     this.api.IsLoading();
  //     this.api
  //       .HttpPostType("WebsiteHealthSection/AddPlanBenifitHealth", formData)
  //       .then(
  //         (result) => {
  //           this.api.HideLoading();
  //           // console.log(result);

  //           if (result["status"] == true) {
  //             this.api.Toast("Success", result["msg"]);
  //             this.CloseModel();
  //           } else {
  //             const msg = "msg";
  //             //alert(result['message']);
  //             this.api.Toast("Warning", result["msg"]);
  //           }
  //         },
  //         (err) => {
  //           // Error log
  //           // // console.log(err);
  //           this.api.HideLoading();
  //           const newLocal = "Warning";
  //           this.api.Toast(
  //             newLocal,
  //             "Network Error : " + err.name + "(" + err.statusText + ")"
  //           );
  //           //this.api.ErrorMsg('Network Error :- ' + err.message);
  //         }
  //       );
  //   }

  // }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submit() {
    this.isSubmitted = true;

    const fields = this.Addposter.value;

    const formData = new FormData();

    formData.append("LOB", fields["LOB"][0].Name);
    formData.append("Company", this.insurer_code);
    // formData.append("Company", fields["Company"][0].Name);

    formData.append("Plan", fields["Plan"][0].Name);
    formData.append("SubPlan", fields["SubPlan"][0].Name);

    const fileInput = this.Addposter.get("File").value;

    formData.append("HealthPlanBenifit", this.PosterImage);

    // const formDataObject = {};
    // formData.forEach((value, key) => {
    //   formDataObject[key] = value;
    // });

    this.api.IsLoading();

    this.api
      .HttpPostType("WebsiteHealthSection/AddPlanBenifitHealth", formData)
      .then((result) => {
        this.api.HideLoading();
        //   //   //   console.log("API call result:", result);

        if (result["status"] === true) {
          this.api.Toast("Success", result["msg"]);
          this.CloseModel();
        } else {
          //   //   //   console.log("API call unsuccessful:", result["msg"]);
          this.api.Toast("Warning", result["msg"]);
        }
      })
      .catch((error) => {
        this.api.HideLoading();
        console.error("Unexpected Error:", error);
        this.api.Toast("Error", "Unexpected Error: " + error.message);
      });
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
