import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-renewal-date',
  templateUrl: './update-renewal-date.component.html',
  styleUrls: ['./update-renewal-date.component.css']
})

export class UpdateRenewalDateComponent implements OnInit {

  UpdateDateForm: FormGroup;
  isSubmitted = false;

  row: any;
  DatesData: any = [];
  Is_Refresh: any = 'No';
  mytime: Date = new Date();

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };
  row_id: any = '';
  renewal_year: any = '';
  sequence: any = '';
  renewal_date: any = '';
  payment_frequency: any = '';
  track_id: any = '';

  constructor(public dialogRef: MatDialogRef<UpdateRenewalDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) {

    this.UpdateDateForm = this.formBuilder.group({
      New_Date: [''],
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
    this.track_id = this.data.track_id;
    this.renewal_year = this.data.renewal_year;
    this.sequence = this.data.sequence;
    this.renewal_date = this.data.renewal_date;
    this.payment_frequency = this.data.payment_frequency;

    this.UpdateDateForm.get('New_Date').setValue(this.renewal_date);

  }

  get FC_6() { return this.UpdateDateForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== SUBMIT NEW RENEWAL DATE DATA =====//
  SubmitNewRenewalDate() {

    this.isSubmitted = true;
    if (this.UpdateDateForm.invalid) {
      return;

    } else {

      var fields = this.UpdateDateForm.value;
      const formData = new FormData();

      formData.append('user_code', this.api.GetUserData('Code'));
      formData.append('row_id', this.row_id);
      formData.append('track_id', this.track_id);
      formData.append('renewal_year', this.renewal_year);
      formData.append('sequence', this.sequence);
      formData.append('payment_frequency', this.payment_frequency);
      formData.append('new_date', this.UpdateDateForm.value['New_Date']);

      this.api.IsLoading();
      this.api.HttpForSR('post', 'Renewal/UpdateNewRenewalDate', formData).then((result:any) => {
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