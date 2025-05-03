import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-given-target',
  templateUrl: './edit-given-target.component.html',
  styleUrls: ['./edit-given-target.component.css']
})
export class EditGivenTargetComponent implements OnInit {

  EditTargetForm: FormGroup;
  isSubmitted = false;
  Id: any;
  col_name: any = '';
  row: any;
  TargetValue: any;
  MonthName: any;
  ColumnName: any;
  EditType: any;
  IsSales: any;
  is_refresh: any = 'No';

  constructor(public dialogRef: MatDialogRef<EditGivenTargetComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router,
    private formBuilder: FormBuilder) {

    this.EditTargetForm = this.formBuilder.group({
      NewTargetValue: ['']
    });

  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.col_name = this.data.col_name;
  }

  get FC_6() { return this.EditTargetForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.is_refresh
    });
  }


  //===== UPDATE GIVEN TARGET =====//
  UpdateGivenTarget() {

    this.isSubmitted = true;
    if (this.EditTargetForm.invalid) {
      return;

    } else {

      var fields = this.EditTargetForm.value;
      const formData = new FormData();

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('VerticalId', this.Id);
      formData.append('col_name', this.col_name);
      formData.append('NewGivenTarget', fields['NewTargetValue']);
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/PmsMasters/UpdateGivenTarget', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.api.Toast('Success', result['Message']);
          this.is_refresh = result['is_refresh'];
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