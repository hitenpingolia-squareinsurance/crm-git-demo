 



import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-track-form',
  templateUrl: './log-track-form.component.html',
  styleUrls: ['./log-track-form.component.css']
})
export class LogTrackFormComponent implements OnInit {

  UpdateFollowForm: any;
  isSubmitted = false;
  buttonDisable = false;

  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  Status2: any;

  constructor(public api: ApiService, private http: HttpClient, public dialogRef: MatDialogRef<LogTrackFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {

    this.UpdateFollowForm = this.fb.group({
      Remarks: ['', Validators.required],

    });

  }

  ngOnInit() {

  

    this.SrTableId = this.data.Id;
    this.Status = this.data.Status;
 
    const Datess = this.UpdateFollowForm.get('Dates');
    const Timess = this.UpdateFollowForm.get('Times');

    if (this.Status == 'Missed' || this.Status == 'Lost') {

      Datess.disable();
      Timess.disable();
      this.DateTimesShow = false;
    }
    else {

      Datess.enable();
      Timess.enable();
      this.DateTimesShow = true;
    }


  }

  get FC() { return this.UpdateFollowForm.controls; }

  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }

  UpdateFollowFormS() {

    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    }
    else {
      this.buttonDisable = true;

      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append('User_Id', this.api.GetUserData('Id'));
      formData.append('User_Type', this.api.GetUserType());
      formData.append('SrTableId', this.SrTableId);
      formData.append('Status', this.Status);
      formData.append('dates', fields['Dates']);
      formData.append('times', fields['Times']);
      formData.append('remark', fields['Remarks']);
      formData.append('Status2', this.Status2);

      var Confirms = confirm('Are You Sure To Change Status?');
      if (Confirms == true) {

        this.api.IsLoading();

        this.api.HttpPostType('Myaccount/ChangeStatus', formData).then((result:any) => {

          this.api.HideLoading();
          if (result['status'] == true) {

            this.buttonDisable = false;

            this.api.Toast('Success', result['msg']);
            this.CloseModel();

          }
          else {
            this.buttonDisable = false;

            this.api.Toast('Warning', result['msg']);

          }

        }, (err) => {
          this.buttonDisable = false;

          this.api.HideLoading();
          this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');

        });

      }

    }
  }

}
