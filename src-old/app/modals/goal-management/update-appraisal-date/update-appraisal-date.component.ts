import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-appraisal-date',
  templateUrl: './update-appraisal-date.component.html',
  styleUrls: ['./update-appraisal-date.component.css']
})

export class UpdateAppraisalDateComponent implements OnInit {

  UpdateDateForm: FormGroup;
  isSubmitted = false;
  EmployeeId: any;
  row: any;
  DatesData: any = [];
  Is_Refresh: any = 'No';
  mytime: Date = new Date();
  row_id: any = '';
  fy: any = '';

  SelectedStartDate: any = [];
  SelectedEndDate: any = [];

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor(public dialogRef: MatDialogRef<UpdateAppraisalDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) {

    this.UpdateDateForm = this.formBuilder.group({
      Start_Date: [''],
      End_Date: ['']
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true
    };

  }

  ngOnInit() {

    this.row_id = this.data.row_id;
    this.fy = this.data.fy;
    this.GetLastAppraisalUpdateDate();

  }

  get FC_6() { return this.UpdateDateForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== GET ROW RELATED DATAT =====//
  GetLastAppraisalUpdateDate() {

    const formData = new FormData();
    formData.append('row_id', this.row_id);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/AppraisalMasters/GetLastAppraisalUpdateDate', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.UpdateDateForm.get('Start_Date').setValue(result['Data']['Start_Date']);
        this.UpdateDateForm.get('End_Date').setValue(result['Data']['End_Date']);

      } else {
        this.api.Toast('Error', result['Message']);
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Network Error, Please try again ! ');
    });

  }


  //===== SUBMIT STEP 6 DATA =====//
  SubmitAppraisalUpdateDate() {

    this.isSubmitted = true;
    if (this.UpdateDateForm.invalid) {
      return;

    } else {

      var fields = this.UpdateDateForm.value;
      const formData = new FormData();

      formData.append('user_code', this.api.GetUserData('Code'));
      formData.append('row_id', this.row_id);
      formData.append('fy', this.fy);
      formData.append('start_date', this.UpdateDateForm.value['Start_Date']);
      formData.append('end_date', this.UpdateDateForm.value['End_Date']);

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/appraisals/AppraisalMasters/SubmitAppraisalUpdateDate', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.api.Toast('Success', result['Message']);
          this.Is_Refresh = 'Yes';
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