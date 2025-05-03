import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-employee-details",
  templateUrl: "./employee-details.component.html",
  styleUrls: ["./employee-details.component.css"],
})
export class EmployeeDetailsComponent implements OnInit {
  SRPolicyUpdateUW_OPS_Form: FormGroup;
  statusUpdateForm: FormGroup;
  isSubmitted = false;

  Id: any;
  row: any = [];

  Payout_Details: any = [];
  PayoutMaster: any = [];

  User_Rights: any = [];
  Remarks: string;

  OperationsEmp_Ar: any;
  AccountsEmp_Ar: any;

  Operations_User_Id: any = 0;
  Accounts_User_Id: any = 0;

  Agent_Id: any;
  Base_Url: any;
  //row:any=[];
  Documents: any;
  IsDisabled: any = false;
  selectedFiles: File;

  UseFor_IT_SQL: any;
  altPolicyUrl: any;
  custLetterUrl: any;
  addedBy: any;
  mappedTo: any;
  reqData: any = [];

  isShown: any = 1;
  isShow: any = 0;
  isinsurer: any = 0;
  ispayout: any = 0;
  isdocument: any = 0;

  statusData: any = [];
  dropdownSettingsType1: any = {};
  selectedStatus: any;
  curStatus: any;
  currentRemark: any;

  rightType: any = "";

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EmployeeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;

    // console.log(this.Id);
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.GetSingleEmployeeDetails();
  }

  GetSingleEmployeeDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("EmployeeCode", this.Id);

    // this.api.IsLoading();

    this.api.HttpPostType("b-crm/Employee/GetEmployeeDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.row = result["Data"];

          // this.api.Toast("Success", result["Msg"]);
        } else {
          this.api.Toast("Warning", result["Msg"]);
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
  EmployeeDetails(RM_Code): void {
    this.Id = RM_Code;
    this.GetSingleEmployeeDetails();
  }
  //===== GET SINGLE SR DETAILS ======//

  CloseModel() {
    this.dialogRef.close();
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(name: any) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
