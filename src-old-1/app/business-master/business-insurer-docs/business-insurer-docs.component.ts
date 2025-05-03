import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog ,MatDialogRef} from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { BmsapiService } from '../../providers/bmsapi.service';
import { environment } from "../../../environments/environment";
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddBusinessInsurerDocsComponent } from './add-business-insurer-docs/add-business-insurer-docs.component';
import { ViewBusinessExtractComponent } from './view-business-extract/view-business-extract.component';
import { BusinessMapModalComponent } from './business-map-modal/business-map-modal.component';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

class ColumnsObj {
  Sno: string;
  Insurer: string;
  UploadedBy: string;
  UploadedDate:string;
  Status:string;
  Action: string;
}


@Component({
  selector: 'app-business-insurer-docs',
  templateUrl: './business-insurer-docs.component.html',
  styleUrls: ['./business-insurer-docs.component.css']
})
export class BusinessInsurerDocsComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) datatableElement!: DataTableDirective;
  private dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('mapInsurerData', { static: false }) mapInsurerData!: TemplateRef<any>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";

  currentUrl: string;
  ActionType: any = "";
  urlSegment: string;
  pageHeading: string;
  UserRoleType: string;
  SearchForm: FormGroup;
  company: any[];
  UploadDocFileName:any;

  dropdownSettingsmultiselect: any = {};
  FetchColumsData :any;



  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    public bmsApi: BmsapiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
   
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'No records available'
    };

   
  }

  ngOnInit() {

    this.currentUrl = this.router.url;
    const splitted = this.currentUrl.split("/");
    if (splitted[2]) {
      this.urlSegment = splitted[2];
    }
    this.UserRoleType = this.api.GetUserType();
    this.SearchForm = this.formBuilder.group({
      company: [''],
      DateOrDateRange: [''],
    });
    this.Get();
  }

  Get() {
    this.api.IsLoading();
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: this.api.GetToken(),
    //   }),
    // };

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
          `${environment.apiUrlBmsBase}/../v2/business_master/BusinessInsurerDocs?User_Id=${this.api.GetUserData("Id")}&User_Type=${this.api.GetUserType()}&User_Code=${this.api.GetUserData("Code")}`,
          dataTablesParameters,
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .subscribe((res:any) => {
          let resp = JSON.parse(this.api.decryptText(res.response));
          that.dataAr = resp.data;
          console.log(" that.dataAr",that.dataAr);
          that.company = resp['company'];
          if (that.dataAr.length > 0) {
          }
          this.api.HideLoading();
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        });
      },
    };
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  SearchData() {
    const field = this.SearchForm.value;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(field))).draw();
      // var TablesNumber = `${dtInstance.table().node().id} `;
      // if (TablesNumber == "Table1") {
      //   dtInstance.column(0).search(JSON.stringify(field)).draw();
      // }
    });

  }

  ClearSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search('').draw();
    });
    this.SearchForm.reset();
  }

  uploadExcel(): void {
    const dialogRef = this.dialog.open(AddBusinessInsurerDocsComponent, {
      width: '80%',
      maxWidth: '99vw',
      disableClose: true,
      panelClass: 'excel-dump-dialog', 
      data: { companyArr: this.company }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result.Is_Refresh--",result);
      if (result && result.Is_Refresh === 'Yes') {
        //this.Reload();
        if(result['fileUploadedName']){
          this.UploadDocFileName = result['fileUploadedName'];
          console.log(result['fileUploadedName']);
          this.api.IsLoading();
          this.fileProcessAfterUpload(this.UploadDocFileName);
        }else{
          this.UploadDocFileName = '';
        }
      }else {
        this.UploadDocFileName = '';
      }
    });
  }

  fileProcessAfterUpload(FileName){

    const formData = new FormData();
    formData.append('User_Id', this.api.GetUserId());
    formData.append('type', this.api.GetUserData('Type'));
    formData.append('DocFileName', FileName);
     // Send HTTP POST request
     this.bmsApi.HttpPostType('../v2/business_master/BusinessInsurerDocs/processUploadedExcel', formData).then((result) => {
        this.api.HideLoading();
        if (result['Status'] == true) {
          this.ClearSearch();
          this.api.Toast('Success', result['Message'])
        }else{
          this.api.Toast('Warning', result['message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast('Error', 'File process extract failed. Please try again.');
      });
  }

  viewBusinessExtract(businessCompanyDumpId): void {
    const dialogRef = this.dialog.open(ViewBusinessExtractComponent, {
      width: '80%',
      maxWidth: '99vw',
      disableClose: true,
      panelClass: 'excel-dump-dialog', 
      data: { Id: businessCompanyDumpId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.Is_Refresh === 'Yes') {
        this.Reload();
      }
    });
  }

  hitCron() {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
          // Add any other headers if necessary
        })
    };

    this.api.IsLoading();
    this.http
        .post<any>(  // Using 'any' for response type
            `${environment.apiUrlBmsBase}/../v2/business_master/CronAutoBusinessInsurer/QCBusinessInsurer`,
            {}, 
            httpOptions
        )
        .subscribe(
            (result) => {
              this.api.HideLoading();
              this.ClearSearch();
              this.api.Toast('Success', result['message'])
              // Log the response to the console
              console.log('API Response----:', result);
            },
            (error) => {
              this.api.HideLoading();
              // Log any errors that occur during the request
              console.error('API Error---:', error);
            }
        );
  }


  hitCronMapped() {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
          // Add any other headers if necessary
        })
    };

    this.http
        .post<any>(  // Using 'any' for response type
            `${environment.apiUrlBmsBase}/../v2/business_master/CronAutoBusinessInsurer/mappedBusinessInsurerData`,
            {}, 
            httpOptions
        )
        .subscribe(
            (result) => {
              this.api.Toast('Warning', result['message'])
              // Log the response to the console
              console.log('API Response----:', result);
            },
            (error) => {
              // Log any errors that occur during the request
              console.error('API Error---:', error);
            }
        );
  }



  //MAPPING FILEDS
 
  mappingInsurerModel(): void {
    console.log("Opening dialog with company data:", this.company);
  
    const dialogRef = this.dialog.open(BusinessMapModalComponent, {
      width: '80%',
      maxWidth: '99vw',
      disableClose: true,
      panelClass: 'excel-dump-dialog',
      data: { company: this.company }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result.Is_Refresh == 'Yes') {
        this.Reload();
      }
    });
  }

  deleteExcelBulkRecord(BusinessInsurerDumpId) {
    if (confirm("Are you sure you want to delete this record?")) {
      const formData = new FormData();
      formData.append('User_Id', this.api.GetUserId());
      formData.append('Delete_Type','Bulk');
      formData.append('type', this.api.GetUserData('Type'));
      formData.append('Id', BusinessInsurerDumpId); // Sending only ID
  
      // Send HTTP POST request
      this.bmsApi.HttpPostType('../v2/business_master/BusinessInsurerDocs/deleteUploadedExcelRecord', formData)
        .then((result) => {
          this.api.HideLoading();
          if (result['Status'] == true) {
            this.ClearSearch();
            this.api.Toast('Success', result['Message']);
          } else {
            this.api.Toast('Warning', result['Message']);
          }
        })
        .catch((err) => {
          this.api.HideLoading();
          this.api.Toast('Error', 'Failed to delete the record. Please try again.');
        });
    }
  }




}
