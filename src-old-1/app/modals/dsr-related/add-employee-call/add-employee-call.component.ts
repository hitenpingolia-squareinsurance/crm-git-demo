import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'app-add-employee-call',
  templateUrl: './add-employee-call.component.html',
  styleUrls: ['./add-employee-call.component.css']
})

export class AddEmployeeCallComponent implements OnInit {

  Id: any;
  row_id: any = '';
  followup_type: any;
  action_user: any;
  Creator_Id: any;
  Circle_Type: any;

  FollowupForm: FormGroup;
  AddProspectCallForm: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;
  mytime: Date = new Date();
  mytime1: Date = new Date();

  action_type: any = '';
  circle_type: any = '';

  employee_ar: any;
  service_location_ar: any = [];

  call_type_ar: any = [];
  dropdownSettingMultipleSelect: {};
  dropdownSettingsingleselect: {};
  dropdownSettingsingleselect1: {};

  constructor(public dialogRef: MatDialogRef<AddEmployeeCallComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public formBuilder: FormBuilder) {

    this.action_type = this.data.int_type;
    this.circle_type = 'Employee Call';

    if (this.action_type == 'Call') {
      this.FollowupForm = this.formBuilder.group({
        employee: ['', [Validators.required]],
        remark: ['']
      });

    } else {
      this.FollowupForm = this.formBuilder.group({
        employee: ['', [Validators.required]],
        service_location: ['', [Validators.required]],
        meeting_date: ['', [Validators.required]],
        start_time: ['', [Validators.required]],
        end_time: ['', [Validators.required]],
        meeting_venue: [''],
        remark: ['']
      });
    }

    this.dropdownSettingMultipleSelect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

  }

  ngOnInit() {

    this.SearchComponentsData();

  }

  get formControls() { return this.FollowupForm.controls; }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {

    const formData = new FormData();

    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('user_id', '');
    formData.append('circle_type', this.circle_type);
    formData.append('action_type', this.action_type);
    formData.append('portal', 'crm');
    formData.append('device_type', 'web');
    formData.append('page_name', 'add-followup');

    this.api.HttpPostTypeBms('dsr/DsrCommon/SearchComponentsData', formData).then((result:any) => {
      if (result['Status'] == true) {

        this.employee_ar = result['data']['agent_ar'];
        this.service_location_ar = result['data']['service_location_ar'];

      }

    }, (err) => {
      // Error log
      this.api.HideLoading();
    });

  }


  //===== SUBMIT FORM =====//
  SubmitFollowupAction() {

    this.isSubmitted = true;
    if (this.FollowupForm.invalid) {
      return;
    } else {

      var emp_id = this.FollowupForm.value['employee'][0]['Id'];
      const formData = new FormData();

      formData.append('User_Code', this.api.GetUserData('Code'));
      formData.append('Action_User', this.action_user);
      formData.append('action_type', this.action_type);
      formData.append('emp_id', JSON.stringify(this.FollowupForm.value['employee']));

      if (this.action_type == 'Meeting') {
        formData.append('service_location', JSON.stringify(this.FollowupForm.value['service_location']));
        formData.append('meeting_date', this.FollowupForm.value['meeting_date']);
        formData.append('start_time', this.FollowupForm.value['start_time']);
        formData.append('end_time', this.FollowupForm.value['end_time']);
        formData.append('meeting_venue', this.FollowupForm.value['meeting_venue']);
      }

      formData.append('remark', this.FollowupForm.value['remark']);
      formData.append('device_type', 'CRM');
      formData.append('Portal', 'CRM');

      this.api.IsLoading();
      this.api.HttpPostTypeBms('dsr/DsrCommon/SubmitEmployeeCallDetails', formData).then((result:any) => {
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


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


}