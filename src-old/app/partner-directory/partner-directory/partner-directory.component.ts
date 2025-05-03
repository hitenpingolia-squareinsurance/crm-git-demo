
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { PartnerDirectoryPopupComponent } from "../partner-directory-popup/partner-directory-popup.component";

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
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-partner-directory',
  templateUrl: './partner-directory.component.html',
  styleUrls: ['./partner-directory.component.css']
})
export class PartnerDirectoryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  dataAr_Posp: ColumnsObj[];
  DataAr: ColumnsObj[];
  DataAr_Posptable: ColumnsObj[];
  SearchForm: FormGroup;

  Is_Export: number;
  Masking: any = "Temp";
  Partner_ID: any;
  UrlSegment: any;
  subpos: number;
  TotalData: number;
  reportingManagerName: string;
  reportingManagerId: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<PartnerDirectoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.Partner_ID = params.get('id');
      this.UrlSegment = this.router.url;
    });

    if (this.data) {
      this.UrlSegment = this.data.urlsegment;
      this.Partner_ID = this.data.id;
      this.subpos = this.data.subpos;
    }
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
    this.Masking = 'TempMobile';

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.Masking = 'TempMobile';

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData(event: any) {
    this.Masking = 'TempMobile';

    this.Is_Export = 0;
    this.dataAr = [];
    this.DataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "kt_datatable") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }


  CloseModel() {
    this.dialogRef.close();
  }


  Get() {
    this.Masking = 'TempMobile';
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        const baseUrl = environment.apiUrl + "/PartnerDirectory/partnerDetails?User_Id=" + this.api.GetUserData("Id") + "&User_Type=" + this.api.GetUserType();
        const params = dataTablesParameters;
        const httpOptions = {
          headers: new HttpHeaders({
            Authorization: "Bearer " + this.api.GetToken(),
          }),
        };
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(baseUrl), params, this.api.getHeader(environment.apiUrl)).subscribe((res: any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));
          that.dataAr = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        }); 
      },
    };
  }



  EmpDetails(id: any, subpos: number) {
    const encodedId = btoa(id);
    const dialogRef = this.dialog.open(PartnerDirectoryPopupComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
      data: {
        subpos: subpos,
        id: encodedId,
      },
    });

    dialogRef.afterClosed().subscribe(() => { });
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }
}

