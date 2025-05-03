import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-salary-edit",
  templateUrl: "./salary-edit.component.html",
  styleUrls: ["./salary-edit.component.css"],
})
export class SalaryEditComponent implements OnInit {
  SalaryEditForm: FormGroup;
  isSubmitted = false;
  butDisabled = false;
  designationHOD = "No";
  currentUrl: any = "";
  solicitorData: any = [];

  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};
  dropdownSettingsType1: any = {};
  loginId: any;
  loginType: string;
  masterType: string;
  EmployeeId: any;
  EmployeeSalary: any;
  FixedCostSalary:any;
  VariablePaySalary:any;
  EmployeeCode: any;
  dataAr: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SalaryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.EmployeeSalary = this.data.CurrentSalary;
    this.FixedCostSalary = this.data.FixedCost;
    this.VariablePaySalary = this.data.VariablePay;
    this.EmployeeId = this.data.EmployeeId;
    this.EmployeeCode = this.data.EmployeeCode;
    // console.log(this.data);

    this.SalaryEditForm = this.formBuilder.group({
      NewCurrentCTC: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      NewCurrentFixedCost: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      NewCurrentVariablePay: ["", [Validators.pattern("^[0-9]*$")]],
      Remarks: ["", [Validators.required]],
      OldSalary: [{ value: this.EmployeeSalary, disabled: true },[Validators.required]],
      OldFixedCostSalary: [{ value: this.FixedCostSalary, disabled: true },[Validators.required]],
      OldVariablePaySalary: [{ value: this.VariablePaySalary, disabled: true }],
      Effective_Date: ["", [Validators.required]],
    });
  }

  //=====ngOnInit MANAGEMENT=====//
  ngOnInit() {
    this.currentUrl = this.router.url;
    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();
    this.GetSalaryInfo();

    //Check Edit Id
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[3] != "undefined" && splitted[3] != "") {
    }
  }

  CloseModel() {
    this.dialogRef.close();
  }
  //FORM CONTROLS
  get FC() {
    return this.SalaryEditForm.controls;
  }

  //SUBMIT FORM DATA
  SalaryEdit() {

    this.isSubmitted = true;
    // console.log("this.SalaryEditForm",this.SalaryEditForm);
    // console.log("this.SalaryEditForm.value",this.SalaryEditForm.invalid);
   
    if (this.SalaryEditForm.invalid) {
      return;
    } else {
      var fields = this.SalaryEditForm.value;

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      formData.append("EmployeeId", this.EmployeeId);
      formData.append("EmployeeCode", this.EmployeeCode);
      formData.append("Effective_Date", fields["Effective_Date"]);
      
      formData.append("NewCurrentCTC", fields["NewCurrentCTC"]);
      formData.append("NewCurrentFixedCost", fields["NewCurrentFixedCost"]);
      formData.append("NewCurrentVariablePay", fields["NewCurrentVariablePay"]);
      formData.append("OldCurrentCTC", this.EmployeeSalary);
      formData.append("OldFixedCostSalary", this.FixedCostSalary);
      formData.append("OldVariablePaySalary", this.VariablePaySalary);

      formData.append("Remarks", fields["Remarks"]);
      formData.append("colName", "Current_CTC");

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Employee/UpdateEmployeeSalary", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.EmployeeSalary = result["NewSalary"];
              this.FixedCostSalary = result["NewFixedCost"];
              this.VariablePaySalary = result["NewVariablePay"];
              this.GetSalaryInfo();
              this.CloseModel();
            } else {
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

  //===== GET BRANCH DATA =====//
  GetSalaryInfo() {
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("EmployeeId", this.EmployeeId);
    formData.append("EmployeeCode", this.EmployeeCode);

    this.api.IsLoading();
    this.api
      .HttpPostType("b-crm/Employee/FetchEmployeeSalaryData", formData)
      .then((result: any) => {
        this.api.HideLoading();

        // alert(result);
        if (result["Status"] == true) {
          this.SalaryEditForm.reset();
          this.dataAr = result["Data"];
          this.SalaryEditForm.get("OldSalary").setValue(this.EmployeeSalary);
          this.SalaryEditForm.get("OldFixedCostSalary").setValue(this.FixedCostSalary);
          this.SalaryEditForm.get("OldVariablePaySalary").setValue(this.VariablePaySalary);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  //===== ON INPUT CURRENT CTC CALCULATE =====//
  updateCurrentCTC() {
    const fixedCost = this.SalaryEditForm.get("NewCurrentFixedCost").value || 0; 
    const variablePay = this.SalaryEditForm.get("NewCurrentVariablePay").value || 0; 
    const currentCtc = Number(fixedCost) + Number(variablePay);

    this.SalaryEditForm.get("NewCurrentCTC").setValue(currentCtc);
  }

  //=====
} //END CODE
