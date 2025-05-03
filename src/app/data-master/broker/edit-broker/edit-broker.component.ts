import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";
@Component({
  selector: "app-edit-broker",
  templateUrl: "./edit-broker.component.html",
  styleUrls: ["./edit-broker.component.css"],
})
export class EditBrokerComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Name: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    // console.log(this.Id);
    this.Get();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  Get() {
    this.api.IsLoading();
    this.api.HttpGetType("data/Broker/GetById?Id=" + this.Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.AddForm = this.formBuilder.group({
            Name: [result["Row"]["Name"], Validators.required],
            Status: [result["Row"]["Status"], Validators.required],
          });
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

  Edit() {
    // console.log(this.AddForm.value);
    this.isSubmitted = true;
    if (this.AddForm.invalid) {
      return;
    } else {
      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("Id", this.Id);
      formData.append("Name", fields["Name"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/Broker/Edit", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/broker"]);
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
