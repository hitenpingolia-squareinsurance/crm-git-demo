import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
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
  selector: "app-add-insurer",
  templateUrl: "./add-insurer.component.html",
  styleUrls: ["./add-insurer.component.css"]
})
export class AddInsurerComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
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
    private dialogRef: MatDialogRef<DetailInsurerComponent>
  ) {

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      insurer: ["", [Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
      mobile: ['', [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      company: ["", [Validators.required]],
      end: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });

    this.active = [
      { Id: 1, Name: "Active" },
      { Id: 0, Name: "Inactive" }
    ];
  }

  ngOnInit() {
    this.getcompany();
    this.dateEven();
  }

  get FormValidation() {
    return this.AddFieldForm.controls;
  }

  getcompany() {
    const formData = new FormData();

    this.api
      .HttpPostTypeBms('../v3/pay-in/InsurerCheckgridEmployee/getcompany', formData)
      .then(
        (resp) => {
          this.company = resp['data'].map(item => ({ Id: item.Id, Name: item.Name }));
          // this.LOBdata = resp['data'];
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  dateEven() {
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);

    const nextYearDate = new Date(currentDate);
    nextYearDate.setFullYear(currentDate.getFullYear() + 1);

    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    nextMonthDate.setDate(currentDate.getDate() - 1);

    this.minDate = new Date(`${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`);
    this.maxDate = new Date(`${nextMonthDate.getMonth() + 1}-${nextMonthDate.getDate()}-${nextMonthDate.getFullYear()}`);
  }



  SubBtn() {
    this.isSubmitted = true;
    var field = this.AddFieldForm;
    if (field.valid) {
      let data = JSON.stringify(field.value);
      const formData = new FormData();
      formData.append("data", data);
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms('../v3/pay-in/InsurerCheckgridEmployee/addInsurer', formData
        )
        .then(
          (resp) => {
            this.api.HideLoading();
            this.api.Toast(resp["status"], resp["msg"]);
            if (resp["status"] == "Success") {
              this.CloseModel();
              this.isSubmitted = true;
            }
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  }

  toggleCheckbox(checked: boolean, form: any) {
    this.AddFieldForm.get(form).setValue(checked ? "1" : "0");
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close"
    });
  }
}
