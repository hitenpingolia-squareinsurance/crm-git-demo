import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-edit-rto",
  templateUrl: "./edit-rto.component.html",
  styleUrls: ["./edit-rto.component.css"],
})
export class EditRtoComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;
  StatesAr: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    // console.log(this.Id);
    this.GallAllStates();
    this.Get();
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

  Get() {
    this.api.IsLoading();
    this.api.HttpGetType("data/RTO/GetById?Id=" + this.Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.AddForm = this.formBuilder.group({
            State_Id: [result["Row"]["State_ID_FK"], Validators.required],
            Region_Name: [result["Row"]["Region_Name"], Validators.required],
            City_Name: [
              result["Row"]["City_or_Village_Name"],
              Validators.required,
            ],
            RTO_Code: [result["Row"]["Region_Code"], Validators.required],
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
      formData.append("State_Id", fields["State_Id"]);
      formData.append("Region_Name", fields["Region_Name"]);
      formData.append("City_Name", fields["City_Name"]);
      formData.append("RTO_Code", fields["RTO_Code"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/RTO/Edit", formData).then(
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
