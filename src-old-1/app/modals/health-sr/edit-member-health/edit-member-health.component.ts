import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder,  FormGroup, FormArray, Validators } from  '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-edit-member-health',
  templateUrl: './edit-member-health.component.html',
  styleUrls: ['./edit-member-health.component.css']
})

export class EditMemberHealthComponent implements OnInit {

  ActionForm: FormGroup;
  isSubmitted  = false;
  SR_Id: any = 0;
  Row_Id: any = 0;
  row: any;
  EmployeeData: any = [];
  User_Rights: any = [];
  GenderArray: any = [];
  PreNeedToArray: any = [];
  butDisabled: any = false;
  NetPremium : any = 0;

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };
  SelGender: any;
  SelVaccinationStatus: any;
  SelIsCovidInfected: any;
  SelCurrentCovidStatus: any;

  constructor( public dialogRef: MatDialogRef<EditMemberHealthComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, private router: Router, private formBuilder: FormBuilder ) {

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
      PremiumNeedTo : ['', [Validators.required]],
      Previous_Premium : [''],
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
    this.Row_Id = this.data.Row_Id;
    this.NetPremium = this.data.NetPremium;
    this.ActionForm.get('Previous_Premium').setValue(this.NetPremium);

    this.GenderArray = [{ Id: "Male", Name: "Male" }, { Id: "Female", Name: "Female" }];
    this.PreNeedToArray = [{ Id: "Add", Name: "Add" }, { Id: "Remove", Name: "Remove" }, { Id: "NA", Name: "NA" }];

    this.GetDetails();

  }


  get FC_1() { return this.ActionForm.controls; }


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== ENABLE/DISABLE VALIDATOR =====//
  EnableDisableValidation(e:any){

    this.butDisabled = false;
    if(e == 'enable'){
      this.ActionForm.get('Extra_Premium').setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
      this.ActionForm.get('Extra_Premium').updateValueAndValidity();

    }else{

        if(e.Id == 'NA'){
          this.butDisabled = true;
          this.ActionForm.get('Extra_Premium').setValidators(null);
          this.ActionForm.get('Extra_Premium').updateValueAndValidity();
        }else{
          this.ActionForm.get('Extra_Premium').setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
          this.ActionForm.get('Extra_Premium').updateValueAndValidity();
        }

    }

  }


  //===== GET MEMBER DETAILS=====//
  GetDetails(){

    const formData = new FormData();
    formData.append('Row_Id', this.Row_Id);
    formData.append('SR_Id', this.SR_Id);

    	this.api.HttpForSR('post','HealthGroup/GetDetails',formData).then((result:any) => {

      if(result['status'] == true ){
        this.EmployeeData = result['data'];

        this.ActionForm.get('REID').setValue(result['data']['REID']);
        this.ActionForm.get('Employee_Code').setValue(result['data']['Employee_Code']);
        this.ActionForm.get('Employee_Name').setValue(result['data']['Name']);
        this.ActionForm.get('DOB').setValue(result['data']['DOB']);
        this.ActionForm.get('DOJ').setValue(result['data']['DOJ']);
        this.ActionForm.get('Age').setValue(result['data']['Age']);

        this.ActionForm.get('Designation').setValue(result['data']['Designation']);
        this.ActionForm.get('Sum_Assured').setValue(result['data']['Sum_Assured']);
        this.ActionForm.get('CTC').setValue(result['data']['CTC']);
        this.SelGender = result['Gender'];

      }else{
        this.api.Toast('Warning',result['msg']);
        }
      },(err) => {
        this.api.HideLoading();
        this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
    });

  }


  //===== EDIT EMPLOYEE DATA =====//
  EditEmployee(){

    this.isSubmitted = true;
    if(this.ActionForm.invalid){
      return;

    }else{

		var fields = this.ActionForm.value;

		const formData = new FormData();

		formData.append('Row_Id',this.Row_Id);
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
    formData.append('PremiumNeedTo',JSON.stringify(fields['PremiumNeedTo']));
    formData.append('Extra_Premium',fields['Extra_Premium']);
    formData.append('Remarks',fields['Remarks']);

		this.api.IsLoading();
		this.api.HttpForSR('post','HealthGroup/EditEmployeeDetails',formData).then((result:any) => {
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