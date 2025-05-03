import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BmsapiService } from "../../../providers/bmsapi.service";
import swal from "sweetalert";

@Component({
  selector: "app-admin-srcancel",
  templateUrl: "./admin-srcancel.component.html",
  styleUrls: ["./admin-srcancel.component.css"],
})
export class AdminSRCancelComponent implements OnInit {
  Id: any;
  SR_No: any;
  Emp_Id: any;
  Emp_Pass: any;
  CancelRemark: any;
  Is_Remember: any = false;

  constructor(
    public dialogRef: MatDialogRef<AdminSRCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: BmsapiService
  ) {}

  ngOnInit() {
    this.Id = this.data.Id;
    this.SR_No = this.data.SR_No;

    //// console.log(this.api.GetIs_Remember('Is_Remember'));
    //// console.log(this.api.GetIs_Remember('Emp_Id'));
    //// console.log(this.api.GetIs_Remember('Emp_Pass'));

    //// console.log(localStorage.getItem('Is_Remember_Data'));
    if (this.api.GetIs_Remember("Is_Remember") == 1) {
      this.Is_Remember = true;
      this.Emp_Id = this.api.GetIs_Remember("Emp_Id");
      this.Emp_Pass = this.api.GetIs_Remember("Emp_Pass");
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  VerifyAndUpdate() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("SR_Id", this.Id);
    formData.append("SR_No", this.SR_No);
    formData.append("Emp_Id", this.Emp_Id);
    formData.append("Emp_Pass", this.Emp_Pass);
    formData.append("CancelRemark", this.CancelRemark);
    formData.append("Is_Remember", this.Is_Remember);

    this.api.IsLoading();
    this.api.HttpPostType("reports/AdminSrReport/CancelSR", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          if (result["Is_Remember"] == 1) {
            localStorage.setItem(
              "Is_Remember_Data",
              JSON.stringify(result["Is_Remember_Data"])
            );
          } else {
            localStorage.removeItem("Is_Remember_Data");
          }

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
  }
}
