import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-add-payment-towards",
  templateUrl: "./add-payment-towards.component.html",
  styleUrls: ["./add-payment-towards.component.css"],
})
export class AddPaymentTowardsComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Name: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {}

  get formControls() {
    return this.AddForm.controls;
  }

  Add() {
    // console.log(this.AddForm.value);
    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("Name", fields["Name"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/Broker/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/payment-towards"]);
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
