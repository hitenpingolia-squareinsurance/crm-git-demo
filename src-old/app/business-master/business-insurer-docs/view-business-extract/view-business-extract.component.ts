import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../providers/api.service';
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BmsapiService } from 'src/app/providers/bmsapi.service';
import { Router } from '@angular/router';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

class ColumnsObj {
  Sno: string;
  PolicyNo: string;
  RegistrationNo: string;
  EngineNo:string;
  ChassisNo:string;
  NetPremium:string;
  EstimatedGrossPremium:string;
  IDV:string;
  NCB:string;
  BasicOD:string;
  BasicTP:string;
  Status:string;
  Action: string;
}

@Component({
  selector: 'app-view-business-extract',
  templateUrl: './view-business-extract.component.html',
  styleUrls: ['./view-business-extract.component.css']
})
export class ViewBusinessExtractComponent implements OnInit {

  @ViewChild('viewDumpSRPopup', { static: false }) viewDumpSRPopup!: TemplateRef<any>;
  private srDumpDialogRef!: MatDialogRef<any>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";
  getBusinessDumpId:any;
  SearchForm: FormGroup;
  isSubmitted = false;
  dropdownSettingSingleSelect: any = {};
  Status_Ar = [
    { Id: 'Pending', Name: 'Pending' },
    { Id: 'Review', Name: 'Review' },
    { Id: 'Already-Reviewed', Name: 'Already-Reviewed' },
    // { Id: 'Duplicated', Name: 'Duplicated' },
    { Id: 'Not-Matched', Name: 'Not-Matched' },
    { Id: 'Incompleted', Name: 'Incompleted' }
  ];
  viewDumpSRDetails:any;


  constructor(
    public dialogRef: MatDialogRef<ViewBusinessExtractComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public api: ApiService, public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public bmsApi: BmsapiService,
    private http: HttpClient,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.SearchForm = this.formBuilder.group({
      Status: [''],
      GlobalSearch:['']
    });

    this.dropdownSettingSingleSelect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.getBusinessDumpId = this.data.Id;
  
    this.getBusinessDumpExtract();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Is_Refresh: 'Yes' // Ensure the parent gets the refresh signal
    });
  }
  

  ClearSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search('').draw();
    });
    this.SearchForm.reset();
  }

  getBusinessDumpExtract() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(
          `${environment.apiUrlBmsBase}/../v2/business_master/BusinessInsurerDocs/getBusinessDumpExtract?Id=${this.getBusinessDumpId}&User_Id=${this.api.GetUserData("Id")}&User_Type=${this.api.GetUserType()}&User_Code=${this.api.GetUserData("Code")}`,
          dataTablesParameters,
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .subscribe((res:any) => {
          let resp = JSON.parse(this.api.decryptText(res.response));
          that.dataAr = resp.data;
          console.log("that.dataAr",that.dataAr);
          if (that.dataAr.length > 0) {
          }
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        });
      },
    };
  }


  SearchData() {
    const field = this.SearchForm.value;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(field))).draw();
    });

  }


  viewDumpSR(businessDumpExtractId): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Id", businessDumpExtractId);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("../v2/business_master/BusinessInsurerDocs/viewSingleBusinessDumpExtract", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.api.HideLoading();
            this.viewDumpSRDetails = result["Data"];
            this.DumpSRPopUp();
          } else {
            this.api.HideLoading();
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }
  

 
  DumpSRPopUp(): void {
    if (this.viewDumpSRPopup) {
      this.srDumpDialogRef = this.dialog.open(this.viewDumpSRPopup, {
        width: '60%',
        maxWidth: '90vw',
        disableClose: true,
        panelClass: 'excel-dump-dialog'
      });
    } else {
      console.error("viewDumpSRPopup template not found!");
    }
  }

  // Modal Close Karne Ka Function
  CloseModelSRDumpView(): void {
    if (this.srDumpDialogRef) {
      this.srDumpDialogRef.close();
    }
  }

  openJSONInNewTab(jsonData: string, title: string) {
    try {
      // JSON parse karna
      const parsedData = JSON.parse(jsonData);
      const prettyJson = JSON.stringify(parsedData, null, 2); // Pretty formatting
  
      const newWindow = window.open();
  
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>JSON Response : ${title}</title> 
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                pre { white-space: pre-wrap; word-wrap: break-word; font-size: 14px; background: #f4f4f4; padding: 10px; border-radius: 5px; }
              </style>
            </head>
            <body>
              <h2>JSON Response : ${title}</h2> 
              <pre>${prettyJson}</pre>
            </body>
          </html>
        `);
  
        newWindow.document.close(); // FIX: Stop infinite loading
      } else {
        console.error("Popup blocked! Allow pop-ups in your browser.");
      }
    } catch (error) {
      console.error("Invalid JSON Format:", error);
    }
  }
  
  deleteExcelBulkRecord(Id) {
    if (confirm("Are you sure you want to delete this record?")) {
      const formData = new FormData();
      formData.append('User_Id', this.api.GetUserId());
      formData.append('Delete_Type','Single');
      formData.append('type', this.api.GetUserData('Type'));
      formData.append('Id', Id); 
  
      // Send HTTP POST request
      this.bmsApi.HttpPostType('../v2/business_master/BusinessInsurerDocs/deleteUploadedExcelRecord', formData)
        .then((result) => {
          this.api.HideLoading();
          if (result['Status'] == true) {
            this.ClearSearch();
            this.api.Toast('Success', result['Message']);
          } else {
            this.api.Toast('Error', result['Message']);
          }
        })
        .catch((err) => {
          this.api.HideLoading();
          this.api.Toast('Error', 'Failed to delete the record. Please try again.');
        });
    }
  }


  SrPopup(type, row_Id): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");
    let urlSegment = 'general-insurance';
    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            //var baseurl = 'http://localhost:2100/';
            // var baseurl = 'https://uat.policyonweb.com/';
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/" +
              urlSegment +
              "/" +
              type +
              "/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web";
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }
  
  
  
  
  



}
