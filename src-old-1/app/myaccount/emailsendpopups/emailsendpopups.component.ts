import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router,ActivatedRoute } from  '@angular/router';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

@Component({
  selector: 'app-emailsendpopups',
  templateUrl: './emailsendpopups.component.html',
  styleUrls: ['./emailsendpopups.component.css']
})
export class EmailsendpopupsComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted  =  false;
  today=new Date();
  Nextes:Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean=false;
  UserType: any;
  UserEmail: any;
  Days: any;
  UserRoleType: string;
  showhideval: any;
  Agent_Mobile: any;
  Agent_Email: any;
  Customer_Mobile: any;
  Customer_Email: any;
  mobile_div_active: boolean=true;
  email_div_active: boolean=false;
  activeTab: string="Email";
  activeEmailNestedTab: string="Customer";
  activeWhatspNestedTab: string="Customer";
  Lob: any;
  mobile_tab: boolean;
  RenewalType:any;

  constructor(public api : ApiService,private http: HttpClient,public dialogRef: MatDialogRef<EmailsendpopupsComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder) {

      this.RenewalType = this.data.RenewalType;
      this.UpdateFollowForm = this.fb.group({
        ToEmail: [''],
        CCEmail: [''],
        ToEmailCommaSeprated: [''],
        ToMobile: ['']


    });

   }

  ngOnInit() {

    this.Nextes = new Date();
    this.Nextes.setDate( this.Nextes.getDate() + 365 );

    this.SrTableId = this.data.Id;
    this.Days = this.data.Days;
     
    this.UserRoleType = this.api.GetUserType();
    
   

     this.Agent_Mobile=this.data.Agent_Mobile.replace(null,"");
     this.Agent_Email=this.data.Agent_Email.replace(null,"");
     this.Customer_Mobile=this.data.Customer_Mobile.replace(null,"");
     this.Customer_Email=this.data.Customer_Email.replace(null,"");
     this.Lob=this.data.Lob;

     if(this.Lob=='Motor'){

        this.mobile_tab=true;
     }
     else{

        this.mobile_tab=false;
     }



     this.mobile_div_active=true;
     this.email_div_active=true;
     this.activeTab="Email";
     this.activeEmailNestedTab="Customer";
     this.activeWhatspNestedTab="Customer";

     this.UpdateFollowForm.get("ToEmail").setValue(this.Customer_Email);
     this.UpdateFollowForm.get("ToMobile").setValue(this.Customer_Mobile);

     

    //this.getEmailFromSrMaster();

  }
  onTabClick(event) {
   
    this.activeTab=event.tab.textLabel;

  }

  showvalue(val:any){
      this.showhideval=val;

  }
  setNestedTabs(val:any,types){

    if(types=='Email'){

      this.activeEmailNestedTab=val;
      if(this.activeEmailNestedTab=='Customer')
         this.UpdateFollowForm.get("ToEmail").setValue(this.Customer_Email);
      else if(this.activeEmailNestedTab=='Partner')
         this.UpdateFollowForm.get("ToEmail").setValue(this.Agent_Email);


    }
    else if(types=='Whatsapp'){

      this.activeWhatspNestedTab=val;
      if(this.activeWhatspNestedTab=='Customer')
        this.UpdateFollowForm.get("ToMobile").setValue(this.Customer_Mobile);
      else if(this.activeWhatspNestedTab=='Partner')
        this.UpdateFollowForm.get("ToMobile").setValue(this.Agent_Mobile);

    }

  }
  
  Sendmails(ids,expierydates,types){

    alert("Sendmails");
  
     const formData = new FormData();
     formData.append('User_Id',this.api.GetUserData('Id'));
     formData.append('User_Type',this.api.GetUserType());
     formData.append('SrTableId',ids);
     formData.append('MailType',types);

     formData.append('ToEmail','');
     formData.append('CCEmail','');
     formData.append('ToEmailCommaSeprated','');
     formData.append('UserType','');
     formData.append('Days',expierydates);

     
     this.api.IsLoading();

      this.api.HttpPostType('WebPolicyMailRenewalReminder/SendManualMail',formData).then((result:any) => {
       
        this.api.HideLoading();

       if(result['Status'] == true ){

           this.api.Toast('Success',result['Message']);
           
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

    

    if(this.activeTab=='Email'){

      const ToEmail = this.UpdateFollowForm.get("ToEmail");
      const ToMobile = this.UpdateFollowForm.get("ToMobile");

      ToEmail.setValidators([

        Validators.required
        
      ]);
      ToEmail.updateValueAndValidity();
      ToMobile.setValidators([]);
      ToMobile.updateValueAndValidity();
      
    }
    else if(this.activeTab=='Whatsapp'){

      const ToMobile = this.UpdateFollowForm.get("ToMobile");
      const ToEmail = this.UpdateFollowForm.get("ToEmail");

      ToMobile.setValidators([

        Validators.required
        
      ]);
      ToEmail.setValidators([]);
      ToEmail.updateValueAndValidity();
      ToMobile.updateValueAndValidity();
    }
    
    this.isSubmitted=true;
    if(this.UpdateFollowForm.invalid){
      return;
    }
    else{


     
      var fields = this.UpdateFollowForm.value;
      const formData = new FormData();

      formData.append('User_Id',this.api.GetUserData('Id'));
      formData.append('User_Type',this.api.GetUserType());
      formData.append('SrTableId',this.SrTableId);

      formData.append('ToMobile',fields['ToMobile']);
      formData.append('ToEmail',fields['ToEmail']);
      formData.append('CCEmail',fields['CCEmail']);
      formData.append('ToEmailCommaSeprated',fields['ToEmailCommaSeprated']);
      formData.append('UserType',this.UserType);
      formData.append('Days',this.data.Days);
      formData.append('MailType',this.activeTab);
      formData.append("RenewalType",this.RenewalType);


      if(this.activeTab=='Email')
       formData.append('MailTypeUser',this.activeEmailNestedTab);
      else if(this.activeTab=='Whatsapp')
        formData.append('MailTypeUser',this.activeWhatspNestedTab);




			this.api.IsLoading();

			 this.api.HttpPostType('WebPolicyMailRenewalReminder/SendManualMail',formData).then((result:any) => {
        
        
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

 getEmailFromSrMaster(){

      this.api.IsLoading();

      this.api.HttpGetType('WebPolicyMailRenewalReminder/CheckSingleSr?User_Id='+this.api.GetUserData('Id')+'&User_Type='+this.api.GetUserType()+'&SrTableId='+this.data.Id).then((result:any) => {
      this.api.HideLoading();
        if(result['status'] == true ){

           this.UserType=result['data']['Type'];
           this.UserEmail=result['data']['Email'];
           this.UpdateFollowForm.get('ToEmail').setValue(this.UserEmail);

        }
        else{

          this.api.Toast('Warning',result['msg']);
        }

      }, (err) => {

        this.api.HideLoading();
        this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );

      });
 }

}
