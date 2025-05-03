import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-life-renewal-premium',
  templateUrl: './edit-life-renewal-premium.component.html',
  styleUrls: ['./edit-life-renewal-premium.component.css']
})
export class EditLifeRenewalPremiumComponent implements OnInit {

  ActionForm: FormGroup;
  isSubmitted = false;
  Id: any;
  Track_Id: any;
  Lob_Name: any;
  row: any;
  User_Rights: any = [];
  FrequencyArray: any = [];
  StepData: any = [];
  renewal_year: any = 1;
  Riders_Ar: any = [];
  Is_Gst_Applicable: any = [];
  LI_Product_Type: any = [];
  LI_Product_Id: any = [];

  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor(public dialogRef: MatDialogRef<EditLifeRenewalPremiumComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private router: Router, private formBuilder: FormBuilder) {

    this.ActionForm = this.formBuilder.group({
      LI_Net_Premium: ['', [Validators.pattern("^[0-9]*\.?[0-9]*$")]],
      LI_Gross_Premium: ['', [Validators.pattern("^[0-9]*\.?[0-9]*$")]],

      LI_Term_Net_Premium: ['', [Validators.pattern("^[0-9]*\.?[0-9]*$")]],
      LI_Term_Gross_Premium: ['', [Validators.pattern("^[0-9]*\.?[0-9]*$")]],

      LI_Riders_Premium: this.formBuilder.array([]),
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

  }

  ngOnInit() {

    this.Id = this.data.row_id;
    this.renewal_year = this.data.renewal_year;
    this.GetSR();

  }

  get FC_6() { return this.ActionForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET SR DETAILS =====//
  GetSR() {

    const formData = new FormData();

    formData.append('Id', this.Id);
    formData.append('Lob_Name', 'LI');
    formData.append('User_Id', this.api.GetUserData('Id'));
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.IsLoading();
    this.api.HttpForSR('post', 'Renewal/GetSrDetailsArray', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.User_Rights = result['SR_User_Rights'];
        this.StepData = result['Data'];
        this.Riders_Ar = result['Riders_Ar'];
        this.Is_Gst_Applicable = result['Is_Gst_Applicable'];
        this.LI_Product_Type = result['LI_Product_Type'];
        this.LI_Product_Id = result['LI_Product_Id'];

        for (var a = 0; a < this.Riders_Ar.length; a++) {
          this.AddRider();
        }

        for (var i = 0; i < this.Riders_Ar.length; i++) {

          const PayInGroupFields = (<FormArray>this.ActionForm.get("LI_Riders_Premium")).at(i);

          PayInGroupFields.patchValue({
            RiderId: this.Riders_Ar[i]['Id'],
            RiderName: this.Riders_Ar[i]['Name']
          });
        }

      } else {
        this.api.Toast('Warning', result['Message']);
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', err.message);
    });

  }


  LI_Riders_PremiumFN(): FormArray {
    return this.ActionForm.get("LI_Riders_Premium") as FormArray
  }


  AddRider() {
    this.LI_Riders_PremiumFN().push(this.New_LI_Riders_Premium());
  }


  New_LI_Riders_Premium(): FormGroup {
    return this.formBuilder.group({
      RiderId: '',
      RiderName: '',
      RiderNetPremium: '',
      RiderGrossPremium: '',
      RiderSumAssured: '',
    })
  }


  //===== SUBMIT STEP 6 DATA =====//
  EditPremium() {
    var fields = this.ActionForm.value;

    const formData = new FormData();

    formData.append('SR_Id', this.Id);
    formData.append('LOB_Id', 'LI');
    formData.append('User_Id', this.api.GetUserData('Id'));
    formData.append('User_Code', this.api.GetUserData('Code'));

    formData.append('LI_Plan_Type', JSON.stringify(this.LI_Product_Type));
    formData.append('LI_Product_Id', JSON.stringify(this.LI_Product_Id));
    formData.append('LI_Proposer_Type', this.StepData['LI_Proposer_Type']);

    formData.append('LI_Term_Net_Premium', this.ActionForm.value['LI_Term_Net_Premium']);
    formData.append('LI_Term_Gross_Premium', this.ActionForm.value['LI_Term_Gross_Premium']);
    formData.append('LI_Net_Premium', this.ActionForm.value['LI_Net_Premium']);
    formData.append('LI_Gross_Premium', this.ActionForm.value['LI_Gross_Premium']);

    formData.append('LI_Riders_Premium', JSON.stringify(this.ActionForm.value['LI_Riders_Premium']));

    formData.append('StepData', JSON.stringify(this.StepData));
    formData.append('Portal', 'CRM');

    this.api.IsLoading();
    this.api.HttpForSR('post', 'Renewal/EditPremium', formData).then((result:any) => {
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


  //===== PREMIUM CALUATION =====//
  LifeCalculation(type: any) {

    var fields = this.ActionForm.value;

    const formData = new FormData();

    formData.append('LOB_Id', 'LI');
    formData.append('User_Id', this.api.GetUserData('Id'));
    formData.append('User_Code', this.api.GetUserData('Code'));

    formData.append('CurrentInput', type);

    formData.append('LI_Term_Net_Premium', fields['LI_Term_Net_Premium']);
    formData.append('LI_Term_Gross_Premium', fields['LI_Term_Gross_Premium']);

    formData.append('LI_Net_Premium', fields['LI_Net_Premium']);
    formData.append('LI_Gross_Premium', fields['LI_Gross_Premium']);
    formData.append('Is_Gst_Applicable', JSON.stringify(this.Is_Gst_Applicable));
    formData.append('LI_Plan_Type', JSON.stringify(this.LI_Product_Type));
    formData.append('LI_Product_Id', JSON.stringify(this.LI_Product_Id));
    formData.append('LI_Proposer_Type', this.StepData['LI_Proposer_Type']);
    formData.append('SR_Id', this.Id);
    formData.append('Renewal_Year', this.renewal_year);
    formData.append('SR_Flag', 'Edit');

    //this.api.IsLoading();
    this.api.HttpPostTypeBms('../v2/sr/life/LifeCalculations/index', formData).then((result:any) => {
      //this.api.HideLoading();

      if (result['Status'] == true) {

        var res = result['Data'];

        var LI_Term_Net_Premium_Control = this.ActionForm.get('LI_Term_Net_Premium');
        var LI_Term_Gross_Premium_Control = this.ActionForm.get('LI_Term_Gross_Premium');

        var LI_Net_Premium_Control = this.ActionForm.get('LI_Net_Premium');
        var LI_Gross_Premium_Control = this.ActionForm.get('LI_Gross_Premium');

        if (type == 'Term_Net_Premium_LI') {
          LI_Term_Gross_Premium_Control.setValue(res['Estimated_Gross_Premium']);
          LI_Term_Gross_Premium_Control.updateValueAndValidity();
        }

        if (type == 'Term_Gross_Premium_LI') {
          LI_Term_Net_Premium_Control.setValue(res['Net_Premium']);
          LI_Term_Net_Premium_Control.updateValueAndValidity();
        }

        if (type == 'Net_Premium_LI') {
          LI_Gross_Premium_Control.setValue(res['Estimated_Gross_Premium']);
          LI_Gross_Premium_Control.updateValueAndValidity();
        }

        if (type == 'Gross_Premium_LI') {
          LI_Net_Premium_Control.setValue(res['Net_Premium']);
          LI_Net_Premium_Control.updateValueAndValidity();
        }

      } else {
        this.api.Toast('Warning', result['Message']);
      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error, Please try again ! ');
    });
  }


  //===== RIDERS PREMIUM CALCULATION =====//
  RidersCalculation(Type: any, Value: any, Index: any) {

    if (Value.target.value == '') {
      // Gross Premium
      if (Type == 'Net') {

        const PayInGroupFields = (<FormArray>this.ActionForm.get("LI_Riders_Premium")).at(Index);
        PayInGroupFields.patchValue({
          RiderGrossPremium: ''
        });

      }

      // Net Premium
      if (Type == 'Gross') {
        const PayInGroupFields = (<FormArray>this.ActionForm.get("LI_Riders_Premium")).at(Index);
        PayInGroupFields.patchValue({
          RiderNetPremium: ''
        });
      }

      return;
    }

    var fields = this.ActionForm.value;

    const formData = new FormData();
    formData.append('CurrentInput', Type);

    formData.append('renewal_year', this.renewal_year);
    formData.append('LI_Rider_Premium', Value.target.value);
    formData.append('Is_Gst_Applicable', JSON.stringify(this.Is_Gst_Applicable));
    formData.append('LI_Plan_Type', JSON.stringify(this.LI_Product_Type));
    formData.append('SR_Id', this.StepData['SR_Id']);

    this.api.HttpPostTypeBms('../v2/sr/life/LifeCalculations/RidersCalculation', formData).then((result:any) => {

      if (result['Status'] == true) {

        var res = result['Data'];

        // Gross Premium
        if (Type == 'Net') {

          const PayInGroupFields = (<FormArray>this.ActionForm.get("LI_Riders_Premium")).at(Index);
          PayInGroupFields.patchValue({
            RiderGrossPremium: res['Gross_Premium']
          });

        }

        // Net Premium
        if (Type == 'Gross') {
          const PayInGroupFields = (<FormArray>this.ActionForm.get("LI_Riders_Premium")).at(Index);
          PayInGroupFields.patchValue({
            RiderNetPremium: res['Net_Premium']
          });
        }

      } else {
        this.api.Toast('Warning', result['Message']);
      }

    }, (err) => {
      this.api.Toast('Warning', 'Network Error, Please try again ! ');
    });

  }

}