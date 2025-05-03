import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";

class ColumnsObj {
  id: string;
  SrNo: string;
  type: string;
  Name: string;
  Quantity: string;
  Add_stamp: string;
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
  selector: "app-inventory-log",
  templateUrl: "./inventory-log.component.html",
  styleUrls: ["./inventory-log.component.css"],
})
export class InventoryLogComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  loadAPI: Promise<any>;

  ActionType: any = "";
  searchform: FormGroup;
  isSubmitted = false;
  id: any;
  category_Id: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,

    private dialogRef: MatDialogRef<InventoryLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.Id;
    this.category_Id = this.data.category;
  }

  ngOnInit() {
    this.Get();
  }

  // Get() {
  //   alert();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       Authorization:  this.api.GetToken(),
  //     }),
  //   };

  //   const that = this;
  //   this.dtOptions = {
  //     pagingType: "full_numbers",
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //  dom: 'ilpftripl',
  //     ajax: (dataTablesParameters: any, callback) => {
  //       that.http
  //         .post<DataTablesResponse>(environment.apiUrl + '/AssetsManagement/ShowInventoryLog?User_Id=' + this.api.GetUserData("Id") +
  //           "&User_Type=" +
  //           this.api.GetUserType() +
  //           "&Action=" +
  //           this.ActionType + "&id=" + this.id, dataTablesParameters, httpOptions
  //         ).subscribe(resp => {
  //           that.dataAr = resp.data;
  //           // console.log(that.dataAr);
  //           if (that.dataAr.length > 0) {
  //           }
  //           callback({
  //             recordsTotal: resp.recordsTotal,
  //             recordsFiltered: resp.recordsFiltered,
  //             data: []
  //           });
  //         });
  //     },
  //   };
  // }

  Get() {
    // console.log(this.category_Id);
    this.api.IsLoading();

    this.api
      .HttpGetType("AssetsManagement/ShowInventoryLog?id=" + this.id)
      .then(
        (result) => {
          this.api.HideLoading();

          // // console.log(result);

          if (result["status"] == 1) {
            this.dataAr = result["data"];
            // console.log(this.dataAr);
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
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
