import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"],
})
export class AddProductComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;

  LOB_Ar: any;
  Segment_Ar: any;
  Class_Ar: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      LOB_Id: ["", Validators.required],
      Segment_Id: ["", Validators.required],
      Class_Id: ["", Validators.required],
      Name: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.LOB();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  LOB() {
    this.api.IsLoading();
    this.api.HttpGetType("data/LOB/GetAll").then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.LOB_Ar = result["Data"];
        } else {
          this.LOB_Ar = [];
          alert(result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        alert(err.message);
      }
    );
  }
  Segment(e) {
    var LOB_Id = e.target.value;

    this.api.IsLoading();
    this.api.HttpGetType("data/Segment/GetAll?LOB_Id=" + LOB_Id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Segment_Ar = result["Data"];
        } else {
          this.Segment_Ar = [];
          alert(result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        alert(err.message);
      }
    );
  }
  Class(e) {
    var Segment_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .HttpGetType("data/ClassController/GetAll?Segment_Id=" + Segment_Id)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Class_Ar = result["Data"];
          } else {
            this.Class_Ar = [];
            alert(result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
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

      formData.append("LOB_Id", fields["LOB_Id"]);
      formData.append("Segment_Id", fields["Segment_Id"]);
      formData.append("Class_Id", fields["Class_Id"]);
      formData.append("Name", fields["Name"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/Product/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/products"]);
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
