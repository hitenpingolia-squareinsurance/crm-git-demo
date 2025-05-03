import { Component, OnInit, ElementRef, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import html2canvas from "html2canvas";

class ColumnsObj {
  SNo: string;
  Id: string;
  Dep_Name: string;
  Branch_Name: string;
  UploadDate: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  FilterData: any[];
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-employee-expense-details',
  templateUrl: './employee-expense-details.component.html',
  styleUrls: ['./employee-expense-details.component.css']
})

export class EmployeeExpenseDetailsComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  @ViewChild("elementToCapture", { static: false })
  elementToCapture: ElementRef;

  dtOptions: DataTables.Settings = {};
  dataAr: Array<any> = [];

  SearchForm: FormGroup;
  isSubmitted = false;

  Is_Refresh: any = 'No';
  emp_id: any = 0;
  emp_name: any = '';
  selected_year: any = '2023';

  constructor(public dialogRef: MatDialogRef<EmployeeExpenseDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, private router: Router,
    private formBuilder: FormBuilder) {

    this.SearchForm = this.formBuilder.group({
      financial_year: [''],
    });

  }

  ngOnInit() {

    this.emp_id = this.data.emp_id;
    this.emp_name = this.data.emp_name;
    this.GetEmployeeExpenseDetails();

  }

  get FC_6() { return this.SearchForm.controls; }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
      Is_Refresh: this.Is_Refresh
    });
  }


  //===== GET EMPLOYEE EXPENSE DETAILS =====//
  GetEmployeeExpenseDetails() {

    const formData = new FormData();

    var fields = this.SearchForm.value;
    formData.append('emp_id', this.emp_id);
    formData.append('financial_year', fields["financial_year"]);

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseExtrasFunctions/GetEmployeeExpenseDetails', formData).then((result:any) => {
      this.api.HideLoading();
      if (result['Status'] == true) {
        this.dataAr = result['data_ar'];
        this.CalculateSingleExpenseDetails();
      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  //===== GET PROFILE ACHIVEMENT IN CHUNKS =====//
  async CalculateSingleExpenseDetails() {

    for (let i = 0; i < this.dataAr.length; i++) {

      var expense_type: any = this.dataAr[i]['type'];
      var month_data: any = this.dataAr[i]['months'];


      const formData = new FormData();

      var fields = this.SearchForm.value;
      formData.append('User_Id', this.api.GetUserId());
      formData.append('emp_id', this.emp_id);
      formData.append('expense_type', expense_type);
      formData.append('month_data', JSON.stringify(month_data));
      formData.append('financial_year', fields["financial_year"]);
      formData.append('total_data', JSON.stringify(this.dataAr));

      var url = environment.apiUrlBmsBase + "/goal-management-system/expenses/ExpenseExtrasFunctions/CalculateSingleExpenseDetails";

      await this.http
        .post<any>(this.api.additionParmsEnc(url), this.api.enc_FormData(formData),this.api.getHeader(environment.apiUrlBmsBase))
        .toPromise()
        .then((res:any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.dataAr[i]['months'] = data.month_data;

        });

    }

  }


  //===== GET EMPLOYEE EXPENSE DETAILS =====//
  GeneratePdf() {

    const formData = new FormData();

    var fields = this.SearchForm.value;
    formData.append('emp_id', this.emp_id);
    formData.append('data_r', JSON.stringify(this.dataAr));

    this.api.IsLoading();
    this.api.HttpPostTypeBms('goal-management-system/expenses/ExpenseExtrasFunctions/GenerateExpensePdf', formData).then((result:any) => {
      this.api.HideLoading();
      if (result['Status'] == true) {
        this.api.Toast('Success', result['Message']);
      }

    }, (err) => {
      this.api.HideLoading();
    });

  }


  screenshot() {
    const captureElement: any = document.querySelector("#capture");

    html2canvas(captureElement).then((canvas) => {

      const imageData = canvas.toDataURL("image/png");
      var FileName = new Date();
      const link = document.createElement("a");
      link.setAttribute("download", FileName + ".png");
      link.setAttribute("href", imageData);

      link.click();

    });
  }

}