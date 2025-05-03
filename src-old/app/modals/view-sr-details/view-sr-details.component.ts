import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-sr-details",
  templateUrl: "./view-sr-details.component.html",
  styleUrls: ["./view-sr-details.component.css"],
})
export class ViewSrDetailsComponent implements OnInit {
  SRPolicyUpdateUW_OPS_Form: FormGroup;
  ActionForm: FormGroup;

  isSubmitted = false;

  Id: any;
  row: any = [];
  PostingRemarksAr: any = [];

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
  Documents: any;
  IsDisabled: any = false;
  selectedFiles: File;
  Show_Action: any;

  UseFor_IT_SQL: any;

  showDetails_0: any = 1;
  showDetails_1: any = 0;
  showDetails_2: any = 0;
  showDetails_3: any = 0;
  showDetails_4: any = 0;
  showDetails_5: any = 0;
  showDetails_6: any = 0;

  constructor(
    public dialogRef: MatDialogRef<ViewSrDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.SRPolicyUpdateUW_OPS_Form = this.formBuilder.group({
      Policy_No: ["", [Validators.required]],
      Final_Premium: ["", [Validators.required]],
      Policy_Attachment: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.Show_Action = this.data.Show_Action;
    this.GetSR();
    //this.Get_Operation_Employee();
    //this.Get_Accounts_Employee();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  EditModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
    this.router.navigateByUrl("/business-management/sr-creation/" + this.Id);
  }

  //===== FORMCONTROLS VALIDTAION =====//
  get FC() {
    return this.SRPolicyUpdateUW_OPS_Form.controls;
  }

  //===== GET SR DETAILS =====//
  GetSR() {
    const formData = new FormData();

    formData.append("Id", this.Id);

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api.HttpForSR("post", "Submit/ViewSR", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.row = result["Data"];
          // console.log(this.row);
          this.User_Rights = result["SR_User_Rights"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  //===== CANCEL/REJECT SR =====//
  CancelSr(ActionTeam: any) {
    if (confirm("Are you sure !") == true) {
      const formData = new FormData();

      formData.append("Id", this.Id);
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("ActionTeam", ActionTeam);

      this.api.IsLoading();
      this.api.HttpForSR("post", "ViewSR/Cancel_Sr", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.CloseModel();
          } else {
            this.api.Toast("Error", result["Message"]);
            this.CloseModel();
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
    }
  }

  //===== APPROVE SR =====//
  UpdateSrStatus(ActionTeam: any, ActionType: any, StepId: any) {
    if (confirm("Are you sure !") == true) {
      const formData = new FormData();

      formData.append("Id", this.Id);
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("StepId", StepId);
      formData.append("ActionTeam", ActionTeam);
      formData.append("ActionType", ActionType);

      this.api.IsLoading();
      this.api.HttpForSR("post", "ViewSR/Update_Sr_Status", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.CloseModel();
          } else {
            this.api.Toast("Error", result["Message"]);
            this.CloseModel();
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
    }
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(name) {
    var url = this.row["Docs_Base_Url"] + name;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //===== FOR IT USE =====//
  UserForIT() {
    this.UseFor_IT_SQL = this.row.UseFor_IT;

    var textToBeCopied = this.UseFor_IT_SQL;
    let textarea = null;

    textarea = document.createElement("textarea");
    textarea.style.height = "0px";
    textarea.style.left = "-100px";
    textarea.style.opacity = "0";
    textarea.style.position = "fixed";
    textarea.style.top = "-100px";
    textarea.style.width = "0px";
    document.body.appendChild(textarea);
    // Set and select the value (creating an active Selection range).
    textarea.value = textToBeCopied;
    textarea.select();
    // Ask the browser to copy the current selection to the clipboard.
    let successful = document.execCommand("copy");
    if (successful) {
      // do something
      this.Totast();
    } else {
      // handle the error
    }
    if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }

  Totast() {
    //this.snackbar_msg = msg;
    var x = document.getElementById("snackbar2");
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  //===== OPEN CLOSE MODAL TAB =====//
  ShowDetails(index, Status) {
    if (index == 0 && Status == 1) {
      this.showDetails_0 = 0;
    }
    if (index == 0 && Status == 0) {
      this.showDetails_0 = 1;
    }

    if (index == 1 && Status == 1) {
      this.showDetails_1 = 0;
    }
    if (index == 1 && Status == 0) {
      this.showDetails_1 = 1;
    }

    if (index == 2 && Status == 1) {
      this.showDetails_2 = 0;
    }
    if (index == 2 && Status == 0) {
      this.showDetails_2 = 1;
    }

    if (index == 3 && Status == 1) {
      this.showDetails_3 = 0;
    }
    if (index == 3 && Status == 0) {
      this.showDetails_3 = 1;
    }

    if (index == 4 && Status == 1) {
      this.showDetails_4 = 0;
    }
    if (index == 4 && Status == 0) {
      this.showDetails_4 = 1;
    }

    if (index == 5 && Status == 1) {
      this.showDetails_5 = 0;
    }
    if (index == 5 && Status == 0) {
      this.showDetails_5 = 1;
    }

    if (index == 6 && Status == 1) {
      this.showDetails_6 = 0;
    }
    if (index == 6 && Status == 0) {
      this.showDetails_6 = 1;
    }
  }
}
