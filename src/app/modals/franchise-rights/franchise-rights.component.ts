import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";
@Component({
  selector: "app-franchise-rights",
  templateUrl: "./franchise-rights.component.html",
  styleUrls: ["./franchise-rights.component.css"],
})
export class FranchiseRightsComponent implements OnInit {
  Id: any;
  PosAr: any = [];
  DataAr: any = [];

  FR_Label_Type: any = "";
  FR_Right: any = "";

  constructor(
    public dialogRef: MatDialogRef<FranchiseRightsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService
  ) {}

  ngOnInit() {
    this.Id = this.data.Id;
    this.Get();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  Get() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "reports/AgentReport/GetFranchiseRightsDetails?Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.FR_Label_Type = result["POS"]["FR_Label_Type"];
            this.FR_Right = result["POS"]["FR_Right"];

            this.PosAr = result["POS"];
            //this.DataAr = result['Data'];
            //this.api.ToastMessage(result['Message']);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  EnterCode(e, index) {
    var input = e.target.value;
    var code = input.toUpperCase();
    this.DataAr[index]["Emp_Id"] = code;
    ////   //   console.log(this.DataAr);
  }

  Update() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Agent_Id", this.Id);
    formData.append("FR_Label_Type", this.FR_Label_Type);
    formData.append("FR_Right", this.FR_Right);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "reports/AgentReport/UpdateFranchiseRightsStatus",
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
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }
}
