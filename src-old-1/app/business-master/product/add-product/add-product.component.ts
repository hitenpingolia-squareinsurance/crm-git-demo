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
import { ProductComponent } from "../product.component";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"],
})
export class AddProductComponent implements OnInit {
  AddFieldForm: FormGroup;
  company: any[];

  financialYearVal: { Id: string; Name: string }[];

  minDate: Date = new Date();
  maxDate: Date = new Date();
  isSubmitted = false;

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
    private dialogRef: MatDialogRef<ProductComponent>
  ) {
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

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);
  }

  ngOnInit() {
    this.getcompany();
  }

  getcompany() {
    const formData = new FormData();

    this.api
      .HttpPostTypeBms("../v2/business_master/CPAMaster/getcompany", formData)
      .then(
        (resp) => {
          this.company = resp["data"].map((item) => ({
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

  onClose() {
    document.getElementById("close").click();
  }

  SubBtn() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      let data = JSON.stringify(this.AddFieldForm.value);
      const formData = new FormData();

      formData.append("data", data);
      formData.append("User_Id", this.api.GetUserData("Id"));
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/business_master/CPAMaster/addForm", formData)
        .then(
          (resp) => {
            this.api.HideLoading();
            this.CloseModel();
            this.business_log(resp["id"]);
            this.isSubmitted = false;
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
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
