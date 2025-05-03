import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";

import { AddBranchComponent } from './add-branch/add-branch.component';
import { UpdateBranchComponent } from './update-branch/update-branch.component';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-company-branch',
  templateUrl: './company-branch.component.html',
  styleUrls: ['./company-branch.component.css']
})
export class CompanyBranchComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  AddFieldForm: FormGroup;
  company: any[];
  active: any[];
  checkBox: any[];
  status: any[];
  type: any[];
  hasAccess: boolean = true;
  errorMessage: string = "";
  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownStatus: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
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
    };

    this.dropdownStatus = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      company: [''],
      checkbox: [''],
      status: [''],
    });

  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.Get();
  }

  
//old
  // Get() {
  //   this.api.IsLoading();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       Authorization: this.api.GetToken(),
  //     }),
  //   };

  //   const that = this;
  //   this.dtOptions = {
  //     pagingType: "simple_numbers",
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //     searching: true,
  //     ordering: false,
  //     // dom: "ilpftripl",
  //     ajax: (dataTablesParameters: any, callback) => {
  //       that.http
  //         .post<DataTablesResponse>(
  //           environment.apiUrlBmsBase + "/../v2/business_master/CompanyBranch/GridData?User_Id=" +
  //           this.api.GetUserData("Id") +
  //           "&User_Type=" +
  //           this.api.GetUserType() +
  //           "&User_Code=" +
  //           this.api.GetUserData("Code"),
  //           dataTablesParameters,
  //           httpOptions
  //         )
  //         .subscribe((resp) => {
  //           that.dataAr = resp.data;
  //           this.api.HideLoading();
  //           callback({
  //             recordsTotal: resp.recordsTotal,
  //             recordsFiltered: resp.recordsFiltered,
  //             data: [],
  //           });
  //         });
  //     },
  //   };
  // }

  Get() {
    this.api.IsLoading();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ this.api.GetToken(),
      }),
    };

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
            this.api.additionParmsEnc(environment.apiUrl + "/reports/BussinessReport/CompanyBranch?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code")),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
            console.log(res);
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

  dailog() {
    const dialogRef = this.dialog.open(AddBranchComponent, {

      width: "40%",
      // height: "70%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(UpdateBranchComponent, {

      width: "40%",
      // height: "70%",
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
