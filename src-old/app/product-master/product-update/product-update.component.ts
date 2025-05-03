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
  selector: "app-product-update",
  templateUrl: "./product-update.component.html",
  styleUrls: ["./product-update.component.css"],
})
export class ProductUpdateComponent implements OnInit {
  AddFieldForm: FormGroup;
  LOBdata: any[];
  product: any[];
  company: any[];
  irdia: any[];
  pro: any;
  plan: any;

  id: any;

  policyType: any[];
  dataAr: any[] = [];

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
    this.id = data.id;
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
    this.get();

    this.pro = "";
    this.plan = "";
  }

  get() {
    const formData = new FormData();

    formData.append("id", this.id);
    this.api.IsLoading();
    this.api.HttpPostType("/ProductMaster/Productdetail", formData).then(
      (resp) => {
        this.dataAr = resp["data"];
        // console.log(this.dataAr);

        this.AddFieldForm.patchValue({
          LOB: this.dataAr[0]["LOB"],
          product:
            this.dataAr[0]["LOB"] == "Motor"
              ? [
                  {
                    Id: this.dataAr[0]["Product"],
                    Name: this.dataAr[0]["PName"],
                  },
                ]
              : this.dataAr[0]["PName"],
          company: [
            {
              Id: this.dataAr[0]["Company_Name"],
              Name: this.dataAr[0]["Company_Name"],
            },
          ],
          policyType:
            this.dataAr[0]["LOB"] == "Motor"
              ? [
                  {
                    Id: this.dataAr[0]["Policy_Type"],
                    Name: this.dataAr[0]["PTName"],
                  },
                ]
              : this.dataAr[0]["PTName"],
          planType: this.dataAr[0]["Plan_Type"],
          subProduct: this.dataAr[0]["SubProduct"],

          class: this.dataAr[0]["Class_Name"],
          subclass: this.dataAr[0]["Sub_Class"],
          new: this.dataAr[0]["New"],
          renewal: this.dataAr[0]["Renewal"],
          used: this.dataAr[0]["Used"],
          rollover: this.dataAr[0]["Rollover"],

          premium: this.dataAr[0]["TP_Premium"],
          passenger: this.dataAr[0]["Per_Passenger_Cost"],
          irdia: [
            {
              Id: this.dataAr[0]["IRDIA_Product_Status"],
              Name: this.dataAr[0]["IRDIA_Product_Status"],
            },
          ],
          limit: this.dataAr[0]["Limit_Sum_Insured"],
        });

        this.api.HideLoading();

        const LOB = this.AddFieldForm.get("LOB");
        LOB.setValidators([Validators.required]);
        LOB.updateValueAndValidity();

        this.pro = this.dataAr[0]["LOB"];
        this.onLOBChange();
        this.onProduct(this.dataAr[0]["Product"]);
      },
      (err) => {
        this.api.HideLoading();
      }
    );
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
      },
      (err) => {
        console.error("HTTP error:", err);
      }
    );
  }

  formReset() {
    this.AddFieldForm.reset();
  }

  onLOBChange() {
    const product = this.pro;
    // this.pro = product;

    const LOB = this.AddFieldForm.get("LOB");
    LOB.setValidators([Validators.required]);
    LOB.updateValueAndValidity();

    const ProductMotor = this.AddFieldForm.get("product");
    ProductMotor.setValidators([Validators.required]);
    ProductMotor.updateValueAndValidity();

    const policyType = this.AddFieldForm.get("policyType");
    policyType.setValidators([Validators.required]);
    policyType.updateValueAndValidity();

    const irdia = this.AddFieldForm.get("irdia");
    irdia.setValidators([Validators.required]);
    irdia.updateValueAndValidity();

    const limit = this.AddFieldForm.get("limit");
    limit.setValidators([Validators.required]);
    limit.updateValueAndValidity();

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
            Id: item.com,
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
          const classes = this.AddFieldForm.get("class");
          classes.clearValidators();
          classes.updateValueAndValidity();

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
      this.AddFieldForm.patchValue({
        LOB: [{ Id: this.dataAr[0]["LOB"], Name: this.dataAr[0]["LOB"] }],
      });

      let data = JSON.stringify(this.AddFieldForm.value);
      const formData = new FormData();

      formData.append("data", data);
      formData.append("id", this.dataAr[0]["Id"]);
      this.api.IsLoading();
      this.api.HttpPostType("/ProductMaster/ProductUpdate", formData).then(
        (resp) => {
          this.api.HideLoading();
          this.formReset();
          this.CloseModel();
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
