import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agents-report-details',
  templateUrl: './agents-report-details.component.html',
  styleUrls: ['./agents-report-details.component.css']
})

export class AgentsReportDetailsComponent implements OnInit {

  agent_id: any = 0;
  agent_name: any = '';
  cfy: any = [];
  lfy: any = [];
  lfy_total: any = [];
  growth_rate: any = [];
  check_int: any = [];

  constructor(public dialogRef: MatDialogRef<AgentsReportDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public formBuilder: FormBuilder) {

  }

  ngOnInit() {

    this.agent_id = this.data.agent_id;
    this.agent_name = this.data.agent_name;
    this.GetBusinessData();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== GET BUSINESS DATA =====//
  GetBusinessData() {

    const formData = new FormData();
    formData.append('agent_id', this.agent_id);
    formData.append('portal', 'CRM');

    this.api.IsLoading();
    this.api.HttpPostTypeBms('dsr/DsrBusinessCalculation/GetBusinessData', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['status'] == true) {
        this.cfy = result['cfy'];
        this.lfy = result['lfy'];
        this.lfy_total = result['lfy_total'];
        this.growth_rate = result['growth_rate'];
        this.check_int = result['check_int'];
      }

    });

  }

}
