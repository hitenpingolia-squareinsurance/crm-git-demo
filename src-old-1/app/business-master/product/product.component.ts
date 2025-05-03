import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { AddProductComponent } from './add-product/add-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';

import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  company: any[];
  buttonDisable = false;
  AddFieldForm: FormGroup;
  isSubmitted = false;
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

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      company: [''],
    });

  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.Get();
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
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v2/business_master/CPAMaster/getTable?User_Id="  +
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
            this.company = resp['company'].map(item => ({ Id: item.Id, Name: item.Name }));
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

  SearchData() {
    var field = this.AddFieldForm.value;
    var company = field['company'];
    const idd = company[0]['Id'];

    var query = {
      Company_Id: company[0]['Id'],
    }

     this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      //this.Is_Export = 1;
    });
  }

  ClearSearch(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search('').draw();
    });

    this.AddFieldForm.reset();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }
  dailog() {
    const dialogRef = this.dialog.open(AddProductComponent, {

      width: "80%",
      height: "80%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  onClose() {
    document.getElementById('close').click();
  }

  update(id: any, com: any) {
    const dialogRef = this.dialog.open(UpdateProductComponent, {

      width: "80%",
      height: "80%",
      disableClose: true,
      data: {
        id: id,
        com: com
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }
}
