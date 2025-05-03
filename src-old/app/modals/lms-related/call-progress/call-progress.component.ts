import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, NgZone, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import $ from 'jquery';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-call-progress',
  templateUrl: './call-progress.component.html',
  styleUrls: ['./call-progress.component.css']
})
export class CallProgressComponent implements OnInit {


  call_id: any = '0';
  row_id: any = '0';

  constructor(public dialogRef: MatDialogRef<CallProgressComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public formBuilder: FormBuilder, private ngZone: NgZone) {

    this.call_id = this.data.call_id;
    this.row_id = this.data.row_id;

  }

  ngOnInit() {

    this.CheckWebHookResponse();

  }


  //===== CHECK WEB HOOK RESPONSE =====//
  async CheckWebHookResponse() {

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("row_id", this.row_id);
    formData.append("call_id", this.call_id);

    this.api.HttpPostTypeBms("lms/LmsCommon/CheckWebHookResponse", formData).then((result:any) => {
      this.api.HideLoading();
      if (result["status"] == true) {
        this.CloseModel();

      } else {
        this.CheckWebHookResponse();
      }
    },
      (err) => {
        this.api.HideLoading();
      }
    );

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }

}
