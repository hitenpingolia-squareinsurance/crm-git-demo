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
import { ProductComponent } from "../product.component";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-update-product",
  templateUrl: "./update-product.component.html",
  styleUrls: ["./update-product.component.css"],
})
export class UpdateProductComponent implements OnInit {
  id: any;
  com_id: any;
  AddFieldForm: FormGroup;
  dataAr: any[] = [];
  dataAr2: any[] = [];
  company: any;
  isSubmitted = false;
  financialYearVal: { Id: string; Name: string }[];

  minDate: Date = new Date();
  maxDate: Date = new Date();

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

    private dialogRef: MatDialogRef<ProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.com_id = data.com;

    this.AddFieldForm = this.formBuilder.group({
      company: ["", Validators.required],
      pvt: ["", [Validators.required, Validators.min(1), Validators.max(1000)]],
      tw: ["", [Validators.required, Validators.min(1), Validators.max(1000)]],
      gcv: ["", [Validators.required, Validators.min(1), Validators.max(1000)]],
      misd: [
        "",
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      pcv: ["", [Validators.required, Validators.min(1), Validators.max(1000)]],
      // status: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      effective: ["", Validators.required],
    });

    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);
  }

  ngOnInit() {
    this.get();
  }

  get() {
    const formData = new FormData();
    formData.append("id", this.id);
    formData.append("com", this.com_id);
    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("../v2/business_master/CPAMaster/fetch", formData)
      .then(
        (resp) => {
          this.dataAr = resp["data"];
          this.dataAr2 = resp["company"][0]["Name"];

          this.AddFieldForm.patchValue({
            company: this.dataAr[0]["company_id"],
            pvt: this.dataAr[0]["pvt"],
            tw: this.dataAr[0]["tw"],
            gcv: this.dataAr[0]["gcv"],
            misd: this.dataAr[0]["misd"],
            pcv: this.dataAr[0]["pcv"],
            status: this.dataAr[0]["status"],
            effective: this.dataAr[0]["effective_date"],
          });

          this.api.HideLoading();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  dateClear() {
    this.AddFieldForm.get("effective").reset();
  }

  SubBtn() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      let data = JSON.stringify(this.AddFieldForm.value);
      const formData = new FormData();
      formData.append("id", this.dataAr[0]["id"]);
      formData.append("data", data);
      formData.append("User_Id", this.api.GetUserData("Id"));
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/business_master/CPAMaster/updateForm", formData)
        .then(
          (resp) => {
            this.api.HideLoading();
            this.CloseModel();
            this.api.Toast(resp["data"], resp["msg"]);
            if (resp["data"] == "Success") {
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

  business_log(id: any) {
    let data = JSON.stringify(this.AddFieldForm.value);
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", "square.ins_companies_cpa");
    formData.append("log", "update");
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
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
