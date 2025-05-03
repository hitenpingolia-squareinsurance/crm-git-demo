import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router,ActivatedRoute } from  '@angular/router';

@Component({
  selector: 'app-popupexamconfirm', 
  templateUrl: './popupexamconfirm.component.html',
  styleUrls: ['./popupexamconfirm.component.css']
})
export class PopupexamconfirmComponent implements OnInit {
  Loginspection: any;
  TotalQuestion: any;
  TotalAttemptQuestion: any;
  TotalUnAttemptQuestion: any;
  Intervals: any;

  constructor(public api : ApiService,private http: HttpClient,public dialogRef: MatDialogRef<PopupexamconfirmComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private router: Router) { }

  ngOnInit(): void {

    this.Get();

    this.Intervals=this.data.Intervals;
   
  }

  Get(){

    const User_id = this.data.User_id;
    const Training_Type = this.data.Training_Type;


    
      this.api.IsLoading();
     this.api.HttpGetType('Exam/ConfimrPopuAttenptQuestions?User_Id='+User_id+'&Training_Type='+Training_Type).then((result:any) => {
     this.api.HideLoading();
       if(result['status'] == true ){

        this.TotalQuestion=result['data']['TotalQuestion'];
        this.TotalAttemptQuestion=result['data']['TotalAttemptQuestion'];
        this.TotalUnAttemptQuestion=result['data']['TotalUnAttemptQuestion'];
       
       }else{

         this.api.Toast('Warning',result['msg']);
         this.CloseModel();

       }
     }, (err) => {
      
       this.api.HideLoading();
       this.api.Toast('Warning','Network Error : ' + err.name + '('+err.statusText+')' );
     
       });
   }

   ExamToRedirect(){

    const Training_Type = this.data.Training_Type;

    this.CloseModel();
    clearInterval(this.Intervals);
    this.router.navigate(['Agent/ExamResult/'+btoa(Training_Type)]);

   }
    
CloseModel(): void {
this.dialogRef.close({
  Status: 'Model Close'
});
}

}
