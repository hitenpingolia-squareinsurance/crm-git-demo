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
import { sample } from "rxjs/operators";

@Component({
  selector: "app-plan-update",
  templateUrl: "./plan-update.component.html",
  styleUrls: ["./plan-update.component.css"],
})
export class PlanUpdateComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  id: any;

  LOBdata: any[];
  companyData: any[];
  PlanOption: any[];
  SubPlan: any[];
  form: FormGroup;
  checkboxValue: boolean = false;
  formGroup: FormGroup;
  selectedOption: string = "";
  dataAr2: any[] = [];
  dropdownSettingsmultiselect: any = {};
  dropdownmultiselect: any = {};
  dtOptions: DataTables.Settings = {};
  AddedField = 0;
  AddFieldForm: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  dataAr: any[] = [];
  sampleform: FormGroup;
  appService: any;
  lstForm: any;
  LOB: any;

  addField = false;

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
    this.id = this.data.id;

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

    this.sampleform = this.fb.group({});
    this.AddFieldForm = this.fb.group({
      LOB: ["", Validators.required],
      Company: ["", Validators.required],
      PlanType: ["", Validators.required],
      SubPlan: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.getForm();
  }

  getLOB() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Plan_Title/getLOB", formData).then(
      (resp) => {
        this.LOBdata = resp["lob"].map((item) => ({
          Id: item.Name,
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
    this.LOB = lobValue["Name"];
    if (this.addField == true) {
      this.AddFieldForm.get("PlanType").reset();
      this.AddFieldForm.get("SubPlan").reset();
      this.AddFieldForm.get("Company").reset();
      this.PlanOption = [""];
      this.SubPlan = [""];

      this.click();
    }

    this.click();
    const formData = new FormData();

    const lob = lobValue["Name"];
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

        if (this.addField == false) {
          this.formValidation();
        }
        this.api.HideLoading();
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }

  getPlan(plan: any) {
    if (this.addField == true) {
      this.AddFieldForm.get("SubPlan").reset();
      this.AddFieldForm.get("PlanType").reset();
    }
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

    const subPlanType = subPlan ? subPlan["Id"] : 0;
    formData.append("subPlan", subPlanType);
    this.api.IsLoading();
    this.api.HttpPostType("Plan_Title/getSubPlan", formData).then(
      (resp) => {
        this.SubPlan = resp["subPlan"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
        this.click();
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

  getForm() {
    const formData = new FormData();
    formData.append("id", this.id);

    this.api.HttpPostType("/Plan_Title/planView", formData).then(
      (resp) => {
        this.dataAr2[0] = JSON.parse(resp["data"][0]["form"]);
        var subPlanId = JSON.parse(resp["data"][0]["subPlan"]);

        var i = 0;

        for (let i = 0; i < this.dataAr2[0].SubPlan.length; i++) {
          if (subPlanId == this.dataAr2[0].SubPlan[i].Id) {
            this.AddFieldForm.patchValue({
              LOB: [
                {
                  Id: this.dataAr2[0].LOB[0].Name,
                  Name: this.dataAr2[0].LOB[0].Name,
                },
              ],
              Company: [
                {
                  Id: this.dataAr2[0].Company[0].Id,
                  Name: this.dataAr2[0].Company[0].Name,
                },
              ],
              PlanType: this.dataAr2[0].PlanType
                ? [
                    {
                      Id: this.dataAr2[0].PlanType[0].Id,
                      Name: this.dataAr2[0].PlanType[0].Name,
                    },
                  ]
                : "",
              SubPlan: this.dataAr2[0].SubPlan
                ? [
                    {
                      Id: this.dataAr2[0].SubPlan[i].Id,
                      Name: this.dataAr2[0].SubPlan[i].Name,
                    },
                  ]
                : "",
            });
          }
        }

        var addForm = this.AddFieldForm.value;

        this.getLOB();
        this.getCompany(addForm["LOB"][0]);
        this.getPlan(addForm["Company"][0]);
        this.getSunPlan(addForm["PlanType"][0]);

        this.api.HideLoading();
        this.lobOption(this.dataAr2[0].LOB[0].Name);
      },
      (err) => {
        console.error("HTTP error:", err);
        this.api.HideLoading();
      }
    );
  }

  lobOption(lobValue: any) {
    const formData = new FormData();
    this.LOB = lobValue["Name"] ? lobValue["Name"] : lobValue;
    formData.append("lob", this.LOB);
    formData.append("id", this.id);
    this.api.HttpPostType("/Plan_Title/getPlan", formData).then(
      (resp) => {
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

  onCheckboxChange(i: number, type: any) {
    const controlName = type;
    const formControl = this.sampleform.get(controlName);

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

  formValidation() {
    const group: any = {};

    group["LOB"] = new FormControl("");
    group["Company"] = new FormControl("");
    group["PlanType"] = new FormControl("");
    group["SubPlan"] = new FormControl("");

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
        group[controlName] = this.formBuilder.array([this.NewAddField()]);
      } else {
        group[controlName] = new FormControl(field.FieldVal || "");
      }
    }
    this.sampleform = new FormGroup(group);
    this.autoValidate();
  }

  autoValidate() {
    for (var field of this.dataAr) {
      const controlName = field.Categories;
      let data = this.dataAr2[0];

      if (field.status == true) {
        let formControl = this.sampleform.get(controlName);

        if (formControl instanceof FormArray) {
          const formArray = formControl as FormArray;
          formArray.clear();

          if (data[controlName] && Array.isArray(data[controlName])) {
            data[controlName].forEach((item) => {
              const newFormGroup = this.formBuilder.group({
                title: [item.title, [Validators.required]],
                description: [item.description, [Validators.required]],
              });

              formArray.push(newFormGroup);
            });
          }

          formArray.updateValueAndValidity();
        } else {
          // let data = this.dataAr2[0];
          if (field) {
            formControl.setValidators([Validators.required]);
            formControl.setValue(data[controlName]);
            formControl.updateValueAndValidity();
          }
        }
      }
    }
    this.addField = true;
  }

  SubBtn() {
    this.isSubmitted = true;
    const formData = new FormData();
    const formValue = this.sampleform.value;
    const FieldForm = this.AddFieldForm.value;

    formValue["LOB"] = FieldForm["LOB"];
    formValue["Company"] = FieldForm["Company"];
    formValue["PlanType"] = FieldForm["PlanType"];
    formValue["SubPlan"] = FieldForm["SubPlan"];

    if (this.sampleform.valid) {
      const formValue = this.sampleform.value;

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
      // console.log(filteredFormValue['LOB']);
      let data = JSON.stringify(filteredFormValue);
      const formData = new FormData();

      formData.append("data", data);
      formData.append("id", this.id);
      // console.log(formData['data']);

      var val = false;
      for (let i = 0; i < this.dataAr.length; i++) {
        if (this.dataAr[i].status == true) {
          val = true;
          this.api.IsLoading();
          this.api.HttpPostType("/Plan_Title/planUpdate", formData).then(
            (resp) => {
              this.api.HideLoading();
              if (resp["Status"] == true) {
                this.CloseModel();
              }
              this.api.Toast(resp["toast"], resp["msg"]);
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
