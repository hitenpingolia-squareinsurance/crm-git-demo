import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-edit-sub-product",
  templateUrl: "./edit-sub-product.component.html",
  styleUrls: ["./edit-sub-product.component.css"],
})
export class EditSubProductComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  Id: any;
  LOB_Ar: any;
  Segment_Ar: any;
  Class_Ar: any;
  Products_Ar: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      LOB_Id: ["", Validators.required],
      Segment_Id: ["", Validators.required],
      Class_Id: ["", Validators.required],
      Product_Id: ["", Validators.required],
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
  onChangeSegment(e) {
    this.Class_Ar = [];

    var LOB_Id = e.target.value;
    this.Segment(LOB_Id);
  }
  Segment(LOB_Id) {
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
  onChangeClass(e) {
    var Segment_Id = e.target.value;
    this.Class(Segment_Id);
  }
  Class(Segment_Id) {
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
  onChangeProducts(e) {
    var Class_Id = e.target.value;
    this.Products(Class_Id);
  }
  Products(Class_Id) {
    this.api.IsLoading();
    this.api.HttpGetType("data/Product/GetAll?Class_Id=" + Class_Id).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.Products_Ar = [];
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
    this.api.HttpGetType("data/SubProduct/GetById?Id=" + this.Id).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Segment(result["Row"]["LOB_Id"]);
          this.Class(result["Row"]["Segment_Id"]);
          this.Products(result["Row"]["Class_Id"]);

          this.AddForm = this.formBuilder.group({
            LOB_Id: [result["Row"]["LOB_Id"], Validators.required],
            Segment_Id: [result["Row"]["Segment_Id"], Validators.required],
            Class_Id: [result["Row"]["Class_Id"], Validators.required],
            Product_Id: [result["Row"]["Product_Id"], Validators.required],
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
      formData.append("Segment_Id", fields["Segment_Id"]);
      formData.append("Class_Id", fields["Class_Id"]);
      formData.append("Product_Id", fields["Product_Id"]);
      formData.append("Name", fields["Name"]);
      formData.append("Status", fields["Status"]);

      this.api.IsLoading();
      this.api.HttpPostType("data/SubProduct/Edit", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.router.navigate(["/data-management/sub-products"]);
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
