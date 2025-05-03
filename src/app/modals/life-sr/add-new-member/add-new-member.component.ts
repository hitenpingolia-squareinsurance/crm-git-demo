import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder,  FormGroup, FormArray, Validators } from  '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-add-new-member',
  templateUrl: './add-new-member.component.html',
  styleUrls: ['./add-new-member.component.css']
})

export class AddNewMemberComponent implements OnInit {

  ActionForm: FormGroup;
  isSubmitted  = false;
  SR_Id: any;
  row: any;
  User_Rights: any = [];
  GenderArray: any = [];

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor( public dialogRef: MatDialogRef<AddNewMemberComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, private router: Router, private formBuilder: FormBuilder ) {

    this.ActionForm  =  this.formBuilder.group({
      REID: ['', [Validators.required]],
			Employee_Code: ['', [Validators.required]],
      Employee_Name : ['', [Validators.required]],
      DOB : ['', [Validators.required]],
      DOJ : ['', [Validators.required]],
      Gender : ['', [Validators.required]],
      Age : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      Designation : ['', [Validators.required]],
      Sum_Assured : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      CTC : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      Extra_Premium : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    };

  }

  ngOnInit() {

    this.SR_Id = this.data.SR_Id;
    this.GenderArray = [{ Id: "Male", Name: "Male" }, { Id: "Female", Name: "Female" }];

  }


  get FC_1() { return this.ActionForm.controls; }


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== ADD NEW EMPLOYEE DATA =====//
  AddNewEmployee(){

    this.isSubmitted = true;
    if(this.ActionForm.invalid){
      return;

    }else{

		var fields = this.ActionForm.value;

		const formData = new FormData();

		formData.append('SR_Id',this.SR_Id);
		formData.append('User_Code',this.api.GetUserData('Code'));

    formData.append('REID',fields['REID']);
    formData.append('Employee_Code',fields['Employee_Code']);
    formData.append('Employee_Name',fields['Employee_Name']);
    formData.append('DOB',fields['DOB']);
    formData.append('DOJ',fields['DOJ']);

		formData.append('Gender',JSON.stringify(fields['Gender']));
    formData.append('Age',fields['Age']);
		formData.append('Designation',fields['Designation']);

		formData.append('Sum_Assured',fields['Sum_Assured']);
    formData.append('CTC',fields['CTC']);
    formData.append('Extra_Premium',fields['Extra_Premium']);

		this.api.IsLoading();
		this.api.HttpForSR('post','LifeGroup/AddNewEmployee',formData).then((result:any) => {
		this.api.HideLoading();

			if(result['Status'] == true){
				this.api.Toast('Success',result['Message']);
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