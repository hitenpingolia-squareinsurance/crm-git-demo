import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadGroupInsuredExcelComponent } from '../../../modals/sr-related/upload-group-insured-excel/upload-group-insured-excel.component';
import { GroupSrInsuredComponent } from '../../../modals/sr-related/group-sr-insured/group-sr-insured.component';

class ColumnsObj {
  SNo: string;
  Id: string;
  SR_Id: string;
  FullSrNo: string;
  NetPremium: any;
  GrossPremium: any;
  BookingDate: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQL_Where: any;
  NetPremium: any;
  GrossPremium: any;
}

@Component({
  selector: 'app-group-sr-endorsement-track',
  templateUrl: './group-sr-endorsement-track.component.html',
  styleUrls: ['./group-sr-endorsement-track.component.css']
})

export class GroupSrEndorsementTrackComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  UserId: number = this.api.GetUserData('Id');

  SearchForm: FormGroup;
  isSubmitted = false;
  masterSelected: boolean;
  checkedList: any = [];
  ShowDeleteButton: any = 'No';

  SR_Id: any = 0;
  url_segment: any = '';
  NetPremium: any = 0;
  GrossPremium: any = 0;
  Is_Export: any = 0;
  DownloadUrl: any = "https://api.policyonweb.com/API/uploads/life-group-sr/sample/MemberDetailsFormat.xlsx";
  DownloadUrl1: any;
  Is_Download: any = 0;

  constructor(public dialogRef: MatDialogRef<GroupSrEndorsementTrackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService, private http: HttpClient, public dialog: MatDialog, private router: Router, private fb: FormBuilder) {

    this.SearchForm = this.fb.group({
      GlobalSearch: [''],
    });

  }

  ngOnInit(): void {
    this.SR_Id = this.data.Id;
    this.url_segment = this.data.url_segment;
    this.Get();
  }


  //===== FORM CONTROLS VALIDATION =====//
  get FC() {
    var fields = this.SearchForm.value;
    return this.SearchForm.controls;
  }


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {

    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      var query = {
        User_Id: this.api.GetUserData('Id'),
        User_Type: this.api.GetUserType(),

        Vertical_Id: fields['Vertical_Id'],
        GlobalSearch: fields['GlobalSearch'],

      }

      this.Is_Export = 0;
      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
        this.Is_Export = 0;
      });
    }

  }


  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {

    var fields = this.SearchForm.reset();
    this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;

  }


  //===== RELOAD PAGE =====//
  Reload() {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });

  }


  //===== RESET DATATABLE =====//
  ResetDT() {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });

  }


  //===== GET DATATABLE DATA =====//
  Get() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.api.GetToken()
      })
    };

    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(environment.apiUrlBms + '/GroupSrRelated/GridEndorsementData?&User_Id=' + this.api.GetUserData('Id') + '&User_Code=' + this.api.GetUserData('Code') + '&User_Type=' + this.api.GetUserType() + '&SR_Id=' + this.SR_Id + '&url_segment=' + this.url_segment, dataTablesParameters, httpOptions
          ).subscribe(resp => {
            that.dataAr = resp.data;
            that.NetPremium = resp.NetPremium;
            that.GrossPremium = resp.GrossPremium;

            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },

      columnDefs: [{
        targets: [0, 1, 2, 3, 4], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }]
    };

  }


  //===== ADD NEW EMPLOYEE DATA =====//
  ExportData() {

    const formData = new FormData();

    formData.append('SR_Id', this.SR_Id);
    formData.append('User_Code', this.api.GetUserData('Code'));

    this.api.IsLoading();
    this.api.HttpForSR('post', 'ExportData/Prepare_Excel_Life', formData).then((result:any) => {
      this.api.HideLoading();

      if (result['Status'] == true) {
        this.Is_Download = 1;
        this.DownloadUrl1 = result['DownloadUrl'];
        this.ClickToDownload();
      } else {
        this.api.Toast('Error', result['Message']);
      }

    }, (err) => {
      this.api.HideLoading();
      this.api.Toast('Warning', 'Network Error, Please try again ! ');
    });

  }


  ClickToDownload() {
    window.open(this.DownloadUrl1);
  }


  //===== BULK UPLOAD MEMBER =====//
  UploadBulkExcelComponent(): void {

    const dialogRef = this.dialog.open(UploadGroupInsuredExcelComponent, {
      width: '45%',
      height: '55%',
      data: { SR_Id: this.SR_Id, NetPremium: this.NetPremium, url_segment: this.url_segment }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });

  }


  //===== VIEW DOCUMENT =====//
  ViewDocument(url: any) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }


  //===== DOWNLOAD SAMPLE EXCEL =====//
  DownloadSampleExcel() {
    window.open(this.DownloadUrl);
  }


  //===== VIEW GROUP SR MEMBER DETAILS =====//
  ViewGroupSrMembers(row_Id: any): void {

    const dialogRef = this.dialog.open(GroupSrInsuredComponent, {
      width: '75%',
      height: '75%',
      data: { Id: row_Id, url_segment: this.url_segment }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

}