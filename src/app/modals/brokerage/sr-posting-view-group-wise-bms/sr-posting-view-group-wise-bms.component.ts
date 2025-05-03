import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";
import swal from "sweetalert";

@Component({
  selector: "app-sr-posting-view-group-wise-bms",
  templateUrl: "./sr-posting-view-group-wise-bms.component.html",
  styleUrls: ["./sr-posting-view-group-wise-bms.component.css"],
})
export class SrPostingViewGroupWiseBmsComponent implements OnInit {
  Id: any;
  Payout_Mode: any;
  ActiveTab: any;

  AgentName: any;
  dataAr: any = [];
  AccountsUser_Ar: any = [];

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  Assign_User: any = "";
  UTR_No: any = "";
  Status: any = "";
  Remark: any = "";
  IsAssign: any = 0;

  constructor(
    public dialogRef: MatDialogRef<SrPostingViewGroupWiseBmsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Id = this.data.Id;
    this.Payout_Mode = this.data.Payout_Mode;
    this.AgentName = this.data.AgentName;
    this.ActiveTab = this.data.ActiveTab;
    this.GetGroupSRs();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetGroupSRs() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("ActiveTab", this.ActiveTab);
    formData.append("Posting_Id", this.Id);
    formData.append("Payout_Mode", this.Payout_Mode);
    this.api.IsLoading();
    this.api
      .HttpPostType(
        "brokerage/LPA_PayoutPosting/ViewPostingRequestFiles",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            //this.CloseModel();
            this.dataAr = result["Data"];

            //this.api.ToastMessage(result['Message']);
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
  }

  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.dataAr.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if (this.dataAr[i].isSelected)
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          SR_No: this.dataAr[i].SR_No,
          Agent_Id: this.dataAr[i].Agent_Id,
          Posting_Status: this.dataAr[i].Posting_Status,
        });
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    // console.log(this.checkedList);
  }

  CancelTransfer() {
    this.masterSelected = false;
    this.checkedList = [];
    this.CloseModel();
  }

  async Transfer() {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to change status this data?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("ActiveTab", this.ActiveTab);
      formData.append("Status", this.Status);
      formData.append("Posting_Id", this.Id);
      formData.append("Payout_Mode", this.Payout_Mode);
      formData.append("Remark", this.Remark);

      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("SR_Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "brokerage/LPA_PayoutRequest/SingleRequst_IdCrossCheckAndApprove",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              if (result["IsAssign"] == 1) {
                this.AccountsUser_Ar = result["AccountsUser"];
                this.IsAssign = result["IsAssign"];
              } else {
                this.masterSelected = false;
                this.checkedList = [];
                this.CloseModel();
                this.api.ToastMessage(result["Message"]);
              }
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.ErrorMsg(err.message);
          }
        );
    } else {
      this.CloseModel();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  async AssginUser() {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to change status this data?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("Assign_User", this.Assign_User);
      formData.append("Posting_Id", this.Id);

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "brokerage/LPA_PayoutRequest/AssginUser_SingleRequst_Id",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.CloseModel();
              this.api.ToastMessage(result["Message"]);
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.ErrorMsg(err.message);
          }
        );
    } else {
      this.CloseModel();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }
}
