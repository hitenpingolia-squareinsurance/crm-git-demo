import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
@Component({
  selector: "app-add-current-opening",
  templateUrl: "./add-current-opening.component.html",
  styleUrls: ["./add-current-opening.component.css"],
})
export class AddCurrentOpeningComponent implements OnInit {
  isSubmitted = false;
  loadAPI: Promise<any>;
  AddCatForm: FormGroup;
  AddFieldForm: FormGroup;
  LeadForm: any;
  AddedField = 0;
  AddedTechField = 0;
  AddedDesiredField = 0;
  dropdownSettingsingleselect: any = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddCurrentOpeningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddFieldForm = this.formBuilder.group({
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

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.AddFormField();
    this.AddTechFormField();
    this.AddDesiredFormField();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get formControls() {
    return this.AddFieldForm.controls;
  }

  // Experience Form start

  AddExpField(): FormArray {
    return this.AddFieldForm.get("ExpForm") as FormArray;
  }

  AddFormField() {
    this.AddedField = +this.AddedField + +1;

    if (this.AddedField) {
      this.AddExpField().push(this.NewAddField());
      //console.log(this.NewAddField());
    }
    // console.log(this.AddedField);
  }

  NewAddField(): FormGroup {
    return this.formBuilder.group({
      ExpFieldName: ["", Validators.required],
    });
  }
  RemoveAddedField(i: number) {
    this.AddedField = +this.AddedField - +1;
    if (this.AddedField >= 0) {
      //console.log(this.AddedField);
      this.AddExpField().removeAt(i);
    }
  }

  // Experience Form End
  // Technical Skills Form start

  AddTechSkillField(): FormArray {
    return this.AddFieldForm.get("TechSkillForm") as FormArray;
  }

  AddTechFormField() {
    this.AddedTechField = +this.AddedTechField + +1;

    if (this.AddedTechField) {
      this.AddTechSkillField().push(this.NewTechAddField());
      //console.log(this.NewTechAddField());
    }
    // console.log(this.AddedTechField);
  }

  NewTechAddField(): FormGroup {
    return this.formBuilder.group({
      TechFieldName: ["", Validators.required],
    });
  }

  RemoveTechField(i: number) {
    this.AddedTechField = +this.AddedTechField - +1;
    if (this.AddedTechField >= 0) {
      //console.log(this.AddedTechField);
      this.AddTechSkillField().removeAt(i);
    }
  }

  // Technical Skills Form end

  // Desired Profile  Form start

  AddDesiredField(): FormArray {
    return this.AddFieldForm.get("DesiredForm") as FormArray;
  }

  AddDesiredFormField() {
    this.AddedDesiredField = +this.AddedDesiredField + +1;

    if (this.AddedDesiredField) {
      this.AddDesiredField().push(this.NewDesiredAddField());
      //console.log(this.NewDesiredAddField());
    }
    // console.log(this.AddedDesiredField);
  }

  NewDesiredAddField(): FormGroup {
    return this.formBuilder.group({
      DesFieldName: ["", Validators.required],
    });
  }

  RemoveDesiredField(i: number) {
    this.AddedDesiredField = +this.AddedDesiredField - +1;
    if (this.AddedDesiredField >= 0) {
      //console.log(this.AddedDesiredField);
      this.AddDesiredField().removeAt(i);
    }
  }

  // Desired Profile Form end

  Submit() {
    this.isSubmitted = true;
    if (this.AddFieldForm.invalid) {
      return;
    } else {
      //console.log("valid section");
      var fields = this.AddFieldForm.value;
      const formData = new FormData();

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

      //console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("WebsiteSection/AddRecruitment1", formData).then(
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
