import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-kra-list-only',
  templateUrl: './kra-list-only.component.html',
  styleUrls: ['./kra-list-only.component.css']
})
export class KraListOnlyComponent implements OnInit {

  KraRatingForm: FormGroup;
  isSubmitted = false;

  emp_id: any;
  financial_year: any = '';
  profile: any = '';
  is_sales: any = '';
  employee_type: any = '';
  sequence: any = '';
  rm_type: any = '';
  profile_level: any = '';
  profile_id: any = '';
  department: any = '';
  dataAr: any = [];
  comments_data: any = [];
  PromotionTypeAr: any = [];

  OverAllRating: any = 0;
  SubmitRights: any = 'No';
  dropdownSettingsingleselect1: any = {};

  constructor(public dialogRef: MatDialogRef<KraListOnlyComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public formBuilder: FormBuilder, public dialog: MatDialog,) {

    this.emp_id = this.data.emp_id;
    this.profile = this.data.profile;
    this.employee_type = this.data.employee_type;
    this.financial_year = this.data.financial_year;
    this.profile_id = this.data.profile_id;
    this.department = this.data.department;

    this.KraRatingForm = this.formBuilder.group({
      suggestion_comment: [''],
      is_promoted: [''],
      remarks: [''],
    });


    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    };

  }

  ngOnInit() {

    this.PromotionTypeAr = [{ Id: "Yes", Name: "Yes" }, { Id: "No", Name: "No" }];
    this.GetKraList();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET KRA LIST =====//
  GetKraList() {

    const formData = new FormData();
    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('emp_id', this.emp_id);
    formData.append('profile', this.profile);
    formData.append('profile_id', this.profile_id);
    formData.append('department_id', this.department);
    formData.append('is_sales', this.is_sales);
    formData.append('employee_type', this.employee_type);
    formData.append('financial_year', this.financial_year);
    formData.append('rm_type', this.rm_type);
    formData.append('profile_level', this.profile_level);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/KraMasters/GetKraList', formData).then((result:any) => {
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