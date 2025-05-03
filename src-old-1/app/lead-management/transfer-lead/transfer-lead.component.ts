import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-transfer-lead",
  templateUrl: "./transfer-lead.component.html",
  styleUrls: ["./transfer-lead.component.css"],
})
export class TransferLeadComponent implements OnInit {
  dropdownSettingsmultiselect: any = {};
  TransferForm: FormGroup;
  isSubmitted: boolean;
  assignedEmployeeData: any[];
  leadId: any;
  type: any;
  currentUrl: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<TransferLeadComponent>,
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

    this.TransferForm = this.fb.group({
      Emp_Id: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    //   //   //   console.log(this.api.GetUserData("Id"));

    this.leadId = this.data.Id;
    this.type = this.data.type;

    this.searchAssignedEmployee();
  }

  hideOption(optionId: number) {}
  get FC() {
    return this.TransferForm.controls;
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  searchAssignedEmployee() {
    let optionId = this.api.GetUserData("Id");
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("Url", this.currentUrl);

    this.api
      .HttpPostTypeBms("lms/LmsCommon/SelectEmployee", formData)
      .then((result: any) => {
        if (result["status"] == 1) {
          let empData = result["Data"];

          empData = empData.filter((option) => option.Id !== optionId);

          this.assignedEmployeeData = empData;
        }
      });
  }

  TransferFormS() {
    this.isSubmitted = true;
    if (this.TransferForm.invalid || this.leadId.length == 0) {
      //   //   //   console.log("something went wrong");
      return;
    } else {
      var fields = this.TransferForm.value;
      const formData = new FormData();

      var employ_idArr = Object.entries(fields["Emp_Id"]);
      var emplyee_id = JSON.stringify(employ_idArr);
      var LeadIdArr = JSON.stringify(this.leadId);

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Remark", fields["Remarks"]);
      formData.append("Emp_Id", emplyee_id);
      formData.append("LeadIdArr", LeadIdArr);
      formData.append("status", "5");
      formData.append("type", this.type);

      var Confirms = confirm("Are You Sure To Transfer?");
      if (Confirms == true) {
        this.api.IsLoading();

        this.api
          .HttpPostTypeBms(
            "lms/LmsManagerRelated/LmsLeadsTransferLogs",
            formData
          )
          .then(
            (result) => {
              this.api.HideLoading();
              if (result["status"] == true) {
                this.api.Toast("Success", result["msg"]);
                this.CloseModel();
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
  }
}
