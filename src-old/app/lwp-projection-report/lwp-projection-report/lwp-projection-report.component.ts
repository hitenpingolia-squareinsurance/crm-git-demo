import { FormGroup } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { LwpRecordsComponent } from "../lwp-records/lwp-records.component";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
  Total_Lwp:number;
  Total_Employee:number;
  currentMonthStartDate : any;
  currentMonthEndDate : any;
  previousMonthStartDate : any;
  previousMonthEndDate : any;
}

@Component({
  selector: 'app-lwp-projection-report',
  templateUrl: './lwp-projection-report.component.html',
  styleUrls: ['./lwp-projection-report.component.css']
})
export class LwpProjectionReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  DataArr: any[];
  SearchForm: FormGroup;
  Total_Employee:any;
  Total_Lwp:any;

  currentMonthStartDate : any;
  currentMonthEndDate : any;
  previousMonthStartDate : any;
  previousMonthEndDate : any;


  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<LwpRecordsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
   }

  ngOnInit() {
    this.Get();
    // this.GetLeaves();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.dataAr = [];
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData(event: any) {
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {

        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
    });
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization:  this.api.GetToken(),
      }),
    };

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrl + "/LWPProjectionReport/lwp_report?User_Id=" +this.api.GetUserData("Id") +"&User_Type=" +
              this.api.GetUserType()),dataTablesParameters,this.api.getHeader(environment.apiUrl) )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.Total_Employee = resp.Total_Employee;
            this.Total_Lwp = resp.Total_Lwp;

            this.currentMonthStartDate = resp.currentMonthStartDate;
            this.currentMonthEndDate = resp.currentMonthEndDate;
            this.previousMonthStartDate = resp.previousMonthStartDate;
            this.previousMonthEndDate = resp.previousMonthEndDate;

            if (that.dataAr.length > 0) { }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  GetMonthData(monthType: string , ID:any): void {
    const dialogRef = this.dialog.open(LwpRecordsComponent, {
      width: "80%",
      height:"80%",
      data: {
        monthType: monthType,
        ID: ID,
        currentMonthStartDate :  this.currentMonthStartDate,
        currentMonthEndDate : this.currentMonthEndDate,
        previousMonthStartDate : this.previousMonthStartDate,
        previousMonthEndDate : this.previousMonthEndDate
      },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.Reload();
        this.Get();
    });
  }
  



}
