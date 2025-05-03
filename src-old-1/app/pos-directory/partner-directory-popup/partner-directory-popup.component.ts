// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-partner-directory-popup',
//   templateUrl: './partner-directory-popup.component.html',
//   styleUrls: ['./partner-directory-popup.component.css']
// })
// export class PartnerDirectoryPopupComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }



import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

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
  agent_id : any;
  countMapping : any;

}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-partner-directory-popup',
  templateUrl: './partner-directory-popup.component.html',
  styleUrls: ['./partner-directory-popup.component.css']
})
export class PartnerDirectoryPopupComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr_Posp: ColumnsObj[];

  loadAPI: Promise<any>;

  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;
  id: any;
  name: any;
  empid: any;
  mobile: any;
  branch: any;
  profile: any;
  email: any;
  rmid: any;
  rmname: any;
  designation: any;
  dataArr: any;
  RMid: any;
  records: any;
  reportingid: any;
  departmentname: any;
  Masking: any = "Temp";
  Partner_ID: any;
  subpos: any;
  DataAr_Posptable: any;
  reportingManagerName: any;
  reportingManagerId: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PartnerDirectoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.id = 730;
    this.Partner_ID = this.data.id;
    this.subpos = this.data.subpos;
  }

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
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr_Posp = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }



  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
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
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/PartnerDirectory/partnerDetails?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType()
            + "&emp_id=" + this.id
            + "&Partner_ID=" + this.Partner_ID
            + "&subpos=" + this.subpos)
            ,
            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp: any) => {
            that.records = resp.recordsTotal;

            this.dataAr_Posp = resp.data || [];
            this.DataAr_Posptable = resp.typedata || [];

            if (that.dataAr_Posp.length > 0) {
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


  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
