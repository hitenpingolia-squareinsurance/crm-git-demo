import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpHeaders, HttpClient, HttpResponse } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { stringify } from "querystring";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { V2PayInRequestUpdateComponent } from "../../modals/brokerage/v2-pay-in-request-update/v2-pay-in-request-update.component";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
  SqlWhere: any;
}

@Component({
  selector: "app-business-report",
  templateUrl: "./business-report.component.html",
  styleUrls: ["./business-report.component.css"],
})
export class BusinessReportComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];

  ActivePage: string = "Default";

  where: any;
  SearchForm: FormGroup;
  isSubmitted = false;
  isExport = false;

  Vertical_Ar: any = [];
  Region_Ar: any = [];
  Sub_Branch_Ar: any = [];
  Emps_Ar: any = [];
  Agents_Ar: any = [];
  Companies_Ar: any = [];
  Products_Ar: any = [];
  AccountsUser_Ar: any = [];
  MonthsYear_Ar: any = [];
  Year_Ar: any = [];

  dropdownSettings: any = [];
  ItemEmployeeSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select POS";

  DisableNextMonth: any;
  Remark: any = "";

  maxDate = new Date();
  minDate = new Date();

  CurrentYear: any;
  Is_Export: any = 0;

  DownloadUrl: any;
  sql: any;
  SQL: any;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    var d = new Date();
    this.CurrentYear = d.getFullYear();

    this.SearchForm = this.formBuilder.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      year: ["", Validators.required],
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.Get();
    this.FilterData();
    this.GetYear();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  GetYear() {
    let currentYear = new Date().getFullYear();
    let yearArray = [];
    for (let i = 0; i < 5; i++) {
      yearArray.push(currentYear - i);
    }
    this.Year_Ar = yearArray;
  }

  Get() {
    this.api.IsLoading();

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v3/pay-in/BusinessCommitment/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code")
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.where = resp.SqlWhere;
            this.api.HideLoading();
            if (this.isExport == true) {
              if (that.dataAr.length > 0) {
                if (that.where) {
                  this.Is_Export = 1;
                }
              }
            } else {
              this.isExport = true;
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

  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.SearchForm.get("Emp_Id").setValue(null);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);

    this.api.HttpPostTypeBms("sr/AgentTest/GetEmployees", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
          // console.log(this.Emps_Ar);
          this.Employee_Placeholder =
            "Select Employee (" + this.Emps_Ar.length + ")";
          this.Agents_Placeholder = "Select Agent";
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  GetSubBranches(e) {
    this.GetEmployees();
    const formData = new FormData();
    this.SearchForm.get("Sub_Region_Id").setValue("0");

    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "reports/AdminSrReport/GetSubBranches?Branch_Id=" +
          Branch_Id +
          "&User_Id=" +
          this.api.GetUserId(),
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Sub_Branch_Ar = result["Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();

          //alert(err.message);
        }
      );
  }

  GetAgents(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("RM_Ids", this.ItemEmployeeSelection.join());
    this.api.HttpPostTypeBms("sr/AgentTest/GetAgents", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Agents_Placeholder =
            "Select Agents (" + this.Agents_Ar.length + ")";
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      var query = {
        User_Id: this.api.GetUserId(),
        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],
        Emp_Id: fields["Emp_Id"],
        year: fields["year"],
        FromDate: fields["fromDate"],
        ToDate: fields["toDate"],
      };

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
  }

  ClearSearch() {
    this.Is_Export = 0;
    this.isExport == false;

    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");

    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.Products_Ar = [];

    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";

    this.ItemEmployeeSelection = [];

    this.dataAr = [];
    this.ResetDT();
    this.Is_Export = 0;
    this.isSubmitted = false;
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

  FilterData() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "../v3/pay-in/BusinessCommitment/SearchComponentsData?request_page=PO-Statment&Role=" +
          this.api.GetUserData("UserData") +
          "&User_Id=" +
          this.api.GetUserId(),
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.AccountsUser_Ar = result["Data"]["AccountsUser"];
            this.MonthsYear_Ar = result["Data"]["MonthsYear_Ar"];
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  export() {
    const formData = new FormData();
    formData.append("where", this.where);

    this.api
      .HttpPostTypeBms("../v3/pay-in/BusinessCommitment/export", formData)
      .then(
        (resp) => {
          window.open(resp["DownloadUrl"]);
          if (resp["Status"] == true) {
            this.Is_Export = 0;
          }
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  ViewPayoutRequest(Id, Type) {
    //alert(Id);

    const dialogRef = this.dialog.open(V2PayInRequestUpdateComponent, {
      width: "98%",
      height: "95%",
      //disableClose : true,
      data: { Id: Id, Type: Type, Bussiness_Month: "" },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
