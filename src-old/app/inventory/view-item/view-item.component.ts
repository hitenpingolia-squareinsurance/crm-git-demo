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
import { EditQuantityComponent } from "../../AssetsManagement/edit-quantity/edit-quantity.component";
import { ItemDetailsComponent } from "../item-details/item-details.component";
import { trim } from "jquery";

class ColumnsObj {
  SrNo: string;
  Id: string;
  type: string;
  policyno: string;
  vehicleno: string;
  engineno: string;
  clientname: string;
  clientcontact: string;
  expirydate: string;
  delete_status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-item",
  templateUrl: "./view-item.component.html",
  styleUrls: ["./view-item.component.css"],
})
export class ViewItemComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  SearchForm: FormGroup;
  // isSubmitted = false;
  dtElements: any;

  isSubmitted = false;
  Is_Export: number;
  CategoryData: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.formBuilder.group({
      search: [""],
      item_status: [""],
      item_category: [""],
      
    });

    this.viewCategory();
  }

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
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

  //===== SEARCH DATATABLE DATA =====//
  // SearchData(event: any) {
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     var TablesNumber = `${dtInstance.table().node().id}`;

  //     if (TablesNumber == "Table1") {
  //       dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
  //     }
  //   });
  // }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        var query = {
          SearchAr: trim(fields["search"]),
          item_status: trim(fields["item_status"]),
          item_category: trim(fields["item_category"]),
        };
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        // var fields = this.searchForm.value;
        // var query = {
        //   SearchValue : fields['SearchValue'],
        // }
        // dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
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
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Inventory/ViewItem?User_Id=" +
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

  // AddProductDetailsComponent(type:any , id:any) {
  //   const dialogRef = this.dialog.open(AddDocsWalletComponent, {
  //     width: "50%",
  //     height: "80%",
  //     disableClose: true,
  //     data: { type: type, id: id},
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     this.Get();
  //     this.ResetDT();
  //   });
  // }

  //Delete REQUEST
  // DeleteRequest(DeleteId: any, status: any) {

  //   var confirms = confirm("Are You Sure..!");
  //   if (confirms == true) {
  //     this.api.IsLoading();

  //     const formData = new FormData();

  //     formData.append('Id', DeleteId);
  //     formData.append('status', status);

  //     formData.append('UserId', this.api.GetUserData("Id"));
  //     formData.append('UserType', this.api.GetUserType());

  //     this.api.IsLoading();
  //     this.api.HttpPostType('DocsWallet/DeleteStatus', formData).then((result:any) => {
  //       this.api.HideLoading();
  //       // console.log(result);

  //       if (result['status'] == true) {
  //         this.api.Toast("Warning", result["msg"]);
  //         this.ResetDT();
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

  // Active Inactive REQUEST
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

  HandoverRequest(ItemId, Status) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("ItemId", ItemId);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());
      formData.append("Status", Status);

      this.api.IsLoading();
      this.api.HttpPostType("Inventory/HandoverRequest", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == 1) {
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

  GetQuantityUpdate(type: any) {
    const dialogRef = this.dialog.open(EditQuantityComponent, {
      width: "70%",
      height: "70%",
      // disableClose: true,
      data: { Id: type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      // this.Reload();
      this.Reload();
      // this.filterData();
    });
  }

  ItemDetails(ItemId) {
    const dialogRef = this.dialog.open(ItemDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: ItemId },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }




  viewCategory() {
   
    const formData = new FormData();
    this.api.IsLoading();
    this.api.HttpPostType("Inventory/ViewCategoryData", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          console.log(result['data']);
          this.CategoryData = result["data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

   

}
