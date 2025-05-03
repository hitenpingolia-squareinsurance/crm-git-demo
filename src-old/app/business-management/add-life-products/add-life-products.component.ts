import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-life-products',
  templateUrl: './add-life-products.component.html',
  styleUrls: ['./add-life-products.component.css']
})

export class AddLifeProductsComponent implements OnInit {

  ProductForm: FormGroup;
  isSubmitted = false;
  row: any = [];
  row_id: any;
  financial_year: any = '';
  department_ar: any = [];
  sel_department_ar: any = [];
  profile_ar: any = [];
  sel_profile_ar: any = [];
  employee_ar: any = [];
  kra_array: any = [];

  ActionType: any = 'Add';
  HeaderTitle = 'Add Product';
  Is_Refresh: any = 'No';

  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};
  insurer_ar: any = '';
  policy_type_ar: any = '';
  plan_type_ar: any = '';

  constructor(public dialogRef: MatDialogRef<AddLifeProductsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) {

    this.ProductForm = this.formBuilder.group({
      insurer_id: ['', [Validators.required]],
      policy_type: ['', [Validators.required]],
      plan_type: ['', [Validators.required]],
      plan_name: ['', [Validators.required]],
      year_1_gst: ['', [Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")]],
      year_2_gst: ['', [Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")]],
      effective_date: ['', [Validators.required]]
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false,
      closeDropDownOnSelection: true
    };

  }

  ngOnInit() {

    this.row_id = this.data.row_id;
    this.financial_year = this.data.financial_year;
    this.SearchComponentsData();
    if (this.row_id != '0') {

      this.ActionType = 'Edit';
      this.HeaderTitle = 'Add GST';

      this.ProductForm.get("insurer_id").setValidators([Validators.required]);
      this.ProductForm.get("policy_type").setValidators([Validators.required]);
      this.ProductForm.get("plan_type").setValidators([Validators.required]);
      this.ProductForm.get("plan_name").setValidators([Validators.required]);

      this.ProductForm.get("plan_name").updateValueAndValidity();
      this.ProductForm.get("plan_type").updateValueAndValidity();
      this.ProductForm.get("policy_type").updateValueAndValidity();
      this.ProductForm.get("insurer_id").updateValueAndValidity();

    }

  }

  get formControls() { return this.ProductForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {

    const formData = new FormData();
    formData.append('Portal', 'CRM');
    formData.append('PageName', 'kra-master');
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.IsLoading();
    this.api.HttpPostTypeBms('../v2/sr/life/LifeProductsMaster/SearchComponentsData', formData).then((result) => {
      this.api.HideLoading();
      if (result['Status'] == true) {

        this.insurer_ar = result['insurer_ar'];
        this.policy_type_ar = result['policy_type_ar'];
        this.plan_type_ar = result['plan_type_ar'];

      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== GET KRA DETAILS =====//
  GetDetails() {

    const formData = new FormData();
    formData.append('row_id', this.row_id);
    formData.append('financial_year', this.financial_year);

    this.api.HttpPostTypeBms('goal-management-system/appraisals/AppraisalMasters/GetSingleKraDetails', formData).then((result) => {

      if (result['Status'] == true) {
        this.row = result['data'];
        this.sel_department_ar = result['sel_department_ar'];
        this.sel_profile_ar = result['sel_profile_ar'];
        this.ProductForm.patchValue(this.row);

      } else {
        this.api.Toast('Warning', result['Message']);
      }

    }, (err) => {
      this.api.Toast('Warning', err.message);
    });
  }


  //===== ADD EDIT KRA =====//
  AddEditProduct() {

    this.isSubmitted = true;
    if (this.ProductForm.invalid) {
      return;

    } else {

      var fields = this.ProductForm.value;
      const formData = new FormData();

      formData.append('user_code', this.api.GetUserData('Code'));
      formData.append('row_id', this.row_id);
      formData.append('insurer_id', JSON.stringify(fields['insurer_id']));
      formData.append('policy_type', JSON.stringify(fields['policy_type']));
      formData.append('plan_type', JSON.stringify(fields['plan_type']));
      formData.append('plan_name', fields['plan_name']);
      formData.append('year_1_gst', fields['year_1_gst']);
      formData.append('year_2_gst', fields['year_2_gst']);
      formData.append('effective_date', fields['effective_date']);

      this.api.IsLoading();
      this.api.HttpPostTypeBms('../v2/sr/life/LifeProductsMaster/AddEditProduct', formData).then((result) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.Is_Refresh = 'Yes';
          this.api.Toast('Success', result['Message']);
          this.CloseModel();
        } else {
          this.api.Toast('Error', result['Message']);
        }

      }, (err) => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Network Error, Please try again ! ');
      });
    }

  }


}