import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class ColumnsObj {
  SNo: string;
  Id: string;
  PriorityLevel: any;
  AddStamp: any;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-po-priority-logs',
  templateUrl: './po-priority-logs.component.html',
  styleUrls: ['./po-priority-logs.component.css']
})
export class PoPriorityLogsComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  AgentId: any = '';
  MonthName: any = '';
  FinancialYear: any = '';

  constructor(public dialogRef: MatDialogRef<PoPriorityLogsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public formBuilder: FormBuilder) {

    this.AgentId = this.data.AgentId;
    this.MonthName = this.data.MonthName;
    this.FinancialYear = this.data.FinancialYear;

  }

  ngOnInit() {

    this.Get();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET DATATABLE DATA =====//
  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
      Authorization: "Bearer " + this.api.GetToken(),
        }),
    };

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'ilpftripl',
     ajax: (dataTablesParameters: any, callback) => {
             this.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBms + '/../../v2/reports/Po_Priority/PriorityLogsData?&User_Id=' + this.api.GetUserId() + '&AgentId=' + this.AgentId + '&MonthName=' + this.MonthName + '&FinancialYear=' + this.FinancialYear), dataTablesParameters,
             this.api.getHeader(environment.apiUrlBms)
          ).subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp.Status == false) {
              this.dataAr = [];
            } else {
              this.dataAr = resp.data;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },

      columnDefs: [{
        targets: [0, 1, 2], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }]
    };
  }


}
