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
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { UpdateDateComponent } from "../update-date/update-date.component";


class ColumnsObj {
  type: string;
  price: string;
  effect: string;
  create: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'app-new-date',
  templateUrl: './new-date.component.html',
  styleUrls: ['./new-date.component.css']
})
export class NewDateComponent implements OnInit {


  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];

  ActivePage: string = "Default";

  // searchForm: FormGroup;
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
  SearchForm: FormGroup;
  dropdownSettingsmultiselect: any = {};
  servicedata: any[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<NewDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.SearchForm = this.fb.group({
      Type: ['', Validators.required],
      Date: ['', Validators.required],
      Price: ['', Validators.required],
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
    this.currentUrl = this.router.url;
    this.Get();

    this.loginid = this.api.GetUserData("Id");

  }

  click() {
    document.getElementById('click').click();
  }

  SearchBtn() {
    this.markFormGroupTouched(this.SearchForm);
    this.buttonDisable = true;
    const fields = this.SearchForm.value;
    if (this.SearchForm.valid) {
      const formData = new FormData();
      formData.append("type", fields["Type"][0]["Id"]);
      formData.append("price", fields["Price"]);
      formData.append("date", JSON.stringify(fields["Date"]));

      this.api.IsLoading();

      this.api
        .HttpPostType("/vahan/price", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            this.SearchForm.reset();
            this.click();
            this.Reload();
          },
          (err) => {
            this.api.HideLoading();
            this.Reload();
          }
        );
    }


  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
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
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    this.api.IsLoading();

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl + '/vahan/priceMaster?User_Id=' +
            this.api.GetUserData("Id") +
            '&User_Type=' +
            this.api.GetUserType() +
            '&url=' +
            this.currentUrl +
            '&Action=' +
            this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  update(id: any) {
    const dialogRef = this.dialog.open(UpdateDateComponent, {

      width: "40%",
      height: "40%",
      disableClose: false,
      data: { id: id }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }


  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

}

