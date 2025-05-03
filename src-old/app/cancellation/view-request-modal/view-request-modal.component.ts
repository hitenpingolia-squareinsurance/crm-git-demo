import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-view-request-modal",
  templateUrl: "./view-request-modal.component.html",
  styleUrls: ["./view-request-modal.component.css"],
})
export class ViewRequestModalComponent implements OnInit {
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

  isShown: any = 1;
  isShow: any = 0;
  isinsurer: any = 0;
  ispayout: any = 0;
  isCancellation: any = 0;
  isdocument: any = 0;

  Agent_Id: any;
  Base_Url: any;
  showDocUploadDiv: any = "hide";
  Documents: any;
  IsDisabled: any = false;
  selectedFiles: File;
  EndorsementCopy: File;

  UseFor_IT_SQL: any;
  altPolicyUrl: any;
  custLetterUrl: any;
  addedBy: any;
  mappedTo: any;
  reqData: any = [];

  statusData: any = [];
  dropdownSettingsType1: any = {};
  selectedStatus: any;
  curStatus: any;
  currentRemark: any;

  rightType: any = "";
  cancelChequeUrl: any;
  sucessDocUrl: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ViewRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.statusData = [
      { Id: 0, Name: "Pending" },
      { Id: 1, Name: "In Process" },
      { Id: 2, Name: "Complete" },
      { Id: 3, Name: "Reject" },
    ];

    // this.SRPolicyUpdateUW_OPS_Form  =  this.formBuilder.group({
    // 	status: ['', [Validators.required]],
    // 	statusRemarks: ['', [Validators.required]],
    // 	Policy_Attachment: ['', [Validators.required]],
    // });

    this.statusUpdateForm = this.formBuilder.group({
      status: ["", [Validators.required]],
      statusRemarks: [""],
      endorsementCopy: [""],
    });

    this.dropdownSettingsType1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.Id = this.data.SrId;
    this.rightType = this.data.right;
    // // console.log(this.rightType);
    this.getSingleSrDetails();
  }

  //===== GET FORM CONTROLS
  get formControls() {
    return this.statusUpdateForm.controls;
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
            this.reqData = result["reqData"];
            this.altPolicyUrl = result["altPolicy"];
            this.custLetterUrl = result["custLetter"];
            this.cancelChequeUrl = result["cancelCheque"];
            this.sucessDocUrl = result["sucessDoc"];
            this.addedBy = result["addedBy"];
            this.mappedTo = result["mappedTo"];
            this.Documents = result["Documents"];
            this.curStatus = result["curStatus"];
            this.currentRemark = result["currentRemark"];

            // if(result['reqData']['status'] == 1){
            //   this.statusUpdateForm.get('statusRemarks').setValue(result['reqData']['inProcessRemarks']);
            // }else if(result['reqData']['status'] == 2){
            //   this.statusUpdateForm.get('statusRemarks').setValue(result['reqData']['completeRemarks']);
            // }else if(result['reqData']['status'] == 3){
            //   this.statusUpdateForm.get('statusRemarks').setValue(result['reqData']['rejectRemarks']);
            // }

            this.statusData = JSON.parse(result["statusArray"]);

            if (
              result["IsDisabled"] === "true" &&
              this.row.SR_Status == "Pending"
            ) {
              this.IsDisabled = false;
            } else {
              this.IsDisabled = true;
            }

            this.Base_Url = result["Base_Url"] + this.row.Id + "/";
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

  //===== UPDATE REQUEST STATUS =====//
  updateRequestStatus() {
    this.isSubmitted = true;
    if (this.statusUpdateForm.invalid) {
      return;
    } else {
      var fields = this.statusUpdateForm.value;

      const formData = new FormData();
      formData.append("id", this.reqData["CID"]);
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("status", fields["status"][0]["Id"]);
      formData.append("statusRemarks", fields["statusRemarks"]);
      formData.append("endorsementCopy", this.EndorsementCopy);

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/ManageCancellation/updateRequestStatus", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.CloseModel();
            } else {
              const msg = "msg";
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  //===== SHOW HIDE ENDORSEMENT COPY UPLOAD DIV =====//
  showHideDocUploadDiv(eve: any) {
    var statusSel = eve["Name"];
    if (statusSel == "Complete") {
      this.showDocUploadDiv = "show";
      this.statusUpdateForm.controls["endorsementCopy"].setValidators([
        Validators.required,
      ]);
    } else {
      this.statusUpdateForm.controls["endorsementCopy"].setValidators(null);
      this.showDocUploadDiv = "hide";
    }
    this.statusUpdateForm.get("endorsementCopy").updateValueAndValidity();
  }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 3) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 3 mb");
        } else {
          if (Type == "Endorsement_Copy") {
            this.EndorsementCopy = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(name: any) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //===== CLOSE MODAL =====//
  CloseModel() {
    this.dialogRef.close();
  }
}
