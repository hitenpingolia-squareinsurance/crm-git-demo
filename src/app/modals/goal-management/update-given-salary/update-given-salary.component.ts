import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-given-salary',
  templateUrl: './update-given-salary.component.html',
  styleUrls: ['./update-given-salary.component.css']
})

export class UpdateGivenSalaryComponent implements OnInit {

  EditTargetForm: FormGroup;
  isSubmitted = false;
  EmployeeId: any;
  row: any;
  TargetValue: any;
  MonthName: any;
  ColumnName: any;
  EditType: any;
  IsSales: any;
  ProfileType: any;
  AllocatedData: any;
  Is_Refresh: any = 'No';
  financial_year: any = '';

  constructor(public dialogRef: MatDialogRef<UpdateGivenSalaryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router,
    private formBuilder: FormBuilder) {

    this.EditTargetForm = this.formBuilder.group({
      NewTargetValue: ['']
    });

  }

  ngOnInit() {
    this.EmployeeId = this.data.EmployeeId
    this.MonthName = this.data.MonthName;
    this.financial_year = this.data.financial_year;
  }

  get FC_6() { return this.EditTargetForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== SUBMIT STEP 6 DATA =====//
  UpdateFinalSalary() {

    this.isSubmitted = true;
    if (this.EditTargetForm.invalid) {
      return;

    } else {

      var fields = this.EditTargetForm.value;
      const formData = new FormData();

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('EmployeeId', this.EmployeeId);
      formData.append('financial_year', this.financial_year);
      formData.append('MonthName', this.MonthName);
      formData.append('TargetValue', fields['NewTargetValue']);
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/UpdateFinalSalary', formData).then((result:any) => {
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