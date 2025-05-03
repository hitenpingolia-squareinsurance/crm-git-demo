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
import { PartnerDirectoryPopupComponent } from "../partner-directory-popup/partner-directory-popup.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Name: string;
  emp_id: string;
  Email: string;
  Mobile: string;
  Department: string;
  Branch: string;
  reportin_manager: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-pos-view",
  templateUrl: "./pos-view.component.html",
  styleUrls: ["./pos-view.component.css"],
})
export class PosViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  dtElements: any;
  SearchForm: FormGroup;
  Masking: any = "Temp";
  MaskingType: any = "Temp";

  isSubmitted = false;
  Is_Export: number;
  isShown: boolean;

  hasAccess: boolean = true;
  errorMessage: string = '';
  // activePage: any;

  // flagArray:any=[];

  ShowSelfCost: string;

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

  //===== SHOW HIDE TOTAL COST =====//
  //===== SHOW HIDE TOTAL COST =====//
  // ShowHideCost(Index:any, Type:any, Value:any){

  //   if(Type == 'Mobile'){
  //     this.flagArray[Index]['ShowSelfCost'] = Value;
  //   }
  //  }

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

      if (TablesNumber == "kt_datatable") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  ShowMaskingField(i) {
    this.Masking = i;
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
                "/PosDirectory/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp: any) => {
            var resp = JSON.parse(this.api.decryptText(resp.response));
            that.hasAccess = true;
            that.dataAr = resp.data;
            
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            
          
            // this.flagArray[this.activePage] = that.dataAr['Id'];

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

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }

  EmpDetails(id: any, subpos: number) {
    const encodedId = btoa(id);
    const dialogRef = this.dialog.open(PartnerDirectoryPopupComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
      data: {
        subpos: subpos,
        id: encodedId,
      },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
