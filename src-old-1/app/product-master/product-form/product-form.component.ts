import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ProductReportComponent } from "../product-report/product-report.component";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.css"],
})
export class ProductFormComponent implements OnInit {
  AddFieldForm: FormGroup;
  LOBdata: any[];
  product: any[];
  company: any[];
  irdia: any[];
  pro: any;
  plan: any;
  addLOB: number = 1;

  policyType: any[];

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,

    private dialogRef: MatDialogRef<ProductReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      LOB: ["", Validators.required],
      product: ["", Validators.required],
      company: [""],
      policyType: ["", Validators.required],
      planType: [""],
      subProduct: [""],
      class: [""],
      subclass: [""],
      new: ["0"],
      renewal: ["0"],
      used: ["0"],
      rollover: ["0"],
      premium: [""],
      passenger: [""],
      irdia: ["", Validators.required],
      limit: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.GetData();
    this.pro = "";
    this.plan = "";
  }

  Change(num: any) {
    this.addLOB = num;

    const ProductMotor = this.AddFieldForm.get("product");
    ProductMotor.setValidators([Validators.required]);
    ProductMotor.updateValueAndValidity();

    const planType = this.AddFieldForm.get("planType");
    planType.setValidators([Validators.required]);
    planType.updateValueAndValidity();
  }

  GetData() {
    const formData = new FormData();
    formData.append("id", "0");

    this.api.HttpPostType("/ProductMaster/getlob", formData).then(
      (resp) => {
        this.LOBdata = resp["data"].map((item) => ({
          Id: item.LOB,
          Name: item.LOB,
        }));
        this.irdia = resp["irdia"].map((item) => ({
          Id: item.irdia,
          Name: item.irdia,
        }));
        this.policyType = resp["policy"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
        // this.LOBdata = resp['data'];
      },
      (err) => {
        console.error("HTTP error:", err);
      }
    );
  }

  formReset() {
    this.AddFieldForm.reset();
  }

  onLOBChange(selectedLOB: any) {
    if (
      selectedLOB !== null &&
      selectedLOB !== undefined &&
      selectedLOB.length > 0
    ) {
      const product = selectedLOB[0]["Name"]
        ? selectedLOB[0]["Name"]
        : selectedLOB;
      this.pro = product;

      const ProductMotor = this.AddFieldForm.get("product");
      ProductMotor.setValidators([Validators.required]);
      ProductMotor.updateValueAndValidity();

      if (product == "Motor") {
        const Company = this.AddFieldForm.get("company");
        Company.clearValidators();
        Company.updateValueAndValidity();

        const subClass = this.AddFieldForm.get("subclass");
        subClass.setValidators([Validators.required]);
        subClass.updateValueAndValidity();

        const pre = this.AddFieldForm.get("premium");
        pre.setValidators([Validators.required]);
        pre.updateValueAndValidity();

        const passenger = this.AddFieldForm.get("passenger");
        passenger.setValidators([Validators.required]);
        passenger.updateValueAndValidity();

        const subProduct = this.AddFieldForm.get("subProduct");
        subProduct.clearValidators();
        subProduct.updateValueAndValidity();

        const classes = this.AddFieldForm.get("class");
        classes.clearValidators();
        classes.updateValueAndValidity();

        const planType = this.AddFieldForm.get("planType");
        planType.clearValidators();
        planType.updateValueAndValidity();

        const formData = new FormData();
        formData.append("product", product);

        this.api.HttpPostType("/ProductMaster/getProduct", formData).then(
          (resp) => {
            this.product = resp["data"].map((item) => ({
              Id: item.Id,
              Name: item.Name,
            }));
            // this.LOBdata = resp['data'];
          },
          (err) => {
            console.error("HTTP error:", err);
          }
        );
      }

      if (product == "Health") {
        const Company = this.AddFieldForm.get("company");
        Company.setValidators([Validators.required]);
        Company.updateValueAndValidity();

        const pre = this.AddFieldForm.get("premium");
        pre.clearValidators();
        pre.updateValueAndValidity();

        const passenger = this.AddFieldForm.get("passenger");
        passenger.clearValidators();
        passenger.updateValueAndValidity();

        const subProduct = this.AddFieldForm.get("subProduct");
        subProduct.clearValidators();
        subProduct.updateValueAndValidity();

        const classes = this.AddFieldForm.get("class");
        classes.clearValidators();
        classes.updateValueAndValidity();

        const planType = this.AddFieldForm.get("planType");
        planType.clearValidators();
        planType.updateValueAndValidity();

        const formData = new FormData();
        formData.append("product", product);

        this.api.HttpPostType("/ProductMaster/getcompany", formData).then(
          (resp) => {
            this.company = resp["data"].map((item) => ({
              Id: item.id,
              Name: item.com,
            }));
            // this.LOBdata = resp['data'];
          },
          (err) => {
            console.error("HTTP error:", err);
          }
        );
      }

      if (product !== "Motor") {
        const subClass = this.AddFieldForm.get("subclass");
        subClass.clearValidators();
        subClass.updateValueAndValidity();
      }
    }
    document.getElementById("click-close").click();
  }

  onProduct(selProduct: any) {
    if (
      selProduct !== null &&
      selProduct !== undefined &&
      selProduct.length > 0
    ) {
      this.plan = selProduct[0]["Id"] ? selProduct[0]["Id"] : selProduct;
      if (this.plan) {
        if (this.plan == "PCV" || this.plan == "GCV" || this.plan == "Misc D") {
          const subProduct = this.AddFieldForm.get("subProduct");
          subProduct.setValidators([Validators.required]);
          subProduct.updateValueAndValidity();
        } else {
          const subProduct = this.AddFieldForm.get("subProduct");
          subProduct.clearValidators();
          subProduct.updateValueAndValidity();
        }

        if (this.plan == "GCV" || this.plan == "Misc D") {
          const classes = this.AddFieldForm.get("class");
          classes.setValidators([Validators.required]);
          classes.updateValueAndValidity();
        }

        if (this.plan == "TW" || this.plan == "PC") {
          const planType = this.AddFieldForm.get("planType");
          planType.setValidators([Validators.required]);
          planType.updateValueAndValidity();
        } else {
          const planType = this.AddFieldForm.get("planType");
          planType.clearValidators();
          planType.updateValueAndValidity();
        }
        document.getElementById("click-close").click();
      }
    }
  }

  onClose() {
    document.getElementById("click-close").click();
  }

  toggleCheckbox(checked: boolean, form: any) {
    this.AddFieldForm.get(form).setValue(checked ? "1" : "0");
  }

  SubBtn() {
    this.markFormGroupTouched(this.AddFieldForm);
    // console.log(this.AddFieldForm);
    if (this.AddFieldForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.api.GetToken(),
        }),
      };

      let data = JSON.stringify(this.AddFieldForm.value);
      const formData = new FormData();

      formData.append("data", data);
      this.api.IsLoading();
      this.api.HttpPostType("/ProductMaster/v2_Product", formData).then(
        (resp) => {
          this.api.HideLoading();
          this.CloseModel();
          this.formReset();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  CloseModel(): void {
    this.formReset();
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
