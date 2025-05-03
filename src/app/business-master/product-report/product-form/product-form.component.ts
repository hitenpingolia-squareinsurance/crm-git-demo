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
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ProductReportComponent } from "../../product-report/product-report.component";

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
  isSubmitted = false;
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
      LOB: ["", [Validators.required]],
      product: ["", Validators.required],
      company: [""],
      policyType: ["", Validators.required],
      planType: ["", [Validators.required]],
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
      limit: ["", [Validators.required, Validators.min(0)]],

      year_1_gst: [""],
      year_2_gst: [""],
      effective_date: [""],
    });
  }

  ngOnInit() {
    this.GetData();
    this.pro = "";
    this.plan = "";
  }

  Change(num: any) {
    const field = this.AddFieldForm;
    this.addLOB = num;
    field.reset();
    this.pro = "";
    this.plan = "";
    const lob = field.get("LOB");
    if (num == 1) {
      lob.clearValidators();
      lob.updateValueAndValidity();
      lob.setValidators([Validators.required]);
      lob.updateValueAndValidity();
    } else {
      lob.clearValidators();
      lob.updateValueAndValidity();
      lob.setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z ]*"),
      ]);
      lob.updateValueAndValidity();
    }

    const ProductMotor = field.get("product");
    ProductMotor.setValidators([Validators.required]);
    ProductMotor.updateValueAndValidity();
  }

  GetData() {
    const formData = new FormData();
    formData.append("id", "0");

    this.api
      .HttpPostTypeBms("../v2/business_master/ProductMaster/getlob", formData)
      .then(
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
    const field = this.AddFieldForm;
    field.get("product").reset();
    field.get("company").reset();
    field.get("policyType").reset();
    field.get("planType").reset();
    field.get("subProduct").reset();
    field.get("new").setValue(0);
    field.get("renewal").setValue(0);
    field.get("used").setValue(0);
    field.get("rollover").setValue(0);
    field.get("premium").reset();
    field.get("passenger").reset();
    field.get("irdia").reset();
    field.get("limit").reset();
    field.get("year_1_gst").reset();
    field.get("year_2_gst").reset();
    field.get("effective_date").reset();

    if (
      selectedLOB !== null &&
      selectedLOB !== undefined &&
      selectedLOB.length > 0
    ) {
      const product = selectedLOB[0]["Name"]
        ? selectedLOB[0]["Name"]
        : selectedLOB;
      this.pro = product;

      const policyType = this.AddFieldForm.get("policyType");
      policyType.setValidators([Validators.required]);
      policyType.updateValueAndValidity();

      if (product == "Motor") {
        const ProductMotor = this.AddFieldForm.get("product");
        ProductMotor.clearValidators();
        ProductMotor.updateValueAndValidity();
        ProductMotor.setValidators([Validators.required]);
        ProductMotor.updateValueAndValidity();

        const Company = this.AddFieldForm.get("company");
        Company.clearValidators();
        Company.updateValueAndValidity();

        const subClass = this.AddFieldForm.get("subclass");
        subClass.setValidators([Validators.required]);
        subClass.updateValueAndValidity();

        const pre = this.AddFieldForm.get("premium");
        pre.setValidators([Validators.required, Validators.min(1)]);
        pre.updateValueAndValidity();

        const passenger = this.AddFieldForm.get("passenger");
        passenger.setValidators([Validators.required, Validators.min(0)]);
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

        this.api
          .HttpPostTypeBms(
            "../v2/business_master/ProductMaster/getProduct",
            formData
          )
          .then(
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

        this.api
          .HttpPostTypeBms(
            "../v2/business_master/ProductMaster/getcompany",
            formData
          )
          .then(
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

        const planType = this.AddFieldForm.get("planType");
        planType.setValidators([Validators.required]);
        planType.updateValueAndValidity();

        const ProductMotor = this.AddFieldForm.get("product");
        ProductMotor.clearValidators();
        ProductMotor.updateValueAndValidity();
        ProductMotor.setValidators([
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
        ]);
        ProductMotor.updateValueAndValidity();
      }

      if (product === "Life") {
        // Add validators for year_1_gst, year_2_gst, and effective_date when product is 'Life'
        this.AddFieldForm.get("year_1_gst").setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]);
        this.AddFieldForm.get("year_2_gst").setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]);
        this.AddFieldForm.get("effective_date").setValidators([
          Validators.required,
        ]);
      } else {
        // Clear validators if product is not 'Life'
        this.AddFieldForm.get("year_1_gst").clearValidators();
        this.AddFieldForm.get("year_2_gst").clearValidators();
        this.AddFieldForm.get("effective_date").clearValidators();

        // Optionally reset values to avoid having old invalid values
        this.AddFieldForm.get("year_1_gst").reset();
        this.AddFieldForm.get("year_2_gst").reset();
        this.AddFieldForm.get("effective_date").reset();
      }

      // Update form validity status only once after adding/clearing validators
      this.AddFieldForm.get("year_1_gst").updateValueAndValidity();
      this.AddFieldForm.get("year_2_gst").updateValueAndValidity();
      this.AddFieldForm.get("effective_date").updateValueAndValidity();
    }
    document.getElementById("click-close").click();
  }

  onProduct(selProduct: any) {
    const field = this.AddFieldForm;
    field.get("company").reset();
    field.get("policyType").reset();
    field.get("planType").reset();
    field.get("subProduct").reset();
    field.get("new").setValue(0);
    field.get("renewal").setValue(0);
    field.get("used").setValue(0);
    field.get("rollover").setValue(0);
    field.get("premium").reset();
    field.get("passenger").reset();
    field.get("irdia").reset();
    field.get("limit").reset();
    field.get("year_1_gst").reset();
    field.get("year_2_gst").reset();
    field.get("effective_date").reset();

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
          classes.setValidators([
            Validators.required,
            Validators.pattern("[a-zA-Z ]*"),
          ]);
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
    //   //   //   console.log(this.AddFieldForm);
    this.isSubmitted = true;
    var field = this.AddFieldForm.value;
    if (this.pro == "Motor") {
      if (
        field["new"] != "0" ||
        field["renewal"] != "0" ||
        field["used"] != "0" ||
        field["rollover"] != "0"
      ) {
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
          formData.append("Login_User_Id", this.api.GetUserData("Id"));
          this.api.IsLoading();
          this.api
            .HttpPostTypeBms(
              "../v2/business_master/ProductMaster/v2_Product",
              formData
            )
            .then(
              (resp) => {
                this.api.HideLoading();
                this.CloseModel();
                if (resp["data"]) {
                  this.api.Toast(resp["data"], resp["msg"]);
                  this.business_log(resp["id"]);
                  this.isSubmitted = false;
                }
              },
              (err) => {
                this.api.HideLoading();
              }
            );
        }
      } else {
        this.api.Toast("Warning", "Select Atleast One Check Box");
      }
    } else {
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
        formData.append("Login_User_Id", this.api.GetUserData("Id"));
        this.api.IsLoading();
        this.api
          .HttpPostTypeBms(
            "../v2/business_master/ProductMaster/v2_Product",
            formData
          )
          .then(
            (resp) => {
              this.api.HideLoading();
              this.CloseModel();
              if (resp["data"]) {
                this.api.Toast(resp["data"], resp["msg"]);
                this.business_log(resp["id"]);
                this.isSubmitted = false;
              }
            },
            (err) => {
              this.api.HideLoading();
            }
          );
      }
    }
  }

  business_log(id: any) {
    let data = JSON.stringify(this.AddFieldForm.value);
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", "square.v2_sr_product_master");
    formData.append("log", "insert");
    formData.append("id", id);
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api
      .HttpPostTypeBms("../v2/business_master/Business_Log/logInsert", formData)
      .then(
        (resp) => {
          this.AddFieldForm.reset();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  CloseModel(): void {
    this.formReset();
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
