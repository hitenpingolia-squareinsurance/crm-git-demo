import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { environment } from '../../../../environments/environment';

import { EditRatingsComponent } from '../../../modals/goal-management/edit-ratings/edit-ratings.component';

@Component({
  selector: 'app-kra-list',
  templateUrl: './kra-list.component.html',
  styleUrls: ['./kra-list.component.css']
})

export class KraListComponent implements OnInit {

  KraRatingForm: FormGroup;
  isSubmitted = false;

  emp_id: any;
  financial_year: any = '';
  profile: any = '';
  profile_id: any = '';
  department: any = '';
  is_sales: any = '';
  employee_type: any = '';
  coreline: any = '';
  sequence: any = '';
  rm_type: any = '';
  current_rm: any = '';
  profile_level: any = '';
  url_segment: any = '';
  dataAr: any = [];
  comments_data: any = [];
  PromotionTypeAr: any = [];

  OverAllRating: any = 0;
  SubmitRights: any = 'No';
  dropdownSettingsingleselect1: any = {};
  DesignationAr: any = [];
  BandAr: any = [];

  constructor(public dialogRef: MatDialogRef<KraListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public formBuilder: FormBuilder, public dialog: MatDialog,) {

    this.emp_id = this.data.emp_id;
    this.profile = this.data.profile;
    this.profile_id = this.data.profile_id;
    this.department = this.data.department;
    this.is_sales = this.data.is_sales;
    this.employee_type = this.data.employee_type;
    this.coreline = this.data.coreline;
    this.financial_year = this.data.financial_year;
    this.rm_type = this.data.rm_type;
    this.current_rm = this.data.current_rm;
    this.profile_level = this.data.profile_level;
    this.url_segment = this.data.url_segment;

    this.KraRatingForm = this.formBuilder.group({
      suggestion_comment: [''],
      is_promoted: [''],
      remarks: [''],
      designation: [''],
      band: [''],
    });

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    };

  }

  ngOnInit() {

    this.PromotionTypeAr = [{ Id: "Yes", Name: "Yes" }, { Id: "No", Name: "No" }];
    this.GetKraList();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET KRA LIST =====//
  GetKraList() {

    const formData = new FormData();

    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('emp_id', this.emp_id);
    formData.append('profile', this.profile);
    formData.append('profile_id', this.profile_id);
    formData.append('department_id', this.department);
    formData.append('is_sales', this.is_sales);
    formData.append('employee_type', this.employee_type);
    formData.append('financial_year', this.financial_year);
    formData.append('rm_type', this.rm_type);
    formData.append('current_rm', this.current_rm);
    formData.append('profile_level', this.profile_level);
    formData.append('url_segment', this.url_segment);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/Ratings/GetKraList', formData).then((result) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.sequence = result['Sequence'];
        if (this.sequence == 4) {
          this.DesignationAr = result['DesignationAr'];
          this.BandAr = result['BandAr'];
        }

        this.dataAr = result['Data'];
        this.comments_data = result['CommentsData'];
        this.SubmitRights = result['SubmitRights'];
        this.GetKraAchivementRating();

      } else {
        this.dataAr = result['Data'];
      }

    }, (err) => {

    });

  }


  //===== GET KRA ACHIEVEMENT RATING IN CHUNKS =====//
  async GetKraAchivementRating() {

    for (let i = 0; i < this.dataAr.length; i++) {

      var kra_id = this.dataAr[i]['Id'];
      var weightage = this.dataAr[i]['Weightage'];
      var calculation_type = this.dataAr[i]['Calculation_Type'];
      var is_edit = this.dataAr[i]['IsEdit'];

      const formData = new FormData();
      formData.append('user_code', this.api.GetUserData('Code'));
      formData.append('emp_id', this.emp_id);
      formData.append('profile', this.profile);
      formData.append('is_sales', this.is_sales);
      formData.append('employee_type', this.employee_type);
      formData.append('coreline', this.coreline);
      formData.append('financial_year', this.financial_year);
      formData.append('kra_id', kra_id);
      formData.append('weightage', weightage);
      formData.append('calculation_type', calculation_type);
      formData.append('rm_type', this.rm_type);
      formData.append('sequence', this.sequence);
      formData.append('profile_level', this.profile_level);
      formData.append('url_segment', this.url_segment);
      formData.append('is_edit', is_edit);

      if (calculation_type == 'Lobwise Target') {
        var url = environment.apiUrlBmsBase + "/goal-management-system/appraisals/Ratings/GetLobwiseKraAchivementRating";

      } else if (calculation_type == 'Team Target') {
        var url = environment.apiUrlBmsBase + "/goal-management-system/appraisals/Ratings/GetTeamKraAchivementRating";

      } else if (calculation_type == 'Pos Franchise') {
        var url = environment.apiUrlBmsBase + "/goal-management-system/appraisals/Ratings/GetPosFranchiseKraAchivementRating";

      } else {
        var url = environment.apiUrlBmsBase + "/goal-management-system/appraisals/Ratings/GetKraAchivementRating";
      }

      await this.http
        .post<any>(this.api.additionParmsEnc(url), this.api.enc_FormData(formData),this.api.getHeader(environment.apiUrlBmsBase))
        .toPromise()
        .then((res:any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          if (calculation_type == 'Lobwise Target') {
            this.dataAr[i]['MotorTarget'] = data.Data.MotorTarget;
            this.dataAr[i]['NonMotorTarget'] = data.Data.NonMotorTarget;
            this.dataAr[i]['HealthTarget'] = data.Data.HealthTarget;
            this.dataAr[i]['LifeTarget'] = data.Data.LifeTarget;

            this.dataAr[i]['MotorBusiness'] = data.Data.MotorBusiness;
            this.dataAr[i]['NonMotorBusiness'] = data.Data.NonMotorBusiness;
            this.dataAr[i]['HealthBusiness'] = data.Data.HealthBusiness;
            this.dataAr[i]['LifeBusiness'] = data.Data.LifeBusiness;

            this.dataAr[i]['MotorAchPercent'] = data.Data.MotorAchPercent;
            this.dataAr[i]['NonMotorAchPercent'] = data.Data.NonMotorAchPercent;
            this.dataAr[i]['HealthAchPercent'] = data.Data.HealthAchPercent;
            this.dataAr[i]['LifeAchPercent'] = data.Data.LifeAchPercent;

          } else if (calculation_type == 'Employee Retention') {
            this.dataAr[i]['TotalTarget'] = data.Data.TotalTarget;
            this.dataAr[i]['NewEmployee'] = data.Data.NewEmployee;
            this.dataAr[i]['ResignEmployee'] = data.Data.ResignEmployee;

          } else if (calculation_type == 'Team Target') {
            this.dataAr[i]['RevenueTotalTarget'] = data.Data.RevenueTotalTarget;
            this.dataAr[i]['RevenueAchTarget'] = data.Data.RevenueAchTarget;
            this.dataAr[i]['RevenueAchPercent'] = data.Data.RevenueAchPercent;

            this.dataAr[i]['BusinessTotalTarget'] = data.Data.BusinessTotalTarget;
            this.dataAr[i]['BusinessAchTarget'] = data.Data.BusinessAchTarget;
            this.dataAr[i]['BusinessAchPercent'] = data.Data.BusinessAchPercent;

            this.dataAr[i]['PosTotalTarget'] = data.Data.PosTotalTarget;
            this.dataAr[i]['PosAchTarget'] = data.Data.PosAchTarget;
            this.dataAr[i]['PosAchPercent'] = data.Data.PosAchPercent;

            this.dataAr[i]['RenewalTotalTarget'] = data.Data.RenewalTotalTarget;
            this.dataAr[i]['RenewalAchTarget'] = data.Data.RenewalAchTarget;
            this.dataAr[i]['RenewalAchPercent'] = data.Data.RenewalAchPercent;

            this.dataAr[i]['PLTotalTarget'] = data.Data.PLTotalTarget;
            this.dataAr[i]['PLAchTarget'] = data.Data.PLAchTarget;
            this.dataAr[i]['PLAchPercent'] = data.Data.PLAchPercent;

          } else if (calculation_type == 'Pos Franchise') {

            this.dataAr[i]['PosTotalTarget'] = data.Data.PosTotalTarget;
            this.dataAr[i]['PosAchievedTarget'] = data.Data.PosAchievedTarget;
            this.dataAr[i]['PosAchievementPercent'] = data.Data.PosAchievementPercent;
            this.dataAr[i]['FranchiseTotalTarget'] = data.Data.FranchiseTotalTarget;
            this.dataAr[i]['FranchiseAchievedTarget'] = data.Data.FranchiseAchievedTarget;
            this.dataAr[i]['FranchiseAchievementPercent'] = data.Data.FranchiseAchievementPercent;

          } else {
            this.dataAr[i]['TotalTarget'] = data.Data.TotalTarget;
            this.dataAr[i]['AchievedTarget'] = data.Data.AchievedTarget;
            this.dataAr[i]['AchievementPercent'] = data.Data.AchievementPercent;

          }

          this.dataAr[i]['Rating'] = data.Data.Rating;
          this.dataAr[i]['FinalRating'] = data.Data.FinalRating;
          this.dataAr[i]['Remarks'] = data.Data.Remarks;
          this.dataAr[i]['Status'] = data.Data.Status;

          //this.dataAr[i]['IsEdit'] = data.Data.IsEdit;

        });

    }

    if (this.dataAr.length > 0) {
      this.CalculateFinalRating();
    }

  }


  //===== CALCULATE FINAL RATING =====//
  CalculateFinalRating() {

    this.OverAllRating = 0;
    const key = 'FinalRating';
    for (let i = 0; i < this.dataAr.length; i++) {
      this.OverAllRating += this.dataAr[i][key];
    }
    this.OverAllRating = Number(this.OverAllRating.toFixed(2));

  }


  //===== SUBMIT KRA RATING REMARKS DATA =====//
  SubmitKraRatingRemarks() {

    const formData = new FormData();

    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('emp_id', this.emp_id);
    formData.append('financial_year', this.financial_year);
    formData.append('sequence', this.sequence);
    formData.append('profile_level', this.profile_level);
    formData.append('rm_type', this.rm_type);
    formData.append('suggestion_comment', this.KraRatingForm.value['suggestion_comment']);

    if (this.rm_type == 'Self') {
      formData.append('is_promoted', '');
      formData.append('remarks', '');

    } else {
      formData.append('is_promoted', JSON.stringify(this.KraRatingForm.value['is_promoted']));
      formData.append('remarks', this.KraRatingForm.value['remarks']);
    }

    if (this.sequence == 4 && (this.KraRatingForm.value['is_promoted'].length > 0 && this.KraRatingForm.value['is_promoted'][0]['Id'] == 'Yes')) {
      formData.append('designation', JSON.stringify(this.KraRatingForm.value['designation']));
      formData.append('band', JSON.stringify(this.KraRatingForm.value['band']));
    } else {
      formData.append('designation', '');
      formData.append('band', '');
    }

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/appraisals/Ratings/SubmitKraRatingRemarks', formData).then((result) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
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


  //===== GET SINGLE KRA DETAILS =====//
  GetSingleKraData(i: any) {

    var kra_id = this.dataAr[i]['Id'];
    var weightage = this.dataAr[i]['Weightage'];
    var calculation_type = this.dataAr[i]['Calculation_Type'];
    var is_edit = this.dataAr[i]['IsEdit'];

    const formData = new FormData();
    formData.append('user_code', this.api.GetUserData('Code'));
    formData.append('emp_id', this.emp_id);
    formData.append('profile', this.profile);
    formData.append('is_sales', this.is_sales);
    formData.append('employee_type', this.employee_type);
    formData.append('financial_year', this.financial_year);
    formData.append('kra_id', kra_id);
    formData.append('weightage', weightage);
    formData.append('calculation_type', calculation_type);
    formData.append('rm_type', this.rm_type);
    formData.append('sequence', this.sequence);
    formData.append('profile_level', this.profile_level);
    formData.append('is_edit', is_edit);

    if (calculation_type == 'Lobwise Target') {
      var url = "goal-management-system/appraisals/Ratings/GetLobwiseKraAchivementRating";

    } else if (calculation_type == 'Pos Franchise') {
      var url = "goal-management-system/appraisals/Ratings/GetPosFranchiseKraAchivementRating";

    } else {
      var url = "goal-management-system/appraisals/Ratings/GetKraAchivementRating";
    }


    this.api.IsLoading();
    this.api.HttpPostTypeBms(url, formData).then((result) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        if (calculation_type == 'Lobwise Target') {

          this.dataAr[i]['MotorTarget'] = result['Data'].MotorTarget;
          this.dataAr[i]['NonMotorTarget'] = result['Data'].NonMotorTarget;
          this.dataAr[i]['HealthTarget'] = result['Data'].HealthTarget;

          this.dataAr[i]['MotorBusiness'] = result['Data'].MotorBusiness;
          this.dataAr[i]['NonMotorBusiness'] = result['Data'].NonMotorBusiness;
          this.dataAr[i]['HealthBusiness'] = result['Data'].HealthBusiness;

          this.dataAr[i]['MotorAchPercent'] = result['Data'].MotorAchPercent;
          this.dataAr[i]['NonMotorAchPercent'] = result['Data'].NonMotorAchPercent;
          this.dataAr[i]['HealthAchPercent'] = result['Data'].HealthAchPercent;

        } else if (calculation_type == 'Pos Franchise') {

          this.dataAr[i]['PosTotalTarget'] = result['Data'].PosTotalTarget;
          this.dataAr[i]['PosAchievedTarget'] = result['Data'].PosAchievedTarget;
          this.dataAr[i]['PosAchievementPercent'] = result['Data'].PosAchievementPercent;
          this.dataAr[i]['FranchiseTotalTarget'] = result['Data'].FranchiseTotalTarget;
          this.dataAr[i]['FranchiseAchievedTarget'] = result['Data'].FranchiseAchievedTarget;
          this.dataAr[i]['FranchiseAchievementPercent'] = result['Data'].FranchiseAchievementPercent;

        } else {
          this.dataAr[i]['TotalTarget'] = result['Data'].TotalTarget;
          this.dataAr[i]['AchievedTarget'] = result['Data'].AchievedTarget;
          this.dataAr[i]['AchievementPercent'] = result['Data'].AchievementPercent;
        }

        this.dataAr[i]['Rating'] = result['Data'].Rating;
        this.dataAr[i]['FinalRating'] = result['Data'].FinalRating;
        this.dataAr[i]['Remarks'] = result['Data'].Remarks;
        this.dataAr[i]['Status'] = result['Data'].Status;

        this.dataAr[i]['IsEdit'] = result['Data'].IsEdit;

        this.CalculateFinalRating();

      }

    }, (err) => {
      this.GetKraAchivementRating();
    });

  }


  //===== EDIT KRA RATING =====//
  EditKraRating(index: any, kra_id: any, current_rating: any): void {

    const dialogRef = this.dialog.open(EditRatingsComponent, {
      width: '24%',
      height: '50%',
      disableClose: true,
      data: { edit_type: 'Rating', emp_id: this.emp_id, profile: this.profile, is_sales: this.is_sales, financial_year: this.financial_year, kra_id: kra_id, current_rating: current_rating, profile_level: this.profile_level, sequence: this.sequence }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.Is_Refresh == 'Yes') {
        this.GetSingleKraData(index);
      }

    });

  }


  //===== EDIT KRA RATING =====//
  EditSelfRemarks(index: any, kra_id: any, current_rating: any): void {

    const dialogRef = this.dialog.open(EditRatingsComponent, {
      width: '24%',
      height: '50%',
      disableClose: true,
      data: { edit_type: 'Remarks', emp_id: this.emp_id, profile: this.profile, is_sales: this.is_sales, financial_year: this.financial_year, kra_id: kra_id, current_rating: current_rating, profile_level: this.profile_level, sequence: this.sequence }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.Is_Refresh == 'Yes') {
        this.GetSingleKraData(index);
      }

    });

  }


}