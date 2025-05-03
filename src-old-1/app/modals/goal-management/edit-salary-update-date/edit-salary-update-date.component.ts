import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-edit-salary-update-date',
  templateUrl: './edit-salary-update-date.component.html',
  styleUrls: ['./edit-salary-update-date.component.css']
})

export class EditSalaryUpdateDateComponent implements OnInit {

  SalaryUpdateDateForm: FormGroup;
  isSubmitted  = false;
  EmployeeId: any;
  row: any;
  DatesData: any = [];
  Is_Refresh: any = 'No';
  mytime: Date = new Date();
  OrganizationId:any = '';

  SelectedStartDate: any = [];
  SelectedEndDate: any = [];

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor( public dialogRef: MatDialogRef<EditSalaryUpdateDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder ) {

  this.SalaryUpdateDateForm  =  this.formBuilder.group({
    Start_Date: [''],
    End_Date: [''],
    EndTime : ['']
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

  this.OrganizationId = this.data.OrganizationId;
  this.GetLastSalaryUpdateDate();

  this.DatesData = [{ Id: "01", Name: "01" }, { Id: "02", Name: "02" }, { Id: "03", Name: "03" },  { Id: "04", Name: "04" },  { Id: "05", Name: "05" },  { Id: "06", Name: "06" },  { Id: "07", Name: "07" },  { Id: "08", Name: "08" },  { Id: "09", Name: "09" },  { Id: "10", Name: "10" },  { Id: "11", Name: "11" },  { Id: "12", Name: "12" },  { Id: "13", Name: "13" },  { Id: "14", Name: "14" },  { Id: "15", Name: "15" },  { Id: "16", Name: "16" },  { Id: "17", Name: "17" },  { Id: "18", Name: "18" },  { Id: "19", Name: "19" },  { Id: "20", Name: "20" },  { Id: "21", Name: "21" },  { Id: "22", Name: "22" },  { Id: "23", Name: "23" },  { Id: "24", Name: "24" },  { Id: "25", Name: "25" },  { Id: "26", Name: "26" },  { Id: "27", Name: "27" },  { Id: "28", Name: "28" },  { Id: "29", Name: "29" },  { Id: "30", Name: "30" },  { Id: "31", Name: "31" }, ];
}

get FC_6() { return this.SalaryUpdateDateForm.controls; }

//===== CLOSE MODEL =====//
CloseModel(): void {
  this.dialogRef.close({
    Status: 'Model Close',
    Is_Refresh: this.Is_Refresh
  });
}


//===== ENABLE DISABLE FIELDS =====//
GetLastSalaryUpdateDate(){

  const formData = new FormData();
  formData.append('OrganizationId',this.OrganizationId);

  this.api.IsLoading();
  this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/GetLastSalaryUpdateDate',formData).then((result:any) => {
  this.api.HideLoading();

    if(result['Status'] == true){
     this.SelectedStartDate = result['StartDate'];
     this.SelectedEndDate = result['EndDate'];
     //this.mytime = result['EndTime'];

    }else{
      this.api.Toast('Error',result['Message']);
    }

  }, (err) => {
    this.api.HideLoading();
    this.api.Toast('Warning','Network Error, Please try again ! ');
  });

}


//===== SUBMIT STEP 6 DATA =====//
SubmitSalaryUpdateDate(){

  this.isSubmitted = true;
  if (this.SalaryUpdateDateForm.invalid) {
    return;

  }else {

    var fields = this.SalaryUpdateDateForm.value;
    const formData = new FormData();

    formData.append('User_Id',this.api.GetUserData('Id'));
    formData.append('User_Code',this.api.GetUserData('Code'));
    formData.append('OrganizationId',this.OrganizationId);
    formData.append('StartDate',JSON.stringify(fields['Start_Date']));
    formData.append('EndDate',JSON.stringify(fields['End_Date']));
    formData.append('EndTime',this.SalaryUpdateDateForm.value['EndTime']);
    formData.append('Portal','CRM');

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/CrudFunctions/EditSalaryUpdateDate',formData).then((result:any) => {
    this.api.HideLoading();

      if(result['Status'] == true){
        this.api.Toast('Success',result['Message']);
        this.Is_Refresh = 'Yes';
        this.CloseModel();
      }else{
        this.api.Toast('Error',result['Message']);
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning','Network Error, Please try again ! ');
    });

  }
}


}