import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-bulkrenewalnotice",
  templateUrl: "./bulkrenewalnotice.component.html",
  styleUrls: ["./bulkrenewalnotice.component.css"],
})
export class BulkrenewalnoticeComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted = false;
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  TableId: any;
  Discription: any;
  AlreadyNotice: any = "";
  selectedFiles: File;
  Attachements: File;
  dropdownSettingsingleselect: any = {};
  InsurerData: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<BulkrenewalnoticeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.UpdateFollowForm = this.fb.group({
      Notice: ["", Validators.required],
      //Insurer: ["", Validators.required],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  getInsurerData() {
    this.api
      .HttpGetType("b-crm/Endosment/searchInsurerData?source=Online")
      .then(
        (result) => {
          if (result["status"] == true) {
            this.InsurerData = result["data"];
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

  ngOnInit() {
    this.TableId = this.data.Id;
    this.GetRejectedDiscription(this.TableId);
    //this.getInsurerData();
  }

  GetRejectedDiscription(Ids: number) {
    this.api.IsLoading();
    this.api.HttpGetType("myaccount/GetAlreadyNoticeDetails/" + Ids).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.AlreadyNotice = result["Url"];
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  get FC() {
    return this.UpdateFollowForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");

      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "zip") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 20) {
          this.api.Toast("Warning", "File size is greater than 20 mb");
          this.UpdateFollowForm.get("Attachement").setValue("");
        } else {
          this.Attachements = this.selectedFiles;
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast("Warning", "Please choose vaild file ! Example :- Zip");

        this.UpdateFollowForm.get("Attachement").setValue("");
      }
    }
  }

  UpdateFollowFormS() {
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("Notice", this.Attachements);
      formData.append("Insurer", "");

      var Confirms = confirm("Are You Sure To Upload?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api.HttpPostType("myaccount/UploadRenewalNotice", formData).then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);
              this.CloseModel();
            } else {
              this.api.Toast("Warning", result["Message"]);
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
  }
}
