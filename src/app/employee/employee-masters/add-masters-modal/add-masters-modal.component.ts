import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-masters-modal',
  templateUrl: './add-masters-modal.component.html',
  styleUrls: ['./add-masters-modal.component.css']
})
export class AddMastersModalComponent implements OnInit {

  addForm: FormGroup;
  isSubmitted = false;
  masterType: any;
  urlSegment: any;
  verticalData: any = [];
  dropdownSettingsType: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };
  parentId: any = 0;
  Address: any;
  zoneData: any = [];
  TierData: any;
  Current_Tier: { Id: string; Name: string; }[];
  ActionType: any;
  SingleId: any;

  ro: any;
  zone: any;
  BranchData: any = [];
  selectedBranch: any;
  ROData: any;  
  Current_Tier_Val: any;

  constructor(public api: ApiService, private route: Router, private formBuilder: FormBuilder, private http: HttpClient, private dialogRef: MatDialogRef<AddMastersModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.addForm = this.formBuilder.group({
      Name: ['', Validators.required],
      zone: [''],
      ro: [""],
      branch: [""],
      vertical: [''],
      Address: [''],
      Current_Tier: [""],

    });

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };

    this.Current_Tier = [
      { Id: "Tier 1", Name: "Tier 1" },
      { Id: "Tier 2", Name: "Tier 2" },
      { Id: "Tier 3", Name: "Tier 3" },
    ];

  }

  ngOnInit() {
    this.masterType = this.data.masterType;
    this.urlSegment = this.data.urlSegment;
    this.ActionType = this.data.ActionType;
    this.SingleId = this.data.Id;

    if (this.ActionType == 'Edit') {
      this.GetFetchDetails();
    }

    

    //Branch Conditions
    if (this.masterType == 'Branch') {
      this.getZoneData();

      this.addForm.get('zone').setValidators([Validators.required]);
      this.addForm.get('zone').updateValueAndValidity();

      this.addForm.get('ro').setValidators([Validators.required]);
      this.addForm.get('ro').updateValueAndValidity();

      this.addForm.get('Address').setValidators([Validators.required]);
      this.addForm.get('Address').updateValueAndValidity();

      
      
    }else if (this.masterType == 'Regional-Office') {
      this.addForm.get('zone').setValidators([Validators.required]);
      this.addForm.get('zone').updateValueAndValidity();
      this.getZoneData();
    }else   if (this.masterType == 'Service-Location') {
      this.getZoneData();

      this.addForm.get('zone').setValidators([Validators.required]);
      this.addForm.get('zone').updateValueAndValidity();

      this.addForm.get('ro').setValidators([Validators.required]);
      this.addForm.get('ro').updateValueAndValidity();

      this.addForm.get('Current_Tier').setValidators([Validators.required]);
      this.addForm.get('Current_Tier').updateValueAndValidity();

      
    }

    
    // this.getRoData();


  }

  onItemDeSelect(type: any) {

    if (type === "Zone") {
      this.ro = [];
      this.selectedBranch = [];
      // this.ROData = [];
      // this.BranchData = [];
    }

    if (type === "ro") {
      this.BranchData = [];
    }

    if (type === "Branch") {
      this.getBranchData();
    }

  }

  onZoneChange(type: any) {
    // When selecting a new zone, automatically clear RO data
    if (type === "Zone") {
      this.ro = [];
      this.selectedBranch = [];
      
    }

    if (type === "ro") {
      this.BranchData = [];
    }

    if (type === "Branch") {
      this.getBranchData();
    }
  }

  //FORM CONTROLS
  get formControls() { return this.addForm.controls; }


  //===== SUBMIT CANCELLATION REQUEST =====//
  submitMastersData() {

    // alert('dsd')

    this.isSubmitted = true;
    if (this.addForm.invalid) {
      console.log(this.addForm.controls);
      return;
    } else {

      var fields = this.addForm.value;

      if (this.masterType == 'Branch') {
        this.parentId = fields['zone'][0]['Id'];
        
      }

      if (this.masterType == 'Branch') {
        this.Address = fields['Address'];
      }
      if (this.masterType == 'Regional-Office') {
        this.parentId = fields['zone'][0]['Id'];
      }
      

      const formData = new FormData();
      if (this.masterType == 'Branch') {
        formData.append('ro', fields["ro"][0]["Id"]);
      }
      if (this.masterType == 'Service-Location') {
        this.parentId = fields['zone'][0]['Id'];
        formData.append('ro', fields["ro"][0]["Id"]);
     if(fields["branch"] != ''){
      formData.append('Branch_Id', fields["branch"][0]["Id"]);
     }else{
      formData.append('Branch_Id', '');

     }
       
        formData.append('Current_Tier', fields["Current_Tier"][0]["Name"]);
      }
      formData.append('login_id', this.api.GetUserData('Id'));
      formData.append('login_type', this.api.GetUserType());
      formData.append('masterType', this.masterType);
      formData.append('Name', fields['Name']);
      formData.append('parentId', this.parentId);
      formData.append('Address', this.Address);
      formData.append('Id', this.SingleId);

      // alert(formData);
      

      var url = 'b-crm/EmployeeMasters/AddEmployeeMasters';
      if (this.ActionType == 'Edit') {
        url = "b-crm/EmployeeMasters/AddEmployeeMasters";

      } else {
        url = "b-crm/EmployeeMasters/AddEmployeeMasters";
      }
      this.api.IsLoading();
      this.api.HttpPostType(url, formData).then((result:any) => {
        this.api.HideLoading();

        if (result['status'] == 1) {
          this.api.Toast('Success', result['msg']);
          this.dialogRef.close();
          this.route.navigate(['employee/' + this.urlSegment]);
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

  // getBranchData() {
  //   var fields = this.addForm.value;
  //   const formData = new FormData();
  //   if (this.ro[0]['Id'] != '' && this.zone[0]['Id'] != '') {
  //     formData.append("Zone", this.zone[0]['Id']);
  //     formData.append("Ro", this.ro[0]['Id']);
  //   } else {
  //     formData.append("Zone", fields["zone"][0]["Id"]);
  //     formData.append("Ro", fields["ro"][0]["Id"]);

  //   }

  //   this.api
  //     .HttpPostType("b-crm/EmployeeMasters/getBranchData", formData)
  //     .then((result: any) => {
  //       this.api.HideLoading();
  //       this.BranchData = result["BranchData"];
  //     });
  // }

  getBranchData() {
    var fields = this.addForm.value;
    const formData = new FormData();
    if(this.ro[0]['Id'] != '' && this.zone[0]['Id'] != ''){
      formData.append("Zone", this.zone[0]['Id']);
      formData.append("Ro", this.ro[0]['Id']);  
    }else{
      formData.append("Zone", fields["zone"][0]["Id"]);
      formData.append("Ro", fields["ro"][0]["Id"]);
  
    }

    this.api
      .HttpPostType("b-crm/EmployeeMasters/getBranchData", formData)
      .then((result: any) => {
        this.api.HideLoading();
        this.BranchData = result["BranchData"];
      });
  }

  


  //===== GET VERTICAL DATA =====//
  getVerticalData() {

    this.api.IsLoading();
    this.api.HttpGetType('b-crm/EmployeeMasters/getVerticalData?masterType=' + this.masterType + '&actionType=Add&idUsed=').then((result:any) => {
      this.api.HideLoading();

      if (result['status'] == 1) {
        this.verticalData = result['Data'];
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


  GetFetchDetails() {

    this.api.IsLoading();
    this.api.HttpGetType('b-crm/EmployeeMasters/GetFetchDetails?masterType=' + this.masterType + '&actionType=edit&Id=' + this.SingleId).then((result:any) => {
      this.api.HideLoading();
      // alert(JSON.stringify(result));

      if (result['status'] == 1) {
        const responseData = result['Data'];
        
        if (responseData) {
          this.addForm.patchValue(responseData);
          if(this.ActionType == 'Edit' && (this.masterType == 'Branch' || this.masterType == 'Regional-Office')){
            this.getRoData();
          }else if(this.ActionType == 'Edit' && this.masterType == 'Service-Location'){
            this.getRoData();
            this.getBranchData();
          }
             }

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
  getZoneData() {

    this.api.IsLoading();
    this.api.HttpGetType("b-crm/EmployeeMasters/getZoneData?masterType=" + this.masterType + "&actionType=Add&idUsed=").then((result:any) => {
      this.api.HideLoading();

      if (result['status'] == 1) {
        this.zoneData = result['Data'];
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

  getRoData() {
    
    var fields = this.addForm.value;
    const formData = new FormData();
    if(this.zone[0]['Id'] != ''){
     
      formData.append("zone", this.zone[0]['Id']);
  
    }else{
     
      formData.append("zone", fields["zone"][0]["Id"]);
  
    }

    this.api
      .HttpPostType("b-crm/EmployeeMasters/getRoData", formData)
      .then((result: any) => {
        this.api.HideLoading();
        this.ROData = result["ROData"];
      });
  }


  //===== CLOSE MODAL =====//
  close() {
    this.dialogRef.close();
  }

}
