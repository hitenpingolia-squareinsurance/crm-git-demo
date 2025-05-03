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
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EndosmentService } from "../endosment.service";
import { ViewEndorsementDetailsComponent } from "src/app/modals/view-endorsement-details/view-endorsement-details.component";

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
  SR_No: string;
  EncodedSrNo: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-create-endosment",
  templateUrl: "./create-endosment.component.html",
  styleUrls: ["./create-endosment.component.css"],
})
export class CreateEndosmentComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  searchForm: FormGroup;
  ActionType: any = "";

  isSubmitted = false;
  Is_Export: any = 0;

  GlobelType: any = [];
  BusniessType: any = [];
  PolicyType2: any = [];
  Ins_Compaines: any = [];
  GlobelLOB: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  SR_Session_Year: any = [];

  Company: any = [];

  UserTypesView: string;
  ItemLOBSelection: any = [];
  quotationId: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};
  currentUrl: string;
  TotalFiles: number;
  buttonDisable = false;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog,
    private sharedService: EndosmentService
  ) {
    this.searchForm = this.formBuilder.group({
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
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.createCancellationRequestsData();
    this.FilterDataType();
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
  createCancellationRequestsData() {
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
                "/b-crm/PolicyCommon/getPolicyDataCommon?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.buttonDisable = false;

            if (that.dataAr.length > 0) {
              that.TotalFiles = resp.TotalFiles;
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

  //===== FILTER DATA =====//
  filterData() {
    this.buttonDisable = true;

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.searchForm.value;
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
          ProductType: fields["ProductType"],
          BusniessType: fields["BusniessType"],
          PolicyType: fields["PolicyType"],
          Company: fields["Company"],
          FinancialYear: "2021-22",
          To_Date: this.api.StandrdToDDMMYYY(ToDate),
          From_Date: this.api.StandrdToDDMMYYY(FromDate),
          SearchValue: fields["SearchValue"],
        };
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      }
    });
  }

  //===== FETCH FILTER DATA =====//
  FilterDataType() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/PolicyFilterType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.GlobelLOB = result["Data"]["GlobelLOB"];
            this.Ins_Compaines = result["Data"]["Ins_Compaines"];
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];

            this.PolicyType = result["Data"]["PolicyType"];
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

  //===== ON ITEM SELECT =====//
  onItemSelect(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onItemSelect', item);
    if (Type == "GlobelLOB") {
      this.ItemLOBSelection.push(item.Id);
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneSelect");
    }
  }

  //===== ON ITEM DESELECT =====//
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

  //===== ON ITEM SELECT DESLECT =====//
  GetProducts(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", this.ItemLOBSelection.join());

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

  //===== REMOVE DUPLICATES =====//
  removeDuplicates(originalArray: any, Id: any) {
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

  SearchOnkeyup(Type: any) {
    this.PolicyType2 = Type.target.value;
    this.createCancellationRequestsData();
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.searchForm.reset();
    this.createCancellationRequestsData();
    this.Is_Export = 0;
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== OPEN FORM MODAL =====//
  // openDialog(qid: any) {
  //   this.quotationId = qid;
  //   const dialogConfig = this.dialog.open(AddRequestModalComponent, {
  //    width: '50%',
  //    height: '45%',
  //    data: { qid: qid }
  //   });

  //   dialogConfig.afterClosed().subscribe(result => {
  //   });

  // }

  //===== VIEW DOCUMENTS ====//
  ViewDocument(name: any) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  setVall(value: any) {
    this.sharedService.setOption(value);
    this.router.navigate(["endosment/details-form"]);
  }

  ViewEndrosmentUsingSrNo(srno: any) {
    const dialogRef = this.dialog.open(ViewEndorsementDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: srno },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
