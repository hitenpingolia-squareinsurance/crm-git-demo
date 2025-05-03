import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-member-pa',
  templateUrl: './delete-member-pa.component.html',
  styleUrls: ['./delete-member-pa.component.css']
})

export class DeleteMemberPaComponent implements OnInit {

  ActionForm: FormGroup;
  isSubmitted = false;
  Row_Id: any;
  SR_Id: any;
  row: any;
  User_Rights: any = [];
  ExcelFile: File;
  selectedFiles: File;
  Other_image: any = 0;

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor(public dialogRef: MatDialogRef<DeleteMemberPaComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router, private formBuilder: FormBuilder) {

    this.ActionForm = this.formBuilder.group({
      Extra_Premium: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

  }

  ngOnInit() {
    this.Row_Id = this.data.Row_Ids;
    this.SR_Id = this.data.SR_Id;
  }


  get FC_1() { return this.ActionForm.controls; }


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== ADD NEW EMPLOYEE DATA =====//
  DeleteEmployee() {

    this.isSubmitted = true;
    if (this.ActionForm.invalid) {
      return;

    } else {

      var fields = this.ActionForm.value;

      const formData = new FormData();

      formData.append('Row_Id', this.Row_Id);
      formData.append('SR_Id', this.SR_Id);
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Extra_Premium', fields['Extra_Premium']);

      this.api.IsLoading();
      this.api.HttpForSR('post', 'PAGroup/DeleteEmployee', formData).then((result:any) => {
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


}