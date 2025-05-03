import { FormGroup } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { PosDetailsComponent } from "src/app/modals/pos-details/pos-details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Name: string;
  emp_id: string;
  Email: string;
  Mobile: string;
  Department: string;
  Branch: string;
  reportin_manager: string;
  agent_id: any;
}

class DataTablesResponse {
  data: any[];
  typedata: any[];
  draw: any;
  recordsFiltered: any;
  recordsTotal: any;
  TotalFiles: any;
}
@Component({
  selector: 'app-lms-report',
  templateUrl: './lms-report.component.html',
  styleUrls: ['./lms-report.component.css']
})
export class LmsReportComponent implements OnInit {


  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: any;
  SearchForm: FormGroup;
  Is_Export: any;
  Masking: any = "Temp";
  FieldFetch: any = [];
  logData: any;
  dataArr: any = [];
  sqlConduction: any = '';
  SearchFilter: any;
  businessdata: any = [];
  leadRevievedate: any;
  leadId: any;
  constructor(
    private api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    
  ) { }

  ngOnInit() {
    this.Get();
  }

  ShowMaskingField(i) {
    this.Masking = i;
  }

  ClearSearch() {
    this.SearchForm.reset();
    this.Is_Export = 0;
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
    this.Is_Export = 0;
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      // if (TablesNumber == "kt_datatable") {
      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
        this.SearchFilter = event;
      }
    });
  }


  Get() {
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        const baseUrl = environment.apiUrl + "/LmsReport/Report?User_Id=" + this.api.GetUserData("Id") + "&User_Type=" + this.api.GetUserType();
        const params = dataTablesParameters;
        
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(baseUrl), params, this.api.getHeader(environment.apiUrl)).subscribe((res: any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

          that.dataAr = resp.data;
          this.sqlConduction = resp.where;
          // where
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
          });
        });
      },
    };
  }


  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }

  // new 
  getDetails(Id: any) {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("lead_id", Id);
    this.api.HttpPostTypeBms("lms/LmsCommon/getDetails", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.FieldFetch = result["data"];
          this.logData = this.FieldFetch.log;
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")");
      }
    );
  }

  
  // follow up 
  FollowUpPopup_open(e: any, Id: number, Action: string, leadAge: any, indexs: any,leaddate: any,leadId: any) {
    this.leadRevievedate = leaddate;
    this.leadId = leadId;
    this.getdata(Id);
    document.getElementById("ageSpan").innerHTML = leadAge;
  }

  getdata(id: any) {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Id", id);
    this.api.HttpPostTypeBms("lms/LmsCommon/InsuranceLeadsLogs", formData).then(
      (result) => {
        this.dataArr = result;
      },
      (err) => {
        this.dataArr = err["error"]["text"];
      }
    );
  }

  // new export  
  getLmsReportExport() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("sqlConduction", this.sqlConduction);
    formData.append("searchFilter", JSON.stringify(this.SearchFilter));
    this.api.IsLoading();
    this.api.HttpPostType("LmsReport/LmsReportExport", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.api.Toast("Success", result["Message"]);
          this.downloadFile(result["DownloadUrl"]);
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


  PospBusiness(posId : any, primary :any) {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("posId", posId);
    formData.append("primary", primary);
    this.api.IsLoading();
    this.api.HttpPostType("LmsReport/PosBusiness", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {

          this.businessdata = result['Data'];          
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


  downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


    PospDetails(Id: any, Type: any) {
      const dialogRef = this.dialog.open(PosDetailsComponent, {
        width: "80%",
        height: "80%",
        disableClose: true,
        data: { Id: Id, type: Type },
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {});
    }
  
}

