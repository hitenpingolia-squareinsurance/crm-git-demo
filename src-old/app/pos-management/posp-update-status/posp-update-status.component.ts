import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-posp-update-status",
  templateUrl: "./posp-update-status.component.html",
  styleUrls: ["./posp-update-status.component.css"],
})
export class PospUpdateStatusComponent implements OnInit {
  id: any;
  docsForm: FormGroup;
  Pos_Status: any;
  Id: any;
  UpdateForm: FormGroup;
  isSubmitted: boolean;
  dataArr: unknown;
  getAgentDetails: any;
  getAllModules: [];

  checkExamStatus: any;
  passStatus: any;
  ActionType: any;
  AgentDetails: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<PospUpdateStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
    this.Pos_Status = this.data.Staus;
    this.ActionType = this.data.ActionType;
    // // console.log(this.id);

    if (this.Pos_Status == "4" && this.ActionType == "Action") {
      this.getModuleTimeDetails();
    }

    if (this.Pos_Status == "2" && this.ActionType == "Life") {
      this.getModuleTimeDetailsLife();
    }

    if (this.ActionType == "Action") {
      this.UpdateForm = this.formBuilder.group({
        Agree: [""],
        Remark: [""],
      });
    }
    if (this.ActionType == "MoreAction") {
      this.GetPosDetails();
    }
  }

  //UPDATE EMPLOYEE STATUS
  getModuleTimeDetailsLife() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api
      .HttpPostType("PospManegment/getModuleTimeDetailsLife", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.getAgentDetails = result["Data"].getAgentDetails;
            this.getAllModules = result["Data"].getAllModules;
            this.checkExamStatus = result["Data"].checkExamStatus;
            this.passStatus = result["Data"].passStatus;
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

  ngOnInit() {}

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.UpdateForm.controls;
  }

  //UPDATE EMPLOYEE STATUS
  UpdatePosVerificationSatatus() {
    this.isSubmitted = true;
    if (this.UpdateForm.invalid) {
      return;
    } else {
      var fields = this.UpdateForm.value;
      const formData = new FormData();

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("Id", this.Id);
      formData.append("Agree", fields["Agree"]);
      formData.append("Remarks", fields["Remark"]);

      if (confirm("Are you sure !") == true) {
        this.api.IsLoading();
        this.api
          .HttpPostType("PospManegment/UpdatePosVerificationSatatus", formData)
          .then(
            (result) => {
              this.api.HideLoading();

              if (result["status"] == 1) {
                this.dialogRef.close({
                  Status: "Model Close",
                });
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
  }

  UpdateTrainingpos(Action: any) {
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);
    formData.append("Action", Action);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType("PospManegment/CompleteCustomTrainingModule", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);

              this.dialogRef.close({
                Status: "Model Close",
              });
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

  //UPDATE EMPLOYEE STATUS
  getModuleTimeDetails() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/getModuleTimeDetails", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.getAgentDetails = result["Data"].getAgentDetails;
          this.getAllModules = result["Data"].getAllModules;
          this.checkExamStatus = result["Data"].checkExamStatus;
          this.passStatus = result["Data"].passStatus;
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

  GetPosDetails() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/POSPDetails", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.AgentDetails = result["Data"];

          // console.log(this.AgentDetails);
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

  give_permission() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/create_pos_permission", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);

          // console.log(this.AgentDetails);
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

  give_advisor_permission() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api
      .HttpPostType("PospManegment/create_advisor_permission", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
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

  give_sp_permission() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/create_sp_permission", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
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

  regenerate_certificate() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api
      .HttpPostType("PospManegment/regenerate_certificate", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
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

  send_default_mail() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/send_default_mail", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
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
