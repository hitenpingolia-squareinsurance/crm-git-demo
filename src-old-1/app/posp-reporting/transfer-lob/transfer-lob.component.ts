import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api.service";

@Component({
  selector: "app-transfer-lob",
  templateUrl: "./transfer-lob.component.html",
  styleUrls: ["./transfer-lob.component.css"],
})
export class TransferLobComponent implements OnInit {
  isSubmitted = false;
  loadAPI: Promise<any>;
  AddFieldForm: FormGroup;
  EmpDaataAr: any;
  empCode: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  AgentId: any;
  Lob: any;
  department_id: any;
  LogId: any;
  row: any;
  AgentCode: any;
  currentUrl: string;
  selectedFiles: any;
  Documents: any;
  Action: any;
  RightsData: String = "NotAllowed";

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<TransferLobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.empCode = this.data.ParentCode;
    this.AgentId = this.data.AgentId;
    this.Lob = this.data.Lob;
    this.department_id = this.data.department_id;
    this.LogId = this.data.LogId;
    this.Lob = this.data.Lob;
    this.AgentCode = this.data.AgentCode;
    this.Action = this.data.Action;

    // // console.log(this.data);
    this.AddFieldForm = this.formBuilder.group({
      FieldForm: this.formBuilder.array([]),
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      EmpData: ["", Validators.required],
    });

    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.getAgentData();
    this.GetSinglePosDetails();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getAgentData() {
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginCode", this.api.GetUserData("Code"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("department_id", this.department_id);
    this.api
      .HttpPostType("PospReporting/GetMapping_Emp_Ids", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.EmpDaataAr = result["Data"];
        }
      });
  }

  Submit() {
    this.isSubmitted = true;
    if (this.AddFieldForm.invalid) {
      return;
    } else {
      var fields = this.AddFieldForm.value;
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_code", this.api.GetUserData("Code"));
      formData.append("FieldForm", JSON.stringify(fields["EmpData"]));
      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("AgentId", this.AgentId);
      formData.append("lob", this.Lob);
      formData.append("department_id", this.department_id);
      formData.append("LogId", this.LogId);

      this.api.IsLoading();
      this.api.HttpPostType("PospReporting/transferData", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  GetSinglePosDetails() {
    const formData = new FormData();
    formData.append("id", this.AgentId);
    formData.append("Agentcode", this.AgentCode);

    // this.AgentId=8396;
    this.api.IsLoading();
    this.api
      .CallBms(
        "sr/RMAgentReport/ViewDetailsById?Id=" +
          this.AgentId +
          "&User_Id=" +
          this.api.GetUserId() +
          "&source=bms"
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.row = result["Data"];
            this.Documents = result["Documents"];

            // console.log(this.row);
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
}
