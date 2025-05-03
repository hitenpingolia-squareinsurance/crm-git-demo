import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-employeerenewalpopup",
  templateUrl: "./employeerenewalpopup.component.html",
  styleUrls: ["./employeerenewalpopup.component.css"],
})
export class EmployeerenewalpopupComponent implements OnInit {
  Agent_Id: any;
  DataAr: any = [];
  SendMailFormValue: FormGroup;
  isSubmitted = false;

  RemarksRequestPrime: any = "";
  ShowErrorRequired: boolean = false;
  DateOrDateRange: any;
  DisabledButonDateRangepicker: boolean;
  SpPosDataArr: { Id: string; Name: string }[];
  UserType: any = "";
  Users: any = "";
  ShowErrorRequired1: boolean = false;
  ShowSpPos: boolean = false;
  ShowEmployeeData: boolean = false;

  EmployeeData: any;

  dropdownSettingmultiselect: any;
  dropdownSettingsingleselect: any;

  constructor(
    public dialogRef: MatDialogRef<EmployeerenewalpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog
  ) {
    // alert(data.Types);
    this.DateOrDateRange = this.data.DateOrDateRange;

    this.dropdownSettingsingleselect = {
      allowSearchFilter: true,
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
    };
    if (data.Types == "manage-renewal-request") {
      this.dropdownSettingmultiselect = {
        allowSearchFilter: true,
        singleSelection: false,
        idField: "Id",
        textField: "Name",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 1,
      };
    } else {
      this.dropdownSettingmultiselect = {
        allowSearchFilter: true,
        singleSelection: true,
        idField: "Id",
        textField: "Name",
        itemsShowLimit: 1,
      };
    }

    this.SendMailFormValue = this.formBuilder.group({
      Usertype: ["", Validators.required],
      Employee: [""],
      Useragent: [""],
      CCEmail: [""],
    });

    this.SearchSPPOSIds("", 0);
  }

  ngOnInit() {}
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  OnchangeValue() {
    const UserAgent: any = this.SendMailFormValue.get("Useragent");

    this.SendMailFormValue.get("Usertype").valueChanges.subscribe((Type) => {
      // alert(Type);
      if (Type == "Employee") {
        UserAgent.setValidators([Validators.required]);

        UserAgent.enable();
      } else {
        UserAgent.setValidators(null);

        UserAgent.disable();
      }
    });
  }

  get formControls() {
    return this.SendMailFormValue.controls;
  }

  RenewalEmployeeAgent(e) {
    var Quote = "";
    const formData = new FormData();
    var fields = this.SendMailFormValue.value;
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("url", "account/cases/renewals");
    formData.append("Types", fields["Usertype"]);
    formData.append("DateOrDateRange", this.DateOrDateRange);
    formData.append("Querys", this.api.GetRenwals());

    formData.append("Employee", JSON.stringify(fields["Employee"]));

    this.api
      .HttpPostType(
        "WebPolicyMailRenewalReminder/RenewalEmployeeAgent",
        formData
      )
      .then(
        (result) => {
          //  this.api.HideLoading();

          if (result["status"] == true) {
            this.SpPosDataArr = result["PosData"];
          } else {
            //this.api.Toast('Warning',result['msg']);
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

  SearchSPPOSIds(e, Type) {
    var Quote = "";
    const formData = new FormData();
    var fields = this.SendMailFormValue.value;
    this.api.IsLoading();

    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("url", "account/cases/renewals");
    formData.append("Types", fields["Usertype"]);
    formData.append("Querys", this.api.GetRenwals());
    formData.append("DateOrDateRange", this.DateOrDateRange);

    if (Type == "Employee") {
      formData.append("Employee", JSON.stringify(fields["Employee"]));
    }
    //     if (Type == 1) {
    //       Quote = e.target.value;
    //     }
    //     formData.append('SearchString',Quote);

    // alert(e.target.value);
    // return false;

    this.api
      .HttpPostType(
        "WebPolicyMailRenewalReminder/SendRenewalEmployeePosSP",
        formData
      )
      .then(
        (result) => {
          //  this.api.HideLoading();

          if (result["status"] == true) {
            this.api.HideLoading();
            this.SpPosDataArr = result["PosData"];

            this.EmployeeData = result["EmployeeData"];
            this.SendMailFormValue.get("Usertype").setValue("Employee");
            // this.SendMailFormValue.setValue("Useragent");
          } else {
            this.api.HideLoading();
            //this.api.Toast('Warning',result['msg']);
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

  SubmitRequests() {
    this.isSubmitted = true;

    // console.log(this.SendMailFormValue.invalid);

    if (this.SendMailFormValue.invalid) {
      return;
    } else {
      const formData = new FormData();
      var fields = this.SendMailFormValue.value;

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("Users", JSON.stringify(fields["Useragent"]));
      formData.append("UsersTypes", fields["Usertype"]);
      formData.append("CCEmail", fields["CCEmail"]);
      formData.append("DateOrDateRange", this.DateOrDateRange);
      formData.append("Querys", this.api.GetRenwals());

      // // console.log(this.api.GetRenwals());
      // return false;
      this.api.IsLoading();

      this.api
        .HttpPostType(
          "WebPolicyMailRenewalReminder/SendEmployeeRenewalEmails2",
          formData
        )
        .then(
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
          }
        );
    }
  }

  SendEmployeeMail(DateOrDateRange) {
    // this.DisabledButonDateRangepicker = true;

    this.api
      .HttpGetType(
        "WebPolicyMailRenewalReminder/SentDateRangeMailEmployee?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&DateOrDateRange=" +
          DateOrDateRange
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );

    //this.DisabledButonDateRangepicker = false;
  }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    // alert();

    //Lob
    if (Type == "Employee") {
      this.RenewalEmployeeAgent("OneByOneSelect");
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    if (Type == "Employee") {
      this.RenewalEmployeeAgent("OneByOneSelect");
    }
  }
}
