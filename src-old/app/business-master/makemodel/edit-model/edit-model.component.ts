import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { MakemodelComponent } from "../makemodel.component";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-edit-model",
  templateUrl: "./edit-model.component.html",
  styleUrls: ["./edit-model.component.css"],
})
export class EditModelComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;

  VehicleType_Ar: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<MakemodelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = data.id;

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
    // this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
    // console.log(this.Id);
    this.VehicleType();
    this.Get();
  }

  get formControls() {
    return this.AddForm.controls;
  }

  VehicleType() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api
      .HttpPostType(
        "business_master/ClassController/MotorVehicleType",
        formData
      )
      .then(
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
    const formData = new FormData();
    formData.append("Id", this.Id);
    this.api.IsLoading();
    this.api.HttpPostType("business_master/VehicleData/GetById", formData).then(
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
