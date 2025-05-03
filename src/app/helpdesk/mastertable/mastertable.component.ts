import { DataTableDirective } from "angular-datatables";
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
import { MasterdataComponent } from "../masterdata/masterdata.component";

class ColumnsObj {
  SrNo: string;
  id: string;
  Name: string;
  Category: string;
  Item: string;
  Create_date: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-mastertable",
  templateUrl: "./mastertable.component.html",
  styleUrls: ["./mastertable.component.css"],
})
export class MastertableComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";

  loadAPI: Promise<any>;

  ActionType: any = "";
  searchForm: FormGroup;
  isSubmitted = false;
  dtElements: any;
  Is_Export: number;

  filterFormData: any[];
  FuleData: any[];

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.searchForm = this.formBuilder.group({
      // SearchValue: [''],
      type: [""],
      make: [""],
      modal: [""],
      variant: [""],
      cubic_capicity: [""],
      fule_type: [""],
    });
  }

  ngOnInit() {
    this.Get();
    this.GetFuleType();
  }

  GetFuleType() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "SquareMaster/GetFuelType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.FuleData = result["Data"];
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

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  // get formControls() {
  //   return this.searchform.controls;
  // }

  // ClearSearch() {
  //   var fields = this.searchform.reset();
  //   // this.dataAr = [];
  //   this.ResetDT();
  // }

  // ResetDT() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.search("").column(0).search("").draw();
  //   });
  // }

  Get() {
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
                "/SquareMaster/Fetchdata?User_Id=" +
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

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.searchForm.value;

        var query = {
          // SearchValue: fields['SearchValue'],
          type: fields["type"],
          SearchMake: fields["make"],
          SearchModel: fields["modal"],
          SearchVariant: fields["variant"],
          SearchCC: fields["cubic_capicity"],
          SearchFuleType: fields["fule_type"],
        };
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      }
    });
  }

  ClearSearch() {
    var fields = this.searchForm.reset();
    // this.Get();
    this.ResetDT();
  }

  ForApproval(type: any, company: any, types: any) {
    const dialogRef = this.dialog.open(MasterdataComponent, {
      width: "60%",
      height: "65%",
      // disableClose: true,
      data: { Id: type, company: company, type: types },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
      // console.log(result);

      // this.SearchBtn();
    });
  }
}
