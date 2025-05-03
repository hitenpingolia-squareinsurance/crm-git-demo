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

import { EditBrokerComponent } from './edit-broker/edit-broker.component';
import { AddBrokerComponent } from './add-broker/add-broker.component';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}


@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  hasAccess: boolean = true;
  errorMessage: string = "";
  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

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
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v2/business_master/Brokers/broker?User_Id="  +
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
        this.hasAccess = false;
        this.errorMessage = resp.msg;
        return;
      }
      this.hasAccess = true;

            that.dataAr = resp['data'];
            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
          this.api.HideLoading();
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
    const dialogRef = this.dialog.open(AddBrokerComponent, {

      width: "60%",
      height: "80%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(EditBrokerComponent, {

      width: "60%",
      height: "80%",
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
