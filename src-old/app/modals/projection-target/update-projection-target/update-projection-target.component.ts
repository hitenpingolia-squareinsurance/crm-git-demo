import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-projection-target',
  templateUrl: './update-projection-target.component.html',
  styleUrls: ['./update-projection-target.component.css']
})

export class UpdateProjectionTargetComponent implements OnInit {

  EditTargetForm: FormGroup;
  isSubmitted = false;
  row: any;
  TargetValue: any;
  Is_Refresh: any = 'No';
  Work_Status_Array: any = [];
  dropdownSettingSingleSelect: {};

  constructor(public dialogRef: MatDialogRef<UpdateProjectionTargetComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router,
    private formBuilder: FormBuilder) {

    this.EditTargetForm = this.formBuilder.group({
      Work_Status: ["", [Validators.required]],
      TargetValue: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(5000)]],
    });

    this.dropdownSettingSingleSelect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };

  }

  ngOnInit() {

    this.Work_Status_Array = [{ Id: "Working", Name: "Working" }, { Id: "Leave", Name: "Leave" }];

  }

  get formControls() { return this.EditTargetForm.controls; }


  //===== UPDATE VALIDATION =====//
  UpdateValidation() {

    if (this.EditTargetForm.value['Work_Status'].length > 0 && this.EditTargetForm.value['Work_Status'][0]['Id'] == 'Working') {
      this.EditTargetForm.get('TargetValue').setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(5000)]);
    } else {
      this.EditTargetForm.get('TargetValue').setValidators(null);
    }

    this.EditTargetForm.get('TargetValue').updateValueAndValidity();
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== SUBMIT STEP 6 DATA =====//
  UpdateProjectionTarget() {

    this.isSubmitted = true;
    if (this.EditTargetForm.invalid) {
      return;

    } else {

      var fields = this.EditTargetForm.value;
      const formData = new FormData();

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Work_Status', JSON.stringify(fields['Work_Status']));
      formData.append('TargetValue', fields['TargetValue']);
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('projection-target/ProjectionTarget/UpdateProjectionTarget', formData).then((result:any) => {
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