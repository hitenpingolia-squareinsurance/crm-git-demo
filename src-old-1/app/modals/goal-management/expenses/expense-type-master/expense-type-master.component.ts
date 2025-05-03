import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../providers/api.service';

@Component({
  selector: 'app-expense-type-master',
  templateUrl: './expense-type-master.component.html',
  styleUrls: ['./expense-type-master.component.css']
})

export class ExpenseTypeMasterComponent implements OnInit {

  ExpenseTypeForm: FormGroup;
  isSubmitted = false;

  Is_Refresh: any = 'No';
  dataAr: any = [];

  constructor(public dialogRef: MatDialogRef<ExpenseTypeMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public api: ApiService, public formBuilder: FormBuilder) {

    this.ExpenseTypeForm = this.formBuilder.group({
      expense_type: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    this.GetExpenseTypeData();
  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== GET EXPENSE TYPE LIST =====//
  GetExpenseTypeData() {

    const formData = new FormData();

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseMasters/GetExpenseTypeData', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.dataAr = result['Data'];

      } else {
        this.dataAr = result['Data'];
      }

    }, (err) => {

    });

  }


  //===== ADD EXPENSE TYPE DATA =====//
  AddExpenseType() {

    this.isSubmitted = true;
    if (this.ExpenseTypeForm.invalid) {
      return;

    } else {

      var fields = this.ExpenseTypeForm.value;
      const formData = new FormData();

      formData.append('user_code', this.api.GetUserData('Code'));
      formData.append('expense_type', this.ExpenseTypeForm.value['expense_type']);

      this.api.IsLoading();
      this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseMasters/AddExpenseType', formData).then((result:any) => {
        this.api.HideLoading();

        if (result['Status'] == true) {
          this.api.Toast('Success', result['Message']);
          this.Is_Refresh = 'Yes';
          this.GetExpenseTypeData();
        } else {
          this.api.Toast('Error', result['Message']);
        }

      }, (err) => {
        this.api.HideLoading();
        this.api.Toast('Warning', 'Network Error, Please try again ! ');
      });

    }

  }


  //===== GET ORGANIZATION LIST =====//
  UpdateExpenseTypeStatus(row_id: any, status: any) {

    const formData = new FormData();
    formData.append('row_id', row_id);
    formData.append('status', status);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseMasters/UpdateExpenseTypeStatus', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.GetExpenseTypeData();

      }

    }, (err) => {

    });

  }


}