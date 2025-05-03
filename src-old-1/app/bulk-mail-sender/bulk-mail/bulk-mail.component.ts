import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ApiService } from "src/app/providers/api.service";
import { environment } from "src/environments/environment";
import { MailFormComponent } from "../mail-form/mail-form.component";
import { DetailsComponent } from "../details/details.component";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-bulk-mail",
  templateUrl: "./bulk-mail.component.html",
  styleUrls: ["./bulk-mail.component.css"]
})

export class BulkMailComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.Get();
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
            this.api.additionParmsEnc(environment.apiUrlBmsBase + "/../v3/bulk/BulkMails/bulkMail?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&User_Code=" +
            this.api.GetUserData("Code")),
            dataTablesParameters,this.api.getHeader(environment.apiUrlBmsBase)
            
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
    const dialogRef = this.dialog.open(MailFormComponent, {
      width: "80%",
      height: "80%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  details_dailog(bulkId: any, type: any) {
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: {
        type: type,
        bulkId: bulkId
      }
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }


}
