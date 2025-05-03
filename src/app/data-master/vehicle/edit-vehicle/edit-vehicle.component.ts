import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-edit-vehicle",
  templateUrl: "./edit-vehicle.component.html",
  styleUrls: ["./edit-vehicle.component.css"],
})
export class EditVehicleComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;

  VehicleType_Ar: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      Vehicle_Type_Id: ["", Validators.required],
      Make: ["", Validators.required],
      Model: ["", Validators.required],
      Variant: ["", Validators.required],
      Fuel_Type: ["", Validators.required],
      Cubic_Capacity: ["", Validators.required],
      Seating_Capacity: ["", Validators.required],
      Body_Type: ["", Validators.required],
      Status: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    // console.log(this.Id);
    this.VehicleType();
    this.Get();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  VehicleType() {
    this.api.IsLoading();
    this.api.HttpGetType("data/ClassController/MotorVehicleType").then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.VehicleType_Ar = result["Data"];
        } else {
          this.VehicleType_Ar = [];
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
    this.api.HttpGetType("data/VehicleData/GetById?Id=" + this.Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.AddForm = this.formBuilder.group({
            Vehicle_Type_Id: [
              result["Row"]["Vehicle_Type_Id"],
              Validators.required,
            ],
            Make: [result["Row"]["Make"], Validators.required],
            Model: [result["Row"]["Model"], Validators.required],
            Variant: [result["Row"]["Variant"], Validators.required],
            Fuel_Type: [result["Row"]["Variant"], Validators.required],
            Cubic_Capacity: [
              result["Row"]["Cubic_Capacity"],
              Validators.required,
            ],
            Seating_Capacity: [
              result["Row"]["Seating_Capacity"],
              Validators.required,
            ],
            Body_Type: [result["Row"]["Body_Type"], Validators.required],
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
      formData.append("Vehicle_Type_Id", fields["Vehicle_Type_Id"]);
      formData.append("Make", fields["Make"]);
      formData.append("Model", fields["Model"]);
      formData.append("Variant", fields["Variant"]);
      formData.append("Fuel_Type", fields["Fuel_Type"]);
      formData.append("Cubic_Capacity", fields["Cubic_Capacity"]);
      formData.append("Seating_Capacity", fields["Seating_Capacity"]);
      formData.append("Body_Type", fields["Body_Type"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/VehicleData/Edit", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/vehicle"]);
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
