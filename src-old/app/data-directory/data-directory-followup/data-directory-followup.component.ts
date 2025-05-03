import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
  selector: "app-data-directory-followup",
  templateUrl: "./data-directory-followup.component.html",
  styleUrls: ["./data-directory-followup.component.css"],
})
export class DataDirectoryFollowupComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted = false;
  buttonDisable = false;
  dropdownSettingsmultiselect: any = {};
  dropdownSettingsSingleselect: any = {};

  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  EmployeShow: boolean = false;
  Status2: any;
  ActionUser: any;
  dataArr: unknown;
  Id: any;
  AssignerId: any;
  loginId: any;

  assignedEmployeeData: any[];
  currentUrl: string;
  transferHide: boolean = false;

  statusOptions: any[];

  selectedStatus: any[];

  IsLoading() {
    // console.log('local load');

    $("#LoaderhaiBhaiYeh1").removeClass("custom_loader_new1 d_none_one1");

    $("#LoaderhaiBhaiYeh1").addClass("custom_loader_new1 d_block_one1");
  }

  HideLoading() {
    // console.log('local hide');
    $("#LoaderhaiBhaiYeh1").removeClass("custom_loader_new1 d_block_one1");

    $("#LoaderhaiBhaiYeh1").addClass("custom_loader_new1 d_none_one1");
  }

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<DataDirectoryFollowupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsSingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.Id = this.data.Id;
    this.Status = this.data.Status;
    this.Status2 = this.data["Status2"];
    // console.log(this.data);

    if (this.Status == 1) {
      this.selectedStatus = [{ Id: "1", Name: "Pending" }];
    } else if (this.Status == 2) {
      this.selectedStatus = [{ Id: "2", Name: "Follow Up" }];
    } else if (this.Status == 3) {
      this.selectedStatus = [{ Id: "3", Name: "Converted" }];
    } else if (this.Status == 0) {
      this.selectedStatus = [{ Id: "0", Name: "Lost" }];
    }

    this.UpdateFollowForm = this.fb.group({
      Status: [this.Status, ""],
      Dates: ["", Validators.required],
      Times: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
  }

  ngOnInit() {
    // console.log(this.Status)
    // console.log(this.Status2)

    this.AssignerId = this.data.AssignerId;
    this.loginId = this.api.GetUserData("Id");
    this.getdata();

    this.UpdateStatusValue(this.Status);

    this.statusOptions = [
      { Id: "2", Name: "Follow Up" },
      { Id: "3", Name: "Converted" },
      { Id: "0", Name: "Lost" },
    ];

    this.Nextes = new Date();
    this.Nextes.setDate(this.Nextes.getDate() + 365);
    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    if (this.Status == "3" || this.Status == "0") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
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

  UpdateStatusValue(Value: any) {
    this.Status = Value;
    const selectedValue = Value["Id"];
    const Datess = this.UpdateFollowForm.get("Dates");
    const Timess = this.UpdateFollowForm.get("Times");

    // console.log(Timess);

    if (selectedValue === "3" || selectedValue === "0") {
      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    } else {
      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }
  }

  UpdateFollowFormS() {
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      // console.log('something went wrong');
      return;
    } else {
      this.buttonDisable = false;

      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      // console.log(fields);

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Id", this.Id);
      formData.append("Status", JSON.stringify(fields["Status"]));
      formData.append("Date", fields["Dates"]);
      formData.append("Time", fields["Times"]);
      formData.append("Remark", fields["Remarks"]);

      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api
          .HttpPostType("DataDirectory/InsuranceLeadsLogsCreate", formData)
          .then(
            (result) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.buttonDisable = false;

                this.api.Toast("Success", result["msg"]);
                this.CloseModel();
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
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.IsLoading();

    this.api.HttpPostType("DataDirectory/InsuranceLeadsLogs", formData).then(
      (result) => {
        this.HideLoading();
        this.dataArr = result;
      },
      (err) => {
        // this.HideLoading();
        this.dataArr = err["error"]["text"];
        // // console.log(this.dataArr);
      }
    );
  }
}
