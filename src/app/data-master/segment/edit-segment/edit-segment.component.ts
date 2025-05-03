import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-edit-segment",
  templateUrl: "./edit-segment.component.html",
  styleUrls: ["./edit-segment.component.css"],
})
export class EditSegmentComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;
  LOB_Ar: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      LOB_Id: ["", Validators.required],
      Name: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    // console.log(this.Id);

    this.LOB();
    this.Get();
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

  Get() {
    this.api.IsLoading();
    this.api.HttpGetType("data/Segment/GetById?Id=" + this.Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.AddForm = this.formBuilder.group({
            LOB_Id: [result["Row"]["LOB_Id"], Validators.required],
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
      formData.append("LOB_Id", fields["LOB_Id"]);
      formData.append("Name", fields["Name"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/Segment/Edit", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/segment"]);
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
