import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-bulk-excel',
  templateUrl: './upload-bulk-excel.component.html',
  styleUrls: ['./upload-bulk-excel.component.css']
})

export class UploadBulkExcelComponent implements OnInit {

  ActionForm: FormGroup;
  isSubmitted = false;
  SR_Id: any = 0;
  NetPremium: any = 0;
  row: any;
  User_Rights: any = [];
  ActionTypeArray: any = [];
  ExcelFile: File;
  OtherDoc: File;
  selectedFiles: File;
  excel_file: any = 0;
  other_doc: any = 0;

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor(public dialogRef: MatDialogRef<UploadBulkExcelComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router, private formBuilder: FormBuilder) {

    this.ActionForm = this.formBuilder.group({
      Action_Type: ['', [Validators.required]],
      ExcelFile: [''],
      BookingDate: ['', [Validators.required]],
      NetPremium: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      GrossPremium: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      SumAssured: ['', [Validators.pattern("^[0-9]*$")]],
      OtherDoc: ['']
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    };

  }

  ngOnInit() {
    this.SR_Id = this.data.SR_Id;
    this.NetPremium = this.data.NetPremium;
    this.ActionTypeArray = [{ Id: "Bulk_Add", Name: "Add" }, { Id: "Bulk_Delete", Name: "Delete" }];
  }


  get FC_1() { return this.ActionForm.controls; }


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== ENABLE/DISABLE VALIDATOR =====//
  EnableDisableValidation() {

    if (this.ActionForm.value['Action_Type'].length > 0 && this.ActionForm.value['Action_Type'][0]['Id'] == 'Bulk_Delete') {
      this.ActionForm.get('SumAssured').setValidators(null);

    } else {
      this.ActionForm.get('SumAssured').setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
    }

    this.ActionForm.get('SumAssured').updateValueAndValidity();

  }


  //===== UPLOAD DOCS ======//
  UploadDocs(event: any, Type: any) {

    if (Type == 'ExcelFile') {
      this.excel_file = 1;
    }

    if (Type == 'OtherDoc') {
      this.other_doc = 1;
    }

    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {

      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if ((ext == 'xlsx' && Type == 'ExcelFile') || Type == 'OtherDoc') {

        var file_size = event.target.files[0]['size'];
        const Total_Size = Math.round((file_size / 1024));

        if (Total_Size >= 1024 * 3) { // allow only 2 mb

          this.api.Toast('Error', 'File size is greater than 3 mb');
          if (Type == 'ExcelFile') {
            this.ActionForm.get('ExcelFile').setValue('');
          }

          if (Type == 'OtherDoc') {
            this.ActionForm.get('OtherDoc').setValue('');
          }

        } else {

          if (Type == 'ExcelFile') {
            this.ExcelFile = this.selectedFiles;
            this.excel_file = 1;
          }

          if (Type == 'OtherDoc') {
            this.OtherDoc = this.selectedFiles;
            this.other_doc = 1;
          }

        }

      } else {
        this.api.Toast('Error', 'Please choose vaild file ! Example :- xlsx');
        if (Type == 'ExcelFile') { this.ActionForm.get('ExcelFile').setValue(''); }

      }
    }

  }


  //===== ADD NEW EMPLOYEE DATA =====//
  BulkUploadExcel() {

    this.isSubmitted = true;
    if (this.ActionForm.invalid) {
      return;

    } else {

      var fields = this.ActionForm.value;
      const formData = new FormData();

      formData.append('SR_Id', this.SR_Id);
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Action_Type', JSON.stringify(fields['Action_Type']));
      formData.append('InputExcelFile', fields['ExcelFile']);
      formData.append('ExcelFile', this.ExcelFile);
      formData.append('BookingDate', fields['BookingDate']);
      formData.append('NetPremium', fields['NetPremium']);
      formData.append('GrossPremium', fields['GrossPremium']);
      formData.append('SumAssured', fields['SumAssured']);
      formData.append('InputOtherDoc', fields['OtherDoc']);
      formData.append('OtherDoc', this.OtherDoc);

      this.api.IsLoading();
      this.api.HttpForSR('post', 'LifeGroup/ImportAction', formData).then((result) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.api.Toast('Success', result['Message']);
          this.CloseModel();
        } else {
          this.api.Toast('Error', result['Message']);
        }

      }, (err) => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Network Error, Please try again ! ');
      });
    }

  }


  //===== PREMIUM CALUATION =====//
  LifeCalculation(Type: any) {

    var fields = this.ActionForm.value;

    const formData = new FormData();

    formData.append('CurrentInput', Type);

    formData.append('NetPremium', fields['NetPremium']);
    formData.append('GrossPremium', fields['GrossPremium']);

    this.api.HttpForSR('post', 'LifeGroup/CalculatePremium', formData).then((result) => {

      if (result['Status'] == true) {

        var res = result['Data'];

        var NetPremiumControl = this.ActionForm.get('NetPremium');
        var GrossPremiumControl = this.ActionForm.get('GrossPremium');

        if (Type == 'NetPremium') {
          GrossPremiumControl.setValue(res['GrossPremium']);
          GrossPremiumControl.updateValueAndValidity();
        }

        if (Type == 'GrossPremium') {
          NetPremiumControl.setValue(res['NetPremium']);
          NetPremiumControl.updateValueAndValidity();
        }

      } else {
        this.api.Toast('Warning', result['Message']);
      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error, Please try again ! ');
    });

  }


}