import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { trim } from "jquery";

class ColumnsObj {
  SrNo: string;
  Id: string;
  pan_number: string;
  pan_status: string;
  is_deleted: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-pan-info",
  templateUrl: "./view-pan-info.component.html",
  styleUrls: ["./view-pan-info.component.css"],
})
export class ViewPanInfoComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted: boolean = false;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  totalCount: number;
  currentUrl: string;
  Is_Export: number;
  requestPan: any;

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    this.Get();
  }

  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  SearchData() {
    this.isSubmitted = true;

    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      const post = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        SearchValue: trim(fields["SearchValue"]),
      };

      // console.log(fields);
      this.Is_Export = 0;
      this.dataAr = [];

      this.datatableElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table1") {
          dtInstance.column(0).search(this.api.encryptText(JSON.stringify(fields))).draw();

          // dtInstance.column(0).search(JSON.stringify(fields)).draw();
        }
      });
    }
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+this.api.GetToken(),
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
              "/PospManegment/viewPan?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Pos_Type=" +
              this.api.GetUserData("pos_type") +
              "&User_Code=" +
              this.api.GetUserData("Code") +
              "&url=" +
              this.currentUrl),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (res.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = res.msg;
              return;
            }
            that.hasAccess = true;
            that.dataAr = resp.data;
            if (that.dataAr.length > 0) {
              that.totalCount = resp.recordsFiltered;
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

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  changestatus(id: any, pannum: any) {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("pannum", pannum);
    formData.append("Id", id);

    var Confirms = confirm("Are You Sure ?");
    if (Confirms == true) {
      this.api.HttpPostType("PospManegment/updateIsdeleted", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Reload();

            this.api.Toast("Success", result["msg"]);
          } else {
            this.api.Toast("Warning", result["msg"]);
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

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
}
