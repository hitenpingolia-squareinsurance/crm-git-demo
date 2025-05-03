import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";

import { AddInsurerComponent } from '../add-insurer/add-insurer.component';
import { UpdateInsurerComponent } from '../update-insurer/update-insurer.component';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-detail-insurer",
  templateUrl: "./detail-insurer.component.html",
  styleUrls: ["./detail-insurer.component.css"]
})
export class DetailInsurerComponent implements OnInit {

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

  dropdownSettingsmultiselect: {
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

    this.Get();

  }

  ngOnInit() {

  }


  Get() {
    this.api.IsLoading();

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: "Bearer " + this.api.GetToken(),
    //   }),
    // };

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
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v3/pay-in/InsurerCheckgridEmployee/GridData?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code")),
            dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            this.dataAr = resp.data;
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
      dtInstance.column(0).search(JSON.stringify(field)).draw();
    });
  }

  ClearSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search('').draw();
    });

    this.AddFieldForm.reset();
  }

  dailog() {
    const dialogRef = this.dialog.open(AddInsurerComponent, {

      width: "60%",
      height: "60%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(UpdateInsurerComponent, {

      width: "60%",
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
