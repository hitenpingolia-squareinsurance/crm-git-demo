import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
//import swal from 'sweetalert';

@Component({
  selector: "app-sr-posting-view-group-wise",
  templateUrl: "./sr-posting-view-group-wise.component.html",
  styleUrls: ["./sr-posting-view-group-wise.component.css"],
})
export class SrPostingViewGroupWiseComponent implements OnInit {
  Id: any;
  Type: any;
  Posting_Ids: any;
  Payout_RequestType: any;
  AgentName: any;
  dataAr: any = [];
  PostingData: any = [];

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  UTR_No: any = "";
  Status: any = "";
  Remark: any = "";

  constructor(
    public dialogRef: MatDialogRef<SrPostingViewGroupWiseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Id = this.data.Id;
    this.Type = this.data.Type;
    this.Posting_Ids = this.data.Posting_Ids;
    this.Payout_RequestType = this.data.Payout_RequestType;
    this.AgentName = this.data.AgentName;
    this.GetGroupSRs();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  GetGroupSRs() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("Id", this.Id);
    formData.append("Type", this.Type);
    formData.append("Payout_RequestType", this.Payout_RequestType);
    formData.append("Posting_Ids", this.Posting_Ids);

    this.api.IsLoading();
    this.api.HttpPostType("reports/PayoutPosting/GetGroupSRs", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          //this.CloseModel();

          this.dataAr = result["Data"];
          this.PostingData = result["PostingData"];

          //this.api.Toast('Success',result['Message']);
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", err.message);
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
      if (
        this.dataAr[i].isSelected &&
        this.dataAr[i].Posting_Status_Web == "1"
      ) {
        //PendingForAccounts
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          SR_No: this.dataAr[i].SR_No,
          Agent_Id: this.dataAr[i].Agent_Id,
          Posting_Status_Web: this.dataAr[i].Posting_Status_Web,
        });
      } else if (
        this.dataAr[i].isSelected &&
        this.dataAr[i].Posting_Status_Web == "3"
      ) {
        //PendingForBanking
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          SR_No: this.dataAr[i].SR_No,
          Agent_Id: this.dataAr[i].Agent_Id,
          Posting_Status_Web: this.dataAr[i].Posting_Status_Web,
        });
      }
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

  Transfer() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));

      formData.append("Posting_Id", this.Id);
      formData.append("Status", this.Status);
      formData.append("Remark", this.Remark);
      formData.append("Payout_RequestType", this.Payout_RequestType);

      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("SR_Ids[]", this.checkedList[i]["Id"]);
        //formData.append('Agent_Ids[]', this.checkedList[i]['Agent_Id'] );
      }

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "reports/PayoutPosting/PostingRequestFlowUpdate",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.masterSelected = false;
              this.checkedList = [];
              this.CloseModel();
              this.api.Toast("Success", result["Message"]);
            } else {
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    } else {
      this.CloseModel();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  UpdatePostingStatus() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));

      formData.append("Posting_Id", this.Id);
      formData.append("Status", this.Status);
      formData.append("UTR_No", this.UTR_No);
      formData.append("Remark", this.Remark);
      formData.append("Payout_RequestType", this.Payout_RequestType);

      this.api.IsLoading();
      this.api
        .HttpPostType("reports/PayoutPosting/UpdatePostingStatus", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.masterSelected = false;
              this.checkedList = [];
              this.CloseModel();
              this.api.Toast("Success", result["Message"]);
            } else {
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    } else {
      this.CloseModel();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  UpdateSingleUTR(e, Id, Index, columnType) {
    var val = e.target.value;
    // console.log(val);
    this.dataAr[Index][columnType] = val;
  }

  UpdateBulkUTRNo() {
    // console.log(this.dataAr);

    for (var i = 0; i < this.dataAr.length; i++) {
      if (
        this.dataAr[i]["UTR_Update_Date"] == "" ||
        typeof this.dataAr[i]["UTR_Update_Date"] === null
      ) {
        this.api.Toast(
          "Error",
          "Please enter " + this.dataAr[i]["Agent_Name"] + " UTR No Update date"
        );
        return;
      } else if (this.dataAr[i]["UTR_No"] == "") {
        this.api.Toast(
          "Error",
          "Please enter " + this.dataAr[i]["Agent_Name"] + " UTR No."
        );
        return;
      }
    }

    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Data", JSON.stringify(this.dataAr));

      this.api.IsLoading();
      this.api.HttpPostType("reports/PayoutPosting/UpdateUTRNO", formData).then(
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
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
    }
  }
}
