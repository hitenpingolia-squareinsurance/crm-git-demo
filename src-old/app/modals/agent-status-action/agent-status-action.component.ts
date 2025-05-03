import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";

@Component({
  selector: "app-agent-status-action",
  templateUrl: "./agent-status-action.component.html",
  styleUrls: ["./agent-status-action.component.css"],
})
export class AgentStatusActionComponent implements OnInit {
  Id: any;
  PosAr: any = [];
  DataAr: any = [];

  Agent_Status: any = "";
  Agent_Type: any = "";
  Agent_EnableDays: any = "";
  Remark: any = "";

  constructor(
    public dialogRef: MatDialogRef<AgentStatusActionComponent>,
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
            if (result["AgentDetails"]["QC_Status"] == 0) {
              this.Agent_Status = "PendingForQC";
            } else {
              this.Agent_Status = result["AgentDetails"]["QC_Status"];
            }

            this.Agent_Type = result["AgentDetails"]["Type"];

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

  Update() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Agent_Id", this.Id);
    formData.append("Agent_Status", this.Agent_Status);
    formData.append("Agent_EnableDays", this.Agent_EnableDays);
    formData.append("Remark", this.Remark);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("reports/AgentReport/UpdateAgentStatus", formData)
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
