import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.css"],
})
export class AddCategoryComponent implements OnInit {
  isSubmitted = false;
  loadAPI: Promise<any>;
  AddCatForm: FormGroup;
  AddFieldForm: FormGroup;
  LeadForm: any;
  CategoryId: any;
  Type: any;
  AddedField = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.CategoryId = this.data.Id;
    this.Type = this.data.type;

    if (this.Type == "Edit") {
      this.AddFieldForm = this.formBuilder.group({
        CatName: [""],
        FieldForm: this.formBuilder.array([]),
      });
    } else {
      this.AddFieldForm = this.formBuilder.group({
        CatName: ["", Validators.required],
        FieldForm: this.formBuilder.array([]),
      });
    }
  }

  ngOnInit() {
    this.AddFormField();
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
    this.AddedField = +this.AddedField + +1;

    if (this.AddedField) {
      this.AddField().push(this.NewAddField());
      // console.log(this.NewAddField());
    }
    // console.log(this.AddedField);
  }

  NewAddField(): FormGroup {
    return this.formBuilder.group({
      FieldName: ["", Validators.required],
      FieldType: ["", Validators.required],
      Required: [""],
      FieldVal: [""],
    });
  }

  RemoveAddedField(i: number) {
    this.AddedField = +this.AddedField - +1;
    if (this.AddedField >= 0) {
      // console.log(this.AddedField);
      this.AddField().removeAt(i);
    }
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

      formData.append("Category", fields["CatName"]);
      formData.append("CategoryId", this.CategoryId);
      formData.append("Type", this.Type);
      formData.append("FieldForm", JSON.stringify(fields["FieldForm"]));

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("Inventory/AddCategory", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["assest-manegment/view-assest-manegment"]);
          } else {
            const msg = "msg";
            //alert(result['message']);
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
}
