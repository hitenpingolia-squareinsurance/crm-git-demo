import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from  '@angular/forms';
import { Router,ActivatedRoute } from  '@angular/router';
import { trim } from 'jquery';
import { ApiService } from '../../providers/api.service';
import { SocketioService } from '../../providers/socketio.service';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css']
})
export class ExamResultComponent implements OnInit {
  Training_Type: string;
  Results: any;
  ExamMarks: any;
  CertificateLink: any;
  Brochure: any;
  PayoutSheet: any;
  Img: string;
  ShowText: any='';

  constructor(
    public api : ApiService,
    public socketService : SocketioService,
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private formBuilder: FormBuilder,
     
)
{


 }

  ngOnInit() {

    this.Training_Type = atob(this.activatedRoute.snapshot.paramMap.get('Type'));
    if(this.Training_Type=='Motor' || this.Training_Type=='Life'){

        this.ResultWiseShow();
    }
    else{

       this.router.navigate(['Logoutweb']);

    }

  }

  ResultWiseShow(){

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();
	  
	  this.api.IsLoading();
		this.api.HttpGetType('Exam/exam_result?User_Id='+Ids+'&Training_Type='+this.Training_Type).then((result:any) => {
		this.api.HideLoading();

     
			if(result['status'] ==true){ 
        
       
         this.Results=result['data']['Results'];
         if(this.Results=='pass')
           this.Img='section-bg-2';
         else if(this.Results=='fail')
           this.Img='section-bg-1';


         this.ExamMarks=result['data']['Percent'];
         this.CertificateLink=result['data']['Certificate'];
         this.Brochure=result['data']['Brochure'];
         this.PayoutSheet=result['data']['PayoutSheet'];
         this.ShowText=result['data']['ShowText'];
       
			} 
      else{ 
				
				this.api.Toast('Warning',result['msg']);

        setTimeout(() => {
 
          this.router.navigate([result['data']['Return']]);
          
          }, 1000); 

			}
			  
		}, (err) => { 
		 
		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
		  
	    }); 
  }

  StartAgain(){

    var Ids=this.api.GetUserData('Id');
    var Roles=this.api.GetUserType();
	  
	  this.api.IsLoading();
		this.api.HttpGetType('Exam/start_again?User_Id='+Ids+'&Training_Type='+this.Training_Type).then((result:any) => {
		this.api.HideLoading();

     
			if(result['status'] ==true){
        
        
        this.router.navigate(['Agent/ExamStart/'+btoa(this.Training_Type)]);
      
       
			} 
      else{ 
				
				this.api.Toast('Warning',result['msg']);

        setTimeout(() => {
 
          this.router.navigate([result['data']['Return']]);
          
          }, 1000); 

			}
			  
		}, (err) => { 
		 
		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
		  
	    }); 
  }

  downloadMyFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.CertificateLink);
    link.setAttribute('download', 'products.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
}
  downloadBrochure(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.Brochure);
    link.setAttribute('download', 'products.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
}
  downloadPayoutsheet(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.PayoutSheet);
    link.setAttribute('download', 'products.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
}


}
