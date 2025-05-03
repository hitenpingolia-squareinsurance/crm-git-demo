import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'app-ratings-update-logs',
  templateUrl: './ratings-update-logs.component.html',
  styleUrls: ['./ratings-update-logs.component.css']
})

export class RatingsUpdateLogsComponent implements OnInit {

  SearchForm: FormGroup;
  isSubmitted = false;
  Emps_Ar: Array<any>;
  Selected_Emp_Ar: Array<any>;

  emp_id: any;
  financial_year: any = '';
  is_sales: any = '';
  sequence: any = 0;
  profile_level: any = '';
  url_segment: any = '';

  dataAr: any = [];
  dropdownSettingSingleSelect: any = {};

  constructor(public dialogRef: MatDialogRef<RatingsUpdateLogsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public formBuilder: FormBuilder) {

    this.emp_id = this.data.emp_id;
    this.is_sales = this.data.is_sales;
    this.financial_year = this.data.financial_year;
    this.profile_level = this.data.profile_level;
    this.url_segment = this.data.url_segment;

    this.SearchForm = this.formBuilder.group({
      Emp_Id: [''],
    });

    this.dropdownSettingSingleSelect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

  }

  ngOnInit() {

    this.GetEmployees();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {

    this.Emps_Ar = [];
    this.SearchForm.get('Emp_Id').setValue('');

    const formData = new FormData();
    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('emp_id', this.emp_id);
    formData.append('financial_year', this.financial_year);
    formData.append('url_segment', this.url_segment);
    formData.append('sequence', this.sequence);

    this.api.HttpPostTypeBms('goal-management-system/appraisals/Ratings/GetUpdatedByRm', formData).then((result:any) => {
      if (result['Status'] == true) {
        this.Emps_Ar = result['Data'];
        this.Selected_Emp_Ar = result['Selected_Emp'];
        this.sequence = result['Sequence'];
        this.GetRatingsUpdateTrack();

      } else {
        this.SearchForm.get('Emp_Id').setValue('');
        this.Emps_Ar = [];

      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


  //===== GET EMPLOYEE RATINGS UPDATE LOG =====//
  GetRatingsUpdateTrack() {

    var emp_id;
    if (this.SearchForm.get("Emp_Id").value != undefined && this.SearchForm.get("Emp_Id").value.length > 0) {
      emp_id = JSON.stringify(this.SearchForm.value['Emp_Id']);
    } else {
      emp_id = JSON.stringify(this.Selected_Emp_Ar);
    }

    const formData = new FormData();
    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('emp_id', this.emp_id);
    formData.append('is_sales', this.is_sales);
    formData.append('financial_year', this.financial_year);
    formData.append('sequence', this.sequence);
    formData.append('profile_level', this.profile_level);
    formData.append('url_segment', this.url_segment);
    formData.append('updated_by', emp_id);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/Ratings/GetRatingsUpdateTrack', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.dataAr = result['Data'];

      } else {
        this.dataAr = result['Data'];
      }

    }, (err) => {

    });

  }


}