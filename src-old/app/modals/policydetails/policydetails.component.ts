import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-policydetails",
  templateUrl: "./policydetails.component.html",
  styleUrls: ["./policydetails.component.css"],
})
export class PolicydetailsComponent implements OnInit {
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
    private dialogRef: MatDialogRef<PolicydetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;

    // console.log(this.Id);
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.getSingleSrDetails();
  }

  //FORM CONTROLS
  get FC() {
    return this.SRPolicyUpdateUW_OPS_Form.controls;
  }

  //===== GET SINGLE SR DETAILS ======//
  getSingleSrDetails() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/ManageCancellation/getSinglePolicyDetails?Type=Normal&Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserData("Id")
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.row = result["Data"];
            this.Documents = result["Documents"];
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
