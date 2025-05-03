import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-ratings',
  templateUrl: './edit-ratings.component.html',
  styleUrls: ['./edit-ratings.component.css']
})

export class EditRatingsComponent implements OnInit {

  KraRatingForm: FormGroup;
  isSubmitted = false;
  edit_type: any;
  emp_id: any;
  financial_year: any = '';
  profile: any = '';
  is_sales: any = '';
  kra_id: any = '';
  sequence: any = 0;
  profile_level: any = '';
  Is_Refresh: any = 'No';
  RatingsArray: any = [];
  SelectedRating: any = [];
  current_rating: any = '';

  dropdownSettingsingleselect1: any = {};

  constructor(public dialogRef: MatDialogRef<EditRatingsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) {

    this.KraRatingForm = this.formBuilder.group({
      new_rating: [''],
      remarks: [''],
    });

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

    this.edit_type = this.data.edit_type;
    this.emp_id = this.data.emp_id;
    this.profile = this.data.profile;
    this.is_sales = this.data.is_sales;
    this.financial_year = this.data.financial_year;
    this.kra_id = this.data.kra_id;
    this.current_rating = this.data.current_rating;
    this.sequence = this.data.sequence;
    this.profile_level = this.data.profile_level;

    this.SearchComponentsData();
    //this.RatingsArray = [{ Id: 1, Name: "1" }, { Id: 2, Name: "2" }, { Id: 3, Name: "3" }, { Id: 4, Name: "4" }, { Id: 5, Name: "5" }];

  }

  get FC_6() { return this.KraRatingForm.controls; }

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
    formData.append('current_rating', this.current_rating);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/Ratings/GetMaxRatingChangeLimit', formData).then((result:any) => {
      this.api.HideLoading();
      if (result['Status'] == true) {
        this.RatingsArray = result['RatingsArray'];
        this.SelectedRating = [{ Id: this.current_rating, Name: this.current_rating }];
      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== SAVE KRA RATING REMARKS DATA =====//
  SaveKraRatingRemarks() {

    this.isSubmitted = true;
    if (this.KraRatingForm.invalid) {
      return;

    } else {

      var fields = this.KraRatingForm.value;
      const formData = new FormData();

      formData.append('user_code', this.api.GetUserData('Code'));
      formData.append('edit_type', this.edit_type);
      formData.append('emp_id', this.emp_id);
      formData.append('financial_year', this.financial_year);
      formData.append('kra_id', this.kra_id);
      formData.append('current_rating', this.current_rating);
      formData.append('new_rating', JSON.stringify(fields['new_rating']));
      formData.append('sequence', this.sequence);
      formData.append('profile_level', this.profile_level);
      formData.append('remarks', fields['remarks']);

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/appraisals/Ratings/SaveKraRatingRemarks', formData).then((result:any) => {
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