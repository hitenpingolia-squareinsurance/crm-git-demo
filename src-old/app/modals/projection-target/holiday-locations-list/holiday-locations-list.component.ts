import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class ColumnsObj {
  SNo: string;
  Id: string;
  Location_Name: string;
  isSelected: any;
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
  selector: 'app-holiday-locations-list',
  templateUrl: './holiday-locations-list.component.html',
  styleUrls: ['./holiday-locations-list.component.css']
})

export class HolidayLocationsListComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

  AddMoreForm: FormGroup;
  isSubmitted1 = false;

  ShowAddMoreBtn: any = 'Yes';

  Holiday_Id: any = '';
  Is_Action: any = 'No';

  checkAll: number = 0;
  checkedList: any = [];
  masterSelected: boolean;

  Locations_Array: any = [];
  dropdownSettingMultipleSelect: {};

  constructor(public dialogRef: MatDialogRef<HolidayLocationsListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public formBuilder: FormBuilder) {

    this.SearchForm = this.formBuilder.group({
      SearchValue: ['', [Validators.required]],
    });

    this.AddMoreForm = this.formBuilder.group({
      Service_Location: ['', [Validators.required]],
    });

    this.dropdownSettingMultipleSelect = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true
    };

    this.Holiday_Id = this.data.Holiday_Id;
    this.Is_Action = this.data.Is_Action;

  }

  ngOnInit() {
    this.Get();
  }

  //===== GET VALIDATION FROM CONTROLS =====//
  get formControls() { return this.SearchForm.controls; }
  get formControls1() { return this.AddMoreForm.controls; }

  //===== CHECK UNCHECK ALL =====//
  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }


  //===== CHECK SELECTED =====//
  isAllSelected() {
    this.masterSelected = this.dataAr.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }


  //===== GET CHECKED ITEM =====//
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if (this.dataAr[i].isSelected && (this.api.GetUserData('User_Id_Dec') == this.dataAr[i]['POS_RM_Id'])) {
        this.checkedList.push({ Id: this.dataAr[i].Id });
      }
    }

    this.checkedList = this.checkedList;

  }


  //===== SHOW ADD MORE FORM =====//
  ShowAddMoreForm() {

    const formData = new FormData();
    formData.append('Holiday_Id', this.Holiday_Id);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('projection-target/HolidaysRelated/GetServiceLocations', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.Locations_Array = result['Locations_Array'];
        this.ShowAddMoreBtn = 'No';

      } else {
        this.Locations_Array = [];
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Network Error, No location found! ');
    });

  }


  //===== CANCEL ADD MORE =====//
  CancelAddMore() {
    this.ShowAddMoreBtn = 'Yes';
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {

    var fields = this.SearchForm.value;
    var query = {
      SearchValue: fields['SearchValue'],
    }

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
    });

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    this.SearchForm.reset();
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
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }


  //===== GET DATATABLE DATA =====//
  Get() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.api.GetToken()
      })
    };

    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      //dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBmsBase + '/projection-target/HolidaysRelated/GetHolidayLocations?&User_Code=' + this.api.GetUserData('Code') + '&Holiday_Id=' + this.Holiday_Id + '&Portal=CRM'), dataTablesParameters,
          this.api.getHeader(environment.apiUrlBmsBase)
          ).subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp.Status == false) {
              that.dataAr = [];

            } else {
              that.dataAr = resp.data;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },

      columnDefs: [{
        targets: [0, 1], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }]
    };
  }


  //===== ADD MORE LOCATION =====//
  AddMoreHolidayLocation() {

    this.isSubmitted1 = true;
    if (this.AddMoreForm.invalid) {
      return;

    } else {

      var fields = this.AddMoreForm.value;
      const formData = new FormData();

      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Holiday_Id', this.Holiday_Id);
      formData.append('Service_Location', JSON.stringify(fields['Service_Location']));

      this.api.IsLoading();
      this.api.HttpPostTypeBms('projection-target/HolidaysRelated/AddMoreHolidayLocation', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.ShowAddMoreBtn = 'Yes';
          this.AddMoreForm.reset();
          this.Locations_Array = [];
          this.api.Toast('Success', result['Message']);
          this.Reload();

        } else {
          this.api.Toast('Warning', result['Message']);
        }
      }, (err) => {
        this.api.HideLoading();
        this.api.Toast('Error', 'Network Error : ' + err.name + '(' + err.statusText + ')');
      });
    }

  }


  //===== DELETE LOCATION =====//
  RemoveLocation() {

    const formData = new FormData();
    formData.append('User_Code', this.api.GetUserData('Code'));
    formData.append('Holiday_Id', this.Holiday_Id);
    formData.append('Checklist', JSON.stringify(this.checkedList));

    this.api.IsLoading();
    this.api.HttpPostTypeBms('projection-target/HolidaysRelated/RemoveHolidayLocation', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.checkedList = [];
        this.api.Toast('Success', result['Message']);
        this.Reload();

      } else {
        const msg = 'msg';
        this.api.Toast('Warning', result['Message']);
      }
    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Error', 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }

}