import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-edit-kra",
  templateUrl: "./add-edit-kra.component.html",
  styleUrls: ["./add-edit-kra.component.css"],
})
export class AddEditKraComponent implements OnInit {
  KraMasterForm: FormGroup;
  isSubmitted = false;
  row: any = [];
  row_id: any;
  financial_year: any = "";
  department_ar: any = [];
  sel_department_ar: any = [];
  profile_ar: any = [];
  sel_profile_ar: any = [];
  employee_ar: any = [];
  kra_array: any = [];
  sel_employee_ar: any;
  ActionType: any = "Add";
  Is_Refresh: any = "No";

  dropdownSettingmultipleselect: any = {};
  dropdownSettingsingleselect: any = {};

  constructor(
    public dialogRef: MatDialogRef<AddEditKraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.KraMasterForm = this.formBuilder.group({
      Department_Id: ["", [Validators.required]],
      Profile_Type: ["", [Validators.required]],
      Employee_Id: [""],
      Kra_Type: [""],
      Weightage: [""],
      kra_list: this.formBuilder.array([]),
    });

    this.dropdownSettingmultipleselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };
  }

  ngOnInit() {
    this.row_id = this.data.row_id;
    this.financial_year = this.data.financial_year;
    this.SearchComponentsData();
    if (this.row_id != "0") {
      this.ActionType = "Edit";

      this.KraMasterForm.get("Kra_Type").setValidators([Validators.required]);
      this.KraMasterForm.get("Weightage").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]);

      this.KraMasterForm.get("Kra_Type").updateValueAndValidity();
      this.KraMasterForm.get("Weightage").updateValueAndValidity();

      this.GetDetails();
    } else {
      this.AddNewKra();
    }
  }

  get formControls() {
    return this.KraMasterForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
      Is_Refresh: this.Is_Refresh,
    });
  }

  /*LI Riders List*/
  kra_list_func(): FormArray {
    return this.KraMasterForm.get("kra_list") as FormArray;
  }

  AddNewKra() {
    this.kra_list_func().push(this.new_kra_list_func());
  }

  RemoveNewKra(i: number) {
    this.kra_list_func().removeAt(i);
  }

  new_kra_list_func(): FormGroup {
    return this.formBuilder.group({
      kra_type: "",
      weightage: "",
    });
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "kra-master");
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/CrudFunctions/SearchComponentsData",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.department_ar = result["Data"]["Vertical"];
            if (this.financial_year == "2022") {
              this.profile_ar = result["Data"]["ProfileTypeArray"];
            } else {
              this.profile_ar = result["Data"]["ProfileListArray"];
            }
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  //===== GET KRA DETAILS =====//
  GetDetails() {
    const formData = new FormData();
    formData.append("row_id", this.row_id);
    formData.append("financial_year", this.financial_year);

    this.api
      .HttpPostTypeBms(
        "goal-management-system/appraisals/AppraisalMasters/GetSingleKraDetails",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.row = result["data"];
            this.sel_department_ar = result["sel_department_ar"];
            this.sel_profile_ar = result["sel_profile_ar"];
            this.KraMasterForm.patchValue(this.row);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast("Warning", err.message);
        }
      );
  }

  //===== GET EMPLOYEE LIST =====//
  GetEmployeeList() {
    this.employee_ar = [];
    var fields = this.KraMasterForm.value;
    const formData = new FormData();

    formData.append("department_id", JSON.stringify(fields["Department_Id"]));
    formData.append("profile_type", JSON.stringify(fields["Profile_Type"]));

    this.api
      .HttpPostTypeBms(
        "goal-management-system/appraisals/KraMasters/GetEmployeeList",
        formData
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.employee_ar = result["employee_ar"];
          } else {
            //this.api.Toast('Warning', result['Message']);
          }
        },
        (err) => {
          this.api.Toast("Warning", err.message);
        }
      );
  }

  //===== ADD EDIT KRA =====//
  AddEditKraMaster() {
    this.isSubmitted = true;
    if (this.KraMasterForm.invalid) {
      return;
    } else {
      var fields = this.KraMasterForm.value;
      const formData = new FormData();

      formData.append("user_code", this.api.GetUserData("Code"));
      formData.append("row_id", this.row_id);
      formData.append("financial_year", this.financial_year);
      formData.append("department_id", JSON.stringify(fields["Department_Id"]));
      formData.append("profile_type", JSON.stringify(fields["Profile_Type"]));
      formData.append("employee_id", JSON.stringify(fields["Employee_Id"]));
      formData.append("kra_type", fields["Kra_Type"]);
      formData.append("weightage", fields["Weightage"]);
      formData.append("kra_list", JSON.stringify(fields["kra_list"]));

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/appraisals/KraMasters/AddEditKraMaster",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Is_Refresh = "Yes";
              this.api.Toast("Success", result["Message"]);
              this.CloseModel();
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast("Warning", "Network Error, Please try again ! ");
          }
        );
    }
  }
}
