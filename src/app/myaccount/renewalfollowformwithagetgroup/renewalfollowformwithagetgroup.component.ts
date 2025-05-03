import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import $ from "jquery";

@Component({
  selector: "app-renewalfollowformwithagetgroup",
  templateUrl: "./renewalfollowformwithagetgroup.component.html",
  styleUrls: ["./renewalfollowformwithagetgroup.component.css"],
})
export class RenewalfollowformwithagetgroupComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted = false;
  buttonDisable = false;

  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  Status2: any;
  ActionUser: any;
  dataArr: unknown;
  UserRoleType: string | null;
  Statusval: any;
  RenewalType: string = "";
  

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<RenewalfollowformwithagetgroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.UpdateFollowForm = this.fb.group({
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
    this.UserRoleType = this.api.GetUserType();

    this.SrTableId = this.data.Id;
    this.Status = this.data.Status;
    this.Statusval = this.data.Status;
    this.Status2 = this.data.Status2;
    this.ActionUser = this.data.ActionUser;
    this.RenewalType = this.data.RenewalType;

    


    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (this.Statusval == "Missed" || this.Statusval == "Lost") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }
  }

  ngOnInit() {
    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);

    this.getdata();
  }

  get FC() {
    return this.UpdateFollowForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  add_datapicker_class() {
    $("body").addClass("crm_calander");
  }

  UpdateFollowFormS() {
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("SrTableId", this.SrTableId);
      formData.append("Status", this.Status);
      formData.append("dates", fields["Dates"]);
      formData.append("times", fields["Times"]);
      formData.append("remark", fields["Remarks"]);
      formData.append("Status2", this.Status2);
      formData.append("CreaterType", this.ActionUser);
      formData.append("RenewalType",this.RenewalType);

      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api
          .HttpPostType("Inventory/ChangeRenewalStatusagentgroup", formData)
          .then(
            (result) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.buttonDisable = false;

                this.api.Toast("Success", result["msg"]);
                // this.CloseModel();
                this.getdata();
              } else {
                this.buttonDisable = false;

                this.api.Toast("Warning", result["msg"]);
              }
            },
            (err) => {
              this.buttonDisable = false;

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

  getdata() {
    this.api.IsLoading();
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("SrTableId", this.SrTableId);
    formData.append("CreaterType", this.ActionUser);
    formData.append("RenewalType", this.RenewalType);

    this.api
      .HttpPostType("Inventory/RenewalFollowUpLogAgentGroup", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          this.dataArr = result;
        },
        (err) => {
          this.api.HideLoading();
          this.dataArr = err["error"]["text"];
          // console.log(this.dataArr);
        }
      );
  }
}
