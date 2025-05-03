import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { NewDateComponent } from "../new-date/new-date.component";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-update-date",
  templateUrl: "./update-date.component.html",
  styleUrls: ["./update-date.component.css"],
})
export class UpdateDateComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];

  ActivePage: string = "Default";

  id: any;
  ActionType: any = "";

  isSubmitted = false;

  dropdownSettingsGlobelLOB: any = {};
  dropdownSettingsBusniessType: any = {};
  dropdownSettingsType: any = {};
  PolicyFileType: any;
  ProductType: any;
  PolicyType: any;
  QuotesStatus: { Id: string; Name: string }[];
  QuoteTypes: { Id: string; Name: string }[];
  dropdownSingleSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownMultiSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  RequestedQuote: any;
  FilterDatatype: any;
  currentUrl: string;
  filterFormData: any;
  loginid: any;
  TatTable: any;
  buttonDisable = false;
  AddFrom: FormGroup;
  dropdownSettingsmultiselect: any = {};
  servicedata: any[];
  types: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<NewDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.AddFrom = this.fb.group({
      id: [""],
      Date: ["", Validators.required],
      Price: ["", [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]],
    });

    this.servicedata = [
      { Id: "1", Name: "vahan" },
      { Id: "2", Name: "whatsp" },
      { Id: "3", Name: "sms" },
      // { Id: "6", Name: "Close" },
    ];

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      // enableCheckAll: true,
      allowSearchFilter: false,
    };
  }

  ngOnInit(): void {
    this.fetch();
    this.currentUrl = this.router.url;
    this.loginid = this.api.GetUserData("Id");
  }

  click() {
    document.getElementById("click").click();
  }

  fetch() {
    this.api.IsLoading();
    const formData = new FormData();
    formData.append("id", this.id);
    this.api.HttpPostType("vahan/fetch", formData).then(
      (result) => {
        this.api.HideLoading();
        this.AddFrom.patchValue({
          id: result[0].id,
          Date: result[0].effective_date,
          Price: result[0].price,
        });

        //   console.log(

        this.types = result[0].type;
      },
      (err) => {
        this.api.HideLoading();
      }
    );
  }

  submit() {
    this.api.IsLoading();
    var field = this.AddFrom.value;
    const formData = new FormData();
    formData.append("data", JSON.stringify(field));
    if (this.AddFrom.valid) {
      this.api.HttpPostType("vahan/update", formData).then(
        (result) => {
          this.api.HideLoading();
          this.api.Toast(result["status"], result["msg"]);
          this.AddFrom.reset();
          this.CloseModel();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
    } else {
      this.api.HideLoading();
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
  //===== RELOAD =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== FILTER DATA =====//
  SearchData(event: any) {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
