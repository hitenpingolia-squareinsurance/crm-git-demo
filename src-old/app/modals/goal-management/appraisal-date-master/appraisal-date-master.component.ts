import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { UpdateAppraisalDateComponent } from '../../../modals/goal-management/update-appraisal-date/update-appraisal-date.component';

@Component({
  selector: 'app-appraisal-date-master',
  templateUrl: './appraisal-date-master.component.html',
  styleUrls: ['./appraisal-date-master.component.css']
})
export class AppraisalDateMasterComponent implements OnInit {

  FollowupForm: FormGroup;
  isSubmitted = false;

  EmployeeId: any;
  MonthName: any;
  dataAr: any = [];

  constructor(public dialogRef: MatDialogRef<AppraisalDateMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public api: ApiService, public formBuilder: FormBuilder) {

    this.EmployeeId = this.data.EmployeeId;
    this.MonthName = this.data.MonthName;

  }

  ngOnInit() {
    this.GetAppraisalDateList();
  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET ORGANIZATION LIST =====//
  GetAppraisalDateList() {

    const formData = new FormData();

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/AppraisalMasters/GetApppraisalDateMaster', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.dataAr = result['Data'];

      } else {
        this.dataAr = result['Data'];
      }

    }, (err) => {

    });

  }


  //===== EDIT SALARY UPDATE DATE=====//
  UpdateAppraisalDate(row_id: any, fy: any): void {

    const dialogRef = this.dialog.open(UpdateAppraisalDateComponent, {
      width: '27%',
      height: '52%',
      disableClose: true,
      data: { row_id: row_id, fy: fy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.Is_Refresh == 'Yes') {
        this.GetAppraisalDateList();
      }
    });

  }


}
