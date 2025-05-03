import { Component, OnInit, ViewChild, QueryList, ViewChildren, } from '@angular/core';
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from "@angular/forms";

class ColumnsObj {
  Lob: string;
  CreatedDate: string;
  FullSrNo: string;
  SrStatus: string;
  CustomerName: string;
  CustomerMobile: string;
  AgentCode: string;
  AgentName: string;
  Remark: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
  EmployeeType: any;
}

@Component({
  selector: 'app-business-stuck-cases',
  templateUrl: './business-stuck-cases.component.html',
  styleUrls: ['./business-stuck-cases.component.css']
})
export class BusinessStuckCasesComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;


  currentUrl: string;
  loginUserCode: any;
  RightsData: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loginUserCode = this.api.GetUserData("Code");
    this.currentUrl = this.router.url;
    this.Get();
  }

  SearchData(event: any) {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      const TablesNumber = `${dtInstance.table().node().id}`;
      const searchTerm = event.target.value.trim(); // Get the search term from the input
  
      if (TablesNumber == "example2") {
        // Apply search term to the DataTables search function
        dtInstance.search(searchTerm).draw();  // This will trigger the server-side filtering
      } else if (TablesNumber == "Table1") {
        dtInstance.search(searchTerm).draw();
      }
    });
  }





  Get() {
      // alert();
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: this.api.GetToken(),
        }),
      };
  
      // console.log(this.currentUrl);
      let ApiUrl = "/BusinessStuckCases/GetData?User_Id=";
  
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
              environment.apiUrl +
                ApiUrl +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&url=" +
                this.currentUrl,
              dataTablesParameters,
              httpOptions
            )
            .subscribe((resp) => {
  
              that.dataAr = resp.data;
  
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
                FilterPolicyData: [],
              });
            });
        },
      };
    }

}
