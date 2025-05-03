import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api.service";
import { TransferLobComponent } from "../../posp-reporting/transfer-lob/transfer-lob.component";

@Component({
  selector: "app-update-posp-reporting",
  templateUrl: "./update-posp-reporting.component.html",
  styleUrls: ["./update-posp-reporting.component.css"],
})
export class UpdatePospReportingComponent implements OnInit {
  isSubmitted = false;
  loadAPI: Promise<any>;
  // AddCatForm: FormGroup;
  AddFieldForm: FormGroup;
  UpdatePospReportingForm: FormGroup;
  ChangePospRm: any;
  AddedField = 0;
  EmpDaataAr: any;
  loopData: any[];

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  selectedValue: string;
  Id: any;
  agentId: any;
  VerticalDataAr: any;
  PosDepartment: any;
  AgentLobWiseLog: any;
  core_lob: any;
  Action: number = 0;
  RightsData: any;
  GetEmployeeDataForLastMapping: any;
  NewAgentId: any;
  NewLob: any;
  GetSrData: any;
  dropdownSettingsMultipleType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdatePospReportingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agentId = this.data.AgentId;
    this.Action = this.data.Action;

    this.AddFieldForm = this.formBuilder.group({
      FieldForm: this.formBuilder.array([]),
    });

    this.UpdatePospReportingForm = this.formBuilder.group({
      reference: ["", Validators.required],
      SelectSr: ["", Validators.required],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsMultipleType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.selectedValue = "Select Type";
  }

  ngOnInit() {
    this.Id = this.data.Id;

    this.CheckRights();
    this.getData();
    this.getAgentData();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.AddFieldForm.controls;
  }

  AddField(): FormArray {
    return this.AddFieldForm.get("FieldForm") as FormArray;
  }

  AddFormField() {
    // console.log(this.loopData);
    this.AddedField = +this.AddedField + +1;
    if (this.AddedField) {
      this.AddField().push(this.NewAddField());
      // console.log(this.NewAddField());
    }
    // console.log(this.AddedField);
  }

  UpdatePospBusinessMapping(Lob, AgentId) {
    this.UpdatePospReportingForm.reset();
    this.NewLob = Lob;

    this.SelectPospSr(Lob, AgentId);
    this.NewAgentId = AgentId;
    const formData = new FormData();
    formData.append("lob", Lob);
    formData.append("AgentId", this.NewAgentId);
    this.api
      .HttpPostType("PospReporting/GetEmployeeDataForLastMapping", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.GetEmployeeDataForLastMapping = result["Data"];
        } else {
          this.GetEmployeeDataForLastMapping = [];
        }
      });
  }

  SelectPospSr(Lob, AgentId) {
    this.NewAgentId = AgentId;
    this.NewLob = Lob;

    const formData = new FormData();
    formData.append("lob", Lob);
    formData.append("AgentId", this.NewAgentId);
    this.api
      .HttpPostType("PospReporting/SelectPospSr", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.GetSrData = result["Data"];
        } else {
          this.GetSrData = [];
        }
      });
  }

  MappingUpdatePospBusiness() {
    var FieldForm = this.UpdatePospReportingForm.value;
    const formData = new FormData();

    formData.append("BusinessRemapRmId", FieldForm["reference"][0]["Id"]);
    formData.append("BusinessRemapSrId", JSON.stringify(FieldForm["SelectSr"]));
    formData.append("AgentId", this.NewAgentId);
    formData.append("lob", this.NewLob);
    this.api
      .HttpPostType("PospReporting/UpdatePospBusinessRemapping", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.api.Toast("Success", result["Message"]);
          document.getElementById("closemodal").click();
          // this.GetSrData = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);

          this.GetSrData = [];
        }
      });
  }

  ApproveRequest(
    parentCode: any,
    AgentId: any,
    Lob: any,
    department_id: any,
    Id: any
  ) {
    // // console.log(fields);
    var r = confirm("Are You sure you want to Withdrawal Request In Core RM!");
    if (r == true) {
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_code", this.api.GetUserData("Code"));
      formData.append("parentCode", this.api.GetUserData("Id"));
      formData.append("AgentId", AgentId);
      formData.append("Lob", Lob);
      formData.append("department_id", department_id);
      formData.append("RequestId", Id);
      formData.append("Remark", "Admin Update");

      this.api.IsLoading();
      this.api.HttpPostType("PospReporting/ApproveRequest", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
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

  CheckRights() {
    // ['status' => true, 'Message' => '', 'Rights' => 'Allowed

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginCode", this.api.GetUserData("Code"));
    formData.append("loginType", this.api.GetUserType());
    this.api
      .HttpPostType("PospReporting/PospLobWiseRights", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.RightsData = result["Rights"];
        }
      });
  }

  NewAddField(): FormGroup {
    //
    return this.formBuilder.group({
      lob: ["", Validators.required],
      VerticalData: ["", Validators.required],
      VerticalId: ["", Validators.required],
      RmId: [""],
      PosLobId: [""],
      BusinessLob: [""],
      status: [""],
      created_date: [""],
      AgentId: [""],
      withdraw_request_rm: [""],
      department_id: [""],
    });
  }

  getData() {
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("type", "Department_Id");

    this.api
      .HttpPostType("PospReporting/GetData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.VerticalDataAr = result["Data"];
          // console.log(this.EmpDaataAr);
        }
      });
  }

  getAgentData() {
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginCode", this.api.GetUserData("Code"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("type", "Reporting_Manager_Id");
    formData.append("user_id", this.agentId);

    this.api
      .HttpPostType("PospReporting/getAgentData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.loopData = result["Data"];
          this.core_lob = result["core_lob"];
          this.PosDepartment = result["Department"];
          // console.log(this.loopData);

          for (let item of this.loopData) {
            var Value = [{ Id: item.Id, Name: item.Name }];
            // console.log("hello");

            if (item.Id == this.PosDepartment) {
              var disabled = false;
            } else {
              var disabled = true;
            }
            const newField = this.NewAddField();
            newField.patchValue({
              lob: item.lob, // Set the value of 'lob' control
              VerticalData: Value, // Set the value of 'EmpData' control
              VerticalId: item.Id, // Set the value of 'EmpData' control
              RmId: item.RmName + " " + item.RmCode,
              PosLobId: item.PosLobId, // Set the value of 'EmpData' control
              BusinessLob: item.BusinessLob, // Set the value of 'EmpData' control
              status: item.status, // Set the value of 'EmpData' control
              created_date: item.created_date, // Set the value of 'EmpData' control
              AgentId: item.AgentId, // Set the value of 'EmpData' control
              withdraw_request_rm: item.withdraw_request_rm, // Set the value of 'EmpData' control
              department_id: item.department_id, // Set the value of 'EmpData' control
              // Set the value of 'RmName & RmCode' control
            });
            this.AddField().push(newField);
          }
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
      formData.append("FieldForm", JSON.stringify(fields["FieldForm"]));
      formData.append("user_id", this.agentId);
      formData.append("AgentDepartment", this.PosDepartment);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("PospReporting/insertdata", formData).then(
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

  UpdatePospReporting(lob: any) {
    const formData = new FormData();

    formData.append("lob", lob);
    formData.append("AgentId", this.agentId);

    this.api
      .HttpPostType("PospReporting/UpdatePospReporting", formData)
      .then((result: any) => {
        if (result["Status"] == true) {
          this.AgentLobWiseLog = result["Data"];
        } else {
          this.AgentLobWiseLog = [];
        }
      });
  }

  TransferPos(
    parentCode: any,
    AgentId: any,
    Lob: any,
    department_id: any,
    Id: any,
    Action: any
  ) {
    const dialogRef = this.dialog.open(TransferLobComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: {
        ParentCode: parentCode,
        AgentId: AgentId,
        Lob: Lob,
        department_id: department_id,
        LogId: Id,
        Action: Action,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.Get();
    });
  }
}
