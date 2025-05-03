import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { IDropdown, IUser } from "../../app";
import { TemplateRef } from "@angular/core";

interface IFormField {
  label: string;
  f_Name: string;
  f_Type: string;
  f_Value: string;
  values?: string[];
}

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { PlanComponent } from "../plan/plan.component";
import { title } from "process";

@Component({
  selector: "app-plan-form",
  templateUrl: "./plan-form.component.html",
  styleUrls: ["./plan-form.component.css"],
})
export class PlanFormComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dropdownSettingsmultiselect: any = {};
  dropdownmultiselect: any = {};
  LOBdata: any[];
  companyData: any[];
  PlanOption: any[];
  SubPlan: any[];
  PlanData: any[];
  LOB: any;

  dtOptions: DataTables.Settings = {};

  AddedField = 0;
  AddFieldForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  dataAr: any[] = [];
  sampleform: FormGroup;
  controlform: any;
  appService: any;
  lstForm: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,

    private dialogRef: MatDialogRef<PlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.PlanData = [
      { Id: "1", Name: "I Product" },
      { Id: "2", Name: "Smart" },
    ];

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.dropdownmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    this.controlform = this.fb.group({
      labelname: ["", Validators.required],
      typename: ["", Validators.required],
      valueType: ["", Validators.required],
    });

    this.sampleform = this.fb.group({});

    this.AddFieldForm = this.fb.group({
      LOB: ["", Validators.required],
      Company: ["", Validators.required],
      PlanType: ["", Validators.required],
      SubPlan: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.getLOB();
  }

  getLOB() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Plan_Title/getLOB", formData).then(
      (resp) => {
        this.LOBdata = resp["lob"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
        this.api.HideLoading();
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }

  getCompany(lobValue: any) {
    this.click();
    const formData = new FormData();
    const lob = lobValue["Name"];
    this.LOB = lob;

    formData.append("lob", lob);
    this.api.IsLoading();
    this.api.HttpPostType("Plan_Title/planCompany", formData).then(
      (resp) => {
        this.companyData = resp["company"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));

        this.dataAr = resp["data"];
        for (let i = 0; i < this.dataAr.length; i++) {
          this.dataAr[i].Categories = this.dataAr[i].Categories.replace(
            /\s/g,
            ""
          );
        }
        this.formValidation();
        this.api.HideLoading();
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }

  getPlan(plan: any) {
    this.click();
    const formData = new FormData();

    const planType = plan["Id"];
    formData.append("insId", planType);
    this.api.IsLoading();
    this.api.HttpPostType("Plan_Title/getPlanOption", formData).then(
      (resp) => {
        this.PlanOption = resp["plan"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
        this.api.HideLoading();
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }
  getSunPlan(subPlan: any) {
    this.click();
    const formData = new FormData();

    const subPlanType = subPlan["Id"];
    formData.append("subPlan", subPlanType);
    this.api.IsLoading();
    this.api.HttpPostType("Plan_Title/getSubPlan", formData).then(
      (resp) => {
        this.SubPlan = resp["subPlan"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
        this.api.HideLoading();
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }

  click() {
    document.getElementById("click").click();
  }

  formValidation() {
    const group: any = {};

    group["LOB"] = new FormControl(this.AddFieldForm.get("LOB").value);
    group["Company"] = new FormControl(this.AddFieldForm.get("Company").value);
    group["PlanType"] = new FormControl(
      this.AddFieldForm.get("PlanType").value
    );
    group["SubPlan"] = new FormControl(this.AddFieldForm.get("SubPlan").value);

    for (var field of this.dataAr) {
      const controlName = field.Categories;

      if (field.input == "text") {
        group[controlName] = new FormControl(field.FieldVal || "");
      } else if (field.input == "number") {
        group[controlName] = new FormControl(field.FieldVal || "");
      } else if (field.input == "textArea") {
        group[controlName] = new FormControl(field.FieldVal || "");
      } else if (field.input == "Yes?No") {
        group[controlName] = new FormControl(field.FieldVal || "");
      } else if (field.input == "Term?Investigation") {
        group[controlName] = new FormControl(field.FieldVal || "");
      } else if (field.input === "multiple-title/description") {
        group[controlName] = this.formBuilder.array([this.NewAddField1()]);
      } else {
        group[controlName] = new FormControl(field.FieldVal || "");
      }
    }
    this.sampleform = new FormGroup(group);
  }

  onCheckboxChange(i: number, category: string) {
    const formControl = this.sampleform.get(category);

    if (formControl instanceof FormArray) {
      const formArray = formControl as FormArray;

      if (formControl instanceof FormArray) {
        const formArray = formControl as FormArray;

        if (this.dataAr[i].status) {
          this.dataAr[i].status = false;
          formArray.clearValidators();
          formArray.controls.forEach((control) => {
            control.get("title").clearValidators();
            control.get("title").updateValueAndValidity();
            control.get("title").reset();

            control.get("description").clearValidators();
            control.get("description").updateValueAndValidity();
            control.get("description").reset();
          });
        } else {
          this.dataAr[i].status = true;
          formArray.controls.forEach((control) => {
            control.get("title").setValidators([Validators.required]);
            control.get("title").updateValueAndValidity();
            control.get("description").setValidators([Validators.required]);
            control.get("description").updateValueAndValidity();
          });
        }
      }
      formArray.updateValueAndValidity();
    } else {
      if (this.dataAr[i].status) {
        this.dataAr[i].status = false;
        formControl.clearValidators();
        formControl.reset();
      } else {
        this.dataAr[i].status = true;
        formControl.setValidators([Validators.required]);
      }
      formControl.updateValueAndValidity();
    }
    formControl.updateValueAndValidity();
  }

  SubBtn() {
    this.isSubmitted = true;
    const formValue = this.sampleform.value;
    formValue["Company"] = this.AddFieldForm.get("Company").value;
    formValue["PlanType"] = this.AddFieldForm.get("PlanType").value;
    formValue["SubPlan"] = this.AddFieldForm.get("SubPlan").value;

    if (this.sampleform.valid && this.AddFieldForm.valid) {
      const filteredFormValue = {};
      Object.keys(formValue).forEach((key) => {
        const value = formValue[key];

        if (Array.isArray(value)) {
          const nonEmptyArray = value.filter((item) => {
            if (typeof item === "object") {
              return Object.values(item).some(
                (subItem) => subItem !== null && subItem !== ""
              );
            }
            return item !== null && item !== "";
          });

          if (nonEmptyArray.length > 0) {
            filteredFormValue[key] = nonEmptyArray;
          }
        } else {
          if (
            value !== null &&
            value !== "" &&
            (typeof value !== "object" ||
              Object.values(value).some(
                (subItem) => subItem !== null && subItem !== ""
              ))
          ) {
            filteredFormValue[key] = value;
          }
        }
      });

      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.api.GetToken(),
        }),
      };

      let data = JSON.stringify(filteredFormValue);
      const formData = new FormData();

      formData.append("data", data);
      var val = false;
      for (let i = 0; i < this.dataAr.length; i++) {
        if (this.dataAr[i].status == true) {
          val = true;
          this.api.IsLoading();
          this.api.HttpPostType("/Plan_Title/planForm", formData).then(
            (resp) => {
              //   //   //   console.log(resp);
              this.api.HideLoading();
              if (resp["Status"] == true) {
                this.api.Toast(resp["toast"], resp["msg"]);
                this.CloseModel();
              } else {
                this.api.Toast(resp["toast"], resp["msg"]);
              }
            },
            (err) => {
              this.api.HideLoading();
            }
          );
          break;
        } else {
          val = false;
        }
      }

      if (val == false) {
        this.api.Toast("Warning", "Please Select Atleast One CheckBox");
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      // If the control is a FormGroup, recursively mark its controls as touched
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get formControls() {
    return this.sampleform.controls;
  }

  AddExpField(control: any): FormArray {
    return this.sampleform.get(control) as FormArray;
  }

  AddFormField(control: any) {
    this.AddedField++;

    const formArray = this.AddExpField(control) as FormArray;
    if (formArray instanceof FormArray) {
      formArray.push(this.NewAddField());
    }
  }

  NewAddField(): FormGroup {
    return this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  RemoveAddedField(i: number, control: any) {
    this.AddedField = Math.max(0, this.AddedField - 1);
    if (this.AddedField >= 0) {
      this.AddExpField(control).removeAt(i);
    }
  }

  NewAddField1(): FormGroup {
    return this.formBuilder.group({
      title: [""],
      description: [""],
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
