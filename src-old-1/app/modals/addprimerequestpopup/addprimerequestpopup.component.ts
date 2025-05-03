import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-addprimerequestpopup",
  templateUrl: "./addprimerequestpopup.component.html",
  styleUrls: ["./addprimerequestpopup.component.css"],
})
export class AddprimerequestpopupComponent implements OnInit {
  Agent_Id: any;
  DataAr: any = [];

  RemarksRequestPrime: any = "";
  ShowErrorRequired: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddprimerequestpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog
  ) {
    this.Agent_Id = this.data.Id;
    // console.log(this.Agent_Id );
  }

  ngOnInit() {}
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  SubmitRequests() {
    var Remarks = this.RemarksRequestPrime;
    if (Remarks == "") {
      this.ShowErrorRequired = true;
      return false;
    } else {
      this.ShowErrorRequired = false;
    }

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("Remark", Remarks);
    formData.append("Agent_Id", this.Agent_Id);

    this.api.IsLoading();

    this.api.HttpPostType("PrimeAgent/SubmitPrimeRequest", formData).then(
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
