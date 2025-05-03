
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PreInspectionEditpoupComponent } from '../pre-inspection-editpoup/pre-inspection-editpoup.component'
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
class ColumnsObj {
  Sno: string;
  Id: string;
  EmployeeName: string;
  Designation: string;
  PersonalEmail: string;
  OfficialEmail: string;
  PersonalMobile: string;
  OfficialMobile: string;
  Branch: string;
  OpsBranch: string;
  Status: string;
  Action: string;

}
@Component({
  selector: 'app-pre-inspection-model',
  templateUrl: './pre-inspection-model.component.html',
  styleUrls: ['./pre-inspection-model.component.css']
})
export class PreInspectionModelComponent implements OnInit {
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];


  currentUrl: string;
  ActionType: any = "";

  SearchForm: FormGroup;
  QuoteTypeVal: { Id: string; Name: string }[];
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,

  ) {
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm = this.formBuilder.group({
      QuoteType: [""],
      status: [""],
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.fetchAll();
    this.currentUrl = this.router.url;

  }


  fetchAll() {
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/PreInspection/fetchAll?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&url=" +
            this.currentUrl +
            "&Action=" +
            this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
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

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== FILTER DATA =====//
  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        var query = {
          QuoteType: fields["QuoteType"],
          status: fields["status"],
          SearchValue: fields["SearchValue"],
        };

        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      }
    });
  }
  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Reload();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }


  AddPre(type: any, id: any) {
    const dialogRef = this.dialog.open(PreInspectionEditpoupComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { type: type, id: id },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }



  ActiveInactive(Id: any, Status: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();
      const formData = new FormData();
      formData.append("Id", Id);
      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      this.api.IsLoading();
      this.api.HttpPostType("PreInspection/UpdateActiveInactive", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();

          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }


}
