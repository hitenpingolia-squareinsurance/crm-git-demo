import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  Id: string;
  Claim_Id: string;
  Claim_Creator: string;
  Claim_Manager: string;
  PolicyType: string;
  LossType: string;
  Intimated_To_Insurer: string;
  Survey_Status: string;
  Add_Stamp: string;
  SrNo: any;
  Status: any;
  Agent_Id: any;
  Name: any;
  Mobile_No: any;
  Email: any;
  Last_action_date: any;
  Employee: any;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-posp-report",
  templateUrl: "./posp-report.component.html",
  styleUrls: ["./posp-report.component.css"],
})
export class PospReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;
  Emps_Ar: any;
  Agents_Ar: any;
  dropdownSettings: any = {};
  LOB_dropdownSettings: any = {};

  SRLOB_Ar: any = [];
  Company_Ar: any = [];
  PolicyType_Ar: any = [];
  LossType_Ar: any = [];
  ClaimStatus_Ar: any = [];

  Is_Export: any = 0;
  AgentdropdownSettings: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    //selectAllText: 'Select All',
    //unSelectAllText: 'UnSelect All',
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.router.events.subscribe((value) => {
      //// console.log(value);
      //// console.log('current route: ', router.url.toString());
      if (router.url.toString() == "/manage-requests/claims") {
        this.ActivePage = "ManageRequests";
      } else {
        this.ActivePage = "Default";
      }
    });

    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      SRAgent_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      CurrentUser_Id: [""],
      SRStatus: [""],
      SRType: [""],
      SR_Source_Type: [""],
      //DateOrDateRange: [''],
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
    this.AgentdropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.LOB_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.SRLOB_Ar = [
      { Id: "0", Name: "Pending" },
      { Id: "1", Name: "Verified Docs" },
      { Id: "4", Name: "Under Training" },
      { Id: "2", Name: "Certified Pos" },
      { Id: "5", Name: "POSP/Advisors" },
      { Id: "7", Name: "Master Advisors" },
      { Id: "3", Name: "Incomplete" },
      { Id: "6", Name: "Rejected" },
    ];
  }

  ngOnInit(): void {
    this.Get();
    this.FilterData();
  }

  FilterData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Claim/FilterData?Page=Claim&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.Company_Ar = result["Company_Ar"];
            this.PolicyType_Ar = result["PolicyType_Ar"];
            this.LossType_Ar = result["LossType_Ar"];
            this.ClaimStatus_Ar = result["ClaimStatus_Ar"];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  onItemSelect(item: any, type) {}
  onItemDeSelect(item: any, type) {}

  SearchBtn() {
    //// console.log(this.SearchForm.value);

    var fields = this.SearchForm.value;

    var query = {
      User_Id: this.api.GetUserData("Id"),
      User_Type: this.api.GetUserType(),

      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],

      Emp_Id: fields["Emp_Id"],
      SRAgent_Type: fields["SRAgent_Type"],
      Agent_Id: fields["Agent_Id"],

      LOB: fields["SRLOB"],
      Product_Id: fields["Product_Id"],
      Company_Id: fields["Company_Id"],

      CurrentUser_Id: fields["CurrentUser_Id"],
      Source: fields["SR_Source_Type"],
      SR_Status: fields["SRStatus"],
      SR_Type: fields["SRType"],
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
                "/reports/PospReport/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActivePage
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

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

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
