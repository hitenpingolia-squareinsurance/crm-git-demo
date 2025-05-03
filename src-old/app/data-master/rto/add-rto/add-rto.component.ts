import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-add-rto",
  templateUrl: "./add-rto.component.html",
  styleUrls: ["./add-rto.component.css"],
})
export class AddRtoComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  StatesAr: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      State_Id: ["", Validators.required],
      Region_Name: ["", Validators.required],
      City_Name: ["", Validators.required],
      RTO_Code: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.GallAllStates();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  GallAllStates() {
    this.api.IsLoading();
    this.api.HttpGetType("data/RTO/GallAllStates").then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.StatesAr = result["Data"];
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

  Add() {
    // console.log(this.AddForm.value);
    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("State_Id", fields["State_Id"]);
      formData.append("Region_Name", fields["Region_Name"]);
      formData.append("City_Name", fields["City_Name"]);
      formData.append("RTO_Code", fields["RTO_Code"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/RTO/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/rto"]);
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
