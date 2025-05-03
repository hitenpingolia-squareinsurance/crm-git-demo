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
import { DetailInsurerComponent } from "../detail-insurer/detail-insurer.component";

@Component({
  selector: "app-update-insurer",
  templateUrl: "./update-insurer.component.html",
  styleUrls: ["./update-insurer.component.css"],
})
export class UpdateInsurerComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
  company: any[];
  financialYearVal: { Id: string; Name: string }[];

  minDate: Date = new Date();
  maxDate: Date = new Date();
  isSubmitted = true;
  dataAr: any[] = [];
  id: any;
  num: any = 0;
  num1: any = 0;

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  end: any;

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
    private dialogRef: MatDialogRef<DetailInsurerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      insurer: ["", [Validators.required, Validators.pattern("[a-zA-Z. ]*")]],
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      company: ["", Validators.required],
      // start: ["", Validators.required],
      end: ["", Validators.required],
      status: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
    });

    this.active = [
      { Id: "1", Name: "Active" },
      { Id: "0", Name: "Inactive" },
    ];
  }

  ngOnInit() {
    this.getcompany();
    this.fetchData();
  }

  get FormValidation() {
    return this.AddFieldForm.controls;
  }

  getcompany() {
    const formData = new FormData();

    this.api
      .HttpPostTypeBms(
        "../v3/pay-in/InsurerCheckgridEmployee/getcompany",
        formData
      )
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

  dateEven(num: any) {
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);

    const nextYearDate = new Date(currentDate);
    nextYearDate.setFullYear(currentDate.getFullYear() + 1);

    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    nextMonthDate.setDate(currentDate.getDate() - 1);

    this.minDate = new Date(
      `${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}-${currentDate.getFullYear()}`
    );
    this.maxDate = new Date(
      `${
        nextMonthDate.getMonth() + 1
      }-${nextMonthDate.getDate()}-${nextMonthDate.getFullYear()}`
    );

    this.num = num;
  }

  fetchData() {
    const formData = new FormData();
    formData.append("id", this.id);
    this.api
      .HttpPostTypeBms(
        "../v3/pay-in/InsurerCheckgridEmployee/dataFetch",
        formData
      )
      .then(
        (resp) => {
          this.AddFieldForm.patchValue({
            insurer: resp["insurer_name"],
            mobile: resp["mobile"],
            company: [
              {
                Id: resp["company_id"],
                Name: resp["company"],
              },
            ],
            end: resp["end"],
            status: [
              {
                Id: resp["status"],
                Name: resp["status"] == 1 ? "Active" : "Inactive",
              },
            ],
            email: resp["email"],
          });

          this.dateEven(0);

          document.getElementById("click").click();
          this.num1 = 0;
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  SubBtn() {
    this.isSubmitted = true;
    var field = this.AddFieldForm;
    const fields = this.AddFieldForm;
    //   //   //   console.log(fields);

    if (field.valid) {
      if (this.num == 1) {
        const currentDate = new Date(this.AddFieldForm.get("end").value);
        currentDate.setDate(currentDate.getDate() + 1);

        fields.get("end").setValue(currentDate);
      }

      let data = JSON.stringify(field.value);
      const formData = new FormData();
      formData.append("data", data);
      formData.append("id", this.id);
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "../v3/pay-in/InsurerCheckgridEmployee/updateInsurer",
          formData
        )
        .then(
          (resp) => {
            this.api.HideLoading();
            this.api.Toast(resp["status"], resp["msg"]);
            if (resp["status"] == "Success") {
              this.CloseModel();
              this.isSubmitted = true;
            }
            this.num = 0;
            this.num1 = 0;
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    } else {
      return false;
    }
  }

  toggleCheckbox(checked: boolean, form: any) {
    this.AddFieldForm.get(form).setValue(checked ? "1" : "0");
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
