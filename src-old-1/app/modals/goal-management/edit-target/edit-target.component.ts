import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-target',
  templateUrl: './edit-target.component.html',
  styleUrls: ['./edit-target.component.css']
})

export class EditTargetComponent implements OnInit {

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
  Coreline: any = 'Motor';
  AllocatedData: any;
  Is_Refresh: any = 'No';
  CorelineTarget: any = '';
  TotalTarget: any = '';
  UpdateFunctionName: any;

  constructor(public dialogRef: MatDialogRef<EditTargetComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router,
    private formBuilder: FormBuilder) {

    this.EditTargetForm = this.formBuilder.group({
      NewTargetValue: ['']
    });

  }

  ngOnInit() {
    this.EmployeeId = this.data.EmployeeId
    this.TargetValue = this.data.TargetValue;
    this.MonthName = this.data.MonthName;
    this.ColumnName = this.data.ColumnName;
    this.EditType = this.data.EditType;
    this.IsSales = this.data.IsSales;
    this.ProfileType = this.data.ProfileType;
    this.Coreline = this.data.Coreline;
    this.AllocatedData = this.data.AllocatedData;
    this.CorelineTarget = this.data.CorelineTarget;
    this.TotalTarget = this.data.TotalTarget;

    if (this.ColumnName == 'Health_Group_Target' || this.ColumnName == 'Life_Group_Target') {

      this.UpdateFunctionName = 'UpdateAllocatedGroupTarget';

    } else {

      if (this.Coreline == 'Motor') {
        this.UpdateFunctionName = 'UpdateAllocatedTargetMotor';
      } else {
        this.UpdateFunctionName = 'UpdateAllocatedTargetOther';
      }

    }

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
  SubmitFollowupAction() {

    this.isSubmitted = true;
    if (this.EditTargetForm.invalid) {
      return;

    } else {

      var fields = this.EditTargetForm.value;
      const formData = new FormData();

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('EmployeeId', this.EmployeeId);
      formData.append('MonthName', this.MonthName);
      formData.append('ColumnName', this.ColumnName);
      formData.append('PreviousTarget', this.TargetValue);
      formData.append('EditType', this.EditType);
      formData.append('ProfileType', this.ProfileType);
      formData.append('IsSales', this.IsSales);
      formData.append('Coreline', this.Coreline);
      formData.append('AllocatedData', JSON.stringify(this.AllocatedData));
      formData.append('TargetValue', fields['NewTargetValue']);
      formData.append('CorelineTargetData', JSON.stringify(this.CorelineTarget));
      formData.append('TotalTargetData', JSON.stringify(this.TotalTarget));
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/' + this.UpdateFunctionName, formData).then((result:any) => {
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