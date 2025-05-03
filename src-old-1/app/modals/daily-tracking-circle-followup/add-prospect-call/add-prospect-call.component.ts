import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'app-add-prospect-call',
  templateUrl: './add-prospect-call.component.html',
  styleUrls: ['./add-prospect-call.component.css']
})

export class AddProspectCallComponent implements OnInit {

  AddProspectCallForm: FormGroup;
  isSubmitted  = false;

  constructor( public dialogRef: MatDialogRef<AddProspectCallComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, public formBuilder: FormBuilder) {

  	this.AddProspectCallForm  =  this.formBuilder.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]],
      Mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]],
      Occupation: ['', [Validators.required]],
      Prospect_Type: ['', [Validators.required]],
      Call_Type: ['', [Validators.required]],
      Remark: ['']
  	 });

    }

  ngOnInit(){

  }


  get formControls() { return this.AddProspectCallForm.controls; }

  //===== CLOSE MODAL =====//
  CloseModel(): void {
     this.dialogRef.close({
        Status: 'Model Close'
     });
  }


  //===== SUBMIT FORM =====//
  SubmitFollowupAction(){

    this.isSubmitted = true;
  	if(this.AddProspectCallForm.invalid){
  	  return;
  	}else{

      var CurrentCircleType = '';
      CurrentCircleType = 'Prospect Call';

  		const formData = new FormData();

      formData.append('User_Code',this.api.GetUserData('Code'));
      formData.append('Action_User_Type','RM');
      formData.append('CircleType',CurrentCircleType);
    	formData.append('Name',this.AddProspectCallForm.value['Name']);
      formData.append('Email',this.AddProspectCallForm.value['Email']);
      formData.append('Mobile',this.AddProspectCallForm.value['Mobile']);
      formData.append('Occupation',this.AddProspectCallForm.value['Occupation']);
      formData.append('Prospect_Type',this.AddProspectCallForm.value['Prospect_Type']);
  	  formData.append('Call_Type',this.AddProspectCallForm.value['Call_Type']);
      formData.append('Device_Type','CRM');
      formData.append('Portal','CRM');

      this.api.IsLoading();

      this.api.HttpPostTypeBms('daily-tracking-circle/ProspectCalls/AddProspectCalls',formData).then((result:any) => {
        this.api.HideLoading();

          if(result['Status'] == true){
            this.CloseModel();
            this.api.Toast('Success',result['Message']);

          }else{
            this.api.Toast('Warning',result['Message']);
          }

        }, (err) => {
            this.api.HideLoading();
            this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
         });

  		}
  }



 }
