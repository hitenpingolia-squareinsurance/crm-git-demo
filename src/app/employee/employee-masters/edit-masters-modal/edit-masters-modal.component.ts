import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-masters-modal',
  templateUrl: './edit-masters-modal.component.html',
  styleUrls: ['./edit-masters-modal.component.css']
})

export class EditMastersModalComponent implements OnInit {

  editForm: FormGroup;
  isSubmitted = false;
  masterType: any;
  urlSegment: any;
  id: any;
  editName: any;
  branchAddress: any;
  verticalData: any = [];

  dropdownSettingsType: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };
  parentId: any = 0;
  selectedVertical: any;
  zoneData: any;
  selectedZone: any;

  constructor(public api : ApiService, private route: Router, private formBuilder: FormBuilder, private http: HttpClient,  private dialogRef: MatDialogRef<EditMastersModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      zone: [''],
      vertical: [''],
      branchAddress: ['']
    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };

  }

  ngOnInit() {
   this.id = this.data.id;
   this.editName = this.data.editName;
   this.masterType = this.data.masterType;
   this.urlSegment = this.data.urlSegment;
   this.editForm.get('name').setValue(this.editName);
   //Profile Conditions
   // if(this.masterType == 'Profile'){
   //  this.getVerticalData();
   //  this.editForm.get('vertical').setValidators([Validators.required]);
   //  this.editForm.get('vertical').updateValueAndValidity();
   // }

   //Branch Conditions
   if(this.masterType == 'Branch'){
    this.branchAddress = this.data.branchAddress;
    this.getZoneData();

    this.editForm.get('zone').setValidators([Validators.required]);
    this.editForm.get('zone').updateValueAndValidity();


    this.editForm.get('branchAddress').setValidators([Validators.required]);
    this.editForm.get('branchAddress').setValue(this.branchAddress);
    this.editForm.get('branchAddress').updateValueAndValidity();
   }

  }

  //FORM CONTROLS
  get formControls() { return this.editForm.controls; }


  //===== SUBMIT CANCELLATION REQUEST =====//
  submitMastersData() {
 
    this.isSubmitted = true;
    if (this.editForm.invalid) {
      return;
    } else {

      var fields = this.editForm.value;
      // if(this.masterType == 'Profile'){
      //   this.parentId = fields['vertical'][0]['Id'];
      // }else
       if(this.masterType == 'Branch'){
        this.parentId = fields['zone'][0]['Id'];
      }

      if(this.masterType == 'Branch'){
        this.branchAddress = fields['branchAddress'];
      }

      const formData = new FormData();
      formData.append('login_id', this.api.GetUserData('Id'));
      formData.append('login_type', this.api.GetUserType());
      formData.append('id', this.id);
      formData.append('masterType', this.masterType);
      formData.append('name', fields['name']);
      formData.append('parentId', this.parentId);
      formData.append('branchAddress', this.branchAddress);
      formData.append('branchAddress', this.branchAddress);

      this.api.IsLoading();
      this.api.HttpPostType('b-crm/EmployeeMasters/editMastersData', formData).then((result:any) => {
      this.api.HideLoading();

        if (result['status'] == 1) {
          this.api.Toast('Success', result['msg']);
          this.dialogRef.close();
          //this.route.navigate(['employee/'+ this.urlSegment]);
        } else {
          const msg = 'msg';
          this.api.Toast('Warning', result['msg']);
        }
      }, (err) => {
        this.api.HideLoading();
        const newLocal = 'Warning';
        this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
      });
    }
  }


  //===== GET VERTICAL DATA =====//
  getVerticalData(){

    this.api.IsLoading();
    this.api.HttpGetType('b-crm/EmployeeMasters/getVerticalData?masterType='+this.masterType+'&actionType=Edit&idUsed='+this.id).then((result:any) => {
    this.api.HideLoading();

      if (result['status'] == 1) {
        this.verticalData = result['Data'];
        this.selectedVertical = result['SelectedVertical'];
      } else {
        const msg = 'msg';
        this.api.Toast('Warning', result['msg']);
      }
    }, (err) => {
      this.api.HideLoading();
      const newLocal = 'Warning';
      this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


   //===== GET BRANCH DATA =====//
   getZoneData(){

    this.api.IsLoading();
    this.api.HttpGetType('b-crm/EmployeeMasters/getZoneData?masterType='+this.masterType+'&actionType=Edit&idUsed='+this.id).then((result:any) => {
    this.api.HideLoading();

      if (result['status'] == 1) {
        this.zoneData = result['Data'];
        this.selectedZone = result['SelectedZone'];
      } else {
        const msg = 'msg';
        this.api.Toast('Warning', result['msg']);
      }
    }, (err) => {
      this.api.HideLoading();
      const newLocal = 'Warning';
      this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
    });

  }


  //===== CLOSE MODAL =====//
  close() {
      this.dialogRef.close();
  }

}
