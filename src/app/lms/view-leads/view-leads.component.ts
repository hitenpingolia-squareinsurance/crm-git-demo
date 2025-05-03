import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { AddLeadsComponent } from "../add-leads/add-leads.component";
import { LeadsDetailsComponent } from "../leads-details/leads-details.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  type: string;
  category_name: string;
  title: string;
  Quotes_Url: string;
  editor: string;
  image: string;
  insert_date: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-leads",
  templateUrl: "./view-leads.component.html",
  styleUrls: ["./view-leads.component.css"],
})
export class ViewLeadsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  // searchform: FormGroup;
  // isSubmitted = false;
  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  Get() {
    // alert(this.api.GetUserData("type"));
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    const that = this;
    this.dtOptions = {
      //pagingType: false,
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/MyAccountLeads/FetchLeads?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            // console.log(that.dataAr);
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

  Addleads() {
    const dialogRef = this.dialog.open(AddLeadsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      // data: { type: type, id: id, actiontype: actiontype},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.ResetDT();
      this.Get();
    });
  }

  DetailsLeads(id: any, leadid: any) {
    const dialogRef = this.dialog.open(LeadsDetailsComponent, {
      width: "60%",
      height: "60%",
      disableClose: false,
      data: { id: id, leadid: leadid },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
    });
  }

  //Delete REQUEST

  // DeleteRequest(DeleteId: any, TableName: any) {

  //   var confirms = confirm("Are You Sure..!");
  //   if (confirms == true) {
  //     this.api.IsLoading();

  //     const formData = new FormData();

  //     formData.append('Id', DeleteId);
  //     formData.append('TableName', TableName);
  //     formData.append('UserId', this.api.GetUserData("Id"));
  //     formData.append('UserType', this.api.GetUserType());

  //     this.api.IsLoading();
  //     this.api.HttpPostType('WebsiteHealthSection/DeleteData', formData).then((result:any) => {
  //       this.api.HideLoading();
  //       // console.log(result);

  //       if (result['status'] == true) {
  //         this.api.Toast("Success", result["msg"]);
  //         this.Reload();
  //       } else {
  //         const msg = 'msg';
  //         //alert(result['message']);
  //         this.api.Toast('Warning', result['msg']);
  //       }

  //     }, (err) => {
  //       // Error log
  //       // // console.log(err);
  //       this.api.HideLoading();
  //       const newLocal = 'Warning';
  //       this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
  //       //this.api.ErrorMsg('Network Error :- ' + err.message);
  //     });
  //   }
  // }
  // //Active Inactive REQUEST

  // ActiveInactive(Id: any, Status: any, TableName: any) {

  //   var confirms = confirm("Are You Sure..!");
  //   if (confirms == true) {
  //     this.api.IsLoading();

  //     const formData = new FormData();

  //     formData.append('Id', Id);
  //     formData.append('TableName', TableName);
  //     formData.append('Status', Status);
  //     formData.append('UserId', this.api.GetUserData("Id"));
  //     formData.append('UserType', this.api.GetUserType());

  //     this.api.IsLoading();
  //     this.api.HttpPostType('WebsiteHealthSection/UpdateActiveInactive', formData).then((result:any) => {
  //       this.api.HideLoading();
  //       // console.log(result);

  //       if (result['status'] == true) {
  //         this.api.Toast("Success", result["msg"]);
  //         this.Reload();

  //       } else {
  //         const msg = 'msg';
  //         //alert(result['message']);
  //         this.api.Toast('Warning', result['msg']);
  //       }

  //     }, (err) => {
  //       // Error log
  //       // // console.log(err);
  //       this.api.HideLoading();
  //       const newLocal = 'Warning';
  //       this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
  //       //this.api.ErrorMsg('Network Error :- ' + err.message);
  //     });
  //   }
  // }
}
