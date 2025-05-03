import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";

@Component({
  selector: "app-merge-code",
  templateUrl: "./merge-code.component.html",
  styleUrls: ["./merge-code.component.css"],
})
export class MergeCodeComponent implements OnInit {
  Id: any;
  PosAr: any = [];
  DataAr: any = [];

  constructor(
    public dialogRef: MatDialogRef<MergeCodeComponent>,
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
        "reports/AgentReport/GetMergedDetails?Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.PosAr = result["POS"];
            this.DataAr = result["Data"];
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

  MergeCodeUpdate(index) {
    if (this.DataAr[index]["Emp_Id"] == "") {
      return;
    }

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("POS_Id", this.Id);
    formData.append("Index", index);
    formData.append("Merge_Code", this.DataAr[index]["Emp_Id"]);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("reports/AgentReport/AddMerged_Code", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            if (result["Is_Force"] == 1) {
              if (confirm(result["Message"]) === true) {
                const formData = new FormData();

                formData.append("User_Id", this.api.GetUserId());
                formData.append("POS_Id", this.Id);
                formData.append("Index", index);
                formData.append("Merge_Code", this.DataAr[index]["Emp_Id"]);
                formData.append("SP_Id", result["SP_Id"]);

                this.api.IsLoading();
                this.api
                  .HttpPostType(
                    "reports/AgentReport/forcefullyUpdate",
                    formData
                  )
                  .then(
                    (result2) => {
                      this.api.HideLoading();

                      if (result2["Status"] == true) {
                        this.api.Toast("Success", result2["Message"]);
                        this.Get();
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
            } else {
              this.api.Toast("Warning", result["Message"]);
              this.Get();
            }
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
