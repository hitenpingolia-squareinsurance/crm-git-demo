import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'app-salary-remarks-track',
  templateUrl: './salary-remarks-track.component.html',
  styleUrls: ['./salary-remarks-track.component.css']
})

export class SalaryRemarksTrackComponent implements OnInit {

  FollowupForm: FormGroup;
  isSubmitted = false;

  EmployeeId: any;
  MonthName: any;
  financial_year: any = '';
  dataAr: any = [];

  constructor(public dialogRef: MatDialogRef<SalaryRemarksTrackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public formBuilder: FormBuilder) {

    this.EmployeeId = this.data.EmployeeId;
    this.MonthName = this.data.MonthName;
    this.financial_year = this.data.financial_year;

  }

  ngOnInit() {

    this.GetSalaryRemarksTrack();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== SUBMIT FORM =====//
  GetSalaryRemarksTrack() {

    const formData = new FormData();
    formData.append('Employee_Id', this.EmployeeId);
    formData.append('MonthName', this.MonthName);
    formData.append('financial_year', this.financial_year);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/GetSalaryRemarksTrack', formData).then((result:any) => {
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