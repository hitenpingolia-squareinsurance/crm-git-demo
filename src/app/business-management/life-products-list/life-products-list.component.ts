import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AddLifeProductsComponent } from '../add-life-products/add-life-products.component';

class ColumnsObj {
  SrNo: string;
  Id: string;
  PolicyType: string;
  PlanType: string;
  PlanName: string;
  CompanyId: string;
  CompanyName: string;
  GstRate1: string;
  GstRate2: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
}

@Component({
  selector: 'app-life-products-list',
  templateUrl: './life-products-list.component.html',
  styleUrls: ['./life-products-list.component.css']
})

export class LifeProductsListComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  mytime: Date = new Date();

  SearchForm: FormGroup;
  isSubmitted = false;

  UserRights: any = [];
  ShowLoader12: string = 'No';

  Year_Ar: Array<any>;
  SelectedYear: any = [];
  Department_Ar: any = [];
  Profile_Ar: Array<any>;
  Employee_Ar: any = [];
  SQL_Where_STR: any;
  fy_selected: any = '';

  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};
  insurer_ar: any = [];
  policy_type_ar: any = [];
  plan_type_ar: any = [];

  constructor(public api: ApiService, private router: Router, private http: HttpClient, public dialog: MatDialog, private fb: FormBuilder) {

    this.SearchForm = this.fb.group({
      insurer_id: [''],
      policy_type: [''],
      plan_type: [''],
      search_value: ['']
    });


    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true
    };

  }

  ngOnInit(): void {
    this.SearchComponentsData();
    this.GetData();
  }


  get formControls() { return this.SearchForm.controls; }


  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {

    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('PageName', 'kra-master');
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.IsLoading();
    this.api.HttpPostTypeBms('../v2/sr/life/LifeProductsMaster/SearchComponentsData', formData).then((result) => {
      this.api.HideLoading();
      if (result['Status'] == true) {

        this.insurer_ar = result['insurer_ar'];
        this.policy_type_ar = result['policy_type_ar'];
        this.plan_type_ar = result['plan_type_ar'];

      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {

    var fields = this.SearchForm.value;

    var query = {
      insurer_id: fields['insurer_id'],
      policy_type: fields['policy_type'],
      plan_type: fields['plan_type'],
      search_value: fields['search_value'],
    }

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
    });

  }


  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.SearchForm.reset();

    this.SearchForm.get('insurer_id').setValue('');
    this.SearchForm.get('policy_type').setValue('');
    this.SearchForm.get('plan_type').setValue('');
    this.SearchForm.get('search_value').setValue('');
    this.SearchComponentsData();

    this.dataAr = [];
    this.ResetDT();

  }


  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });
  }


  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


  //===== GET DATATABLE DATA =====//
  GetData() {

    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBmsBase + '/../v2/sr/life/LifeProductsMaster/GetProductsList?User_Code=' + this.api.GetUserData('Code') + '&Portal=CRM'),
          dataTablesParameters, this.api.getHeader(environment.apiUrlBmsBase)
        ).subscribe((res:any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

          that.dataAr = resp.data;

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },

      columnDefs: [{
        targets: [0, 1, 2, 3, 4], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }]
    };
  }


  //===== KRA RATING DETAILS =====//
  AddEditProduct(row_id: any): void {

    const dialogRef = this.dialog.open(AddLifeProductsComponent, {
      width: '40%',
      height: '50%',
      disableClose: true,
      data: { row_id: row_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }


}