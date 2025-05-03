import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders,HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductUpdateComponent } from '../product-update/product-update.component';
import { ActivatedRoute, Router } from '@angular/router';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit() {
    this.Get();
    this.currentUrl = this.router.url;
  }

  Get() {
    this.api.IsLoading();

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl + '/ProductMaster/product?User_Id=' +
            this.api.GetUserData("Id") +
            '&User_Type=' +
            this.api.GetUserType() +
            '&url=' +
            this.currentUrl +
            '&Action=' +
            this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
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
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
        this.Reload();
    });
  }

  update(id: any) {
    const dialogRef = this.dialog.open(ProductUpdateComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: id }
    })

    dialogRef.afterClosed().subscribe(result => {
        this.Reload();
    });
  }

}
