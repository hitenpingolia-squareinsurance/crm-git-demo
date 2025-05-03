import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { FormBuilder } from "@angular/forms";
import { AddLangComponent } from "./add-lang/add-lang.component";

class ColumnsObj {
  Id: any;
  key_name: any;
  english: any;
  hindi: any;
  bengali: any;
  marathi: any;
  telugu: any;
  tamil: any;
}


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: 'app-language-report',
  templateUrl: './language-report.component.html',
  styleUrls: ['./language-report.component.css']
})
export class LanguageReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];
  ActivePage: string = "Default";
  filterFormData: any = [];
  Is_Export: any = 0;
  ActionType: string;
  currentUrl: string;
  urlSegment: string;
  urlSegmentRoot: string;
  dialogRef: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != undefined) {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != undefined) {
      this.urlSegmentRoot = splitted[1];
    }
  }

  ngOnInit() {
    this.datatableFunction();

  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== DATATABLE FUNCTION =====//
  datatableFunction() {
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
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/lang-localizations/Languagelocalizations/gridata?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&url=" +
            this.currentUrl +
            "&PageType=Reports" +
            "&Action=" +
            this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;
            that.FilterData = resp.FilterPolicyData;

            if (that.dataAr.length > 0) {
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

  update(type: any, data: any) {
    const dialogRef = this.dialog.open(AddLangComponent, {

      width: '70%',
      height: 'auto',

      data: {
        id: data.Id,
        key_name: data.key_name,
        english: data.english,
        hindi: data.hindi,
        bengali: data.bengali,
        marathi: data.marathi,
        telugu: data.telugu,
        tamil: data.tamil,
        type: type
      }
    });



    dialogRef.afterClosed().subscribe((result) => {
      this.datatableFunction();
      this.ResetDT();
    });
  }





  // delete(type:any,Id:any)                            
  // {

  //   const formData = new FormData();
  // //this.api.IsLoading();

  //   formData.append("id", Id);  
  //     this.api.HttpPostType('v2/language/delete', formData).then(
  //       (resp) => {
  //         this.api.HideLoading();
  //         if (resp['status'] == 'Success') {

  //           this.datatableFunction();
  //           this.api.Toast('Warning', resp['msg']);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast("Error", "Failed to delete language");
  //       }
  //     )

  // }


  delete(type: any, Id: any) {

    if (confirm("Are you sure delete the Record ?") == true) {
      const formData = new FormData();
      formData.append("id", Id);

      this.api.IsLoading();

      this.api.HttpPostType('lang-localizations/Languagelocalizations/delete', formData).then(
        (resp) => {
          this.api.HideLoading();
          if (resp['status'] == 'Success') {
            // Remove the deleted item from the frontend (dataAr)
            this.dataAr = this.dataAr.filter(item => item.Id !== Id);

            // Optionally, you can also re-fetch the data from the server
            // this.datatableFunction();

            this.api.Toast('Warning', resp['msg']);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Error", "Failed to delete language");
        }
      );
    }

  }

}

