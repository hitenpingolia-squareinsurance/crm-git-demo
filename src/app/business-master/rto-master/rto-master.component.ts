import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { RtoAddComponent } from './rto-add/rto-add.component';
import { RtoUpdateComponent } from './rto-update/rto-update.component';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-rto-master',
  templateUrl: './rto-master.component.html',
  styleUrls: ['./rto-master.component.css']
})
export class RtoMasterComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  AddFieldForm: FormGroup;
  state: any[];
  hasAccess: boolean = true;
  errorMessage: string = "";
  
  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  }

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

    this.AddFieldForm = this.formBuilder.group({
      rto: [''],
      state: [''],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.Get();
    this.getstate();
  }

  getstate() {
    const formData = new FormData();

    this.api
      .HttpPostTypeBms('../v2/business_master/RTO/getstate', formData)
      .then(
        (resp) => {
          this.state = resp['data'].map(item => ({ Id: item.Id, Name: item.Name }));
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  SearchData() {
    var field = this.AddFieldForm.value;

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(field))).draw();
    });
  }

  ClearSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search('').draw();
    });

    this.AddFieldForm.reset();
  }

  Get() {
    this.api.IsLoading();

    
    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v2/business_master/RTO/RTOTable?User_Id="  +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code")),
            dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res:any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

          if (resp.status === "urlWrong") {
            that.hasAccess = false;
            that.errorMessage = resp.msg;
            return;
          }
          that.hasAccess = true;

            that.dataAr = resp.data;
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
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }


  dailog() {
    const dialogRef = this.dialog.open(RtoAddComponent, {

      width: "50%",
      height: "60%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(RtoUpdateComponent, {

      width: "50%",
      height: "60%",
      disableClose: true,
      data: {
        id: id,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

}
