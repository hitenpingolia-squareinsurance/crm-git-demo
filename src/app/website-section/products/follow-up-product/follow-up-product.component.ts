import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-follow-up-product",
  templateUrl: "./follow-up-product.component.html",
  styleUrls: ["./follow-up-product.component.css"],
})
export class FollowUpProductComponent implements OnInit {
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
  Id: any;
  currentUrl: any;
  urlSegment: any;
  urlSegmentRoot: any;
  urlSegmentSub: any;
  selectedStatus: { Id: string; Name: string }[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FollowUpProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.Id = this.data.Id;
    this.Status = this.data.Status;
    this.Status2 = this.data.Status;

    //Check Url Segment
    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    // alert(splitted[3]);
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

    // alert(this.urlSegmentRoot);

    // lead-management

    this.UpdateFollowForm = this.fb.group({
      Status: [this.Status, ""],
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);
    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (this.Status == "3" || this.Status == "4") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }
    this.getdata();

    if (this.Status == 1) {
      this.selectedStatus = [{ Id: "1", Name: "Pending" }];
    } else if (this.Status == 2) {
      this.selectedStatus = [{ Id: "2", Name: "Follow Up" }];
    } else if (this.Status == 3) {
      this.selectedStatus = [{ Id: "3", Name: "Converted" }];
    } else if (this.Status == 4) {
      this.selectedStatus = [{ Id: "4", Name: "Lost" }];
    } else if (this.Status == 5) {
      this.selectedStatus = [{ Id: "5", Name: "Transfer" }];
    }
  }

  get FC() {
    return this.UpdateFollowForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  UpdateStatus(Value: any) {
    this.Status = Value.target.value;
  }

  UpdateStatusValue(Value: any) {
    var Value = Value.target.value;
    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (Value == "3" || Value == "4") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }

    this.Status = Value.target.value;
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
      formData.append("Id", this.Id);
      formData.append("Status", fields["Status"]);
      formData.append("Date", fields["Dates"]);
      formData.append("Time", fields["Times"]);
      formData.append("Remark", fields["Remarks"]);

      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api.IsLoading();

        var url = "";
        if (this.urlSegmentRoot == "lead-management") {
          url = "LeadManagment/InsuranceLeadsLogsCreate";
        } else {
          url = "WebsiteSection/InsuranceLeadsLogsCreate";
        }

        this.api.HttpPostType(url, formData).then(
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

    formData.append("Id", this.Id);

    var url = "";
    if (this.urlSegmentRoot == "lead-management") {
      url = "LeadManagment/InsuranceLeadsLogs";
    } else {
      url = "WebsiteSection/InsuranceLeadsLogs";
    }

    this.api.HttpPostType(url, formData).then(
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
