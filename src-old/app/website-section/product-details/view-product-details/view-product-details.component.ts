import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { AddProductDetailsComponent } from "../add-product-details/add-product-details.component";
import { trim } from "jquery";


class ColumnsObj {
  id: string;
  SrNo: string;
  Id: string;
  Title: string;
  Date: string;
  Image: string;
  Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-product-details",
  templateUrl: "./view-product-details.component.html",
  styleUrls: ["./view-product-details.component.css"],
})
export class ViewProductDetailsComponent implements OnInit {
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

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {

    this.SearchForm = this.formBuilder.group({
      Search: [""],
    });


  }

  ngOnInit() {
    this.Get();
  }



  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  ClearSearch() {
    this.SearchForm.reset();
    this.Reload();
    this.ResetDT();
  }
  //===== SEARCH DATATABLE DATA =====//
  // SearchData() {
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     var TablesNumber = `${dtInstance.table().node().id}`;

  //     if (TablesNumber == "Table1") {

  //       var fields = this.SearchForm.value;

  //       var query = {
  //         Search: trim(fields["Search"]),
  //       };

  //       dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
  
        
  //     }
  //   });
  // }

  

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      // if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;

              var query = {
                Search: trim(fields["Search"]),
              };
        
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();

        // var fields = this.searchForm.value;

        // var query = {
        //   SearchValue : fields['SearchValue'],
        // }
        // dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      // }
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
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/WebsiteSection/ViewProductDetails?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType()),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp:any) => {
            var resp = JSON.parse(this.api.decryptText(resp.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
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

  AddProductDetailsComponent(ActionType: any, id: any) {
    const dialogRef = this.dialog.open(AddProductDetailsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { ActionType: ActionType, FormId: id },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.Get();
    });
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
      this.api.HttpPostType("WebsiteHealthSection/DeleteData", formData).then(
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
  //Active Inactive REQUEST
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
      this.api
        .HttpPostType("WebsiteHealthSection/UpdateActiveInactive", formData)
        .then(
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
}
