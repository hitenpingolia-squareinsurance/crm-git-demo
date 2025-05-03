import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-transfer-multiple-posp",
  templateUrl: "./transfer-multiple-posp.component.html",
  styleUrls: ["./transfer-multiple-posp.component.css"],
})
export class TransferMultiplePospComponent implements OnInit {
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
  State: any;
  City: any;
  SearchForm: any;
  EmployeeData: any[];
  TranferMultiplePospForm: FormGroup;
  Status: any;
  agentIds: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<TransferMultiplePospComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log(this.data);
    this.Lob = this.data.LOB;
    this.State = this.data.State;
    this.City = this.data.City;
    this.department_id = this.data.Vertical;
    this.agentIds = this.data.agentIds;

    // // console.log(this.data);
    this.TranferMultiplePospForm = this.formBuilder.group({
      Employee: [""],
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    if (this.State == "") {
      this.api.Toast("Warning", "Please Select State After LOB");
      this.CloseModel();
    }

    if (this.Lob == "") {
      this.api.Toast("Warning", "Please Select LOB After Vertical");
      this.CloseModel();
    }

    if (this.department_id == "") {
      this.api.Toast("Warning", "Please Select Vertical Frist");
      this.CloseModel();
    }

    this.GetEmployeeIds();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(name: any) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  TransferFillterWise() {
    var fields2 = this.TranferMultiplePospForm.value;

    this.Lob = this.data.LOB;
    this.State = this.data.State;
    this.City = this.data.City;
    this.department_id = this.data.Vertical;
    this.Status = this.data.Status;

    if (
      this.Lob != "" &&
      this.department_id != "" &&
      this.State != "" &&
      fields2["Employee"] != ""
    ) {
      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_code", this.api.GetUserData("Code"));

      formData.append("Status", JSON.stringify(this.Status));
      formData.append("Vertical", JSON.stringify(this.department_id));
      formData.append("LOB", JSON.stringify(this.Lob));
      formData.append("State", JSON.stringify(this.State));
      formData.append("City", JSON.stringify(this.City));
      formData.append("Employee", JSON.stringify(fields2["Employee"]));
      formData.append("agentIds", JSON.stringify(this.agentIds));

      this.api.IsLoading();
      this.api
        .HttpPostType("PospReporting/TransferMultiplePosp", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();
            // console.log(result);

            if (result["status"] == true) {
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

      // this.api.Toast("Success", "Fetchged");
    } else {
      if (this.department_id == "") {
        this.api.Toast("Warning", "Please Select Vertical Frist");
      }
      if (this.Lob == "") {
        this.api.Toast("Warning", "Please Select LOB After Vertical");
      }
      if (this.State == "") {
        this.api.Toast("Warning", "Please Select State After LOB");
      }
      if (fields2["Employee"] == "") {
        this.api.Toast("Warning", "Please Select Employee");
      }
    }
  }

  GetEmployeeIds() {
    this.EmployeeData = [];
    this.TranferMultiplePospForm.get("Employee").setValue("");

    if (this.department_id == "") {
      this.api.Toast("Warning", "Please Select Vertical Frist");
    }
    if (this.Lob == "") {
      this.api.Toast("Warning", "Please Select LOB After Vertical");
    }
    if (this.State == "") {
      this.api.Toast("Warning", "Please Select State After LOB");
    }

    if (this.department_id != "") {
      const formData = new FormData();
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginCode", this.api.GetUserData("Code"));
      formData.append("loginType", this.api.GetUserType());

      formData.append("department_id", JSON.stringify(this.department_id));

      this.api
        .HttpPostType("PospReporting/GetMapping_Emp_Ids", formData)
        .then((result: any) => {
          if (result["status"] == true) {
            this.EmployeeData = result["Data"];
          }
        });
    }
  }
}
