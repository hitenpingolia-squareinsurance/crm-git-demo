import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { ApiService } from '../../providers/api.service';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { Router } from  '@angular/router';
import swal from 'sweetalert';

class ColumnsObj {
  Id: string;
  SR_No: string;
  SR_Alias: string;
  Agent_Payout_OD: string;
  Agent_Payout_OD_Amount: string;
  Agent_Payout_TP: string;
  Agent_Payout_TP_Amount: string;
  Agent_Payout_Net: string;
  Agent_Payout_Net_Amount: string;
  Agent_Terrorism_Payout: string;
  Agent_Terrorism_Payout_Amount: string;
  Agent_Reward_Amount: string;
  Agent_Scheme_Amount: string;
  Agent_Total_Amount: string;
  Payin_OD: string;
  Payin_OD_Amount: string;
  Payin_TP: string;
  Payin_TP_Amount: string;
  Payin_Net: string;
  Payin_Net_Amount: string;
  PayIn_Terrorism: string;
  PayIn_Terrorism_Amount: string;
  Reward_Amount: string;
  Scheme_Amount: string;
  Payin_Total_Amount: string;
  Revenue: string;
  Booking_Date: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-extra-payout-details',
  templateUrl: './extra-payout-details.component.html',
  styleUrls: ['./extra-payout-details.component.css']
})

export class ExtraPayoutDetailsComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  Bulk_Id:any;
  TableUsed:any;

  constructor( public dialogRef: MatDialogRef<ExtraPayoutDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, public formBuilder: FormBuilder, private http: HttpClient) {

  }

  ngOnInit() {
    this.Bulk_Id = this.data.Bulk_Id;
    this.TableUsed = this.data.TableUsed;
    this.Get();
  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== RELOAD DATATABLE =====//
  Reload(){
	  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
	    dtInstance.draw();
	  });
  }


	//===== GET DATATABLE DATA =====//
  Get(){
	const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBmsBase + '/bulk-upload/ViewUploadedData/BulkDetailsGrid?User_Id='+this.api.GetUserId()+'&BulkId='+this.Bulk_Id+'&TableUsed='+this.TableUsed), dataTablesParameters
          ,this.api.getHeader(environment.apiUrlBmsBase) 
        ).subscribe((res:any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

            // return;
            that.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },

      columns: [{ data: 'Id' },
				{ data: 'Bulk_Id' },
				{ data: 'Add_Stamp' },
			]
    };
  }



}
