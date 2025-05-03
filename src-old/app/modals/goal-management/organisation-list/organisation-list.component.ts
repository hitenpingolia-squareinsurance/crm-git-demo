import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { EditSalaryUpdateDateComponent } from '../../../modals/goal-management/edit-salary-update-date/edit-salary-update-date.component';

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.css']
})

export class OrganisationListComponent implements OnInit {

  FollowupForm: FormGroup;
  isSubmitted  = false;

  EmployeeId:any;
  MonthName:any;
  dataAr: any =[];

  constructor( public dialogRef: MatDialogRef<OrganisationListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public api : ApiService, public formBuilder: FormBuilder) {

     this.EmployeeId = this.data.EmployeeId;
  	 this.MonthName = this.data.MonthName;

  }

  ngOnInit(){
    this.GetOrganizationList();
  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET ORGANIZATION LIST =====//
  GetOrganizationList(){

     const formData = new FormData();

     this.api.IsLoading();
 		 this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/GetOrganizationList',formData).then((result:any) => {
     this.api.HideLoading();

 		 if(result['Status'] == true){
 				this.dataAr = result['Data'];

 			}else{
        this.dataAr = result['Data'];
 			}

 		}, (err) => {

    });

  }


  //===== EDIT SALARY UPDATE DATE=====//
  SalaryUpdateDate(OrganizationId:any): void {

		const dialogRef = this.dialog.open(EditSalaryUpdateDateComponent, {
		  width: '27%',
		  height:'62%',
		  disableClose : true,
		  data: {OrganizationId : OrganizationId}
		});

		dialogRef.afterClosed().subscribe(result => {
      if(result.Is_Refresh == 'Yes'){
        this.GetOrganizationList();
      }
		});

  }


}
