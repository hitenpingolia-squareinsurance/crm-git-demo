import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router,ActivatedRoute } from  '@angular/router';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

@Component({
  selector: 'app-renewalnewgadi',
  templateUrl: './renewalnewgadi.component.html',
  styleUrls: ['./renewalnewgadi.component.css']
})
export class RenewalnewgadiComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted  =  false;
  today=new Date();
  Nextes:Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean=false;
  TableId: any;
  Discription: any;
  errorss: boolean;

  constructor(public api : ApiService,private http: HttpClient,public dialogRef: MatDialogRef<RenewalnewgadiComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder) {

    this.UpdateFollowForm = this.fb.group({
        
      RegNo: ['',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$"), Validators.minLength(9)]],
     
    });

   }

  ngOnInit() {

    this.UpdateFollowForm.get("RegNo").setValue(this.data.RegNoss);
    
  }
 
  
  get FC() { return this.UpdateFollowForm.controls; }
   
  CloseModel(types,RegNos): void {
   this.dialogRef.close({
     
     RegNo:RegNos,
     HitTypes:types
   });
 }

  UpdateFollowFormS(){

    this.isSubmitted=true;
    if(this.UpdateFollowForm.invalid){
      return;
    }
    var fields = this.UpdateFollowForm.value; 
    this.CloseModel(1,fields['RegNo']);
  
    
  }


 

}
