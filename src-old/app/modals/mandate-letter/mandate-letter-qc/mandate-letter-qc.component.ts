import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-mandate-letter-qc',
  templateUrl: './mandate-letter-qc.component.html',
  styleUrls: ['./mandate-letter-qc.component.css']
})
export class MandateLetterQcComponent implements OnInit {

  modalForm: FormGroup;
  isSubmitted = false;

  buttonDisable = false;
  MandateDetails:any = '';

  constructor(public api : ApiService, private route: Router, private formBuilder: FormBuilder, private http: HttpClient,  private dialogRef: MatDialogRef<MandateLetterQcComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modalForm = this.formBuilder.group({
      remarks: ['']
    });

  }

  ngOnInit() {
     this.GetMandateLetter();
  }

  //FORM CONTROLS
  get formControls() { return this.modalForm.controls; }


  //===== GET REJECTION DETAILS =====//
  GetMandateLetter(){

    const formData = new FormData();
    formData.append('SrId', this.data.Id);

    this.api.HttpPostTypeBms('reports/MandateLetterReport/GetMandateLetter',formData).then((result:any) => {
     if(result['Status'] == true){
       this.MandateDetails = result['Document'];

     }else{
      this.api.Toast('Warning', result['Message']);
     }

     }, (err) => {
      this.api.Toast('Error', 'Network Error, Please try again ! '+ err.message);
     });

  }


  //===== UPDATE MANDATE LETTER QC STATUS =====//
  UpdateMandateQcStatus(Status:any) {

    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      var fields = this.modalForm.value;
      const formData = new FormData();
      formData.append('Portal', 'BMS');
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('SrId', this.data.Id);
      formData.append('SrNo', this.data.SR_No);
      formData.append('Status', Status);
      formData.append('Remarks', fields['remarks']);

      this.api.IsLoading();
      this.api.HttpPostTypeBms('reports/MandateLetterReport/UpdateMandateQcStatus', formData).then((result:any) => {
      this.api.HideLoading();

        if (result['Status'] == true) {
          this.buttonDisable = false;

          this.api.Toast('Success', result['Message']);
          this.dialogRef.close();
        } else {
          this.buttonDisable = false;

          const msg = 'msg';
          this.api.Toast('Warning', result['Message']);
        }
      }, (err) => {
        this.buttonDisable = false;

        this.api.HideLoading();
        this.api.Toast('Error', 'Network Error : ' + err.name + '(' + err.statusText + ')');
      });
    }

  }


  ViewDocument(url:any){
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }


  //===== CLOSE MODAL =====//
  CloseModel() {
      this.dialogRef.close();
  }


}