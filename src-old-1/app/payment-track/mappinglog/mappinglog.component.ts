import { AddNocComponent } from "./../../noc/add-noc/add-noc.component";
import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

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
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PosDetailsComponent } from "../../modals/pos-details/pos-details.component";
import { PoliciesDataComponent } from "../../modals/policies-data/policies-data.component";
import { DocumentsComponent } from "src/app/useragent/documents/documents.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  BookingDate: string;
  NetPremium: string;
  IssuedDate: string;
  GrossPremium: string;
  TotalFiles: string;
  TotalPremium: string;
  TotalMapped: number = 0;
  Totalnot: number = 0;
  TotalOther: number = 0;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-mappinglog",
  templateUrl: "./mappinglog.component.html",
  styleUrls: ["./mappinglog.component.css"],
})
export class MappinglogComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];
  TotalMapped: number = 0;
  Totalnot: number = 0;
  TotalOther: number = 0;

  ActivePage: string = "Default";

  SearchForm: FormGroup;

  isSubmitted = false;

  Ins_Compaines: any = [];
  GlobelLOB: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];
  filterrd: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;
  statusData: { Id: string; Name: string }[];
  Total: number;
  ErrorData: { Id: string; Name: string }[];
  ProductData: { Id: string; Name: string }[];
  InsurerData: any[];
  Difference_In_Days: number;
  custommessage: boolean = false;
  ConditonId: any;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm = this.fb.group({
      DateOrDateRange: ["", [Validators.required]],
      SearchValue: [""],
      Product: [""],
      ErrorType: [""],
      Insurer: [""],
    });

    this.ErrorData = [
      { Id: "Mapping", Name: "Mapping" },
      { Id: "Other", Name: "Other" },
    ];
    this.ProductData = [
      { Id: "1", Name: "TW" },
      { Id: "2", Name: "PC" },
      { Id: "3", Name: "PCV" },
      { Id: "4", Name: "GCV" },
      { Id: "5", Name: "MISC D" },
    ];
  }

  callcountsfunction(types) {
    var fields = this.SearchForm.value;
    var SearchValues = fields["SearchValue"];
    var Products = JSON.stringify(fields["Product"]);
    var ErrorTypes = JSON.stringify(fields["ErrorType"]);
    var Insurers = JSON.stringify(fields["Insurer"]);
    var DateOrDateRange = fields["DateOrDateRange"];
    var ToDate, FromDate;
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[1];
      FromDate = DateOrDateRange[0];
    }

    var formData = new FormData();
    formData.append("SearchValue", SearchValues);
    formData.append("Product", Products);
    formData.append("ErrorType", ErrorTypes);
    formData.append("Insurer", Insurers);

    formData.append(
      "ToDate",
      JSON.stringify(this.api.StandrdToDDMMYYY(ToDate))
    );
    formData.append(
      "FromDate",
      JSON.stringify(this.api.StandrdToDDMMYYY(FromDate))
    );

    this.api.IsLoading();
    this.api.HttpPostType("PaymentTrack/GetCountData/" + types, formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          if (types == "mapping") this.TotalMapped = result["Count"];
          else if (types == "not") this.Totalnot = result["Count"];
          else if (types == "other") this.TotalOther = result["Count"];
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

  SentMailDataRange(DateOrDateRanges) {
    var DateOrDateRange = DateOrDateRanges;

    var ToDate, FromDate;
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var date1 = new Date(ToDate);
    var date2 = new Date(FromDate);

    var Difference_In_Time = date2.getTime() - date1.getTime();
    this.Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return this.Difference_In_Days;
  }
  Reloads() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }
  updateDatas(make: any, model: any, variant: any, company: any, type: any) {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "PaymentTrack/GetInsurerFromLogUpdates/" +
          btoa(make) +
          "/" +
          btoa(model) +
          "/" +
          btoa(variant) +
          "/" +
          company +
          "/" +
          type
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Reloads();
            this.api.Toast("Success", result["Message"]);
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

  getinsurerdata() {
    this.api.IsLoading();
    this.api.HttpGetType("PaymentTrack/GetInsurerFromLog").then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.InsurerData = result["data"];
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

  ngOnInit() {
    this.ConditonId = this.api.GetUserData("Id");
    this.getinsurerdata();
    this.Get();
  }
  get formControls() {
    return this.SearchForm.controls;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    //  this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
  }
  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }
  ResetDT() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.search('').column(0).search('').draw();
    // });
  }
  // SearchBtn2() {
  //   this.isSubmitted = true;
  //   if (this.SearchForm.invalid) {
  //     return;
  //   } else {
  //     this.dtElements.forEach(
  //       (dtElement: DataTableDirective, index: number) => {
  //         dtElement.dtInstance.then((dtInstance: any) => {
  //           var TablesNumber = `${dtInstance.table().node().id}`;
  //           if (TablesNumber == "Table1") {
  //             var fields = this.SearchForm.value;
  //             var DateOrDateRange = fields["DateOrDateRange"];
  //             var ToDate, FromDate;
  //             if (DateOrDateRange) {
  //               ToDate = DateOrDateRange[1];
  //               FromDate = DateOrDateRange[0];
  //             }

  //             var dayscounts=this.SentMailDataRange(DateOrDateRange);

  //             this.custommessage=false;
  //             if(dayscounts>1 || dayscounts<0){

  //               this.custommessage=true;
  //               return false;
  //             }

  //             var query = {
  //               User_Id: this.api.GetUserData("Id"),
  //               User_Type: this.api.GetUserType(),
  //               To_Date: this.api.StandrdToDDMMYYY(ToDate),
  //               From_Date: this.api.StandrdToDDMMYYY(FromDate),
  //               SearchValue: fields["SearchValue"],
  //               Product: fields["Product"],
  //               ErrorType: fields["ErrorType"],
  //               Insurer: fields["Insurer"],
  //             };
  //             // console.log(query);

  //             dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
  //           }
  //         });
  //       }
  //     );
  //   }
  // }
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;
      if (DateOrDateRange) {
        ToDate = DateOrDateRange[1];
        FromDate = DateOrDateRange[0];
      }

      var dayscounts = this.SentMailDataRange(DateOrDateRange);

      this.custommessage = false;
      if (dayscounts > 1 || dayscounts < 0) {
        this.custommessage = true;
        return false;
      }

      var query = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
        SearchValue: fields["SearchValue"],
        Product: fields["Product"],
        ErrorType: fields["ErrorType"],
        Insurer: fields["Insurer"],
      };

      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      });
    }

    this.callcountsfunction("mapping");
    this.callcountsfunction("not");
    this.callcountsfunction("other");
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
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
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/PaymentTrack/MappingLogView?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.api.GetUserData("pos_type")
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;
            that.Total = resp.recordsFiltered;

            // that.TotalMapped = resp.TotalMapped;
            // that.Totalnot = resp.Totalnot;
            // that.TotalOther = resp.TotalOther;

            if (that.dataAr.length > 0) {
            }

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
