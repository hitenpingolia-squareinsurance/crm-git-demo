import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../providers/api.service';
import { Router } from '@angular/router';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

class ColumnsObj {
  SNo: string;
  Id: string;
  Dep_Name: string;
  Branch_Name: string;
  UploadDate: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  FilterData: any[];
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-add-extra-expenses',
  templateUrl: './add-extra-expenses.component.html',
  styleUrls: ['./add-extra-expenses.component.css']
})

export class AddExtraExpensesComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  AddExtraExpForm: FormGroup;
  isSubmitted = false;

  Is_Refresh: any = 'No';
  dropdownSettingsingleselect: any = {};
  Department_Ar: any = [];
  Branch_Ar: any = [];
  Expense_Type_Ar: any = [];
  Share_Status_Ar: any = [];

  constructor(public dialogRef: MatDialogRef<AddExtraExpensesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, private router: Router,
    private formBuilder: FormBuilder) {

    this.AddExtraExpForm = this.formBuilder.group({
      Share_Status: [''],
      Department_Id: [''],
      Branch_Id: [''],
      Expense_Date: [''],
      Expense_Type: [''],
      Expense_Amount: ['', [Validators.pattern("^[0-9]*\.?[0-9]*$")]],
      Remarks: [''],
      Expense_Type_List: this.formBuilder.array([]),
      Department_List: this.formBuilder.array([]),
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true
    };

  }

  ngOnInit() {

    this.Get();
    this.GetMastersData();

  }

  get FC_6() { return this.AddExtraExpForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== GET MASTERS DATA =====//
  GetMastersData() {

    const formData = new FormData();

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseExtrasFunctions/GetMastersData', formData).then((result:any) => {
      this.api.HideLoading();
      if (result['Status'] == true) {

        this.Department_Ar = result['data']['Department_Ar'];
        this.Branch_Ar = result['data']['Branch_Ar'];
        this.Expense_Type_Ar = result['data']['Expense_Type_Ar'];
        this.Share_Status_Ar = result['data']['Share_Status_Ar'];

      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== ON SHARE STATUS CHANGE =====//
  OnSharingStatusChange() {

    if (this.AddExtraExpForm.value['Share_Status'].length == 1 && this.AddExtraExpForm.value['Share_Status'][0]['Id'] == 'Sharing') {
      this.AddNewDep();

    } else {
      this.AddNewExp();

    }

  }


  /*Expense Type List*/
  exp_list_func(): FormArray {
    return this.AddExtraExpForm.get("Expense_Type_List") as FormArray
  }

  AddNewExp() {
    this.exp_list_func().push(this.new_exp_list_func());
  }

  RemoveNewExp(i: number) {
    this.exp_list_func().removeAt(i);
  }

  new_exp_list_func(): FormGroup {
    return this.formBuilder.group({
      exp_id: '',
      exp_type: '',
      exp_amount: '',
    })
  }


  /*Department List*/
  dep_list_func(): FormArray {
    return this.AddExtraExpForm.get("Department_List") as FormArray
  }

  AddNewDep() {
    this.dep_list_func().push(this.new_dep_list_func());
  }

  RemoveNewDep(i: number) {
    this.dep_list_func().removeAt(i);
  }

  new_dep_list_func(): FormGroup {
    return this.formBuilder.group({
      dep_id: '',
      dep_type: '',
      exp_percent: '',
    })
  }


  //===== UPLOAD EXPENSES DATA =====//
  AddExtraExpenses() {

    this.isSubmitted = true;
    if (this.AddExtraExpForm.invalid) {
      return;

    } else {

      var fields = this.AddExtraExpForm.value;
      const formData = new FormData();
      var department: any, expense_type: any;
      if ((this.AddExtraExpForm.value['Share_Status'].length == 1 && this.AddExtraExpForm.value['Share_Status'][0]['Id'] == 'Sharing')) {
        department = JSON.stringify(fields['Department_List']);
        expense_type = JSON.stringify(fields['Expense_Type']);
      } else {
        department = JSON.stringify(fields['Department_Id']);
        expense_type = JSON.stringify(fields['Expense_Type_List']);
      }

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Share_Status', JSON.stringify(fields['Share_Status']));
      formData.append('Department_Id', department);
      formData.append('Branch_Id', JSON.stringify(fields['Branch_Id']));
      formData.append('Expense_Type', expense_type);
      formData.append('Expense_Date', fields['Expense_Date']);
      formData.append('Expense_Amount', fields['Expense_Amount']);
      formData.append('Remarks', fields['Remarks']);
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseManagement/AddExtraExpenses', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {

          // this.AddExtraExpForm.get("Department_Id").setValue("");
          // this.AddExtraExpForm.get("Branch_Id").setValue("");
          // // this.new_exp_list_func();
          // // this.AddExtraExpForm.reset();

          this.CloseModel();
          this.api.Toast('Success', result['Message']);

        } else {
          this.api.Toast('Error', result['Message']);
        }

      }, (err) => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Network Error, Please try again ! ');
      });
    }
  }


  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {

    this.SearchForm.reset();
    this.dataAr = [];
    this.ResetDT();

  }


  //===== RELOAD PAGE =====//
  Reload() {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });

  }


  //===== RESET DATATABLE =====//
  ResetDT() {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });

  }


  //===== GET DATATABLE DATA =====//
  Get() {

    const that = this;
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBmsBase + '/goal-management-system/expenses/ExpenseManagement/GridExtraExpensesData?&User_Id=' + this.api.GetUserData('Id') + '&User_Code=' + this.api.GetUserData('Code') + '&User_Type=' + this.api.GetUserType()), dataTablesParameters,
          this.api.getHeader(environment.apiUrlBmsBase)
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
        targets: [0, 1, 2], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }]
    };

  }


}