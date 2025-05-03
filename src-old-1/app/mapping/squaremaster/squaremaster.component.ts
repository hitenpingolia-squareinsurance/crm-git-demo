import { Component, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  Id: string;
  SrNo: string;
  Make: string;
  Model: string;
  Variant: string;
  cubic_capacity: string;
  seating: string;
  Survey_Status: string;
  fule: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-squaremaster",
  templateUrl: "./squaremaster.component.html",
  styleUrls: ["./squaremaster.component.css"],
})
export class SquaremasterComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};

  Company_Ar: any = [];
  PolicyType_Ar: any = [];
  TicketType_Ar: any = [];
  TicketStatus_Ar: any = [];

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.SearchForm = this.fb.group({
      // Ticket_Status: [''],
      // Ticket_Type: ['']
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit(): void {
    this.Get();
    this.FilterData();
  }

  FilterData() {}

  onItemSelect(item: any, type) {}
  onItemDeSelect(item: any, type) {}

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.dataAr = [];
    this.ResetDT();

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

  SearchBtn() {
    //// console.log(this.SearchForm.value);

    var fields = this.SearchForm.value;

    var query = {
      User_Id: this.api.GetUserData("Id"),
      User_Type: this.api.GetUserType(),

      // Company_Id : fields['Company_Id'],
      // PolicyType : fields['PolicyType'],
      Ticket_Type: fields["Ticket_Type"],
      Ticket_Status: fields["Ticket_Status"],
    };

    // console.log(query);

    this.Is_Export = 0;
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      //this.Is_Export = 1;
    });
  }

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
                "/mapping/RoleFetchSquareMasterData?User_Id=" +
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
              //that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      //columns: [
      //		{ data: 'Id' },
      //		{ data: 'Type' }

      //]
    };
  }
}
