import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-edit-current-opening",
  templateUrl: "./edit-current-opening.component.html",
  styleUrls: ["./edit-current-opening.component.css"],
})
export class EditCurrentOpeningComponent implements OnInit {
  editForm: FormGroup;
  categoryId: string;
  isSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditCurrentOpeningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.formBuilder.group({
      Title: ["", Validators.required],
      Experiance: ["", Validators.required],
      RequiredCandidate: ["", Validators.required],
      CTC: ["", Validators.required],
      Location: ["", Validators.required],
      Job_description: ["", Validators.required],
      Pypexpirydate: ["", Validators.required],
      ExpForm: this.formBuilder.array([]),
      TechSkillForm: this.formBuilder.array([]),
      DesiredForm: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.categoryId = this.data.Id;

    if (this.categoryId != "") {
      this.getFromdata();
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getFromdata() {
    const formData = new FormData();

    formData.append("Id", this.categoryId);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/GetDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        const expJson = JSON.parse(result["data"].exp_field);
        const techJson = JSON.parse(result["data"].tech_skill_field);
        const desJson = JSON.parse(result["data"].desired_field);
        const expForm = JSON.parse(expJson);
        const techForm = JSON.parse(techJson);
        const desForm = JSON.parse(desJson);

        if (result["status"] == true) {
          this.editForm.patchValue({
            Title: result["data"].title,
            Experiance: result["data"].experience,
            RequiredCandidate: result["data"].required_candidate,
            CTC: result["data"].ctc,
            Location: result["data"].location,
            Job_description: result["data"].job_description,
            Pypexpirydate: result["data"].last_date,
            ExpForm: expForm,
            TechSkillForm: techForm,
            DesiredForm: desForm,
          });

          const ExpfieldFormArray = this.editForm.get("ExpForm") as FormArray;
          ExpfieldFormArray.clear(); // Clear any existing form controls

          expForm.forEach((field) => {
            ExpfieldFormArray.push(this.AddExpField(field));
            // console.log(field);
          });

          const TechfieldFormArray = this.editForm.get(
            "TechSkillForm"
          ) as FormArray;
          TechfieldFormArray.clear(); // Clear any existing form controls

          techForm.forEach((field) => {
            TechfieldFormArray.push(this.AddTechField(field));
            // console.log(field);
          });

          const DesfieldFormArray = this.editForm.get(
            "DesiredForm"
          ) as FormArray;
          DesfieldFormArray.clear(); // Clear any existing form controls

          desForm.forEach((field) => {
            DesfieldFormArray.push(this.AddDesField(field));
            // console.log(field);
          });
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

  // expriance form

  AddExpField(field: any): FormGroup {
    return this.formBuilder.group({
      ExpFieldName: [field.ExpFieldName, Validators.required],
    });
  }

  AddFormField() {
    const ExpfieldFormArray = this.editForm.get("ExpForm") as FormArray;
    ExpfieldFormArray.push(this.AddExpField({}));
  }

  RemoveAddedField(index: number) {
    const ExpfieldFormArray = this.editForm.get("ExpForm") as FormArray;
    ExpfieldFormArray.removeAt(index);
  }

  get ExpfieldFormArray() {
    return this.editForm.get("ExpForm") as FormArray;
  }

  // expriance end

  // tech form

  AddTechField(field: any): FormGroup {
    return this.formBuilder.group({
      TechFieldName: [field.TechFieldName, Validators.required],
    });
  }

  AddTechFormField() {
    const TechfieldFormArray = this.editForm.get("TechSkillForm") as FormArray;
    TechfieldFormArray.push(this.AddTechField({}));
  }

  RemoveTechField(index: number) {
    const TechfieldFormArray = this.editForm.get("TechSkillForm") as FormArray;
    TechfieldFormArray.removeAt(index);
  }

  get TechfieldFormArray() {
    return this.editForm.get("TechSkillForm") as FormArray;
  }

  // tech end

  // des form

  AddDesField(field: any): FormGroup {
    return this.formBuilder.group({
      DesFieldName: [field.DesFieldName, Validators.required],
    });
  }

  AddDesiredFormField() {
    const DesfieldFormArray = this.editForm.get("DesiredForm") as FormArray;
    DesfieldFormArray.push(this.AddDesField({}));
  }

  RemoveDesiredField(index: number) {
    const DesfieldFormArray = this.editForm.get("DesiredForm") as FormArray;
    DesfieldFormArray.removeAt(index);
  }

  get DesfieldFormArray() {
    return this.editForm.get("DesiredForm") as FormArray;
  }

  // des end

  get formControls() {
    return this.editForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editForm.invalid) {
      return;
    } else {
      const fields = this.editForm.value;
      const formData = new FormData();

      formData.append("id", this.categoryId);

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Title", fields["Title"]);
      formData.append("Location", fields["Location"]);
      formData.append("Experiance", fields["Experiance"]);
      formData.append("RequiredCandidate", fields["RequiredCandidate"]);
      formData.append("CTC", fields["CTC"]);
      formData.append("Job_Description", fields["Job_description"]);
      formData.append("LastDateOfSubmission", fields["Pypexpirydate"]);

      formData.append("DesiredForm", JSON.stringify(fields["DesiredForm"]));
      formData.append("TechSkillForm", JSON.stringify(fields["TechSkillForm"]));
      formData.append("ExpForm", JSON.stringify(fields["ExpForm"]));

      //console.log(formData);

      this.api.IsLoading();
      this.api.HttpPostType("WebsiteSection/updateRequest", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
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

          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
}
