import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'app-ratings-criteria-master',
  templateUrl: './ratings-criteria-master.component.html',
  styleUrls: ['./ratings-criteria-master.component.css']
})

export class RatingsCriteriaMasterComponent implements OnInit {

  dataAr: any = [];

  constructor(public dialogRef: MatDialogRef<RatingsCriteriaMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public api: ApiService, public formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.GetRatingCriteriaMaster();
  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET FINAL RATINGS CRITERIA MASTER =====//
  GetRatingCriteriaMaster() {

    const formData = new FormData();

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/AppraisalMasters/GetRatingCriteriaMaster', formData).then((result:any) => {
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