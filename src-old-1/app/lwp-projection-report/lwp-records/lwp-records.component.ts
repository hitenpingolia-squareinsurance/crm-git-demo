
import { Component, Inject, OnInit , ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-lwp-records',
  templateUrl: './lwp-records.component.html',
  styleUrls: ['./lwp-records.component.css']
})
export class LwpRecordsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = []; 
  StartDate: string;
  EndDate: string;
  modalTitle: string;
  monthType: any;
  ID: any;

  currentMonthStartDate: any;
  currentMonthEndDate: any;
  previousMonthStartDate: any;
  previousMonthEndDate: any;
  Id: any;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<LwpRecordsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.Id = this.api.GetUserData("Id");
    this.monthType = this.data.monthType;
    this.ID = this.data.ID;
    this.currentMonthStartDate = this.data.currentMonthStartDate;
    this.currentMonthEndDate = this.data.currentMonthEndDate;
    this.previousMonthStartDate = this.data.previousMonthStartDate;
    this.previousMonthEndDate = this.data.previousMonthEndDate;
    
    this.setDates();
    
    this.GetData();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
    });
  }

  ClearSearch() {
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

  
  setDates() {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();

    if (this.monthType === 'current') {  
      this.StartDate = this.currentMonthStartDate || `${year}-${month}-01`;
      this.EndDate = this.currentMonthEndDate || `${year}-${month}-${date}`;
    } else if (this.monthType === 'previous') {
      let previousMonth = now.getMonth();
      let previousYear = year;
      
      if (previousMonth === 0) {
        previousMonth = 12;
        previousYear -= 1;
      }

      const formattedPreviousMonth = String(previousMonth).padStart(2, '0');
      const lastDayOfPreviousMonth = new Date(previousYear, previousMonth, 0).getDate();

      this.StartDate = this.previousMonthStartDate || `${previousYear}-${formattedPreviousMonth}-01`;
      this.EndDate = this.previousMonthEndDate || `${previousYear}-${formattedPreviousMonth}-${lastDayOfPreviousMonth}`;
    }
  }

  
  GetData() {


    this.modalTitle = this.monthType === 'current' ? 'Current Month Lwp' : 'Previous Month Lwp';

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        this.http.post<DataTablesResponse>(
          this.api.additionParmsEnc(environment.apiUrl + "/LWPProjectionReport/lwp_Month_Report?User_Id=" + this.api.GetUserData("Id") +
          "&User_Type=" + this.api.GetUserType() +
          "&StartDate=" + this.StartDate +
          "&EndDate=" + this.EndDate +
          "&ID=" + this.ID),
          dataTablesParameters, 
          this.api.getHeader(environment.apiUrl)
        ).subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
          this.dataAr = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [], 
          });
        });
      },
    };
  }


  lwp_MonthReport_Export() {

      this.api.IsLoading();
      this.api.HttpGetType("LWPProjectionReport/lwp_MonthReport_Export?StartDate=" + this.StartDate +
          "&EndDate=" + this.EndDate +
          "&ID=" + this.ID).then(
        (result:any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);

            this.downloadExcelFile(result['DownloadUrl']);

          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(newLocal, "Network Error : " + err.name + "(" + err.statusText + ")");
        }
      );
  }
  
  downloadExcelFile(downloadUrl) {
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank'; // Open the URL in a new tab or window

  // Set the download attribute to prompt the user to download the file
  link.download = downloadUrl.split('/').pop();

  // Append the link to the body (required for Firefox)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link after download
  document.body.removeChild(link);
  }



}
