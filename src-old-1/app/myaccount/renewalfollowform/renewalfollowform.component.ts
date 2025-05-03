import { Component, OnInit, Inject, asNativeElements } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import $ from "jquery";

@Component({
  selector: "app-renewalfollowform",
  templateUrl: "./renewalfollowform.component.html",
  styleUrls: ["./renewalfollowform.component.css"],
})
export class RenewalfollowformComponent implements OnInit {
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

  currentUrl: string;
  urlSegment: string;
  urlSegmentroot: string;
  urlSegmentSub: string;
  RenewalType:any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<RenewalfollowformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.currentUrl = this.router.url;
    this.RenewalType = this.data.RenewalType;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }
    if (typeof splitted[1] != "undefined") {
      this.urlSegmentroot = splitted[1];
    }
    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

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

        this.api.HttpPostType("Inventory/ChangeRenewalStatus", formData).then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.buttonDisable = false;

              this.api.Toast("Success", result["msg"]);
              this.CloseModel();
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

  UpdateStatus(Value: any) {
    this.Status = Value.target.value;
    // alert(Value);
    // = Value.target.value;

    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (this.Status == "Missed" || this.Status == "Lost") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }
    // alert(this.Status );
  }

  getdata() {
    this.api.IsLoading();
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("SrTableId", this.SrTableId);
    formData.append("CreaterType", this.ActionUser);
    formData.append("RenewalType",this.RenewalType);


    this.api.HttpPostType("Inventory/RenewalFollowUpLog", formData).then(
      (result) => {
        this.api.HideLoading();
        this.dataArr = result;

        console.log(result ,"RenewalFollowUpLog");
      },
      (err) => {
        this.api.HideLoading();
        this.dataArr = err["error"]["text"];
        // console.log(this.dataArr);
      }
    );
  }
}
