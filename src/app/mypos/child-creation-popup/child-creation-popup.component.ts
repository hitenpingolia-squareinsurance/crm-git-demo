import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-child-creation-popup",
  templateUrl: "./child-creation-popup.component.html",
  styleUrls: ["./child-creation-popup.component.css"],
})
export class ChildCreationPopupComponent implements OnInit {
  ChildCreation: FormGroup;
  companyForm: FormGroup;
  LogsForm: FormGroup;

  isSubmitted = false;
  dropdownSettingsType = {
    singleSelection: true,
    idField: "Id",
    textField: "Name",
    itemsShowLimit: 1,
    enableCheckAll: false,
    allowSearchFilter: true,
  };
  type: string;
  id: any;
  PospData: any;
  TypeDataArr: any;
  LoginType: string;
  LoginId: any;
  RequestViewLogData: any = [];
  status: any;
  rows: any = [];
  HideForm: any;
  lobData: { Id: string; Name: string }[];
  ServicelocationData: any = [];
  PincodData_Ar: any = [];
  selectedServicelocation: any;
  insCompaniesValue: any;
  selectedCompanies: any;
  dropdownSettingsmultiselect: any = {};
  selectedCheckboxValues: any;
  FormCheck: any;
  typeSelect: any;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChildCreationPopupComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = data.type;
    this.id = data.id;
    this.rows = data.rows;
    this.selectedCheckboxValues = data.selectedCheckboxValues;
    this.FormCheck = data.opsFormCheck;
    this.ChildCreation = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      number: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      PospData: [""],
      Remark: ["", Validators.required],
      Lob: ["", Validators.required],
      yesNo: ["", Validators.required],
      Servicelocation: ["", Validators.required],
      Type: [""],
    });

    this.companyForm = this.fb.group({});
    this.lobData = [{ Id: "Motor", Name: "Motor" }];
    this.TypeDataArr = [
      { Id: "Agent", Name: "Agent" },
      { Id: "SP", Name: "SP" },
    ];

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.LogsForm = this.formBuilder.group({
      Remark: ["", Validators.required],
      id: [""],
      link: [""],
      password: [""],
    });
  }

  ngOnInit(): void {
    this.LoginType = this.api.GetUserType();
    this.LoginId = this.api.GetUserData("Id");
    this.typeSelect = this.LoginType;
    this.searchServicelocations("", 0);

    if (this.LoginType == "agent") {
      this.ChildCreation.patchValue({ PospData: this.LoginId });
      this.getSelectedValues("", this.LoginId);
      this.insCompanies();
    } else {
      if (this.type != "logs" && this.type != "logsValueAccept") {
        this.insCompanies();
      }
    }
    if (this.type == "logs" || this.type == "logsEdit") {
      if (this.type == "logs") {
        this.getLog();
      } else {
        this.getLogEdit();
      }
      if (this.rows.status == 3) {
        this.LogsForm.get("id").setValidators([Validators.required]);
        this.LogsForm.get("id").updateValueAndValidity();
        this.LogsForm.get("link").setValidators([Validators.required]);
        this.LogsForm.get("link").updateValueAndValidity();
        this.LogsForm.get("password").setValidators([Validators.required]);
        this.LogsForm.get("password").updateValueAndValidity();
      }
    }
  }

  CloseModel(): void {
    this.dialogRef.close({ Status: "Model Close" });
  }

  getValue(): void {
    const formData = new FormData();
    formData.append("typeSelect", this.typeSelect);

    this.api.IsLoading();
    this.api.HttpPostType("Childcreation/GetPOSPValue", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.Status) {
          this.PospData = result.Data;
        } else {
          // this.api.Toast("Warning", result.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }
  insCompanies(): void {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Childcreation/insCompanies", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.Status) {
          this.insCompaniesValue = result.Data;
        } else {
          this.api.Toast("Warning", result.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }

  get formControls() {
    return this.ChildCreation.controls;
  }
  get formcompanyForm() {
    return this.companyForm.controls;
  }
  get formControlsNew() {
    return this.LogsForm.controls;
  }

  submit(): void {
    this.isSubmitted = true;
    if (this.ChildCreation.invalid) {
      return;
    } else if (this.companyForm.invalid) {
      return;
    }
    const fields = this.ChildCreation.value;
    const formData = new FormData();
    formData.append("name", JSON.stringify(fields.name));
    formData.append("email", fields.email);
    formData.append("number", fields.number);
    formData.append("PospData", JSON.stringify(fields.PospData));
    formData.append("Lob", JSON.stringify(fields.Lob));
    formData.append("Servicelocation", JSON.stringify(fields.Servicelocation));
    formData.append("Type", JSON.stringify(fields.Type));
    formData.append("typeSelect", this.typeSelect);
    formData.append("remark", fields.Remark);
    formData.append("yesNo", fields.yesNo);
    formData.append("FormData", JSON.stringify(this.companyForm.value));
    this.api.IsLoading();
    const url =
      this.type === "Edit"
        ? "Childcreation/EditContest"
        : "Childcreation/ChildCreate";
    if (this.type === "Edit") {
      formData.append("Id", String(this.id));
    }

    this.api.HttpPostType(url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.status) {
          this.api.Toast("Success", result.msg);
          this.CloseModel();
        } else {
          this.api.Toast("Warning", result.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }

  TypeValues(event: any, id: any): void {
    this.typeSelect = event.Id;
    this.getValue();
  }
  getSelectedValues(event: any, id: any): void {
    const AgentId = id || event.Id;
    const formData = new FormData();
    formData.append("AgentId", AgentId);
    formData.append("typeSelect", this.typeSelect);
    this.api.IsLoading();
    this.api.HttpPostType("Childcreation/AgentDetails", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result.Status) {
          this.ChildCreation.patchValue({
            number: result.Data[0].mobile,
            email: result.Data[0].email,
          });
        } else {
          this.api.Toast("Warning", result.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }
  getLog(): void {
    const formData = new FormData();
    formData.append("id", this.id);
    this.api.IsLoading();
    this.api.HttpPostType("Childcreation/getLogById", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.Status) {
          this.RequestViewLogData = result.Data;
        } else {
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }
  getLogEdit(): void {
    const formData = new FormData();
    formData.append("id", this.id);
    this.api.IsLoading();
    this.api.HttpPostType("Childcreation/getLogEdit", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.Status) {
          this.LogsForm.patchValue({
            Remark: result.Data.log_data.Remark,
            password: result.Data.log_data.password,
            link: result.Data.log_data.link,
            id: result.Data.log_data.id,
          });
        } else {
          this.api.Toast("Warning", result.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }

  LogSubmit(requestStatus: any): void {
    if (requestStatus == 0) {
      this.LogsForm.get("id").setValidators([Validators.required]);
      this.LogsForm.get("id").updateValueAndValidity();
      this.LogsForm.get("link").setValidators([Validators.required]);
      this.LogsForm.get("link").updateValueAndValidity();
      this.LogsForm.get("password").setValidators([Validators.required]);
      this.LogsForm.get("password").updateValueAndValidity();
    }
    this.isSubmitted = true;
    if (this.LogsForm.invalid) {
      return;
    }
    const fields = this.LogsForm.value;
    const formData = new FormData();
    formData.append("link", fields.link);
    formData.append("id", fields.id);
    formData.append("password", fields.password);
    formData.append("Remark", fields.Remark);

    if (this.type == "logsValueAccept") {
      formData.append("status", "CheckedValue");
    } else {
      formData.append("status", this.rows.status);
    }
    formData.append("RowId", this.id);
    formData.append("logId", this.id);
    formData.append("requestStatus", requestStatus);
    formData.append("Type", this.type);
    formData.append(
      "CheckboxValues",
      JSON.stringify(this.selectedCheckboxValues)
    );
    this.api.IsLoading();
    this.api.HttpPostType("Childcreation/LogSubmit", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.Status == true) {
          this.HideForm = 1;
          this.api.Toast("Success", result.msg);
          if (this.type == "logsValueAccept") {
            this.CloseModel();
          } else {
            this.getLog();
          }
        } else {
          this.api.Toast("Warning", result.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          `Network Error: ${err.name} (${err.statusText})`
        );
      }
    );
  }

  //=====SEARCH ServicelocationS=====//
  searchServicelocations(e: any, Type: any) {
    var Servicelocation = "";
    if (Type == 1) {
      Servicelocation = e.target.value;
    }
    this.api
      .HttpGetType(
        "Childcreation/searchServicelocations?Servicelocation=" +
          Servicelocation
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.ServicelocationData = result["data"];
          } else {
            // this.api.Toast('Warning',result['msg']);
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

  onCompanySelect() {
    this.selectedCompanies = this.ChildCreation.value.name;
    const group = {};
    this.selectedCompanies.forEach((company) => {
      if (company.Id) {
        const validators = [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
        ];
        group[company.Id] = this.fb.control("", validators);
      } else {
        console.error("Company id is missing:", company);
      }
    });
    this.companyForm = this.fb.group(group);
  }
  // onCompanySelect() {
  //   this.selectedCompanies = this.ChildCreation.value.name;
  //   const group = {};

  //   this.selectedCompanies.forEach(company => {
  //     if (company.Id) {
  //       const validators = [Validators.required, Validators.min(1), Validators.max(10)];
  //       group[company.Id] = this.fb.control('', validators);
  //     } else {
  //       console.error('Company id is missing:', company);
  //     }
  //   });
  //   this.companyForm = this.fb.group(group);
  // }

  onSubmitNew() {
    if (this.companyForm.valid) {
      //   //   //   console.log(this.companyForm.value);
    } else {
      //   //   //   console.log('Form is invalid');
    }
  }
}
