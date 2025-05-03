import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-holiday',
  templateUrl: './add-new-holiday.component.html',
  styleUrls: ['./add-new-holiday.component.css']
})

export class AddNewHolidayComponent implements OnInit {

  AddHolidayForm: FormGroup;
  isSubmitted = false;
  row: any;
  Is_Refresh: any = 'No';
  minDate = new Date();
  Locations_Array: any = [];

  dropdownSettingMultipleSelect: {};

  constructor(public dialogRef: MatDialogRef<AddNewHolidayComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router,
    private formBuilder: FormBuilder) {

    this.AddHolidayForm = this.formBuilder.group({
      Holiday_Date: ["", [Validators.required]],
      Service_Location: ['', [Validators.required]],
      Holiday_Remark: [''],
    });

    this.dropdownSettingMultipleSelect = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true
    };

  }

  ngOnInit() {

    this.GetServiceLocations();

  }

  get formControls() { return this.AddHolidayForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== GET SERVICE LOCATIONS =====//
  GetServiceLocations() {

    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostTypeBms('projection-target/HolidaysRelated/GetServiceLocations', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.Locations_Array = result['Locations_Array'];
      } else {
        this.Locations_Array = [];
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Network Error, No location found! ');
    });

  }


  //===== ADD NEW HOLIDAY DATA =====//
  AddNewHoliday() {

    this.isSubmitted = true;
    if (this.AddHolidayForm.invalid) {
      return;

    } else {

      var fields = this.AddHolidayForm.value;
      const formData = new FormData();

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Holiday_Date', fields['Holiday_Date']);
      formData.append('Service_Location', JSON.stringify(fields['Service_Location']));
      formData.append('Holiday_Remark', fields['Holiday_Remark']);
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('projection-target/HolidaysRelated/AddNewHoliday', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.Is_Refresh = 'Yes';
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



}