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
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-policies-data",
  templateUrl: "./policies-data.component.html",
  styleUrls: ["./policies-data.component.css"],
})
export class PoliciesDataComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

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

  //selected
  ItemLOBSelection: any = [];

  Id: any;
  row: any;
  Documents: any;
  Type: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,

    private dialogRef: MatDialogRef<PoliciesDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.SearchForm = this.fb.group({
      Lob: [""],
      DateOrDateRange: [""],
      Company: [""],
      FinancialYear: [""],
      PolicyFileType: [""],
      PolicyType: [""],
      Source: [""],
      ProductType: [""],
      SearchValue: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm = this.fb.group({
      FinancialYear: ["", Validators.required],
      DateOrDateRange: [""],
      Source: [""],
      Lob: [""],
      PolicyFileType: [""],
      PolicyType: [""],
      ProductType: [""],
      Company: [""],
      SearchValue: [""],
    });

    this.SearchForm.get("FinancialYear").setValue([
      { Id: "2021-22", Name: "2021-22" },
    ]);

    this.Id = this.data.Id;
    this.Type = this.data.type;

    // console.log(this.Id);
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.Get();
    this.FilterDataType();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  FilterDataType() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/PolicyFilterType?User_Id=" + this.Id + "&User_Type=" + this.Type
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.GlobelLOB = result["Data"]["GlobelLOB"];
            this.Ins_Compaines = result["Data"]["Ins_Compaines"];
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];
            this.SRSource_Ar = [
              { Id: "BMS", Name: "Offline" },
              { Id: "Web", Name: "Online" },
              { Id: "Excel", Name: "Excel" },
            ];

            //  this.PolicyType = result['Data']['PolicyType'];
          } else {
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
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
          dtElement.dtInstance.then((dtInstance: any) => {
            var TablesNumber = `${dtInstance.table().node().id}`;
            if (TablesNumber == "Table1") {
              var fields = this.SearchForm.value;
              var DateOrDateRange = fields["DateOrDateRange"];
              var ToDate, FromDate;
              if (DateOrDateRange) {
                ToDate = DateOrDateRange[0];
                FromDate = DateOrDateRange[1];
              }
              var query = {
                User_Id: this.api.GetUserData("Id"),
                User_Type: this.api.GetUserType(),
                Lob: fields["Lob"],
                Company: fields["Company"],
                PolicyType: fields["PolicyType"],
                ProductType: fields["ProductType"],
                FinancialYear: fields["FinancialYear"],
                PolicyFileType: fields["PolicyFileType"],
                Source: fields["Source"],
                To_Date: this.api.StandrdToDDMMYYY(ToDate),
                From_Date: this.api.StandrdToDDMMYYY(FromDate),
                SearchValue: fields["SearchValue"],
              };
              // console.log(query);

              dtInstance
                .column(0)
                .search(this.api.encryptText(JSON.stringify(query)))
                .draw();
            }
          });
        }
      );
    }
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
                "/myaccount/PolicyDataFetch?User_Id=" +
                this.Id +
                "&User_Type=" +
                this.Type +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.Type
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;

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

  onItemSelect(item: any, Type: any) {
    // console.log("Type : " + Type);
    // console.log("onItemSelect", item);
    if (Type == "GlobelLOB") {
      this.ItemLOBSelection.push(item.Id);
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneSelect");
    }
  }
  onItemDeSelect(item: any, Type) {
    if (Type == "GlobelLOB") {
      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneDeSelect");
    }
  }
  GetProducts(Type) {
    // console.log(Type);
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", this.ItemLOBSelection.join());
    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("Globel/GetProductBms", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.PolicyFileType = this.removeDuplicates(
            result["Data"]["PolicyFileType"],
            "Id"
          );
          this.ProductType = result["Data"]["ProductType"];
          this.PolicyType = result["Data"]["PolicyType"];
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
  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
  removeDuplicates(originalArray, Id) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][Id]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  CloseModel() {
    this.dialogRef.close();
  }
}
