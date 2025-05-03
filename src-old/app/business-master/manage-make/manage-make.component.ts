import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

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
  selector: "app-manage-make",
  templateUrl: "./manage-make.component.html",
  styleUrls: ["./manage-make.component.css"],
})
export class ManageMakeComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

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
  statusData: { Id: string; Name: string }[];
  Total: number;
  SubClassData: unknown;
  ProductData: { Id: string; Name: string }[];

  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.SearchForm = this.fb.group({
      Product: [""],
      SearchMake: [""],
      SearchModel: [""],
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

    this.ProductData = [
      { Id: "1", Name: "TW" },
      { Id: "2", Name: "PC" },
      { Id: "3", Name: "PCV" },
      { Id: "4", Name: "GCV" },
      { Id: "5", Name: "Misc D" },
    ];
  }

  ngOnInit() {
    this.Get();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  ViewSubClass() {
    const formData = new FormData();
    var fields = this.SearchForm.value;

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Product", fields["Product"]["0"]["Name"]);

    this.api
      .HttpPostTypeBms("../v2/business_master/Data/ViewSubClass", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.SubClassData = result["Data"];
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  ClearSearch() {
    this.SearchForm.reset();
    this.ResetDT();
    this.SearchBtn();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      this.datatableElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;
        if (TablesNumber == "kt_datatable") {
          var fields = this.SearchForm.value;

          var query = {
            User_Id: this.api.GetUserData("Id"),
            User_Type: this.api.GetUserType(),
            Product: fields["Product"],
            SearchMake: fields["SearchMake"],
            SearchModel: fields["SearchModel"],
          };
          // console.log(query);

          dtInstance
            .column(0)
            .search(this.api.encryptText(JSON.stringify(query)))
            .draw();
        }
        this.Get();
      });
    }
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  Get() {
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
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v2/business_master/Data/FetchDataManageSubClassMissingMakeModel?User_Id=" +
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

            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;
            console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;
            that.Total = resp.recordsFiltered;

            if (that.dataAr.length > 0) {
              this.ViewSubClass();
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

  UpdateSubClass(Value, Id) {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("subclass", Value);
    formData.append("SquareId", Id);
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api
        .HttpPostTypeBms(
          "../v2/business_master/Data/UpdateSubclassSquare",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            // this.Reload();

            if (result["status"] == 1) {
              this.Reload();
              this.api.Toast("Success", result["msg"]);
            } else {
              const msg = "msg";
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  //===== ON ITEM SELECT =====//
  onItemSelect(item: any, Type: any, Id: any) {
    if (Type == "SubClass") {
      var Value = item.Id;
      // console.log(Value, Id);
      this.UpdateSubClass(Value, Id);
    }
  }

  //===== ON ITEM DeSELECT =====//
  onItemDeSelect(item: any, Type: any) {
    // // console.log('Type : '+ Type);
    // // console.log('onDeSelect', item);

    if (Type == "SubClass") {
      var Value = item.Id;
    }
  }
}
