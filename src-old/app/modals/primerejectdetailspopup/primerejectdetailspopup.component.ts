import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router,ActivatedRoute } from  '@angular/router';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

@Component({
  selector: 'app-primerejectdetailspopup',
  templateUrl: './primerejectdetailspopup.component.html',
  styleUrls: ['./primerejectdetailspopup.component.css']
})
export class PrimerejectdetailspopupComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted  =  false;
  today=new Date();
  Nextes:Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean=false;
  TableId: any;
  Discription: any;

  constructor(public api : ApiService,private http: HttpClient,public dialogRef: MatDialogRef<PrimerejectdetailspopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder) {

      this.UpdateFollowForm = this.fb.group({
        
        Remarks: ['',Validators.required],
       
    });

   }

  ngOnInit() {

    

    this.TableId = this.data.Id;
	  this.Status = this.data.Status;
    if(this.Status=='fixed')
     this.GetRejectedDiscription(this.TableId);
   
   
  
    

  }
  GetRejectedDiscription(Ids:number){

    this.api.IsLoading(); 
	
    this.api.HttpGetType('PrimeAgent/GetRemarks/'+Ids).then((result:any) => {

     this.api.HideLoading();		 
     if(result['Status'] == true ){
       
       
      this.Discription=result['Data'];
      
       
     }
     else{
       
       this.api.Toast('Warning',result['Message']);
     
     }
     
   }, (err) => { 
   
   this.api.HideLoading();
   this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
   
 
     }); 


  }

  get FC() { return this.UpdateFollowForm.controls; }
   
  CloseModel(): void {
   this.dialogRef.close({
     Status: 'Model Close'
   });
 }

 UpdateFollowFormS(){

    this.isSubmitted=true;
    if(this.UpdateFollowForm.invalid){
      return;
    }
    else{

      var fields = this.UpdateFollowForm.value; 
      const formData = new FormData();
        
      formData.append('User_Id',this.api.GetUserData('Id')); 
      formData.append('User_Type',this.api.GetUserType()); 
      formData.append('Ids',this.TableId); 
      formData.append('Status',this.Status);      
      formData.append('remark',fields['Remarks']);
      
      var Confirms=confirm('Are You Sure To Change Status?');
		if(Confirms==true){

			this.api.IsLoading(); 
	
			 this.api.HttpPostType('PrimeAgent/UpdateActionProcessManger/Reject',formData).then((result:any) => {

	 		  this.api.HideLoading();		 
				if(result['Status'] == true ){
					
					
					this.api.Toast('Success',result['Message']);
					this.CloseModel();
					
				}
				else{
					
					this.api.Toast('Warning',result['Message']);
				
				}
				
			}, (err) => { 
			
			this.api.HideLoading();
			this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
			
			}); 
			
		}

    }
 }

}
