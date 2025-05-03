import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../providers/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-related',
  templateUrl: './form-related.component.html',
  styleUrls: ['./form-related.component.css']
})

export class FormRelatedComponent implements OnInit {

  reasonForm: FormGroup;
  isSubmitted = false;
  fieldName: any;
  nameUpdateReason: string = "";
  ncbUpdateReason: string = "";
  nameUpdateRe: any;
  ncbUpdateRe: any;

  constructor(public api : ApiService, private route: Router, private formBuilder: FormBuilder, private http: HttpClient,  private dialogRef: MatDialogRef<FormRelatedComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.fieldName = this.data.fieldName;
    this.nameUpdateRe = this.data.nameUpdateRe;
    if(this.nameUpdateRe == 'Name Correction (spelling error, Typo mistake).'){
     this.nameUpdateReason = "Name Correction (spelling error, Typo mistake).";
    }else if(this.nameUpdateRe == 'Transfer of Ownership from Individual to Individual.'){
      this.nameUpdateReason = "Transfer of Ownership from Individual to Individual.";
    }else if(this.nameUpdateRe == 'Transfer of Ownership from Individual to Company.'){
      this.nameUpdateReason = "Transfer of Ownership from Individual to Company.";
    }

    this.ncbUpdateRe = this.data.ncbUpdateRe;
    if(this.ncbUpdateRe == 'Transfer of NCB benefit (from one policy to another).'){
      this.nameUpdateReason = "Transfer of NCB benefit (from one policy to another).";
    }else if(this.ncbUpdateRe == 'Incorrect NCB declared at the time of Policy Issuance.'){
       this.nameUpdateReason = "Incorrect NCB declared at the time of Policy Issuance.";
    }

  }

  //===== CLOSE MODAL =====//
  CloseModel () {
    this.dialogRef.close();
  }


  setValue(value: any){
    if(this.fieldName == 'firstName'){
      this.nameUpdateReason = value;
    }

    if(this.fieldName == 'ncb'){
      this.ncbUpdateReason = value;
    }

    this.dialogRef.close({
      nameUpdateReason: this.nameUpdateReason,
      ncbUpdateReason: this.ncbUpdateReason
    });
  }


}
