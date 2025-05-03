import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AddEditKraComponent } from '../../../modals/goal-management/add-edit-kra/add-edit-kra.component';

class ColumnsObj {
  SrNo: string;
  Id: string;
  KraType: string;
  ProfileType: string;
  EmployeeDetails: string;
  Department: string;
  Weightage: string;
  FinancialYear: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  profile_level: any;
}

@Component({
  selector: 'app-kra-master',
  templateUrl: './kra-master.component.html',
  styleUrls: ['./kra-master.component.css']
})

export class KraMasterComponent implements OnInit {

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

  constructor(public api: ApiService, private router: Router, private http: HttpClient, public dialog: MatDialog, private fb: FormBuilder) {

    this.SearchForm = this.fb.group({
      Financial_Year: [''],
      Department_Id: [''],
      Profile_Type: [''],
      Employee_Id: ['']
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
    this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/SearchComponentsData', formData).then((result) => {
      this.api.HideLoading();
      if (result['Status'] == true) {

        this.Year_Ar = result['Data']['YearsArray'];
        this.SelectedYear = result['Data']['CurrentYear'];
        this.Department_Ar = result['Data']['Vertical'];
        this.Profile_Ar = result['Data']['ProfileListArray'];
        this.Employee_Ar = result['Data']['EmployeeArray'];

        this.fy_selected = this.SelectedYear[0]['Id'];

      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {

    var fields = this.SearchForm.value;

    if (fields['Financial_Year'].length > 0) {
      this.fy_selected = fields['Financial_Year'][0]['Id'];
    }

    var query = {
      Financial_Year: fields['Financial_Year'],
      Department_Id: fields['Department_Id'],
      Profile_Type: fields['Profile_Type'],
      Employee_Id: fields['Employee_Id'],
    }

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
    });

  }


  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.SearchForm.reset();

    this.SearchForm.get('Financial_Year').setValue('');
    this.SearchForm.get('Department_Id').setValue('');
    this.SearchForm.get('Profile_Type').setValue('');
    this.SearchForm.get('Employee_Id').setValue('');
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
      dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBmsBase + '/goal-management-system/appraisals/KraMasters/GetKraData?financial_year=&User_Code=' + this.api.GetUserData('Code') + '&Portal=CRM'),
          dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
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


  //===== ADD EDIT KRA =====//
  DeleteKraMaster(row_id: any) {

    const formData = new FormData();

    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('row_id', row_id);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/AppraisalMasters/DeleteKraMaster', formData).then((result) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.api.Toast('Success', result['Message']);
        this.Reload();
      } else {
        this.api.Toast('Error', result['Message']);
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Network Error, Please try again ! ');
    });

  }


  //===== KRA RATING DETAILS =====//
  AddEditNewKra(row_id: any): void {

    const dialogRef = this.dialog.open(AddEditKraComponent, {
      width: '55%',
      height: '50%',
      disableClose: true,
      data: { row_id: row_id, financial_year: this.fy_selected }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }


}