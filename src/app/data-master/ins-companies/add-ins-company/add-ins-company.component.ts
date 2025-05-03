import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-add-ins-company",
  templateUrl: "./add-ins-company.component.html",
  styleUrls: ["./add-ins-company.component.css"],
})
export class AddInsCompanyComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;

  public items: Array<string>;
  public value: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Name: ["", Validators.required],
      Cities: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    //this.Cities();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  public selected(value: any): void {
    // console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    // console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  searchCities(e) {
    //// console.log(e.target.value);
    //this.api.IsLoading();
    this.api
      .HttpGetType("data/InsuranceCompanies/Cities?q=" + e.target.value)
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["Status"] == true) {
            this.items = result["Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          alert(err.message);
        }
      );
  }

  Add() {
    // console.log(this.value);
    // console.log(this.AddForm.value);
    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("Name", fields["Name"]);
      formData.append("Cities", JSON.stringify(fields["Cities"]));
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/InsuranceCompanies/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/insurance-companies"]);
          } else {
            alert(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          alert(err.message);
        }
      );
    }
  }
}
