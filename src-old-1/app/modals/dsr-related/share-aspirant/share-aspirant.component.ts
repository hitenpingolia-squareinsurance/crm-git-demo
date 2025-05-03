import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'app-share-aspirant',
  templateUrl: './share-aspirant.component.html',
  styleUrls: ['./share-aspirant.component.css']
})
export class ShareAspirantComponent implements OnInit {

  Id: any;

  AddForm: FormGroup;
  isSubmitted = false;
  dropdownSettings: any = {};
  CircleAr: any = [];

  constructor(public dialogRef: MatDialogRef<ShareAspirantComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public formBuilder: FormBuilder) {

    this.AddForm = this.formBuilder.group({
      Category: [''],
      Remark: [''],
    });

    this.Id = this.data.Id;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };


  }

  ngOnInit() {
    this.GetAgentCircle(this.Id);
  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== SUBMIT FORM =====//
  SubmitForm() {

    if (this.AddForm.invalid) {
      return;
    } else {

      const formData = new FormData();

      formData.append('Device_Type', 'CRM');
      formData.append('Portal', 'CRM');
      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Id', this.Id);
      formData.append('Category', JSON.stringify(this.AddForm.value['Category']));
      formData.append('Remark', this.AddForm.value['Remark']);

      this.api.IsLoading();
      this.api.HttpPostTypeBms('dsr/DsrCommon/ShareAspirant', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.CloseModel();

          this.api.Toast('Success', result['Message']);
        } else {
          this.api.Toast('Warning', result['Message']);
        }

      }, (err) => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
      });

    }

  }


  //===== GET AGENT CIRCLE LIST =====//
  GetAgentCircle(Agent_Id: any) {

    const formData = new FormData();
    formData.append('Agent_Id', this.Id);
    formData.append('Portal', 'CRM');

    this.api.IsLoading();
    this.api.HttpPostTypeBms('dsr/DsrCommon/GetAgentCircleArray', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.CircleAr = result['Data'];
      } else {
        this.CircleAr = [];
      }

    });

  }


}
