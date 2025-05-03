import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PlanFormComponent } from '../plan-form/plan-form.component';
import { PlanTypeComponent } from '../plan-type/plan-type.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders,HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ViewFormComponent } from '../view-form/view-form.component';
import { PlanUpdateComponent } from '../plan-update/plan-update.component';
import { ActivatedRoute, Router } from '@angular/router';



class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}



@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
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
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    this.api.IsLoading();
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl + '/Plan_Title/GridData?User_Id=' +
            // 'https://crm.squareinsurance.in/backuplivelife_uat/api/Plan_Title/PlanForm_fetch?User_Id=' +
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
            this.api.HideLoading();
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

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  dailog() {
    const dialogRef = this.dialog.open(PlanFormComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe(result => {
        this.Reload();
    });
  }

  dailog2() {
    const dialogRef = this.dialog.open(PlanTypeComponent, {
      width: "70%",
      height: "80%",
      disableClose: true,
    })
  }

  view(id){
    const dialogRef = this.dialog.open(ViewFormComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: id }
    })

    dialogRef.afterClosed().subscribe(result => {
        this.Reload();
    });
  }

  update(id) {
    const dialogRef = this.dialog.open(PlanUpdateComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: id }
    });
  
    dialogRef.afterClosed().subscribe(result => {
        this.Reload();
    });
  }
}
