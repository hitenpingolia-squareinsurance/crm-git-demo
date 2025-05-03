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
  selector: "app-add-hospital-list",
  templateUrl: "./add-hospital-list.component.html",
  styleUrls: ["./add-hospital-list.component.css"],
})
export class AddHospitalListComponent implements OnInit {
  Addposter: FormGroup;

  selectedFile: File | null = null;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PosterImage: File;
  Companys: any[];
  Plans: any[];
  SubPlans: any[];

  Company: { Id: string; Name: string }[];

  lob: { Id: string; Name: string }[] = [
    { Id: "health", Name: "Health" },
    { Id: "pa", Name: "Pa" },
  ];

  isBlock: false;

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddHospitalListComponent>,
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

    this.Addposter = this.formBuilder.group({
      lob: ["", Validators.required],
      Company: ["", Validators.required],
      File: ["", Validators.required],
      isBlock: [false],
    });
  }

  ngOnInit() {}

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.Addposter.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      //   //   //   console.log("This is file  ", this.selectedFile);
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.Addposter.invalid) {
      return;
    } else {
      var fields = this.Addposter.value;

      const formData = new FormData();

      formData.append("Company", fields["Company"][0].Id);
      formData.append("lob", fields["lob"][0].Id);
      formData.append("isBlock", fields["isBlock"]);

      // formData.append("HospitalList", this.selectedFile);
      formData.append("HospitalList", this.PosterImage);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/AddHospitalHealth", formData)
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

  FetchCompany(e) {
    const formData = new FormData();

    formData.append("LOB", e.Name);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchInsurerLobwise", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            //   //   //   console.log(result["lob"], "LObs");
            this.Company = result["lob"].map((item, index) => ({
              Id: item.Code,
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

  // FetchHealthCompany() {
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "WebsiteHealthSection/FetchHealthCompany?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType()
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["status"] == true) {
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

  FetchHealthPlanSubPlan() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthPlanSubPlan?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Company=" +
          this.api.GetUserType()
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
