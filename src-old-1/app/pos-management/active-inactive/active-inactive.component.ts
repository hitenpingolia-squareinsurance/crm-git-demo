



import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormArray,
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


class ColumnsObj {
  SrNo: string;
  id: string;
  Name: string;
  Category: string;
  Item: string;
  Create_date: string;
  AssestId: string;
  status_check: string;
  ManegerId: string;
  DistributorId: string;
  Id: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}



@Component({
  selector: 'app-active-inactive',
  templateUrl: './active-inactive.component.html',
  styleUrls: ['./active-inactive.component.css']
})
export class ActiveInactiveComponent implements OnInit {

 
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  searchform: FormGroup;
  isSubmitted = false;
  dtElements: any;
  currentUrl: string;
  urlSegment: string;
  urlSegmentRoot: string;
  urlSegmentSub: string;
  RequestedQuote: any;
  UpdateAssestActionForm: FormGroup;
  assest_id: any;
  item_id: any;

  ClaimData: any;
  row: any;
  ItemDetails: any;
  ItemSpecifications: any;
  ItemStatus: any;
  ResponseData: any = '';
  itemModalShow = false;
  UniqueId: any = '';
  ItemName: any = '';
  ModelName: any = '';
  id: any;
  Item: any;
  Category: any;
  remarkform: FormGroup;
  status_check: any;
  CatId: any;
  dataArr: any[];
  Status: any;
  Rm_Id: any;
  Hod_Id: any;
  Maneger_Id: any;
  Distributor_id: any;
  Dataresult: any;
  ProductId: { Id: any, Name: any };
  Loginid: any;
  StatusRequest: any;
  loginPerson: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  eventdata: any;


  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {

  
    this.currentUrl = this.router.url;
 


  



  }


  ngOnInit() {
    this.Get();
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.eventdata = event;
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

  get formControls() {
    return this.searchform.controls;
  }

  ClearSearch() {
    var fields = this.searchform.reset();
    // this.dataAr = [];
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
    // alert(this.api.GetUserData("type"));

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
               "/PospManegment/FetchUsersData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Url=" +
                this.urlSegment
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
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

  



  
}
