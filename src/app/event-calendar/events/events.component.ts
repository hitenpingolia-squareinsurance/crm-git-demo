import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditEventComponent } from "../edit-event/edit-event.component";
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
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"],
})
export class EventsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  currentUrl: string;
  ActionType: any = "";

  SearchForm: FormGroup;
  QuoteTypes: { Id: string; Name: string }[];
  statusData: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];
  // SearchForm: any;
  // SearchForm: any;
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.SearchForm = this.formBuilder.group({
      QuoteType: [""],
      status: [""],
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.fetchAllEmployeeData();
    this.currentUrl = this.router.url;
  }

  fetchAllEmployeeData() {
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
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Event/fetchAllEvents?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
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

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
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
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ActiveInactive(Id: any, Status: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", Id);
      formData.append("TableName", TableName);
      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("Event/UpdateActiveInactive", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
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

  //Delete REQUEST
  DeleteRequest(DeleteId: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", DeleteId);
      formData.append("TableName", TableName);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("Event/DeleteData", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  SendNotification(SendNot: any, id: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      // this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", id);
      formData.append("Value", SendNot);

      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      // this.api.IsLoading();

      this.api.HttpPostType("Event/SendEmail", formData).then(
        (result) => {
          // this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
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
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
  addEvent_today(type: any, id: any) {
    // alert(id);
    const dialogRef = this.dialog.open(EditEventComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { id: id, type: type, Event: "[]" },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }
}
